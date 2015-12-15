// var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Q = require('q');

var execAsync = require('./utils/exec_async');

// Required post-processing units.
var pp = {};
pp.workflow = require('./lib/post-processing/workflow');
pp.background = require('./lib/post-processing/background');

module.exports = {
  hooks: {
    finish: function() {
      var book = this;
      if (book.options.generator != 'pdf') return;

      book.log.info.ln('start post-processing of pdf');

      return Q()
      .then(_.bind(pp.workflow.move2tmp, book))
      .then(_.bind(pp.background.setImage, book))
      .then(function() {
        book.log.info.ln('completed post-processing of pdf');
      })
      .fail(function(err) {
        console.log('error with pdf-styling: ', err.stack || err.message || err);
        return Q();
      });
    }
  }
};
