import { Dialog } from './Dialog.js';

/** Résumé window: loads resume.html in the current language and links the matching PDF. */
export class ResumeDialog extends Dialog {
  constructor({ frame, downloadLink, i18n, ...options }) {
    super(options);
    this.frame = frame;
    this.downloadLink = downloadLink;
    this.i18n = i18n;
  }

  /** Continues the intro scene: the window grows out of the one opened on the retro desktop. */
  entrance() {
    return {
      duration: 560,
      keyframes: [
        { opacity: 0, transform: 'translateY(4vh) scale(.6)' },
        { opacity: 1, transform: 'none' },
      ],
    };
  }

  /** Starts loading the résumé ahead of time, so opening the window is instant. */
  preload() {
    const source = `resume.html?lang=${this.i18n.language}&embed=1`;
    if (!this.frame.src.endsWith(source)) this.frame.src = source;
  }

  onOpen() {
    const language = this.i18n.language;
    this.preload();
    this.downloadLink.href = `assets/documents/curriculo-leonardo-${language}.pdf`;
    this.downloadLink.setAttribute('download', this.i18n.t('resumeFile'));
  }
}
