/**
 * **Utilities leveraged in several places while processing the book.**

 * All of them are bound to the `book` instance at runtime.

 * @module post-processing
 */

var fs = require('fs');
var _ = require('lodash');
var Q = require('q');
var path = require('path');

var execAsync = require('../utils/exec').async;

// General purpose helpers controlling the post-processing workflow.
var _workflow = require('./units/workflow');

// Available post-processing units, as an ordered stack.
// NOTE: could probably be implemented as a middleware pipeline, with the last
// rendering's path flowing through the post-processing units. Let's KISS though.
var _pipeline = [
  {name: 'background', factory: require('./units/background')}
  // {name: 'foreground', require('./units/foreground')}
];



/*** Private API ***/

/**
 * Perform some high-level checks prior to committing to post-processing.
 */
function preflight() {
  var that = this;

  return Q()
  .then(function() {
    if (that.book.options.generator != 'pdf') {
      throw new Error('invalid book format');
    }
  })
  .then(function() {
    that.book.log.info.ln('start pdf post-processing');
  });
}

/**
 * Extract relevant conf about background and foreground post-processing, from
 * the book's configuration.
 */
function readConfiguration() {
  var that = this;

  return Q()
  .then(function() {
    var cfg = that.book.config.get('pluginsConfig.pdf-styling', {});
    that.cfg = _.chain({
      background: cfg.background,
      foreground: cfg.foreground
    }).pick(function(unitCfg) {
      // Some validation already took place using JSON-schema, but it might be
      // worth doing some more here at some point.
      return !(_.isUndefined(unitCfg) || _.isEmpty(unitCfg));
    })
    .value();
  });
}

/**
 * Check first if any post-processing unit is actually registered.
 *
 * Exit early if none reported. Otherwise, start with moving the book to a
 * temporary location before further processing (solves path issues with
 * `pdftk`, among other tools, where the input path must differ from the output
 * path).
 */
function beforeRun() {
  var that = this;

  return Q()
  .then(function() {
    if (_.chain(that.cfg).values().isEmpty().value()) {
      throw new Error("nothing to do (bad configuration?)");
    }
  })
  .then(function() {
    // We'll need to track some paths. Not sure where to store that information
    // at runtime yet, book's options hash will do for now.
    that.book.options.pdfStyling = {};
    return _workflow.createTmp.call(that.book);
  })
}

/**
 * Run all registered post-processing units, in order, to completion.
 */
function runRegisteredUnits() {
  var that = this;

  var sequence = _.chain(_pipeline)
                  .map(function(unit) {
                    if (that.cfg[unit.name])
                      var unitt = new unit.factory(that.cfg[unit.name]);
                      return _.bind(unitt.run, that.book);
                  })
                  .compact()
                  .value();

  return sequence.reduce(Q.when, Q());
}

function afterRun() {
  var that = this;

  return Q()
  .then(function() {
    return _workflow.cleanupTmp.call(that.book);
  })
  .then(function(){
    delete that.book.options.pdfStyling;
  })
  .then(function() {
    that.book.log.info.ln('completed pdf post-processing');
  });
}

/**
 * Log error, then abort.
 */
function handleError(err) {
  this.book.log.error.ln('error with pdf-styling: ', err.stack || err.message || err);
  this.book.log.warn.ln('aborting post-processing of pdf');

  return Q();
}



/*** Public API ***/

/**
 * Perform initial checks.
 */
var PostProcessing = function(book) {
  this.book = book;
  this.units = [];
  _.bindAll(this);
};

/**
 * Trigger all post-processing units.
 */
PostProcessing.prototype.run = function() {
  return Q()
  .then(_.bind(preflight, this))
  .then(_.bind(readConfiguration, this))
  .then(_.bind(beforeRun, this))
  .then(_.bind(runRegisteredUnits, this))
  .then(_.bind(afterRun, this))
  .fail(_.bind(handleError, this));
};

module.exports = PostProcessing;
