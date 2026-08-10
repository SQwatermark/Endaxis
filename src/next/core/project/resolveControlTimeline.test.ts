import { describe, expect, it } from 'vitest';
import type { TrackDocument, TrackListDocument } from './schema';
import { resolveControlTimeline } from './resolveControlTimeline';

function track(operatorId: string): TrackDocument {
  return {
    operator: {
      id: operatorId,
      operatorSlug: 'perlica',
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: {},
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
}

describe('resolveControlTimeline', () => {
  it('uses track zero initially and resolves switches to operator instance ids', () => {
    const tracks: TrackListDocument = [track('operator:1'), null, track('operator:3'), null];

    expect(
      resolveControlTimeline(tracks, [
        { id: 'switch:later', frame: 60, trackIndex: 2 },
        { id: 'switch:earlier', frame: 30, trackIndex: 0 },
      ]),
    ).toEqual({
      segments: [
        { startFrame: 0, operatorId: 'operator:1' },
        { startFrame: 30, operatorId: 'operator:1' },
        { startFrame: 60, operatorId: 'operator:3' },
      ],
    });
  });

  it('lets a frame-zero switch override the initial track', () => {
    const tracks: TrackListDocument = [track('operator:1'), track('operator:2'), null, null];

    expect(
      resolveControlTimeline(tracks, [{ id: 'switch:zero', frame: 0, trackIndex: 1 }]),
    ).toEqual({ segments: [{ startFrame: 0, operatorId: 'operator:2' }] });
  });

  it('uses the last same-frame switch and represents an empty target track as no controller', () => {
    const tracks: TrackListDocument = [track('operator:1'), track('operator:2'), null, null];

    expect(
      resolveControlTimeline(tracks, [
        { id: 'switch:first', frame: 30, trackIndex: 1 },
        { id: 'switch:last', frame: 30, trackIndex: 2 },
      ]),
    ).toEqual({
      segments: [
        { startFrame: 0, operatorId: 'operator:1' },
        { startFrame: 30, operatorId: null },
      ],
    });
  });
});
