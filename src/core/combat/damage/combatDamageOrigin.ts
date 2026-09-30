/** 将真实宿主身份投影为伤害末端所需输入，不以程序存在与否推断操作能力。 */
import type { CompiledSkillExecutionProgram } from '../../compiler/combatProgram';
import type { CombatDamageExecutorContext } from '../runtime/combatRuntimeAssembly';

interface CombatDamageActor {
  /** 元素动作与技能修正的执行宿主；跨宿主 Buff 可以不同于伤害归属。 */
  readonly operatorId: string;
  readonly sourceOperatorId: string;
}

/** 只有真实技能执行程序才能提供技能身份和专属属性。 */
interface SkillDamageOrigin extends CombatDamageActor {
  readonly kind: 'skill';
  readonly castId?: string;
  readonly skillId: string;
  readonly executingSkillId: string;
  readonly sourceActionId?: never;
  readonly skillType?: CompiledSkillExecutionProgram['skillType'];
  readonly statModifiers?: CompiledSkillExecutionProgram['statModifiers'];
}

/** 常驻/配装动作可以继承来源施法，但不能因此变成正在执行的技能。 */
interface NonSkillDamageOrigin extends CombatDamageActor {
  readonly kind: 'reactive' | 'equipment';
  readonly sourceActionId: string;
  readonly castId?: never;
  readonly skillId?: never;
  readonly executingSkillId?: never;
  readonly skillType?: never;
  readonly statModifiers?: never;
}

export type CombatDamageOrigin = SkillDamageOrigin | NonSkillDamageOrigin;

export function resolveCombatDamageOrigin(
  context: CombatDamageExecutorContext,
): CombatDamageOrigin {
  switch (context.kind) {
    case 'skill':
      return {
        kind: 'skill',
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
        kind: 'reactive',
        operatorId: context.sourceOperatorId,
        sourceOperatorId: context.sourceOperatorId,
        // 常驻动作没有执行技能；其来源身份不能冒充时间轴施放或事件触发技能。
        sourceActionId: context.sourceActionId,
      };
    case 'equipment':
      return {
        kind: 'equipment',
        operatorId: context.operatorId,
        sourceOperatorId: context.operatorId,
        sourceActionId: `equipment:${context.source.kind}:${context.source.slug}:${context.handlerKey}`,
      };
  }
}
