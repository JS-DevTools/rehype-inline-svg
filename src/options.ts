import * as SVGO from "svgo";

/**
 * Options for the Inline SVG plugin.
 */
export interface Options {
  /**
   * The maximum image size (in bytes) to inline.
   * Images that are larger than this (after optimization) will not be inlined.
   *
   * Defaults to 3000 (3 kilobytes).
   */
  maxImageSize: number;

  /**
   * The maximum number of times that the same image can appear on a page and still be inlined.
   * Images that occur more than this number of times will not be inlined.
   *
   * Defaults to `Infinity`.
   */
  maxOccurrences: number;

  /**
   * The maximum total size (in bytes) of all occurrences of a single image.
   * If `maxTotalSize` is 10kb and a 2kb image occurs 5 times on a page, then all five occurrences
   * will be inlined. But if the image accurs 6 or more times, then none of them will be inlined.
   *
   * Defaults to 10000 (10 kilobytes).
   */
  maxTotalSize: number;

  /**
   * SVG optimization options. If `false`, then SVGs will not be optimized.
   *
   * Defaults to `true`.
   */
  optimize: boolean | SVGO.Options;

  /**
   * A callback function that receives cache efficiency information.
   */
  cacheEfficiency(results: CacheEfficiency): void;
}

/**
 * Information about the efficiency of the Inline SVG plugin's cache.
 */
export interface CacheEfficiency {
  /**
   * The number of times a file was read from the cache rather than from disk.
   */
  hits: number;

  /**
   * The number of times a file had to be read from disk because it was not in the cache.
   */
  misses: number;
}

/**
 * Applies default values for any unspecified options
 */
export function applyDefaults(config: Partial<Options> = {}): Options {
  return {
    maxImageSize: config.maxImageSize === undefined ? 3000 : config.maxImageSize,
    maxOccurrences: config.maxOccurrences === undefined ? Infinity : config.maxOccurrences,
    maxTotalSize: config.maxTotalSize === undefined ? 10000 : config.maxTotalSize,
    optimize: config.optimize === undefined ? true : config.optimize,
    cacheEfficiency: config.cacheEfficiency || (() => undefined),
  };
}
