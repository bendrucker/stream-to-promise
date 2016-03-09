'use strict'

var toArray = require('stream-to-array')
var Promise = require('bluebird')

module.exports = streamToPromise

function streamToPromise (stream) {
  if (stream.readable) return fromReadable(stream)
  if (stream.writable) return fromWritable(stream)
  return Promise.resolve()
}

function fromReadable (stream) {
  var promise = toArray(stream)

  // Ensure stream is in flowing mode
  stream.resume()

  return promise
    .then(function concat (parts) {
      return Buffer.concat(parts.map(bufferize))
    })
}

function fromWritable (stream) {
  return new Promise(function (resolve, reject) {
    stream.once('finish', resolve)
    stream.once('error', reject)
  })
}

function bufferize (chunk) {
  var newBuffer = typeof chunk === 'object' ? new Buffer([chunk]) : new Buffer(chunk)
  return Buffer.isBuffer(chunk) ? chunk : newBuffer
}
