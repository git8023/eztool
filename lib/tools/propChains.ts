import converters from './converters';
import validators from './validators';
import arrays from './arrays';

/**
 * ONGL表达式解析对象
 */
class Ognl {
  floors = [] as number[];
  isArray = false;
  key = '';
  next = converters.anyO;
  nextKey = '';

  /**
   * 构建Ognl表达式对象
   * @param propChain 属性链描述字符串
   */
  constructor(private propChain: string) {
    this.parse()
  }

  private parse() {
    this.key = '';
    this.nextKey = '';
    this.isArray = false;
    this.floors = [];
    this.next = null;

    let objIndex = this.propChain.indexOf('.');
    let arrIndex = this.propChain.indexOf('[');

    if (-1 !== arrIndex) {
      if ((-1 === objIndex) || (arrIndex < objIndex)) {
        this.isArray = true;
      }
    }

    let hasMoreObj = (-1 !== objIndex);
    if (hasMoreObj) {
      this.key = this.propChain.substring(0, objIndex);
      this.nextKey = this.propChain.substring(objIndex + 1);
      this.next = new Ognl(this.propChain.substring(objIndex + 1));
    } else {
      this.key = this.propChain;
      this.next = null;
    }

    if (this.isArray) {
      let sp = this.key.split('[').filter((e) => e);
      this.key = parseInt(sp.shift()!).toString();
      for (let i in sp) {
        // 0] => 0
        // 截取索引部分
        let arrIndex = parseInt(sp[i]);
        this.floors.push(arrIndex);
      }
    }
  }

}

/**
 * 属性链工具
 */
export default class propChains {

  /**
   * 获取数组对象的值
   * @param data {Object} 数据对象
   * @param ognl {String} ognl表达式
   */
  static getArrOgnlVal(data: any, ognl: string) {
    // 获取数组对象
    let sIdx = ognl.indexOf('[');
    let arr: any[];

    // 数组对象需要从data子属性获取
    if (0 < sIdx) {
      let arrK = ognl.substring(0, sIdx);
      arr = data[arrK];
    }
    // ognl指向data自身
    else {
      arr = data;
    }

    let idxStr = ognl.substring(sIdx);
    let idxReg = /^(\[\d+\])+$/;
    if (!idxReg.test(idxStr)) {
      throw new Error('非法下标索引:' + idxStr);
    }

    // 获取值[1], [0][2]...
    let idxes = idxStr.split('][');

    // 一维数组
    if (1 === idxes.length) {
      let arrIndex = +idxStr.replace('[', '').replace(']', '');
      return arr[arrIndex];
    }

    // 多维数组
    let val = arr;
    // jstAPI.common.eachValue(idxes, function (v) {
    arrays.foreach(idxes, (v) => {
      if (validators.isNot(val, 'Array')) return false;
      val = val[parseInt((v + '').replace('[', '').replace(']', ''))]
    });
    return val;
  }

  /**
   * 获取属性值
   * @param data {Object} 数据对象
   * @param ognl {String} ognl表达式
   */
  static getValue<R>(data: any, ognl: string): R {
    if (validators.nullOrUndefined(data)) return null!;
    ognl = ognl.trim();

    let keys = ognl.split('.');
    if (1 === keys.length) {
      // 非数组
      let regex = /\[/;
      if (!regex.test(ognl)) {
        return data ? data[ognl] : data;
      } else {
        return propChains.getArrOgnlVal(data, ognl);
      }
    }

    let idx = ognl.indexOf('.');
    let key = ognl.substring(0, idx);
    let isArr = /\[\d+\]/.test(key);
    let d = isArr ? propChains.getArrOgnlVal(data, key) : data[key];
    let newOgnl = ognl.substring(idx + 1);
    return propChains.getValue(d, newOgnl);
  }
}
