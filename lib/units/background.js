/**
 * **This unit handles background-related post-processings.**
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



/*** Private API ***/

var bin = {
  pdftk: __dirname + "/../../bin/pdftk"
};

function setBackground() {
  var that = this;

  this.book.log.info('setting the background ....');

  var output = tmp.tmpNameSync({
    dir: this.book.options.pdfStyling.output,
    template: 'index.XXXXXX.pdf'
  });

  return execAsync.call(this.book, [
    bin.pdftk,
    path.join(this.book.options.pdfStyling.output, this.book.options.pdfStyling.last),
    'background',
    path.join(stringUtils.escapeSpaces(this.book.root), this.cfg.image),
    'output',
    path.join(this.book.options.pdfStyling.output, output)
  ])
  .then(function() {
    that.book.options.pdfStyling.last = output;
    that.book.log.info.ok();
  });
}



/*** Public API ***/

var BackgroundUnit = function(cfg, book) {
  this.cfg = cfg;
  this.book = book;
  _.bindAll(this);
};

BackgroundUnit.prototype.name = 'background';

/**
 * Trigger all background-related post-processings.
 */
BackgroundUnit.prototype.run = function() {
  return Q()
  // TODO: use `convert` to pre-render the background layer as a PDF before
  // calling setImages, if provided with a non-PDF asset.
  .then(_.bind(setBackground, this));
};

module.exports = BackgroundUnit;
