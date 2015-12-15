// var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var Q = require('q');

var execAsync = require('./utils/exec_async');
var stringUtils = require('./utils/string');

var bin = {
  pdftk: __dirname + "/bin/pdftk"
};

function move() {
  var book = this;
  return execAsync.call(book, [
    'mv',
    path.join(book.options.output, 'index.pdf'),
    path.join(book.options.output, 'index.prepost.pdf')
  ]);
}

function postprocess() {
  var book = this;
  return execAsync.call(book, [
    bin.pdftk,
    path.join(book.options.output, 'index.prepost.pdf'),
    'background',
    path.join(stringUtils.escapeSpaces(book.root), 'images', 'bg.pdf'),
    'output',
    path.join(book.options.output, 'index.pdf')
  ]);
}

module.exports = {
  hooks: {
    finish: function() {
      var book = this;
      if (book.options.generator != 'pdf') return;

      book.log.info.ln('start post-processing of pdf');

      return Q()
      .then(_.bind(move, book))
      .then(_.bind(postprocess, book))
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
