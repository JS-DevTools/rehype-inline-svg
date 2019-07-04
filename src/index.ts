import { inlineSVG } from "./inline-svg";

export { CacheEfficiency, Options } from "./options";
export { inlineSVG };

// Export `inlineSVG` as the default export
// tslint:disable: no-default-export
export default inlineSVG;

// CommonJS default export hack
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);  // tslint:disable-line: no-unsafe-any
}
