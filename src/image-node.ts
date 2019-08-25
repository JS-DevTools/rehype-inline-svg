import { Node } from "unist";

/**
 * An `<img>` HAST node
 */
export interface ImageNode extends Node {
  type: "element";
  tagName: "img";
  properties: {
    src: string;
  };
}

/**
 * An `<svg>` HAST node
 */
export interface SvgNode extends Node {
  type: "element";
  tagName: "svg";
  properties?: {
    [key: string]: string;
  };
}

/**
 * A Map of image file paths and all the <img> nodes that reference that file
 */
export type GroupedImageNodes = Map<string, ImageNode[]>;

/**
 * A tuple containing an image file path and all the <img> nodes that reference that file
 */
export type ImageNodeGroup = [string, ImageNode[]];

/**
 * Determines whether the given HAST node is an `<img>` element.
 */
export function isImageNode(node: Node): node is ImageNode {
  let img = node as ImageNode;
  return img.type === "element" &&
    img.tagName === "img" &&
    img.properties &&
    typeof img.properties.src === "string";
}

/**
 * Determines whether the given HAST node is an `<svg>` element.
 */
export function isSvgNode(node: Node): node is SvgNode {
  let svg = node as SvgNode;
  return svg.type === "element" && svg.tagName === "svg";
}
