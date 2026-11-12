/** The 3D laptop: camera placement of the scene frame, lid angle and screen brightness. */
export class Laptop {
  constructor({ frame, lid, screen }) {
    this.frame = frame;
    this.lid = lid;
    this.screen = screen;
  }

  setPose({ x, y, scale }) {
    this.frame.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }

  setLidAngle(degrees) {
    this.lid.style.transform = `rotateX(${degrees}deg)`;
  }

  setScreenOpacity(opacity) {
    this.screen.style.opacity = String(opacity);
  }
}
