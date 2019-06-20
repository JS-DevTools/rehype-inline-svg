import * as path from "path";
import { Processor, Transformer } from "unified";
import { Node, Parent } from "unist";
import { VFile } from "vfile";
import { SvgCache } from "./cache";
import { GroupedImageNodes, ImageNode, isImageNode } from "./image-node";
import { imgToSVG } from "./img-to-svg";
import { applyDefaults, Options } from "./options";

/**
 * This is a Rehype plugin that finds SVG `<img>` elements and replaces them with inlined `<svg>` elements.
 * It also minimizes the SVG to avoid adding too much size to the page.
 */
export function inlineSVG(this: Processor, config?: Partial<Options>): Transformer {
  let options = applyDefaults(config);
  let svgCache = new SvgCache();
  let hits = 0, misses = 0;

  // @ts-ignore
  return async function transformer(tree: Node, file: VFile): Promise<Node> {
    if (!file.path) {
      throw new Error("Cannot inline SVG images because the path of the HTML file is unknown");
    }

    // Find all SVG <img> nodes
    let imgNodes = findSvgNodes(tree);

    // Group the nodes by file path
    let groupedNodes = groupSvgNodes(imgNodes, file);

    // Read (and optimize) the SVG files
    await svgCache.read(groupedNodes, options.optimize);

    // Filter out any images that don't match the options
    groupedNodes = filterSvgNodes(groupedNodes, svgCache, options);

    // Replace the <img> nodes as <svg> nodes
    imgToSVG(groupedNodes, svgCache);

    // Log any changes in cache efficiency data
    if (svgCache.hits !== hits || svgCache.misses !== misses) {
      ({ hits, misses } = svgCache);
      options.cacheEfficiency({ hits, misses });
    }

    return tree;
  };
}

/**
 * Recursively crawls the HAST tree and finds all SVG `<img>` elements
 */
function findSvgNodes(node: Node): ImageNode[] {
  let imgNodes: ImageNode[] = [];

  if (isImageNode(node) && node.properties.src.endsWith(".svg")) {
    imgNodes.push(node);
  }

  if (node.children) {
    let parent = node as Parent;
    for (let child of parent.children) {
      imgNodes.push(...findSvgNodes(child));
    }
  }

  return imgNodes;
}

/**
 * Reads the contents of all unique SVG images and returns a map of file paths
 */
function groupSvgNodes(imgNodes: ImageNode[], htmlFile: VFile): GroupedImageNodes {
  let groupedNodes: GroupedImageNodes = new Map();

  for (let imgNode of imgNodes) {
    // Resolve the SVG file path from the HTML file path
    let imagePath = path.resolve(htmlFile.dirname!, imgNode.properties.src);

    let group = groupedNodes.get(imagePath);
    if (!group) {
      // We found a new SVG file, so create a new group
      groupedNodes.set(imagePath, [imgNode]);
    }
    else {
      // Add this <img> node to the existing group for this file
      group.push(imgNode);
    }
  }

  return groupedNodes;
}

/**
 * Returns only the SVG nodes that meet the filter critera.
 */
function filterSvgNodes(groupedNodes: GroupedImageNodes, svgCache: SvgCache, options: Options) {
  let filteredNodes: GroupedImageNodes = new Map();

  for (let [filePath, imgNodes] of groupedNodes) {
    if (imgNodes.length > options.maxOccurrences) {
      // This SVG image occurs too many times in the same file, so don't inline it
      continue;
    }

    let fileSize = svgCache.get(filePath)!.length;
    if (fileSize > options.maxImageSize) {
      // This SVG image is too large, so don't inline it
      continue;
    }

    let totalSize = imgNodes.length * fileSize;
    if (totalSize > options.maxTotalSize) {
      // The total size of all occurrences of the SVG image is too large, so don't inline it
      continue;
    }

    // This SVG meets all the criteria, so inline it
    filteredNodes.set(filePath, imgNodes);
  }

  return filteredNodes;
}
