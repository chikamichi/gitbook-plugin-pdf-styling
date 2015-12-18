/**
 * **Handles background-related post-processing**.
 *
 * @module post-processing/background
 */

var fs = require('fs');
var path = require('path');
var Q = require('q');
var _ = require('lodash');
var tmp = require('tmp');

var execAsync = require('../../utils/exec').async;
var stringUtils = require('../../utils/string');

var bin = {
  pdftk: __dirname + "/../../bin/pdftk"
};

function setBackground() {
  var book = this;

  book.log.info('setting the background ....');

  var output = tmp.tmpNameSync({
    dir: book.options.pdfStyling.output,
    template: 'index.XXXXXX.pdf'
  });

  return execAsync.call(book, [
    bin.pdftk,
    path.join(book.options.pdfStyling.output, book.options.pdfStyling.last),
    'background',
    path.join(stringUtils.escapeSpaces(book.root), 'images', 'bg.pdf'),
    'output',
    path.join(book.options.pdfStyling.output, output)
  ], function() {
    book.options.pdfStyling.last = output;
    book.log.info.ok();
  });
}

/**
 * Trigger all background post-processings.
 */
function run(cfg) {
  var book = this;

  return Q()
  .then(function() {
    if (!cfg) throw new Error('No background post-processing specified.');

    // TODO: use `convert` to pre-render the background layer as a PDF before
    // calling setImages, if provided with a non-PDF asset.
    return setBackground.call(book);
  })
}

module.exports = {
  run: run
}
