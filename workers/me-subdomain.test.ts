import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { routeFor } from './me-subdomain.ts';

const proxy = (url: string) => ({ action: 'proxy', url });
const redirect = (url: string) => ({ action: 'redirect', url });

describe('routeFor', () => {
  it('serves the links page at the root', () => {
    assert.deepEqual(routeFor('https://me.joaoac.com/'), proxy('https://www.joaoac.com/links'));
  });

  it('serves the english links page at /en', () => {
    assert.deepEqual(
      routeFor('https://me.joaoac.com/en'),
      proxy('https://www.joaoac.com/en/links'),
    );
  });

  it('accepts a trailing slash on the page paths', () => {
    assert.deepEqual(
      routeFor('https://me.joaoac.com/en/'),
      proxy('https://www.joaoac.com/en/links'),
    );
  });

  it('keeps the query string on the page', () => {
    assert.deepEqual(
      routeFor('https://me.joaoac.com/?utm_source=x'),
      proxy('https://www.joaoac.com/links?utm_source=x'),
    );
  });

  it('keeps the language switch on the subdomain', () => {
    assert.deepEqual(routeFor('https://me.joaoac.com/links'), redirect('https://me.joaoac.com/'));
    assert.deepEqual(
      routeFor('https://me.joaoac.com/en/links?ref=x'),
      redirect('https://me.joaoac.com/en?ref=x'),
    );
  });

  it('sends the old portuguese addresses to the root', () => {
    assert.deepEqual(routeFor('https://me.joaoac.com/pt-BR'), redirect('https://me.joaoac.com/'));
    assert.deepEqual(
      routeFor('https://me.joaoac.com/pt-BR/links?ref=x'),
      redirect('https://me.joaoac.com/?ref=x'),
    );
  });

  it('proxies the files the page loads', () => {
    assert.deepEqual(
      routeFor('https://me.joaoac.com/_astro/plex.abc123.woff2'),
      proxy('https://www.joaoac.com/_astro/plex.abc123.woff2'),
    );
    assert.deepEqual(
      routeFor('https://me.joaoac.com/icon.png'),
      proxy('https://www.joaoac.com/icon.png'),
    );
  });

  it('sends every other path to the main site', () => {
    assert.deepEqual(
      routeFor('https://me.joaoac.com/blog/some-post?ref=x'),
      redirect('https://www.joaoac.com/blog/some-post?ref=x'),
    );
  });

  it('always lands on https', () => {
    assert.deepEqual(
      routeFor('http://me.joaoac.com/en?ref=x'),
      redirect('https://me.joaoac.com/en?ref=x'),
    );
  });
});
