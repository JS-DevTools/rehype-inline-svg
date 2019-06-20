import * as fs from "fs";
import * as SVGO from "svgo";
import { GroupedImageNodes, ImageNodeGroup } from "./image-node";

/**
 * A cache of the contents of of SVG files. This saves us from reading the same files
 * many times when the file occurs multiple times on one page, or across multiple pages.
 */
export class SvgCache extends Map<string, string> {
  private _hits = 0;
  private _misses = 0;
  private _queue: Array<Promise<void>> = [];

  public get hits(): number {
    return this._hits;
  }

  public get misses(): number {
    return this._misses;
  }

  /**
   * Reads the contents of any SVG files that aren't already in the cache,
   * and adds them to the cache.
   */
  public async read(groupedNodes: GroupedImageNodes, optimize: boolean | SVGO.Options): Promise<void> {
    // Create an SVG Optimizer, if necessary
    let svgo = optimize && new SVGO(optimize === true ? undefined : optimize);

    // Queue-up any files that aren't already in the cache
    let promises = [...groupedNodes].map((group) => this._readFile(group, svgo));
    let queued = this._queue.push(...promises);

    // Wait for all queued files to be read
    await Promise.all(this._queue);

    // Remove the fulfilled items from the queue
    this._queue = this._queue.slice(queued);
  }

  /**
   * Reads the specified SVG file and returns its contents
   */
  private async _readFile(group: ImageNodeGroup, optimizer: SVGO | false): Promise<void> {
    let [path, nodes] = group;

    if (this.has(path)) {
      // Woot!  We just saved unnecessary file reads!
      this._hits += nodes.length;
      return;
    }

    // Immediately add this path to the cache, to avoid multiple reads of the same file
    this.set(path, "");
    this._misses++;
    this._hits += (nodes.length - 1);

    // Read the SVG file
    let content = await fs.promises.readFile(path, "utf8");

    // Optimize the contents, if enabled
    if (optimizer) {
      let optimized = await optimizer.optimize(content, { path });
      content = optimized.data;
    }

    // Ensure that we didn't accidentally read the same file multiple times
    if (this.get(path)!.length > 0) {
      throw new Error(`SvgCache encountered a race conditmion. ${path} was read multiple times.`);
    }

    // Cache the SVG content
    this.set(path, content);
  }
}
