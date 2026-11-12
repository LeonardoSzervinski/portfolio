import { heroPose, isCompact, showcasePose, viewportUnit } from './geometry.js';

/**
 * Reads the few DOM sizes the camera depends on, writes the CSS layout variables
 * and returns the hero and showcase camera poses for the current viewport.
 */
export class ViewportLayout {
  constructor({ root, ticket, info, wordmark, lanyard }) {
    this.root = root;
    this.ticket = ticket;
    this.info = info;
    this.wordmark = wordmark;
    this.lanyard = lanyard;
    this.current = null;
  }

  measure() {
    const width = innerWidth;
    const height = innerHeight;
    const style = this.root.style;

    style.setProperty('--n', `${viewportUnit(width, height)}px`);
    style.setProperty('--ticket-height', `${this.ticket.offsetHeight}px`);
    style.setProperty('--badge-scale', String(this.lanyard.offsetWidth / 582));

    const wordmarkBox = this.wordmark.getBoundingClientRect();
    this.current = {
      width,
      height,
      compact: isCompact(width),
      wordmark: { top: wordmarkBox.top, height: wordmarkBox.height },
      hero: heroPose({ width, height }),
      showcase: showcasePose({
        width,
        height,
        ticketHeight: this.ticket.offsetHeight,
        infoHeight: this.info.offsetHeight,
      }),
    };
    return this.current;
  }
}
