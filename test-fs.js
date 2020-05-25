'use strict'

const test = require('tape-promise').default(require('tape'))
const { promises: fs, createReadStream, createWriteStream } = require('fs')
const tmp = require('tmp-promise')

const streamToPromise = require('./')

test('fs/read', async function (t) {
  const file = await tmp.file()
  await fs.writeFile(file.path, 'hello world')

  const result = await streamToPromise(createReadStream(file.path))

  t.equal(result.toString(), 'hello world')
})

test('fs/write', async function (t) {
  const file = await tmp.file()
  const stream = createWriteStream(file.path)

  process.nextTick(function () {
    stream.write('hello world')
    stream.end()
  })

  await streamToPromise(stream)

  t.equal(await fs.readFile(file.path, 'utf-8'), 'hello world')
})
