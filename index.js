// var fs = require('fs');
// var path = require('path');
// var _ = require('lodash');
var path = require('path');
var exec = require('child_process').exec;
var Q = require('q');

var bin = {
  pdftk: __dirname + "/bin/pdftk"
};

// Escape spaces within string. Useful for paths containing spaces.
function escapeSpaces(arg) {
  return arg.replace(/ /g, '\\ ');
}

function move() {
  var book = this;
  var d = Q.defer();

  var command = [
    'mv',
    path.join(book.options.output, 'index.pdf'),
    path.join(book.options.output, 'index.prepost.pdf')
  ].join(' ');

  var child = exec(command, function (error, stdout) {
    if (error) {
      book.log.info.fail(error);

      error.message = error.message + ' '+stdout;

      return d.reject(error);
    }

    d.resolve();
  });

  child.stdout.on('data', function (data) {
    book.log.debug(data);
  });

  child.stderr.on('data', function (data) {
    book.log.debug(data);
  });

  return d.promise;
}

function postprocess() {
  var book = this;
  var d = Q.defer();

  var command = [
      bin.pdftk,
      path.join(book.options.output, 'index.prepost.pdf'),
      'background',
      path.join(escapeSpaces(book.root), 'images', 'bg.pdf'),
      'output',
      path.join(book.options.output, 'index.pdf')
  ].join(' ');

  var child = exec(command, function (error, stdout) {
    if (error) {
      book.log.info.fail(error);

      if (error.code == 127) {
        error.message = 'pdftk command was not found, aborting.';
      } else {
        error.message = error.message + ' '+stdout;
      }
      return d.reject(error);
    }

    book.log.info.ok();
    d.resolve();
  });

  child.stdout.on('data', function (data) {
      book.log.debug(data);
  });

  child.stderr.on('data', function (data) {
      book.log.debug(data);
  });

  return d.promise;
}

module.exports = {
  hooks: {
    finish: function() {
      var book = this;

      if (book.options.generator != 'pdf') return;
      book.log.info.ln('start post-processing of pdf');

      return Q()
      .then(move.bind(book))
      .then(postprocess.bind(book))
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
