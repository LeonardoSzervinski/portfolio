const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog: traps focus, makes the page behind it inert, closes on
 * Escape or backdrop click and gives focus back to whatever opened it.
 * Subclasses customise it through the entrance/onOpen/onClose hooks (Template Method).
 */
export class Dialog {
  #previousFocus = null;

  constructor({ element, card, closeButton, motion, inertTargets = [] }) {
    this.element = element;
    this.card = card;
    this.closeButton = closeButton;
    this.motion = motion;
    this.inertTargets = inertTargets;

    closeButton.addEventListener('click', () => this.close());
    element.addEventListener('click', (event) => event.target === element && this.close());
    element.addEventListener('keydown', (event) => this.#onKeydown(event));
  }

  get isOpen() {
    return this.element.classList.contains('is-open');
  }

  open() {
    if (this.isOpen) return;
    this.#previousFocus = document.activeElement;
    this.onOpen();
    this.element.classList.add('is-open');
    this.element.setAttribute('aria-hidden', 'false');
    this.inertTargets.forEach((target) => { target.inert = true; });
    const { keyframes, duration } = this.entrance();
    this.motion.animate(this.card, keyframes, { duration, fill: 'none' });
    setTimeout(() => this.closeButton.focus({ preventScroll: true }), 50);
  }

  close() {
    if (!this.isOpen) return;
    this.element.classList.remove('is-open');
    this.element.setAttribute('aria-hidden', 'true');
    this.inertTargets.forEach((target) => { target.inert = false; });
    this.onClose();
    this.#previousFocus?.focus?.({ preventScroll: true });
  }

  /** How the card comes in; by default it drops from above like a badge on a lanyard. */
  entrance() {
    return {
      duration: 900,
      keyframes: [
        { transform: 'translateY(-75vh) rotate(6deg)' },
        { offset: 0.65, transform: 'translateY(12px) rotate(-2deg)' },
        { offset: 0.85, transform: 'rotate(.8deg)' },
        { transform: 'none' },
      ],
    };
  }

  onOpen() {}

  onClose() {}

  #onKeydown(event) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...this.card.querySelectorAll(FOCUSABLE)];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
