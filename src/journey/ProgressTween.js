import { clamp } from '../core/math.js';

const SNAP_DISTANCE = 0.0008;
const SNAP_VELOCITY = 0.02;
const AUTO_COMPLETE_AT = 0.97;
const MAX_STEP = 1 / 240; // integration step, keeps the result identical at any frame rate

/**
 * Moves the journey progress toward a target with a critically damped spring:
 * no overshoot, no sudden change of speed when the target moves (each wheel tick
 * or finger movement just pulls the spring a little further).
 */
export class ProgressTween {
  value = 0;
  target = 0;
  velocity = 0;
  auto = false;

  /**
   * @param {object} options
   * @param {number} options.followFrequency stiffness while following input (rad/s)
   * @param {number} options.autoFrequency stiffness when animating on its own (rad/s)
   */
  constructor({ followFrequency = 13, autoFrequency = 6.5 } = {}) {
    this.followFrequency = followFrequency;
    this.autoFrequency = autoFrequency;
  }

  /** Animate on its own to a target (buttons, keyboard, gesture release). */
  goTo(target) {
    this.target = clamp(target);
    this.auto = true;
  }

  /** Follow the user's scroll or swipe. */
  nudge(delta) {
    this.auto = false;
    this.target = clamp(this.target + delta);
    if (this.target > AUTO_COMPLETE_AT) this.goTo(1);
  }

  jumpTo(value, target = value) {
    this.value = clamp(value);
    this.target = clamp(target);
    this.velocity = 0;
  }

  step(seconds, { instant = false } = {}) {
    if (instant) {
      this.value = this.target;
      this.velocity = 0;
    } else {
      const frequency = this.auto ? this.autoFrequency : this.followFrequency;
      let remaining = Math.min(seconds, 0.1);
      while (remaining > 1e-9) {
        const h = Math.min(remaining, MAX_STEP);
        const acceleration = frequency * frequency * (this.target - this.value) - 2 * frequency * this.velocity;
        this.velocity += acceleration * h;
        this.value += this.velocity * h;
        remaining -= h;
      }
      if (this.value < 0 || this.value > 1) {
        this.value = clamp(this.value);
        this.velocity = 0;
      }
      if (Math.abs(this.target - this.value) < SNAP_DISTANCE && Math.abs(this.velocity) < SNAP_VELOCITY) {
        this.value = this.target;
        this.velocity = 0;
      }
    }
    if (this.value === 0 && this.target === 0) this.auto = false;
    return this.value;
  }

  get settled() {
    return this.value === this.target && this.velocity === 0;
  }
}
