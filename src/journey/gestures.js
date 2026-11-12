/** How far ahead (seconds) a released swipe keeps travelling with its own speed. */
const FLICK_PROJECTION = 0.2;
/** Released past this point the laptop finishes opening; before it, it closes. */
const OPEN_THRESHOLD = 0.3;

/**
 * Where the journey should settle when the finger leaves the screen, so a swipe
 * never stops half way: it completes in the direction the gesture was going.
 * @param {{ progress: number, velocity: number }} gesture velocity in progress units per second
 */
export function releaseTarget({ progress, velocity }) {
  const projected = progress + velocity * FLICK_PROJECTION;
  return projected >= OPEN_THRESHOLD ? 1 : 0;
}

/**
 * Exponentially smoothed velocity of a drag, robust to uneven touch event timing.
 */
export class DragVelocity {
  #velocity = 0;
  #lastTime = 0;

  constructor({ smoothing = 0.6 } = {}) {
    this.smoothing = smoothing;
  }

  reset(time) {
    this.#velocity = 0;
    this.#lastTime = time;
  }

  /** @param {number} delta movement since the last sample, @param {number} time in ms */
  sample(delta, time) {
    const seconds = Math.max((time - this.#lastTime) / 1000, 1 / 240);
    this.#lastTime = time;
    const instant = delta / seconds;
    this.#velocity = this.smoothing * instant + (1 - this.smoothing) * this.#velocity;
  }

  /** Velocity at release; decays if the finger rested before lifting. */
  release(time) {
    const idle = (time - this.#lastTime) / 1000;
    return idle > 0.1 ? 0 : this.#velocity;
  }
}
