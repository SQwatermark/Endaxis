import type { KeywordBuffActionSource } from '../source/keywordActions.ts';
import type { CompiledBuffStepSource } from './combatActionProjectionTypes.ts';
import type { CombatActionProjectionContextSource } from './combatProjectionCommon.ts';
import type { ScalarSource } from '../source/scalar.ts';

/** 空增强名单没有监听/后续 rate 写入；复用普通载体施加，属性仍由原始 BuffData 决定。 */
export function projectKeywordBuffAction(
  action: KeywordBuffActionSource,
  path: string,
  context: CombatActionProjectionContextSource,
): CompiledBuffStepSource {
  // combat-spec keyword-actions.md：这里只开放已有 Buff 环境的原始默认载体路径。
  if (action.enhancements.length)
    throw new Error(`${path}: keyword enhancements require additional projection`);
  if (
    action.overrideChildBuffId &&
    (action.childBuffId.blackboardKey !== null || action.childBuffId.value.trim().length === 0)
  )
    throw new Error(`${path}: dynamic or empty keyword child override is not supported`);
  if (
    context.actionOwnerTarget !== 'buffOwner' ||
    context.actionTargetTarget !== 'buffOwner' ||
    context.actionSourceTarget !== 'caster' ||
    action.source.targetSource !== 'Source' ||
    !['Owner', 'Target'].includes(action.target.targetSource)
  )
    throw new Error(`${path}: unsupported keyword Buff source/target environment`);
  const operand = (scalar: ScalarSource) =>
    scalar.blackboardKey !== null
      ? { kind: 'blackboard' as const, key: scalar.blackboardKey }
      : { kind: 'constant' as const, value: scalar.value };
  return {
    kind: 'applyBuff',
    parameters: {
      buffId: action.carrierBuffId,
      target: 'buffOwner',
      inheritSourceSkillCastInfo: true,
      ...(action.asChildBuff ? { asChildBuff: true } : {}),
      ...(action.autoFinishByAction ? { finishByAction: true } : {}),
      blackboardAssignments: { duration: operand(action.duration), rate: operand(action.rate) },
      ...(action.overrideChildBuffId
        ? { stringBlackboardAssignments: { child_buff_id: action.childBuffId.value } }
        : {}),
    },
  };
}
