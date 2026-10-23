import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { discoveryOrder, initialPrompts, prompts, promptsPtBr } from '../data/ichiro-prompts.ts';
import { parseChatData } from './chat-data.ts';

const valid = {
  greeting: 'Hi',
  email: 'me@example.com',
  prompts: {
    a: {
      question: 'A?',
      answer: 'A.',
      next: ['b'],
      links: [{ label: 'Mail', action: 'reveal-email' }],
    },
    b: { question: 'B?', answer: 'B.', next: [] },
  },
  initialPrompts: ['a'],
  discoveryOrder: ['b'],
  strings: { emailAnswer: 'Email at', copyEmail: 'Copy', copied: 'Copied', done: 'Done' },
  moods: { idle: '/idle.webp', thinking: '/thinking.webp', greeting: '/greeting.webp' },
};

const withPrompts = (promptSet: unknown) => JSON.stringify({ ...valid, prompts: promptSet });

describe('parseChatData', () => {
  it('accepts well-formed data and defaults missing links to an empty list', () => {
    const data = parseChatData(JSON.stringify(valid));
    assert.ok(data);
    assert.equal(data.prompts.b?.links.length, 0);
    assert.equal(data.prompts.a?.links[0]?.action, 'reveal-email');
  });

  it('rejects invalid JSON', () => {
    assert.equal(parseChatData('{'), null);
  });

  it('rejects a prompt that points to a question that does not exist', () => {
    const broken = { a: { question: 'A?', answer: 'A.', next: ['missing'] }, b: valid.prompts.b };
    assert.equal(parseChatData(withPrompts(broken)), null);
  });

  it('rejects a link with neither a destination nor an action', () => {
    const broken = { ...valid.prompts, a: { ...valid.prompts.a, links: [{ label: 'Nowhere' }] } };
    assert.equal(parseChatData(withPrompts(broken)), null);
  });

  it('accepts the real prompt sets shipped with the site', () => {
    for (const promptSet of [prompts, promptsPtBr]) {
      const raw = JSON.stringify({ ...valid, prompts: promptSet, initialPrompts, discoveryOrder });
      assert.notEqual(parseChatData(raw), null);
    }
  });

  it('does not offer the removed resume download in either language', () => {
    for (const promptSet of [prompts, promptsPtBr]) {
      assert.equal('resume' in promptSet, false);
      const offeredIds = [
        ...initialPrompts,
        ...discoveryOrder,
        ...Object.values(promptSet).flatMap((prompt) => prompt.next),
      ];
      assert.equal(new Set<string>(offeredIds).has('resume'), false);

      for (const prompt of Object.values(promptSet)) {
        assert.equal(prompt.links?.some((link) => link.href === '/resume') ?? false, false);
      }
    }
  });
});
