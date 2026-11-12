export const EASE_OUT = 'cubic-bezier(.2,.8,.2,1)';
export const EASE_IN = 'cubic-bezier(.5,0,.75,0)';
export const EASE_SPRING = 'cubic-bezier(.3,1.5,.5,1)';

/**
 * Thin wrapper around the Web Animations API that honours prefers-reduced-motion:
 * with reduced motion every duration and delay collapses to zero.
 */
export class Motion {
  constructor({ reduced = false } = {}) {
    this.reduced = reduced;
  }

  get scale() {
    return this.reduced ? 0 : 1;
  }

  animate(element, keyframes, { duration = 0, delay = 0, ...options } = {}) {
    return element.animate(keyframes, {
      easing: EASE_OUT,
      fill: 'both',
      ...options,
      duration: duration * this.scale,
      delay: delay * this.scale,
    });
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms * this.scale));
  }

  cancel(element) {
    element.getAnimations().forEach((animation) => animation.cancel());
  }

  /** Runs an animation and removes it once finished, leaving the element at its CSS state. */
  play(element, keyframes, options) {
    const animation = this.animate(element, keyframes, options);
    animation.finished.then(() => animation.cancel(), () => {});
    return animation;
  }
}
