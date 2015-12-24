/**
 * **Wrapper around gm (ImageMagick) API's selected parts.**
 *
 * `gm`'s API is two-fold: getters like `size`, `identify`… are one-shot calls,
 * whereas other functions are chainable calls whose purpose is to build a
 * `convert` command's options sequence; that chain ends up with a call to
 * `write`.
 *
 * Both getters and `write` use the error-first callback style. The goal of this
 * wrapper is to provide a promise-compliant API, as well as exposing utility
 * functions.
 *
 * @see https://github.com/aheckmann/gm#methods
 *
 * @module utils/magick
 */

var Q = require('q');
var _ = require('lodash');

var magick = require('gm').subClass({imageMagick: true});
var stringUtils = require('./string');

/**
 * Extend a `Magick` instance with a promise-compliant API.
 */
function buildPromiseAPI() {
  return {
    size: Q.nbind(this.size, this),
    write: Q.nbind(this.write, this)
  };
};

/**
 * The Magic constructor returns an instance of `gm`, only extented with a
 * promise-compliant API. Create one instance per image to be processed.
 *
 * @class
 * @classdesc Wrapper around a `gm` instance, providing a promise-compliant API.
 */
var Magick = function(path) {
  if (!(this instanceof Magick))
    return new Magick(path);

  var img = magick(path); // The path then remains available as img.source.
  _.extend(img, buildPromiseAPI.call(img));
  return img;
};

Magick.geometry = {
  /**
   * Extract width and height from a geometry string.
   *
   * @see http://www.imagemagick.org/script/command-line-processing.php#geometry
   */
  string2tuple: function(string) {
    var values = string.split('x');
    // If provided with a string such as "10", make it behave like "10x10".
    if (values.length == 1)
      values.push(values[0]);
    return _.zipObject(['width', 'height'], values);
  }
};

Magick.gravity = {
  /**
   * Format an already validated but possibly ill-formated gravity string.

   @see http://www.imagemagick.org/script/command-line-options.php#gravity
   */
  format: function(string) {
    return stringUtils.capitalizeFirst(string);
  }
}

module.exports = Magick;
