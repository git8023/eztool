import {funcs} from '../types/funcs';
import converters from '../tools/converters';
import asyncs from '../tools/asyncs';

/**
 * 事件对象<p>
 * @param T ArrayStream<T> <p>
 * @param E 数据类型
 */
interface Event<T, E> {
  /** 流对象 */
  $: T;

  /** 数据 */
  data: E;
}

/**
 * 数据处理接口<p>
 * @param T ArrayStream<T><p>
 * @param E 数据类型
 */
type DataProcessor<T, E> = funcs.IDataProcessor<Event<T, E>, false | void | null | undefined | any>

/**
 * 数组流式处理
 */
export default class ArrayStream<T> {

  /**
   * 当前游标
   * @private
   */
  private _cursor = 0;

  /**
   * 手动中断标记
   * @private
   */
  private _broken = {
    mark: false,
    data: converters.nil as any
  };

  /**
   * 回调接口仓库
   * @private
   */
  private calls = {
    done: converters.nil as DataProcessor<ArrayStream<T>, T[]>,
    next: converters.nil as DataProcessor<ArrayStream<T>, T>
  };

  /**
   * 需要被移除的数组下标
   * @private
   */
  private removableIndexes: number[] = converters.anyA;

  /**
   * 创建数组流式处理对象
   * @param arr 数组
   */
  constructor(private arr: T[]) {
  }

  /**
   * 获取游标指向的元素
   */
  get current() {
    return this.arr[this._cursor];
  }

  /**
   * 获取游标
   */
  get cursor() {
    return this._cursor;
  }

  /**
   * 是否还有下个元素
   */
  get hasNext() {
    return !this._broken.mark && this.arr.length > this._cursor;
  }

  /**
   * 获取是否手动中断标记
   */
  get isBroken() {
    return this._broken.mark;
  }

  /**
   * 获取中断标记信息
   */
  get brokenData() {
    return this._broken.data;
  }

  /**
   * 游标下移
   * @private
   */
  private nextCursor() {
    this._cursor++;
  }

  /**
   * 获取处理完成后的数据
   * @private
   */
  private getData() {
    const indexes = this.removableIndexes.sort()
      .reverse();
    const data = [...this.arr];
    indexes.forEach((index) => data.splice(index, 1));
    return data;
  }

  /**
   * 处理下一个值
   */
  next() {
    if (!this.hasNext) {
      const data = this.getData();
      this.calls.done({
        $: this,
        data
      });
      return;
    }

    const data = this.current;
    this.nextCursor();
    this._broken.mark = this.calls.next({
      $: this,
      data
    });
  }

  /**
   * 移除当前值并处理下一个值
   */
  removeAndNext() {
    this.removableIndexes.push(this.cursor);
    this.next();
  }

  /**
   * 中断迭代
   * @param data 中断信息
   */
  broken(data: any) {
    this._broken.mark = true;
    this._broken.data = data;
    this.next();
  }

  /**
   * 异步处理每个元素<br>
   * 【注意】: 调用该接口会立即触发异步进程
   * @param call 处理逻辑, 返回false停止处理
   */
  onNext(call: DataProcessor<ArrayStream<T>, T>): ArrayStream<T> {
    this.calls.next = call;
    asyncs.lazy(this.next.bind(this));
    return this;
  }

  /**
   * 迭代结束时执行
   * @param call 回调函数
   */
  onDone(call: funcs.IDataConsumer<Event<ArrayStream<T>, T[]>>): ArrayStream<T> {
    this.calls.done = call;
    return this;
  }
}
