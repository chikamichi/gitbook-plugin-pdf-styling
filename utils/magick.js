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
 * Cap a number to a range.

 * @param {Number} value A number to be limited to the output range
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

_.mixin({
  clamp: clamp
});

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

  // If provided, the path then remains available as img.source.
  var img = path ? magick(path) : magick();
  _.extend(img, buildPromiseAPI.call(img));
  return img;
};

/**
 * @namespace Magick.geometry
 */
Magick.geometry = {
  /**
   * Extract width and height from a geometry string.
   *
   * @see http://www.imagemagick.org/script/command-line-processing.php#geometry
   * @memberof Magick.geometry
   */
  string2tuple: function(string) {
    var values = string.split('x');
    // If provided with a string such as "10", make it behave like "10x10".
    if (values.length == 1)
      values.push(values[0]);
    return _.zipObject(['width', 'height'], values);
  }
};

/**
 * @namespace Magick.gravity
 */
Magick.gravity = {
  /**
   * Format an already validated but possibly ill-formated gravity string.
   *
   * @see http://www.imagemagick.org/script/command-line-options.php#gravity
   * @memberof Magick.gravity
   */
  format: function(string) {
    return stringUtils.capitalizeFirst(string);
  }
};

/**
 * @namespace Magick.colors
 */
Magick.colors = {
  /**
   * Ensure the specified opacity is expressed as RGBA hexadecimal (word-order).
   *
   * @memberof Magick.colors
   */
  normalizeOpacity2Hexa: function(opacity) {
     return _.chain(opacity)
             .clamp(0, 1)
             .thru(function(opa) {
               // Convert raw opacity to hexadecimal integer.
               return Math.floor(opa * 255);
             })
             .thru(function(opa) {
               // Convert opacity to 16-based string, pad with 0 as needed.
               var res = opa.toString(16);
               return opa < 16 ? '0' + res : res;
             })
             .value();

  }
};

module.exports = Magick;
