import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { archivePath, editionPath, formatEditionDate, homePath, otherLocale, parsePage, subscribePath } from './digest-routes.ts';

describe('digest routes', () => {
  it('keeps English paths unprefixed and Portuguese paths under /pt-BR', () => {
    assert.equal(homePath('en'), '/');
    assert.equal(homePath('pt-BR'), '/pt-BR');
    assert.equal(subscribePath('en'), '/#subscribe');
    assert.equal(subscribePath('pt-BR'), '/pt-BR#subscribe');
    assert.equal(editionPath('en', '2026-10-05'), '/digest/2026-10-05');
    assert.equal(editionPath('pt-BR', '2026-10-05'), '/pt-BR/digest/2026-10-05');
  });

  it('only adds the page query after the first archive page', () => {
    assert.equal(archivePath('en'), '/digest');
    assert.equal(archivePath('en', 1), '/digest');
    assert.equal(archivePath('en', 3), '/digest?page=3');
    assert.equal(archivePath('pt-BR', 3), '/pt-BR/digest?page=3');
  });

  it('switches to the other locale', () => {
    assert.equal(otherLocale('en'), 'pt-BR');
    assert.equal(otherLocale('pt-BR'), 'en');
  });

  it('formats edition dates in the page language', () => {
    assert.equal(formatEditionDate('en', '2026-10-05'), 'October 5, 2026');
    assert.equal(formatEditionDate('pt-BR', '2026-10-05'), '5 de outubro de 2026');
  });
});

describe('parsePage', () => {
  it('defaults to the first page', () => {
    assert.equal(parsePage(undefined), 1);
  });

  it('accepts positive integers', () => {
    assert.equal(parsePage('1'), 1);
    assert.equal(parsePage('42'), 42);
    assert.equal(parsePage('100000'), 100_000);
  });

  it('rejects values the API would reject', () => {
    for (const value of ['', '0', '-1', '01', '1.5', 'abc', '²', '100001', '9'.repeat(400), ['1', '2']]) {
      assert.equal(parsePage(value), null, String(value));
    }
  });
});
