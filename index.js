// var fs = require('fs');
// var path = require('path');
// var _ = require('lodash');
var Q = require('q');

module.exports = {
  hooks: {
    finish: function() {
      var book = this;

      if (book.options.generator != 'pdf') return;
      book.log.info('start post-processing of pdf');

      return Q()

      // Post-process the PDF rendering for the current book, based on the
      // supplied configuration.
      .then(function() {
        book.log.warn.ln('TODO: post-processing of pdf');
      })

      // Handle errors.
      .fail(function(err) {
        console.log('Error with pdf-styling: ', err.stack || err.message || err);
        book.log.fail.ln('Error while running pdf-styling.');
        return Q();
      });
    }
  }
};
