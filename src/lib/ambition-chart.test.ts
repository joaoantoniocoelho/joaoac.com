import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CHART, curvePath, gapAreaPath, point } from './ambition-chart.ts';

describe('paths', () => {
  it('draws each curve from the shared start to its end', () => {
    for (const endY of [CHART.wantY, CHART.canY]) {
      const path = curvePath(endY);
      assert.ok(path.startsWith(`M${point(CHART.startX, CHART.startY)}C`));
      assert.ok(path.endsWith(point(CHART.endX, endY)));
    }
  });

  it('closes the gap area between the two curves', () => {
    const area = gapAreaPath();
    assert.ok(area.startsWith(curvePath(CHART.wantY)));
    assert.ok(area.includes(`V${String(CHART.canY)}C`));
    assert.ok(area.endsWith(`${point(CHART.startX, CHART.startY)}Z`));
  });
});
