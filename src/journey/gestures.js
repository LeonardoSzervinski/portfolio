/** Faster than this (progress units per second) the gesture's direction decides. */
const DIRECTION_SPEED = 0.25;
/** A slow release past this point finishes opening; before it, it closes. */
const OPEN_THRESHOLD = 0.4;

/**
 * Where the journey should settle when the finger leaves the screen, so a swipe
 * never stops half way. The direction of the gesture wins: swiping down always
 * closes and swiping up always opens; only a slow release falls back to position.
 * @param {{ progress: number, velocity: number }} gesture velocity in progress units per second
 */
export function releaseTarget({ progress, velocity }) {
  if (velocity > DIRECTION_SPEED) return 1;
  if (velocity < -DIRECTION_SPEED) return 0;
  return progress >= OPEN_THRESHOLD ? 1 : 0;
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
