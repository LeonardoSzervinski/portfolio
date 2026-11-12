import { createSlide } from './slideFactory.js';

/** Owns the slides on the laptop screen; only one plays at a time. */
export class ScreenPlayer {
  constructor({ screen, flash, projects, scenes, motion, language }) {
    this.screen = screen;
    this.flashLayer = flash;
    this.motion = motion;
    this.slides = projects.map((project) =>
      createSlide(project.media, { scenes, language, reducedMotion: motion.reduced }),
    );
    for (const slide of this.slides) screen.insertBefore(slide.element, flash);
  }

  get count() {
    return this.slides.length;
  }

  preload(index) {
    this.slides[index % this.count].preload();
  }

  /** Shows a still of the first project, used while the lid opens. */
  previewFirst() {
    this.slides.forEach((slide, index) => {
      this.motion.cancel(slide.element);
      slide.stop();
      slide.element.style.opacity = index === 0 ? 1 : 0;
    });
    this.slides[0].preload();
    this.slides[0].preview();
  }

  play(index) {
    this.slides.forEach((slide, i) => i !== index && slide.stop());
    this.slides[index].preload();
    this.slides[index].start();
  }

  stopAll() {
    this.slides.forEach((slide) => slide.stop());
  }

  async switch(from, to) {
    const outgoing = this.slides[from].element;
    await this.motion.animate(outgoing, [{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: 'forwards' }).finished.catch(() => {});
    this.slides[from].stop();
    this.flash(0.35, 420);
    const incoming = this.slides[to].element;
    this.motion.cancel(incoming);
    this.motion.animate(incoming, [{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 500 });
    this.play(to);
  }

  flash(strength, duration) {
    this.motion.animate(this.flashLayer, [{ opacity: 0 }, { opacity: strength }, { opacity: 0 }], { duration, easing: 'ease-out', fill: 'none' });
  }

  setLanguage(language) {
    this.slides.forEach((slide) => slide.setLanguage(language));
  }
}
