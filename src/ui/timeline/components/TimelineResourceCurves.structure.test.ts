import { describe, expect, it } from 'vitest';
import source from './TimelineResourceCurves.vue?raw';

describe('resource curve stacking', () => {
  it('keeps scrolling SP warnings below the fixed resource controls', () => {
    const layer = (selector: string) => {
      const block = source.slice(source.indexOf(`${selector} {`)).split('}')[0]!;
      return Number(block.match(/z-index:\s*(\d+)/)?.[1]);
    };
    expect(layer('.sp-warning-tag')).toBeGreaterThanOrEqual(layer('.curve-chart'));
    expect(layer('.sp-warning-tag')).toBeLessThan(layer('.curve-label'));
  });
});
