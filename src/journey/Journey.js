import { interpolatePose, journeyFrame, memojiBox } from '../layout/geometry.js';
import { releaseTarget } from './gestures.js';
import { ProgressTween } from './ProgressTween.js';

/** Past this point the camera is visually inside the screen, so the showcase starts right away. */
const ARRIVE_AT = 0.97;

export const MODE = Object.freeze({ HERO: 'hero', SHOWCASE: 'showcase' });

/**
 * The scroll-driven story: the lid opens, the camera flies into the screen and the
 * projects take over. Two states (hero ⇄ showcase) and a progress value drive everything.
 */
export class Journey {
  #tween = new ProgressTween();
  #lastFrameTime = 0;
  #renderedProgress = Number.NaN;

  mode = MODE.HERO;
  index = 0;
  busy = false;

  constructor({ layout, laptop, memoji, hero, panel, player, projects, motion, bus, body, glow }) {
    Object.assign(this, { layout, laptop, memoji, hero, panel, player, projects, motion, bus, body, glow });
  }

  get inShowcase() {
    return this.mode === MODE.SHOWCASE;
  }

  get progress() {
    return this.inShowcase ? 1 : this.#tween.value;
  }

  start() {
    this.player.previewFirst();
    this.relayout();
    requestAnimationFrame((time) => this.#loop(time));
  }

  relayout() {
    this.layout.measure();
    this.#render(this.progress);
  }

  /* ---------- commands ---------- */

  scrub(delta) {
    if (this.inShowcase || this.busy) return;
    this.#tween.nudge(delta);
  }

  open() {
    if (!this.inShowcase) this.#tween.goTo(1);
  }

  /** End of a swipe: finish opening or closing in the direction the finger was moving. */
  release(velocity) {
    if (this.inShowcase || this.busy) return;
    this.#tween.goTo(releaseTarget({ progress: this.#tween.value, velocity }));
  }

  close() {
    if (this.inShowcase) this.#leave();
    else this.#tween.goTo(0);
  }

  next() {
    if (this.inShowcase) this.#show((this.index + 1) % this.projects.length);
  }

  /** Back from the first project closes the laptop all the way (scrolling down again reopens it). */
  previous() {
    if (!this.inShowcase || this.busy) return;
    if (this.index === 0) this.#leave();
    else this.#show(this.index - 1);
  }

  refreshText() {
    this.panel.render(this.projects[this.index], this.index, this.projects.length);
    this.relayout();
  }

  /* ---------- internals ---------- */

  #loop(time) {
    const seconds = this.#lastFrameTime ? (time - this.#lastFrameTime) / 1000 : 1 / 60;
    this.#lastFrameTime = time;

    if (!this.inShowcase) {
      const progress = this.#tween.step(seconds, { instant: this.motion.reduced });
      // Nothing moved: skip the DOM writes entirely (saves work and battery while idle).
      if (progress !== this.#renderedProgress) this.#render(progress);
      if (progress >= ARRIVE_AT && this.#tween.target >= 1 && !this.busy) this.#arrive();
    }
    requestAnimationFrame((next) => this.#loop(next));
  }

  #render(progress) {
    const viewport = this.layout.current ?? this.layout.measure();
    const frame = journeyFrame(progress);
    const pose = interpolatePose(viewport.hero, viewport.showcase, frame.zoom);

    this.laptop.setLidAngle(frame.lidAngle);
    this.laptop.setPose(pose);
    if (!this.inShowcase) this.laptop.setScreenOpacity(frame.screenOpacity);

    this.memoji.place(memojiBox({
      hero: viewport.hero,
      pose,
      lidAngle: frame.lidAngle,
      wordmark: viewport.wordmark,
      width: viewport.width,
      compact: viewport.compact,
    }));
    this.hero.setOpacity(frame.heroOpacity);
    this.glow.style.opacity = String(1 - frame.zoom);
    this.body.classList.toggle('is-scrolling', progress > 0.01);
    this.#renderedProgress = progress;
  }

  #setBusy(busy) {
    this.busy = busy;
    this.body.classList.toggle('is-busy', busy);
  }

  #setMode(mode) {
    this.mode = mode;
    this.body.classList.toggle('is-showcase', mode === MODE.SHOWCASE);
    this.bus.emit('mode:change', mode);
  }

  async #arrive() {
    this.#setBusy(true);
    this.#setMode(MODE.SHOWCASE);
    this.#tween.jumpTo(1);
    this.#render(1);
    this.laptop.setScreenOpacity(1);
    this.player.flash(0.55, 600);

    this.index = 0;
    this.panel.render(this.projects[0], 0, this.projects.length);
    this.player.play(0);
    this.panel.enter({ first: true });
    this.player.preload(1);

    await this.motion.wait(700);
    this.#setBusy(false);
  }

  async #show(index) {
    if (this.busy || !this.inShowcase || index === this.index) return;
    this.#setBusy(true);
    const from = this.index;
    await Promise.all([this.panel.leave(), this.player.switch(from, index)]);
    this.index = index;
    this.panel.render(this.projects[index], index, this.projects.length);
    this.panel.enter();
    this.player.preload(index + 1);
    await this.motion.wait(520);
    this.#setBusy(false);
  }

  /** Pull the camera back and close the lid on its own, back to the start. */
  async #leave() {
    if (this.busy || !this.inShowcase) return;
    this.#setBusy(true);
    this.panel.leave();
    this.index = 0;
    this.panel.render(this.projects[0], 0, this.projects.length);
    this.player.previewFirst();
    this.#setMode(MODE.HERO);

    this.#tween.jumpTo(1);
    this.#tween.goTo(0);

    await this.motion.wait(380);
    this.#setBusy(false);
  }
}
