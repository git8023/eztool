export default class converters {

  /**
   * undefined 初始化为任意类型
   */
  static get nil() {
    return (undefined as any);
  }

  /**
   * [] as any[]
   */
  static get anyA() {
    return [] as any[]
  }

  /**
   * {} as any
   */
  static get anyO() {
    return this.cast() as any
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
