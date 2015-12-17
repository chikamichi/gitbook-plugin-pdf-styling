var path = require('path');
var _ = require('lodash');
var Q = require('q');

var toolchain = require('./utils/toolchain');

module.exports = {
  hooks: {
    finish: function() {
      var book = this;

      return Q()
      .then(_.bind(toolchain.init, book))
      .then(_.bind(toolchain.readConfiguration, book))
      .spread(_.bind(toolchain.runPostProcesses, book));
    }
  }
};
