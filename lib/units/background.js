/**
 * **This unit handles background-related post-processings.**
 *
 * @module post-processing/background
 */

var path = require('path');
var Q = require('q');
var _ = require('lodash');
var tmp = require('tmp');

var execAsync = require('../../utils/exec').async;
var Magick = require('../../utils/magick');



/*** Private API ***/

function generateBackground() {
  var that = this;

  this.book.log.debug.ln('generating the background ....');

  return Q()
  .then(this.magick.identifyFormat)
  .then(_.partialRight(this.magick.resizeAndfillPage, this.cfg.image))
  .then(function() {
    that.book.log.info.ok();
  })
}

function setBackground() {
  var that = this;

  this.book.log.info.ln('setting the background ....');

  // TODO: I like it sync. For now. Could use Q.nfbind eventually.
  // It's mostly to avoid flowing the outputPath through the chain of promises,
  // for it would require Magick#setBackgroundInPdf to return the outputPath and
  // it feels weird doing that. Or I could use a local var as cache. Just need
  // to sleep on it.
  var outputPath = tmp.tmpNameSync({
    dir: this.book.options.pdfStyling.output,
    template: 'index.XXXXXX.pdf'
  });

  return Q()
  .then(_.partial(this.magick.setBackgroundInPdf, outputPath))
  .then(function() {
    that.book.options.pdfStyling.last = outputPath;
    that.book.log.info.ok();
  });
}



/*** Public API ***/

var BackgroundUnit = function(cfg, book) {
  this.cfg = cfg;
  this.book = book;
  this.magick = new Magick(book);
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
  .then(_.bind(generateBackground, this))
  .then(_.bind(setBackground, this));
};

module.exports = BackgroundUnit;
