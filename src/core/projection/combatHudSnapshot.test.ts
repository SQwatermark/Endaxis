import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { projectCombatHudSnapshot } from './combatHudSnapshot';

function receipt(
  sequence: number,
  frame: number,
  event: string,
  sourceId?: string,
  data?: CombatReceiptEntry['data'],
): CombatReceiptEntry {
  return { sequence, frame, time: frame / 30, event, sourceId, data };
}

const curves = {
  sp: {
    resource: 'sp' as const,
    maxValue: 300,
    points: [
      { frame: 0, time: 0, sequence: null, value: 100 },
      { frame: 10, time: 1 / 3, sequence: 0, value: 80 },
    ],
  },
  ultimateEnergy: [
    {
      resource: 'ultimateEnergy' as const,
      operatorId: 'track:1',
      maxValue: 100,
      points: [
        { frame: 0, time: 0, sequence: null, value: 20 },
        { frame: 12, time: 0.4, sequence: 1, value: 55 },
      ],
    },
  ],
};

function project(frame: number, entries: readonly CombatReceiptEntry[]) {
  return projectCombatHudSnapshot({
    frame,
    endFrame: 60,
    resourceCurves: curves,
    enemyHealthCurve: {
      resource: 'enemyHealth',
      maxValue: 1000,
      points: [
        { frame: 0, time: 0, sequence: null, value: 1000 },
        { frame: 10, time: 1 / 3, sequence: 2, value: 700 },
      ],
    },
    poiseCurve: {
      resource: 'poise',
      maxValue: 100,
      points: [
        { frame: 0, time: 0, sequence: null, value: 100 },
        { frame: 10, time: 1 / 3, sequence: 3, value: 0 },
        { frame: 20, time: 2 / 3, sequence: 5, value: 100 },
      ],
    },
    receiptEntries: entries,
  });
}

describe('projectCombatHudSnapshot', () => {
  it('samples gauges and preserves the poise recovery/end-window distinction', () => {
    const entries = [
      receipt(0, 10, 'PoiseApplied', undefined, {
        brokePoise: true,
        hasPoiseBrokenTag: true,
      }),
      receipt(1, 20, 'PoiseRecovered', undefined, { hasPoiseBrokenTag: true }),
      receipt(2, 25, 'PoiseBrokenTagEnded', undefined, { hasPoiseBrokenTag: false }),
    ];

    expect(project(15, entries).enemy).toMatchObject({
      health: { current: 700, maximum: 1000, ratio: 0.7 },
      poise: { current: 0, maximum: 100, ratio: 0, state: 'recovering' },
    });
    expect(project(12, entries).operators[0]?.ultimateEnergy).toEqual({
      current: 55,
      maximum: 100,
      ratio: 0.55,
    });
    expect(project(22, entries).enemy.poise?.state).toBe('brokenEndWindow');
    expect(project(25, entries).enemy.poise?.state).toBe('normal');
  });

  it('rejects frames outside the simulated snapshot range', () => {
    expect(() =>
      projectCombatHudSnapshot({
        frame: 61,
        endFrame: 60,
        resourceCurves: curves,
        enemyHealthCurve: { resource: 'enemyHealth', maxValue: 1, points: [] },
        poiseCurve: { resource: 'poise', maxValue: 0, points: [] },
        receiptEntries: [],
      }),
    ).toThrow('endFrame');
  });

  it('samples preparation-time HUD state at a negative frame', () => {
    const snapshot = project(-1, []);

    expect(snapshot.frame).toBe(-1);
    expect(snapshot.sp).toMatchObject({ current: null, maximum: 300 });
  });
});
