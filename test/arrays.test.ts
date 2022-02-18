import {arrays} from '../lib'

test('array.toMap: Single array ', () => {
  let ret = arrays.toMap([1, 2, 3], (e, k) => k)
  expect({0: 1, 1: 2, 2: 3}).toEqual(ret)
})

test('array.toMap: Complex array', () => {
  let ret = arrays.toMap([{id: 1}, {id: 2}]);
  expect({1: {id: 1}, 2: {id: 2}}).toEqual(ret);
})

test('array.intersection: Complex array', () => {
  let data = {id: 1};
  let is = arrays.intersection([0, 1, 2, data], [0, data]);
  expect([0, data]).toEqual(is);

  expect([]).toEqual(arrays.intersection([0, 1, 2], [3, 4]));
})

test('array.seek', () => {
  let arr = [{id: 0, foo: [{id: 2}, {id: 3}]}, {id: 1}];
  let ret = arrays.seek(arr, el => 3 === el.id, el => {
    if (el.foo) return el.foo;
    return null;
  });
  expect({el: {id: 3}, index: 1}).toEqual(ret);
})

test('array.foreach', () => {
  let ret: number[] = [];
  arrays.foreach([1, 2, 3, 4, 5, 6, 7], e => {
    // 进入下次循环
    if (0 === e % 2) {
      return true;
    }

    // 只处理 5 以前的数据
    if (5 <= e) {
      return false;
    }

    ret.push(e);
  });
  expect([1, 3]).toEqual(ret);
})

test('array.pushUnique', () => {
  expect(0).toBe(arrays.pushUnique([1, 2, 3], 1))
  expect(2).toBe(arrays.pushUnique([{id: 1}, {id: 2}], {id: 3}, 'id'))
  expect(1).toBe(arrays.pushUnique([1, {id: 2}, 3], {id: 2}, (el: any) => 2 === el.id))
})

test('array.indexA', () => {
  expect(0).toBe(arrays.indexA([1, 2, 3], 1))
  expect(1).toBe(arrays.indexA([{id: 1}, {id: 2}], {id: 2}, 'id'))
  expect(-1).toBe(arrays.indexA([{id: 1}, {id: 2}], {id: 3}, 'id'))
})

test('array.findA', () => {
  expect(arrays.findA([1, 2, 3], 1)).toBe(1)
  expect({id: 2, foo: 'foo'}).toEqual(arrays.findA([{id: 1}, {id: 2, foo: 'foo'}], {id: 2}, 'id'))
  expect(arrays.findA([{id: 1}, {id: 2}], {id: 3}, 'id')).toBeNull()
})

test('arrays.remove', () => {
  const arr = [1, 2, {id: 3, foo: 'foo'}, {id: 4, bar: 'bar'}, 'b']
  expect(arrays.remove(arr, 1)).toBe(1)
  expect(arrays.remove(arr, {id: 3}, 'id')).toEqual({id: 3, foo: 'foo'})
  expect(arrays.remove(arr, null, (el, i) => i === el)).toBeNull()
  expect(arrays.remove<any>(arr, null, el => 'bar' === el.bar)).toEqual({id: 4, bar: 'bar'})
})

test('arrays.removeAll', () => {
  const arrA = [1, 2, 3]
  const arrB = ['a', 2, 'b']
  expect(arrays.removeAll(arrA, arrB)).toEqual([1, 3])
  expect(arrays.removeAll(arrB, arrA)).toEqual(['a', 'b'])
  expect(arrA).toEqual([1, 2, 3])
  expect(arrB).toEqual(['a', 2, 'b'])

  const el = {id: 2}
  const arrC = [{id: 1}, el, el];
  const arrD = [{id: 2}, {id: 2, bar: 'bar'}, el];
  expect(arrays.removeAll<any>(arrC, arrD)).toEqual([{id: 1}])
  expect(arrays.removeAll<any>(arrD, arrC)).toEqual([{id: 2}, {id: 2, bar: 'bar'}])
})
