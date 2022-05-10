export default class converters {

  /**
   * undefined 初始化为任意类型
   */
  static get nil() {
    return (undefined as any);
  }

  /**
   * 指定对象转换为目标类型
   * @param [o={}] 对象
   * @return 目标类型
   */
  static cast<T>(o: any = {}): T {
    return o as T;
  }

}
