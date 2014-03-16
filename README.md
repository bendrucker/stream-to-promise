stream-to-promise
=================

Convert readable streams to promises.


```js
streamToPromise(stream).then(function (buffer) {
  // buffer.length === 3
});
stream.emit('data', new Buffer());
stream.emit('data', new Buffer());
stream.emit('data', new Buffer());
stream.emit('end'); // promise is resolved here
```

```js
var err = new Error();
streamToPromise(stream).catch(function (error) {
  // error === err;
});
stream.emit('error', err); // promise is rejected here
```