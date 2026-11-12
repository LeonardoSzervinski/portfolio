const WHEEL_STEP_LOCK = 900;
const WHEEL_THRESHOLD = 18;
const SWIPE_THRESHOLD = 40;
const SCROLL_PER_PROGRESS = 1500; // pixels of wheel scroll for the whole journey

/**
 * Turns wheel, touch and keyboard input into journey commands.
 * The page never scrolls natively; every gesture is interpreted here.
 */
export class InputController {
  #wheelLocked = false;
  #touch = null;

  constructor({ journey, isBlocked, onEscape }) {
    this.journey = journey;
    this.isBlocked = isBlocked;
    this.onEscape = onEscape;
  }

  listen(target = window) {
    target.addEventListener('wheel', (event) => this.#onWheel(event), { passive: false });
    target.addEventListener('touchstart', (event) => this.#onTouchStart(event), { passive: true });
    target.addEventListener('touchmove', (event) => this.#onTouchMove(event), { passive: false });
    target.addEventListener('touchend', (event) => this.#onTouchEnd(event), { passive: true });
    target.addEventListener('keydown', (event) => this.#onKeydown(event));
  }

  #onWheel(event) {
    if (this.isBlocked()) {
      if (!event.target.closest('.dialog__card')) event.preventDefault();
      return;
    }
    event.preventDefault();

    if (this.journey.inShowcase) {
      if (Math.abs(event.deltaY) < WHEEL_THRESHOLD || this.#wheelLocked) return;
      this.#wheelLocked = true;
      setTimeout(() => { this.#wheelLocked = false; }, WHEEL_STEP_LOCK);
      if (event.deltaY > 0) this.journey.next();
      else this.journey.previous();
      return;
    }

    const pixels =
      event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * innerHeight : event.deltaY;
    this.journey.scrub(pixels / SCROLL_PER_PROGRESS);
  }

  #onTouchStart(event) {
    const { clientX, clientY } = event.touches[0];
    this.#touch = { startX: clientX, startY: clientY, lastY: clientY };
  }

  #onTouchMove(event) {
    if (this.isBlocked() || !this.#touch) return;
    event.preventDefault();
    const { clientY } = event.touches[0];
    if (!this.journey.inShowcase) this.journey.scrub((this.#touch.lastY - clientY) / (innerHeight * 1.1));
    this.#touch.lastY = clientY;
  }

  #onTouchEnd(event) {
    const touch = this.#touch;
    this.#touch = null;
    if (!touch || this.isBlocked() || !this.journey.inShowcase) return;

    const { clientX, clientY } = event.changedTouches[0];
    const dx = clientX - touch.startX;
    const dy = clientY - touch.startY;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    const delta = horizontal ? dx : dy;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) this.journey.next();
    else this.journey.previous();
  }

  #onKeydown(event) {
    if (event.key === 'Escape') {
      this.onEscape();
      return;
    }
    if (this.isBlocked()) return;
    if (event.target.closest?.('a, button') && (event.key === ' ' || event.key === 'Enter')) return;

    const { journey } = this;
    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        event.preventDefault();
        if (journey.inShowcase) journey.next();
        else journey.open();
        break;
      case 'ArrowRight':
        event.preventDefault();
        journey.next();
        break;
      case 'ArrowUp':
      case 'PageUp':
      case 'ArrowLeft':
        event.preventDefault();
        if (journey.inShowcase) journey.previous();
        else journey.close();
        break;
      default:
    }
  }
}
