import { describe, expect, it } from 'vitest';
import {
  projectTimelineTrackEffectLayout,
  resizeTimelineTrackPair,
  resolveCompactTrackHeights,
  TIMELINE_TRACK_MIN_HEIGHT,
} from './timelineTrackEffectLayout';

describe('timeline track effect layout', () => {
  it('fills available height and preserves resized proportions across viewport changes', () => {
    expect(resolveCompactTrackHeights([160, 160, 160, 160], 720)).toEqual([180, 180, 180, 180]);
    expect(resolveCompactTrackHeights([200, 120, 160, 160], 800)).toEqual([250, 150, 200, 200]);
    expect(resolveCompactTrackHeights([160, 160, 160, 160], 723).reduce((a, b) => a + b, 0)).toBe(
      723,
    );
    expect(resolveCompactTrackHeights([160, 160, 160, 160], 100)).toEqual([66, 66, 66, 66]);
    expect(resolveCompactTrackHeights([10000, 1, 1, 1], 400)).toEqual([202, 66, 66, 66]);
  });
  it('grows compact rows and the canvas when effects use many lanes', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'compact',
        upperLaneCount: 5,
        lowerLaneCount: 6,
      }),
    ).toEqual({ height: 330, actionTop: 140 });
  });

  it('treats a compact row-height override as a baseline rather than a clipping boundary', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'compact',
        compactHeight: 210,
        upperLaneCount: 8,
        lowerLaneCount: 9,
      }),
    ).toEqual({ height: 462, actionTop: 206 });
  });

  it('resizes adjacent compact rows without changing their pair total', () => {
    expect(resizeTimelineTrackPair([160, 160, 160, 160], 1, 35)).toEqual([160, 195, 125, 160]);
    expect(resizeTimelineTrackPair([160, 160], 0, 500)).toEqual([
      320 - TIMELINE_TRACK_MIN_HEIGHT,
      TIMELINE_TRACK_MIN_HEIGHT,
    ]);
    const original = [160, 160];
    expect(resizeTimelineTrackPair(original, 1, 20)).toBe(original);
  });

  it('keeps the legacy baseline while both sides fit in two lanes', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'loose',
        upperLaneCount: 2,
        lowerLaneCount: 2,
      }),
    ).toEqual({ height: 160, actionTop: 55 });
  });

  it('uses the larger side as symmetric padding and keeps the action centered', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'loose',
        upperLaneCount: 4,
        lowerLaneCount: 5,
      }),
    ).toEqual({ height: 286, actionTop: 118 });
  });

  it('expands even a manually shortened compact row enough to show one lane on each side', () => {
    expect(
      projectTimelineTrackEffectLayout({
        mode: 'compact',
        compactHeight: TIMELINE_TRACK_MIN_HEIGHT,
        upperLaneCount: 1,
        lowerLaneCount: 1,
      }),
    ).toEqual({ height: 110, actionTop: 30 });
  });
});
