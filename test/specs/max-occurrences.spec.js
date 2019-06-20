"use strict";

const processFile = require("../utils/process-file");
const compareContents = require("../utils/compare-contents");

describe("options.maxOccurrences", () => {

  it("should do nothing if maxOccurrences is zero", async () => {
    let { contents } = await processFile("png-and-svg.html", { maxOccurrences: 0 });
    await compareContents(contents, "png-and-svg-unchanged.html");
  });

  it("should do nothing if every SVG occurs more than maxOccurrences", async () => {
    let { contents } = await processFile("many-svgs.html", { maxOccurrences: 10 });
    await compareContents(contents, "many-svgs-unchanged.html");
  });

});
