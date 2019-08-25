"use strict";

const { readFile } = require("../../lib/read-file");
const { expect } = require("chai");

module.exports = compareContents;

/**
 * Compares the given file contents to the expected contents.
 */
async function compareContents (actualContents, fileName) {
  let expectedContents = await readFile(`test/fixtures/modified/${fileName}`, "utf8");

  // Split both files into separate lines
  let actualLines = actualContents.split("\n").filter(Boolean);
  let expectedLines = expectedContents.split("\n").filter(Boolean);

  let lineCount = Math.max(actualLines.length, expectedLines.length);
  let chunkSize = 50;

  // Compare each line
  for (let i = 0; i < lineCount; i++) {
    let actual = actualLines[i];
    let expected = expectedLines[i];

    // Compare the lines in small chunks, since inlined SVGs can be huuuuuge,
    // which makes it hard to see the differences when there are mismatches
    let offset = 0;
    while (actual.length > offset || expected.length > offset) {
      let actaulChunk = actual.slice(offset, offset + chunkSize);
      let expectedChunk = expected.slice(offset, offset + chunkSize);

      expect(actaulChunk).to.equal(expectedChunk, `Line #${i + 1} does not match line #${i + 1} of ${fileName}`);
      offset += chunkSize;
    }
  }
}
