import {IDataConsumer} from '../types/funcs';
import validators from '../tools/validators';
import {Optional, OptionalConsumer} from '../types/types';
import converters from '../tools/converters';

export default class base64 {

  /**
   * 转换为字节数组
   * @param base64 base64字符串
   */
  static toBytes(base64: string): Uint8Array {
    const data = window.atob(base64.split(',')[1]);
    const bytes = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      bytes[i] = data.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * 图片转base64
   * @param imgSrc 图片地址
   */
  static toBase64(imgSrc: string): Promise<string>;

  /**
   * 图片转base64
   * @param imgSrc 图片地址
   * @param syncFn 同步处理函数
   */
  static toBase64(imgSrc: string, syncFn: IDataConsumer<string>): void;

  /**
   * 图片转base64
   * @param imgSrc 图片地址
   * @param [syncFn=undefined] 同步处理函数
   * @return 异步处理对象
   */
  static toBase64(imgSrc: string, syncFn?: OptionalConsumer<string>): Promise<string> {
    const promise = new Promise<string>((resolve) => {
      const img = new Image();
      img.src = imgSrc;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context: CanvasRenderingContext2D = converters.cast(canvas.getContext('2d'));
        context.drawImage(img, 0, 0, img.width, img.height);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
    });

    return promise.then((value) => {
      if (syncFn && validators.is(syncFn, 'Function')) {
        syncFn(value);
      }
      return value;
    });
  }

  /**
   * 提取base64编码的图片内容
   * @param imgStrData 图片base64编码内容
   * @return 解析成功返回图片字节数组, 否则返回null
   */
  static toImgBytes(imgStrData: string): Optional<Uint8Array> {
    const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
    if (!base64Regex.test(imgStrData)) {
      return null;
    }
    const encodeStr = imgStrData.replace(base64Regex, '');

    // // For nodejs
    // if (typeof Buffer !== 'undefined' && Buffer.from) {
    //   return Buffer.from(encodeStr, 'base64');
    // }

    // For browsers :
    const decodeStr = base64.decode(encodeStr);
    const len = decodeStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = decodeStr.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * base64编码
   * @param s 原始字符串
   * @return 编码后字符串
   */
  static encode(s: string): string {
    return window.btoa(s)
  }

  /**
   * base64解码
   * @param s 编码字符串
   * @return 解码字符串
   */
  static decode(s: string): string {
    return window.atob(s)
  }
}
