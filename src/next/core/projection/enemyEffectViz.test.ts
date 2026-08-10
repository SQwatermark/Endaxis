import { describe, expect, it } from 'vitest';
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { projectEnemyEffectViz } from './enemyEffectViz';

function infliction(
  sequence: number,
  frame: number,
  element: string,
  layers: number,
): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event: 'ElementalInflictionApplied',
    sourceId: 'perlica',
    targetId: 'enemy',
    data: {
      skillId: 'battleSkill',
      requestedElement: element,
      isExtra: false,
      previousElement: null,
      previousLayers: 0,
      currentElement: element,
      currentLayers: layers,
      outcomeKind: layers > 1 ? 'burst' : 'attachmentOnly',
      operationKinds: layers > 1 ? 'triggerBurst,addAttachment' : 'addAttachment',
    },
  };
}

function buffFinished(sequence: number, frame: number, buffId: string): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event: 'BuffFinished',
    targetId: 'enemy',
    data: { buffId, reason: 'lifetime', layers: 1 },
  };
}

function burst(sequence: number, frame: number): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event: 'SpellBurstApplied',
    sourceId: 'perlica',
    targetId: 'enemy',
    data: {
      burstType: 'Pulse',
      skillScale: 1.5,
      enhanceFactor: 1,
      value: 100,
      actualDamage: 100,
      remainingHealth: 9900,
    },
  };
}

function reaction(sequence: number, frame: number, applied: boolean): CombatReceiptEntry {
  return {
    sequence,
    frame,
    time: frame / 30,
    event: applied ? 'ElementalReactionApplied' : 'ElementalReactionConsumed',
    sourceId: 'perlica',
    targetId: 'enemy',
    data: applied
      ? {
          reaction: 'electrification',
          previousLevel: 0,
          level: 1,
          durationSeconds: 5,
          effectiveness: 1,
        }
      : { reaction: 'electrification', level: 1, consumed: true },
  };
}

describe('projectEnemyEffectViz', () => {
  it('把附着施加与到期整理成元素段', () => {
    const viz = projectEnemyEffectViz(
      [
        infliction(1, 10, 'electric', 1),
        infliction(2, 20, 'electric', 2),
        buffFinished(3, 50, 'buff_common_energy_shard_attached_pulse'),
        infliction(4, 60, 'heat', 1),
      ],
      100,
    );
    expect(viz.segments).toEqual([
      { kind: 'attachment', element: 'electric', startFrame: 20, endFrame: 50, layers: 2 },
      { kind: 'attachment', element: 'heat', startFrame: 60, endFrame: 100, layers: 1 },
    ]);
  });

  it('到期前未收尾的附着段延伸到模拟终点', () => {
    const viz = projectEnemyEffectViz([infliction(1, 5, 'cryo', 1)], 90);
    expect(viz.segments).toEqual([
      { kind: 'attachment', element: 'cryo', startFrame: 5, endFrame: 90, layers: 1 },
    ]);
  });

  it('整理爆发与反应标记', () => {
    const viz = projectEnemyEffectViz(
      [burst(1, 30), reaction(2, 40, true), reaction(3, 80, false)],
      100,
    );
    expect(viz.markers).toEqual([
      { frame: 30, kind: 'burst', burstType: 'Pulse' },
      { frame: 40, kind: 'reactionApplied', reaction: 'electrification', level: 1 },
      { frame: 80, kind: 'reactionConsumed', reaction: 'electrification', level: 1 },
    ]);
  });

  it('非附着 Buff 的结束回执不影响附着段', () => {
    const viz = projectEnemyEffectViz(
      [infliction(1, 10, 'nature', 1), buffFinished(2, 40, 'some_other_buff')],
      100,
    );
    expect(viz.segments).toEqual([
      { kind: 'attachment', element: 'nature', startFrame: 10, endFrame: 100, layers: 1 },
    ]);
  });

  it('拒绝非法结束帧', () => {
    expect(() => projectEnemyEffectViz([], -1)).toThrow('non-negative');
  });
});
