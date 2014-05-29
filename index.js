var toArray   = require('stream-to-array');
var Promise   = require('bluebird');
var internals = {};

internals.readable = function (stream) {
  var promise = Promise.promisify(toArray)(stream);
  stream.resume();
  return promise
    .map(function (part) {
      return (part instanceof Buffer) ? part : new Buffer(part);
    })
    .then(Buffer.concat);
};

internals.writable = function (stream) {
  return new Promise(function (resolve, reject) {
    stream.once('finish', resolve);
    stream.once('error', reject);
  });
}

module.exports = function (stream) {
  var promise;
  if (stream.readable) {
    promise = internals.readable(stream);   
  } else if (stream.writable) {
    promise = internals.writable(stream);
  } else {
    promise = Promise.resolve();
  }
  return promise
    .catch(function (err) {
      err = err.cause || err;
      throw err;
    });  
};
