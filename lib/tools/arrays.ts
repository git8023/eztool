import {ArrayOrNull, Json, JsonT, Part, StringOrIdableConvertor, TypeOrNull} from '../types/types';
import converters from './converters';
import {IDataProcessor} from '../types/funcs';
import validators from './validators';
import utils from './utils';
import jsons from './jsons';
import strings from './strings';
import logics from './logics';

type X = { a: string, b: number }

export default class arrays {

  /**
   * 对象数组通过指定属性名转换为JSON对象
   * @param arr 目标数组
   * @param [toKey] 转换接口
   * @param [recover=true] 是否允许覆盖重复值
   * @param [recursion=()=>null] 子属性递归函数, 默认不递归
   */
  static toMap<T>(
    arr: Array<T>,
    toKey: StringOrIdableConvertor<T> = 'id',
    recover = true,
    recursion: (el: T) => Array<T> | any = () => null
  ): JsonT<T> {

    const result: JsonT<T> = converters.cast();
    if (validators.nullOrUndefined(arr, toKey)) {
      return result
    }

    const fn = utils.toIdableConvertor(utils.as(toKey))
    arr.forEach((el, i) => {
      const key = fn(el, i);
      if (result[key]) {
        if (!recover) {
          throw new Error(`不允许重复Key [${key}]`)
        }
      }
      result[key] = el

      const children = logics.or<Array<T>>(recursion(el), [])
      if (undefined !== children && !!children.length) {
        const childrenMap = arrays.toMap<T>(children, toKey, recover, recursion)
        jsons.merge<JsonT<T>>(childrenMap, result, recover)
      }
    })

    return result
  }

  static toMapByKey<T extends Object>(
    arr: Array<T>,
    key: keyof T
  ): JsonT<T> {
    return this.toMap(arr, key as string)
  }

  /**
   * 获取所有数组交集元素
   * @param args
   */
  static intersection<T>(
    ...args: Array<T[]>
  ): T[] {
    if (validators.isNullOrUndefined(args)) {
      return []
    }

    // 仅一个数组
    const first = args[0]
    if (1 === args.length) {
      return first
    }

    // 获取最大数组长度
    args.sort((a, b) => a.length - b.length)
    const maxLenArr = args.pop()

    // 使用最长的数组与其他数组取交集
    // @ts-ignore
    return maxLenArr.filter(el => {
      let isInclude = true
      args.forEach(oel => {
        if (isInclude) {
          isInclude = isInclude && oel.includes(el)
        }
      })
      return isInclude
    })
  }

  /**
   * 查找元素(或递归满足条件的数组元素属性值)
   * @param arr 数组或元素(数组)属性值
   * @param observer {Function} 值观察者. 成功true否则返回false.
   * @param recursion {Function} 递归属性提取检视器. 没有递归属性返回null否则返回需要递归的数组属性值
   * @returns {TypeOrNull} 查询成功返回目标数据, 否则返回null
   */
  static seek<T>(
    arr: Array<T>,
    observer = (el: T, index?: number) => true as boolean,
    recursion = (el: T, index?: number) => null as ArrayOrNull<T>
  ): TypeOrNull<{ el: T, index: number }> {

    let result: TypeOrNull<{ el: T, index: number }> = null
    arrays.foreach(arr, (el, index) => {

      // 已经查询到需要的元素
      if (observer(el, index)) {
        result = {
          el,
          index
        }
        return false
      }

      // 检测是否需要递归查询
      const children = recursion(el, index)
      if (validators.is(children, 'Array')) {
        result = arrays.seek(<T[]>children, observer, recursion)
        if (null != result) {
          return false
        }
      }

      return true
    })

    return result
  }

  /**
   * 数组遍历
   * @param arr 数组
   * @param func 回调函数, 返回false停止遍历
   * @return {Array<T>} 原始数组
   */
  static foreach<T>(
    arr: Array<T>,
    func: (e: T, i: number) => (false | any)
  ): T[] {
    if (!validators.is(arr, 'Array')) {
      return arr
    }

    for (let i = 0, len = arr.length; i < len; i++) {
      if (false === func(arr[i], i)) {
        break
      }
    }

    return arr
  }

  /**
   * 追加唯一目标值, 如果校验存在则跳过
   * @param {Array<T>} arr 数组
   * @param {T} el 新元素
   * @param {string | ((el: T, i: number) => boolean)} predictor 唯一值属性名或比较器函数(返回true表示存在)
   * @return {number} 与e匹配的元素索引
   */
  static pushUnique<T>(
    arr: Array<T>,
    el: T,
    predictor?: string | ((el: T, i: number) => boolean)
  ): number {
    const foundIndex = arrays.indexA(arr, el, predictor)
    if (-1 !== foundIndex) {
      return foundIndex
    }
    return arr.push(el) - 1
  }

  /**
   * 查找索引
   * @param {Array<T>} arr 数组
   * @param {T} el 查找条件
   * @param {string | ((el: T, i: number) => boolean)} predictor 唯一值属性名或比较器函数(返回true表示找到)
   * @return {number} 索引, -1表示未找到
   */
  static indexA<T>(
    arr: Array<T>,
    el: T,
    predictor?: string | ((el: T, i: number) => boolean)
  ): number {
    let fn: (el: T, i: number) => boolean
    if (predictor instanceof Function) {
      fn = predictor;
    } else if (validators.is(predictor, 'String')) {
      fn = ((e: any) => e[predictor + ''] === (<any>el)[predictor + ''])
    } else if (!validators.isNullOrUndefined(predictor)) {
      throw new Error('predictor无效. 仅支持String|Function');
    } else {
      fn = (e => e === el)
    }

    let foundIdx = -1
    arrays.foreach<T>(arr, (el: T, i: number) => {
      if (fn(el, i)) {
        foundIdx = i
        return false
      }
    })
    return foundIdx
  }

  /**
   * 查找目标值
   * @param {Array<T>} arr 数组
   * @param {T} el 查找条件
   * @param {string | ((el: T, i: number) => boolean)} predictor 唯一值属性名或比较器函数(返回true表示找到)
   * @return {T | null} 查找成功返回目标值, 否则返回null
   */
  static findA<T>(
    arr: Array<T>,
    el: T,
    predictor?: string | ((el: T, i: number) => boolean)
  ): T | null {
    const i = arrays.indexA(arr, el, predictor)
    return -1 !== i ? arr[i] : null
  }

  /**
   * 删除
   * @param {Array<T>} arr 数组
   * @param {T} el 查找条件
   * @param {string | ((el: T, i: number) => boolean)} predictor 唯一值属性名或比较器函数(返回true表示找到)
   * @return {T | null} 删除成功返回被删除目标值, 否则返回null
   */
  static remove<T>(
    arr: Array<T>,
    el: any,
    predictor?: string | ((el: T, i: number) => boolean)
  ): T | null {
    const i = arrays.indexA(arr, el, predictor)
    if (-1 === i) {
      return null
    }
    return arr.splice(i, 1)[0]
  }

  /**
   * 数组减法运算(arrA - arrB), 对象匹配通过引用判定
   * @param arrA {Array<T>} 被修改数据
   * @param arrB {Array<T>} 目标数组
   * @return {Array<T>} 被修改数据
   */
  static removeAll<T>(
    arrA: Array<T>,
    arrB: Array<T>
  ): Array<T> {
    return arrA.filter(av => !arrB.includes(av))
  }

  /**
   * 合并
   * @param {Array<T>} dist 目标数组
   * @param {Array<T>} src 元素组
   * @return {Array<T>} 目标数组
   */
  static concat<T>(
    dist: Array<T>,
    src: Array<T>
  ): Array<T> {
    if (!validators.is(dist, 'Array') || !validators.is(src, 'Array')) {
      throw new Error('无效数组参数')
    }
    Array.prototype.push.apply(dist, src)
    return dist
  }

  /**
   * 是否包含指定值
   * @param {Array<T>} a 数组
   * @param {T} e 数组元素
   * @param {string | ((el: T, i: number) => boolean)} k 唯一值属性名或比较器函数(返回true表示找到)
   * @return {boolean} true-已包含, false-未包含
   */
  static contains<T>(
    a: Array<T>,
    e: T, k?: string | ((el: T, i: number) => boolean)
  ): boolean {
    return -1 !== arrays.indexA(a, e, k)
  }

  /**
   * 数组过滤
   * @param a {Array<any>} 目标数组
   * @param cb {(v: T, k: number) => boolean } 回调函数, false-删除, 其他-保留
   */
  static filter<T>(
    a: Array<T>,
    cb: (v: T, k?: number) => boolean | null
  ) {
    let delKeys: number[] = []
    arrays.foreach(a, (v: T, k: number) => {
      if (false === cb(v, k)) {
        delKeys.push(k)
      }
    })

    delKeys = delKeys.reverse()
    arrays.foreach(delKeys, (id: number) => a.splice(id, 1))
  }

  /**
   * 数组按指定关键字分组
   * @param a 数组
   * @param k 关键字, 仅支持一级属性名
   */
  static group<T extends Json>(
    a: Array<T>,
    k: StringOrIdableConvertor<T>
  ): JsonT<T[]> {
    const ret: JsonT<T[]> = {}

    const fn = utils.toIdableConvertor(k)
    arrays.foreach(a, (e: T, k) => {
      const rk = fn(e, k)
      const arr = ret[rk] || []
      arr.push(e)
      ret[rk] = arr
    })
    return ret
  }

  /**
   * 提取数组中每个元素的指定属性值到一个数组中
   * @param a {Array<T>} 数组
   * @param k {string} 元素中的属性名
   * @return {Array<P>} 属性值数组
   */
  static mapProp<T extends Json, P>(
    a: Array<T>,
    k: string
  ): Array<P> {
    const pa: P[] = []
    arrays.foreach(a, (e: T) => {
      if (validators.notNullOrUndefined(e[k])) {
        pa.push(e[k] as P)
      }
    })
    return pa
  }

  /**
   * 去重复
   * @param arr {Array<T>>} 数组
   * @param [cover=true] 是否对arr产生副作用
   * @return arr数组
   */
  static unique<T>(
    arr: Array<T>,
    cover = true
  ): Array<T> {
    const tmp = logics.or(arr, [])
    if (undefined === tmp) {
      return []
    }

    const uniqueArr: T[] = []
    arr.forEach(e => !uniqueArr.includes(e) && uniqueArr.push(e))

    if (cover) {
      arr.length = 0
      arrays.concat(arr, uniqueArr)
    }

    return arr
  }

  /**
   * 按指定属性值去重复
   * @param arr {Array<T>} 目标数组
   * @param func {StringOrIdableConvertor<T>} 属性名或ID提取器函数
   * @return {Array<T>} 处理后无序数组
   */
  static uniqueBy<T>(
    arr: Array<T>,
    func: StringOrIdableConvertor<T>
  ): Array<T> {
    return Object.values(arrays.toMap(arr, func))
  }

  /**
   * 数组合并
   * @param dist {Array<T>} 目标数组
   * @param otherArr {Array<Array<T>>} 源数组
   * @return {Array<T>} 目标数组
   */
  static merge<T>(
    dist: Array<T>,
    ...otherArr: Array<Array<T>>
  ): Array<T> {
    if (!validators.isEmpty(otherArr)) {
      arrays.foreach(otherArr, arr => arrays.concat<T>(dist, arr))
    }
    return dist
  }

  /**
   * 元素查找
   * @param arr 数组
   * @param proc 匹配器
   */
  static fetch<T>(
    arr: Array<T>,
    proc: IDataProcessor<T, boolean>
  ): { element: T, index: number } {
    const data = {
      element: arr[arr.length - 1],
      index: arr.length - 1
    }
    arrays.foreach(arr, (e, i) => {
      if (proc(e)) {
        data.element = e
        data.index = i
        return false
      }
    })
    return data
  }

  /**
   * 把对象按值对键进行分组
   * @param obj 对象
   * @param mapper 值映射器, 返回的数据key
   */
  static groupByValue<T>(
    obj: Part<T>,
    mapper?: IDataProcessor<T, string>
  ): JsonT<string[]> {
    const ret: JsonT<string[]> = converters.cast()

    const $mapper = mapper || strings.toString
    jsons.foreach(obj, (v, k) => {
      const sv = $mapper(v)
      const group = ret[sv] || []
      group.push(`${k}`)
      ret[sv] = group
    })

    return ret
  }

  /**
   * 生成一组连续值数组. 如果 <i> start >= end</i> 总是返回0长度数组.
   * @param start 开始值(包含)
   * @param end 结束值(包含)
   * @return 数组长度: end - start + 1
   */
  static genNums(
    start: number,
    end: number
  ): number[] {
    if (0 >= end - start) {
      return []
    }

    const keyIter = new Array(end + 1).keys()
    return [...keyIter].slice(start)
  }

  /**
   * 树形映射
   * @param arr 目标数组(会被直接改变)
   * @param [childKey = 'children'] 子节点在父节点的属性名, 覆盖现有属性名会报错.
   * @param [parentIndex = 'parent'] 子节点指向父节点属性名.
   * @param [parentKey = 'id'] 被子节点指向的父节点属性名.
   * @param [onlyRoot=false] 是否从根节点移除所有子节点.
   */
  static tree<T>(
    arr: T[],
    childKey = 'children',
    parentIndex = 'parent',
    parentKey = 'id',
    onlyRoot = false
  ): T[] {

    // 按parentKey映射所有节点
    const keyMapper: JsonT<T> = arrays.toMap(arr, parentKey)

    // 所有子节点映射值
    const childrenIds: string[] = []

    arrays.foreach(arr, (e: any) => {
      const pid = e[parentIndex]
      const parent: any = keyMapper[pid]
      if (!parent) return

      childrenIds.push(e[parentKey])
      const children = parent[childKey] || []
      children.push(e)
      parent[childKey] = arrays.unique(children)
    })

    // 移除子节点
    if (onlyRoot) {
      arrays.foreach(childrenIds, idKey => {
        delete keyMapper[idKey]
      })
    }

    return Object.values(keyMapper)
  }
}
