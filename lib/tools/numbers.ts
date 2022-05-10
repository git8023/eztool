export enum NumberFormatType {
  CURRENCY,
}

// 数值工具
export default class numbers {

  /**
   * 数字格式化
   * @param num 数字值
   * @param type 格式类型
   */
  static format(num: number, type: NumberFormatType = NumberFormatType.CURRENCY): string {
    switch (type) {
      case NumberFormatType.CURRENCY: {
        return num.toLocaleString('zh-Hans-CN', {currency: 'CNY'})
      }
    }
  }

}
