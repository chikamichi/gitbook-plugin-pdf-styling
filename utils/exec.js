/**
 * **Wrapper around `child_process`' execution functions.**.
 *
 * @module utils/exec
 */

var exec = require('child_process').exec;
var Q = require('q');
var _ = require('lodash');



/*** Public API ***/

/**
 * Asynchronously execute a command (wraps the command inside a deferrable).
 */
function execAsync(command) {
  var book = this;
  var d = Q.defer();

  book.log.debug.ln('-->', command.join(' '));

  var child = exec(command.join(' '), function (error, stdout) {
    if (error) {
      book.log.info.fail(error);
      error.message = error.message + ' '+stdout;
      return d.reject(error);
    }

    d.resolve(stdout.replace(/(\n|\r)+$/, ''));
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
  async: execAsync
};
