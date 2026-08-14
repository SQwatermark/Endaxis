import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import { projectTimelineTimeMapping } from '../../core/projection/timelineTimeMapping';
import {
  createTimelineDisplayTime,
  projectSkillCastActualStartFrames,
} from './timelineDisplayTime';

function receipt(
  sequence: number,
  frame: number,
  event: string,
  data?: CombatReceiptEntry['data'],
): CombatReceiptEntry {
  return { sequence, frame, time: frame / 30, event, ...(data === undefined ? {} : { data }) };
}

describe('timeline display time', () => {
  it('keeps logical and actual frames identical without a simulation result', () => {
    const time = createTimelineDisplayTime(900, null);
    expect(time.actualDurationFrames).toBe(900);
    expect(time.toActualFrame(120)).toBe(120);
    expect(time.toLogicalFrame(240)).toBe(240);
  });

  it('uses the simulated mapping and clamps coordinates to the timeline', () => {
    const mapping = projectTimelineTimeMapping(
      [
        receipt(0, 1, 'TimelineTimeSampled', { logicalFrame: 1 }),
        receipt(1, 2, 'TimelineTimeSampled', { logicalFrame: 1 }),
        receipt(2, 3, 'TimelineTimeSampled', { logicalFrame: 2 }),
      ],
      3,
    );
    const time = createTimelineDisplayTime(2, mapping);
    expect(time.actualDurationFrames).toBe(3);
    expect(time.toActualFrame(2)).toBe(3);
    expect(time.toLogicalFrame(2)).toBe(1);
    expect(time.toActualFrame(99)).toBe(3);
  });

  it('takes each cast start from the first matching SkillStarted receipt', () => {
    const starts = projectSkillCastActualStartFrames([
      receipt(0, 12, 'SkillStarted', { castId: 'cast:1' }),
      receipt(1, 14, 'SkillEnded', { castId: 'cast:1' }),
      receipt(2, 20, 'SkillStarted', { castId: 'cast:2' }),
      receipt(3, 21, 'SkillStarted', { castId: 'cast:2' }),
    ]);
    expect([...starts]).toEqual([
      ['cast:1', 12],
      ['cast:2', 20],
    ]);
  });
});
