import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { groupByMonth } from './archive.ts';

describe('groupByMonth', () => {
  const editions = [
    { date: '2026-10-02', article_count: 8 },
    { date: '2026-10-01', article_count: 1 },
    { date: '2026-09-30', article_count: 5 },
  ];

  it('groups consecutive editions under their month, keeping the order', () => {
    const months = groupByMonth('pt-BR', editions);
    assert.deepEqual(
      months.map((month) => [month.label, month.days.map((day) => day.day)]),
      [
        ['outubro de 2026', ['02', '01']],
        ['setembro de 2026', ['30']],
      ],
    );
  });

  it('names the weekday in the reader language', () => {
    const [october] = groupByMonth('en', editions);
    assert.ok(october);
    const [firstDay] = october.days;
    assert.ok(firstDay);
    assert.equal(firstDay.weekday, 'friday');
    assert.equal(firstDay.articleCount, 8);
  });

  it('returns no months for an empty archive', () => {
    assert.deepEqual(groupByMonth('en', []), []);
  });
});
