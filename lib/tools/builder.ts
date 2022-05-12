import {AttachHandler, NumberGenerator, PropertyExtractor, SortHandler} from '../types/types';
import {funcs} from '../types/funcs';

// 函数构造器
export default class builder {

  /**
   * 构建数组排序接口
   * @param [toNum] 对象到数值转换器
   * @return 排序转换器
   */
  static sort<T>(toNum: NumberGenerator<T>): SortHandler<T> {
    return (a: T, b: T) => toNum(a) - toNum(b)
  }

  /**
   * 属性提取接口
   * @param [prop='id']属性名称
   * @return 属性提取函数
   */
  static extra<T, R>(prop = 'id'): PropertyExtractor<T, R> {
    // @ts-ignore
    return (e: StringKeysJson<any>) => (e[prop] as R)
  }

  /**
   * 字符串属性值提取接口
   * @param [prop='id'] 属性名称
   * @return 属性提取函数
   */
  static extraString<T>(prop = 'id'): PropertyExtractor<T, string> {
    return builder.extra<T, string>(prop)
  }

  /**
   * 属性附加处理接口
   * @param v 附加值
   * @param prop {string} 索引
   * @return 属性附加接口
   */
  static attach<T, V>(v: V, prop: string): AttachHandler<T, V> {
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
  static lazy(action: () => any, wait = 1000, times = 1): funcs.IProcessor {
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
