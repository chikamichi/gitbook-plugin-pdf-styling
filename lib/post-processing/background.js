var path = require('path');
var execAsync = require('../../utils/exec_async');
var stringUtils = require('../../utils/string');

var bin = {
  pdftk: __dirname + "/../../bin/pdftk"
};

function setImage() {
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
  setImage: setImage
}
