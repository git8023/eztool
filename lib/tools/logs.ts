import {dates} from './dates'
import LogLevel = ifacer.LogLevel
import {ifacer} from '../../lib_bak/type/InterfaceDeclarer';
import {StringKeysJson} from '../../lib_bak/type/types';
import validators from './validators';
import arrays from './arrays';

// @ts-ignore
const MAX_NAME_LENGTH = Object.keys(LogLevel)
  .filter(e => isNaN(Number(e)))
  .sort((a, b) => a.length - b.length)
  .pop()
  .length

/**
 * 日志颜色定义
 */
const ConsoleFontColor: StringKeysJson<string> = {
  TRACE: '#585858',
  DEBUG: '#000000',
  INFO: '#00ffab',
  WARN: '#ffa200',
  ERROR: '#ac001c',
  FATAL: '#ff0000'
}

/**
 * 日志工具类
 */
export class ConsoleLogger implements ifacer.ILogger {
  private static _instance: ifacer.ILogger

  /**
   * 获取单例实例
   */
  static get instance() {
    if (!ConsoleLogger._instance) {
      ConsoleLogger._instance = new ConsoleLogger()
    }
    return ConsoleLogger._instance
  }

  level: LogLevel = LogLevel.TRACE
  cacheSize = 200
  enableTrace = false
  cacheStore: Array<{ lv: LogLevel, args: any[] }> = []

  trace = (...args: any[]) => this.log(LogLevel.TRACE, Array.from(args), true)
  debug = (...args: any[]) => this.log(LogLevel.DEBUG, Array.from(args))
  info = (...args: any[]) => this.log(LogLevel.INFO, Array.from(args))
  warn = (...args: any[]) => this.log(LogLevel.WARN, Array.from(args))
  error = (...args: any[]) => this.log(LogLevel.ERROR, Array.from(args))
  fatal = (...args: any[]) => this.log(LogLevel.FATAL, Array.from(args))

  constructor() {

    if (LogLevel.DEBUG === this.level) {
      // this.enableTrace = true;

      // @ts-ignore
      window.logs = this

      // @ts-ignore
      this.dir = {
        LogLevel,
        ConsoleFontColor,
        filter: (lv: LogLevel) => {
          this.cacheStore
            .filter(e => e.lv === lv)
            .map(e => e.args)
            .forEach(this.print.bind(this))
        }
      }
    }

  }

  /**
   * 输出日志信息
   * @param lv 打印等级
   * @param args 参数
   * @param enableTrace 是否打印堆栈
   * @private
   */
  private log(lv: LogLevel, args: any[], enableTrace = false) {
    if (lv < this.level) {
      return
    }
    this.enableTrace = enableTrace

    let lvName = LogLevel[lv]
    const color = 'color:' + ConsoleFontColor[lvName]

    let spCount = 0
    arrays.foreach(args, e => {
      const isStrParam = validators.is(e, 'String')
      if (isStrParam) {
        spCount++
      }
      return isStrParam
    })
    lvName = lvName.padStart(MAX_NAME_LENGTH)

    const date = dates.nowFmt('yyyy-MM-dd HH:mm:ss:S')
    const param = [
      `%c[${lvName}]%c -- [${date}]:` + ' %s'.repeat(spCount),
      color + '; padding:5px; background:rgba(0,0,0,.3); border-radius:5px;',
      color + '; border:0;background:transparent;',
      ...args
    ]
    this.cache(lv, param)

    this.print(param)
  }

  /**
   * 打印日志
   * @param param 参数
   * @private
   */
  private print(param: any[]) {
    console.log(...param)

    const isDebug = (this.level <= LogLevel.DEBUG)
    if (isDebug && this.enableTrace) {
      console.groupCollapsed('Debug Trance')
      console.trace()
      console.groupEnd()
    }
  }

  /**
   * 缓存日志
   * @param lv 日志等级
   * @param args 打印参数
   * @private
   */
  private cache(lv: LogLevel, args: any[]) {
    this.cacheStore.push({
      lv,
      args
    })
    while (this.cacheStore.length > this.cacheSize) {
      this.cacheStore.pop()
    }
  }
}

export const logs: ifacer.ILogger = ConsoleLogger.instance
