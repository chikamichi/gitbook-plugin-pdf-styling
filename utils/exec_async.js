var exec = require('child_process').exec;
var Q = require('q');

// Wrap a command inside a deferrable for later consumption.
//
// Expect this to be set to the book being rendered, for context consistency.
function execAsync(command) {
  var book = this;
  var d = Q.defer();

  var child = exec(command.join(' '), function (error, stdout) {
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

module.exports = execAsync;
