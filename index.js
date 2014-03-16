var toArray = require('stream-to-array');
var Promise  = require('bluebird');

module.exports = function (stream) {
  return Promise.promisify(toArray)(stream)
    .then(Buffer.concat)
    .error(function (err) {
      throw err.cause;
    });
};