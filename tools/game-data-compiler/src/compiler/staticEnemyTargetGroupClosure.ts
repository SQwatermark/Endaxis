import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import { collectNativeActionNodes, type NativeSequenceSource } from '../source/controlFlow.ts';
import type { SkillActionGraphSource } from '../source/skillActionGraph.ts';
import type { TargetReferenceSource } from '../source/target.ts';
import {
  isCurrentTargetRestrictedSingleEnemyTargetGroup,
  isStaticSingleEnemyTargetGroup,
  isTyphoeaSelectedSingleEnemyTargetGroup,
} from './combatProjectionCommon.ts';

type TargetGroupWrite = Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>['action'];

function isPlainTargetReference(
  target: TargetReferenceSource | null,
  targetSource: string,
  targetGroupKey: string,
): boolean {
  return (
    target !== null &&
    target.targetSource === targetSource &&
    target.targetGroupKey === targetGroupKey &&
    target.selectorOwner === 'ActionOwner' &&
    target.ownerContextKey === '' &&
    target.centerType === 'ActionSource' &&
    target.centerContextKey === '' &&
    !target.centerToGround &&
    target.target === 'ActionSource' &&
    target.targetContextKey === '' &&
    !target.enableAdvancedDirection &&
    target.selectorDirection === 'SourceForward' &&
    target.finderType === null &&
    target.validatorTypes.length === 0 &&
    target.postProcessorTypes.length === 0 &&
    target.priorityFilters.length === 0 &&
    target.shuffleTargets.length === 0 &&
    target.distanceValidators.length === 0 &&
    target.finderSpawnedObjectType === null &&
    target.validatorTagQueries.length === 0
  );
}

function isStaticSingleEnemyTargetPostProcessor(
  write: TargetGroupWrite,
  staticEnemyTargetGroupKeys: ReadonlySet<string>,
): boolean {
  if (write.producerType !== 'TargetPostProcessorAction') return false;
  const detail = write.targetPostProcessor;
  const filter = write.priorityFilters[0];
  if (detail === undefined || filter === undefined) return false;
  return (
    write.inputTargets.length === 1 &&
    isPlainTargetReference(detail.target, 'Context', detail.target.targetGroupKey) &&
    detail.target.targetGroupKey.length > 0 &&
    staticEnemyTargetGroupKeys.has(detail.target.targetGroupKey) &&
    isPlainTargetReference(detail.center, 'Context', detail.target.targetGroupKey) &&
    isPlainTargetReference(detail.source, 'Source', '') &&
    detail.direction.directionType === 'SourceForward' &&
    isPlainTargetReference(detail.direction.source, 'Target', '') &&
    isPlainTargetReference(detail.direction.target, 'Target', '') &&
    detail.direction.sourceMountPoint === 'None' &&
    detail.direction.targetMountPoint === 'None' &&
    !detail.direction.customSourceAndTarget &&
    detail.direction.clampToXZ &&
    !detail.direction.invertDirection &&
    write.validatorTypes.length === 0 &&
    write.postProcessorTypes.length === 1 &&
    write.postProcessorTypes[0] === 'PriorityFilter' &&
    write.priorityFilters.length === 1 &&
    write.shuffleTargets.length === 0 &&
    write.distanceValidators.length === 0 &&
    filter.filterType === 'DistanceFromMainCharAsc' &&
    !filter.onlyReserveMaxPriorityTargets &&
    filter.limitMaxNum &&
    filter.maxNum === 1 &&
    filter.buffFilter.checkType === 'Id' &&
    filter.buffFilter.buffIds.length === 0 &&
    filter.buffFilter.tagQuery.tagIds.length === 0 &&
    filter.buffFilter.stackCountType === 'BuffCount'
  );
}

function compareKnownNumbers(left: number, comparison: string, right: number): boolean | undefined {
  switch (comparison) {
    case 'EQ':
    case 'Equals':
      return left === right;
    case 'NE':
    case 'NotEquals':
      return left !== right;
    case 'GT':
    case 'GreaterThan':
      return left > right;
    case 'GE':
    case 'GreaterThanOrEqual':
      return left >= right;
    case 'LT':
    case 'LessThan':
      return left < right;
    case 'LE':
    case 'LessThanOrEqual':
      return left <= right;
    default:
      return undefined;
  }
}

/**
 * 只折叠标准木桩模型中可由来源事实直接证明的纯条件序列。未知条件保持 unknown，
 * 让调用方同时遍历两个分支；这里不参与正式运行时条件编译，也不读取技能名或 Context 键名。
 */
function evaluateStaticStumpConditionSequence(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
  staticEnemyTargetGroupKeys: ReadonlySet<string>,
): boolean | undefined {
  if (sequence.onlyExecuteWhenSourceIsMainCharacter || sequence.onlyExecuteWhenSourceIsGuard)
    return undefined;
  const enabled = sequence.actions.filter(node => node.metadata.enabled);
  if (enabled.length === 0) return undefined;
  for (const node of enabled) {
    if (node.body.kind !== 'leaf' || node.body.value.family !== 'condition') return undefined;
    const condition = node.body.value.action;
    if (condition.kind === 'entityCount') {
      if (
        condition.targetSource !== 'Context' ||
        !staticEnemyTargetGroupKeys.has(condition.targetGroupKey) ||
        condition.containsHittableTarget ||
        condition.excludeDeadEntity ||
        condition.storeKey !== ''
      )
        return undefined;
      const result = compareKnownNumbers(1, condition.comparison, condition.minimumCount);
      if (result === undefined) return undefined;
      if (!result) return false;
      continue;
    }
    if (condition.kind === 'distance') {
      const sourceIsMainCharacter = condition.source.targetSource === 'MainCharacter';
      const targetIsMainCharacter = condition.target.targetSource === 'MainCharacter';
      const sourceIsStaticEnemy =
        condition.source.targetSource === 'Context' &&
        staticEnemyTargetGroupKeys.has(condition.source.targetGroupKey);
      const targetIsStaticEnemy =
        condition.target.targetSource === 'Context' &&
        staticEnemyTargetGroupKeys.has(condition.target.targetGroupKey);
      if (
        condition.containsHittableObject ||
        !(
          (sourceIsMainCharacter && targetIsStaticEnemy) ||
          (targetIsMainCharacter && sourceIsStaticEnemy)
        )
      )
        return undefined;
      if (!condition.lessThan || condition.distance < 0) return undefined;
      continue;
    }
    return undefined;
  }
  return true;
}

function collectReachableTargetGroupActions(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
  staticEnemyTargetGroupKeys: ReadonlySet<string>,
): TargetGroupWrite[] {
  const result: TargetGroupWrite[] = [];
  const visit = (current: NativeSequenceSource<KnownNativeActionLeafSource>): void => {
    for (const node of current.actions) {
      if (!node.metadata.enabled) continue;
      const body = node.body;
      if (body.kind === 'leaf') {
        if (body.value.family === 'targetGroup') result.push(body.value.action);
        continue;
      }
      switch (body.kind) {
        case 'ifElse': {
          const value = evaluateStaticStumpConditionSequence(
            body.condition,
            staticEnemyTargetGroupKeys,
          );
          visit(body.condition);
          if (value === true) visit(body.whenTrue);
          else if (value === false) visit(body.whenFalse);
          else {
            visit(body.whenTrue);
            visit(body.whenFalse);
          }
          break;
        }
        case 'switch':
          body.options.forEach(option => visit(option.action));
          break;
        case 'once':
        case 'forEach':
          visit(body.action);
          break;
        case 'channeling':
        case 'tickInterval':
        case 'tickIntervalV2':
          visit(body.actionOnTick);
          break;
        case 'timelineJump':
          visit(body.condition);
          break;
        case 'togglable':
          visit(body.condition);
          visit(body.action);
          break;
        case 'negateNextResult':
          break;
      }
    }
  };
  visit(sequence);
  return result;
}

function isPlainStaticEnemyMerge(
  write: TargetGroupWrite,
  staticEnemyTargetGroupKeys: ReadonlySet<string>,
): boolean {
  if (write.producerType !== 'MergeTargetAction' || write.inputTargets.length === 0) return false;
  let hasProvenEnemyInput = false;
  const preservesEnemyIdentity = write.inputTargets.every(input => {
    const plainInput =
      input.finderType === null &&
      input.validatorTypes.length === 0 &&
      input.postProcessorTypes.length === 0 &&
      input.priorityFilters.length === 0 &&
      input.shuffleTargets.length === 0 &&
      input.distanceValidators.length === 0 &&
      input.finderSpawnedObjectType === null &&
      input.validatorTagQueries.length === 0;
    if (!plainInput) return false;
    if (input.targetSource === 'Target' || input.targetSource === 'MainTarget') {
      hasProvenEnemyInput = true;
      return true;
    }
    if (input.targetSource !== 'Context') return false;
    if (staticEnemyTargetGroupKeys.has(input.targetGroupKey)) {
      hasProvenEnemyInput = true;
      return true;
    }
    return input.targetGroupKey === write.targetGroupKey;
  });
  return preservesEnemyIdentity && hasProvenEnemyInput;
}

/**
 * 从动作图本身和调用方已经证明的 Context 出发，求“始终只含唯一木桩敌人”的闭包。
 * 主动技能、投射物回调及后续实体子技能必须共用这一证明，避免各自维护目标语义子集。
 */
export function discoverStaticEnemyTargetGroupKeys(
  graph: SkillActionGraphSource<KnownNativeActionLeafSource>,
  seedKeys: ReadonlySet<string> = new Set(),
): ReadonlySet<string> {
  const allWrites = graph.actionGroup.timelineActions.flatMap(timeline =>
    collectNativeActionNodes(timeline.sequence)
      .filter(
        (
          node,
        ): node is typeof node & {
          body: {
            kind: 'leaf';
            value: Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>;
          };
        } => node.body.kind === 'leaf' && node.body.value.family === 'targetGroup',
      )
      .map(node => node.body.value.action),
  );
  const result = new Set(seedKeys);
  // Context 键可以在不同时间段被重复写入。只有该键的每一个写入都保持敌人身份时，
  // 才能把它提升为跨整张动作图的静态敌人证明；否则由线性编译状态逐次覆盖。
  for (const [key, writes] of Map.groupBy(allWrites, write => write.targetGroupKey)) {
    if (
      writes.length > 0 &&
      writes.every(
        write =>
          isStaticSingleEnemyTargetGroup(write) ||
          isCurrentTargetRestrictedSingleEnemyTargetGroup(write) ||
          isTyphoeaSelectedSingleEnemyTargetGroup(write),
      )
    ) {
      result.add(key);
    }
  }

  let changed = true;
  while (changed) {
    changed = false;
    const reachableWrites = graph.actionGroup.timelineActions.flatMap(timeline =>
      collectReachableTargetGroupActions(timeline.sequence, result),
    );
    const writesByKey = Map.groupBy(reachableWrites, write => write.targetGroupKey);
    for (const [key, writes] of writesByKey) {
      if (
        !result.has(key) &&
        writes.length > 0 &&
        writes.every(
          write =>
            isStaticSingleEnemyTargetGroup(write) ||
            isCurrentTargetRestrictedSingleEnemyTargetGroup(write) ||
            isTyphoeaSelectedSingleEnemyTargetGroup(write) ||
            isPlainStaticEnemyMerge(write, result) ||
            isStaticSingleEnemyTargetPostProcessor(write, result),
        )
      ) {
        result.add(key);
        changed = true;
      }
    }
  }
  return result;
}
