import converters from './converters';

export default class medias {

  /**
   * 视频截图
   * @param videoEl 视频控件
   * @return base64编码截图
   */
  static snapshot(videoEl: HTMLVideoElement): string {
    videoEl.pause();
    const videoRect = videoEl.getBoundingClientRect();
    const cvs = document.createElement('canvas');
    cvs.height = videoEl.videoHeight || videoRect.height;
    cvs.width = videoEl.width || videoRect.width;
    const ctx2d: CanvasRenderingContext2D = converters.cast(cvs.getContext('2d'));
    ctx2d.drawImage(videoEl, 0, 0, videoRect.width, videoRect.height);
    return cvs.toDataURL('image/png');
  }

  /**
   * 图片缩放
   * @param base64 图片base64数据
   * @param scale 缩放倍数
   * @return 异步处理结果
   */
  static scaleImg(base64: string, scale: number): Promise<string> {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const cvs = document.createElement('canvas');
        cvs.width = img.width * scale;
        cvs.height = img.height * scale;
        const c2d: CanvasRenderingContext2D = converters.cast(cvs.getContext('2d'));
        c2d.drawImage(img, 0, 0, cvs.width, cvs.height);
        const dataURL = cvs.toDataURL('image/png');
        resolve(dataURL);
      };
    });
  }
}
