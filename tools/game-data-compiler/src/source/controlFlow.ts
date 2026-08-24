import {
  nativeActionName,
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];

export interface NativeActionMetadataSource {
  readonly nativeType: string;
  readonly nativeName: string;
  /** false 项不会进入原生运行时 SequenceAction，但来源树仍保留其完整配置。 */
  readonly enabled: boolean;
  readonly priorityLevel: string;
  readonly priorityOffset: number;
  readonly serverActionIndex: number;
}

export interface NativeSequenceSource<TLeaf> {
  readonly onlyExecuteWhenSourceIsMainCharacter: boolean;
  readonly onlyExecuteWhenSourceIsGuard: boolean;
  readonly actions: readonly NativeActionNodeSource<TLeaf>[];
}

export interface NativeSwitchOptionSource<TLeaf> {
  readonly value: ScalarSource;
  readonly action: NativeSequenceSource<TLeaf>;
}

export type NativeTickIntervalModeSource = 'EachFrame' | 'Interval' | 'FixedCount';

export type NativeActionBodySource<TLeaf> =
  | { readonly kind: 'leaf'; readonly value: TLeaf }
  | {
      readonly kind: 'ifElse';
      readonly condition: NativeSequenceSource<TLeaf>;
      readonly whenTrue: NativeSequenceSource<TLeaf>;
      readonly whenFalse: NativeSequenceSource<TLeaf>;
      readonly alwaysNext: boolean;
    }
  | {
      readonly kind: 'switch';
      readonly choice: ScalarSource;
      readonly options: readonly NativeSwitchOptionSource<TLeaf>[];
      readonly alwaysNext: boolean;
    }
  | {
      readonly kind: 'forEach';
      readonly target: TargetReferenceSource;
      readonly action: NativeSequenceSource<TLeaf>;
    }
  | {
      readonly kind: 'channeling';
      readonly target: TargetReferenceSource;
      readonly executeEachFrame: boolean;
      readonly triggerIntervalSeconds: number;
      readonly maxCountPerTarget: number;
      readonly targetTriggerIntervalSeconds: number;
      readonly actionOnTick: NativeSequenceSource<TLeaf>;
    }
  | {
      readonly kind: 'timelineJump';
      readonly destinationFrame: number;
      readonly condition: NativeSequenceSource<TLeaf>;
    }
  | {
      readonly kind: 'tickInterval';
      readonly executeEachFrame: boolean;
      readonly intervalSeconds: number;
      readonly useIntervalBlackboardKey: boolean;
      /** 未启用时仍保留序列化残留；投影层只在开关为真时读取。 */
      readonly intervalBlackboardKey: string;
      readonly actionOnTick: NativeSequenceSource<TLeaf>;
    }
  | {
      readonly kind: 'tickIntervalV2';
      readonly tickMode: NativeTickIntervalModeSource;
      readonly tickInterval: ScalarSource;
      /** 原生类型是 BlackboardInt，因此直接值必须是整数。 */
      readonly fixedTickCount: ScalarSource;
      readonly totalTickCount: number;
      readonly totalDurationSeconds: number;
      readonly actionOnTick: NativeSequenceSource<TLeaf>;
    }
  | { readonly kind: 'negateNextResult' };

export interface NativeActionNodeSource<TLeaf> {
  readonly sourcePath: string;
  readonly metadata: NativeActionMetadataSource;
  readonly body: NativeActionBodySource<TLeaf>;
}

export type NativeLeafParser<TLeaf> = (value: unknown, path: string) => TLeaf;

/**
 * 严格读取原生 SequenceActionData，并把递归控制节点统一成公共树。
 * 此层不删除关闭项、不展开分支，也不把根序列守卫解释成技能释放条件。
 */
export function parseNativeSequenceSource<TLeaf>(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: NativeLeafParser<TLeaf>,
): NativeSequenceSource<TLeaf> {
  const sequence = requireRecord(value, path);
  requireExactFields(
    sequence,
    new Set(['actionData', 'onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard']),
    path,
  );
  return {
    onlyExecuteWhenSourceIsMainCharacter: requireBoolean(
      sequence.onlyExecuteWhenSourceIsMainChar,
      `${path}.onlyExecuteWhenSourceIsMainChar`,
    ),
    onlyExecuteWhenSourceIsGuard: requireBoolean(
      sequence.onlyExecuteWhenSourceIsGuard,
      `${path}.onlyExecuteWhenSourceIsGuard`,
    ),
    actions: requireArray(sequence.actionData, `${path}.actionData`).map((action, index) =>
      parseNativeActionNodeSource(
        action,
        `${path}.actionData[${index}]`,
        inheritedBlackboard,
        parseLeaf,
      ),
    ),
  };
}

function parseNativeActionNodeSource<TLeaf>(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: NativeLeafParser<TLeaf>,
): NativeActionNodeSource<TLeaf> {
  const action = requireRecord(value, path);
  const nativeType = requireNonEmptyString(action.$type, `${path}.$type`);
  const nativeName = nativeActionName(nativeType);
  const metadata: NativeActionMetadataSource = {
    nativeType,
    nativeName,
    enabled: requireBoolean(action.isEnable, `${path}.isEnable`),
    priorityLevel: requireNonEmptyString(action.priorityLevel, `${path}.priorityLevel`),
    priorityOffset: requireInteger(action.priorityOffset, `${path}.priorityOffset`),
    serverActionIndex: requireInteger(action.serverActionIndex, `${path}.serverActionIndex`),
  };

  let body: NativeActionBodySource<TLeaf>;
  if (nativeName === 'IfElseAction') {
    body = parseIfElseBody(action, path, inheritedBlackboard, parseLeaf);
  } else if (nativeName === 'SwitchAction') {
    body = parseSwitchBody(action, path, inheritedBlackboard, parseLeaf);
  } else if (nativeName === 'ForEachAction') {
    body = parseForEachBody(action, path, inheritedBlackboard, parseLeaf);
  } else if (nativeName === 'ChannelingAction') {
    body = parseChannelingBody(action, path, inheritedBlackboard, parseLeaf);
  } else if (nativeName === 'JumpToAction') {
    body = parseTimelineJumpBody(action, path, inheritedBlackboard, parseLeaf);
  } else if (nativeName === 'TickIntervalAction') {
    body = parseTickIntervalBody(action, path, inheritedBlackboard, parseLeaf);
  } else if (nativeName === 'TickIntervalActionV2') {
    body = parseTickIntervalV2Body(action, path, inheritedBlackboard, parseLeaf);
  } else if (nativeName === 'NotNextCheckAction') {
    requireExactFields(action, new Set(ACTION_META_FIELDS), path);
    body = { kind: 'negateNextResult' };
  } else {
    body = { kind: 'leaf', value: parseLeaf(value, path) };
  }
  return { sourcePath: path, metadata, body };
}

function parseTickIntervalV2Body<TLeaf>(
  action: Record<string, unknown>,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: NativeLeafParser<TLeaf>,
): NativeActionBodySource<TLeaf> {
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'tickMode',
      'tickInterval',
      'fixedTickCount',
      'totalTickCount',
      'totalDuration',
      'actionOnTick',
    ]),
    path,
  );
  const rawMode = requireNonEmptyString(action.tickMode, `${path}.tickMode`);
  if (rawMode !== 'EachFrame' && rawMode !== 'Interval' && rawMode !== 'FixedCount') {
    throw new Error(`${path}.tickMode: unsupported value ${JSON.stringify(rawMode)}`);
  }

  const tickInterval = parseStrictBlackboardScalar(
    action.tickInterval,
    `${path}.tickInterval`,
    inheritedBlackboard,
    false,
  );
  const fixedTickCount = parseStrictBlackboardScalar(
    action.fixedTickCount,
    `${path}.fixedTickCount`,
    inheritedBlackboard,
    true,
  );
  return {
    kind: 'tickIntervalV2',
    tickMode: rawMode,
    tickInterval,
    fixedTickCount,
    totalTickCount: requireInteger(action.totalTickCount, `${path}.totalTickCount`),
    totalDurationSeconds: requireNumber(action.totalDuration, `${path}.totalDuration`),
    actionOnTick: parseNativeSequenceSource(
      action.actionOnTick,
      `${path}.actionOnTick`,
      inheritedBlackboard,
      parseLeaf,
    ),
  };
}

/** V2 的反编译适配器证明键是否存在必须与开关严格一致。 */
function parseStrictBlackboardScalar(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  requireIntegerValue: boolean,
): ScalarSource {
  const source = requireRecord(value, path);
  requireExactFields(source, new Set(['useBlackboardKey', 'value', 'blackboardKey']), path);
  const useBlackboardKey = requireBoolean(source.useBlackboardKey, `${path}.useBlackboardKey`);
  const blackboardKey = requireString(source.blackboardKey, `${path}.blackboardKey`);
  if (useBlackboardKey === (blackboardKey.length === 0)) {
    throw new Error(`${path}.blackboardKey: key presence must match useBlackboardKey`);
  }
  if (requireIntegerValue) requireInteger(source.value, `${path}.value`);
  return parseScalarSource(source, path, inheritedBlackboard);
}

function parseIfElseBody<TLeaf>(
  action: Record<string, unknown>,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: NativeLeafParser<TLeaf>,
): NativeActionBodySource<TLeaf> {
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'conditionAction',
      'succeedActions',
      'failActions',
      'alwaysNext',
    ]),
    path,
  );
  return {
    kind: 'ifElse',
    condition: parseNativeSequenceSource(
      action.conditionAction,
      `${path}.conditionAction`,
      inheritedBlackboard,
      parseLeaf,
    ),
    whenTrue: parseNativeSequenceSource(
      action.succeedActions,
      `${path}.succeedActions`,
      inheritedBlackboard,
      parseLeaf,
    ),
    whenFalse: parseNativeSequenceSource(
      action.failActions,
      `${path}.failActions`,
      inheritedBlackboard,
      parseLeaf,
    ),
    alwaysNext: requireBoolean(action.alwaysNext, `${path}.alwaysNext`),
  };
}

function parseSwitchBody<TLeaf>(
  action: Record<string, unknown>,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: NativeLeafParser<TLeaf>,
): NativeActionBodySource<TLeaf> {
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'choice', 'options', 'alwaysNext']),
    path,
  );
  return {
    kind: 'switch',
    choice: parseScalarSource(action.choice, `${path}.choice`, inheritedBlackboard),
    options: requireArray(action.options, `${path}.options`).map((rawOption, index) => {
      const optionPath = `${path}.options[${index}]`;
      const option = requireRecord(rawOption, optionPath);
      requireExactFields(option, new Set(['value', 'actionData']), optionPath);
      return {
        value: parseScalarSource(option.value, `${optionPath}.value`, inheritedBlackboard),
        action: parseNativeSequenceSource(
          option.actionData,
          `${optionPath}.actionData`,
          inheritedBlackboard,
          parseLeaf,
        ),
      };
    }),
    alwaysNext: requireBoolean(action.alwaysNext, `${path}.alwaysNext`),
  };
}

function parseForEachBody<TLeaf>(
  action: Record<string, unknown>,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: NativeLeafParser<TLeaf>,
): NativeActionBodySource<TLeaf> {
  requireExactFields(action, new Set([...ACTION_META_FIELDS, 'target', 'action']), path);
  return {
    kind: 'forEach',
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    action: parseNativeSequenceSource(
      action.action,
      `${path}.action`,
      inheritedBlackboard,
      parseLeaf,
    ),
  };
}

function parseChannelingBody<TLeaf>(
  action: Record<string, unknown>,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: NativeLeafParser<TLeaf>,
): NativeActionBodySource<TLeaf> {
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'targetSettings',
      'executeEachFrame',
      'triggerInterval',
      'maxCountPerTarget',
      'targetTriggerInterval',
      'actionOnTick',
    ]),
    path,
  );
  return {
    kind: 'channeling',
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    executeEachFrame: requireBoolean(action.executeEachFrame, `${path}.executeEachFrame`),
    triggerIntervalSeconds: requireNumber(action.triggerInterval, `${path}.triggerInterval`),
    maxCountPerTarget: requireInteger(action.maxCountPerTarget, `${path}.maxCountPerTarget`),
    targetTriggerIntervalSeconds: requireNumber(
      action.targetTriggerInterval,
      `${path}.targetTriggerInterval`,
    ),
    actionOnTick: parseNativeSequenceSource(
      action.actionOnTick,
      `${path}.actionOnTick`,
      inheritedBlackboard,
      parseLeaf,
    ),
  };
}

function parseTimelineJumpBody<TLeaf>(
  action: Record<string, unknown>,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: NativeLeafParser<TLeaf>,
): NativeActionBodySource<TLeaf> {
  requireExactFields(
    action,
    new Set([...ACTION_META_FIELDS, 'conditionAction', 'destFrame']),
    path,
  );
  return {
    kind: 'timelineJump',
    destinationFrame: requireInteger(action.destFrame, `${path}.destFrame`),
    condition: parseNativeSequenceSource(
      action.conditionAction,
      `${path}.conditionAction`,
      inheritedBlackboard,
      parseLeaf,
    ),
  };
}

function parseTickIntervalBody<TLeaf>(
  action: Record<string, unknown>,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  parseLeaf: NativeLeafParser<TLeaf>,
): NativeActionBodySource<TLeaf> {
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'executeEachFrame',
      'tickInterval',
      'tickIntervalBlackboardKey',
      'useTickIntervalBlackboardKey',
      'actionOnTick',
    ]),
    path,
  );
  const useIntervalBlackboardKey = requireBoolean(
    action.useTickIntervalBlackboardKey,
    `${path}.useTickIntervalBlackboardKey`,
  );
  const intervalBlackboardKey = requireString(
    action.tickIntervalBlackboardKey,
    `${path}.tickIntervalBlackboardKey`,
  );
  if (useIntervalBlackboardKey && !intervalBlackboardKey) {
    throw new Error(`${path}.tickIntervalBlackboardKey: active reference has no key`);
  }
  return {
    kind: 'tickInterval',
    executeEachFrame: requireBoolean(action.executeEachFrame, `${path}.executeEachFrame`),
    intervalSeconds: requireNumber(action.tickInterval, `${path}.tickInterval`),
    useIntervalBlackboardKey,
    intervalBlackboardKey,
    actionOnTick: parseNativeSequenceSource(
      action.actionOnTick,
      `${path}.actionOnTick`,
      inheritedBlackboard,
      parseLeaf,
    ),
  };
}
