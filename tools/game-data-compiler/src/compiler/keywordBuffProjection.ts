import type { KeywordBuffActionSource } from '../source/keywordActions.ts';
import type { CompiledBuffStepSource } from './combatActionProjectionTypes.ts';
import type { CombatActionProjectionContextSource } from './combatProjectionCommon.ts';
import type { ScalarSource } from '../source/scalar.ts';

/** 关键词载体复用普通 Buff；增强规则只安装到本次动作创建的载体实例。 */
export function projectKeywordBuffAction(
  action: KeywordBuffActionSource,
  path: string,
  context: CombatActionProjectionContextSource,
): CompiledBuffStepSource {
  // combat-spec keyword-actions.md：增强在普通 Buff 成功加入边沿按列表顺序持久改写 rate。
  if (
    action.overrideChildBuffId &&
    (action.childBuffId.blackboardKey !== null || action.childBuffId.value.trim().length === 0)
  )
    throw new Error(`${path}: dynamic or empty keyword child override is not supported`);
  if (
    context.actionOwnerTarget !== 'buffOwner' ||
    context.actionTargetTarget !== 'buffOwner' ||
    context.actionSourceTarget !== 'caster' ||
    !(
      action.source.targetSource === 'Source' ||
      (action.source.targetSource === 'Owner' && context.fixedBuffOwnerTarget === 'caster')
    ) ||
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
      ...(action.enhancements.length === 0
        ? {}
        : {
            keywordEnhancements: action.enhancements.map(enhancement => ({
              triggerBuffIds: enhancement.buffIds,
              operation: enhancement.operation.toLowerCase() as 'assign' | 'add' | 'multiply',
              value: operand(enhancement.value),
            })),
          }),
      ...(action.overrideChildBuffId
        ? { stringBlackboardAssignments: { child_buff_id: action.childBuffId.value } }
        : {}),
    },
  };
}
