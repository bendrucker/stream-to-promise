'use strict'

const test = require('tape-promise').default(require('tape'))
const Stream = require('stream')
const streamToPromise = require('./')

test('writable/success', async function (t) {
  const [writable, promise] = Writable()

  writable.emit('finish')

  t.equal(await promise, undefined, 'returns undefined')
})

test('writable/error', async function (t) {
  const [writable, promise] = Writable()
  const err = new Error('oh no')

  writable.emit('error', err)

  return t.rejects(promise, /oh no/, 'rejects with error')
})

function Writable () {
  const writable = new Stream.Writable()
  writable._read = function noop () {}
  const promise = streamToPromise(writable)

  return [writable, promise]
}
