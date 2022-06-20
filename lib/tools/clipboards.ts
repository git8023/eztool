import utils from './utils';

interface Handler<T> {
  set(val: T): Promise<boolean>;

  get(): Promise<T>;
}

/**
 * 剪贴板
 */
export default class clipboards {

  /**
   * 文本内容操作
   */
  static text: Handler<string> = {
    set(val: string): Promise<boolean> {
      return utils.async<boolean>(res => {
        // 剪贴板事件处理
        const evtHandle = (e: ClipboardEvent) => {
          let isOk = false;
          try {
            if (e.clipboardData) {
              e.clipboardData.setData('text/plain', val);
              e.preventDefault();
              isOk = true;
            }
            document.removeEventListener('copy', evtHandle);
          } catch (e) {
            res.reject(e);
            return
          }

          res.resolve(isOk);
        };

        document.addEventListener('copy', evtHandle);
        document.execCommand('copy');
      })
    },
    get(): Promise<string> {
      return Promise.reject(new Error('unsupported'));
      // return utils.async<string>(res => {
      //   // 剪贴板事件处理
      //   const evtHandle = (e: ClipboardEvent) => {
      //     let text = '';
      //     try {
      //       if (e.clipboardData) {
      //         text = e.clipboardData.getData('text/plain');
      //         e.preventDefault();
      //       }
      //       document.removeEventListener('paste', evtHandle);
      //     } catch (e) {
      //       res.reject(e);
      //       return
      //     }
      //     res.resolve(text);
      //   };
      //
      //   document.addEventListener('paste', evtHandle);
      //   document.execCommand('paste');
      // })
    }
  }

}
