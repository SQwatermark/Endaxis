import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNativeEnum,
  requireNonEmptyString,
  requireRecord,
  requireString,
} from './primitives.ts';

const NATIVE_ACTION_TARGET_TYPES = [
  'ActionSource',
  'ActionOwner',
  'InputTarget',
  'CurrentTarget',
  'ContextTarget',
  'MainCharacter',
] as const;
const NATIVE_BUFF_IGNITE_TYPES = new Map([
  [1, 'PhysicalStatus'],
  [2, 'EnergyShardByFire'],
  [3, 'EnergyShardByPulse'],
  [4, 'EnergyShardByCryst'],
  [5, 'EnergyShardByNatural'],
  [6, 'EndminUlt'],
  [7, 'NoGuard'],
] as const);
import {
  parseBlackboardAssignmentsSource,
  type BlackboardAssignmentSource,
} from './assignments.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';
import { parseTagQuerySource, type TagQuerySource } from './tagQuery.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];

export type BuffBlackboardAssignmentSource = BlackboardAssignmentSource;

/** 点燃是调用目标 Buff 的响应，不等同于火元素附着或伤害。 */
export interface BuffIgniteActionSource {
  readonly kind: 'buffIgnite';
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly igniteType: string;
  readonly successTargetContextKey: string;
}

export function parseBuffIgniteActionSource(value: unknown, path: string): BuffIgniteActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'igniteSource',
      'targetSettings',
      'igniteType',
      'successTargetContextKey',
    ]),
    path,
  );
  return {
    kind: 'buffIgnite',
    source: parseTargetReferenceSource(action.igniteSource, `${path}.igniteSource`),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    igniteType: requireNativeEnum(
      action.igniteType,
      NATIVE_BUFF_IGNITE_TYPES,
      `${path}.igniteType`,
    ),
    successTargetContextKey: requireString(
      action.successTargetContextKey,
      `${path}.successTargetContextKey`,
    ),
  };
}

/** combat-spec OnPhysicalNoGuardStartAction：只发布关卡统计事件，不施加破防。 */
export function parsePhysicalNoGuardStartedEventSource(
  value: unknown,
  path: string,
): {
  readonly kind: 'physicalNoGuardStartedEvent';
} {
  requireExactFields(requireRecord(value, path), new Set(ACTION_META_FIELDS), path);
  return { kind: 'physicalNoGuardStartedEvent' };
}

export interface BuffApplicationEntrySource {
  /** 直接 Buff ID；动态读取时可能为空，因此来源层不擅自要求非空。 */
  readonly buffId: string;
  readonly assignBlackboard: boolean;
  readonly assignments: readonly BuffBlackboardAssignmentSource[];
  readonly readIdFromBlackboard: boolean;
  readonly buffIdKey: string;
}

export interface BuffIconDurationSource {
  readonly durationSourceType: string;
  readonly timedMarkerId: string;
}

export interface BuffApplicationActionSource {
  readonly kind: 'buffApplication';
  /** 原生派生类只改变成功创建后的归属，不改变公共 Buff 创建数据结构。 */
  readonly lifetimeOwner: 'independent' | 'currentCastSkill';
  readonly buffs: readonly BuffApplicationEntrySource[];
  readonly count: ScalarSource;
  readonly target: TargetReferenceSource;
  readonly buffSource: string;
  readonly contextKey: string;
  readonly autoFinishByAction: boolean;
  readonly inheritSkillIds: readonly string[];
  readonly finishWithNextSkillIfNotInherited: boolean;
  readonly asChildBuff: boolean;
  readonly inheritSourceSkillCastId: boolean;
  readonly inheritSourceSkillCastInfo: boolean;
  readonly isExtra: boolean;
  readonly passTargetGroupsToBuff: boolean;
  readonly overrideBuffIconDuration: boolean;
  readonly buffIconDuration: BuffIconDurationSource;
}

/** Existing-Buff lifecycle transfer used by chained skills; it never creates a Buff. */
export interface BuffInheritanceActionSource {
  readonly kind: 'buffInheritance';
  readonly owner: TargetReferenceSource;
  readonly targetBuffId: string;
  readonly inheritSkillIds: readonly string[];
  readonly finishByAction: boolean;
  readonly finishWithNextSkillIfNotInherited: boolean;
}

export function parseBuffInheritanceActionSource(
  value: unknown,
  path: string,
): BuffInheritanceActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'buffOwner',
      'targetBuffId',
      'inheritSkillIdList',
      'finishByAction',
      'finishWithNextSkillIfNotInherited',
    ]),
    path,
  );
  return {
    kind: 'buffInheritance',
    owner: parseTargetReferenceSource(action.buffOwner, `${path}.buffOwner`),
    targetBuffId: requireNonEmptyString(action.targetBuffId, `${path}.targetBuffId`),
    inheritSkillIds: requireArray(action.inheritSkillIdList, `${path}.inheritSkillIdList`).map(
      (item, index) => requireNonEmptyString(item, `${path}.inheritSkillIdList[${index}]`),
    ),
    finishByAction: requireBoolean(action.finishByAction, `${path}.finishByAction`),
    finishWithNextSkillIfNotInherited: requireBoolean(
      action.finishWithNextSkillIfNotInherited,
      `${path}.finishWithNextSkillIfNotInherited`,
    ),
  };
}

export interface BuffFindSettingsSource {
  readonly checkType: string;
  /** 保留原数组中的空占位，是否参与查询由后续原生语义投影决定。 */
  readonly buffIds: readonly string[];
  readonly tagQuery: TagQuerySource;
}

/** ExtendBuffAction：在动作区间内阻止首次解析出的既有 Buff 结束。 */
export interface BuffHoldActionSource {
  readonly kind: 'buffHold';
  readonly owner: TargetReferenceSource;
  readonly settings: BuffFindSettingsSource;
}

export function parseBuffHoldActionSource(value: unknown, path: string): BuffHoldActionSource {
  const action = requireRecord(value, path);
  requireExactFields(action, new Set([...ACTION_META_FIELDS, 'buffOwner', 'buffSettings']), path);
  return {
    kind: 'buffHold',
    owner: parseTargetReferenceSource(action.buffOwner, `${path}.buffOwner`),
    settings: parseBuffFindSettingsSource(action.buffSettings, `${path}.buffSettings`),
  };
}

interface BuffFinishCommonSource {
  readonly owner: TargetReferenceSource;
  readonly finishAll: boolean;
  readonly finishLayerCount: ScalarSource;
  readonly limitSource: boolean;
  readonly buffSource: TargetReferenceSource;
  readonly isFinishedEarly: boolean;
  readonly finishSource: TargetReferenceSource;
}

export type BuffFinishActionSource =
  | (BuffFinishCommonSource & {
      readonly kind: 'buffFinishById';
      readonly buffIds: readonly string[];
    })
  | (BuffFinishCommonSource & {
      readonly kind: 'buffFinishByQuery';
      readonly settings: BuffFindSettingsSource;
      readonly isAbsorbed: boolean;
    });

export function parseBuffApplicationActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  lifetimeOwner: BuffApplicationActionSource['lifetimeOwner'] = 'independent',
): BuffApplicationActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'buffs',
      'count',
      'targetSettings',
      'buffSource',
      'contextKey',
      'autoFinishByAction',
      'inheritSkillIdList',
      'finishWithNextSkillIfNotInherited',
      'asChildBuff',
      'inheritSourceSkillCastId',
      'inheritSourceSkillCastInfo',
      'isExtra',
      'passTargetGroupsToBuff',
      'overrideBuffIconDuration',
      'buffIconDurationSource',
    ]),
    path,
  );
  return {
    kind: 'buffApplication',
    lifetimeOwner,
    buffs: parseBuffEntries(action.buffs, `${path}.buffs`),
    count: parseScalarSource(action.count, `${path}.count`, inheritedBlackboard),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    buffSource: requireNativeEnum(
      action.buffSource,
      NATIVE_ACTION_TARGET_TYPES,
      `${path}.buffSource`,
    ),
    contextKey: requireString(action.contextKey, `${path}.contextKey`),
    autoFinishByAction: requireBoolean(action.autoFinishByAction, `${path}.autoFinishByAction`),
    inheritSkillIds: requireArray(action.inheritSkillIdList, `${path}.inheritSkillIdList`).map(
      (item, index) => requireString(item, `${path}.inheritSkillIdList[${index}]`),
    ),
    finishWithNextSkillIfNotInherited: requireBoolean(
      action.finishWithNextSkillIfNotInherited,
      `${path}.finishWithNextSkillIfNotInherited`,
    ),
    asChildBuff: requireBoolean(action.asChildBuff, `${path}.asChildBuff`),
    inheritSourceSkillCastId: requireBoolean(
      action.inheritSourceSkillCastId,
      `${path}.inheritSourceSkillCastId`,
    ),
    inheritSourceSkillCastInfo: requireBoolean(
      action.inheritSourceSkillCastInfo,
      `${path}.inheritSourceSkillCastInfo`,
    ),
    isExtra: requireBoolean(action.isExtra, `${path}.isExtra`),
    passTargetGroupsToBuff: requireBoolean(
      action.passTargetGroupsToBuff,
      `${path}.passTargetGroupsToBuff`,
    ),
    overrideBuffIconDuration: requireBoolean(
      action.overrideBuffIconDuration,
      `${path}.overrideBuffIconDuration`,
    ),
    buffIconDuration: parseBuffIconDuration(
      action.buffIconDurationSource,
      `${path}.buffIconDurationSource`,
    ),
  };
}

export function parseAdvancedBuffFinishActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BuffFinishActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'buffOwner',
      'buffSettings',
      'finishAll',
      'finishLayerCnt',
      'limitSource',
      'buffSource',
      'isFinishedEarly',
      'isAbsorbed',
      'finishSource',
    ]),
    path,
  );
  return {
    kind: 'buffFinishByQuery',
    ...parseBuffFinishCommon(action, path, inheritedBlackboard),
    settings: parseBuffFindSettingsSource(action.buffSettings, `${path}.buffSettings`),
    isAbsorbed: requireBoolean(action.isAbsorbed, `${path}.isAbsorbed`),
  };
}

export function parseLegacyBuffFinishActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BuffFinishActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'buffOwner',
      'buffIds',
      'finishAll',
      'finishLayerCnt',
      'limitSource',
      'buffSource',
      'isFinishedEarly',
      'finishSource',
    ]),
    path,
  );
  const buffIds = requireArray(action.buffIds, `${path}.buffIds`).map((rawItem, index) => {
    const itemPath = `${path}.buffIds[${index}]`;
    const item = requireRecord(rawItem, itemPath);
    requireExactFields(item, new Set(['buffId']), itemPath);
    return requireString(item.buffId, `${itemPath}.buffId`);
  });
  return {
    kind: 'buffFinishById',
    ...parseBuffFinishCommon(action, path, inheritedBlackboard),
    buffIds,
  };
}

/** 旧式独立 FinishBuffByTag 载荷；归一为与 FinishBuffAdvanced 共用的 Tag 查询 IR。 */
export function parseTaggedBuffFinishActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BuffFinishActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'buffOwner',
      'tagQuery',
      'finishAll',
      'finishLayerCnt',
      'limitSource',
      'buffSource',
      'isFinishedEarly',
      'finishSource',
    ]),
    path,
  );
  return {
    kind: 'buffFinishByQuery',
    ...parseBuffFinishCommon(action, path, inheritedBlackboard),
    settings: {
      checkType: 'Tag',
      buffIds: [],
      tagQuery: parseTagQuerySource(action.tagQuery, `${path}.tagQuery`),
    },
    isAbsorbed: false,
  };
}

export function parseBuffFindSettingsSource(value: unknown, path: string): BuffFindSettingsSource {
  const settings = requireRecord(value, path);
  requireExactFields(settings, new Set(['checkType', 'buffIdList', 'tagQuery']), path);
  return {
    checkType: requireNativeEnum(
      settings.checkType,
      ['Id', 'Tag', 'Environment', 'Context'] as const,
      `${path}.checkType`,
    ),
    buffIds: requireArray(settings.buffIdList, `${path}.buffIdList`).map((item, index) =>
      requireString(item, `${path}.buffIdList[${index}]`),
    ),
    tagQuery: parseTagQuerySource(settings.tagQuery, `${path}.tagQuery`),
  };
}

function parseBuffEntries(value: unknown, path: string): BuffApplicationEntrySource[] {
  return requireArray(value, path).map((rawEntry, index) => {
    const entryPath = `${path}[${index}]`;
    const entry = requireRecord(rawEntry, entryPath);
    requireExactFields(
      entry,
      new Set(['buffId', 'assignBlackboard', 'assignItems', 'readIdFromBlackboard', 'buffIdKey']),
      entryPath,
    );
    return {
      buffId: requireString(entry.buffId, `${entryPath}.buffId`),
      assignBlackboard: requireBoolean(entry.assignBlackboard, `${entryPath}.assignBlackboard`),
      assignments: parseBlackboardAssignmentsSource(entry.assignItems, `${entryPath}.assignItems`, {
        enabled: requireBoolean(entry.assignBlackboard, `${entryPath}.assignBlackboard`),
      }),
      readIdFromBlackboard: requireBoolean(
        entry.readIdFromBlackboard,
        `${entryPath}.readIdFromBlackboard`,
      ),
      buffIdKey: requireString(entry.buffIdKey, `${entryPath}.buffIdKey`),
    };
  });
}

function parseBuffIconDuration(value: unknown, path: string): BuffIconDurationSource {
  const source = requireRecord(value, path);
  const hasLegacyHints = Object.hasOwn(source, 'm_abilityEntityTypeInfo');
  requireExactFields(
    source,
    hasLegacyHints
      ? new Set([
          'm_abilityEntityTypeInfo',
          'm_timedMarkerInfo',
          'durationSourceType',
          'timedMarkerId',
        ])
      : new Set(['durationSourceType', 'timedMarkerId']),
    path,
  );
  // 两个 m_ 字段是原生编辑器说明文本，不进入战斗 IR，但仍校验其序列化类型。
  if (hasLegacyHints) {
    requireString(source.m_abilityEntityTypeInfo, `${path}.m_abilityEntityTypeInfo`);
    requireString(source.m_timedMarkerInfo, `${path}.m_timedMarkerInfo`);
  }
  return {
    durationSourceType: requireNativeEnum(
      source.durationSourceType,
      ['AbilityEntity', 'TimedMarker'] as const,
      `${path}.durationSourceType`,
    ),
    timedMarkerId: requireString(source.timedMarkerId, `${path}.timedMarkerId`),
  };
}

function parseBuffFinishCommon(
  action: Record<string, unknown>,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): BuffFinishCommonSource {
  return {
    owner: parseTargetReferenceSource(action.buffOwner, `${path}.buffOwner`),
    finishAll: requireBoolean(action.finishAll, `${path}.finishAll`),
    // finishAll=true 时运行时可能不读取该值，但来源层仍保留序列化载荷。
    finishLayerCount: parseScalarSource(
      action.finishLayerCnt,
      `${path}.finishLayerCnt`,
      inheritedBlackboard,
    ),
    limitSource: requireBoolean(action.limitSource, `${path}.limitSource`),
    buffSource: parseTargetReferenceSource(action.buffSource, `${path}.buffSource`),
    isFinishedEarly: requireBoolean(action.isFinishedEarly, `${path}.isFinishedEarly`),
    finishSource: parseTargetReferenceSource(action.finishSource, `${path}.finishSource`),
  };
}
