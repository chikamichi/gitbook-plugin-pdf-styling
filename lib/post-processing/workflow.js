var path = require('path');
var execAsync = require('../../utils/exec_async');

function move2tmp() {
  var book = this;
  return execAsync.call(book, [
    'mv',
    path.join(book.options.output, 'index.pdf'),
    path.join(book.options.output, 'index.prepost.pdf')
  ]);
}

module.exports = {
  move2tmp: move2tmp
}
