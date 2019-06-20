"use strict";

const processFile = require("../utils/process-file");
const compareContents = require("../utils/compare-contents");
const { expect } = require("chai");

describe("options.cacheEfficiency", () => {
  let efficiencyData = [];

  function cacheEfficiency (data) {
    efficiencyData.push(data);
  }

  beforeEach("Reset efficiencyData", () => {
    efficiencyData = [];
  });

  it("should not report any cache efficiency if there are no images", async () => {
    let { contents } = await processFile("no-images.html", { cacheEfficiency });

    expect(efficiencyData).to.deep.equal([]);
    await compareContents(contents, "no-images-unchanged.html");
  });

  it("should not report any cache efficiency if there are no SVGs", async () => {
    let { contents } = await processFile("no-svgs.html", { cacheEfficiency });

    expect(efficiencyData).to.deep.equal([]);
    await compareContents(contents, "no-svgs-unchanged.html");
  });

  it("should report no hits and all misses if SVGs only occur once", async () => {
    let { contents } = await processFile("png-and-svg.html", { cacheEfficiency });

    expect(efficiencyData).to.deep.equal([
      { hits: 0, misses: 5 },
    ]);

    await compareContents(contents, "png-and-svg-inlined-optimized-3kb-limit.html");
  });

  it("should report many hits and few misses if SVGs occurs many times", async () => {
    let { contents } = await processFile("many-svgs.html", { cacheEfficiency });

    expect(efficiencyData).to.deep.equal([
      { hits: 95, misses: 5 },
    ]);

    await compareContents(contents, "many-svgs-inlined-optimized-10kb-total-limit.html");
  });

  it("should re-use the cache when processing multiple files with the same instance of the Inline SVG plugin", async () => {
    let files = await processFile(["many-svgs.html", "png-and-svg.html", "many-svgs.html"], { cacheEfficiency });

    expect(efficiencyData).to.deep.equal([
      { hits: 95, misses: 5 },
      { hits: 100, misses: 5 },
      { hits: 200, misses: 5 },
    ]);

    await compareContents(files[0].contents, "many-svgs-inlined-optimized-10kb-total-limit.html");
    await compareContents(files[1].contents, "png-and-svg-inlined-optimized-3kb-limit.html");
    await compareContents(files[2].contents, "many-svgs-inlined-optimized-10kb-total-limit.html");
  });

  it("should not re-use the cache for separate instances of the Inline SVG plugin", async () => {
    let file1 = await processFile("many-svgs.html", { cacheEfficiency });
    let file2 = await processFile("many-svgs.html", { cacheEfficiency });

    expect(efficiencyData).to.deep.equal([
      { hits: 95, misses: 5 },
      { hits: 95, misses: 5 },
    ]);

    await compareContents(file1.contents, "many-svgs-inlined-optimized-10kb-total-limit.html");
    await compareContents(file2.contents, "many-svgs-inlined-optimized-10kb-total-limit.html");
  });

});
