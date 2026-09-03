import {
  requireBoolean,
  requireExactFields,
  requireNativeEnum,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';

const NATIVE_BLACKBOARD_OPERATIONS = [
  'Assign',
  'Add',
  'Multiply',
  'Divide',
  'Floor',
  'Ceil',
  'RoundToInt',
] as const;
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';
import { parseAttributeTypeName, type AttributeTypeSource } from './attributeModifiers.ts';

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];

export interface BlackboardCalculationPayloadSource {
  readonly key: string;
  readonly operation: string;
  readonly left: ScalarSource;
  readonly right: ScalarSource;
  readonly addend: ScalarSource | null;
}

export interface BlackboardMutationPayloadSource {
  readonly key: string;
  readonly operation: string;
  readonly value: ScalarSource;
}

export interface BlackboardCalculationActionSource extends BlackboardCalculationPayloadSource {
  readonly kind: 'blackboardCalculation';
}

export interface BlackboardMutationActionSource extends BlackboardMutationPayloadSource {
  readonly kind: 'blackboardMutation';
  readonly directValue: boolean;
  readonly calculationTarget: TargetReferenceSource;
  readonly calculationType: string;
}

export interface RandomBlackboardActionSource {
  readonly kind: 'randomBlackboardWrite';
  readonly randomType: string;
  readonly minimum: ScalarSource;
  readonly maximum: ScalarSource;
  readonly targetKey: string;
}

export interface AttributeSnapshotActionSource {
  readonly kind: 'attributeSnapshot';
  readonly target: TargetReferenceSource;
  readonly primaryAttributeType: 'Specific' | 'Sub';
  readonly attributeType: AttributeTypeSource;
  readonly storeAttributeType: 'BaseNonConverted' | 'FinalNonConverted';
  readonly useFloor: boolean;
  readonly divisor: ScalarSource;
  readonly multiplier: ScalarSource;
  readonly baseValue: ScalarSource;
  readonly outputKey: string;
}

/** 只保存随机写入的原生配置；上下界包含性和随机算法留给有运行时证据的投影层。 */
export function parseRandomBlackboardActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): RandomBlackboardActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'randomType', 'minValue', 'maxValue', 'targetBlackboardKey']),
    path,
  );
  return {
    kind: 'randomBlackboardWrite',
    randomType: requireNativeEnum(
      action.randomType,
      ['Int', 'Float'] as const,
      `${path}.randomType`,
    ),
    minimum: parseScalarSource(action.minValue, `${path}.minValue`, inheritedBlackboard),
    maximum: parseScalarSource(action.maxValue, `${path}.maxValue`, inheritedBlackboard),
    targetKey: requireNonEmptyString(action.targetBlackboardKey, `${path}.targetBlackboardKey`),
  };
}

/** 读取目标属性快照及写回公式；具体属性求值由后续公共执行层负责。 */
export function parseAttributeSnapshotActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): AttributeSnapshotActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'primaryAttributeType',
      'attributeType',
      'storeAttributeType',
      'useFloor',
      'divisorValue',
      'multiplierValue',
      'baseValue',
      'key',
    ]),
    path,
  );
  return {
    kind: 'attributeSnapshot',
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    primaryAttributeType: requireNativeEnum(
      action.primaryAttributeType,
      new Map([
        [0, 'Specific'],
        [2, 'Sub'],
      ] as const),
      `${path}.primaryAttributeType`,
    ),
    attributeType: parseAttributeTypeName(action.attributeType, `${path}.attributeType`),
    storeAttributeType: requireNativeEnum(
      action.storeAttributeType,
      ['BaseNonConverted', 'FinalNonConverted'] as const,
      `${path}.storeAttributeType`,
    ),
    useFloor: requireBoolean(action.useFloor, `${path}.useFloor`),
    divisor: parseScalarSource(action.divisorValue, `${path}.divisorValue`, inheritedBlackboard),
    multiplier: parseScalarSource(
      action.multiplierValue,
      `${path}.multiplierValue`,
      inheritedBlackboard,
    ),
    baseValue: parseScalarSource(action.baseValue, `${path}.baseValue`, inheritedBlackboard),
    outputKey: requireNonEmptyString(action.key, `${path}.key`),
  };
}

/** 完整读取 SimpleCalcBBAction；调度帧仍由外层时间轴节点负责。 */
export function parseBlackboardCalculationActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BlackboardCalculationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'key', 'operation', 'value1', 'value2']),
    path,
  );
  return {
    kind: 'blackboardCalculation',
    ...parseBlackboardCalculationPayloadSource(action, path, inheritedBlackboard),
  };
}

/**
 * 完整读取 ModifyDynamicBlackboard 来源事实。间接路径是合法原生数据；是否能执行由投影层判断。
 */
export function parseBlackboardMutationActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BlackboardMutationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'key',
      'operation',
      'directValue',
      'value',
      'calculationTarget',
      'calculateType',
    ]),
    path,
  );
  return {
    kind: 'blackboardMutation',
    key: requireNonEmptyString(action.key, `${path}.key`),
    operation: requireNativeEnum(
      action.operation,
      NATIVE_BLACKBOARD_OPERATIONS,
      `${path}.operation`,
    ),
    value: parseScalarSource(action.value, `${path}.value`, inheritedBlackboard),
    directValue: requireBoolean(action.directValue, `${path}.directValue`),
    calculationTarget: parseTargetReferenceSource(
      action.calculationTarget,
      `${path}.calculationTarget`,
    ),
    calculationType: requireNativeEnum(
      action.calculateType,
      ['HpRatio'] as const,
      `${path}.calculateType`,
    ),
  };
}

/** 读取 SimpleCalcBBAction 的纯计算载荷；调度帧由外层时间轴收集器附加。 */
export function parseBlackboardCalculationPayloadSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BlackboardCalculationPayloadSource {
  const action = requireRecord(value, path);
  return {
    key: requireNonEmptyString(action.key, `${path}.key`),
    operation: requireNativeEnum(
      action.operation,
      NATIVE_BLACKBOARD_OPERATIONS,
      `${path}.operation`,
    ),
    left: parseScalarSource(action.value1, `${path}.value1`, inheritedBlackboard),
    right: parseScalarSource(action.value2, `${path}.value2`, inheritedBlackboard),
    addend: null,
  };
}

/**
 * 读取当前 Endaxis 可执行的直接值子集。完整来源读取必须使用
 * parseBlackboardMutationActionSource，不能把这里的投影限制当成源数据无效。
 */
export function parseBlackboardMutationPayloadSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BlackboardMutationPayloadSource {
  const action = requireRecord(value, path);
  if (!requireBoolean(action.directValue, `${path}.directValue`)) {
    throw new Error(`${path}.directValue: unsupported false`);
  }
  return {
    key: requireNonEmptyString(action.key, `${path}.key`),
    operation: requireNativeEnum(
      action.operation,
      NATIVE_BLACKBOARD_OPERATIONS,
      `${path}.operation`,
    ),
    value: parseScalarSource(action.value, `${path}.value`, inheritedBlackboard),
  };
}
