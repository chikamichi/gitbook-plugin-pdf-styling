var fs = require('fs');
var path = require('path');
var tmp = require('tmp');

var execAsync = require('../../utils/exec').async;

/**
 * Create a temporary location to work within and move the pdf to be processed
 * to that location.
 */
function createTmp() {
  var book = this;

  book.log.debug.ln('creating post-processing workspace ....');

  var last = 'index.pdf';
  book.options.pdfStyling.output = tmp.dirSync({
    unsafeCleanup: true
  }).name;

  return execAsync.call(book, [
    'cp',
    path.join(book.options.output, 'index.pdf'),
    path.join(book.options.pdfStyling.output, last)
  ], function() {
    book.options.pdfStyling.last = last;
  });
}

function cleanupTmp() {
  var book = this;

  book.log.debug.ln('cleaning post-processing workspace ....');
  var filepath = path.join(book.options.pdfStyling.output, book.options.pdfStyling.last);
  fs.access(filepath, fs.R_OK | fs.W_OK, function (err) {
    book.log.debug.ln(err ? 'no access!' : 'can read/write');
  });

  // tmp will take care of deleting the directory on process exit. Let's simply
  // move the post-processed pdf back to its original location.
  return execAsync.call(book, [
    'cp -f',
    path.join(book.options.pdfStyling.output, book.options.pdfStyling.last),
    path.join(book.options.output, 'index.pdf')
  ]);
}

module.exports = {
  createTmp: createTmp,
  cleanupTmp: cleanupTmp
}
