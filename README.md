# Inline SVG plugin for rehype
A [rehype](https://github.com/rehypejs/rehype) plugin that inlines and optimizes SVG images

[![Cross-Platform Compatibility](https://jstools.dev/img/badges/os-badges.svg)](https://github.com/JS-DevTools/rehype-inline-svg/blob/master/.github/workflows/CI-CD.yaml)
[![Build Status](https://github.com/JS-DevTools/rehype-inline-svg/workflows/CI-CD/badge.svg)](https://github.com/JS-DevTools/rehype-inline-svg/blob/master/.github/workflows/CI-CD.yaml)

[![Coverage Status](https://coveralls.io/repos/github/JS-DevTools/rehype-inline-svg/badge.svg?branch=master)](https://coveralls.io/github/JS-DevTools/rehype-inline-svg)
[![Dependencies](https://david-dm.org/JS-DevTools/rehype-inline-svg.svg)](https://david-dm.org/JS-DevTools/rehype-inline-svg)

[![npm](https://img.shields.io/npm/v/@jsdevtools/rehype-inline-svg.svg)](https://www.npmjs.com/package/@jsdevtools/rehype-inline-svg)
[![License](https://img.shields.io/npm/l/@jsdevtools/rehype-inline-svg.svg)](LICENSE)



Features
--------------------------
- Replaces SVG `<img>` tags with inlined `<svg>` tags
  - Reduces extra HTTP requests to fetch tiny SVG files
  - Gives you [fine-grained control of images using CSS](https://css-tricks.com/using-svg/#article-header-id-7)
- Optimizes SVGs using [svgo](https://github.com/svg/svgo#readme)
  - Minimizes download size
  - Removes extra metadata that is added by image editors
- Caches file reads
  - Each `.svg` file is only read from disk _once_ and optimized _once_
  - Improves processing speed when images occur multiple times on a page
  - Improves processing speed when processing multiple HTML pages



Example
--------------------------
This example uses [to-vfile](https://github.com/vfile/to-vfile) to read an HTML file and process it using [unified](https://unifiedjs.com/), [rehype-parse](https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse), and [rehype-stringify](https://github.com/rehypejs/rehype/tree/master/packages/rehype-stringify).

**index.html**

```html
<html>
  <body>
    <img src="img/icon.svg" alt="some icon">
  </body>
</html>
```

**example.js**

```javascript
const unified = require("unified");
const parse = require("rehype-parse");
const inlineSVG = require("@jsdevtools/rehype-inline-svg");
const stringify = require("rehype-stringify");
const vfile = require("to-vfile");

async function example() {
  // Create a Rehype processor with the Inline SVG plugin
  const processor = unified()
    .use(parse)
    .use(inlineSVG)
    .use(stringify);

  // Read an HTML file that contains SVG images
  let originalFile = await vfile.read("index.html");

  // Process the file, inlining and optimizing SVG images
  let modifiedFile = await processor.process(originalFile);

  // The result is HTML with inlined <svg> elements
  console.log(modifiedFile.contents);

  // <html>
  //   <body>
  //     <svg alt="some icon" viewBox="0 0 48 48"><path d="M5 24c0...
  //   </body>
  // </html>
}
```



Installation
--------------------------
You can install Rehype Inline SVG via [npm](https://docs.npmjs.com/about-npm/).

```bash
npm install @jsdevtools/rehype-inline-svg
```

You'll probably want to install [unified](https://unifiedjs.com/), [rehype-parse](https://github.com/rehypejs/rehype/tree/master/packages/rehype-parse), [rehype-stringify](https://github.com/rehypejs/rehype/tree/master/packages/rehype-stringify), and [to-vfile](https://github.com/vfile/to-vfile) as well.

```bash
npm install unified rehype-parse rehype-stringify to-vfile
```



Usage
--------------------------
Using the Inline SVG plugin requires an understanding of how to use Unified and Rehype. [Here is an excelleng guide](https://unifiedjs.com/using-unified.html) to learn the basics.

The Inline SVG plugin works just like any other Rehype plugin. Pass it to [the `.use()` method](https://github.com/unifiedjs/unified#processoruseplugin-options), optionally with an [options object](#options).

```javascript
const unified = require("unified");
const inlineSVG = require("@jsdevtools/rehype-inline-svg");

// Use the Inline SVG plugin with its default options
unified().use(inlineSVG);

// Use the Inline SVG plugin with custom options
unified().use(inlineSVG, {
  maxImageSize: 5000,          // Don't inline SVGs larger than 5 kb
  maxTotalFileSize: 25000,    // 25 kb limit for all occurrences of each SVG
  optimize: false,            // Don't optimize SVGs
});
```



Options
--------------------------
Rehype Inline SVG supports the following options:

|Option            |Type                 |Default     |Description
|:-----------------|:--------------------|:-----------|:-----------------------------------------
|`maxImageSize`    |`number`             |`3000`      |The maximum image size (in bytes) to inline. Images that are larger than this (after optimization) will not be inlined.<br><br>Defaults to ~3 kilobytes.
|`maxOccurrences`  |`number`             |`Infinity`  |The maximum number of times that the same image can appear on a page and still be inlined. Images that occur more than this number of times will not be inlined.
|`maxTotalSize`    |`number`             |`10000`     |The maximum total size (in bytes) of all occurrences of a single image. If `maxTotalSize` is 10kb and a 2kb image occurs 5 times on a page, then all five occurrences will be inlined. But if the image accurs 6 or more times, then none of them will be inlined.<br><br>Defaults to ~10 kilobytes.
|`optimize`        |`boolean` or `object`|`true`      |[SVG optimization options](https://github.com/svg/svgo). If `false`, then SVGs will not be optimized. If `true`, then the default optimization options will be used.



Contributing
--------------------------
Contributions, enhancements, and bug-fixes are welcome!  [File an issue](https://github.com/JS-DevTools/rehype-inline-svg/issues) on GitHub and [submit a pull request](https://github.com/JS-DevTools/rehype-inline-svg/pulls).

#### Building
To build the project locally on your computer:

1. __Clone this repo__<br>
`git clone https://github.com/JS-DevTools/rehype-inline-svg.git`

2. __Install dependencies__<br>
`npm install`

3. __Build the code__<br>
`npm run build`

4. __Run the tests__<br>
`npm test`



License
--------------------------
Rehype Inline SVG is 100% free and open-source, under the [MIT license](LICENSE). Use it however you want.



Big Thanks To
--------------------------
Thanks to these awesome companies for their support of Open Source developers ❤

[![Travis CI](https://jstools.dev/img/badges/travis-ci.svg)](https://travis-ci.com)
[![SauceLabs](https://jstools.dev/img/badges/sauce-labs.svg)](https://saucelabs.com)
[![Coveralls](https://jstools.dev/img/badges/coveralls.svg)](https://coveralls.io)
