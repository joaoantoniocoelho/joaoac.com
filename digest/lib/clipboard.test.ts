import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { copyText } from './clipboard.ts';

const link = 'https://digest.joaoac.com/digest/2026-10-05?ref=share';

function recordingClipboard(fails = false) {
  const written: string[] = [];
  return {
    written,
    async writeText(value: string) {
      if (fails) throw new Error('NotAllowedError');
      written.push(value);
    },
  };
}

describe('copyText', () => {
  it('uses the Clipboard API when it is available', async () => {
    const clipboard = recordingClipboard();
    const fallbackCalls: string[] = [];
    const copied = await copyText(link, clipboard, value => { fallbackCalls.push(value); return true; });
    assert.equal(copied, true);
    assert.deepEqual(clipboard.written, [link]);
    assert.deepEqual(fallbackCalls, []);
  });

  it('falls back when the Clipboard API rejects', async () => {
    const fallbackCalls: string[] = [];
    const copied = await copyText(link, recordingClipboard(true), value => { fallbackCalls.push(value); return true; });
    assert.equal(copied, true);
    assert.deepEqual(fallbackCalls, [link]);
  });

  it('falls back when the Clipboard API is missing', async () => {
    assert.equal(await copyText(link, undefined, () => true), true);
  });

  it('reports failure when no method can copy', async () => {
    assert.equal(await copyText(link, undefined, () => false), false);
    assert.equal(await copyText(link, recordingClipboard(true), () => { throw new Error('SecurityError'); }), false);
  });
});
