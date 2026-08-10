import { describe, expect, it } from 'vitest';
import {
  frameToTimelinePx,
  resolveTimelineCursorGuidePosition,
  timelinePxToFrame,
  timelineTotalWidth,
} from './timelineGeometry';

describe('timeline geometry', () => {
  it('places battle frame zero after the preparation area', () => {
    expect(frameToTimelinePx(0, 150, 2)).toBe(300);
    expect(frameToTimelinePx(-150, 150, 2)).toBe(0);
  });

  it('round-trips integer frame positions', () => {
    expect(timelinePxToFrame(frameToTimelinePx(42, 150, 2), 150, 2)).toBe(42);
  });

  it('includes preparation and battle spans in total width', () => {
    expect(timelineTotalWidth(150, 900, 2)).toBe(2100);
  });

  it('keeps the guide under the pointer while clamping its sample frame', () => {
    expect(resolveTimelineCursorGuidePosition(120, 150, 900, 2)).toEqual({
      leftPx: 120,
      sampleFrame: 0,
    });
    expect(resolveTimelineCursorGuidePosition(384, 150, 900, 2)).toEqual({
      leftPx: 384,
      sampleFrame: 42,
    });
    expect(resolveTimelineCursorGuidePosition(9999, 150, 900, 2)).toEqual({
      leftPx: 2100,
      sampleFrame: 900,
    });
  });
});
