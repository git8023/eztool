import converters from './converters';
import {DoneHandler, IdableConvertor, Json, JsonT, StringOrIdableConvertor} from '../types/types';
import builder from './builder';
import validators from './validators';
import arrays from './arrays';
import {EachHandler, WithKeysHandler} from '../types/ifacer';
import {funcs} from '../types/funcs';

export default class utils {

  /**
   * 延迟执行
   * @param fn 执行逻辑
   * @param lazyTime 延迟时长(ms)
   */
  static lazy(
    fn: funcs.IProcessor,
    lazyTime = 0
  ) {
    const lazy = builder.lazy(fn, lazyTime);
    lazy();
  }

  /**
   * StringOrIdableConvertor 转 IdableConvertor
   * @param fn {StringOrIdableConvertor} 字符串或处理函数
   * @return IdableConvertor<T>
   */
  static toIdableConvertor<T extends JsonT<any>>(
    fn: StringOrIdableConvertor<T>
  ): IdableConvertor<T> {
    if (validators.is(fn, 'String')) {
      const key: string = converters.cast(fn);
      return (e: T) => e[key]
    }
    return fn as IdableConvertor<T>
  }

  /**
   * @deprecated
   * 通过逻辑或(||)获取第一个真值数据
   * @param args 值列表
   * @returns 列表中至少包含一个值时返回第一个真值(否则返回最后一个值),
   *          如果沒有传递任何数据总是返回undefined
   */
  static or<T>(
    ...args: T[]
  ): T | undefined {
    args = <T[]>(args || [])
    for (const key in args) {
      if (validators.isTruthy(args[key])) {
        return args[key]
      }
    }

    return args.length ? args[args.length - 1] : undefined
  }

  /**
   * 浅层合并两个对象
   * @param src 数据提供者
   * @param dest 数据接受者
   * @param [recover=true] 出现同名属性是否允许覆盖；
   *                        指定为false时不会执行合并操作, 并可通过返回值获取具体重复的属性名列表
   * @returns 检测到重复的属性名, 如果不存在重复属性名总是返回空数组
   */
  static mergeJson<T>(
    src: T,
    dest: T,
    recover = true
  ): string[] {
    const repeatedKeys = utils.extractRepeatKeys<T>(src, dest)
    if (repeatedKeys.length) {
      if (!recover) {
        return repeatedKeys
      }
    }
    Object.assign(dest, src)
    return []
  }

  /**
   * 提取对象列表中重复的属性名
   * @param vs 对象列表
   * @returns 通过枚举方式查找的重复属性名列表
   */
  static extractRepeatKeys<T>(
    ...vs: T[]
  ): string[] {
    const keysArr = new Array<string[]>()
    const vsR = this.or(vs, [])
    if (undefined === vsR) {
      return []
    }

    vsR.forEach(value => {
      if (validators.notNullOrUndefined(value)) {
        keysArr.push(Object.keys(value))
      }
    })

    return arrays.intersection<string>(...keysArr)
  }

  /**
   * 对象深拷贝, 只针对JSON对象有效
   * @param o 目标对象
   * @returns 拷贝后对象
   */
  static cloneDeep<T>(
    o: T
  ): T {
    if (validators.isNullOrUndefined(o)) {
      // @ts-ignore
      return <T>null
    }
    return JSON.parse(JSON.stringify(o))
  }

  /**
   * 遍历对象属性
   * @param o {object} 对象
   * @param func {(v: any, k: string) => (boolean | void)} 返回false停止后续, 否则直到结束
   */
  static foreach(
    o: any,
    func: (v: any, k: string) => (false | any | void | undefined)
  ) {
    if (validators.nullOrUndefined(o)) return
    arrays.foreach(Object.keys(o), k => {
      return func(o[k], k)
    })
  }

  /**
   * isNullOrUndefined(val) ? defV : val
   * @param val {any} 目标值
   * @param defV {any} 默认值
   * @see validators#isNullOrUndefined
   */
  static defaultIfNullOrUndefined<T>(
    val: T,
    defV: T
  ): T {
    return validators.isNullOrUndefined(val) ? defV : val
  }

  /**
   * if-else封装
   * @param c {boolean} 判断条件
   * @param a {T} 值a
   * @param b {T} 值b
   * @return {T} c?a:b
   */
  static iif<T>(
    c: boolean,
    a: T,
    b: T
  ): T {
    return c ? a : b
  }

  /**
   * 属性覆盖
   * @param to {T extends StringKeysJson<any>} 目标对象
   * @param from {any} 源对象
   * @param [useTo=true] {boolean} true-从目标对象获取键列表, false-从源对象获取键列表
   * @param [nullable=false] {boolean} true-允许null/undefined覆盖
   * @return {any} 目标对象
   */
  static cover<T extends Json>(
    to: any,
    from: any,
    useTo = true,
    nullable = false
  ): T {
    const keysFrom = this.cloneDeep(useTo ? to : from)
    Object.keys(keysFrom).forEach(k => {
      if (validators.isNullOrUndefined(from[k]) && !nullable) {
        return
      }
      to[k] = from[k]
    })
    return to
  }

  /**
   * 属性值关联遍历
   * @param a {StringKeysJson} 属性名提供对象
   * @param b {StringKeysJson} 其他联合处理对象
   * @return {WithKeysHandler}
   */
  static withKeys(
    a: Json,
    b: Json
  ): WithKeysHandler {
    const that = this;
    const ret: WithKeysHandler = {
      each(func: EachHandler) {
        setTimeout(() => {
          that.foreach(a, (av, k) => func(av, b[k], k))
          ret._done(a, b)
        })
        return ret
      },
      over(func: DoneHandler) {
        ret._done = func
        return ret
      },
      _done: <DoneHandler>((a, b) => {
      })
    }
    return ret
  }

  /**
   * 目标对象转换为JSON字符串
   * @param obj {object|string} 目标对象
   * @return {string} JSON字符串
   */
  static toJsonStr(
    obj: string | any
  ): string {
    if (validators.isNot(obj, 'String')) {
      obj = JSON.stringify(obj)
    }
    return <string>obj
  }

  /**
   * 安全执行函数
   * @param thisArg 上下文
   * @param fn 函数
   * @param args 执行参数
   * @return 处理结果
   */
  static exec<T>(
    thisArg: any,
    fn: (...arg: any[]) => T,
    ...args: any[]
  ): T {
    if (!validators.is(fn, 'Function')) {
      throw new Error('fn Not Function')
    }
    return fn.apply(thisArg, args)
  }

  /**
   * 从对象中获取值, 如果没有就计算并保存新值
   * @param store 数据仓库
   * @param key 属性名
   * @param fp 属性值计算过程
   */
  static computeIfAbsent<T>(
    store: any,
    key: string | number,
    fp: funcs.IProducer<T> = (() => ({} as T))
  ): T {
    if (!(key in store)) {
      store[key] = fp()
    }
    return store[key]
  }

  /**
   * 转换为指定类型
   * @param [o={}] 源数据
   * @return 目标类型
   */
  static as(
    o: any = {}
  ): any {
    return o;
  }

  /**
   * 异步执行
   * @param call 执行主体函数
   */
  static async<T>(
    call: funcs.IDataConsumer<{ reject: funcs.IProcessor, resolve: funcs.IDataConsumer<T> }>
  ) {
    return new Promise<T>((resolve, reject) => {
      call({
        resolve,
        reject
      })
    })
  }
}
