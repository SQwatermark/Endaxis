import { describe, expect, it } from 'vitest';
import {
  COLLAPSED_PREP_WIDTH_PX,
  frameToTimelinePx,
  resolveTimelineCursorGuidePosition,
  timelinePxToExactFrame,
  timelinePxToFrame,
  timelineTotalWidth,
} from './timelineGeometry';

describe('timeline geometry', () => {
  it('places battle frame zero after the preparation area', () => {
    expect(frameToTimelinePx(0, 150, 2)).toBe(300);
    expect(frameToTimelinePx(-150, 150, 2)).toBe(0);
  });

  it('compresses only the preparatory interval when collapsed', () => {
    expect(frameToTimelinePx(-150, 150, 2, false)).toBe(0);
    expect(frameToTimelinePx(-75, 150, 2, false)).toBe(COLLAPSED_PREP_WIDTH_PX / 2);
    expect(frameToTimelinePx(0, 150, 2, false)).toBe(COLLAPSED_PREP_WIDTH_PX);
    expect(frameToTimelinePx(30, 150, 2, false)).toBe(COLLAPSED_PREP_WIDTH_PX + 60);
    expect(timelinePxToFrame(COLLAPSED_PREP_WIDTH_PX / 2, 150, 2, false)).toBe(-75);
    expect(timelinePxToFrame(COLLAPSED_PREP_WIDTH_PX + 60, 150, 2, false)).toBe(30);
    expect(timelineTotalWidth(150, 900, 2, false)).toBe(COLLAPSED_PREP_WIDTH_PX + 1800);
  });

  it('round-trips integer frame positions', () => {
    expect(timelinePxToFrame(frameToTimelinePx(42, 150, 2), 150, 2)).toBe(42);
  });

  it('keeps fractional frames available until callers perform snapping', () => {
    expect(timelinePxToExactFrame(383, 150, 2)).toBe(41.5);
    expect(timelinePxToExactFrame(18 + 61, 150, 2, false)).toBe(30.5);
    expect(timelinePxToFrame(383, 150, 2)).toBe(42);
  });

  it('includes preparation and battle spans in total width', () => {
    expect(timelineTotalWidth(150, 900, 2)).toBe(2100);
  });

  it('keeps the guide under the pointer while clamping its sample frame', () => {
    expect(resolveTimelineCursorGuidePosition(120, 150, 900, 2)).toEqual({
      leftPx: 120,
      sampleFrame: -90,
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
