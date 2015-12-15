var path = require('path');
var _ = require('lodash');
var Q = require('q');

var toolchain = require('./utils/toolchain');

module.exports = {
  hooks: {
    finish: function() {
      var book = this;

      // TODO: move to a toolchain utility
      if (book.options.generator != 'pdf') return;

      // TODO: move to a toolchain utility
      book.log.info.ln('start post-processing of pdf');

      return Q()
      .then(_.bind(toolchain.readConfiguration, book))
      .spread(_.bind(toolchain.runPostProcesses, book));
    }
  }
};
