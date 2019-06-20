"use strict";

const processFile = require("../utils/process-file");
const compareContents = require("../utils/compare-contents");

describe("options.maxImageSize", () => {

  it("should do nothing if maxImageSize is zero", async () => {
    let { contents } = await processFile("png-and-svg.html", { maxImageSize: 0 });
    await compareContents(contents, "png-and-svg-unchanged.html");
  });

  it("should do nothing if all SVGs exceed the maxImageSize", async () => {
    let { contents } = await processFile("png-and-svg.html", { maxImageSize: 300 });
    await compareContents(contents, "png-and-svg-unchanged.html");
  });

  it("should inline and optimize all SVGs if maxImageSize is Infinity", async () => {
    let { contents } = await processFile("png-and-svg.html", { maxImageSize: Infinity });
    await compareContents(contents, "png-and-svg-inlined-optimized-all.html");
  });

});
