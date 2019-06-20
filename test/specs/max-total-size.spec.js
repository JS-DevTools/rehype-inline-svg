"use strict";

const processFile = require("../utils/process-file");
const compareContents = require("../utils/compare-contents");

describe("options.maxTotalSize", () => {

  it("should do nothing if maxTotalSize is zero", async () => {
    let { contents } = await processFile("png-and-svg.html", { maxTotalSize: 0 });
    await compareContents(contents, "png-and-svg-unchanged.html");
  });

  it("should inline all small SVGs if maxTotalSize is Infinity", async () => {
    let { contents } = await processFile("many-svgs.html", { maxTotalSize: Infinity });
    await compareContents(contents, "many-svgs-inlined-optimized-no-max-total-size.html");
  });

  it("should inline all SVGs if maxTotalSize and maxImageSize are both Infinity", async () => {
    let { contents } = await processFile("many-svgs.html", { maxImageSize: Infinity, maxTotalSize: Infinity });
    await compareContents(contents, "many-svgs-inlined-optimized-all.html");
  });

});
