/** 将真实宿主身份投影为伤害末端所需输入，不以程序存在与否推断操作能力。 */
import type { CompiledSkillExecutionProgram } from '../../compiler/combatProgram';
import type { CombatDamageExecutorContext } from '../runtime/combatRuntimeAssembly';

export interface CombatDamageOrigin {
  /** 元素动作与技能修正的执行宿主；跨宿主 Buff 可以不同于伤害归属。 */
  readonly operatorId: string;
  readonly sourceOperatorId: string;
  readonly castId?: string;
  readonly skillId?: string;
  readonly executingSkillId?: string;
  readonly sourceActionId?: string;
  readonly skillType?: CompiledSkillExecutionProgram['skillType'];
  readonly statModifiers?: CompiledSkillExecutionProgram['statModifiers'];
}

export function resolveCombatDamageOrigin(
  context: CombatDamageExecutorContext,
): CombatDamageOrigin {
  switch (context.kind) {
    case 'skill':
      return {
        operatorId: context.program.operatorId,
        sourceOperatorId: context.sourceOperatorId ?? context.program.operatorId,
        castId: context.castId,
        skillId: context.program.skillId,
        executingSkillId: context.program.executionSkillId ?? context.program.skillId,
        skillType: context.program.skillType,
        statModifiers: context.program.statModifiers,
      };
    case 'reactive':
      return {
        operatorId: context.sourceOperatorId,
        sourceOperatorId: context.sourceOperatorId,
        // 常驻动作没有执行技能；其来源身份不能冒充时间轴施放或事件触发技能。
        sourceActionId: context.sourceActionId,
      };
    case 'equipment':
      return {
        operatorId: context.operatorId,
        sourceOperatorId: context.operatorId,
        sourceActionId: `equipment:${context.source.kind}:${context.source.slug}:${context.handlerKey}`,
      };
  }
}
