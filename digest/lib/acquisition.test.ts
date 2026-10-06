import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { acquisitionFields, acquisitionLimits, pageUrl, parseStoredAttribution, sanitizeAttributionValue, urlAttribution } from './acquisition.ts';

const edition = 'https://digest.joaoac.com/digest/2026-09-29';

describe('urlAttribution', () => {
  it('returns null when the URL carries no ref or UTM', () => {
    assert.equal(urlAttribution(edition), null);
    assert.equal(urlAttribution(`${edition}?page=2&fbclid=abc`), null);
    assert.equal(urlAttribution(`${edition}?ref=&utm_source=%20%20`), null);
  });

  it('maps ref to the acquisition source and drops the query from the page URL', () => {
    assert.deepEqual(urlAttribution(`${edition}?ref=x&fbclid=abc#top`), { acquisition_source: 'x', acquisition_url: edition });
  });

  it('reads the UTM parameters next to ref', () => {
    assert.deepEqual(urlAttribution('https://digest.joaoac.com/pt-BR?ref=linkedin&utm_source=linkedin&utm_medium=social&utm_campaign=launch'), {
      acquisition_source: 'linkedin',
      acquisition_url: 'https://digest.joaoac.com/pt-BR',
      utm_source: 'linkedin',
      utm_medium: 'social',
      utm_campaign: 'launch',
    });
  });

  it('keeps UTM-only visits without inventing a source', () => {
    assert.deepEqual(urlAttribution(`${edition}?utm_medium=email`), { acquisition_url: edition, utm_medium: 'email' });
  });

  it('decodes values, trims them and keeps their case for the backend to normalize', () => {
    assert.deepEqual(urlAttribution(`${edition}?ref=%20Ship%20Club%20&utm_campaign=a%2Bb`), { acquisition_source: 'Ship Club', acquisition_url: edition, utm_campaign: 'a+b' });
  });

  it('uses the first value when a parameter repeats', () => {
    assert.equal(urlAttribution(`${edition}?ref=x&ref=linkedin`)?.acquisition_source, 'x');
  });

  it('ignores parameters inside the hash fragment', () => {
    assert.equal(urlAttribution('https://digest.joaoac.com/#subscribe?ref=x'), null);
  });

  it('truncates every value to the backend limits', () => {
    const fields = urlAttribution(`https://digest.joaoac.com/${'p'.repeat(5000)}?ref=${'r'.repeat(500)}&utm_source=${'s'.repeat(500)}&utm_medium=${'m'.repeat(500)}&utm_campaign=${'c'.repeat(5000)}`);
    assert.equal(fields?.acquisition_url?.length, acquisitionLimits.url);
    assert.equal(fields?.acquisition_source, 'r'.repeat(acquisitionLimits.source));
    assert.equal(fields?.utm_source?.length, acquisitionLimits.utm);
    assert.equal(fields?.utm_medium?.length, acquisitionLimits.utm);
    assert.equal(fields?.utm_campaign?.length, acquisitionLimits.utm);
  });

  it('strips control characters and keeps non-ASCII text', () => {
    assert.deepEqual(urlAttribution(`${edition}?ref=%01x%0A%7F&utm_campaign=caf%C3%A9%20%F0%9F%9A%80%C2%85`), {
      acquisition_source: 'x',
      acquisition_url: edition,
      utm_campaign: 'café 🚀',
    });
  });

  it('drops values made only of control characters', () => {
    assert.equal(urlAttribution(`${edition}?ref=%01%02%1F`), null);
  });

  it('returns null for an unparseable URL instead of throwing', () => {
    assert.equal(urlAttribution('not a url'), null);
  });
});

describe('sanitizeAttributionValue', () => {
  it('counts code points so an emoji is never split', () => {
    assert.equal(sanitizeAttributionValue('🚀🚀🚀', 2), '🚀🚀');
  });

  it('returns undefined for blank values', () => {
    assert.equal(sanitizeAttributionValue(' \t\n ', 10), undefined);
  });
});

describe('pageUrl', () => {
  it('keeps only origin and path', () => {
    assert.equal(pageUrl(`${edition}?ref=x&utm_source=y#subscribe`), edition);
    assert.equal(pageUrl('nope'), undefined);
  });
});

describe('acquisitionFields', () => {
  const entry = { acquisition_source: 'linkedin', acquisition_url: 'https://digest.joaoac.com/' };

  it('prefers the stored entry attribution over the current page', () => {
    assert.deepEqual(acquisitionFields(`${edition}?ref=x`, entry), entry);
  });

  it('falls back to the attribution in the current URL', () => {
    assert.deepEqual(acquisitionFields(`${edition}?ref=x`, null), { acquisition_source: 'x', acquisition_url: edition });
  });

  it('marks visits without any attribution as direct', () => {
    assert.deepEqual(acquisitionFields(`${edition}?page=2`, null), { acquisition_source: 'direct', acquisition_url: edition });
  });

  it('still sends direct when the current URL cannot be parsed', () => {
    assert.deepEqual(acquisitionFields('not a url', null), { acquisition_source: 'direct' });
  });

  it('keeps the JSON body well below the backend size limit for a huge campaign URL', () => {
    const noisy = '%01'.repeat(3000);
    const href = `https://digest.joaoac.com/digest/2026-09-29?ref=${noisy}x&utm_source=${'s'.repeat(3000)}&utm_medium=${noisy}&utm_campaign=${'c'.repeat(3000)}&fbclid=${'f'.repeat(3000)}`;
    const body = JSON.stringify({ email: `${'a'.repeat(242)}@example.com`, ...acquisitionFields(href, null) });
    assert.ok(new TextEncoder().encode(body).length < 4096, `body has ${new TextEncoder().encode(body).length} bytes`);
  });

  it('stays below 8 KB even when every value is made of 4-byte characters', () => {
    const rockets = encodeURIComponent('🚀'.repeat(1000));
    const href = `https://digest.joaoac.com/${rockets}?ref=${rockets}&utm_source=${rockets}&utm_medium=${rockets}&utm_campaign=${rockets}`;
    const body = JSON.stringify({ email: `${'a'.repeat(242)}@example.com`, ...acquisitionFields(href, null) });
    assert.ok(new TextEncoder().encode(body).length < 8192);
  });
});

describe('parseStoredAttribution', () => {
  it('reads back what was stored', () => {
    const fields = { acquisition_source: 'x', acquisition_url: edition, utm_medium: 'social' };
    assert.deepEqual(parseStoredAttribution(JSON.stringify(fields)), fields);
  });

  it('ignores missing, malformed or non-object values', () => {
    for (const raw of [null, '', '{', 'null', '"x"', '[]', '42', '{}']) {
      assert.equal(parseStoredAttribution(raw), null, String(raw));
    }
  });

  it('drops unknown keys and non-string values, and limits the rest again', () => {
    const raw = `{"acquisition_source":"\\u0001${'r'.repeat(100)}","utm_source":42,"email":"x@y.z","__proto__":"x","toString":"x"}`;
    assert.deepEqual(parseStoredAttribution(raw), { acquisition_source: 'r'.repeat(acquisitionLimits.source) });
  });
});
