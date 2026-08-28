import {
  nativeActionName,
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import {
  parseSelectorSummarySource,
  parseSpawnedEntitySelectorIdentitySource,
  parseTargetReferenceSource,
  type ShapeFinderSource,
  type TargetReferenceSource,
} from './target.ts';
import type { TagQuerySource } from './tagQuery.ts';
import type {
  DistanceValidatorSource,
  PriorityFilterSource,
  ShuffleTargetSource,
} from './selectorComponents.ts';
import {
  distanceValidatorsPassAtZero,
  parseCharacterTeamSelection,
  type CharacterTeamSelectionSource,
  parseCircularOrderSource,
  priorityFilterMaxTargets,
  selectorExcludesPlainCurrentTarget,
  selectorExcludesPlainOwner,
  smartTargetFallsBackToMainTarget,
} from './selectorFacts.ts';

export interface TargetGroupInputSource {
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly finderType: string | null;
  readonly finderFactionTarget: string | null;
  readonly finderTargetObjectType: string | null;
  readonly finderCheckAlive: boolean | null;
  readonly finderShape: ShapeFinderSource | null;
  readonly finderOwnerPartsQuery: TagQuerySource | null;
  readonly validatorTypes: readonly string[];
  readonly postProcessorTypes: readonly string[];
  readonly priorityFilters: readonly PriorityFilterSource[];
  readonly shuffleTargets: readonly ShuffleTargetSource[];
  readonly distanceValidators: readonly DistanceValidatorSource[];
  readonly finderSpawnedObjectType: string | null;
  readonly validatorTagQueries: ReadonlyArray<readonly [string, readonly number[]]>;
}

export interface TargetGroupWriteSource {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionIndex: number;
  readonly actionPath: readonly string[];
  readonly sourcePath: string;
  readonly targetGroupKey: string;
  readonly producerType:
    | 'FindTargetAction'
    | 'ContinuousFindTargetAction'
    | 'MergeTargetAction'
    | 'PickTargetAction'
    | 'ConvertToTargetContext';
  readonly finderType: string | null;
  readonly finderFactionTarget: string | null;
  readonly finderTargetObjectType: string | null;
  readonly finderCheckAlive: boolean | null;
  readonly finderShape: ShapeFinderSource | null;
  readonly finderOwnerPartsQuery: TagQuerySource | null;
  readonly validatorTypes: readonly string[];
  readonly postProcessorTypes: readonly string[];
  readonly inputTargets: readonly TargetGroupInputSource[];
  readonly intervalSeconds: number | null;
  readonly finderSpawnedObjectType: string | null;
  readonly validatorTagQueries: ReadonlyArray<readonly [string, readonly number[]]>;
  readonly finderFixedPointSnapToNavmesh: boolean | null;
  readonly center: string | null;
  readonly centerContextKey: string;
  readonly selectorOwner: string | null;
  readonly selectorOwnerContextKey: string;
  /** 方向计算的目标引用也属于读取依赖，不能因零空间投影而在来源层丢失。 */
  readonly directionTarget: string | null;
  readonly directionContextKey: string;
  readonly characterTeamSelection: CharacterTeamSelectionSource | null;
  readonly excludesCurrentTarget: boolean;
  readonly excludesOwner: boolean;
  readonly smartTargetFallsBackToMainTarget: boolean;
  readonly distanceValidatorsPassAtZero: boolean;
  readonly priorityFilterMaxTargets: number | null;
  /** 完整 PriorityFilter 载荷；maxTargets 只是旧场景投影所需的派生快捷值。 */
  readonly priorityFilters: readonly PriorityFilterSource[];
  readonly shuffleTargets: readonly ShuffleTargetSource[];
  readonly distanceValidators: readonly DistanceValidatorSource[];
  readonly circularOrderIndexKey: string | null;
  readonly circularOrderDesiredCount: number | null;
  readonly circularOrderReverseFlag: number | null;
  readonly circularOrderHeightOffset: number | null;
  readonly circularOrderRangeThreshold: number | null;
  readonly circularOrderRangeCheckTarget: TargetReferenceSource | null;
  readonly pickIndexValue: number | null;
  readonly pickIndexBlackboardKey: string | null;
  readonly saveCountToBlackboardKey: string | null;
  /** ConvertToTargetContext 的原生操作；当前仅闭环不会改写目标的 None 分支。 */
  readonly conversionOperation?: 'None' | 'ConvertEntityToPosition';
  /** None 分支不消费这些字段，但来源 IR 仍完整保留，避免把原生事实吞掉。 */
  readonly conversionTransform?: TargetContextTransformSource;
}

export interface SerializedBlackboardNumberSource {
  readonly useBlackboardKey: boolean;
  readonly value: number;
  readonly blackboardKey: string;
}

export interface TargetContextTransformSource {
  readonly translateOperation: string;
  readonly translationRef: string;
  readonly translationDegrees: number;
  readonly excludeTarget: string;
  readonly vector: {
    readonly x: SerializedBlackboardNumberSource;
    readonly y: SerializedBlackboardNumberSource;
    readonly z: SerializedBlackboardNumberSource;
  };
}

/** 不含时间轴位置和相邻动作关联的纯原生目标组动作事实。 */
export type TargetGroupActionSource = Omit<
  TargetGroupWriteSource,
  | 'startFrame'
  | 'endFrame'
  | 'actionIndex'
  | 'actionPath'
  | 'sourcePath'
  | 'saveCountToBlackboardKey'
>;

export interface TargetGroupScheduleContext {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly actionPath: readonly string[];
}

const MERGE_FIELDS = new Set([
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
  'targetGroupKey',
  'targets',
]);
const PICK_FIELDS = new Set([
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
  'target',
  'index',
  'contextKey',
]);
const FIND_FIELDS = new Set([
  '$type',
  'advancedSelectorDirection',
  'center',
  'centerContextKey',
  'centerMountPoint',
  'centerToGround',
  'contextKey',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'selectorData',
  'selectorDirection',
  'selectorOwner',
  'selectorOwnerContextKey',
  'serverActionIndex',
  'target',
  'targetGroupKey',
  'useAdvancedDirectionSetting',
  'useCenterEntityMountPoint',
]);
const CONVERT_FIELDS = new Set([
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
  'convertFrom',
  'targetGroupKey',
  'operationType',
  'translateOperation',
  'translationRef',
  'translationDeg',
  'excludeTarget',
  'blackboardVector3',
]);

/**
 * 解析单个目标组写入动作。树遍历和“该写入是否能证明唯一敌人”等场景判断由后续阶段处理。
 */
export function parseTargetGroupWriteAction(
  value: unknown,
  path: string,
  schedule: TargetGroupScheduleContext,
): TargetGroupWriteSource | null {
  const action = requireRecord(value, path);
  if (typeof action.$type !== 'string') return null;
  const producerType = nativeActionName(action.$type);
  if (
    producerType !== 'FindTargetAction' &&
    producerType !== 'ContinuousFindTargetAction' &&
    producerType !== 'MergeTargetAction' &&
    producerType !== 'PickTargetAction' &&
    producerType !== 'ConvertToTargetContext'
  ) {
    return null;
  }
  if (!requireBoolean(action.isEnable, `${path}.isEnable`)) return null;
  const source = parseTargetGroupActionSource(action, path);
  if (!source) return null;
  return {
    startFrame: schedule.startFrame,
    endFrame: schedule.endFrame,
    actionIndex: requireNonNegativeInteger(action.serverActionIndex, `${path}.serverActionIndex`),
    actionPath: schedule.actionPath,
    sourcePath: path,
    ...source,
    saveCountToBlackboardKey: null,
  };
}

/** 读取目标组动作本身；禁用状态由外层 Action 元数据保存，不会使来源事实消失。 */
export function parseTargetGroupActionSource(
  value: unknown,
  path: string,
): TargetGroupActionSource | null {
  const action = requireRecord(value, path);
  if (typeof action.$type !== 'string') return null;
  const producerType = nativeActionName(action.$type);
  if (
    producerType !== 'FindTargetAction' &&
    producerType !== 'ContinuousFindTargetAction' &&
    producerType !== 'MergeTargetAction' &&
    producerType !== 'PickTargetAction' &&
    producerType !== 'ConvertToTargetContext'
  ) {
    return null;
  }
  requireBoolean(action.isEnable, `${path}.isEnable`);
  if (producerType === 'FindTargetAction' || producerType === 'ContinuousFindTargetAction') {
    return parseFindTargetAction(action, path, producerType);
  }
  if (producerType === 'MergeTargetAction') {
    return parseMergeTargetAction(action, path);
  }
  if (producerType === 'PickTargetAction') {
    return parsePickTargetAction(action, path);
  }
  if (producerType === 'ConvertToTargetContext') {
    return parseConvertToTargetContextAction(action, path);
  }
  return null;
}

function parseConvertToTargetContextAction(
  action: Record<string, unknown>,
  path: string,
): TargetGroupActionSource {
  requireExactFields(action, CONVERT_FIELDS, path);
  const operation = requireNonEmptyString(action.operationType, `${path}.operationType`);
  if (operation !== 'None' && operation !== 'ConvertEntityToPosition')
    throw new Error(`${path}.operationType: unsupported operation ${JSON.stringify(operation)}`);
  const translateOperation = requireNonEmptyString(
    action.translateOperation,
    `${path}.translateOperation`,
  );
  if (!['Rotate180DegAroundRef', 'RotateAroundRefCW'].includes(translateOperation))
    throw new Error(
      `${path}.translateOperation: unsupported operation ${JSON.stringify(translateOperation)}`,
    );
  const translationRef = requireNonEmptyString(action.translationRef, `${path}.translationRef`);
  const excludeTarget = requireNonEmptyString(action.excludeTarget, `${path}.excludeTarget`);
  for (const [key, value] of [
    ['translationRef', translationRef],
    ['excludeTarget', excludeTarget],
  ] as const) {
    if (
      !['ActionSource', 'ActionOwner', 'InputTarget', 'CurrentTarget', 'ContextTarget'].includes(
        value,
      )
    )
      throw new Error(`${path}.${key}: unsupported target ${JSON.stringify(value)}`);
  }

  const sourcePath = `${path}.convertFrom`;
  const source = parseTargetReferenceSource(action.convertFrom, sourcePath);
  const sourceRecord = requireRecord(action.convertFrom, sourcePath);
  const summary = parseSelectorSummarySource(
    sourceRecord.selectorData,
    `${sourcePath}.selectorData`,
    source.targetSource === 'InstantSearch',
  );
  const input: TargetGroupInputSource = {
    targetSource: source.targetSource,
    targetGroupKey: source.targetGroupKey,
    finderType: summary.finderType,
    finderFactionTarget: summary.finderFactionTarget,
    finderTargetObjectType: summary.finderTargetObjectType,
    finderCheckAlive: summary.finderCheckAlive,
    finderShape: summary.finderShape,
    finderOwnerPartsQuery: summary.finderOwnerPartsQuery,
    validatorTypes: summary.validatorTypes,
    postProcessorTypes: summary.postProcessorTypes,
    priorityFilters: summary.priorityFilters,
    shuffleTargets: summary.shuffleTargets,
    distanceValidators: summary.distanceValidators,
    finderSpawnedObjectType: source.finderSpawnedObjectType,
    validatorTagQueries: source.validatorTagQueries,
  };
  const vector = requireRecord(action.blackboardVector3, `${path}.blackboardVector3`);
  requireExactFields(vector, new Set(['x', 'y', 'z']), `${path}.blackboardVector3`);
  const parseComponent = (key: 'x' | 'y' | 'z'): SerializedBlackboardNumberSource => {
    const componentPath = `${path}.blackboardVector3.${key}`;
    const component = requireRecord(vector[key], componentPath);
    requireExactFields(
      component,
      new Set(['useBlackboardKey', 'value', 'blackboardKey']),
      componentPath,
    );
    return {
      useBlackboardKey: requireBoolean(
        component.useBlackboardKey,
        `${componentPath}.useBlackboardKey`,
      ),
      value: requireNumber(component.value, `${componentPath}.value`),
      blackboardKey: requireString(component.blackboardKey, `${componentPath}.blackboardKey`),
    };
  };
  return {
    ...createBaseAction(
      'ConvertToTargetContext',
      requireNonEmptyString(action.targetGroupKey, `${path}.targetGroupKey`),
      [input],
    ),
    finderType: summary.finderType,
    finderFactionTarget: summary.finderFactionTarget,
    finderTargetObjectType: summary.finderTargetObjectType,
    finderCheckAlive: summary.finderCheckAlive,
    finderShape: summary.finderShape,
    finderOwnerPartsQuery: summary.finderOwnerPartsQuery,
    validatorTypes: summary.validatorTypes,
    postProcessorTypes: summary.postProcessorTypes,
    priorityFilters: summary.priorityFilters,
    shuffleTargets: summary.shuffleTargets,
    distanceValidators: summary.distanceValidators,
    finderSpawnedObjectType: source.finderSpawnedObjectType,
    validatorTagQueries: source.validatorTagQueries,
    conversionOperation: operation,
    conversionTransform: {
      translateOperation,
      translationRef,
      translationDegrees: requireNumber(action.translationDeg, `${path}.translationDeg`),
      excludeTarget,
      vector: { x: parseComponent('x'), y: parseComponent('y'), z: parseComponent('z') },
    },
  };
}

function parseFindTargetAction(
  action: Record<string, unknown>,
  path: string,
  producerType: 'FindTargetAction' | 'ContinuousFindTargetAction',
): TargetGroupActionSource {
  const expectedFields = new Set(FIND_FIELDS);
  if (producerType === 'ContinuousFindTargetAction') expectedFields.add('findInterval');
  requireExactFields(action, expectedFields, path);

  const selectorPath = `${path}.selectorData`;
  const selector = requireRecord(action.selectorData, selectorPath);
  const summary = parseSelectorSummarySource(selector, selectorPath, true);
  const identity = parseSpawnedEntitySelectorIdentitySource(selector, selectorPath);
  const circularOrder = parseCircularOrderSource(selector, selectorPath);

  let intervalSeconds: number | null = null;
  if (producerType === 'ContinuousFindTargetAction') {
    intervalSeconds = requireNumber(action.findInterval, `${path}.findInterval`);
    if (intervalSeconds <= 0) throw new Error(`${path}.findInterval: expected positive number`);
  }

  let finderFixedPointSnapToNavmesh: boolean | null = null;
  if (summary.finderType === 'FixedPointFinder') {
    const finder = requireRecord(selector.finderData, `${selectorPath}.finderData`);
    finderFixedPointSnapToNavmesh = requireBoolean(
      finder.snapToNavmesh,
      `${selectorPath}.finderData.snapToNavmesh`,
    );
  }

  return {
    ...createBaseAction(
      producerType,
      requireNonEmptyString(action.targetGroupKey, `${path}.targetGroupKey`),
      [],
    ),
    finderType: summary.finderType,
    finderFactionTarget: summary.finderFactionTarget,
    finderTargetObjectType: summary.finderTargetObjectType,
    finderCheckAlive: summary.finderCheckAlive,
    finderShape: summary.finderShape,
    finderOwnerPartsQuery: summary.finderOwnerPartsQuery,
    validatorTypes: summary.validatorTypes,
    postProcessorTypes: summary.postProcessorTypes,
    intervalSeconds,
    finderSpawnedObjectType: identity.spawnedObjectType,
    validatorTagQueries: identity.tagQueries,
    finderFixedPointSnapToNavmesh,
    center: requireString(action.center, `${path}.center`),
    centerContextKey: requireString(action.centerContextKey, `${path}.centerContextKey`),
    selectorOwner: requireString(action.selectorOwner, `${path}.selectorOwner`),
    selectorOwnerContextKey: requireString(
      action.selectorOwnerContextKey,
      `${path}.selectorOwnerContextKey`,
    ),
    directionTarget: requireString(action.target, `${path}.target`),
    directionContextKey: requireString(action.contextKey, `${path}.contextKey`),
    characterTeamSelection: parseCharacterTeamSelection(selector, selectorPath),
    excludesCurrentTarget: selectorExcludesPlainCurrentTarget(selector, selectorPath),
    excludesOwner: selectorExcludesPlainOwner(selector, selectorPath),
    smartTargetFallsBackToMainTarget: smartTargetFallsBackToMainTarget(selector, selectorPath),
    distanceValidatorsPassAtZero: distanceValidatorsPassAtZero(selector, selectorPath),
    priorityFilterMaxTargets: priorityFilterMaxTargets(selector, selectorPath),
    priorityFilters: summary.priorityFilters,
    shuffleTargets: summary.shuffleTargets,
    distanceValidators: summary.distanceValidators,
    circularOrderIndexKey: circularOrder?.indexKey ?? null,
    circularOrderDesiredCount: circularOrder?.desiredCount ?? null,
    circularOrderReverseFlag: circularOrder?.reverseFlag ?? null,
    circularOrderHeightOffset: circularOrder?.heightOffset ?? null,
    circularOrderRangeThreshold: circularOrder?.rangeThreshold ?? null,
    circularOrderRangeCheckTarget: circularOrder?.rangeCheckTarget ?? null,
  };
}

function parseMergeTargetAction(
  action: Record<string, unknown>,
  path: string,
): TargetGroupActionSource {
  requireExactFields(action, MERGE_FIELDS, path);
  const targetGroupKey = requireNonEmptyString(action.targetGroupKey, `${path}.targetGroupKey`);
  const inputTargets = requireArray(action.targets, `${path}.targets`).map((rawTarget, index) => {
    const targetPath = `${path}.targets[${index}]`;
    const target = parseTargetReferenceSource(rawTarget, targetPath);
    const targetRecord = requireRecord(rawTarget, targetPath);
    const summary = parseSelectorSummarySource(
      targetRecord.selectorData,
      `${targetPath}.selectorData`,
      target.targetSource === 'InstantSearch',
    );
    return {
      targetSource: target.targetSource,
      targetGroupKey: target.targetGroupKey,
      finderType: summary.finderType,
      finderFactionTarget: summary.finderFactionTarget,
      finderTargetObjectType: summary.finderTargetObjectType,
      finderCheckAlive: summary.finderCheckAlive,
      finderShape: summary.finderShape,
      finderOwnerPartsQuery: summary.finderOwnerPartsQuery,
      validatorTypes: summary.validatorTypes,
      postProcessorTypes: summary.postProcessorTypes,
      priorityFilters: summary.priorityFilters,
      shuffleTargets: summary.shuffleTargets,
      distanceValidators: summary.distanceValidators,
      finderSpawnedObjectType: target.finderSpawnedObjectType,
      validatorTagQueries: target.validatorTagQueries,
    } satisfies TargetGroupInputSource;
  });
  return createBaseAction('MergeTargetAction', targetGroupKey, inputTargets);
}

function parsePickTargetAction(
  action: Record<string, unknown>,
  path: string,
): TargetGroupActionSource {
  requireExactFields(action, PICK_FIELDS, path);
  const target = parseTargetReferenceSource(action.target, `${path}.target`);
  const index = requireRecord(action.index, `${path}.index`);
  requireExactFields(
    index,
    new Set(['useBlackboardKey', 'value', 'blackboardKey']),
    `${path}.index`,
  );
  const useKey = requireBoolean(index.useBlackboardKey, `${path}.index.useBlackboardKey`);
  const indexKey = requireString(index.blackboardKey, `${path}.index.blackboardKey`);
  if (useKey && !indexKey) throw new Error(`${path}.index.blackboardKey: invalid key`);
  const input: TargetGroupInputSource = {
    targetSource: target.targetSource,
    targetGroupKey: target.targetGroupKey,
    finderType: target.finderType,
    finderFactionTarget: null,
    finderTargetObjectType: null,
    finderCheckAlive: null,
    finderShape: target.finderShape,
    finderOwnerPartsQuery: target.finderOwnerPartsQuery,
    validatorTypes: target.validatorTypes,
    postProcessorTypes: target.postProcessorTypes,
    priorityFilters: target.priorityFilters,
    shuffleTargets: target.shuffleTargets,
    distanceValidators: target.distanceValidators,
    finderSpawnedObjectType: null,
    validatorTagQueries: [],
  };
  return {
    ...createBaseAction(
      'PickTargetAction',
      requireNonEmptyString(action.contextKey, `${path}.contextKey`),
      [input],
    ),
    pickIndexValue: requireNumber(index.value, `${path}.index.value`),
    pickIndexBlackboardKey: useKey ? indexKey : null,
  };
}

function createBaseAction(
  producerType: TargetGroupWriteSource['producerType'],
  targetGroupKey: string,
  inputTargets: readonly TargetGroupInputSource[],
): TargetGroupActionSource {
  return {
    targetGroupKey,
    producerType,
    finderType: null,
    finderFactionTarget: null,
    finderTargetObjectType: null,
    finderCheckAlive: null,
    finderShape: null,
    finderOwnerPartsQuery: null,
    validatorTypes: [],
    postProcessorTypes: [],
    inputTargets,
    intervalSeconds: null,
    finderSpawnedObjectType: null,
    validatorTagQueries: [],
    finderFixedPointSnapToNavmesh: null,
    center: null,
    centerContextKey: '',
    selectorOwner: null,
    selectorOwnerContextKey: '',
    characterTeamSelection: null,
    excludesCurrentTarget: false,
    excludesOwner: false,
    smartTargetFallsBackToMainTarget: false,
    distanceValidatorsPassAtZero: false,
    priorityFilterMaxTargets: null,
    priorityFilters: [],
    shuffleTargets: [],
    distanceValidators: [],
    circularOrderIndexKey: null,
    circularOrderDesiredCount: null,
    circularOrderReverseFlag: null,
    circularOrderHeightOffset: null,
    circularOrderRangeThreshold: null,
    circularOrderRangeCheckTarget: null,
    directionTarget: null,
    directionContextKey: '',
    pickIndexValue: null,
    pickIndexBlackboardKey: null,
  };
}

/**
 * 遍历 SkillData 时间轴并收集目标组写入。这里只建立控制流路径和同层计数写回关联，
 * 不判断目标组在单敌人场景中最终包含什么。
 */
export function collectTargetGroupWrites(
  rootValue: unknown,
  sourceName: string,
): TargetGroupWriteSource[] {
  const root = requireRecord(rootValue, sourceName);
  const group = requireRecord(root.actionGroupData, `${sourceName}.actionGroupData`);
  const result: TargetGroupWriteSource[] = [];

  function visit(
    value: unknown,
    startFrame: number,
    endFrame: number,
    actionPath: readonly string[],
  ): void {
    if (Array.isArray(value)) {
      value.forEach((child, index) => {
        const childPath = [...actionPath, `[${index}]`];
        visit(child, startFrame, endFrame, childPath);
        associateStoredTargetCount(child, startFrame, endFrame, actionPath, childPath);
      });
      return;
    }
    if (typeof value !== 'object' || value === null) return;
    const action = value as Record<string, unknown>;
    if (action.isEnable === false) return;

    const sourcePath = formatTargetGroupActionSourcePath(sourceName, actionPath);
    const write = parseTargetGroupWriteAction(action, sourcePath, {
      startFrame,
      endFrame,
      actionPath,
    });
    if (write) result.push(write);
    Object.entries(action).forEach(([key, child]) => {
      visit(child, startFrame, endFrame, [...actionPath, key]);
    });
  }

  function associateStoredTargetCount(
    value: unknown,
    startFrame: number,
    endFrame: number,
    parentPath: readonly string[],
    childPath: readonly string[],
  ): void {
    if (typeof value !== 'object' || value === null) return;
    const action = value as Record<string, unknown>;
    if (action.isEnable === false || typeof action.$type !== 'string') return;
    if (nativeActionName(action.$type) !== 'CheckEntityNum') return;
    if (typeof action.storeKey !== 'string' || !action.storeKey) return;
    if (typeof action.checkTarget !== 'object' || action.checkTarget === null) return;
    const target = action.checkTarget as Record<string, unknown>;
    if (
      target.targetSource !== 'Context' ||
      typeof target.targetGroupKey !== 'string' ||
      !target.targetGroupKey
    ) {
      return;
    }
    const checkIndex = requireNonNegativeInteger(
      action.serverActionIndex,
      `${formatTargetGroupActionSourcePath(sourceName, childPath)}.serverActionIndex`,
    );
    let candidateIndex = -1;
    result.forEach((write, index) => {
      if (
        write.startFrame === startFrame &&
        write.endFrame === endFrame &&
        write.targetGroupKey === target.targetGroupKey &&
        write.actionIndex < checkIndex &&
        samePath(write.actionPath.slice(0, -1), parentPath) &&
        (candidateIndex < 0 || write.actionIndex > result[candidateIndex]!.actionIndex)
      ) {
        candidateIndex = index;
      }
    });
    if (candidateIndex >= 0) {
      result[candidateIndex] = {
        ...result[candidateIndex]!,
        saveCountToBlackboardKey: action.storeKey,
      };
    }
  }

  requireArray(group.timelineActions, `${sourceName}.actionGroupData.timelineActions`).forEach(
    (rawTimeline, index) => {
      const path = `${sourceName}.timelineActions[${index}]`;
      const timeline = requireRecord(rawTimeline, path);
      visit(
        timeline._sequenceActionData,
        requireNonNegativeInteger(timeline._startFrame, `${path}._startFrame`),
        requireNonNegativeInteger(timeline._endFrame, `${path}._endFrame`),
        [`timelineActions[${index}]`, '_sequenceActionData'],
      );
    },
  );
  return result;
}

function formatTargetGroupActionSourcePath(
  sourceName: string,
  actionPath: readonly string[],
): string {
  const relative = actionPath.reduce(
    (result, part) => result + (part.startsWith('[') ? part : `${result ? '.' : ''}${part}`),
    '',
  );
  return `${sourceName}.actionGroupData.${relative}`;
}

function samePath(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((part, index) => part === right[index]);
}
