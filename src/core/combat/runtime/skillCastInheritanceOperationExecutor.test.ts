import { describe, expect, it } from 'vitest';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import { ActionBlackboard } from './actionBlackboard';
import type { CombatOperationExecutor } from './skillRuntime';
import {
  BasicAttackSkillCastInheritanceRegistry,
  SkillCastInheritanceOperationExecutor,
} from './skillCastInheritanceOperationExecutor';

const terminal: CombatOperationExecutor = {
  execute: () => true,
  evaluate: () => true,
};

const step = {
  kind: 'inheritSkillCastInfoForBasicAttack',
  parameters: {},
} as const satisfies ResolvedCombatOperationStep;

const firstCast = {
  skillCastId: 7,
  originSkillId: 'floating-mode',
  originSkillType: 'ultimate',
  nonReturnedSpCost: 0,
} as const;

describe('普通攻击施法身份继承槽', () => {
  it('首次注册优先，且只有实际占用槽位的动作能注销', () => {
    const registry = new BasicAttackSkillCastInheritanceRegistry();
    const first = registry.register('typhoeus', firstCast);
    const second = registry.register('typhoeus', { ...firstCast, skillCastId: 8 });

    expect(registry.get('typhoeus')).toBe(firstCast);
    second.dispose();
    expect(registry.get('typhoeus')).toBe(firstCast);
    first.dispose();
    expect(registry.get('typhoeus')).toBeUndefined();
  });

  it('Buff enable 动作在 end 时撤销来源施法身份', () => {
    const registry = new BasicAttackSkillCastInheritanceRegistry();
    const executor = new SkillCastInheritanceOperationExecutor('typhoeus', registry, terminal);
    const context = { blackboard: new ActionBlackboard(), skillCastInfo: firstCast };

    expect(executor.execute(step, context)).toBe(true);
    expect(registry.get('typhoeus')).toBe(firstCast);
    executor.end(step, context);
    expect(registry.get('typhoeus')).toBeUndefined();
  });

  it('缺少 Buff 来源施法身份时严格失败', () => {
    const executor = new SkillCastInheritanceOperationExecutor(
      'typhoeus',
      new BasicAttackSkillCastInheritanceRegistry(),
      terminal,
    );
    expect(() => executor.execute(step, { blackboard: new ActionBlackboard() })).toThrow(
      'requires a source SkillCastInfo',
    );
  });
});
