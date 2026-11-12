import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clamp, easeInOutCubic, lerp, progressBetween } from '../src/core/math.js';

test('clamp keeps values inside the range', () => {
  assert.equal(clamp(-1), 0);
  assert.equal(clamp(2), 1);
  assert.equal(clamp(0.4), 0.4);
  assert.equal(clamp(15, 10, 12), 12);
});

test('lerp interpolates linearly', () => {
  assert.equal(lerp(0, 10, 0), 0);
  assert.equal(lerp(0, 10, 0.5), 5);
  assert.equal(lerp(4, 8, 1), 8);
});

test('easeInOutCubic starts, centres and ends where expected', () => {
  assert.equal(easeInOutCubic(0), 0);
  assert.equal(easeInOutCubic(0.5), 0.5);
  assert.equal(easeInOutCubic(1), 1);
  assert.ok(easeInOutCubic(0.25) < 0.25, 'slow start');
  assert.ok(easeInOutCubic(0.75) > 0.75, 'slow end');
});

test('progressBetween maps a window to 0..1', () => {
  assert.equal(progressBetween(0.2, 0.25, 0.5), 0);
  assert.equal(progressBetween(0.375, 0.25, 0.5), 0.5);
  assert.equal(progressBetween(0.9, 0.25, 0.5), 1);
});
