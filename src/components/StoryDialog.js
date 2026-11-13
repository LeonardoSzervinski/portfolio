import { createElement } from '../core/dom.js';
import { highlight, readingTime, takeCharacters } from '../screen/highlight.js';
import { Dialog } from './Dialog.js';

const TYPING_SHARE = 0.72; // the code finishes typing at this point of the slide
const CAPTION_SHARE = 0.9; // the last caption word lights up at this point
const PLAYBACK_RATE = 1.08; // the narration plays slightly faster, to keep the pace up

/**
 * Narrated story about Leonardo, played like a short video. On each slide the code
 * is typed in an editor while the narration plays and its caption lights up word by
 * word. Slides advance when the narration ends; arrows and buttons move between them.
 */
export class StoryDialog extends Dialog {
  #index = 0;
  #timer = null;
  #frame = null;
  #audio = new Audio();
  #muted = false;

  constructor({ story, slides, progress, previousButton, nextButton, soundButton, i18n, onResume, ...options }) {
    super(options);
    Object.assign(this, { story, slidesHost: slides, progressHost: progress, soundButton, i18n, onResume });

    previousButton.addEventListener('click', () => this.go(this.#index - 1));
    nextButton.addEventListener('click', () => this.go(this.#index + 1));
    soundButton.addEventListener('click', () => this.#setMuted(!this.#muted));
    this.element.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') this.go(this.#index + 1);
      if (event.key === 'ArrowLeft') this.go(this.#index - 1);
    });
    this.#audio.addEventListener('ended', () => this.#advance());
  }

  entrance() {
    return {
      duration: 450,
      keyframes: [{ opacity: 0, transform: 'scale(1.04)' }, { opacity: 1, transform: 'none' }],
    };
  }

  onOpen() {
    const { slides } = this.story;
    this.slidesHost.replaceChildren(...slides.map((slide) => this.#build(slide)));
    this.progressHost.replaceChildren(...slides.map(() => createElement('i')));
    this.#setMuted(this.#muted);
    this.go(0);
  }

  onClose() {
    this.#stop();
    this.slidesHost.replaceChildren(); // stops every animation
  }

  go(index) {
    const { slides } = this.story;
    this.#index = Math.min(Math.max(index, 0), slides.length - 1);
    this.#stop();

    const slide = slides[this.#index];
    const narration = this.i18n.pick(slide.narration);
    const audioFile = slide.audio?.[this.i18n.language];

    const current = this.#index;
    const start = (duration, { timed }) => {
      if (current !== this.#index || !this.isOpen) return; // the viewer already moved on
      this.#show(duration);
      this.#type(slide, duration);
      // With sound the slide ends when the narration does; otherwise a timer ends it.
      if (timed) this.#timer = setTimeout(() => this.#advance(), duration);
    };

    const readTime = readingTime(narration);
    if (!audioFile) {
      start(readTime, { timed: true });
      return;
    }

    const audio = this.#audio;
    audio.src = audioFile;
    audio.muted = this.#muted;
    audio.playbackRate = PLAYBACK_RATE;
    audio.play().then(
      () => {
        const begin = () => start((audio.duration * 1000) / PLAYBACK_RATE || readTime, { timed: false });
        if (audio.readyState >= 1) begin();
        else audio.addEventListener('loadedmetadata', begin, { once: true });
      },
      // Playback refused (or the file is missing): carry on with captions only.
      () => start(readTime, { timed: true }),
    );
  }

  /** The last slide stays: it holds the links. */
  #advance() {
    if (this.#index < this.story.slides.length - 1) this.go(this.#index + 1);
  }

  #stop() {
    clearTimeout(this.#timer);
    cancelAnimationFrame(this.#frame);
    this.#audio.pause();
    this.#audio.removeAttribute('src');
  }

  #setMuted(muted) {
    this.#muted = muted;
    this.#audio.muted = muted;
    this.soundButton.setAttribute('aria-pressed', String(!muted));
    this.soundButton.setAttribute('aria-label', this.i18n.t(muted ? 'storySoundOff' : 'storySoundOn'));
    this.soundButton.classList.toggle('is-muted', muted);
  }

  /** Activates the current slide and restarts its animations for `duration` ms. */
  #show(duration) {
    [...this.slidesHost.children].forEach((element, i) => {
      element.classList.remove('is-active');
      if (i !== this.#index) return;
      const words = element.querySelectorAll('.story__caption span').length;
      element.style.setProperty('--word-time', `${(duration * CAPTION_SHARE) / Math.max(1, words)}ms`);
      void element.offsetWidth; // restart the entrance animations
      element.classList.add('is-active');
    });
    [...this.progressHost.children].forEach((segment, i) => {
      segment.className = '';
      segment.style.setProperty('--slide-time', `${duration}ms`);
      void segment.offsetWidth;
      segment.className = i < this.#index ? 'is-done' : i === this.#index ? 'is-active' : '';
    });
  }

  /** Types the slide's code into its editor over most of the slide. */
  #type(slide, duration) {
    const code = this.slidesHost.children[this.#index].querySelector('.story__code');
    const tokens = highlight(slide.code.text);
    const total = slide.code.text.length;
    const render = (count) => {
      code.replaceChildren(
        ...takeCharacters(tokens, count).map(({ text, kind }) => createElement('span', { className: `is-${kind}`, text })),
        createElement('i', { className: 'story__caret' }),
      );
    };

    if (this.motion.reduced) {
      render(total);
      return;
    }
    const startedAt = performance.now();
    let shown = -1;
    const tick = (now) => {
      const count = Math.min(total, Math.floor(((now - startedAt) / (duration * TYPING_SHARE)) * total));
      if (count !== shown) {
        shown = count;
        render(count);
      }
      if (count < total) this.#frame = requestAnimationFrame(tick);
    };
    this.#frame = requestAnimationFrame(tick);
  }

  #build({ id, image, kicker, title, note, narration, code, actions }) {
    const { i18n } = this;
    const slide = createElement('section', { className: `story__slide story__slide--${id}` });

    const heading = createElement('header', { className: 'story__heading' });
    heading.append(
      createElement('p', { className: 'story__kicker', text: i18n.pick(kicker) }),
      createElement('h3', { className: 'story__title', text: i18n.pick(title) }),
      createElement('p', { className: 'story__note', text: i18n.pick(note) }),
    );

    const editor = createElement('div', { className: 'story__editor', attributes: { 'aria-hidden': 'true' } });
    const bar = createElement('div', { className: 'story__bar' });
    bar.append(createElement('span', { text: code.file }));
    // The sizer holds the full snippet (invisible) so the editor never changes size while typing.
    const body = createElement('div', { className: 'story__body' });
    body.append(
      createElement('pre', { className: 'story__sizer', text: code.text }),
      createElement('pre', { className: 'story__code' }),
    );
    editor.append(bar, body);

    const caption = createElement('p', { className: 'story__caption' });
    i18n.pick(narration).split(' ').forEach((word, order) => {
      const span = createElement('span', { text: `${word} ` });
      span.style.setProperty('--w', order);
      caption.append(span);
    });

    slide.append(heading, editor);
    if (image) slide.append(createElement('img', { className: 'story__image', attributes: { src: image, alt: '', draggable: 'false' } }));
    slide.append(caption);
    if (actions) slide.append(this.#actions());
    return slide;
  }

  #actions() {
    const { i18n } = this;
    const actions = createElement('div', { className: 'story__actions' });
    const resume = createElement('button', { text: i18n.t('storyResume'), attributes: { type: 'button' } });
    resume.addEventListener('click', () => {
      this.close();
      this.onResume();
    });
    const replay = createElement('button', { className: 'is-quiet', text: i18n.t('storyReplay'), attributes: { type: 'button' } });
    replay.addEventListener('click', () => this.go(0));
    actions.append(resume, replay);
    return actions;
  }
}
