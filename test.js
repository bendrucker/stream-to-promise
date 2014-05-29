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

  describe('Readable streams', function () {

    var readable, promise;
    beforeEach(function () {
      readable = new Stream.Readable();
      readable._read = function noop () {};
      promise = streamToPromise(readable);
    });

    it('can resolve empty streams', function () {
      readable.emit('end');
      return promise.then(function (buffer) {
        expect(buffer).to.be.an.instanceOf(Buffer);
        expect(buffer).to.have.length(0);
      });
    });

    it('resolves stream data', function () {
      readable.emit('data', new Buffer('foo'));
      readable.emit('data', new Buffer('bar'));
      readable.emit('end');
      return promise.then(function (buffer) {
        expect(buffer).to.be.an.instanceOf(Buffer);
        expect(buffer.toString()).to.equal('foobar');
      });
    });

    it('can handle streams of buffers and strings', function () {
      readable.emit('data', new Buffer('foo'));
      readable.emit('data', 'bar');
      readable.emit('end');
      return promise.then(function (buffer) {
        expect(buffer.toString()).to.equal('foobar');
      });
    });

    it('resolves immediately for ended streams', function () {
      readable.readable = false;
      return streamToPromise(readable).then(function (result) {
        expect(result).to.be.undefined;
      });
    });

    it('ensures that streams are flowing (#1)', function () {
      var delayed = DelayedStream.create(readable);
      readable.emit('data', new Buffer('foo'));
      readable.emit('end');
      return streamToPromise(delayed).then(function (buffer) {
        expect(buffer.toString()).to.equal('foo');
      });
    });

    it('rejects on stream errors', function () {
      var err = new Error();
      readable.emit('error', err);
      return expect(promise).to.be.rejectedWith(err);
    });

  });

  describe('Writable streams (#2)', function () {

    var writable, promise;
    beforeEach(function () {
      writable = new Stream.Writable();
      writable._read = function noop () {};
      promise = streamToPromise(writable);
    });

    it('resolves undefined when the stream finishes', function () {
      writable.emit('finish');
      return expect(promise).to.eventually.be.undefined;
    });

    it('rejects on stream errors', function () {
      var err = new Error();
      writable.emit('error', err);
      return expect(promise).to.be.rejectedWith(err);
    });

  });

});
