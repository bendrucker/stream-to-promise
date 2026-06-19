# stream-to-promise

> [!WARNING]
> **Deprecated.** Node.js now ships promise-based stream helpers in core, so this
> package is no longer needed. It will receive no further updates. See the
> migration guide below.

## Migrating

Node 16+ covers everything this package did with the built-in
[`node:stream/promises`](https://nodejs.org/api/stream.html#streams-promises-api)
and `node:stream/consumers` modules.

### Readable Streams

Collect a readable stream into a `Buffer` with
[`consumers.buffer`](https://nodejs.org/api/stream.html#streamconsumersbufferstream),
or into a string with
[`consumers.text`](https://nodejs.org/api/stream.html#streamconsumerstextstream):

```js
const { buffer, text } = require('node:stream/consumers')

const buf = await buffer(readableStream)
const str = await text(readableStream)
```

For object-mode streams, use
[`Readable.prototype.toArray`](https://nodejs.org/api/stream.html#readabletoarrayoptions):

```js
const parts = await readableStream.toArray()
```

### Writable Streams

Wait for a writable (or any) stream to finish with
[`finished`](https://nodejs.org/api/stream.html#streamfinishedstream-options):

```js
const { finished } = require('node:stream/promises')

writableStream.write('data')
writableStream.end()
await finished(writableStream)
```

To run data through a pipeline and await completion, use
[`pipeline`](https://nodejs.org/api/stream.html#streampipelinestreams-options):

```js
const { pipeline } = require('node:stream/promises')

await pipeline(source, transform, destination)
```

## License

[MIT](LICENSE)
