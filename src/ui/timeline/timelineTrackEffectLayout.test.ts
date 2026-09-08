import { describe, expect, it } from 'vitest';
import {
  projectTimelineTrackEffectLayout,
  resizeTimelineTrackPair,
  resolveCompactTrackHeights,
  TIMELINE_TRACK_MIN_HEIGHT,
  timelineLowerBuffTop,
} from './timelineTrackEffectLayout';

describe('timeline track effect layout', () => {
  it('fills available height and preserves resized proportions across viewport changes', () => {
    expect(resolveCompactTrackHeights([160, 160, 160, 160], 720)).toEqual([180, 180, 180, 180]);
    expect(resolveCompactTrackHeights([200, 120, 160, 160], 800)).toEqual([250, 160, 200, 190]);
    expect(resolveCompactTrackHeights([160, 160, 160, 160], 723).reduce((a, b) => a + b, 0)).toBe(
      723,
    );
    expect(resolveCompactTrackHeights([160, 160, 160, 160], 100)).toEqual([160, 160, 160, 160]);
    expect(resolveCompactTrackHeights([10000, 1, 1, 1], 800)).toEqual([320, 160, 160, 160]);
  });
  it('grows compact rows and the canvas when effects use many lanes', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'compact',
        upperLaneCount: 5,
        lowerLaneCount: 6,
      }),
    ).toEqual({ height: 362, actionTop: 156 });
  });

  it('treats a compact row-height override as a baseline rather than a clipping boundary', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'compact',
        compactHeight: 210,
        upperLaneCount: 8,
        lowerLaneCount: 9,
      }),
    ).toEqual({ height: 494, actionTop: 222 });
  });

  it('resizes adjacent compact rows without changing their pair total', () => {
    expect(resizeTimelineTrackPair([200, 200, 200, 200], 1, 35)).toEqual([200, 235, 165, 200]);
    expect(resizeTimelineTrackPair([160, 160], 0, 500)).toEqual([
      320 - TIMELINE_TRACK_MIN_HEIGHT,
      TIMELINE_TRACK_MIN_HEIGHT,
    ]);
    const original = [160, 160];
    expect(resizeTimelineTrackPair(original, 1, 20)).toBe(original);
  });

  it('reserves space for combo decorations even with two lower lanes', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'loose',
        upperLaneCount: 2,
        lowerLaneCount: 2,
      }),
    ).toEqual({ height: 186, actionTop: 68 });
  });

  it('uses the larger side as symmetric padding and keeps the action centered', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'loose',
        upperLaneCount: 4,
        lowerLaneCount: 5,
      }),
    ).toEqual({ height: 318, actionTop: 134 });
  });

  it('keeps shortened rows large enough for the complete identity controls and effects', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'compact',
        compactHeight: 66,
        upperLaneCount: 1,
        lowerLaneCount: 1,
      }),
    ).toEqual({ height: 160, actionTop: 55 });
  });

  it('stacks lower buffs inward from the edge without covering combo lines or labels', () => {
    for (const mode of ['compact', 'loose'] as const) {
      for (const count of [1, 2, 6, 12]) {
        const { height, actionTop } = projectTimelineTrackEffectLayout({
          mode,
          upperLaneCount: 3,
          lowerLaneCount: count,
        });
        expect(timelineLowerBuffTop(actionTop, 0) + 18).toBe(height - 5);
        const nearestBuffTop = timelineLowerBuffTop(actionTop, count - 1);
        // 冷却线在技能底边 +7px，文字再下移4px、高10px。
        expect(nearestBuffTop).toBeGreaterThan(actionTop + 50 + 7 + 4 + 10);
        if (count > 1) {
          expect(timelineLowerBuffTop(actionTop, 0) - timelineLowerBuffTop(actionTop, 1)).toBe(22);
        }
      }
    }
  });
});
