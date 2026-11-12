import { createElement, restartClass } from '../core/dom.js';
import { Slide } from './Slide.js';

const ACTIVE = 'on';

/** Animated showcase: a browser window that cycles through frames and feature chips. */
export class SceneSlide extends Slide {
  #timer = null;

  constructor(scene, { language, reducedMotion = false }) {
    super(createElement('div', { className: 'scene' }));
    this.scene = scene;
    this.language = language;
    this.reducedMotion = reducedMotion;
    this.#render();
  }

  preload() {
    for (const image of this.element.querySelectorAll('img[data-src]')) {
      if (!image.getAttribute('src')) image.src = image.dataset.src;
    }
  }

  preview() {
    this.#updateChipText();
    this.#showFrame(0);
  }

  start() {
    this.stop();
    this.#updateChipText();
    const show = (index) => {
      this.#showFrame(index);
      const delay = this.reducedMotion ? 6000 : this.scene.frameDuration;
      this.#timer = setTimeout(() => show((index + 1) % this.frames.length), delay);
    };
    show(0);
  }

  stop() {
    clearTimeout(this.#timer);
    for (const element of this.element.querySelectorAll(`.${ACTIVE}`)) element.classList.remove(ACTIVE);
  }

  setLanguage(language) {
    this.language = language;
    this.#updateChipText();
  }

  #render() {
    const { accent, background, address, frames, chips } = this.scene;
    this.element.style.setProperty('--acc', accent);
    this.element.style.setProperty('--bg', background);

    const framesMarkup = frames
      .map(({ image, html = '' }) => {
        const imageMarkup = image
          ? `<img data-src="${image.src}" alt="" style="--f:${image.from};--t:${image.to}">`
          : '';
        return `<div class="fr">${imageMarkup}${html}</div>`;
      })
      .join('');

    const perFrame = new Map();
    const chipsMarkup = chips
      .map(({ frame }) => {
        const order = perFrame.get(frame) ?? 0;
        perFrame.set(frame, order + 1);
        return `<span class="chip" data-frame="${frame}" style="--i:${order}"></span>`;
      })
      .join('');

    this.element.innerHTML = `
      <div class="win" aria-hidden="true">
        <div class="wbar"><i></i><i></i><i></i><span class="url">🔒 ${address}</span></div>
        <div class="wbody">${framesMarkup}</div>
      </div>
      <div class="chips">${chipsMarkup}</div>`;

    this.frames = [...this.element.querySelectorAll('.fr')];
    this.chips = [...this.element.querySelectorAll('.chip')];
  }

  #updateChipText() {
    this.chips.forEach((chip, index) => {
      chip.textContent = this.scene.chips[index].text[this.language];
    });
  }

  #showFrame(index) {
    this.frames.forEach((frame, i) => frame.classList.toggle(ACTIVE, i === index));
    for (const chip of this.chips) {
      if (Number(chip.dataset.frame) === index) restartClass(chip, ACTIVE);
      else chip.classList.remove(ACTIVE);
    }
  }
}
