import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { AcquisitionFields } from './acquisition.ts';
import { shouldRetryWithoutAttribution, subscribeBody, subscribeOutcome } from './subscribe.ts';

describe('subscribeBody', () => {
  it('sends the attribution next to the email', () => {
    assert.deepEqual(subscribeBody('a@b.co', { acquisition_source: 'x' }), { acquisition_source: 'x', email: 'a@b.co' });
  });

  it('never lets attribution overwrite the email', () => {
    const attribution: AcquisitionFields = Object.fromEntries([['email', 'evil@x.co']]);
    assert.equal(subscribeBody('a@b.co', attribution).email, 'a@b.co');
  });
});

describe('subscribeOutcome', () => {
  it('maps API statuses to form outcomes', () => {
    assert.equal(subscribeOutcome(200), 'success');
    assert.equal(subscribeOutcome(400), 'invalid');
    assert.equal(subscribeOutcome(429), 'rate');
  });

  it('does not blame the email for a body that was too large', () => {
    assert.equal(subscribeOutcome(413), 'unavailable');
  });

  it('treats anything else as unavailable', () => {
    for (const status of [201, 404, 500, 502, 503]) assert.equal(subscribeOutcome(status), 'unavailable', String(status));
  });
});

describe('shouldRetryWithoutAttribution', () => {
  it('retries a 413 once the body carries attribution', () => {
    assert.equal(shouldRetryWithoutAttribution(413, { email: 'a@b.co', acquisition_source: 'x' }), true);
  });

  it('does not retry an email-only body or other statuses', () => {
    assert.equal(shouldRetryWithoutAttribution(413, { email: 'a@b.co' }), false);
    assert.equal(shouldRetryWithoutAttribution(400, { email: 'a@b.co', acquisition_source: 'x' }), false);
    assert.equal(shouldRetryWithoutAttribution(500, { email: 'a@b.co', acquisition_source: 'x' }), false);
  });
});
