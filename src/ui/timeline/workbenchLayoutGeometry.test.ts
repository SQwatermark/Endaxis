import { describe, expect, it } from 'vitest';
import {
  resolveWorkbenchBottomHeight,
  resolveWorkbenchBottomHeightBounds,
} from './workbenchLayoutGeometry';

describe('workbench bottom panel geometry', () => {
  it.each([
    ['unmeasured root', 0, 240, false, 240],
    ['short 720px root', 720, 240, false, 69],
    ['exact default capacity', 891, 240, false, 240],
    ['normal desktop root', 1080, 240, false, 240],
    ['expanded panel', 1200, 480, false, 480],
    ['viewport-limited expansion', 1200, 800, false, 549],
    ['collapsed panel', 1080, 240, true, 0],
  ] as const)('%s resolves to %dpx', (_label, height, requested, collapsed, expected) => {
    expect(resolveWorkbenchBottomHeight(height, requested, collapsed)).toBe(expected);
  });

  it('lowers the minimum only when the viewport cannot preserve 600px of timeline', () => {
    expect(resolveWorkbenchBottomHeightBounds(720, 240)).toEqual({ minimum: 69, maximum: 69 });
    expect(resolveWorkbenchBottomHeightBounds(1080, 240)).toEqual({
      minimum: 240,
      maximum: 429,
    });
  });
});
