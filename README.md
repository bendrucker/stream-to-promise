stream-to-promise [![Build Status](https://travis-ci.org/bendrucker/stream-to-promise.svg)](https://travis-ci.org/bendrucker/stream-to-promise) [![NPM version](https://badge.fury.io/js/stream-to-promise.svg)](http://badge.fury.io/js/stream-to-promise)
=================

Convert streams (readable or writable) to promises


```js
streamToPromise(readableStream).then(function (buffer) {
  // buffer.length === 3
});
readableStream.emit('data', new Buffer());
readableStream.emit('data', new Buffer());
readableStream.emit('data', new Buffer());
readableStream.emit('end'); // promise is resolved here
```

```js
streamToPromise(writableStream).then(function () {
  // resolves undefined
});
writableStream.write('data');
writeableStream.end(); // promise is resolved here
```

```js
var err = new Error();
streamToPromise(stream).catch(function (error) {
  // error === err;
});
stream.emit('error', err); // promise is rejected here
```
