const REST_TRANSLATE = 'calc(-288px + var(--badge-width) / 2) 0px';
const PULL_LIMIT = 120;

/**
 * Lanyard badge. It sways while idle, swings on hover, and opens the profile card
 * when it is clicked, activated with the keyboard, or pulled down.
 */
export class Badge {
  #sway = null;
  #pullStart = null;

  constructor({ element, handle, motion, onOpen, canInteract }) {
    this.element = element;
    this.handle = handle;
    this.motion = motion;
    this.onOpen = onOpen;
    this.canInteract = canInteract;
    this.#bindEvents();
  }

  drop({ delay = 0 } = {}) {
    this.element.classList.remove('is-pending');
    const animation = this.motion.animate(
      this.element,
      [
        { opacity: 0, transform: 'translateY(-120%) rotate(8deg)' },
        { offset: 0.6, opacity: 1, transform: 'translateY(0) rotate(-3deg)' },
        { offset: 0.8, opacity: 1, transform: 'rotate(1.6deg)' },
        { opacity: 1, transform: 'rotate(0)' },
      ],
      { duration: 1500, delay },
    );
    animation.finished.then(() => {
      animation.cancel();
      this.startSway();
    }, () => {});
  }

  startSway() {
    if (this.motion.reduced) return;
    this.stopSway();
    this.#sway = this.element.animate(
      [{ transform: 'rotate(-1.1deg)' }, { transform: 'rotate(1.1deg)' }],
      { duration: 3200, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', iterationStart: 0.5 },
    );
  }

  stopSway() {
    this.#sway?.cancel();
    this.#sway = null;
  }

  #swing() {
    if (this.motion.reduced || !this.canInteract()) return;
    this.element.animate(
      [{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(-2deg)' }, { transform: 'rotate(0)' }],
      { duration: 1400, easing: 'ease-out', composite: 'add' },
    );
  }

  #bindEvents() {
    this.handle.addEventListener('pointerenter', () => this.#swing());

    this.handle.addEventListener('pointerdown', (event) => {
      if (!this.canInteract()) return;
      event.preventDefault();
      this.#pullStart = event.clientY;
      this.stopSway();
    });

    addEventListener('pointermove', (event) => {
      if (this.#pullStart === null) return;
      const pulled = Math.max(0, event.clientY - this.#pullStart);
      const offset = pulled < PULL_LIMIT ? pulled : PULL_LIMIT + (pulled - PULL_LIMIT) * 0.25; // rubber band
      this.element.style.translate = `calc(-288px + var(--badge-width) / 2) ${offset}px`;
    });

    addEventListener('pointerup', () => this.#release({ open: true }));
    addEventListener('pointercancel', () => this.#release({ open: false }));

    // Keyboard activation (Enter / Space) arrives as a click with no pointer.
    this.handle.addEventListener('click', (event) => {
      if (event.detail === 0 && this.canInteract()) this.onOpen();
    });
  }

  #release({ open }) {
    if (this.#pullStart === null) return;
    this.#pullStart = null;
    const from = this.element.style.translate;
    this.element.style.translate = '';
    if (from && !this.motion.reduced) {
      this.element.animate([{ translate: from }, { translate: REST_TRANSLATE }], { duration: 500, easing: 'cubic-bezier(.3,1.6,.5,1)' });
    }
    if (open) this.onOpen();
    setTimeout(() => this.startSway(), 520);
  }
}
