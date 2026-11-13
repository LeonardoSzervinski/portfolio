import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FRAME,
  LAPTOP,
  LID,
  TICKET,
  heroPose,
  interpolatePose,
  isCompact,
  journeyFrame,
  lidTopY,
  memojiBox,
  showcasePose,
  viewportUnit,
} from '../src/layout/geometry.js';

const VIEWPORTS = [
  { name: 'laptop', width: 1440, height: 860 },
  { name: 'full hd', width: 1920, height: 1080 },
  { name: 'tall window', width: 1630, height: 1380 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 375, height: 812 },
];

/** Horizontal extent of the laptop on screen (its front lip is the widest part). */
const laptopEdges = ({ x, scale }) => ({ left: x + 160 * scale, right: x + 1280 * scale });

test('compact layout starts at 820px', () => {
  assert.equal(isCompact(820), true);
  assert.equal(isCompact(821), false);
});

test('viewport unit grows with the screen', () => {
  assert.ok(viewportUnit(1920, 1080) > viewportUnit(1440, 900));
  assert.equal(viewportUnit(430, 900), 1);
});

for (const viewport of VIEWPORTS) {
  test(`hero: the laptop is centred and fully visible (${viewport.name})`, () => {
    const pose = heroPose(viewport);
    const { left, right } = laptopEdges(pose);
    assert.ok(left >= 0 && right <= viewport.width, 'inside horizontally');
    assert.ok(Math.abs(pose.x + FRAME.centerX * pose.scale - viewport.width / 2) < 0.5, 'centred');
    const lidTop = pose.y + LAPTOP.top * pose.scale;
    assert.ok(lidTop > 0, 'open lid stays below the top edge');
  });

  test(`showcase: the screen is bigger than in the hero (${viewport.name})`, () => {
    const hero = heroPose(viewport);
    const showcase = showcasePose({ ...viewport, ticketHeight: 140, infoHeight: 90 });
    assert.ok(showcase.scale > hero.scale);
  });
}

test('showcase keeps the whole laptop inside a tall desktop window', () => {
  const viewport = { width: 1630, height: 1380 };
  const { left, right } = laptopEdges(showcasePose(viewport));
  assert.ok(left >= -1 && right <= viewport.width + 1);
});

test('showcase: the lid never slides under the project window on wide screens', () => {
  for (const viewport of [{ width: 1440, height: 860 }, { width: 1920, height: 1080 }, { width: 1280, height: 720 }, { width: 967, height: 930 }, { width: 2560, height: 1300 }]) {
    const pose = showcasePose(viewport);
    const unit = viewportUnit(viewport.width, viewport.height);
    const ticketLeft = viewport.width - (TICKET.right + TICKET.width) * unit;
    const ticketBottom = (TICKET.top + TICKET.height) * unit;
    const lidRight = pose.x + (LID.left + LID.width) * pose.scale;
    const lidTop = pose.y + LAPTOP.top * pose.scale;
    assert.ok(lidRight <= ticketLeft || lidTop >= ticketBottom, `${viewport.width}×${viewport.height}`);
  }
});

test('lid top: open lid sits at its 2D position, a closed lid lies near the hinge', () => {
  assert.ok(Math.abs(lidTopY(0) - (LAPTOP.hingeY - LAPTOP.lidHeight)) < 1e-9);
  assert.ok(lidTopY(LAPTOP.closedAngle) > LAPTOP.hingeY - 20);
});

test('journey frame: closed at 0, open at 0.5, inside the screen at 1', () => {
  const start = journeyFrame(0);
  assert.equal(start.lidAngle, LAPTOP.closedAngle);
  assert.equal(start.zoom, 0);
  assert.equal(start.heroOpacity, 1);

  assert.equal(journeyFrame(0.5).lidAngle, 0);

  const end = journeyFrame(1);
  assert.equal(end.zoom, 1);
  assert.equal(end.heroOpacity, 0);
  assert.equal(end.screenOpacity, 1);
});

test('interpolatePose blends position and scale', () => {
  const from = { scale: 1, x: 0, y: 0 };
  const to = { scale: 2, x: 100, y: -50 };
  assert.deepEqual(interpolatePose(from, to, 0.5), { scale: 1.5, x: 50, y: -25 });
});

test('memoji is hidden by the lid as it opens', () => {
  const viewport = { width: 1440, height: 860 };
  const hero = heroPose(viewport);
  const base = { hero, pose: hero, wordmark: { top: 54, height: 228 }, width: viewport.width, compact: false };
  const closed = memojiBox({ ...base, lidAngle: LAPTOP.closedAngle });
  const open = memojiBox({ ...base, lidAngle: 0 });
  assert.ok(closed.height > open.height);
  assert.ok(closed.size >= 110);
});
