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

  onOpen() {
    const language = this.i18n.language;
    this.frame.src = `resume.html?lang=${language}&embed=1`;
    this.downloadLink.href = `assets/documents/curriculo-leonardo-${language}.pdf`;
    this.downloadLink.setAttribute('download', this.i18n.t('resumeFile'));
  }
}
