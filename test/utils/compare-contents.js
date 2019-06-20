"use strict";

const { readFile } = require("../../lib/read-file");
const { expect } = require("chai");

module.exports = compareContents;

/**
 * Compares the given file contents to the expected contents.
 */
async function compareContents (actualContents, fileName) {
  let expectedContents = await readFile(`test/fixtures/modified/${fileName}`, "utf8");
  expect(actualContents).to.equal(expectedContents);
}
