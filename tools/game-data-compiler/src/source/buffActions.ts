import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
  requireString,
} from './primitives.ts';
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

export interface BuffFindSettingsSource {
  readonly checkType: string;
  /** 保留原数组中的空占位，是否参与查询由后续原生语义投影决定。 */
  readonly buffIds: readonly string[];
  readonly tagQuery: TagQuerySource;
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
    buffs: parseBuffEntries(action.buffs, `${path}.buffs`),
    count: parseScalarSource(action.count, `${path}.count`, inheritedBlackboard),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    buffSource: requireNonEmptyString(action.buffSource, `${path}.buffSource`),
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

export function parseBuffFindSettingsSource(value: unknown, path: string): BuffFindSettingsSource {
  const settings = requireRecord(value, path);
  requireExactFields(settings, new Set(['checkType', 'buffIdList', 'tagQuery']), path);
  return {
    checkType: requireNonEmptyString(settings.checkType, `${path}.checkType`),
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
  requireExactFields(
    source,
    new Set([
      'm_abilityEntityTypeInfo',
      'm_timedMarkerInfo',
      'durationSourceType',
      'timedMarkerId',
    ]),
    path,
  );
  // 两个 m_ 字段是原生编辑器说明文本，不进入战斗 IR，但仍校验其序列化类型。
  requireString(source.m_abilityEntityTypeInfo, `${path}.m_abilityEntityTypeInfo`);
  requireString(source.m_timedMarkerInfo, `${path}.m_timedMarkerInfo`);
  return {
    durationSourceType: requireNonEmptyString(
      source.durationSourceType,
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
