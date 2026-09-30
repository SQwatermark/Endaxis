/** 将真实宿主身份投影为伤害末端所需输入，不以程序存在与否推断操作能力。 */
import type { CompiledSkillExecutionProgram } from '../../compiler/combatProgram';
import type {
  CombatDamageExecutorContext,
  CombatOperationExecutorContext,
} from '../runtime/combatRuntimeAssembly';

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
  context: CombatOperationExecutorContext,
): CombatDamageOrigin & { readonly skillId: string };
export function resolveCombatDamageOrigin(context: CombatDamageExecutorContext): CombatDamageOrigin;
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
        operatorId: context.legacyDamageProfile.operatorId,
        sourceOperatorId: context.sourceOperatorId,
        // 历史回执/命中键使用事件来源作为技能与施放字段；保留输出但不在宿主上伪造技能程序。
        castId: context.sourceActionId,
        skillId: context.sourceActionId,
        executingSkillId: context.legacyDamageProfile.executionSkillId ?? context.sourceActionId,
        skillType: context.legacyDamageProfile.skillType,
        statModifiers: context.legacyDamageProfile.statModifiers,
      };
    case 'equipment':
      return {
        operatorId: context.operatorId,
        sourceOperatorId: context.operatorId,
        sourceActionId: `equipment:${context.source.kind}:${context.source.slug}:${context.handlerKey}`,
      };
  }
}
