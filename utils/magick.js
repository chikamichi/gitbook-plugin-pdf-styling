/**
 * **Utilities for tweaking images and pdf documents.**
 *
 * Provides a lot of wrappers around imagemagick calls, hence the name.
 *
 * All functions expect their context to be set to the book instance.
 *
 * @module utils/magick
 */

var path = require('path');

var Q = require('q');
var _ = require('lodash');

var execAsync = require('./exec').async;
// It's weird having magick-related functions relying on string utilities, so
//  it's time to extract path resolution to its own module ^^
var stringUtils = require('./string');

var bin = {
  pdftk: __dirname + "/../bin/pdftk"
};



/*** Public API ***/

var Magick = function(book) {
  this.book = book;
  _.bindAll(this);
};

/**
 * Identify the format of the book, as available at the current stage of the
 * post-processing.
 */
Magick.prototype.identifyFormat = function() {
  return execAsync.call(this.book, [
    'identify -format "%wx%h\n"',
    path.join(this.book.options.pdfStyling.output, this.book.options.pdfStyling.last),
    '| tail -n1'
  ]);
};

/**
 * Generate a pdf document where the input image is used as a full-extent
 * background. That pdf can then be used to set the background for the book.
 */
Magick.prototype.resizeAndfillPage = function(geometry, inputImagePath) {
  this.book.log.debug.ln('GEOMETRY', geometry);
  return execAsync.call(this.book, [
    'convert',
    path.join(stringUtils.escapeSpaces(this.book.root), inputImagePath),
    '-resize',
    geometry + '^',
    '-gravity Center -extent',
    geometry,
    path.join(this.book.options.pdfStyling.output, 'bg.pdf')
  ]);
};

Magick.prototype.setBackgroundInPdf = function(outputPath) {
  return execAsync.call(this.book, [
    bin.pdftk,
    path.join(this.book.options.pdfStyling.output, this.book.options.pdfStyling.last),
    'background',
    path.join(this.book.options.pdfStyling.output, 'bg.pdf'),
    'output',
    path.join(this.book.options.pdfStyling.output, outputPath)
  ])
}

module.exports = Magick;
