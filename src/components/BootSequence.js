const DURATION = 2700;
const NOISE_INTERVAL = 70;

const hexNoise = () =>
  Array.from({ length: 6 }, () => Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0')).join(' ');

/**
 * The playful "suspicious file" terminal shown before the résumé opens.
 * `run()` resolves when it finishes or is skipped (click or Escape).
 */
export class BootSequence {
  #finish = null;

  constructor({ element, title, warning, log, bar, percent, skip, motion }) {
    Object.assign(this, { element, title, warning, log, bar, percent, skipLabel: skip, motion });
    element.addEventListener('click', () => this.skip());
  }

  get isRunning() {
    return this.#finish !== null;
  }

  skip() {
    this.#finish?.();
  }

  async run(script) {
    if (this.isRunning) return;
    this.#prepare(script);
    let shown = 0;
    await new Promise((resolve) => {
      this.#finish = () => {
        this.#finish = null;
        resolve();
      };
      const duration = this.motion.reduced ? 0 : DURATION;
      const startedAt = performance.now();
      let lastNoise = 0;
      const tick = (now) => {
        if (!this.#finish) return;
        const progress = duration ? Math.min(1, (now - startedAt) / duration) : 1;
        while (shown < script.lines.length && progress >= (shown / script.lines.length) * 0.92) {
          this.#print(script.lines[shown], shown === script.lines.length - 1 ? 'is-final' : '');
          shown += 1;
          this.#shake();
        }
        if (now - lastNoise > NOISE_INTERVAL && progress < 0.95) {
          this.#print(`  0x${hexNoise()}`, 'is-noise');
          lastNoise = now;
        }
        this.#setProgress(Math.min(100, Math.round(progress * 100 + (progress < 1 ? Math.random() * 3 : 0))));
        if (progress >= 1) this.#finish?.();
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    while (shown < script.lines.length) this.#print(script.lines[shown++]);
    this.#setProgress(100);
    if (!this.motion.reduced) {
      this.element.classList.add('is-flashing');
      await this.motion.wait(330);
    }
    this.element.classList.remove('is-active', 'is-flashing', 'is-shaking');
  }

  #prepare(script) {
    this.title.textContent = script.title;
    this.title.dataset.text = script.title;
    this.warning.textContent = script.warning;
    this.skipLabel.textContent = script.skip;
    this.log.textContent = '';
    this.#setProgress(0);
    this.element.classList.remove('is-flashing');
    this.element.classList.add('is-active');
  }

  #print(text, className = '') {
    const line = document.createElement('span');
    if (className) line.className = className;
    line.textContent = `${text}\n`;
    this.log.append(line);
    while (this.log.scrollHeight > this.log.clientHeight && this.log.firstChild) this.log.firstChild.remove();
  }

  #shake() {
    if (this.motion.reduced) return;
    this.element.classList.remove('is-shaking');
    void this.element.offsetWidth;
    this.element.classList.add('is-shaking');
  }

  #setProgress(value) {
    this.bar.style.width = `${value}%`;
    this.percent.textContent = `${value}%`;
  }
}
