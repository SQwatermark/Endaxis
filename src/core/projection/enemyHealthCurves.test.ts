import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { projectEnemyHealthCurveFromReceipt } from './enemyHealthCurves';

const INITIAL = { health: 10000, maxHealth: 10000 };

function damage(overrides: Partial<CombatReceiptEntry> = {}): CombatReceiptEntry {
  return {
    frame: 10,
    time: 1 / 3,
    sequence: 3,
    event: 'DamageApplied',
    sourceId: 'perlica',
    targetId: 'enemy',
    data: { actualDamage: 500, remainingHealth: 9500 },
    ...overrides,
  };
}

describe('projectEnemyHealthCurveFromReceipt', () => {
  it('按伤害与治疗事实生成稀疏曲线，排除其他目标和事件', () => {
    const curve = projectEnemyHealthCurveFromReceipt(INITIAL, [
      damage(),
      damage({ sequence: 4, targetId: 'other' }),
      damage({ sequence: 5, event: 'SpChanged' }),
      damage({
        frame: 20,
        time: 2 / 3,
        sequence: 6,
        data: { actualDamage: 300, remainingHealth: 9200 },
      }),
      damage({
        frame: 20,
        time: 2 / 3,
        sequence: 7,
        event: 'HealingApplied',
        data: { actualHealing: 200, currentHealth: 9400 },
      }),
    ]);
    expect(curve).toEqual({
      resource: 'enemyHealth',
      maxValue: 10000,
      points: [
        { frame: 0, time: 0, sequence: null, value: 10000 },
        { frame: 10, time: 1 / 3, sequence: 3, value: 9500 },
        { frame: 20, time: 2 / 3, sequence: 6, value: 9200 },
        { frame: 20, time: 2 / 3, sequence: 7, value: 9400 },
      ],
    });
  });

  it('拒绝不连续或缺少必要事实的回执', () => {
    const project = (entry: CombatReceiptEntry) =>
      projectEnemyHealthCurveFromReceipt(INITIAL, [entry]);
    for (const remainingHealth of [9600, 9300]) {
      expect(() => project(damage({ data: { actualDamage: 500, remainingHealth } }))).toThrow(
        'discontinuous',
      );
    }
    expect(() => project(damage({ sourceId: undefined }))).toThrow('has no sourceId');
    expect(() => project(damage({ data: { remainingHealth: 9500 } }))).toThrow(
      'has no finite actualDamage',
    );
  });
});
