import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import { SkillCooldownOperationExecutor } from './skillCooldownOperationExecutor';

const delegate = {
  execute: vi.fn(() => true),
  evaluate: vi.fn(() => true),
};

function cooldownStep(
  operation: 'reduce' | 'set',
  basis: 'baseDurationRatio' | 'absoluteSeconds',
  value: number,
): ResolvedCombatOperationStep {
  return {
    kind: 'adjustSkillCooldown',
    parameters: {
      target: 'caster',
      skill: { kind: 'id', skillId: 'skill.target' },
      operation,
      basis,
      value: { kind: 'constant', value },
    },
  } as ResolvedCombatOperationStep;
}

describe('SkillCooldownOperationExecutor', () => {
  it('dispatches native reduce and set bases with seconds converted to combat frames', () => {
    const reduce = vi.fn(() => 1);
    const reduceFrames = vi.fn(() => 1);
    const setRatio = vi.fn(() => 1);
    const setFrames = vi.fn(() => 1);
    const executor = new SkillCooldownOperationExecutor({
      reduceByBaseDurationRatio: reduce,
      reduceByAbsoluteFrames: reduceFrames,
      setByBaseDurationRatio: setRatio,
      setByAbsoluteFrames: setFrames,
      delegate,
    });
    const context = { blackboard: new Map() } as never;

    executor.execute(cooldownStep('reduce', 'baseDurationRatio', 0.5), context);
    executor.execute(cooldownStep('reduce', 'absoluteSeconds', 2), context);
    executor.execute(cooldownStep('set', 'baseDurationRatio', 1), context);
    executor.execute(cooldownStep('set', 'absoluteSeconds', 2), context);

    expect(reduce).toHaveBeenCalledWith({ kind: 'id', skillId: 'skill.target' }, 0.5);
    expect(reduceFrames).toHaveBeenCalledWith({ kind: 'id', skillId: 'skill.target' }, 60);
    expect(setRatio).toHaveBeenCalledWith({ kind: 'id', skillId: 'skill.target' }, 1);
    expect(setFrames).toHaveBeenCalledWith({ kind: 'id', skillId: 'skill.target' }, 60);
  });
});
