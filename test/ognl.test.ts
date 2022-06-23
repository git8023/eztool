import propChains from '../lib/tools/propChains';

test('ognl: getValue a', () => {
  const data = {a: 1}
  let val = propChains.getValue(data, 'a');
  expect(1).toBe(val)
})

test('ognl: getValue a.b', () => {
  const data = {
    a: {b: 1}
  }
  let val = propChains.getValue(data, 'a.b');
  expect(1).toBe(val)
})

test('ognl: getValue a.b.c', () => {
  const data = {
    a: {b: {c: 1}}
  }
  let val = propChains.getValue(data, 'a.b.c');
  expect(1).toBe(val)
})

test('ognl: getValue [1]', () => {
  const data = [1, 2, 3];
  let value = propChains.getValue(data, '[1]');
  expect(2).toBe(value)
})

test('ognl: getValue [1][0]', () => {
  const data = [1, [2], 3];
  let value = propChains.getValue(data, '[1][0]');
  expect(2).toBe(value)
})

test('ognl: getValue [1].a', () => {
  const data = [1, {a: 2}, 3];
  let value = propChains.getValue(data, '[1].a');
  expect(2).toBe(value)
})

test('ognl: getValue [1].a[1]', () => {
  const data = [1, {a: [1, 2]}, 3];
  let value = propChains.getValue(data, '[1].a[1]');
  expect(2).toBe(value)
})

test('ognl: getValue a.b[1]', () => {
  const data = {a: {b: [1, 2]}}
  let value = propChains.getValue(data, 'a.b[1]');
  expect(2).toBe(value)
})

// 中括号索引必须是数字
// test('ognl: getValue a.b["c"]', () => {
//   const data = {a: {b: {c: 2}}}
//   let value = propChains.getValue(data, 'a.b[c]');
//   expect(2).toBe(value)
// })
