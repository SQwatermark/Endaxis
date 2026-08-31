import type { ScheduledSequenceDefinition } from '../../../../packages/game-data-contract/src/actions.ts';
import type { SkillDefinition } from '../../../../packages/game-data-contract/src/skills.ts';
import { NATIVE_SKILL_HAS_HIT_BLACKBOARD_KEY } from '../../../../packages/game-data-contract/src/conditions.ts';
import { numericDeclaredBlackboard } from '../source/blackboard.ts';
import type { SkillPatchSource } from '../source/skillPatch.ts';
import { parseKnownSkillActionGraphSource } from '../source/skillActionGraph.ts';
import { collectNativeActionNodes, type NativeSequenceSource } from '../source/controlFlow.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { TargetReferenceSource } from '../source/target.ts';
import {
  compileCombatActionSequenceSource,
  collectCombatInvisiblePresentationAssignmentKeys,
} from './buffRuntimeProjection.ts';
import type {
  CombatActionProjectionContextSource,
  CombatActionProjectionExtensionsSource,
} from './combatProjectionCommon.ts';
import {
  isDynamicSingleEnemySmartTargetGroup,
  isDynamicSingleEnemyTagTargetGroup,
  isStaticSingleEnemyTargetGroup,
  isCurrentTargetRestrictedSingleEnemyTargetGroup,
} from './combatProjectionCommon.ts';
import type { CompiledBuffSequenceSource } from './combatActionProjectionTypes.ts';
import {
  prepareSkillDefinitionInputSource,
  assertNoUnprojectedSkillRootEffects,
  compileStrictSwitchToBuffCastSource,
} from './skillDefinitionInput.ts';
import {
  collectPresentationOnlyBlackboardKeys,
  collectPresentationOnlyTargetGroups,
  collectUnconsumedTargetGroups,
  collectCombatInvisibleRandomBlackboardKeys,
  isPresentationOnlyActionSequence,
} from './skillPresentationTargets.ts';
import { parseSkillTargetSelectionHeaderSource } from '../source/skillTargetSelection.ts';
import { compileSkillSmartTargetSource } from './comboSmartTarget.ts';
import { assertPresentationCalculationIsolation } from './presentationCalculationIsolation.ts';

/** 正式调度输出子集；原生时间轴结束帧必填，动作仍限于已支持的公共投影。 */
export type CompiledActiveSkillTimelineSequenceSource = Readonly<
  Required<Pick<ScheduledSequenceDefinition, 'startFrame' | 'endFrame'>>
> & {
  readonly sequence: CompiledBuffSequenceSource;
};

/**
 * 主动技能与实体子技能共用的装配结果：黑板是实例初值，不再充当静态求值环境。
 * 原生时长与技能块宽度仍分别保留；技能等级的具体取值由最终消费者选择。
 */
export interface CompiledActiveSkillRuntimeProjectionSource {
  readonly skillId: string;
  readonly durationFrame: number;
  readonly timelineBlockFrames: number;
  readonly exclusiveFrame: number;
  /**
   * 原生输入窗口的编译期证据。它只供最终技能组装配选择“下一段”窗口，
   * 不属于 Endaxis 运行时技能契约，也不能直接按最早帧压成技能块宽度。
   */
  readonly allowNextSkillTransitions: readonly {
    readonly startFrame: number;
    readonly skillIds: readonly string[];
    readonly direct: boolean;
  }[];
  readonly inputWindows?: SkillDefinition['inputWindows'];
  readonly blackboard: NonNullable<SkillDefinition['blackboard']>;
  readonly scheduledSequences: readonly CompiledActiveSkillTimelineSequenceSource[];
  readonly smartTarget?: 'enemy' | 'input' | 'trigger';
  readonly switchToBuffCast?: {
    readonly currentSkillTypes?: readonly import('../../../../packages/game-data-contract/src/primitives.ts').SkillType[];
    readonly requiresCurrentSkillNotInterruptible?: boolean;
    readonly condition?: import('./combatActionProjectionTypes.ts').CompiledBuffConditionSource;
    readonly asSkillCast: boolean;
    readonly sequence: CompiledBuffSequenceSource;
  };
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
      // combat-spec 已确认 lessThan=true 的原生语义是 <=。纳入非负目标半径只会让
      // MainCharacter 到唯一木桩的有效距离更小；因此这里只证明 <= 非负阈值的真值。
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
): Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>['action'][] {
  const result: Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>['action'][] = [];
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
  write: Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>['action'],
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
    // MergeTargetAction 是目标集合并集。把结果组本身重新并入只会保留先前成员；
    // 但仍要求同一写入至少含一个独立证明的敌人输入，不能用纯自引用凭空建立身份。
    return input.targetGroupKey === write.targetGroupKey;
  });
  return preservesEnemyIdentity && hasProvenEnemyInput;
}

function isAtMostSingleEnemyMerge(
  write: Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>['action'],
  singleEnemyTargetGroupKeys: ReadonlySet<string>,
): boolean {
  if (write.producerType !== 'MergeTargetAction' || write.inputTargets.length === 0) return false;
  return write.inputTargets.every(input => {
    const noFilters =
      input.validatorTypes.length === 0 &&
      input.postProcessorTypes.length === 0 &&
      input.priorityFilters.length === 0 &&
      input.shuffleTargets.length === 0 &&
      input.distanceValidators.length === 0 &&
      input.finderSpawnedObjectType === null &&
      input.validatorTagQueries.length === 0;
    const plainInput = noFilters && input.finderType === null;
    const instantMainTarget =
      noFilters &&
      input.targetSource === 'InstantSearch' &&
      input.finderType === 'MainTargetFinder';
    return (
      instantMainTarget ||
      (plainInput &&
        (input.targetSource === 'Target' ||
          input.targetSource === 'MainTarget' ||
          (input.targetSource === 'Context' &&
            (input.targetGroupKey === write.targetGroupKey ||
              singleEnemyTargetGroupKeys.has(input.targetGroupKey)))))
    );
  });
}

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

function enabledActions<T>(sequence: NativeSequenceSource<T>) {
  return sequence.actions.filter(action => action.metadata.enabled);
}

function floatCompareBlackboardAgainstOne(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
): string | undefined {
  const actions = enabledActions(sequence);
  if (
    actions.length !== 1 ||
    actions[0]!.body.kind !== 'leaf' ||
    actions[0]!.body.value.family !== 'condition' ||
    actions[0]!.body.value.action.kind !== 'floatCompare'
  )
    return undefined;
  const condition = actions[0]!.body.value.action;
  if (condition.comparison !== 'EQ' && condition.comparison !== 'Equals') return undefined;
  if (
    condition.left.blackboardKey !== null &&
    condition.right.blackboardKey === null &&
    condition.right.value === 1
  )
    return condition.left.blackboardKey;
  if (
    condition.right.blackboardKey !== null &&
    condition.left.blackboardKey === null &&
    condition.left.value === 1
  )
    return condition.right.blackboardKey;
  return undefined;
}

function sequenceReadsFloatBlackboard(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
  keys: ReadonlySet<string>,
): boolean {
  return collectNativeActionNodes(sequence).some(node => {
    if (
      !node.metadata.enabled ||
      node.body.kind !== 'leaf' ||
      node.body.value.family !== 'condition' ||
      node.body.value.action.kind !== 'floatCompare'
    )
      return false;
    const { left, right } = node.body.value.action;
    return (
      (left.blackboardKey !== null && keys.has(left.blackboardKey)) ||
      (right.blackboardKey !== null && keys.has(right.blackboardKey))
    );
  });
}

/**
 * ShowComboRingQte 与 AbilityEntity QTE 是同一输入机制的旧/新表现实现。Endaxis 已从
 * ShowComboRingQte 的 Buff 闭包合成输入窗口后，应执行共用的技能成功/失败逻辑，而不是
 * 再受原型选择黑板限制。这里只解包“单一 EQ 1 守卫、空 false 分支、true 分支读取已证明
 * QTE 触发键”的完整形状；其他黑板条件原样保留。
 */
function unwrapSyntheticComboQtePrototypeGuard(
  sequence: NativeSequenceSource<KnownNativeActionLeafSource>,
  triggerKeys: ReadonlySet<string> | undefined,
): NativeSequenceSource<KnownNativeActionLeafSource> {
  if (triggerKeys === undefined || triggerKeys.size === 0) return sequence;
  const actions = enabledActions(sequence);
  if (actions.length >= 2) {
    const firstOnly = { ...sequence, actions: [actions[0]!] };
    const selectorKey = floatCompareBlackboardAgainstOne(firstOnly);
    const remainder = {
      ...sequence,
      actions: sequence.actions.filter(action => action !== actions[0]),
    };
    if (
      selectorKey !== undefined &&
      !triggerKeys.has(selectorKey) &&
      sequenceReadsFloatBlackboard(remainder, triggerKeys)
    )
      return remainder;
  }
  if (actions.length !== 1 || actions[0]!.body.kind !== 'ifElse') return sequence;
  const guard = actions[0]!.body;
  const selectorKey = floatCompareBlackboardAgainstOne(guard.condition);
  if (
    selectorKey === undefined ||
    triggerKeys.has(selectorKey) ||
    enabledActions(guard.whenFalse).length !== 0 ||
    !sequenceReadsFloatBlackboard(guard.whenTrue, triggerKeys)
  )
    return sequence;
  return guard.whenTrue;
}

/**
 * TargetPostProcessorAction 先复制输入候选，再执行筛选。此处只接纳汤汤实证的距离升序取 1：
 * 唯一木桩输入经空 validator、空 Buff 过滤和最多保留一个后，成员身份及非空性均不变。
 */
function isStaticSingleEnemyTargetPostProcessor(
  write: Extract<KnownNativeActionLeafSource, { family: 'targetGroup' }>['action'],
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

/**
 * 主动 SkillData 的严格执行阶段。引用闭包阶段允许保留未跟踪动作；进入正式时间轴时必须让
 * 每个叶子通过公共 parser/projection，且不得把被动事件静默混入施法时间轴。
 */
export function compileActiveSkillRuntimeProjectionSource(input: {
  readonly value: unknown;
  readonly sourcePath: string;
  readonly patch: SkillPatchSource | null;
  readonly context: CombatActionProjectionContextSource;
  readonly visualOnlyIds?: ReadonlySet<string>;
  readonly extensions?: CombatActionProjectionExtensionsSource;
}): CompiledActiveSkillRuntimeProjectionSource {
  const prepared = prepareSkillDefinitionInputSource(input.value, input.sourcePath, input.patch);
  const targeting = compileSkillSmartTargetSource(
    parseSkillTargetSelectionHeaderSource(input.value, input.sourcePath),
  );
  const switchToBuffCast = compileStrictSwitchToBuffCastSource(
    input.value,
    input.sourcePath,
    input.context,
  );
  assertNoUnprojectedSkillRootEffects(input.value, input.sourcePath);
  const graph = parseKnownSkillActionGraphSource(
    input.value,
    input.sourcePath,
    prepared.blackboard.values,
  );
  if (graph.actionGroup.passiveEvents.length > 0)
    throw new Error(
      `${input.sourcePath}.actionGroupData.passiveEventActions: active skill passive events are unsupported`,
    );
  const visualOnlyIds = input.visualOnlyIds ?? new Set<string>();
  const extensions = input.extensions ?? {};
  const presentationOnlyBlackboardKeys = collectPresentationOnlyBlackboardKeys(graph);
  const combatInvisiblePresentationBlackboardKeys =
    collectCombatInvisiblePresentationAssignmentKeys(
      graph.actionGroup.timelineActions.map(timeline => timeline.sequence),
    );
  const combatInvisibleRandomBlackboardKeys = collectCombatInvisibleRandomBlackboardKeys(graph);
  const targetGroupWrites = graph.actionGroup.timelineActions.flatMap(timeline =>
    collectNativeActionNodes(timeline.sequence).flatMap(node =>
      node.body.kind === 'leaf' && node.body.value.family === 'targetGroup'
        ? [node.body.value.action]
        : [],
    ),
  );
  const writesByKey = Map.groupBy(targetGroupWrites, write => write.targetGroupKey);
  const dynamicSpatialPointCounts = new Map<
    string,
    | { readonly kind: 'constant'; readonly value: number }
    | { readonly kind: 'blackboard'; readonly key: string }
  >();
  for (const [key, writes] of writesByKey) {
    const randomPointWrites = writes.filter(write => write.finderType === 'RandomPointFinder');
    if (randomPointWrites.length === 0) continue;
    if (
      randomPointWrites.length !== writes.length ||
      randomPointWrites.some(write => write.finderRandomPointCount === undefined)
    ) {
      throw new Error(`Context ${JSON.stringify(key)} mixes RandomPoint and incompatible writes`);
    }
    const operands = randomPointWrites.map(write => {
      const count = write.finderRandomPointCount!;
      return count.blackboardKey === null
        ? { kind: 'constant' as const, value: count.value }
        : { kind: 'blackboard' as const, key: count.blackboardKey };
    });
    if (operands.some(operand => JSON.stringify(operand) !== JSON.stringify(operands[0]))) {
      const runtimeCountKey = `__endaxis_target_group_count:${key}`;
      if (Object.hasOwn(prepared.blackboard.values, runtimeCountKey)) {
        throw new Error(`Context ${JSON.stringify(key)} count key collides with Skill blackboard`);
      }
      dynamicSpatialPointCounts.set(key, { kind: 'blackboard', key: runtimeCountKey });
    } else {
      dynamicSpatialPointCounts.set(key, operands[0]!);
    }
  }
  const allActionNodes = graph.actionGroup.timelineActions.flatMap(timeline =>
    collectNativeActionNodes(timeline.sequence),
  );
  const rayCastTargetGroupWrites = allActionNodes.flatMap(node =>
    node.metadata.enabled &&
    node.body.kind === 'leaf' &&
    node.body.value.family === 'rayCastTargetGroup'
      ? [node.body.value.action]
      : [],
  );
  const usesNativeSkillHasHit = allActionNodes.some(
    node =>
      node.metadata.enabled &&
      node.body.kind === 'leaf' &&
      node.body.value.family === 'condition' &&
      node.body.value.action.kind === 'skillHasHit',
  );
  const enabledAnimationEventListenerPresent = allActionNodes.some(
    node =>
      node.metadata.enabled &&
      node.body.kind === 'leaf' &&
      node.body.value.family === 'animationEventListener' &&
      !isPresentationOnlyActionSequence(
        node.body.value.action.actionOnEvent,
        presentationOnlyBlackboardKeys,
      ),
  );
  if (
    usesNativeSkillHasHit &&
    (Object.hasOwn(prepared.blackboard.values, NATIVE_SKILL_HAS_HIT_BLACKBOARD_KEY) ||
      Object.hasOwn(
        numericDeclaredBlackboard(graph.declaredBlackboard, true),
        NATIVE_SKILL_HAS_HIT_BLACKBOARD_KEY,
      ))
  ) {
    throw new Error(
      `${input.sourcePath}: internal CheckSkillHasHit key collides with the Skill blackboard`,
    );
  }
  const abilityEntityContextKeys = new Set(
    allActionNodes.flatMap(node =>
      node.metadata.enabled &&
      node.body.kind === 'leaf' &&
      node.body.value.family === 'abilityEntity' &&
      node.body.value.action.saveToContext
        ? [node.body.value.action.contextKey]
        : [],
    ),
  );
  const ownerSpawnedAbilityEntityContextKeys = new Set(
    [...writesByKey]
      .filter(
        ([, writes]) =>
          writes.length > 0 &&
          writes.every(
            write =>
              write.producerType === 'FindTargetAction' &&
              write.finderType === 'OwnerSpawnedEntityFinder' &&
              write.finderSpawnedObjectType === 'AbilityEntity',
          ),
      )
      .map(([key]) => key),
  );
  // Context 在技能的所有调度段之间共享。只把“至少由一次能力实体生成写入，且没有任何
  // 目标组/空间动作写入同名键”的集合标成能力实体；OwnerSpawnedEntityFinder
  // 写入也保留同一成员类型。条件生成/查询可以令集合为空，但不会改变成员类型。
  const conflictingContextKeys = new Set([
    ...targetGroupWrites
      .filter(write => !ownerSpawnedAbilityEntityContextKeys.has(write.targetGroupKey))
      .map(write => write.targetGroupKey),
    ...allActionNodes.flatMap(node =>
      node.metadata.enabled &&
      node.body.kind === 'leaf' &&
      node.body.value.family === 'spatial' &&
      node.body.value.action.kind === 'teleportPositionSelection'
        ? [node.body.value.action.outputContextKey]
        : [],
    ),
    ...rayCastTargetGroupWrites.flatMap(write => [write.targetGroupKey, write.hitPosGroupKey]),
  ]);
  const staticAbilityEntityTargetGroupKeys = new Set(
    [...abilityEntityContextKeys, ...ownerSpawnedAbilityEntityContextKeys].filter(
      key => !conflictingContextKeys.has(key),
    ),
  );
  // 保留已支持的直接搜索证明；传播阶段只负责增加跨 Context 的合并不变量。
  const isStaticActiveSkillEnemyTargetGroup = (write: (typeof targetGroupWrites)[number]) =>
    isStaticSingleEnemyTargetGroup(write) || isCurrentTargetRestrictedSingleEnemyTargetGroup(write);
  const staticEnemyTargetGroupKeys = new Set(
    targetGroupWrites
      .filter(isStaticActiveSkillEnemyTargetGroup)
      .map(write => write.targetGroupKey),
  );
  rayCastTargetGroupWrites.forEach(write => staticEnemyTargetGroupKeys.add(write.targetGroupKey));
  // StoreSmartTarget writes the selected candidate to this implicit native context group. 对 input/trigger
  // 路径，prepareComboCast 会在施法前严格拒绝非敌方候选；无候选手工排轴则回退唯一木桩。
  // 因而所有已支持的 smartTarget 模式在技能运行入口之后都具有同一 enemy 不变量。
  if (targeting.definition.smartTarget !== undefined)
    staticEnemyTargetGroupKeys.add('smart_target');
  // 控制流中的不可达写入不能破坏 Context 身份证明。以已知入口目标组为种子反复归约：
  // 只有所有“在当前证据下可达”的写入都保持唯一敌人时才新增键；未知分支仍全部计入。
  let enemyClosureChanged = true;
  while (enemyClosureChanged) {
    enemyClosureChanged = false;
    const reachableWrites = graph.actionGroup.timelineActions.flatMap(timeline =>
      collectReachableTargetGroupActions(timeline.sequence, staticEnemyTargetGroupKeys),
    );
    const reachableWritesByKey = Map.groupBy(reachableWrites, write => write.targetGroupKey);
    for (const [key, writes] of reachableWritesByKey) {
      if (
        !staticEnemyTargetGroupKeys.has(key) &&
        writes.length > 0 &&
        writes.every(
          write =>
            isStaticActiveSkillEnemyTargetGroup(write) ||
            isPlainStaticEnemyMerge(write, staticEnemyTargetGroupKeys) ||
            isStaticSingleEnemyTargetPostProcessor(write, staticEnemyTargetGroupKeys),
        )
      ) {
        staticEnemyTargetGroupKeys.add(key);
        enemyClosureChanged = true;
      }
    }
  }
  // 与“恒为敌人”分开记录至多一个敌人的集合。TagValidator 会让集合动态为空，
  // 但不会改变成员身份；这足以保留 ForEach 的零次/一次语义，不能用于折叠数量条件。
  const singleEnemyTargetGroupKeys = new Set(staticEnemyTargetGroupKeys);
  let singleEnemyClosureChanged = true;
  while (singleEnemyClosureChanged) {
    singleEnemyClosureChanged = false;
    for (const [key, writes] of writesByKey) {
      if (singleEnemyTargetGroupKeys.has(key)) continue;
      if (
        writes.length > 0 &&
        writes.every(
          write =>
            isStaticActiveSkillEnemyTargetGroup(write) ||
            isDynamicSingleEnemyTagTargetGroup(write) ||
            isDynamicSingleEnemySmartTargetGroup(write) ||
            isAtMostSingleEnemyMerge(write, singleEnemyTargetGroupKeys),
        )
      ) {
        singleEnemyTargetGroupKeys.add(key);
        singleEnemyClosureChanged = true;
      }
    }
  }
  // Context 目标组跨时间段保留。固定敌人和 FixedPoint 在 Endaxis 中都位于零空间，
  // 但这个集合只证明“可作零空间锚点”，不能反过来冒充敌人实体。
  const staticZeroSpaceTargetGroupKeys = new Set(staticEnemyTargetGroupKeys);
  rayCastTargetGroupWrites.forEach(write =>
    staticZeroSpaceTargetGroupKeys.add(write.hitPosGroupKey),
  );
  for (const write of targetGroupWrites) {
    if (
      write.producerType === 'FindTargetAction' &&
      write.finderType === 'FixedPointFinder' &&
      write.validatorTypes.length === 0 &&
      write.postProcessorTypes.length === 0
    )
      staticZeroSpaceTargetGroupKeys.add(write.targetGroupKey);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const [key, writes] of writesByKey) {
      if (staticZeroSpaceTargetGroupKeys.has(key)) continue;
      if (
        writes.length > 0 &&
        writes.every(
          write =>
            isStaticActiveSkillEnemyTargetGroup(write) ||
            (write.producerType === 'FindTargetAction' &&
              write.finderType === 'FixedPointFinder' &&
              write.validatorTypes.length === 0 &&
              write.postProcessorTypes.length === 0) ||
            (write.producerType === 'MergeTargetAction' &&
              write.inputTargets.length > 0 &&
              write.inputTargets.every(input => {
                const plainInput =
                  input.finderType === null &&
                  input.validatorTypes.length === 0 &&
                  input.postProcessorTypes.length === 0 &&
                  input.priorityFilters.length === 0 &&
                  input.shuffleTargets.length === 0 &&
                  input.distanceValidators.length === 0 &&
                  input.finderSpawnedObjectType === null &&
                  input.validatorTagQueries.length === 0;
                return (
                  plainInput &&
                  ((input.targetSource === 'Context' &&
                    staticZeroSpaceTargetGroupKeys.has(input.targetGroupKey)) ||
                    input.targetSource === 'Target' ||
                    input.targetSource === 'MainTarget')
                );
              })),
        )
      ) {
        staticZeroSpaceTargetGroupKeys.add(key);
        changed = true;
      }
    }
  }
  const exclusiveFrame = Number(prepared.root.exclusiveFrame);
  if (!Number.isInteger(exclusiveFrame) || exclusiveFrame < 0)
    throw new Error(`${input.sourcePath}.exclusiveFrame: expected non-negative integer`);
  const allowNextSkillTransitions = graph.actionGroup.timelineActions.flatMap(timeline => {
    const directNodes = new Set(timeline.sequence.actions);
    return collectNativeActionNodes(timeline.sequence).flatMap(node => {
      if (
        !node.metadata.enabled ||
        node.body.kind !== 'leaf' ||
        node.body.value.family !== 'inputControl' ||
        node.body.value.action.kind !== 'allowNextSkill'
      )
        return [];
      return [
        {
          startFrame: timeline.startFrame,
          skillIds: node.body.value.action.skillIds,
          direct: directNodes.has(node),
        },
      ];
    });
  });
  const commandMappings: Array<
    NonNullable<NonNullable<SkillDefinition['inputWindows']>['commandMappings']>[number]
  > = [];
  const allowedNextSkills: Array<
    NonNullable<NonNullable<SkillDefinition['inputWindows']>['allowedNextSkills']>[number]
  > = [];
  let hasConditionalInputActions = false;
  for (const timeline of graph.actionGroup.timelineActions) {
    const directNodes = new Set(timeline.sequence.actions);
    for (const node of collectNativeActionNodes(timeline.sequence)) {
      if (
        !node.metadata.enabled ||
        node.body.kind !== 'leaf' ||
        node.body.value.family !== 'inputControl'
      ) {
        continue;
      }
      const action = node.body.value.action;
      if (action.kind !== 'comboCache' && action.kind !== 'allowNextSkill') continue;
      if (!directNodes.has(node)) {
        hasConditionalInputActions = true;
        continue;
      }
      if (action.kind === 'allowNextSkill') {
        allowedNextSkills.push({
          startFrame: timeline.startFrame,
          endFrame: timeline.endFrame,
          sourceSkillIds: action.skillIds,
        });
        continue;
      }
      for (const mapping of action.mappings) {
        // RefreshNextSkillRequest 只让 Attack 映射的 skillId 决定实际技能。
        // NormalSkill/ComboSkill 映射仅供缓存配置，随后会被当前槽位 ID 覆盖；
        // UltimateSkill 则直接以当前终结技构造请求。
        if (mapping.commandType !== 'Attack') continue;
        commandMappings.push({
          startFrame: timeline.startFrame,
          endFrame: timeline.endFrame,
          input: 'basicAttack',
          targetSourceSkillId: mapping.skillId.length === 0 ? null : mapping.skillId,
        });
      }
    }
  }
  const inputWindows: SkillDefinition['inputWindows'] | undefined =
    commandMappings.length === 0 && allowedNextSkills.length === 0 && !hasConditionalInputActions
      ? undefined
      : {
          ...(commandMappings.length === 0 ? {} : { commandMappings }),
          ...(allowedNextSkills.length === 0 ? {} : { allowedNextSkills }),
          ...(hasConditionalInputActions ? { hasConditionalActions: true } : {}),
        };
  const context = {
    ...input.context,
    staticEnemyTargetGroupKeys,
    singleEnemyTargetGroupKeys,
    staticZeroSpaceTargetGroupKeys,
    dynamicSpatialPointCounts,
    staticAbilityEntityTargetGroupKeys,
    presentationOnlyTargetGroupKeys: collectPresentationOnlyTargetGroups(graph),
    unconsumedTargetGroupKeys: collectUnconsumedTargetGroups(graph),
    combatInvisibleRandomBlackboardKeys,
    combatInvisiblePresentationBlackboardKeys,
    enabledAnimationEventListenerPresent,
  };
  const scheduledSequences: CompiledActiveSkillTimelineSequenceSource[] = [];
  for (const timeline of graph.actionGroup.timelineActions) {
    // SequenceAction.checkCharacter proves these flags are complementary tests
    // of the source character's current main/guard state. A user-placed active
    // skill is cast by the selected main character in the Endaxis scenario.
    if (timeline.sequence.onlyExecuteWhenSourceIsGuard) continue;
    const activeMainCharacterSequence = timeline.sequence.onlyExecuteWhenSourceIsMainCharacter
      ? { ...timeline.sequence, onlyExecuteWhenSourceIsMainCharacter: false }
      : timeline.sequence;
    const executableSequence = unwrapSyntheticComboQtePrototypeGuard(
      activeMainCharacterSequence,
      input.context.syntheticComboQteTriggerBlackboardKeys,
    );
    if (isPresentationOnlyActionSequence(executableSequence, presentationOnlyBlackboardKeys))
      continue;
    const enabledTopLevel = executableSequence.actions.filter(action => action.metadata.enabled);
    const standaloneProjectile =
      enabledTopLevel.length === 1 &&
      enabledTopLevel[0]!.body.kind === 'leaf' &&
      enabledTopLevel[0]!.body.value.family === 'projectile';
    const relativeProjectileCallbacks: CompiledActiveSkillTimelineSequenceSource[] = [];
    const sequence = compileCombatActionSequenceSource(
      executableSequence,
      {
        ...context,
        timelineRange: { startFrame: timeline.startFrame, endFrame: timeline.endFrame },
        ...(standaloneProjectile
          ? {
              scheduleRelativeProjectileCallback: scheduled => {
                relativeProjectileCallbacks.push({
                  startFrame: timeline.startFrame + scheduled.startFrame,
                  endFrame: timeline.startFrame + scheduled.endFrame,
                  sequence: scheduled.sequence,
                });
              },
            }
          : {}),
      },
      visualOnlyIds,
      { ...extensions, allowRootTimelineFinish: true },
    );
    if (sequence.steps.length > 0) {
      scheduledSequences.push({
        startFrame: timeline.startFrame,
        endFrame: timeline.endFrame,
        sequence,
      });
    }
    scheduledSequences.push(...relativeProjectileCallbacks);
  }
  assertPresentationCalculationIsolation(
    graph.actionGroup.timelineActions.map(item => item.sequence),
    scheduledSequences.map(item => item.sequence),
  );
  return {
    skillId: graph.skillId,
    durationFrame: graph.durationFrame,
    // 单技能定义尚不知道自己位于哪个技能组。这里保留旧的独立技能默认值；
    // 多段基础攻击会在整名装配时按明确的下一段 skillId 重新选择窗口。
    timelineBlockFrames: Math.min(
      exclusiveFrame + 1,
      ...allowNextSkillTransitions.map(item => item.startFrame),
    ),
    exclusiveFrame,
    allowNextSkillTransitions,
    ...(inputWindows === undefined ? {} : { inputWindows }),
    // combat-spec skill-blackboard：动态声明也进入实例初值；补丁同名键后覆盖。
    // 此处位于动作投影输出边界，不能回灌到上面的静态解析环境消除动态引用。
    blackboard: {
      ...numericDeclaredBlackboard(graph.declaredBlackboard, true),
      ...prepared.blackboard.values,
      ...(usesNativeSkillHasHit ? { [NATIVE_SKILL_HAS_HIT_BLACKBOARD_KEY]: 0 } : {}),
    },
    ...targeting.definition,
    ...(switchToBuffCast === undefined ? {} : { switchToBuffCast }),
    scheduledSequences,
  };
}
