import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { copyText } from './clipboard.ts';

const link = 'https://www.joaoac.com/blog/this-breach-was-preventable';

function recordingClipboard(fails = false) {
  const written: string[] = [];
  return {
    written,
    writeText(value: string): Promise<void> {
      if (fails) return Promise.reject(new Error('NotAllowedError'));
      written.push(value);
      return Promise.resolve();
    },
  };
}

describe('copyText', () => {
  it('writes through the Clipboard API', async () => {
    const clipboard = recordingClipboard();
    assert.equal(await copyText(link, clipboard), true);
    assert.deepEqual(clipboard.written, [link]);
  });

  it('reports failure when the browser denies the write', async () => {
    assert.equal(await copyText(link, recordingClipboard(true)), false);
  });

  it('reports failure when there is no Clipboard API', async () => {
    assert.equal(await copyText(link, undefined), false);
  });
});
