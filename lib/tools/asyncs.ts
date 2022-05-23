import {funcs} from '../types/funcs';
import {PromiseLike, ROP} from '../types/types';

type StopFn = funcs.IProducer<any>
type IntervalCallT = false | undefined | any
type IntervalCallP = ROP<IntervalCallT>
type TimerId = any

export default class asyncs {

  /**
   * 延迟执行
   * @param call 回调函数
   * @param lazy 延迟时长
   * @return 定时器id
   * @see setTimeout
   */
  static lazy(
    call: funcs.IProcessor,
    lazy = 0
  ): TimerId {
    return setTimeout(call, lazy)
  }

  /**
   * 定时器
   * @param call 执行主体
   * @param [lazy = 0] 等待时长/ms
   * @param [immediate = false] 是否立即执行一次
   * @param [loop = true] 是否循环执行
   */
  static interval(
    call: funcs.IProcessor,
    lazy: number,
    immediate: boolean,
    loop: boolean
  ): TimerId;

  /**
   * 定时器
   * @param call 执行主体, 返回 Falsy 停止, 或调用[手动停止函数]停止
   * @param [lazy = 0] 等待时长/ms
   * @param [immediate = false] 是否立即执行一次
   * @param [loop = true] 是否循环执行
   * @param [waitForCall = false] 是否需要等待执行主体返回后才进行下一次
   * @return 手动停止函数
   */
  static interval(
    call: funcs.IProcessor,
    lazy: number,
    immediate: boolean,
    loop: boolean,
    waitForCall: boolean
  ): StopFn;

  /**
   * 定时器
   * @param call 执行主体
   * @param [lazy = 0] 等待时长/ms
   * @param [immediate = false] 是否立即执行一次
   * @param [loop = true] 是否循环执行
   * @param [waitForCall = false] 是否需要等待执行主体返回后才进行下一次
   */
  static interval(
    call: funcs.IProducer<IntervalCallP>,
    lazy = 0,
    immediate = false,
    loop = true,
    waitForCall = false
  ): TimerId | StopFn {

    // 不需要等待主体返回
    if (!waitForCall) {
      if (immediate) call();
      const timerId = setInterval(() => {
        call()
        if (!loop) clearInterval(timerId)
      }, lazy);
      return timerId;
    }

    const innerStat = {loop: loop}

    // 需要等待执行主体返回
    const timer = () => {
      return this.tryCall<IntervalCallP>(call)
    }

    // 循环执行器
    const looper = () => {
      timer()
        .then((cr) => {
          if (cr instanceof Promise) {
            return cr as IntervalCallP
          }
          return Promise.resolve(cr as IntervalCallT)
        })
        .then((cr: IntervalCallT) => {
          if (false !== cr && loop) {
            this.lazy(looper, lazy)
          }
        })
    }

    // 立即执行一次
    if (immediate) {
      looper()
      return () => {
        innerStat.loop = false
      }
    }

    // 等待指定时长后执行
    const timerId = this.lazy(looper);
    return () => {
      clearTimeout(timerId)
      innerStat.loop = false
    }
  }

  /**
   * 异步调用(同步)执行主体
   * @param call 执行主体
   */
  static tryCall<T>(call: funcs.IProducer<ROP<T>>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        const cr = call()
        resolve(cr)
      } catch (e) {
        reject(e)
      }
    })
  }

  /**
   * 异步调用(异步)执行主体
   * @param call 执行主体
   */
  static manCall<T>(call: funcs.IDataConsumer<PromiseLike<T>>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      try {
        call({
          reject,
          resolve
        })
      } catch (e) {
        reject(e)
      }
    })
  }

}
