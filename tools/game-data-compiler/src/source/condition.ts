import {
  nativeActionName,
  requireArray,
  requireBoolean,
  requireExactFields,
  requireInteger,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import { projectNativeDamageElement } from './damageElement.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';
import { parseCharacterTeamSelectionRole } from './selectorFacts.ts';
import { parseTagQuerySource, type TagQueryType } from './tagQuery.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

interface ConditionIdentity {
  readonly sourceType: string;
}

export type NativeConditionSource =
  | (ConditionIdentity & {
      /** AbilitySystem 被动条件；这里只保留比较结构，不在来源层读取或计算生命比例。 */
      readonly kind: 'currentHpRatio';
      readonly comparison: string;
      readonly value: ScalarSource;
    })
  | (ConditionIdentity & {
      readonly kind: 'floatCompare';
      readonly comparison: string;
      readonly left: ScalarSource;
      readonly right: ScalarSource;
    })
  | (ConditionIdentity & {
      readonly kind: 'mainOperator';
      readonly targetSource: string;
      readonly targetGroupKey: string;
    })
  | (ConditionIdentity & {
      readonly kind: 'distance';
      readonly source: TargetReferenceSource;
      readonly target: TargetReferenceSource;
      readonly distance: number;
      readonly lessThan: boolean;
      readonly includeTargetRadius: boolean;
      readonly containsHittableObject: boolean;
    })
  | (ConditionIdentity & {
      readonly kind: 'entityCount';
      readonly targetSource: string;
      readonly targetGroupKey: string;
      readonly minimumCount: number;
      readonly comparison: string;
      readonly containsHittableTarget: boolean;
      readonly excludeDeadEntity: boolean;
      readonly storeKey: string;
    })
  | (ConditionIdentity & BuffStackConditionSource)
  | (ConditionIdentity & {
      readonly kind: 'entityTag';
      readonly targetSource: string;
      readonly targetGroupKey: string;
      readonly tagQueryType: TagQueryType;
      readonly tagIds: readonly number[];
    })
  | (ConditionIdentity & {
      readonly kind: 'timedMarker';
      readonly targetSource: string;
      readonly targetGroupKey: string;
      readonly markerId: string;
      readonly blackboardKey: string;
      readonly useBlackboardKey: boolean;
      readonly returnTrueIfNotExists: boolean;
    })
  | (ConditionIdentity & {
      readonly kind: 'health';
      readonly targetSource: string;
      readonly targetGroupKey: string;
      readonly comparison: string;
      readonly isRatio: boolean;
      readonly value: ScalarSource;
      readonly characterTeamSelectionRole: string | null;
    })
  | (ConditionIdentity & { readonly kind: 'probability'; readonly value: ScalarSource })
  | (ConditionIdentity & { readonly kind: 'skillType'; readonly skillTypes: readonly string[] })
  | (ConditionIdentity & {
      readonly kind: 'targetIdentity';
      readonly first: TargetReferenceSource;
      readonly second: TargetReferenceSource;
    })
  | (ConditionIdentity & {
      readonly kind: 'objectTypeMatch';
      readonly target: TargetReferenceSource;
      readonly objectTypeMask: string | number;
    })
  | (ConditionIdentity & { readonly kind: 'damageType'; readonly damageType: string })
  | (ConditionIdentity & {
      readonly kind: 'inflictionType';
      readonly elements: readonly string[];
      readonly savedKey: string;
    })
  | (ConditionIdentity & {
      /** 物理异常事件上下文的 0..3 类型位集；非空 savedKey 尚未进入运行投影。 */
      readonly kind: 'physicalInflictionType';
      readonly types: readonly ('airborne' | 'knockDown' | 'fracture' | 'crush')[];
      readonly savedKey: string;
    })
  | (ConditionIdentity & {
      readonly kind: 'deckAttributeCompare';
      readonly targetSource: string;
      readonly targetGroupKey: string;
      readonly leftAttribute: string;
      readonly leftValue: ScalarSource;
      readonly comparison: string;
      readonly rightAttribute: string;
      readonly rightValue: ScalarSource;
    })
  | (ConditionIdentity & {
      readonly kind: 'abilityEntityDuration';
      readonly target: TargetReferenceSource;
      readonly comparison: string;
      readonly value: ScalarSource;
      readonly saveCurrentDuration: boolean;
      readonly outputKey: string;
    })
  | (ConditionIdentity & {
      readonly kind: 'damageDecorateMask';
      readonly checkType: string;
      readonly mask: number;
    })
  | (ConditionIdentity & {
      readonly kind: 'healTag';
      readonly queryType: TagQueryType;
      readonly tagIds: readonly number[];
    })
  | (ConditionIdentity & {
      readonly kind: 'overHeal';
      readonly overHealKey: string;
      readonly finalHealKey: string;
      readonly realHealKey: string;
    })
  | (ConditionIdentity & {
      readonly kind: 'contextBuff';
      readonly checkType: string;
      readonly buffIds: readonly string[];
      readonly queryType: string;
      readonly buffTagIds: readonly number[];
    })
  | (ConditionIdentity & {
      readonly kind: 'globalCooldown';
      readonly targetSource: string;
      readonly targetGroupKey: string;
      readonly buffId: string;
    })
  | (ConditionIdentity & { readonly kind: 'skillHasHit' })
  | (ConditionIdentity & {
      readonly kind: 'enemyRank';
      readonly target: TargetReferenceSource;
      readonly rankMask: number;
    })
  | (ConditionIdentity & {
      readonly kind: 'superArmor';
      readonly target: TargetReferenceSource;
      readonly comparison: string;
      readonly value: ScalarSource;
    })
  | (ConditionIdentity & {
      readonly kind: 'twoDirectionAngle';
      readonly dir1Source: TargetReferenceSource;
      readonly dir1Target: TargetReferenceSource;
      readonly dir1DirectionType: string;
      readonly dir2Source: TargetReferenceSource;
      readonly dir2Target: TargetReferenceSource;
      readonly dir2DirectionType: string;
      readonly comparison: string;
      readonly value: ScalarSource;
    })
  | (ConditionIdentity & {
      readonly kind: 'targetAngle';
      readonly origin: TargetReferenceSource;
      readonly target: TargetReferenceSource;
      readonly angleType: string;
      readonly angle: ScalarSource;
    })
  | (ConditionIdentity & {
      readonly kind: 'poise';
      readonly target: TargetReferenceSource;
      readonly returnValueIfMissing: boolean;
      readonly comparison: string;
      readonly value: ScalarSource;
    })
  | (ConditionIdentity & {
      readonly kind: 'any';
      readonly groups: readonly ConditionAnyGroupSource[];
    });

export interface ConditionAnyGroupSource {
  readonly conditions: readonly NativeConditionSource[];
  readonly negated: readonly boolean[];
}

export interface BuffStackConditionSource {
  readonly kind: 'buffStack';
  readonly targetSource: string;
  readonly targetGroupKey: string;
  readonly buffCheckType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: TagQueryType;
  readonly buffTagIds: readonly number[];
  readonly countType: string;
  readonly comparison: string;
  readonly value: ScalarSource;
  readonly limitSkillCastId: boolean;
}

/**
 * 解析一个原生条件叶子。该函数不产生 `supported` 判断，也不执行单敌人场景折叠。
 * 尚未迁移的条件会携带原生类型和字段路径明确失败。
 */
export function parseConditionLeafSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeConditionSource {
  const condition = requireRecord(value, path);
  const sourceType = typeof condition.$type === 'string' ? nativeActionName(condition.$type) : '';

  switch (sourceType) {
    case 'CheckCurHpRatio':
      requireExactFields(condition, new Set(['$type', 'compareType', 'value']), path);
      return {
        kind: 'currentHpRatio',
        sourceType,
        comparison: requireNonEmptyString(condition.compareType, `${path}.compareType`),
        value: parseScalarSource(condition.value, `${path}.value`, inheritedBlackboard),
      };
    case 'OrConditionAction':
      return parseAnyCondition(condition, path, sourceType, inheritedBlackboard);
    case 'CompareFloat':
      return {
        kind: 'floatCompare',
        sourceType,
        comparison: requireNonEmptyString(condition.compare, `${path}.compare`),
        left: parseScalarSource(condition.valueA, `${path}.valueA`, inheritedBlackboard),
        right: parseScalarSource(condition.valueB, `${path}.valueB`, inheritedBlackboard),
      };
    case 'CheckMainCharacterCondition':
      return parseMainOperator(condition, path, sourceType);
    case 'CheckDistanceCondition':
      return {
        kind: 'distance',
        sourceType,
        source: parseTargetReferenceSource(condition.source, `${path}.source`),
        target: parseTargetReferenceSource(condition.target, `${path}.target`),
        distance: requireNumber(condition.distance, `${path}.distance`),
        lessThan: requireBoolean(condition.lessThan, `${path}.lessThan`),
        includeTargetRadius: requireBoolean(
          condition.includeTargetRadius,
          `${path}.includeTargetRadius`,
        ),
        containsHittableObject: requireBoolean(
          condition.containsHittableObj,
          `${path}.containsHittableObj`,
        ),
      };
    case 'CheckEntityNum':
      return parseEntityCount(condition, path, sourceType);
    case 'CheckBuffStackNum':
      return parseSimpleBuffStack(condition, path, sourceType, inheritedBlackboard);
    case 'CheckBuffStackNumAdvanced':
      return parseAdvancedBuffStack(condition, path, sourceType, inheritedBlackboard);
    case 'CheckBuffStackNumByTag':
      return parseTagBuffStack(condition, path, sourceType, inheritedBlackboard);
    case 'CheckTagMatch':
      return parseEntityTag(condition, path, sourceType);
    case 'CheckTimedMarkerCondition':
      return parseTimedMarker(condition, path, sourceType);
    case 'CheckHp':
      return parseHealth(condition, path, sourceType, inheritedBlackboard);
    case 'Probablity':
      return {
        kind: 'probability',
        sourceType,
        value: parseScalarSource(condition.prob, `${path}.prob`, inheritedBlackboard),
      };
    case 'CheckSkillType':
      return {
        kind: 'skillType',
        sourceType,
        skillTypes: requireArray(condition.skillTypeList, `${path}.skillTypeList`).map(
          (item, index) => requireString(item, `${path}.skillTypeList[${index}]`),
        ),
      };
    case 'CheckTargetsEqual':
      return {
        kind: 'targetIdentity',
        sourceType,
        first: parseTargetReferenceSource(
          condition.firstTargetSettings,
          `${path}.firstTargetSettings`,
        ),
        second: parseTargetReferenceSource(
          condition.secondTargetSettings,
          `${path}.secondTargetSettings`,
        ),
      };
    case 'CheckObjectTypeMatch': {
      const mask = condition.objectTypeMask;
      if ((typeof mask !== 'string' && typeof mask !== 'number') || typeof mask === 'boolean') {
        throw new Error(`${path}.objectTypeMask: expected flags`);
      }
      return {
        kind: 'objectTypeMatch',
        sourceType,
        target: parseTargetReferenceSource(condition.target, `${path}.target`),
        objectTypeMask: mask,
      };
    }
    case 'CheckDamageType':
      return parseDamageType(condition, path, sourceType);
    case 'CheckSpellInflictionType':
      return parseInflictionType(condition, path, sourceType);
    case 'CheckPhysicalInflictionType':
      return {
        kind: 'physicalInflictionType',
        sourceType,
        types: parsePhysicalInflictionMask(condition.mask, `${path}.mask`),
        savedKey: requireString(condition.savedKey, `${path}.savedKey`),
      };
    case 'CompareDeckAttr':
      return parseDeckAttribute(condition, path, sourceType, inheritedBlackboard);
    case 'CheckAbilityEntityCurDuration':
      return {
        kind: 'abilityEntityDuration',
        sourceType,
        target: parseTargetReferenceSource(condition.abilityEntity, `${path}.abilityEntity`),
        comparison: requireNonEmptyString(condition.compareType, `${path}.compareType`),
        value: parseScalarSource(condition.value, `${path}.value`, inheritedBlackboard),
        saveCurrentDuration: requireBoolean(condition.saveCurDuration, `${path}.saveCurDuration`),
        outputKey: requireString(condition.bbKey, `${path}.bbKey`),
      };
    case 'CheckDamageDecorateMask':
      return {
        kind: 'damageDecorateMask',
        sourceType,
        checkType: requireNonEmptyString(condition.checkType, `${path}.checkType`),
        mask: requireNonNegativeInteger(condition.mask, `${path}.mask`),
      };
    case 'CheckHealTag': {
      const query = parseTagQuerySource(condition.query, `${path}.query`);
      return { kind: 'healTag', sourceType, queryType: query.queryType, tagIds: query.tagIds };
    }
    case 'CheckOverHeal':
      return {
        kind: 'overHeal',
        sourceType,
        overHealKey: requireString(condition.overHealKey, `${path}.overHealKey`),
        finalHealKey: requireString(condition.finalHealKey, `${path}.finalHealKey`),
        realHealKey: requireString(condition.realHealKey, `${path}.realHealKey`),
      };
    case 'CheckBuffIdInContext':
      return parseContextBuff(condition, path, sourceType);
    case 'CheckBuffIdInContextAdvanced':
      return parseAdvancedContextBuff(condition, path, sourceType);
    case 'CheckGlobalCDTimerAction': {
      const target = requireRecord(condition.target, `${path}.target`);
      return {
        kind: 'globalCooldown',
        sourceType,
        targetSource: requireNonEmptyString(target.targetSource, `${path}.target.targetSource`),
        targetGroupKey: requireString(target.targetGroupKey, `${path}.target.targetGroupKey`),
        buffId: requireNonEmptyString(condition.buffId, `${path}.buffId`),
      };
    }
    case 'CheckSkillHasHit':
      return { kind: 'skillHasHit', sourceType };
    case 'CheckEnemyRank':
      return {
        kind: 'enemyRank',
        sourceType,
        target: parseTargetReferenceSource(condition.target, `${path}.target`),
        rankMask: parseEnemyRankMask(condition.enemyRankSet, `${path}.enemyRankSet`),
      };
    case 'CheckSuperArmor':
      return parseScalarTargetCondition(
        'superArmor',
        sourceType,
        condition,
        path,
        'checkTarget',
        'compareType',
        inheritedBlackboard,
      );
    case 'CheckTwoDirectionAngle':
      return parseTwoDirectionAngle(condition, path, sourceType, inheritedBlackboard);
    case 'CheckTargetAngle':
      return {
        kind: 'targetAngle',
        sourceType,
        origin: parseTargetReferenceSource(condition.origin, `${path}.origin`),
        target: parseTargetReferenceSource(condition.target, `${path}.target`),
        angleType: requireNonEmptyString(condition.angleType, `${path}.angleType`),
        angle: parseScalarSource(condition.angle, `${path}.angle`, inheritedBlackboard),
      };
    case 'CheckPoiseValue':
      return {
        kind: 'poise',
        sourceType,
        target: parseTargetReferenceSource(condition.poiseOwner, `${path}.poiseOwner`),
        returnValueIfMissing: requireBoolean(
          condition.returnValueIfDontHavePoise,
          `${path}.returnValueIfDontHavePoise`,
        ),
        comparison: requireNonEmptyString(condition.compare, `${path}.compare`),
        value: parseScalarSource(condition.value, `${path}.value`, inheritedBlackboard),
      };
    default:
      throw new Error(`${path}: condition parser has not migrated ${JSON.stringify(sourceType)}`);
  }
}

function parsePhysicalInflictionMask(
  value: unknown,
  path: string,
): readonly ('airborne' | 'knockDown' | 'fracture' | 'crush')[] {
  const names = requireNonEmptyString(value, path)
    .split(',')
    .map(item => item.trim());
  const mapping = {
    Airborne: 'airborne',
    KnockDown: 'knockDown',
    Fracture: 'fracture',
    Crush: 'crush',
  } as const;
  return names.map(name => {
    const type = mapping[name as keyof typeof mapping];
    if (type === undefined) throw new Error(`${path}: unknown physical infliction flag '${name}'`);
    return type;
  });
}

function parseMainOperator(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
): NativeConditionSource {
  const target = requireRecord(condition.checkTarget, `${path}.checkTarget`);
  return {
    kind: 'mainOperator',
    sourceType,
    targetSource: requireNonEmptyString(target.targetSource, `${path}.checkTarget.targetSource`),
    targetGroupKey: requireString(target.targetGroupKey, `${path}.checkTarget.targetGroupKey`),
  };
}

function parseEntityCount(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
): NativeConditionSource {
  const target = requireRecord(condition.checkTarget, `${path}.checkTarget`);
  return {
    kind: 'entityCount',
    sourceType,
    targetSource: requireNonEmptyString(target.targetSource, `${path}.checkTarget.targetSource`),
    targetGroupKey: requireString(target.targetGroupKey, `${path}.checkTarget.targetGroupKey`),
    minimumCount: requireInteger(condition.minNum, `${path}.minNum`),
    comparison: requireNonEmptyString(condition.compareType, `${path}.compareType`),
    containsHittableTarget: requireBoolean(
      condition.containsHittableTarget,
      `${path}.containsHittableTarget`,
    ),
    excludeDeadEntity: requireBoolean(condition.excludeDeadEntity, `${path}.excludeDeadEntity`),
    storeKey: requireString(condition.storeKey, `${path}.storeKey`),
  };
}

function parseSimpleBuffStack(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeConditionSource {
  const buff = requireRecord(condition.buffId, `${path}.buffId`);
  return createBuffStack(
    condition,
    path,
    sourceType,
    inheritedBlackboard,
    'Id',
    [requireNonEmptyString(buff.buffId, `${path}.buffId.buffId`)],
    'hasAny',
    [],
    'BuffCount',
    false,
  );
}

function parseAdvancedBuffStack(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeConditionSource {
  const settings = parseBuffFindSettings(condition.buffSettings, `${path}.buffSettings`);
  return createBuffStack(
    condition,
    path,
    sourceType,
    inheritedBlackboard,
    settings.checkType,
    settings.buffIds,
    settings.tagQueryType,
    settings.buffTagIds,
    requireNonEmptyString(condition.buffStackNumType, `${path}.buffStackNumType`),
    requireBoolean(condition.limitSkillCastId, `${path}.limitSkillCastId`),
  );
}

function parseTagBuffStack(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeConditionSource {
  const query = parseTagQuerySource(condition.tagQuery, `${path}.tagQuery`);
  return createBuffStack(
    condition,
    path,
    sourceType,
    inheritedBlackboard,
    'Tag',
    [],
    query.queryType,
    query.tagIds,
    requireNonEmptyString(condition.buffStackNumType, `${path}.buffStackNumType`),
    false,
  );
}

function createBuffStack(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
  inheritedBlackboard: BlackboardLevelValues,
  buffCheckType: string,
  buffIds: readonly string[],
  tagQueryType: TagQueryType,
  buffTagIds: readonly number[],
  countType: string,
  limitSkillCastId: boolean,
): NativeConditionSource {
  const target = requireRecord(condition.checkTarget, `${path}.checkTarget`);
  return {
    kind: 'buffStack',
    sourceType,
    targetSource: requireNonEmptyString(target.targetSource, `${path}.checkTarget.targetSource`),
    targetGroupKey: requireString(target.targetGroupKey, `${path}.checkTarget.targetGroupKey`),
    buffCheckType,
    buffIds,
    tagQueryType,
    buffTagIds,
    countType,
    comparison: requireNonEmptyString(condition.compareType, `${path}.compareType`),
    value: parseScalarSource(condition.value, `${path}.value`, inheritedBlackboard),
    limitSkillCastId,
  };
}

function parseEntityTag(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
): NativeConditionSource {
  const target = requireRecord(condition.checkTarget, `${path}.checkTarget`);
  const query = parseTagQuerySource(condition.query, `${path}.query`);
  return {
    kind: 'entityTag',
    sourceType,
    targetSource: requireNonEmptyString(target.targetSource, `${path}.checkTarget.targetSource`),
    targetGroupKey: requireString(target.targetGroupKey, `${path}.checkTarget.targetGroupKey`),
    tagQueryType: query.queryType,
    tagIds: query.tagIds,
  };
}

function parseTimedMarker(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
): NativeConditionSource {
  const target = requireRecord(condition.checkTarget, `${path}.checkTarget`);
  return {
    kind: 'timedMarker',
    sourceType,
    targetSource: requireNonEmptyString(target.targetSource, `${path}.checkTarget.targetSource`),
    targetGroupKey: requireString(target.targetGroupKey, `${path}.checkTarget.targetGroupKey`),
    markerId: requireString(condition.id, `${path}.id`),
    blackboardKey: requireString(condition.blackboardKey, `${path}.blackboardKey`),
    useBlackboardKey: requireBoolean(condition.useBlackboardKey, `${path}.useBlackboardKey`),
    returnTrueIfNotExists: requireBoolean(
      condition.returnTrueIfNotExists,
      `${path}.returnTrueIfNotExists`,
    ),
  };
}

function parseHealth(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeConditionSource {
  const target = requireRecord(condition.hpOwner, `${path}.hpOwner`);
  const targetSource = requireNonEmptyString(target.targetSource, `${path}.hpOwner.targetSource`);
  return {
    kind: 'health',
    sourceType,
    targetSource,
    targetGroupKey: requireString(target.targetGroupKey, `${path}.hpOwner.targetGroupKey`),
    comparison: requireNonEmptyString(condition.compare, `${path}.compare`),
    isRatio: requireBoolean(condition.isRatio, `${path}.isRatio`),
    value: parseScalarSource(condition.value, `${path}.value`, inheritedBlackboard),
    characterTeamSelectionRole:
      targetSource === 'InstantSearch'
        ? parseCharacterTeamSelectionRole(target.selectorData, `${path}.hpOwner.selectorData`)
        : null,
  };
}

function parseAnyCondition(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeConditionSource {
  const groups: ConditionAnyGroupSource[] = [];
  requireArray(condition.conditionList, `${path}.conditionList`).forEach((rawGroup, groupIndex) => {
    const groupPath = `${path}.conditionList[${groupIndex}]`;
    const group = requireRecord(rawGroup, groupPath);
    requireExactFields(
      group,
      new Set(['actionData', 'onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard']),
      groupPath,
    );
    if (group.onlyExecuteWhenSourceIsMainChar !== false) {
      throw new Error(`${groupPath}: main-character-only OR groups are unsupported`);
    }
    if (group.onlyExecuteWhenSourceIsGuard !== false) {
      throw new Error(`${groupPath}: guard-only OR groups are unsupported`);
    }

    const conditions: NativeConditionSource[] = [];
    const negated: boolean[] = [];
    let negateNext = false;
    requireArray(group.actionData, `${groupPath}.actionData`).forEach((rawItem, index) => {
      const itemPath = `${groupPath}.actionData[${index}]`;
      const item = requireRecord(rawItem, itemPath);
      if (item.isEnable === false) return;
      const itemType = typeof item.$type === 'string' ? nativeActionName(item.$type) : '';
      if (itemType === 'NotNextCheckAction') {
        if (negateNext) {
          throw new Error(`${itemPath}: consecutive NotNextCheckAction is unsupported`);
        }
        negateNext = true;
        return;
      }
      conditions.push(parseConditionLeafSource(item, itemPath, inheritedBlackboard));
      negated.push(negateNext);
      negateNext = false;
    });
    if (negateNext) throw new Error(`${groupPath}: dangling NotNextCheckAction`);
    if (conditions.length > 0) groups.push({ conditions, negated });
  });
  if (groups.length === 0) throw new Error(`${path}: OrConditionAction has no non-empty groups`);
  return { kind: 'any', sourceType, groups };
}

function parseDamageType(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
): NativeConditionSource {
  const nativeType = requireNonEmptyString(condition.damageType, `${path}.damageType`);
  const damageType = projectNativeDamageElement(nativeType, `${path}.damageType`);
  return { kind: 'damageType', sourceType, damageType };
}

function parseInflictionType(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
): NativeConditionSource {
  const nativeElements = requireString(condition.mask, `${path}.mask`)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  const elements = [
    ...new Set(nativeElements.map(item => projectNativeDamageElement(item, `${path}.mask`))),
  ];
  if (elements.length === 0 || elements.includes('physical')) {
    throw new Error(`${path}.mask: unsupported value ${JSON.stringify(condition.mask)}`);
  }
  return {
    kind: 'inflictionType',
    sourceType,
    elements: elements as string[],
    savedKey: requireString(condition.savedKey, `${path}.savedKey`),
  };
}

function parseDeckAttribute(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeConditionSource {
  const target = parseTargetReferenceSource(condition.target, `${path}.target`);
  return {
    kind: 'deckAttributeCompare',
    sourceType,
    targetSource: target.targetSource,
    targetGroupKey: target.targetGroupKey,
    leftAttribute: requireNonEmptyString(condition.lhsType, `${path}.lhsType`),
    leftValue: parseScalarSource(condition.lhsValue, `${path}.lhsValue`, inheritedBlackboard),
    comparison: requireNonEmptyString(condition.compare, `${path}.compare`),
    rightAttribute: requireNonEmptyString(condition.rhsType, `${path}.rhsType`),
    rightValue: parseScalarSource(condition.rhsValue, `${path}.rhsValue`, inheritedBlackboard),
  };
}

function parseContextBuff(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
): NativeConditionSource {
  const checkType = requireNonEmptyString(condition.checkType, `${path}.checkType`);
  const buffIds = requireArray(condition.buffIdList, `${path}.buffIdList`).flatMap(
    (rawBuff, index) => {
      const buffPath = `${path}.buffIdList[${index}]`;
      const buff = requireRecord(rawBuff, buffPath);
      const buffId = requireString(buff.buffId, `${buffPath}.buffId`);
      if (!buffId && checkType !== 'Tag') {
        throw new Error(`${buffPath}.buffId: expected non-empty string`);
      }
      return buffId ? [buffId] : [];
    },
  );
  const query = requireRecord(condition.query, `${path}.query`);
  const buffTagIds = requireArray(query.tags ?? [], `${path}.query.tags`).map((rawTag, index) => {
    const tag = requireRecord(rawTag, `${path}.query.tags[${index}]`);
    return requireInteger(tag.tagId, `${path}.query.tags[${index}].tagId`);
  });
  return {
    kind: 'contextBuff',
    sourceType,
    checkType,
    buffIds,
    queryType: requireNonEmptyString(query.queryType, `${path}.query.queryType`),
    buffTagIds,
  };
}

/**
 * 1.4.4 Advanced 的已闭环纯 Tag 条件分支。非空 blackboardKey 会写回事件 Buff ID，
 * BlackboardBuffId 列表也有独立读取语义，因此都不能折叠到基础条件。
 */
function parseAdvancedContextBuff(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
): NativeConditionSource {
  requireExactFields(
    condition,
    new Set([
      '$type',
      'isEnable',
      'priorityLevel',
      'priorityOffset',
      'serverActionIndex',
      'checkType',
      'buffIdList',
      'query',
      'blackboardKey',
    ]),
    path,
  );
  const checkType = requireNonEmptyString(condition.checkType, `${path}.checkType`);
  if (checkType !== 'Tag') {
    throw new Error(`${path}.checkType: only the confirmed Tag branch is supported`);
  }
  const buffIdList = requireArray(condition.buffIdList, `${path}.buffIdList`);
  if (buffIdList.length !== 0) {
    throw new Error(`${path}.buffIdList: Advanced Tag projection requires an empty ID list`);
  }
  const blackboardKey = requireString(condition.blackboardKey, `${path}.blackboardKey`);
  if (blackboardKey !== '') {
    throw new Error(`${path}.blackboardKey: event Buff ID output is not supported`);
  }
  const query = parseTagQuerySource(condition.query, `${path}.query`);
  return {
    kind: 'contextBuff',
    sourceType,
    checkType,
    buffIds: [],
    queryType: query.queryType,
    buffTagIds: query.tagIds,
  };
}

function parseEnemyRankMask(value: unknown, path: string): number {
  let result: number;
  if (typeof value === 'number' && Number.isInteger(value)) result = value;
  else if (typeof value === 'string') {
    const bits: Readonly<Record<string, number>> = { Mob: 1, Elite: 2, Boss: 4 };
    const names = value.split(',').map(item => item.trim());
    if (names.length === 0 || names.some(name => !name) || new Set(names).size !== names.length) {
      throw new Error(`${path}: invalid EnemyRankSet names`);
    }
    if (names.some(name => bits[name] === undefined)) {
      throw new Error(`${path}: unknown EnemyRankSet name`);
    }
    result = names.reduce((sum, name) => sum + bits[name]!, 0);
  } else throw new Error(`${path}: expected EnemyRankSet flags`);
  if (result < 0 || (result & ~0b111) !== 0) throw new Error(`${path}: unknown EnemyRankSet bits`);
  return result;
}

function parseScalarTargetCondition(
  kind: 'superArmor',
  sourceType: string,
  condition: Record<string, unknown>,
  path: string,
  targetField: string,
  comparisonField: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeConditionSource {
  return {
    kind,
    sourceType,
    target: parseTargetReferenceSource(condition[targetField], `${path}.${targetField}`),
    comparison: requireNonEmptyString(condition[comparisonField], `${path}.${comparisonField}`),
    value: parseScalarSource(condition.value, `${path}.value`, inheritedBlackboard),
  };
}

function parseTwoDirectionAngle(
  condition: Record<string, unknown>,
  path: string,
  sourceType: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeConditionSource {
  return {
    kind: 'twoDirectionAngle',
    sourceType,
    dir1Source: parseTargetReferenceSource(condition.dir1Source, `${path}.dir1Source`),
    dir1Target: parseTargetReferenceSource(condition.dir1Target, `${path}.dir1Target`),
    dir1DirectionType: requireNonEmptyString(
      condition.dir1DirectionType,
      `${path}.dir1DirectionType`,
    ),
    dir2Source: parseTargetReferenceSource(condition.dir2Source, `${path}.dir2Source`),
    dir2Target: parseTargetReferenceSource(condition.dir2Target, `${path}.dir2Target`),
    dir2DirectionType: requireNonEmptyString(
      condition.dir2DirectionType,
      `${path}.dir2DirectionType`,
    ),
    comparison: requireNonEmptyString(condition.compareType, `${path}.compareType`),
    value: parseScalarSource(condition.value, `${path}.value`, inheritedBlackboard),
  };
}

export function parseBuffFindSettings(
  value: unknown,
  path: string,
): {
  readonly checkType: string;
  readonly buffIds: readonly string[];
  readonly tagQueryType: TagQueryType;
  readonly buffTagIds: readonly number[];
} {
  const settings = requireRecord(value, path);
  const buffIds = requireArray(settings.buffIdList, `${path}.buffIdList`)
    .map((item, index) => requireString(item, `${path}.buffIdList[${index}]`))
    .filter(Boolean);
  const query = parseTagQuerySource(settings.tagQuery, `${path}.tagQuery`);
  return {
    checkType: requireNonEmptyString(settings.checkType, `${path}.checkType`),
    buffIds,
    tagQueryType: query.queryType,
    buffTagIds: query.tagIds,
  };
}
