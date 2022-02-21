const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const api = require('../../src/lib/api')

test('extractIntersectsNull', (t) => {
  const params = {}
  const intersectsGeometry = api.extractIntersects(params)
  t.falsy(intersectsGeometry,
    'Returns undefined when no intersects parameter')
})

test('extractIntersects', (t) => {
  const valid = sinon.stub().returns(false)
  const proxyApi = proxyquire('../../src/lib/api', {
    'geojson-validation': { valid }
  })
  t.throws(() => {
    proxyApi.extractIntersects({ intersects: {} })
  }, null, 'Throws exception when GeoJSON is invalid')
})

test('extractIntersects FeatureCollection', (t) => {
  const valid = sinon.stub().returns(true)
  const proxyApi = proxyquire('../../src/lib/api', {
    'geojson-validation': { valid }
  })
  t.throws(() => {
    proxyApi.extractIntersects({
      intersects: { type: 'FeatureCollection' }
    })
  }, null, 'Throws exception when GeoJSON type is FeatureCollection')
})