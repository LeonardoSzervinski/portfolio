/**
 * Past this angle (degrees, 0 = open) the viewer can only see the front of the lid,
 * so the screen no longer needs a hidden back face.
 */
export const LID_UP_ANGLE = -70;

/** The 3D laptop: camera placement of the scene frame, lid angle and screen brightness. */
export class Laptop {
  constructor({ model, frame, lid, screen }) {
    this.model = model;
    this.frame = frame;
    this.lid = lid;
    this.screen = screen;
  }

  // Only transform/opacity change per frame (compositor-only), and only when the value changes.
  #write(element, property, value, key) {
    if (this[key] === value) return;
    this[key] = value;
    element.style[property] = value;
  }

  setPose({ x, y, scale }) {
    this.#write(this.frame, 'transform', `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(5)})`, 'pose');
  }

  setLidAngle(degrees) {
    this.#write(this.lid, 'transform', `rotateX(${degrees.toFixed(3)}deg)`, 'angle');
    // Safari stops painting animated content inside a backface-hidden face of a 3D
    // context, leaving the screen black. With the lid up we drop both (see stage.css).
    const lidUp = degrees > LID_UP_ANGLE;
    if (lidUp !== this.lidUp) {
      this.lidUp = lidUp;
      this.model.classList.toggle('is-lid-up', lidUp);
    }
  }

  setScreenOpacity(opacity) {
    this.#write(this.screen, 'opacity', opacity.toFixed(3), 'screenOpacity');
  }
}
