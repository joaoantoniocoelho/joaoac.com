import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { MAX_TILT_X_DEG, MAX_TILT_Y_DEG, RESTING_TILT, idleTilt, tiltFor } from './tilt.ts';

const box = { left: 100, top: 200, width: 400, height: 400 };

describe('tiltFor', () => {
  it('rests flat when the pointer is at the center', () => {
    assert.deepEqual(tiltFor(300, 400, box), RESTING_TILT);
  });

  it('leans toward the top-left corner', () => {
    const tilt = tiltFor(100, 200, box);
    assert.equal(tilt.rotateX, MAX_TILT_X_DEG / 2);
    assert.equal(tilt.rotateY, -MAX_TILT_Y_DEG / 2);
    assert.equal(tilt.glareX, 0);
    assert.equal(tilt.glareY, 0);
  });

  it('clamps pointers outside the card to its edges', () => {
    assert.deepEqual(tiltFor(10_000, 10_000, box), tiltFor(500, 600, box));
  });

  it('stays at rest for a card with no size yet', () => {
    assert.deepEqual(tiltFor(10, 10, { left: 0, top: 0, width: 0, height: 0 }), RESTING_TILT);
  });
});

describe('idleTilt', () => {
  it('never leans past the pointer tilt', () => {
    for (let time = 0; time < 70_000; time += 250) {
      const tilt = idleTilt(time);
      assert.ok(Math.abs(tilt.rotateX) <= MAX_TILT_X_DEG / 2);
      assert.ok(Math.abs(tilt.rotateY) <= MAX_TILT_Y_DEG / 2);
      assert.ok(tilt.glareX >= 0 && tilt.glareX <= 100);
      assert.ok(tilt.glareY >= 0 && tilt.glareY <= 100);
    }
  });

  it('keeps moving over time', () => {
    assert.notDeepEqual(idleTilt(0), idleTilt(1750));
  });

  it('leans the glare the same way as the pointer tilt does', () => {
    const tilt = idleTilt(1750);
    assert.ok(tilt.rotateY > 0 && tilt.glareX > 50);
  });
});
