"use strict";

const processFile = require("../utils/process-file");
const compareContents = require("../utils/compare-contents");

describe("options.optimize", () => {

  it("should not optimize SVGs if set to false", async () => {
    let { contents } = await processFile("png-and-svg.html", { optimize: false });
    await compareContents(contents, "png-and-svg-inlined-3kb-limit.html");
  });

  it("should not optimize even large SVGs if set to false", async () => {
    let { contents } = await processFile("png-and-svg.html", { optimize: false, maxImageSize: Infinity });
    await compareContents(contents, "png-and-svg-inlined-all.html");
  });

  it("should optimize SVGs with custom options", async () => {
    let { contents } = await processFile("png-and-svg.html", {
      optimize: {
        plugins: [
          { removeAttrs: { attrs: "(stroke|fill)" }},
        ]
      }
    });

    await compareContents(contents, "png-and-svg-inlined-customized-3kb-limit.html");
  });

});
