import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { projectTimelineTimeMapping } from './timelineTimeMapping';

describe('projectTimelineTimeMapping', () => {
  it('projects sampled slow time in both directions and resumes identity time', () => {
    const entries: CombatReceiptEntry[] = [
      {
        sequence: 0,
        frame: 1,
        time: 1 / 30,
        event: 'TimelineTimeSampled',
        data: { logicalFrame: 0.5, globalScale: 0.5 },
      },
      {
        sequence: 1,
        frame: 2,
        time: 2 / 30,
        event: 'TimelineTimeSampled',
        data: { logicalFrame: 1, globalScale: 0.5 },
      },
      {
        sequence: 2,
        frame: 3,
        time: 3 / 30,
        event: 'TimelineTimeSampled',
        data: { logicalFrame: 2, globalScale: 1 },
      },
    ];

    const mapping = projectTimelineTimeMapping(entries, 5);

    expect(mapping.points).toEqual([
      { actualFrame: 0, logicalFrame: 0 },
      { actualFrame: 1, logicalFrame: 0.5 },
      { actualFrame: 2, logicalFrame: 1 },
      { actualFrame: 3, logicalFrame: 2 },
      { actualFrame: 5, logicalFrame: 4 },
    ]);
    expect(mapping.logicalFrameAt(1.5)).toBeCloseTo(0.75);
    expect(mapping.actualFrameAt(0.75)).toBeCloseTo(1.5);
    expect(mapping.actualFrameAt(3)).toBeCloseTo(4);
  });

  it('keeps the earliest actual frame for a frozen logical point', () => {
    const mapping = projectTimelineTimeMapping(
      [
        {
          sequence: 0,
          frame: 1,
          time: 1 / 30,
          event: 'TimelineTimeSampled',
          data: { logicalFrame: 0, globalScale: 0 },
        },
        {
          sequence: 1,
          frame: 2,
          time: 2 / 30,
          event: 'TimelineTimeSampled',
          data: { logicalFrame: 0, globalScale: 0 },
        },
        {
          sequence: 2,
          frame: 3,
          time: 3 / 30,
          event: 'TimelineTimeSampled',
          data: { logicalFrame: 1, globalScale: 1 },
        },
      ],
      3,
    );

    expect(mapping.actualFrameAt(0)).toBe(0);
    expect(mapping.logicalFrameAt(2)).toBe(0);
  });
});
