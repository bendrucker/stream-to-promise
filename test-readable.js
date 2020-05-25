'use strict'

const test = require('tape-promise').default(require('tape'))

const Stream = require('stream')
const DelayedStream = require('delayed-stream')
const streamToPromise = require('./')

test('readable/emtpy', async function (t) {
  const [readable, promise] = Readable()

  readable.emit('end')
  const buffer = await promise

  t.ok(Buffer.isBuffer(buffer), 'is buffer')
  t.equal(buffer.length, 0, 'empty')
})

test('readable/data', async function (t) {
  const [readable, promise] = Readable()

  readable.emit('data', Buffer.from('foo'))
  readable.emit('data', Buffer.from('bar'))
  readable.emit('end')

  const buffer = await promise

  t.ok(Buffer.isBuffer(buffer), 'is buffer')
  t.equal(buffer.toString(), 'foobar', 'concatenates data')
})

test('readable/buffers', async function (t) {
  const [readable, promise] = Readable()

  readable.emit('data', Buffer.from('foo'))
  readable.emit('data', 'bar')
  readable.emit('end')

  const buffer = await promise

  t.equal(buffer.toString(), 'foobar', 'concatenates data')
})

test('readable/ended', async function (t) {
  const [readable] = Readable()
  readable.readable = false

  t.equal(await streamToPromise(readable), undefined, 'undefined result')
})

test('readable/paused', async function (t) {
  const [readable] = Readable()

  const delayed = DelayedStream.create(readable)

  readable.emit('data', Buffer.from('foo'))
  readable.emit('end')

  const buffer = await streamToPromise(delayed)

  t.equal(buffer.toString(), 'foo', 'resolves data')
})

test('readable/object', async function (t) {
  const objectStream = new Stream.Readable({ objectMode: true })
  objectStream._read = function noop () { }

  const promise = streamToPromise(objectStream)

  objectStream.emit('data', { foo: 'bar' })
  objectStream.emit('data', { baz: 'qux' })
  objectStream.emit('end')

  t.deepEqual(await promise, [{ foo: 'bar' }, { baz: 'qux' }], 'returns array of data')
})

test('readable/error', async function (t) {
  const [readable, promise] = Readable()

  const err = new Error('oh no')
  readable.emit('error', err)

  return t.rejects(promise, /oh no/, 'rejects with error')
})

function Readable () {
  const readable = new Stream.Readable()
  readable._read = function noop () { }
  const promise = streamToPromise(readable)

  return [readable, promise]
}
