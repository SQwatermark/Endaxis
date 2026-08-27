import type { NativeActionNodeSource } from '../source/controlFlow.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { FinishOwnerActionSource } from '../source/lifecycleActions.ts';
import type {
  CombatActionProjectionContextSource,
  CompiledBuffConditionSource,
  CompiledBuffStepSource,
} from './buffRuntimeProjection.ts';

/** 原生 JumpTo 在 Execute/Tick 重试条件；不能投影成只执行一次的普通条件分支。 */
export function projectTimelineJump(
  node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  context: CombatActionProjectionContextSource,
  compileCondition: (
    node: NativeActionNodeSource<KnownNativeActionLeafSource>,
  ) => CompiledBuffConditionSource | null,
): CompiledBuffStepSource | null {
  if (node.body.kind !== 'timelineJump') return null;
  const { destinationFrame, condition } = node.body;
  // avywen-return-lance-lifecycle.md：只开放已有证据的向前跳转，跨目标帧后不得再尝试反向跳转。
  if (
    !context.timelineRange ||
    !Number.isInteger(destinationFrame) ||
    destinationFrame <= context.timelineRange.startFrame ||
    destinationFrame < context.timelineRange.endFrame
  )
    throw new Error(`${node.sourcePath}: timeline jump requires a proven forward timeline range`);
  if (condition.onlyExecuteWhenSourceIsMainCharacter || condition.onlyExecuteWhenSourceIsGuard)
    throw new Error(`${node.sourcePath}: timeline jump condition root filters are unsupported`);
  const conditions = condition.actions
    .filter(item => item.metadata.enabled)
    .map(item => {
      const value = compileCondition(item);
      if (value === null)
        throw new Error(`${item.sourcePath}: timeline jump requires pure conditions`);
      return value;
    });
  return {
    kind: 'jumpTimeline',
    parameters: {
      destinationFrame,
      ...(conditions.length === 0
        ? {}
        : {
            condition:
              conditions.length === 1 ? conditions[0]! : { kind: 'all' as const, conditions },
          }),
    },
  };
}

/** FinishOwner 的 AbilityEntity 死亡分支；释放仍由运行时下一次 advance 处理。 */
export function projectFinishOwner(
  action: FinishOwnerActionSource,
  context: CombatActionProjectionContextSource,
  sourcePath: string,
): CompiledBuffStepSource {
  if (
    context.actionOwnerTarget !== 'currentAbilityEntity' ||
    action.owner.targetSource !== 'Owner' ||
    action.owner.targetGroupKey !== '' ||
    action.owner.finderType !== null ||
    action.owner.validatorTypes.length ||
    action.owner.postProcessorTypes.length
  )
    throw new Error(
      `${sourcePath}: unsupported FinishOwner target; expected current AbilityEntity Owner`,
    );
  // skipDieDisplay 只控制死亡表现；Next 无渲染后端，不能把死亡替换为同步释放。
  return { kind: 'finishCurrentAbilityEntity', parameters: {} };
}
