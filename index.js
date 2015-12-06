'use strict'

var toArray = require('stream-to-array')
var Promise = require('bluebird')

module.exports = streamToPromise

function streamToPromise (stream) {
  var promise
  if (stream.readable) {
    promise = fromReadable(stream)
  } else if (stream.writable) {
    promise = fromWritable(stream)
  } else {
    promise = Promise.resolve()
  }
  return promise
}

function fromReadable (stream) {
  var promise = toArray(stream)

  // Ensure stream is in flowing mode
  stream.resume()

  return promise
    .then(function (parts) {
      var buffers = []
      for (var i = 0, l = parts.length; i < l; ++i) {
        var part = parts[i]
        buffers.push((part instanceof Buffer) ? part : new Buffer(part))
      }
      return Buffer.concat(buffers)
    })
}

function fromWritable (stream) {
  return new Promise(function (resolve, reject) {
    stream.once('finish', resolve)
    stream.once('error', reject)
  })
}
