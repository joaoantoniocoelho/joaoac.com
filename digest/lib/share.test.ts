import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { linkedInShareUrl, sharedEditionUrl, xShareUrl } from './share.ts';

const edition = 'https://digest.joaoac.com/digest/2026-10-05';

describe('sharedEditionUrl', () => {
  it('tags the canonical edition URL with the channel ref', () => {
    assert.equal(sharedEditionUrl(edition, 'copy'), `${edition}?ref=share`);
    assert.equal(sharedEditionUrl(edition, 'x'), `${edition}?ref=x`);
    assert.equal(sharedEditionUrl(edition, 'linkedin'), `${edition}?ref=linkedin`);
  });

  it('keeps the locale prefix of Portuguese editions', () => {
    assert.equal(sharedEditionUrl('https://digest.joaoac.com/pt-BR/digest/2026-10-05', 'x'), 'https://digest.joaoac.com/pt-BR/digest/2026-10-05?ref=x');
  });
});

describe('xShareUrl', () => {
  it('builds a post intent with the text and URL encoded', () => {
    const shareUrl = new URL(xShareUrl('Tech Digest — October 5, 2026 & more', `${edition}?ref=x`));
    assert.equal(`${shareUrl.origin}${shareUrl.pathname}`, 'https://x.com/intent/post');
    assert.equal(shareUrl.searchParams.get('text'), 'Tech Digest — October 5, 2026 & more');
    assert.equal(shareUrl.searchParams.get('url'), `${edition}?ref=x`);
  });
});

describe('linkedInShareUrl', () => {
  it('builds a share-offsite link with only the encoded URL', () => {
    const shareUrl = linkedInShareUrl(`${edition}?ref=linkedin`);
    assert.equal(shareUrl, `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${edition}?ref=linkedin`)}`);
  });
});
