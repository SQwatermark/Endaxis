import { describe, expect, it } from 'vitest';
import {
  normalizeTimelineZoomPercent,
  timelinePxPerFrame,
  stepTimelineZoomPercent,
} from './timelineZoom';

describe('timelineZoom', () => {
  it('将缩放百分比换算成统一的每帧像素', () => {
    expect(timelinePxPerFrame(50) * 30).toBeCloseTo(25);
    expect(timelinePxPerFrame(100) * 30).toBeCloseTo(50);
    expect(timelinePxPerFrame(200) * 30).toBeCloseTo(100);
  });

  it('拒绝越界值和非有限值进入时间轴几何计算', () => {
    expect(normalizeTimelineZoomPercent(25)).toBe(30);
    expect(normalizeTimelineZoomPercent(2500)).toBe(2400);
    expect(normalizeTimelineZoomPercent(Number.NaN)).toBe(100);
  });

  it('按当前秒宽调整 10%，并在上下限停止', () => {
    expect(stepTimelineZoomPercent(100, 1)).toBe(110);
    expect(stepTimelineZoomPercent(200, 1)).toBe(220);
    expect(stepTimelineZoomPercent(200, -1)).toBe(180);
    expect(stepTimelineZoomPercent(30, -1)).toBe(30);
    expect(stepTimelineZoomPercent(2400, 1)).toBe(2400);
  });
});
