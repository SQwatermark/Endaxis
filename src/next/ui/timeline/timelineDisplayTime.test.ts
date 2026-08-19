import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import {
  projectSkillCastActualStartFrames,
  projectTimelineTimeDilationBands,
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

  it('pairs time-dilation lifecycle receipts and closes active instances at simulation end', () => {
    const entries: CombatReceiptEntry[] = [
      {
        ...receipt(0, 10, 'TimeDilationStarted', {
          instanceId: 1,
          kind: 'global',
          sourceCastId: 'cast:ultimate',
        }),
      },
      {
        ...receipt(1, 12, 'TimeDilationStarted', { instanceId: 2, kind: 'entity' }),
        targetId: 'track:1',
      },
      receipt(2, 20, 'TimeDilationEnded', { instanceId: 1, kind: 'global' }),
    ];
    expect(projectTimelineTimeDilationBands(entries, 30)).toEqual([
      {
        instanceId: 1,
        kind: 'global',
        startFrame: 10,
        endFrame: 20,
        sourceCastId: 'cast:ultimate',
      },
      {
        instanceId: 2,
        kind: 'entity',
        startFrame: 12,
        endFrame: 30,
        targetId: 'track:1',
      },
    ]);
  });

  it('rejects an end receipt without its matching start', () => {
    expect(() =>
      projectTimelineTimeDilationBands(
        [receipt(0, 4, 'TimeDilationEnded', { instanceId: 3, kind: 'global' })],
        10,
      ),
    ).toThrow('ended without a start receipt');
  });
});
