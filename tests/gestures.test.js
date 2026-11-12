import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DragVelocity, releaseTarget } from '../src/journey/gestures.js';

test('a slow release closes when barely opened and opens when past the threshold', () => {
  assert.equal(releaseTarget({ progress: 0.1, velocity: 0 }), 0);
  assert.equal(releaseTarget({ progress: 0.45, velocity: 0 }), 1);
});

test('a flick finishes in its direction even from far away', () => {
  assert.equal(releaseTarget({ progress: 0.08, velocity: 2 }), 1, 'quick swipe up opens');
  assert.equal(releaseTarget({ progress: 0.6, velocity: -2 }), 0, 'quick swipe down closes');
});

test('drag velocity follows the finger and is forgotten after a pause', () => {
  const velocity = new DragVelocity();
  velocity.reset(0);
  for (let t = 16; t <= 160; t += 16) velocity.sample(0.016, t); // 1 progress unit per second
  const measured = velocity.release(170);
  assert.ok(Math.abs(measured - 1) < 0.05, `≈1, got ${measured}`);
  assert.equal(velocity.release(400), 0, 'finger rested before lifting');
});
