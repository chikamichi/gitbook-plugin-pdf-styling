var path = require('path');
var _ = require('lodash');
var Q = require('q');

var PostProcessing = require('./lib/post_processing');

module.exports = {
  hooks: {
    finish: function() {
      var book = this;

      var postProcessing = new PostProcessing(book);
      return postProcessing.run();
    }
  }
};
