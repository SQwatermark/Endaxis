import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import type { PoiseChangePoint } from './poiseChangePoints';
import { projectPoiseCurve, projectPoiseCurveFromReceipt } from './poiseCurves';

const INITIAL = { poise: 300, maxPoise: 300 };

function change(overrides: Partial<PoiseChangePoint> = {}): PoiseChangePoint {
  return {
    frame: 10,
    time: 1 / 3,
    sequence: 3,
    sourceId: 'perlica',
    targetId: 'enemy',
    calculationValue: 100,
    calculatedDamage: 100,
    requestedDelta: -100,
    actualDelta: -100,
    previousPoise: 300,
    currentPoise: 200,
    cancelled: false,
    cancelledByImmunity: false,
    poiseImmune: false,
    ignorePoiseImmune: false,
    brokePoise: false,
    inPoiseRecovery: false,
    hasPoiseBrokenTag: false,
    ...overrides,
  };
}

describe('projectPoiseCurve', () => {
  it('从初始失衡生成稀疏曲线并保留被拦截的结算事实', () => {
    const changes = [
      change(),
      change({
        frame: 20,
        time: 2 / 3,
        sequence: 4,
        requestedDelta: -300,
        actualDelta: -200,
        previousPoise: 200,
        currentPoise: 0,
        brokePoise: true,
      }),
      change({
        frame: 30,
        time: 1,
        sequence: 5,
        requestedDelta: -50,
        actualDelta: 0,
        previousPoise: 0,
        currentPoise: 0,
        cancelledByImmunity: true,
      }),
    ];
    const curve = projectPoiseCurve(INITIAL, changes);
    expect(curve.resource).toBe('poise');
    expect(curve.maxValue).toBe(300);
    expect(curve.points).toEqual([
      { frame: 0, time: 0, sequence: null, value: 300 },
      { frame: 10, time: 1 / 3, sequence: 3, value: 200 },
      { frame: 20, time: 2 / 3, sequence: 4, value: 0 },
      { frame: 30, time: 1, sequence: 5, value: 0 },
    ]);
  });

  it('拒绝与事实不连续的失衡变化', () => {
    expect(() =>
      projectPoiseCurve(INITIAL, [change({ actualDelta: -120, currentPoise: 200 })]),
    ).toThrow('discontinuous');
  });

  it('把失衡恢复事实与结算交错投影为同一条曲线', () => {
    const entries: CombatReceiptEntry[] = [
      {
        sequence: 3,
        frame: 10,
        time: 1 / 3,
        event: 'PoiseApplied',
        sourceId: 'perlica',
        targetId: 'enemy',
        data: {
          calculationValue: 300,
          calculatedDamage: 300,
          requestedDelta: -300,
          actualDelta: -300,
          previousPoise: 300,
          currentPoise: 0,
          cancelled: false,
          cancelledByImmunity: false,
          poiseImmune: false,
          ignorePoiseImmune: false,
          brokePoise: true,
          inPoiseRecovery: true,
          hasPoiseBrokenTag: true,
        },
      },
      {
        sequence: 4,
        frame: 310,
        time: 31 / 3,
        event: 'PoiseRecovered',
        targetId: 'enemy',
        data: { poise: 300, hasPoiseBrokenTag: false },
      },
      {
        sequence: 5,
        frame: 320,
        time: 32 / 3,
        event: 'PoiseApplied',
        sourceId: 'perlica',
        targetId: 'enemy',
        data: {
          calculationValue: 50,
          calculatedDamage: 50,
          requestedDelta: -50,
          actualDelta: -50,
          previousPoise: 300,
          currentPoise: 250,
          cancelled: false,
          cancelledByImmunity: false,
          poiseImmune: false,
          ignorePoiseImmune: false,
          brokePoise: false,
          inPoiseRecovery: false,
          hasPoiseBrokenTag: false,
        },
      },
    ];

    const curve = projectPoiseCurveFromReceipt(INITIAL, entries);
    expect(curve.points).toEqual([
      { frame: 0, time: 0, sequence: null, value: 300 },
      { frame: 10, time: 1 / 3, sequence: 3, value: 0 },
      { frame: 310, time: 31 / 3, sequence: 4, value: 300 },
      { frame: 320, time: 32 / 3, sequence: 5, value: 250 },
    ]);
  });

  it('拒绝与最大值不一致的失衡恢复事实', () => {
    expect(() =>
      projectPoiseCurveFromReceipt(INITIAL, [
        {
          sequence: 1,
          frame: 30,
          time: 1,
          event: 'PoiseRecovered',
          targetId: 'enemy',
          data: { poise: 250, hasPoiseBrokenTag: false },
        },
      ]),
    ).toThrow('restored to 250, expected 300');
  });
});
