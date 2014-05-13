'use strict';

var Stream          = require('stream');
var chai            = require('chai');
var Promise         = require('bluebird');
var DelayedStream   = require('delayed-stream');
var streamToPromise = require('./');

chai.use(require('chai-as-promised'));
Promise.onPossiblyUnhandledRejection(function (err) {
  throw err;
});

var expect = chai.expect;

/* globals describe:false, it:false, beforeEach:false */

describe('stream-to-promise', function () {

  var stream, promise;
  beforeEach(function () {
    stream = new Stream.Readable();
    stream._read = function noop () {};
    promise = streamToPromise(stream);
  });

  it('can resolve empty streams', function () {
    stream.emit('end');
    return promise.then(function (buffer) {
      expect(buffer).to.be.an.instanceOf(Buffer);
      expect(buffer).to.have.length(0);
    });
  });

  it('resolves stream data', function () {
    stream.emit('data', new Buffer('foo'));
    stream.emit('data', new Buffer('bar'));
    stream.emit('end');
    return promise.then(function (buffer) {
      expect(buffer).to.be.an.instanceOf(Buffer);
      expect(buffer.toString()).to.equal('foobar');
    });
  });

  it('can handle streams of buffers and strings', function () {
    stream.emit('data', new Buffer('foo'));
    stream.emit('data', 'bar');
    stream.emit('end');
    return promise.then(function (buffer) {
      expect(buffer.toString()).to.equal('foobar');
    });
  });

  it('resolves immediately for ended streams', function () {
    stream.readable = false;
    return streamToPromise(stream).then(function (buffer) {
      expect(buffer).to.have.length(0);
    });
  });

  it('ensures that streams are flowing (#1)', function () {
    var delayed = DelayedStream.create(stream);
    stream.emit('data', new Buffer('foo'));
    stream.emit('end');
    return streamToPromise(delayed).then(function (buffer) {
      expect(buffer.toString()).to.equal('foo');
    });
  });

  it('rejects on stream errors', function () {
    var err = new Error();
    stream.emit('error', err);
    return expect(promise).to.be.rejectedWith(err);
  });

});