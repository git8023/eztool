import ezt from '../lib'
import logs from '../lib/tools/logs';

const jsons = ezt.jsons
test('jsons.compact: Recursion', () => {
  const $data = () => ({
    str: '',
    null: null,
    emptyObj: {},
    emptyArr: [],
    obj: {foo: null},
    obj2: {foo: {foo: 1}},
    a: 1,
    b: [{a: 1}, {}]
  })

  const recursionRet = jsons.compact($data(), true);
  expect({
    obj2: {foo: {foo: 1}},
    a: 1,
    b: [{a: 1}]
  }).toStrictEqual(recursionRet)

  const simpleRet = jsons.compact($data())
  expect({
    obj: {foo: null},
    obj2: {foo: {foo: 1}},
    a: 1,
    b: [{a: 1}, {}]
  }).toStrictEqual(simpleRet)
})

test('jsons.computeIfAbsent', () => {
  const x = {
    foo: 1
  }

  jsons.computeIfAbsent(x, 'foo', (store, key) => 'foo')
  jsons.computeIfAbsent(x, 'bar', (store, key) => 'bar')

  logs.info(x)

  expect(x.foo).toBe(1)
  // @ts-ignore
  expect(x.bar).toBe('bar')

})
