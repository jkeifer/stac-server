// @ts-check

const { default: anyTest } = require('ava')
const { apiClient } = require('../helpers/api-client')
const { deleteAllIndices } = require('../helpers/es')
const systemTests = require('../helpers/system-tests')

/**
 * @template T
 * @typedef {import('ava').TestFn<T>} TestFn<T>
 */

/**
 * @typedef {import('../helpers/types').SystemTestContext} SystemTestContext
 */

const test = /** @type {TestFn<SystemTestContext>} */ (anyTest)

test.before(async (t) => {
  await deleteAllIndices()
  const standUpResult = await systemTests.setup()

  t.context.ingestQueueUrl = standUpResult.ingestQueueUrl
  t.context.ingestTopicArn = standUpResult.ingestTopicArn
})

test('GET / includes the default links', async (t) => {
  const response = await apiClient.get('')

  t.true(Array.isArray(response.links))

  const defaultLinkRels = [
    'conformance',
    'data',
    'search',
    'self',
    'service-desc'
  ]

  t.true(response.links.length >= defaultLinkRels.length)

  // @ts-expect-error We need to type the response
  const responseRels = response.links.map((r) => r.rel)

  for (const expectedRel of defaultLinkRels) {
    t.true(responseRels.includes(expectedRel))
  }
})

test('GET / returns a compressed response', async (t) => {
  const response = await apiClient.get('', { resolveBodyOnly: false })

  t.is(response.headers['content-encoding'], 'gzip')
})
