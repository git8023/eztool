import {AttachHandler, NumberGenerator, PropertyExtractor, SortHandler} from '../types/types';
import {funcs} from '../types/funcs';
import converters from './converters';
import validators from './validators';

// 函数构造器
export default class builder {

  /**
   * 构建复杂对象排序比较器
   * @param kog Key or NumberGenerator
   * @return 比较函数
   */
  static sort<T>(
    kog: (keyof T) | NumberGenerator<T>
  ): SortHandler<T> {
    let toNum: NumberGenerator<T> = converters.cast(kog);
    if (validators.is(kog, 'String')) toNum = (e: any) => e[kog]
    return (a: T, b: T) => toNum(a) - toNum(b)
  }

  /**
   * 属性提取接口
   * @param [prop='id']属性名称
   * @return 属性提取函数
   */
  static extra<T, R>(
    prop = 'id'
  ): PropertyExtractor<T, R> {
    // @ts-ignore
    return (e: StringKeysJson<any>) => (e[prop] as R)
  }

  /**
   * 字符串属性值提取接口
   * @param [prop='id'] 属性名称
   * @return 属性提取函数
   */
  static extraString<T>(
    prop = 'id'
  ): PropertyExtractor<T, string> {
    return builder.extra<T, string>(prop)
  }

  /**
   * 属性附加处理接口
   * @param v 附加值
   * @param prop {string} 索引
   * @return 属性附加接口
   */
  static attach<T, V>(
    v: V,
    prop: string
  ): AttachHandler<T, V> {
    return (e: T) => {
      // @ts-ignore
      e[prop] = v
      return e
    }
  }

  /**
   * 懒加载
   * @param action 动作. 要使用this必须手动绑定 action.bind(this)
   * @param [wait=3000] 等待时长, 单位毫秒
   * @param [times=1] 执行次数. 小于1无限制
   * @return 过程处理(无参数, 无返回值)
   */
  static lazy(
    action: funcs.IProcessor,
    wait = 1000,
    times = 1
  ): funcs.IProcessor {
    const infinity = (0 >= times)
    return () => {
      setTimeout(() => {
        action()
        if (!infinity && (--times <= 0)) {
          return
        }
        builder.lazy(action, wait, times)
      }, wait)
    }
  }
}
