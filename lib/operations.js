/**
 * **Utilities for tweaking images and pdf documents.**
 *
 * All functions expect their context to be set to the book instance.
 *
 * @module utils/operations
 */

var path = require('path');

var Q = require('q');
var _ = require('lodash');

var execAsync = require('../utils/exec').async;
// It's weird having those functions relying on string utilities, so it's time
//  to extract path resolution to its own module ^^
var stringUtils = require('../utils/string');

var bin = {
  pdftk: __dirname + "/../bin/pdftk"
};



/*** Public API ***/

var Operations = function(book) {
  this.book = book;
  _.bindAll(this);
};

/**
 * Identify the format of the book, as available at the current stage of the
 * post-processing.
 */
Operations.prototype.identifyFormat = function() {
  var that = this;

  return execAsync.call(this.book, [
    'identify -format "%wx%h\n"',
    path.join(this.book.options.pdfStyling.output, this.book.options.pdfStyling.last),
    '| tail -n1'
  ])
  .then(function(geometry) {
    that.book.log.info.ln('GEOMETRY', geometry);
    return geometry;
  });
};

Operations.prototype.bgAsNewPage = function(geometry, inputImagePath, position) {
  this.book.log.debug.ln('bgAsNewPage', arguments);

  return execAsync.call(this.book, [
    'convert',
    path.join(stringUtils.escapeSpaces(this.book.root), inputImagePath),
    '-gravity ' + this.im.toGravitySetting(position),
    '-extent ' + geometry,
    path.join(this.book.options.pdfStyling.output, 'bg.pdf')
  ]);
};

/**
 * Generate a pdf document where the input image is used as a full-extent
 * background. That pdf can then be used to set the background for the book.
 */
Operations.prototype.bgAsNewPageFill = function(geometry, inputImagePath) {
  this.book.log.debug.ln('bgAsNewPage.fill', arguments);
  this.book.log.debug.ln('GEOMETRY', geometry);
  return execAsync.call(this.book, [
    'convert',
    path.join(stringUtils.escapeSpaces(this.book.root), inputImagePath),
    '-resize ' + geometry + '^',
    '-gravity Center',
    '-extent ' + geometry,
    path.join(this.book.options.pdfStyling.output, 'bg.pdf')
  ]);
};

Operations.prototype.setBackgroundInPdf = function(outputPath) {
  return execAsync.call(this.book, [
    bin.pdftk,
    path.join(this.book.options.pdfStyling.output, this.book.options.pdfStyling.last),
    'background',
    path.join(this.book.options.pdfStyling.output, 'bg.pdf'),
    'output',
    path.join(this.book.options.pdfStyling.output, outputPath)
  ])
}

Operations.prototype.im = {
  toGravitySetting: function(str) {
    var setting = stringUtils.capitalizeFirst(str);
    // TODO: run "identify -list gravity", throw if no match is found.
    return setting;
  }
};

module.exports = Operations;
