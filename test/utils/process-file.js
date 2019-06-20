"use strict";

const inlineSVG = require("../../");
const unified = require("unified");
const parse = require("rehype-parse");
const stringify = require("rehype-stringify");
const vfile = require("to-vfile");
const fs = require("fs");

module.exports = processFiles;

before("Create the .tmp directory", () => {
  if (!fs.existsSync("test/fixtures/.tmp")) {
    fs.mkdirSync("test/fixtures/.tmp");
  }
});

/**
 * Processes one or more HTML files using Rehype and the Inline SVG plugin
 */
async function processFiles (fileNames, options) {
  let processor = unified()
    .use(parse)
    .use(inlineSVG, options)
    .use(stringify);

  if (Array.isArray(fileNames)) {
    let files = [];

    for (let fileName of fileNames) {
      let file = await processFile(fileName, processor);
      files.push(file);
    }

    return files;
  }
  else {
    return processFile(fileNames, processor);
  }
}

/**
 * Processes the specified HTML file using the given Rehype instance
 */
async function processFile (fileName, processor) {
  let file = await vfile.read(`test/fixtures/originals/${fileName}`);
  file = await processor.process(file);

  // Save the modified file to the ".tmp" directory
  let tmpFilePath = `test/fixtures/.tmp/${fileName}`;
  await vfile.write({ path: tmpFilePath, contents: file.contents });

  return file;
}
