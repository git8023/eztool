import validators from './validators';

export default class logics {

  /**
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

  /**
   * 抛出异常
   * @param msg 异常消息
   */
  static throw(msg: string) {
    throw new Error(msg);
  }
}
