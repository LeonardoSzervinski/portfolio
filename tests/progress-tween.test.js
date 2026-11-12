import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ProgressTween } from '../src/journey/ProgressTween.js';

const runFor = (tween, seconds, fps) => {
  const frames = Math.round(seconds * fps);
  for (let i = 0; i < frames; i += 1) tween.step(1 / fps);
  return tween.value;
};

test('goTo reaches the target and settles', () => {
  const tween = new ProgressTween();
  tween.goTo(1);
  runFor(tween, 3, 60);
  assert.equal(tween.value, 1);
  assert.ok(tween.settled);
});

test('speed does not depend on the frame rate', () => {
  const slow = new ProgressTween();
  const fast = new ProgressTween();
  slow.goTo(1);
  fast.goTo(1);
  const at30 = runFor(slow, 0.3, 30);
  const at120 = runFor(fast, 0.3, 120);
  assert.ok(Math.abs(at30 - at120) < 0.02, `${at30} vs ${at120}`);
});

test('nudge follows the scroll and completes near the end', () => {
  const tween = new ProgressTween();
  tween.nudge(0.4);
  assert.equal(tween.target, 0.4);
  assert.equal(tween.auto, false);
  tween.nudge(0.58);
  assert.equal(tween.target, 1, 'past 97% it completes on its own');
  assert.equal(tween.auto, true);
});

test('targets are clamped to 0..1', () => {
  const tween = new ProgressTween();
  tween.nudge(-3);
  assert.equal(tween.target, 0);
  tween.goTo(7);
  assert.equal(tween.target, 1);
});

test('instant step jumps straight to the target (reduced motion)', () => {
  const tween = new ProgressTween();
  tween.goTo(1);
  tween.step(0.016, { instant: true });
  assert.equal(tween.value, 1);
});
