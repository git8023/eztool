import {IProcessor} from '../types/funcs';
import {builder, validators} from '../../lib_bak';
import {IdableConvertor, StringOrIdableConvertor} from '../../lib_bak/type/types';
import converters from './converters';
import {JsonT} from '../types/types';

export default class utils {

  /**
   * 延迟执行
   * @param fn 执行逻辑
   * @param lazyTime 延迟时长(ms)
   */
  static lazy(fn: IProcessor, lazyTime = 0) {
    const lazy = builder.lazy(fn, lazyTime);
    lazy();
  }

  /**
   * StringOrIdableConvertor 转 IdableConvertor
   * @param fn {StringOrIdableConvertor} 字符串或处理函数
   * @return IdableConvertor<T>
   */
  static toIdableConvertor<T extends JsonT<any>>(fn: StringOrIdableConvertor<T>): IdableConvertor<T> {
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
  static or<T>(...args: T[]): T | undefined {
    args = <T[]>(args || [])
    for (const key in args) {
      if (validators.isTruthy(args[key])) {
        return args[key]
      }
    }

    return args.length ? args[args.length - 1] : undefined
  }
}
