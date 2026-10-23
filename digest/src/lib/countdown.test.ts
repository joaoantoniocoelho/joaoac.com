import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatCountdown, secondsUntilNextEdition } from './countdown.ts';

describe('secondsUntilNextEdition', () => {
  it('counts down to 7:00 the same morning in Brasília (UTC-3)', () => {
    // 06:00 in Brasília is 09:00 UTC.
    assert.equal(secondsUntilNextEdition(new Date('2026-10-22T09:00:00Z')), 3600);
  });

  it('rolls over to the next day once the edition went out', () => {
    // 07:00:01 in Brasília: the next send is almost 24 hours away.
    assert.equal(secondsUntilNextEdition(new Date('2026-10-22T10:00:01Z')), 24 * 3600 - 1);
  });
});

describe('formatCountdown', () => {
  it('pads every unit to two digits', () => {
    assert.deepEqual(formatCountdown(3 * 3600 + 4 * 60 + 5), {
      hours: '03',
      minutes: '04',
      seconds: '05',
    });
  });
});
