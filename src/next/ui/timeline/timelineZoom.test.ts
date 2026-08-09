import { describe, expect, it } from 'vitest';
import { normalizeTimelineZoomPercent, timelinePxPerFrame } from './timelineZoom';

describe('timelineZoom', () => {
  it('将缩放百分比换算成统一的每帧像素', () => {
    expect(timelinePxPerFrame(50)).toBe(1);
    expect(timelinePxPerFrame(100)).toBe(2);
    expect(timelinePxPerFrame(200)).toBe(4);
  });

  it('拒绝越界值和非有限值进入时间轴几何计算', () => {
    expect(normalizeTimelineZoomPercent(25)).toBe(50);
    expect(normalizeTimelineZoomPercent(250)).toBe(200);
    expect(normalizeTimelineZoomPercent(Number.NaN)).toBe(100);
  });
});
