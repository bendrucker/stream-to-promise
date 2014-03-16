var Stream          = require('stream');
var chai            = require('chai');
var Promise         = require('bluebird');
var streamToPromise = require('./');

require('mocha-as-promised')();
chai.use(require('chai-as-promised'));
Promise.onPossiblyUnhandledRejection(function (err) {
  throw err;
});

var expect = chai.expect;

describe('stream-to-promise', function () {

  var stream, promise;
  beforeEach(function () {
    stream = new Stream.Readable();
    stream._read = function noop () {};
    promise = streamToPromise(stream);
  });

  it('can resolve empty streams', function (done) {
    promise
      .then(function (buffer) {
        expect(buffer).to.be.an.instanceOf(Buffer);
        expect(buffer).to.have.length(0);
       })
      .done(done);
    stream.emit('end');
  });

  it('resolves stream data', function (done) {
    promise
      .then(function (buffer) {
        expect(buffer).to.be.an.instanceOf(Buffer);
        expect(buffer.toString()).to.equal('foobar');
      })
      .done(done);
    stream.emit('data', new Buffer('foo'));
    stream.emit('data', new Buffer('bar'));
    stream.emit('end');
  });

  it('resolves immediately for ended streams', function () {
    stream.readable = false;
    return streamToPromise(stream).then(function (buffer) {
      expect(buffer).to.have.length(0);
    });
  });


  it('rejects on stream errors', function (done) {
    var err = new Error();
    stream.emit('error', err);
    promise.catch(function (error) {
      expect(error).to.equal(err);
      done();
    });
  });

});