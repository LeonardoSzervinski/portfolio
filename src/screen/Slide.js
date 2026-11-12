/**
 * What a project shows on the laptop screen. Subclasses decide how (Strategy pattern);
 * the player only relies on this interface.
 */
export class Slide {
  constructor(element) {
    this.element = element;
    this.element.classList.add('slide');
  }

  /** Starts loading heavy media. */
  preload() {}

  /** Static first frame, used while the lid is opening. */
  preview() {}

  start() {}

  stop() {}

  setLanguage(_language) {}
}
