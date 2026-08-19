import { describe, expect, it } from 'vitest';
import { resolveTimelineCastMoveFrame } from './timelineCastMoveGeometry';

describe('timeline cast move geometry', () => {
  it('writes the pointer actual frame directly to the skill placement', () => {
    const frame = resolveTimelineCastMoveFrame({
      pointerActualFrame: 18,
      pointerOffsetActualFrames: 2,
      snapFrames: 1,
      actualMaximumFrame: 30,
    });

    expect(frame).toEqual({ actualFrame: 16, placementFrame: 16 });
  });

  it('snaps and clamps in the actual-time domain', () => {
    expect(
      resolveTimelineCastMoveFrame({
        pointerActualFrame: 44,
        pointerOffsetActualFrames: 3,
        snapFrames: 5,
        actualMaximumFrame: 30,
      }),
    ).toEqual({ actualFrame: 30, placementFrame: 30 });
  });
});
