import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import { SkillCastInheritanceOperationExecutor } from './skillCastInheritanceOperationExecutor';

const step = {
  kind: 'inheritNormalAttackSkillCastInfo',
  parameters: {},
} satisfies ResolvedCombatOperationStep;

describe('SkillCastInheritanceOperationExecutor', () => {
  it('registers the Buff source cast and unregisters the same lifecycle instance on end', () => {
    const finish = vi.fn();
    const register = vi.fn(() => ({ finish }));
    const executor = new SkillCastInheritanceOperationExecutor(register, {
      execute: () => false,
      evaluate: () => false,
    });
    const skillCastInfo = {
      skillCastId: 23,
      originSkillId: 'typhoeus-ultimate',
      originSkillType: 'ultimate' as const,
      originCastId: 'cast-ultimate',
      nonReturnedSpCost: 100,
    };
    const context = {
      blackboard: new ActionBlackboard(),
      buffOwnerId: 'typhoeus',
      skillCastInfo,
    };

    expect(executor.execute(step, context)).toBe(true);
    expect(register).toHaveBeenCalledWith('typhoeus', skillCastInfo);
    executor.end(step, context);
    expect(finish).toHaveBeenCalledTimes(1);
  });

  it('rejects use outside a sourced Buff lifecycle', () => {
    const executor = new SkillCastInheritanceOperationExecutor(vi.fn(), {
      execute: () => false,
      evaluate: () => false,
    });
    expect(() => executor.execute(step, { blackboard: new ActionBlackboard() })).toThrow(
      'requires a Buff owner and source SkillCastInfo',
    );
  });
});
