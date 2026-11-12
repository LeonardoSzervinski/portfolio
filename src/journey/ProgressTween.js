import { clamp } from '../core/math.js';

const SNAP_DISTANCE = 0.0008;
const AUTO_COMPLETE_AT = 0.97;

/**
 * Eases the journey progress toward a target. Time based, so it moves at the
 * same speed at 30, 60 or 120 frames per second.
 */
export class ProgressTween {
  value = 0;
  target = 0;
  auto = false;

  constructor({ followTime = 0.09, autoTime = 0.24 } = {}) {
    this.followTime = followTime;
    this.autoTime = autoTime;
  }

  /** Animate on its own to a target (buttons, keyboard). */
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
  }

  step(seconds, { instant = false } = {}) {
    const timeConstant = this.auto ? this.autoTime : this.followTime;
    const k = instant ? 1 : 1 - Math.exp(-Math.min(seconds, 0.1) / timeConstant);
    this.value += (this.target - this.value) * k;
    if (Math.abs(this.target - this.value) < SNAP_DISTANCE) this.value = this.target;
    if (this.value === 0 && this.target === 0) this.auto = false;
    return this.value;
  }

  get settled() {
    return this.value === this.target;
  }
}
