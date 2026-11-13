const DURATION = 4600;

/**
 * Short scene played before the résumé opens: the camera dives into a retro computer,
 * logs in and opens the only folder on its desktop, where the résumé is generated. `run()` resolves when the scene ends or
 * is skipped (click or Escape). With reduced motion it is skipped entirely.
 */
export class ResumeReveal {
  #finish = null;

  constructor({ element, motion }) {
    this.element = element;
    this.motion = motion;
    element.addEventListener('click', () => this.skip());
  }

  get isRunning() {
    return this.#finish !== null;
  }

  skip() {
    this.#finish?.();
  }

  async run() {
    if (this.isRunning || this.motion.reduced) return;
    const { classList } = this.element;
    classList.add('is-active', 'is-playing');

    await new Promise((resolve) => {
      const timer = setTimeout(() => this.#finish?.(), DURATION);
      this.#finish = () => {
        clearTimeout(timer);
        this.#finish = null;
        resolve();
      };
    });

    // The backdrop fades out while the résumé window fades in.
    classList.remove('is-active');
    setTimeout(() => classList.remove('is-playing'), 400);
  }
}
