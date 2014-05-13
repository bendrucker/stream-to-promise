var toArray = require('stream-to-array');
var Promise  = require('bluebird');

module.exports = function (stream) {
  var promise = Promise.promisify(toArray)(stream)
  stream.resume();
  return promise
    .map(function (part) {
      return (part instanceof Buffer) ? part : new Buffer(part);
    })
    .then(Buffer.concat)
    .error(function (err) {
      throw err.cause;
    });
};