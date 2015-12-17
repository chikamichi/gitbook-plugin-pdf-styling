// Utilities leveraged in several places while processing the book.
// All of them are bound to the book instance at runtime.

var fs = require('fs');
var _ = require('lodash');
var Q = require('q');
var path = require('path');
var execAsync = require('./exec_async');

// Required post-processing units.
var pp = {};
pp.workflow = require('../lib/post-processing/workflow');
pp.background = require('../lib/post-processing/background');

/**
 * Check first if there's any post-processing actually pending.
 *
 * Exit early if none reported. Otherwise, start with moving the book to a
 * temporary location before further processing (solves path issues with pdftk,
 * among other tools, where the input path must differ from the output path).
 */
function preRun(backgroundCfg, foregroundCfg) {
  var book = this;

  // Very simple strategy for now, could be tweaked in the future though: some
  // configuration validation has already been enforced using JSON-Schema but it
  // is not perfect.
  return Q()
  .then(function() {
    if (backgroundCfg || foregroundCfg) {
      return pp.workflow.move2tmp.call(book);
    } else {
      throw new Error("Nothing to do, aborting.");
    }
  });
}

function handleSuccess() {
  this.log.info.ln('completed post-processing of pdf');
}

// Log error, then abort.
function handleError(err) {
  this.log.warn.ln('aborting post-processing of pdf');
  this.log.error.ln('error with pdf-styling: ', err.stack || err.message || err);

  // TODO: revert mv operation (implement abortRun and pp.workflow.abort)

  return Q();
}

/**
 * Perform initial checks.
 */
function init() {
  var book = this;

  return Q()
  .then(function() {
    if (book.options.generator != 'pdf') throw new Error('invalid book format, aborting');
  })
  .then(function() {
    book.log.info.ln('start pdf post-processing');
  })
}

/**
 * Extract relevant conf about background and foreground from book's
 * configuration.
 */
function readConfiguration() {
  var cfg = this.config.get('pluginsConfig.pdf-styling', {});
  return [cfg.background, cfg.foreground];
}

/**
 * Trigger background and foreground post-processing units.
 */
function runPostProcesses(backgroundCfg, foregroundCfg) {
  var book = this;

  return Q()
  .then(_.bind(preRun, book, backgroundCfg, foregroundCfg))
  .then(_.bind(pp.background.run, book, backgroundCfg))
  // TODO: pp.foreground
  .then(_.bind(handleSuccess, book))
  .fail(_.bind(handleError, book));
}

module.exports = {
  init: init,
  readConfiguration: readConfiguration,
  runPostProcesses: runPostProcesses
}
