var toArray = require('stream-to-array');
var Promise  = require('bluebird');

module.exports = function (stream) {
  return Promise.promisify(toArray)(stream)
    .map(function (part) {
      return (part instanceof Buffer) ? part : new Buffer(part);
    })
    .then(Buffer.concat)
    .error(function (err) {
      throw err.cause;
    });
};