import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { projectEnemyEffectViz } from './enemyEffectViz';

function receipt(
  sequence: number,
  frame: number,
  event: CombatReceiptEntry['event'],
  data: NonNullable<CombatReceiptEntry['data']>,
): CombatReceiptEntry {
  return { sequence, frame, time: frame / 30, event, targetId: 'enemy', data };
}

describe('projectEnemyEffectViz', () => {
  it('只投影爆发和成功消费等瞬时标记', () => {
    expect(
      projectEnemyEffectViz(
        [
          receipt(0, 20, 'SpellBurstApplied', { burstType: 'Pulse' }),
          receipt(1, 30, 'ElementalReactionApplied', {
            reaction: 'electrification',
            level: 2,
          }),
          receipt(2, 60, 'ElementalReactionConsumed', {
            reaction: 'electrification',
            level: 2,
            consumed: true,
          }),
        ],
        90,
      ),
    ).toEqual({
      markers: [
        { frame: 20, kind: 'burst', burstType: 'Pulse' },
        { frame: 60, kind: 'reactionConsumed', reaction: 'electrification', level: 2 },
      ],
    });
  });

  it('语义施加和附着回执不伪造第二份持续状态', () => {
    expect(
      projectEnemyEffectViz(
        [
          receipt(0, 10, 'ElementalInflictionApplied', {
            requestedElement: 'electric',
            currentLayers: 1,
          }),
          receipt(1, 20, 'ElementalReactionApplied', {
            reaction: 'electrification',
            level: 1,
          }),
        ],
        100,
      ),
    ).not.toHaveProperty('segments');
  });

  it('未成功消费不生成标记', () => {
    expect(
      projectEnemyEffectViz(
        [
          receipt(0, 60, 'ElementalReactionConsumed', {
            reaction: 'electrification',
            level: 0,
            consumed: false,
          }),
        ],
        90,
      ).markers,
    ).toEqual([]);
  });

  it('拒绝非法结束帧', () => {
    expect(() => projectEnemyEffectViz([], -1)).toThrow('non-negative');
  });
});
