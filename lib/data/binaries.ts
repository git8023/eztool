import {OptionalConsumer, OptionalDataProgress, Runner} from '../types/types';
import validators from '../tools/validators';
import converters from '../tools/converters';
import {funcs} from '../types/funcs';

export default class binaries {

  static blobToBytes(
    blob: Blob
  ): Promise<Uint8Array>;

  static blobToBytes(
    blob: Blob,
    syncFn: funcs.IDataConsumer<Uint8Array>
  ): void;

  /**
   * 同步或异步处理{@link Blob}转{@link Uint8Array}
   * @param blob 数据
   * @param syncFn 同步处理
   */
  static blobToBytes(
    blob: Blob,
    syncFn?: OptionalConsumer<Uint8Array>
  ): Promise<Uint8Array> | void {
    const promise = new Promise<Uint8Array>((resolve) => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(blob);
      fr.onload = () => {
        const uint8Array = new Uint8Array(converters.cast(fr.result));
        resolve(uint8Array);
      };
    });

    if (validators.isFunction(syncFn)) {
      promise.then(binaries.genRunner(syncFn));
    } else {
      return promise;
    }
  }

  /**
   * 异步处理{@link Blob}转{@link Uint8Array}
   * @param data 数据对象
   * @return 处理结果
   * @see Promise.then
   * @see Promise.catch
   */
  static toBytes(
    data: Blob | Uint8Array | any
  ): Promise<Uint8Array> {
    if (validators.isNullOrUndefined(data)) {
      return Promise.reject(new Error('数据无效'))
    }

    if (data instanceof Blob) {
      return binaries.blobToBytes(data);
    } else if (data instanceof Uint8Array) {
      return Promise.resolve(data);
    }

    return Promise.reject(new Error('暂不支持该类型转 Uint8Array'))
  }

  /**
   * 获取单个参数执行器函数, 返回值优先级顺序: finalRet > fn() > fn.arguments[0]
   * @param fn 逻辑函数
   * @param useFnRet 逻辑函数
   * @param [finalRet=undefined] 指定返回值
   * @return 执行器函数
   */
  static genRunner<T>(
    fn: OptionalDataProgress<T>,
    useFnRet = true,
    finalRet: T = converters.nil
  ): Runner<T> {
    return (data: T) => {
      return new Promise((resolve, reject) => {
        try {
          // 默认使用指定返回值
          let retData = finalRet;

          // 执行函数
          if (fn && validators.is(fn, 'Function')) {
            let fnRet = fn(data);
            // 优先使用特定返回值
            if (validators.isNullOrUndefined(finalRet) && useFnRet) {
              retData = fnRet;
            }
          }

          // 最后使用参数
          if (validators.isNullOrUndefined(retData)) {
            retData = data;
          }

          resolve(retData)
        } catch (e) {
          reject(e)
        }
      });
    };
  }
}
