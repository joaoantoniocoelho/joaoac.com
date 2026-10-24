import assert from 'node:assert/strict';
import test from 'node:test';
import { carouselEdges, carouselStep } from './carousel.ts';

test('carousel steps by one item and its gap', () => {
  assert.equal(carouselStep(220, 18), 238);
  assert.equal(carouselStep(0, 0), 0);
});

test('carousel edge states account for rounding and a track that fits', () => {
  assert.deepEqual(carouselEdges(0, 700, 400), { atStart: true, atEnd: false });
  assert.deepEqual(carouselEdges(299.5, 700, 400), { atStart: false, atEnd: true });
  assert.deepEqual(carouselEdges(0, 300, 400), { atStart: true, atEnd: true });
});
