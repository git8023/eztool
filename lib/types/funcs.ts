export namespace funcs {

  /**
   * 数据消费者
   *
   * 处理完成后不需要处理结果
   *
   * T - 待处理数据类型
   *
   * @param res {?} 待处理数据
   */
  export interface IDataConsumer<T> {
    (res: T): void
  }

  /**
   * 数据处理器<br>
   * 处理完成后需要返回处理结果<br>
   * I - 输入数据类型<br>
   * O - 输出数据类型<br>
   * @param res 输入数据
   */
  export interface IDataProcessor<I, O> {
    (res: I): O
  }

  /**
   * 过程处理器
   *
   * 过程处理不需要输入/输出数据
   */
  export interface IProcessor {
    (): void
  }

  /**
   * 数据生产者
   *
   * @param T 产品类型
   */
  export interface IProducer<T> {
    (): T
  }

  /**
   * 迭代处理器接口
   */
  export interface IEachHandler<T> {
    /**
     * @param val 值
     * @param key (数组)下标或(对象)属性名
     * @return {false|any} 停止迭代返回false, 其他值继续下一个迭代
     */
    (val: T, key: string | number): false | any
  }

  /**
   * 对象合并处理接口
   */
  export interface IMergeHandler {
    /**
     * @param av 对象a属性值
     * @param bv 对象b属性值
     * @param key 属性名
     * @return {false|any} 停止迭代返回false, 其他值继续下一个迭代
     */
    (av: any, bv: any, key: string): boolean | any;
  }
}
