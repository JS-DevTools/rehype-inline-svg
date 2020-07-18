import { inlineSVG } from "./inline-svg";

export { CacheEfficiency, Options } from "./options";
export { inlineSVG };

// Export `inlineSVG` as the default export
export default inlineSVG;

// CommonJS default export hack
/* eslint-env commonjs */
if (typeof module === "object" && typeof module.exports === "object") {
  module.exports = Object.assign(module.exports.default, module.exports);
}
