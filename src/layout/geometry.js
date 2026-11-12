import { clamp, easeInOutCubic, lerp, progressBetween } from '../core/math.js';

/** Scene frame and laptop measurements, in frame units (the frame is 1440×810). */
export const FRAME = Object.freeze({ width: 1440, height: 810, centerX: 720 });
export const LAPTOP = Object.freeze({
  top: 68,           // top of the open lid
  bottom: 812,       // bottom of the front lip
  hingeY: 752.7,
  lidHeight: 680,
  closedAngle: -89,  // degrees; 0 is fully open
});
export const PERSPECTIVE = Object.freeze({ distance: 4000, originY: 560 });
export const COMPACT_BREAKPOINT = 820;

export const isCompact = (width) => width <= COMPACT_BREAKPOINT;

/** CSS unit used by the overlay (--n). */
export const viewportUnit = (width, height) =>
  isCompact(width) ? width / 430 : Math.min(width / 1440, height / 900);

/** Camera pose for the hero: the closed laptop sits low and centred. */
export function heroPose({ width, height }) {
  const openHeight = LAPTOP.hingeY - LAPTOP.top;
  const scale = isCompact(width)
    ? Math.min((width * 0.94) / 1250, (height * 0.42) / openHeight)
    : Math.min((width * 0.62) / 1250, (height * 0.8 - 90) / openHeight);
  return {
    scale,
    x: width / 2 - FRAME.centerX * scale,
    y: height * 0.8 - LAPTOP.hingeY * scale,
  };
}

/** Camera pose for the showcase: the screen fills the view, leaving room for the UI. */
export function showcasePose({ width, height, ticketHeight = 0, infoHeight = 0 }) {
  const laptopHeight = LAPTOP.bottom - LAPTOP.top;

  if (isCompact(width)) {
    const bottomNav = 0.022 * height + 42 + 22;
    const topUi = 62 + ticketHeight + 18 + Math.max(60, infoHeight) + 14;
    const scale = Math.min((width - 28) / 960, Math.max(0.2, (height - bottomNav - topUi) / laptopHeight));
    return { scale, x: width / 2 - FRAME.centerX * scale, y: height - bottomNav - LAPTOP.bottom * scale };
  }

  const cover = Math.max(width / FRAME.width, height / FRAME.height);
  const unit = Math.min(width / 1440, height / 900);
  const top = 66 * unit;
  const fit = (height - top - 28 * unit) / laptopHeight;
  const widthFit = width / 1300; // keeps the whole laptop inside on tall screens

  let scale;
  let y;
  if (fit >= cover && cover <= widthFit) {
    scale = cover;
    y = Math.min(0, Math.max(height - LAPTOP.bottom * scale, top - LAPTOP.top * scale));
  } else {
    scale = Math.min(fit, widthFit);
    y = Math.max(top - LAPTOP.top * scale, (height - laptopHeight * scale) / 2 - LAPTOP.top * scale);
  }
  return { scale, x: (width - FRAME.width * scale) / 2, y };
}

export const interpolatePose = (from, to, t) => ({
  scale: lerp(from.scale, to.scale, t),
  x: lerp(from.x, to.x, t),
  y: lerp(from.y, to.y, t),
});

/** Projected y (frame units) of the lid's top edge for a lid angle in degrees. */
export function lidTopY(angle) {
  const radians = (angle * Math.PI) / 180;
  const y = LAPTOP.hingeY - LAPTOP.lidHeight * Math.cos(radians);
  const z = -LAPTOP.lidHeight * Math.sin(radians);
  const { distance, originY } = PERSPECTIVE;
  return originY + ((y - originY) * distance) / (distance - z);
}

/**
 * Everything the scene needs for a journey progress value:
 * 0 = hero with the lid closed, 0.5 = lid open, 1 = camera inside the screen.
 */
export function journeyFrame(progress) {
  const open = easeInOutCubic(progressBetween(progress, 0, 0.5));
  const zoom = easeInOutCubic(progressBetween(progress, 0.45, 1));
  return {
    lidAngle: LAPTOP.closedAngle * (1 - open) + 0, // + 0 turns -0 into 0
    zoom,
    screenOpacity: progressBetween(progress, 0.25, 0.5),
    heroOpacity: 1 - progressBetween(progress, 0.35, 0.6),
  };
}

/**
 * Memoji box in viewport pixels. It rests on the hinge line and is clipped at the
 * lid's top edge, so opening the lid hides it.
 */
export function memojiBox({ hero, pose, lidAngle, wordmark, width, compact }) {
  const hingeY = hero.y + LAPTOP.hingeY * hero.scale;
  const wordmarkReach = wordmark.top + wordmark.height * (compact ? 1.1 : 0.5);
  const size = clamp((hingeY - wordmarkReach) / 0.9, 110, width * (compact ? 0.5 : 0.27));
  const top = hingeY - size * 0.93; // the image has ~7% empty space under the chin
  const clipY = Math.min(hingeY, pose.y + lidTopY(lidAngle) * pose.scale);
  return { left: width / 2 - size / 2, top, size, height: Math.max(0, clipY - top) };
}
