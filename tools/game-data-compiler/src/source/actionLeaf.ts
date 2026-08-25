import {
  parseBlackboardCalculationActionSource,
  parseBlackboardMutationActionSource,
  parseAttributeSnapshotActionSource,
  parseRandomBlackboardActionSource,
  type BlackboardCalculationActionSource,
  type BlackboardMutationActionSource,
  type AttributeSnapshotActionSource,
  type RandomBlackboardActionSource,
} from './blackboardActions.ts';
import {
  parseAdvancedBuffFinishActionSource,
  parseBuffApplicationActionSource,
  parseLegacyBuffFinishActionSource,
  type BuffApplicationActionSource,
  type BuffFinishActionSource,
} from './buffActions.ts';
import {
  parseBuffStackReadActionSource,
  type BuffStackReadActionSource,
} from './buffQueryActions.ts';
import { parseConditionLeafSource, type NativeConditionSource } from './condition.ts';
import { parseNativeSequenceSource, type NativeSequenceSource } from './controlFlow.ts';
import { parseDamageActionSource, type DamageActionSource } from './damageActions.ts';
import { parseHealActionSource, type HealActionSource } from './healActions.ts';
import { parseFinishOwnerActionSource, type FinishOwnerActionSource } from './lifecycleActions.ts';
import { nativeActionName, requireNonEmptyString, requireRecord } from './primitives.ts';
import { parsePlaySoundActionSource, type PlaySoundActionSource } from './presentationActions.ts';
import {
  parseAbilityEntitySpawnActionSource,
  parseProjectileLaunchActionSource,
  parseSkillCastActionSource,
  type AbilityEntitySpawnActionSource,
  type ProjectileLaunchActionSource,
  type SkillCastActionSource,
} from './referenceActions.ts';
import {
  parseGlobalCooldownApplicationSource,
  parseResourceGainActionSource,
  parseTimedMarkerApplicationSource,
  type GlobalCooldownApplicationSource,
  type ResourceGainActionSource,
  type TimedMarkerApplicationSource,
} from './resourceActions.ts';
import type { BlackboardLevelValues } from './scalar.ts';
import {
  parseTimeDilationActionSource,
  parseUltimateTimeActionSource,
  type TimeDilationActionSource,
  type UltimateTimeActionSource,
} from './timeDilationActions.ts';
import { parseTargetGroupActionSource, type TargetGroupActionSource } from './targetGroup.ts';

const CONDITION_ACTION_NAMES = new Set([
  'OrConditionAction',
  'CompareFloat',
  'CheckMainCharacterCondition',
  'CheckDistanceCondition',
  'CheckEntityNum',
  'CheckBuffStackNum',
  'CheckBuffStackNumAdvanced',
  'CheckBuffStackNumByTag',
  'CheckTagMatch',
  'CheckTimedMarkerCondition',
  'CheckHp',
  'Probablity',
  'CheckSkillType',
  'CheckObtainAtbType',
  'CheckTargetsEqual',
  'CheckObjectTypeMatch',
  'CheckDamageType',
  'CheckSpellInflictionType',
  'CheckPhysicalInflictionType',
  'CompareDeckAttr',
  'CheckAbilityEntityCurDuration',
  'CheckDamageDecorateMask',
  'CheckHealTag',
  'CheckOverHeal',
  'CheckBuffIdInContext',
  'CheckBuffIdInContextAdvanced',
  'CheckGlobalCDTimerAction',
  'CheckSkillHasHit',
  'CheckEnemyRank',
  'CheckSuperArmor',
  'CheckTwoDirectionAngle',
  'CheckTargetAngle',
  'CheckPoiseValue',
]);

/** 引用闭包需要严格读取的动作身份；集合与分派实现同属公共来源层，调用方不再复制 switch。 */
const REFERENCE_CLOSURE_ACTION_NAMES = new Set([
  'CreateBuffAction',
  'FinishBuffAction',
  'FinishBuffAdvanced',
  'LaunchProjectile',
  'SpawnAbilityEntity',
  'CastSkill',
]);

export type KnownNativeActionParseScope = 'all' | 'referenceClosure';

/** 已迁移到公共来源 IR 的 Action 叶子；领域适配器只能消费该公共并集。 */
export type KnownNativeActionLeafSource =
  | { readonly family: 'condition'; readonly action: NativeConditionSource }
  | { readonly family: 'blackboardCalculation'; readonly action: BlackboardCalculationActionSource }
  | { readonly family: 'blackboardMutation'; readonly action: BlackboardMutationActionSource }
  | { readonly family: 'randomBlackboard'; readonly action: RandomBlackboardActionSource }
  | { readonly family: 'attributeSnapshot'; readonly action: AttributeSnapshotActionSource }
  | { readonly family: 'targetGroup'; readonly action: TargetGroupActionSource }
  | { readonly family: 'resource'; readonly action: ResourceGainActionSource }
  | { readonly family: 'timedMarker'; readonly action: TimedMarkerApplicationSource }
  | { readonly family: 'globalCooldown'; readonly action: GlobalCooldownApplicationSource }
  | { readonly family: 'buffApplication'; readonly action: BuffApplicationActionSource }
  | { readonly family: 'buffFinish'; readonly action: BuffFinishActionSource }
  | { readonly family: 'buffQuery'; readonly action: BuffStackReadActionSource }
  | { readonly family: 'heal'; readonly action: HealActionSource }
  | { readonly family: 'lifecycle'; readonly action: FinishOwnerActionSource }
  | {
      readonly family: 'timeDilation';
      readonly action: TimeDilationActionSource | UltimateTimeActionSource;
    }
  | { readonly family: 'damage'; readonly action: DamageActionSource }
  | { readonly family: 'presentation'; readonly action: PlaySoundActionSource }
  | { readonly family: 'projectile'; readonly action: ProjectileLaunchActionSource }
  | { readonly family: 'abilityEntity'; readonly action: AbilityEntitySpawnActionSource }
  | { readonly family: 'skillCast'; readonly action: SkillCastActionSource };

/**
 * 单一公共分派入口。遇到尚未迁移的原生 Action 必须携带路径失败，不能由领域层各自猜测。
 */
export function parseKnownNativeActionLeafSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): KnownNativeActionLeafSource {
  const result = tryParseKnownNativeActionLeafSource(value, path, inheritedBlackboard);
  if (result) return result;
  const action = requireRecord(value, path);
  const name = nativeActionName(requireNonEmptyString(action.$type, `${path}.$type`));
  throw new Error(`${path}.$type: unsupported native action ${JSON.stringify(name)}`);
}

/**
 * 引用闭包等宽读取器使用的公共尝试入口。只有类型不属于已迁移集合时返回 null；
 * 已知类型的字段漂移仍由对应严格 parser 抛错，不能伪装成未跟踪动作。
 */
export function tryParseKnownNativeActionLeafSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
  scope: KnownNativeActionParseScope = 'all',
): KnownNativeActionLeafSource | null {
  const action = requireRecord(value, path);
  const typeName = requireNonEmptyString(action.$type, `${path}.$type`);
  const name = nativeActionName(typeName);
  if (scope === 'referenceClosure' && !REFERENCE_CLOSURE_ACTION_NAMES.has(name)) return null;
  if (CONDITION_ACTION_NAMES.has(name)) {
    return {
      family: 'condition',
      action: parseConditionLeafSource(value, path, inheritedBlackboard),
    };
  }
  switch (name) {
    case 'SimpleCalcBBAction':
      return {
        family: 'blackboardCalculation',
        action: parseBlackboardCalculationActionSource(value, path, inheritedBlackboard),
      };
    case 'ModifyDynamicBlackboard':
      return {
        family: 'blackboardMutation',
        action: parseBlackboardMutationActionSource(value, path, inheritedBlackboard),
      };
    case 'RandomAction':
      return {
        family: 'randomBlackboard',
        action: parseRandomBlackboardActionSource(value, path, inheritedBlackboard),
      };
    case 'StoreAttributeValue':
      return {
        family: 'attributeSnapshot',
        action: parseAttributeSnapshotActionSource(value, path, inheritedBlackboard),
      };
    case 'FindTargetAction':
    case 'ContinuousFindTargetAction':
    case 'MergeTargetAction':
    case 'PickTargetAction': {
      const targetGroup = parseTargetGroupActionSource(value, path);
      if (!targetGroup) throw new Error(`${path}: failed to parse target group action ${name}`);
      return { family: 'targetGroup', action: targetGroup };
    }
    case 'ObtainCostAction':
      return {
        family: 'resource',
        action: parseResourceGainActionSource(value, path, inheritedBlackboard),
      };
    case 'CreateTimedMarker':
      return {
        family: 'timedMarker',
        action: parseTimedMarkerApplicationSource(value, path, inheritedBlackboard),
      };
    case 'AddGlobalCDTimer':
      return {
        family: 'globalCooldown',
        action: parseGlobalCooldownApplicationSource(value, path, inheritedBlackboard),
      };
    case 'CreateBuffAction':
      return {
        family: 'buffApplication',
        action: parseBuffApplicationActionSource(value, path, inheritedBlackboard),
      };
    case 'FinishBuffAction':
      return {
        family: 'buffFinish',
        action: parseLegacyBuffFinishActionSource(value, path, inheritedBlackboard),
      };
    case 'FinishBuffAdvanced':
      return {
        family: 'buffFinish',
        action: parseAdvancedBuffFinishActionSource(value, path, inheritedBlackboard),
      };
    case 'SaveBuffStackNumAdvanced':
      return {
        family: 'buffQuery',
        action: parseBuffStackReadActionSource(value, path),
      };
    case 'HealAction':
      return { family: 'heal', action: parseHealActionSource(value, path, inheritedBlackboard) };
    case 'FinishOwnerAction':
      return { family: 'lifecycle', action: parseFinishOwnerActionSource(value, path) };
    case 'TimeDilationAction':
      return {
        family: 'timeDilation',
        action: parseTimeDilationActionSource(value, path, inheritedBlackboard),
      };
    case 'UltimateTimeAction':
      return { family: 'timeDilation', action: parseUltimateTimeActionSource(value, path) };
    case 'DamageAction':
      return {
        family: 'damage',
        action: parseDamageActionSource(value, path, inheritedBlackboard),
      };
    case 'PlaySoundAction':
      return { family: 'presentation', action: parsePlaySoundActionSource(value, path) };
    case 'LaunchProjectile':
      return { family: 'projectile', action: parseProjectileLaunchActionSource(value, path) };
    case 'SpawnAbilityEntity':
      return {
        family: 'abilityEntity',
        action: parseAbilityEntitySpawnActionSource(value, path, inheritedBlackboard),
      };
    case 'CastSkill':
      return { family: 'skillCast', action: parseSkillCastActionSource(value, path) };
    default:
      return null;
  }
}

export function parseKnownNativeActionSequenceSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeSequenceSource<KnownNativeActionLeafSource> {
  return parseNativeSequenceSource(value, path, inheritedBlackboard, (leaf, leafPath) =>
    parseKnownNativeActionLeafSource(leaf, leafPath, inheritedBlackboard),
  );
}
