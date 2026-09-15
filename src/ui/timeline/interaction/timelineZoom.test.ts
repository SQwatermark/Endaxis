import { describe, expect, it } from 'vitest';
import {
  normalizeTimelineZoomPercent,
  timelinePxPerFrame,
  stepTimelineZoomPercent,
  wheelTimelineZoomPercent,
} from './timelineViewport';

describe('timelineZoom', () => {
  it('滚轮按秒宽取整，显示比例与 range 步长保持一致', () => {
    expect(wheelTimelineZoomPercent(100, 1)).toBe(116);
    expect(wheelTimelineZoomPercent(116, -1)).toBe(98);
    expect(wheelTimelineZoomPercent(100, -1)).toBe(86);
    expect(wheelTimelineZoomPercent(30, -1)).toBe(30);
    expect(wheelTimelineZoomPercent(2400, 1)).toBe(2400);
  });
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
