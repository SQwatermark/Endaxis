import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import { SkillCastOperationExecutor } from './skillCastOperationExecutor';

describe('SkillCastOperationExecutor', () => {
  it('queues the native skill and preserves inherited cast identity', () => {
    const request = vi.fn();
    const executor = new SkillCastOperationExecutor({
      request,
      delegate: {
        execute: () => false,
        evaluate: () => false,
      },
    });
    const skillCastInfo = {
      skillCastId: 17,
      originSkillId: 'comboSkill',
      originSkillType: 'comboSkill' as const,
      nonReturnedSpCost: 4,
    };
    const step = {
      kind: 'castSkillDuringAction',
      parameters: {
        skillId: 'chr_0035_liino_normal_skill_combo',
        target: 'enemy',
        skipApplyCost: true,
        inheritSourceSkillCastInfo: true,
      },
    } satisfies ResolvedCombatOperationStep;

    expect(executor.execute(step, { blackboard: new ActionBlackboard(), skillCastInfo })).toBe(
      true,
    );
    expect(request).toHaveBeenCalledWith({
      nativeSkillId: 'chr_0035_liino_normal_skill_combo',
      skipApplyCost: true,
      inheritedSkillCastInfo: skillCastInfo,
    });
  });

  it('requires a source cast context only when inheritance is enabled', () => {
    const executor = new SkillCastOperationExecutor({
      request: vi.fn(),
      delegate: { execute: () => false, evaluate: () => false },
    });
    expect(() =>
      executor.execute(
        {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'child',
            target: 'enemy',
            skipApplyCost: false,
            inheritSourceSkillCastInfo: true,
          },
        },
        { blackboard: new ActionBlackboard() },
      ),
    ).toThrow('requires source SkillCastInfo');
  });

  it('accepts a deferred self cast without inventing a separate target payload', () => {
    const request = vi.fn();
    const executor = new SkillCastOperationExecutor({
      request,
      delegate: { execute: () => false, evaluate: () => false },
    });

    expect(
      executor.execute(
        {
          kind: 'castSkillDuringAction',
          parameters: {
            skillId: 'chr_0028_zhuangfangyi_ultimate_skill_end',
            target: 'caster',
            skipApplyCost: true,
            inheritSourceSkillCastInfo: false,
          },
        },
        { blackboard: new ActionBlackboard() },
      ),
    ).toBe(true);
    expect(request).toHaveBeenCalledWith({
      nativeSkillId: 'chr_0028_zhuangfangyi_ultimate_skill_end',
      skipApplyCost: true,
      inheritedSkillCastInfo: undefined,
    });
  });
});
