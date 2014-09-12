'use strict';

var toArray   = require('stream-to-array');
var Promise   = require('bluebird');
var internals = {};

internals.readable = function (stream) {
  var promise = toArray(stream);

  // Ensure stream is in flowing mode
  stream.resume();

  return promise
    .then(function (parts) {
      var buffers = [];
      for (var i = 0, l = parts.length; i < l ; ++i) {
        var part = parts[i];
        buffers.push((part instanceof Buffer) ? part : new Buffer(part));
      }
      return Buffer.concat(buffers);
    });
};

internals.writable = function (stream) {
  return new Promise(function (resolve, reject) {
    stream.once('finish', resolve);
    stream.once('error', reject);
  });
};

module.exports = function (stream) {
  var promise;
  if (stream.readable) {
    promise = internals.readable(stream);
  }
  else if (stream.writable) {
    promise = internals.writable(stream);
  }
  else {
    promise = Promise.resolve();
  }
  return promise;
};
