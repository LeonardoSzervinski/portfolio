import { Slide } from './Slide.js';

/** Plays a recorded demo (mp4). Ready for projects that get a screen recording. */
export class VideoSlide extends Slide {
  constructor({ src }) {
    const video = document.createElement('video');
    Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'none' });
    super(video);
    this.src = src;
  }

  preload() {
    if (this.element.getAttribute('src')) return;
    this.element.preload = 'auto';
    this.element.src = this.src;
  }

  start() {
    this.preload();
    this.element.currentTime = 0;
    this.element.play()?.catch(() => {});
  }

  stop() {
    this.element.pause();
  }
}
