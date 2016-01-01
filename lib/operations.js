/**
 * **Operations which can be performed on a post-processed book.**
 *
 * All functions expect their context to be set to the `book` instance.
 *
 * @module utils/operations
 */

var path = require('path');

var Q = require('q');
var _ = require('lodash');

var Magick = require('../utils/magick');
var X11Colors = require('../utils/x11_colors');
var execAsync = require('../utils/exec').async;
// It's weird having those functions relying on string utilities, so it's time
//  to extract path resolution to its own module ^^
var stringUtils = require('../utils/string');

var bin = {
  pdftk: __dirname + "/../bin/pdftk"
};



/*** Public API ***/

/**
 * The `Operations` constructor should be leveraged book-wise.
 *
 * @class
 * @classdesc An `Operations` instance mostly acts as a namespace for a book's
 * post-processing operations.
 */
var Operations = function(book) {
  this.book = book;
  _.bindAll(this);
};

/**
 * Identify the format of the processed book, as is available at the current
 * stage of the post-processing.
 */
Operations.prototype.identifyBookFormat = function() {
  return Magick(path.join(this.book.options.pdfStyling.output,
                          this.book.options.pdfStyling.last))
  .size();
};

/**
 * Generate a pdf document where the input image is used as background. That pdf
 * can then be used to set the background for the pdf book itself.
 */
Operations.prototype.createBgPage = function(geometry, inputImagePath, options) {
  var offset = Magick.geometry.string2tuple(options.offset);
  var position = Magick.gravity.format(options.position);

  return Magick(path.join(stringUtils.escapeSpaces(this.book.root), inputImagePath))
  .borderColor(options.backgroundColor)
  .border(offset.width, offset.height)
  .gravity(position)
  .extent(geometry.width, geometry.height)
  .write(path.join(this.book.options.pdfStyling.output, 'bg.pdf'));
};

/**
 * Generate a pdf document where the input image is used as a full-extent
 * background. That pdf can then be used to set the background for the pdf book
 * itself.
 */
Operations.prototype.createBgFullPage = function(geometry, inputImagePath) {
  return Magick(path.join(this.book.root, inputImagePath))
  .resize(geometry.width, geometry.height, '^')
  .gravity('Center')
  .extent(geometry.width, geometry.height)
  .write(path.join(this.book.options.pdfStyling.output, 'bg.pdf'));
};

/**
 * Generate a pdf document where the background is a solid color.
 *
 * Handle transparency.
 */
Operations.prototype.createBgColorFullPage = function(geometry, fillColor, options) {
  var opacity = Magick.colors.normalizeOpacity2Hexa(options.opacity);
  var color = X11Colors[fillColor] || fillColor;

  return Magick()
  .out('-size')
  .out(geometry.width + 'x' + geometry.height)
  .out('xc:' + color + opacity) // Will silently fallback to white if invalid.
  .write(path.join(this.book.options.pdfStyling.output, 'bg.pdf'));
};

/**
 * Apply a pdf document as a background layer to the pdf book.
 */
Operations.prototype.setBackgroundInPdf = function(outputPath) {
  return execAsync.call(this.book, [
    'LD_LIBRARY_PATH=' + __dirname + '/../bin/',
    bin.pdftk,
    path.join(this.book.options.pdfStyling.output, this.book.options.pdfStyling.last),
    'background',
    path.join(this.book.options.pdfStyling.output, 'bg.pdf'),
    'output',
    path.join(this.book.options.pdfStyling.output, outputPath)
  ])
};

module.exports = Operations;
