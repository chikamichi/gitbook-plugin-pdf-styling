var fs = require('fs');
var path = require('path');
var Q = require('q');
var _ = require('lodash');

var execAsync = require('../../utils/exec_async');
var stringUtils = require('../../utils/string');

var bin = {
  pdftk: __dirname + "/../../bin/pdftk"
};

function setBackground() {
  var book = this;

  return execAsync.call(book, [
    bin.pdftk,
    path.join(book.options.output, 'index.prepost.pdf'),
    'background',
    path.join(stringUtils.escapeSpaces(book.root), 'images', 'bg.pdf'),
    'output',
    path.join(book.options.output, 'index.pdf')
  ]);
}

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
