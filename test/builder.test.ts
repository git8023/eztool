import builder from '../lib/tools/builder';

test('builder.sort', () => {
  const arr = [
    {a: 1},
    {a: 2},
    {a: 3},
    {a: 5},
    {a: 4},
    {a: 6}
  ]
  const r = arr.sort(builder.sort<{ a: number }>('a'));
  expect(r[0].a).toBe(1)
  expect(r[5].a).toBe(6)
})
