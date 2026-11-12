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

  setPose({ x, y, scale }) {
    this.frame.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }

  setLidAngle(degrees) {
    this.lid.style.transform = `rotateX(${degrees}deg)`;
    // Safari stops painting animated content inside a backface-hidden face of a 3D
    // context, leaving the screen black. With the lid up we drop both (see stage.css).
    this.model.classList.toggle('is-lid-up', degrees > LID_UP_ANGLE);
  }

  setScreenOpacity(opacity) {
    this.screen.style.opacity = String(opacity);
  }
}
