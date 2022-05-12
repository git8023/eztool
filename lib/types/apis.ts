import {DoneHandler} from './types';
import {funcs} from './funcs';

export namespace apis {
  /**
   * 可被查询接口
   */
  export interface IFetch<K, V> {

    /**
     * 通过关键字查询目标值
     * @param key 关键字
     * @param [def] 查询失败默认值
     * @return 查询结果处理器
     */
    fetch(key: K, def: V): IFetchHandler<V>;
  }

  /**
   * 查询结果处理器
   *
   * T - 数据类型
   */
  export interface IFetchHandler<T> {

    /**
     * 获取原始数据对象
     */
    value(): T;

    /**
     * 处理数据
     * @param proc 数据处理接口
     */
    handle<R>(proc: funcs.IDataProcessor<T, R>): R;
  }

  /**
   * 事件注册中心
   *
   * 实现类需要自定义事件处理器缓存仓库
   */
  export interface IEventRegistry<K> {

    /**
     * 注册事件
     * @param type 事件类型
     * @param proc 事件数据处理器. 处理成功返回true, 其余返回值认为处理失败
     * @return 注册中心
     */
    register<T>(type: K, proc: funcs.IDataConsumer<T>): IEventRegistry<K>;

  }

  /**
   * 对象合并接口
   */
  export interface IMerge {

    /**
     * 属性迭代
     * @param func 迭代处理函数
     * @return 合并接口对象
     */
    each(func: funcs.IMergeHandler): IMerge;

    /**
     * 结束
     * @param func 迭代结束处理函数
     * @return 合并接口对象
     */
    over(func: DoneHandler): IMerge;

    [s: string]: any;
  }
}
