/** Memoji resting behind the laptop; the head tilts toward the pointer. */
export class Memoji {
  constructor({ container, tilt, face, motion }) {
    this.container = container;
    this.tilt = tilt;
    this.face = face;
    this.motion = motion;
    this.enabled = true;
  }

  /**
   * Position and size only change on resize; during the journey only the clip height
   * moves, and the face is its own GPU layer, so no repaint happens while scrolling.
   */
  place({ left, top, size, height }) {
    const box = `${left.toFixed(1)}|${top.toFixed(1)}|${size.toFixed(1)}`;
    if (box !== this.box) {
      this.box = box;
      this.size = size;
      Object.assign(this.container.style, { left: `${left}px`, top: `${top}px`, width: `${size}px`, height: `${size}px` });
    }
    // Hide what is below the lid's edge with a clip instead of a height: no layout per frame.
    const hidden = `inset(0 0 ${Math.max(0, this.size - Math.max(0, height)).toFixed(1)}px 0)`;
    if (hidden !== this.clip) {
      this.clip = hidden;
      this.container.style.clipPath = hidden;
    }
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
