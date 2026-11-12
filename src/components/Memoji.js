/** Memoji resting behind the laptop; the head tilts toward the pointer. */
export class Memoji {
  constructor({ container, tilt, face, motion }) {
    this.container = container;
    this.tilt = tilt;
    this.face = face;
    this.motion = motion;
    this.enabled = true;
  }

  place({ left, top, size, height }) {
    Object.assign(this.container.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${size}px`,
      height: `${height}px`,
    });
  }

  lookAt(x, y) {
    if (!this.enabled || this.motion.reduced) return;
    const dx = x / innerWidth - 0.5;
    const dy = y / innerHeight - 0.5;
    this.tilt.style.transform = `perspective(900px) rotateY(${(dx * 16).toFixed(2)}deg) rotateX(${(-dy * 10).toFixed(2)}deg)`;
  }

  reset() {
    this.tilt.style.transform = '';
  }

  /** Rises from behind the laptop. */
  enter({ delay = 0 } = {}) {
    this.face.classList.remove('is-pending');
    return this.motion.play(this.face, [{ transform: 'translateY(100%)' }, { transform: 'none' }], {
      duration: 1000,
      delay,
      easing: 'cubic-bezier(.3,1.35,.5,1)',
    });
  }
}
