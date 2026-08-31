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
    operatorSkillSlots: [
      {
        operatorId: 'track:1',
        slots: [{ skillSlotKey: 'battleSlot', currentSkillKey: 'battle' }],
      },
    ],
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
    expect(project(22, entries).enemy.poise?.state).toBe('brokenEndWindow');
    expect(project(25, entries).enemy.poise?.state).toBe('normal');
  });

  it('projects active skill, cooldown and combo candidates at the cursor frame', () => {
    const entries = [
      receipt(0, 5, 'SkillStarted', 'track:1', { skillId: 'battle', castId: 'cast:1' }),
      receipt(1, 6, 'SkillCooldownReserved', 'track:1', {
        skillId: 'battle',
        castId: 'cast:1',
      }),
      receipt(2, 7, 'ComboWindowOpened', 'track:1', {
        windowSequence: 0,
        nextSkillKey: 'combo:1',
      }),
      receipt(3, 15, 'SkillEnded', 'track:1', { skillId: 'battle', castId: 'cast:1' }),
      receipt(4, 20, 'ComboWindowExpired', 'track:1', {
        windowSequence: 0,
        nextSkillKey: 'combo:1',
      }),
      receipt(5, 30, 'SkillCooldownReady', 'track:1', { skillId: 'battle' }),
      receipt(6, 35, 'SkillSlotChanged', 'track:1', {
        skillGroupKey: 'battleSlot',
        previousSkillKey: 'battle',
        targetSkillKey: 'enhancedBattle',
      }),
    ];

    const during = project(12, entries).operators[0]!;
    expect(during).toMatchObject({
      activeSkillId: 'battle',
      activeCastId: 'cast:1',
      ultimateEnergy: { current: 55, maximum: 100, ratio: 0.55 },
    });
    expect(during.cooldowns).toHaveLength(1);
    expect(during.comboWindows).toHaveLength(1);

    const after = project(30, entries).operators[0]!;
    expect(after.activeSkillId).toBeNull();
    expect(after.cooldowns).toEqual([]);
    expect(after.comboWindows).toEqual([]);
    expect(after.skillSlots).toEqual([{ skillSlotKey: 'battleSlot', currentSkillKey: 'battle' }]);
    expect(project(35, entries).operators[0]?.skillSlots).toEqual([
      { skillSlotKey: 'battleSlot', currentSkillKey: 'enhancedBattle' },
    ]);
  });

  it('replays native skill-button progress pointers without falling back to older Buffs', () => {
    const progress = (
      sequence: number,
      frame: number,
      event: 'BuffApplied' | 'BuffFinished',
      buffId: string,
      instanceId: number,
      flags: CombatReceiptEntry['data'] = {},
    ): CombatReceiptEntry => ({
      sequence,
      frame,
      time: frame / 30,
      event,
      targetId: 'track:1',
      data: { buffId, instanceId, layers: 1, ...flags },
    });
    const entries = [
      progress(0, 2, 'BuffApplied', 'older', 1, {
        showProgressInNormalSkillButton: true,
      }),
      progress(1, 4, 'BuffApplied', 'newer', 2, {
        showProgressInNormalSkillButton: true,
        useWeakProgressInNormalSkillButton: true,
        showProgressInUltimateSkillButton: true,
      }),
      progress(2, 6, 'BuffFinished', 'older', 1),
      progress(3, 8, 'BuffFinished', 'newer', 2),
    ];

    expect(project(5, entries).operators[0]).toMatchObject({
      battleSkillProgress: { buffId: 'newer', instanceId: 2, weakStyle: true },
      ultimateProgress: { buffId: 'newer', instanceId: 2, weakStyle: true },
    });
    expect(project(7, entries).operators[0]?.battleSkillProgress?.buffId).toBe('newer');
    expect(project(8, entries).operators[0]).toMatchObject({
      battleSkillProgress: null,
      ultimateProgress: null,
    });
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
});
