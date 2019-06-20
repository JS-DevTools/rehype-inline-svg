"use strict";

const processFile = require("../utils/process-file");
const compareContents = require("../utils/compare-contents");

describe("defaults", () => {

  it("should do nothing if there are no images", async () => {
    let { contents } = await processFile("no-images.html");
    await compareContents(contents, "no-images-unchanged.html");
  });

  it("should do nothing if there are no SVGs", async () => {
    let { contents } = await processFile("no-svgs.html");
    await compareContents(contents, "no-svgs-unchanged.html");
  });

  it("should inline and optimize SVGs under 3kb", async () => {
    let { contents } = await processFile("png-and-svg.html");
    await compareContents(contents, "png-and-svg-inlined-optimized-3kb-limit.html");
  });

  it("should not inline SVGs with a total size over 10kb", async () => {
    let { contents } = await processFile("many-svgs.html");
    await compareContents(contents, "many-svgs-inlined-optimized-10kb-total-limit.html");
  });

});
