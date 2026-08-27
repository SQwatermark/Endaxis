import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import {
  parseScalarSource,
  parseStringScalarSource,
  type BlackboardLevelValues,
  type ScalarSource,
  type StringScalarSource,
} from './scalar.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

// combat-spec keyword-actions.md：来自 GetKeywordBuffName 的原生跳转表和元数据字符串，
// 不是根据 Buff ID 命名规律生成。其它关键词族须取得自身映射证据后再加入。
const VULNERABLE_CARRIERS = {
  All: 'buff_common_affixes_vulnerable_all',
  Spell: 'buff_common_affixes_vulnerable_spell',
  Physical: 'buff_common_affixes_vulnerable_physical',
  Natural: 'buff_common_affixes_vulnerable_natural',
  Fire: 'buff_common_affixes_vulnerable_fire',
  Crystal: 'buff_common_affixes_vulnerable_crystal',
  Pulse: 'buff_common_affixes_vulnerable_pulse',
} as const;

export interface KeywordBuffActionSource {
  readonly kind: 'keywordBuff';
  readonly keyword: 'Vulnerable';
  readonly subType: keyof typeof VULNERABLE_CARRIERS;
  readonly carrierBuffId: string;
  readonly source: TargetReferenceSource;
  readonly target: TargetReferenceSource;
  readonly duration: ScalarSource;
  readonly rate: ScalarSource;
  readonly overrideChildBuffId: boolean;
  readonly childBuffId: StringScalarSource;
  readonly asChildBuff: boolean;
  readonly autoFinishByAction: boolean;
  readonly enhancements: readonly {
    readonly buffIds: readonly string[];
    readonly operation: 'Assign' | 'Add' | 'Multiply';
    readonly value: ScalarSource;
  }[];
}

/** 公共关键词来源切片：保留动态覆盖与增强触发条件，不提前简化成一个属性修正。 */
export function parseVulnerableActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): KeywordBuffActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'source',
      'target',
      'duration',
      'rate',
      'overrideChildBuffId',
      'childBuffId',
      'asChildBuff',
      'enhancingList',
      'autoFinishByAction',
      'subType',
    ]),
    path,
  );
  const subType = requireNonEmptyString(action.subType, `${path}.subType`);
  if (!Object.hasOwn(VULNERABLE_CARRIERS, subType))
    throw new Error(`${path}.subType: unsupported keyword subtype ${JSON.stringify(subType)}`);
  const typedSubType = subType as KeywordBuffActionSource['subType'];
  return {
    kind: 'keywordBuff',
    keyword: 'Vulnerable',
    subType: typedSubType,
    carrierBuffId: VULNERABLE_CARRIERS[typedSubType],
    source: parseTargetReferenceSource(action.source, `${path}.source`),
    target: parseTargetReferenceSource(action.target, `${path}.target`),
    duration: parseScalarSource(action.duration, `${path}.duration`, inheritedBlackboard),
    rate: parseScalarSource(action.rate, `${path}.rate`, inheritedBlackboard),
    overrideChildBuffId: requireBoolean(action.overrideChildBuffId, `${path}.overrideChildBuffId`),
    childBuffId: parseStringScalarSource(action.childBuffId, `${path}.childBuffId`),
    asChildBuff: requireBoolean(action.asChildBuff, `${path}.asChildBuff`),
    autoFinishByAction: requireBoolean(action.autoFinishByAction, `${path}.autoFinishByAction`),
    enhancements: requireArray(action.enhancingList, `${path}.enhancingList`).map((raw, index) => {
      const itemPath = `${path}.enhancingList[${index}]`;
      const item = requireRecord(raw, itemPath);
      requireExactFields(item, new Set(['buffIds', 'operationType', 'value']), itemPath);
      const operation = requireNonEmptyString(item.operationType, `${itemPath}.operationType`);
      if (operation !== 'Assign' && operation !== 'Add' && operation !== 'Multiply')
        throw new Error(
          `${itemPath}.operationType: unsupported keyword enhancement ${JSON.stringify(operation)}`,
        );
      return {
        buffIds: requireArray(item.buffIds, `${itemPath}.buffIds`).map((id, idIndex) =>
          requireNonEmptyString(id, `${itemPath}.buffIds[${idIndex}]`),
        ),
        operation,
        value: parseScalarSource(item.value, `${itemPath}.value`, inheritedBlackboard),
      };
    }),
  };
}
