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
  parseBuffInheritanceActionSource,
  parseLegacyBuffFinishActionSource,
  type BuffApplicationActionSource,
  type BuffInheritanceActionSource,
  type BuffFinishActionSource,
} from './buffActions.ts';
import {
  parseBuffBlackboardReadActionSource,
  parseBuffLifeTimeReadActionSource,
  parseBuffDurationMutationActionSource,
  parseBuffStackReadActionSource,
  parseStoreBuffCountActionSource,
  type BuffBlackboardReadActionSource,
  type BuffLifeTimeReadActionSource,
  type BuffDurationMutationActionSource,
  type BuffStackReadActionSource,
} from './buffQueryActions.ts';
import { parseConditionLeafSource, type NativeConditionSource } from './condition.ts';
import {
  parseCharacterTypeIdReadActionSource,
  type CharacterTypeIdReadActionSource,
} from './characterIdentityActions.ts';
import { parseNativeSequenceSource, type NativeSequenceSource } from './controlFlow.ts';
import {
  parseChannelingCastingActionSource,
  type ChannelingCastingActionSource,
} from './castingControlActions.ts';
import {
  parseCreateGlobalBuffActionSource,
  parseFinishGlobalBuffActionSource,
  type GlobalBuffActionSource,
} from './globalBuffActions.ts';
import {
  parseSkillSettingReadActionSource,
  type SkillSettingReadActionSource,
} from './skillSettingActions.ts';
import { parseDamageActionSource, type DamageActionSource } from './damageActions.ts';
import { parseHealActionSource, type HealActionSource } from './healActions.ts';
import {
  parseBreakInteractiveActionSource,
  type BreakInteractiveActionSource,
} from './environmentActions.ts';
import {
  parseElementalInflictionActionSource,
  parseForcedElementalStatusActionSource,
  parseSpellAbnormalLifecycleEventSource,
  parseSpellInflictionStartedEventSource,
  parseTriggerSpellBurstEventSource,
  parseForceTriggerWeaknessEventSource,
  type ElementalInflictionActionSource,
  type ForcedElementalStatusActionSource,
  type SpellAbnormalLifecycleEventSource,
  type SpellInflictionStartedEventSource,
  type TriggerSpellBurstEventSource,
  type ForceTriggerWeaknessEventSource,
} from './elementalInflictionActions.ts';
import { parseFinishOwnerActionSource, type FinishOwnerActionSource } from './lifecycleActions.ts';
import {
  nativeActionName,
  requireArray,
  requireExactFields,
  requireInteger,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import {
  parseDebugPrintActionSource,
  parseCameraPresentationActionSource,
  parseCameraRotateActionSource,
  parseAnimatedCameraActionSource,
  parseHideUiActionSource,
  parseLockCameraAimActionSource,
  parseUltimateShowActionSource,
  parseWeaponVisibilityActionSource,
  parseWeaponAnimationActionSource,
  parseSetAnimatorParameterActionSource,
  parseIgniteBuffTextActionSource,
  parseModifyWeaponMountPointActionSource,
  parseVoiceTriggerActionSource,
  parseOverrideCameraFollowActionSource,
  parseTemporaryUnlockActionSource,
  parseEffectActionSource,
  parseShowHideActorActionSource,
  parsePlayAnimationActionSource,
  parsePlayAnimationWithStepActionSource,
  parsePlaySoundActionSource,
  type DebugPrintActionSource,
  type CameraPresentationActionSource,
  type EffectActionSource,
  type PlayAnimationActionSource,
  type PlaySoundActionSource,
} from './presentationActions.ts';
import { parseInterruptActionSource, type InterruptActionSource } from './interruptAction.ts';
import { parseVulnerableActionSource, type KeywordBuffActionSource } from './keywordActions.ts';
import {
  parseEnemyHurtAnimationActionSource,
  parseBlowOffEnemyActionSource,
  parsePullActionSource,
  parsePushBackActionSource,
  parseTargetHitStopActionSource,
  type StumpControlActionSource,
} from './stumpControlActions.ts';
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
  parseFinisherSpGainActionSource,
  parseResourceGainActionSource,
  parseTimedMarkerApplicationSource,
  parseSkillCooldownMutationActionSource,
  type GlobalCooldownApplicationSource,
  type FinisherSpGainActionSource,
  type ResourceGainActionSource,
  type TimedMarkerApplicationSource,
  type SkillCooldownMutationActionSource,
} from './resourceActions.ts';
import type { BlackboardLevelValues } from './scalar.ts';
import {
  parseAuraReferenceActionSource,
  parseGlobalPartyAuraActionSource,
  type AuraReferenceActionSource,
  type GlobalPartyAuraActionSource,
} from './auraActions.ts';
import {
  parseTimeDilationActionSource,
  parseUltimateTimeActionSource,
  type TimeDilationActionSource,
  type UltimateTimeActionSource,
} from './timeDilationActions.ts';
import { parseTargetGroupActionSource, type TargetGroupActionSource } from './targetGroup.ts';
import {
  parseAllowNextSkillActionSource,
  parseComboCacheActionSource,
  type AllowNextSkillActionSource,
  type ComboCacheActionSource,
} from './inputControlActions.ts';
import {
  parseSetSuperArmorActionSource,
  type SetSuperArmorActionSource,
} from './selfDefenseActions.ts';
import {
  parseCurveEvaluateFloatActionSource,
  parseSaveTwoDirectionAngleActionSource,
  type PresentationCalculationActionSource,
} from './presentationCalculationActions.ts';
import {
  parseSelfRotateActionSource,
  parseTeleportActionSource,
  parseDisableRootMotionActionSource,
  parseTeleportPositionSelectionActionSource,
  parseReceiveMoveInputActionSource,
  parseMoveToActionSource,
  parseCustomRootMotionActionSource,
  parseSnapToTargetWithRangeActionSource,
  parseSaveTargetDistanceActionSource,
  type CustomRootMotionActionSource,
  type DisableRootMotionActionSource,
  type SnapToTargetWithRangeActionSource,
  type TeleportPositionSelectionActionSource,
  type SaveTargetDistanceActionSource,
  type MoveToActionSource,
  type ReceiveMoveInputActionSource,
  type SelfRotateActionSource,
  type TeleportActionSource,
} from './spatialActions.ts';
import {
  parseRefrainUltimateEnergyRecoveryActionSource,
  parseSwitchModeActionSource,
  type RefrainUltimateEnergyRecoveryActionSource,
  type SwitchModeActionSource,
} from './modeAndResourcePolicyActions.ts';

const CONDITION_ACTION_NAMES = new Set([
  'OrConditionAction',
  'CompareFloat',
  'CompareString',
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
  'CheckSkillId',
  'CheckOriginSkillType',
  'CheckObtainAtbType',
  'CheckTargetsEqual',
  'CheckTargetContains',
  'CheckObjectTypeMatch',
  'CheckDamageType',
  'CheckDamageTypeMask',
  'CheckSpellInflictionType',
  'CheckPhysicalInflictionType',
  'CompareDeckAttr',
  'CheckAbilityEntityCurDuration',
  'CheckDamageDecorateMask',
  'CheckHealTag',
  'CheckOverHeal',
  'CheckBuffIdInContext',
  'CheckBuffIdInContextAdvanced',
  'CheckConsumeBuffLayer',
  'CheckGlobalCDTimerAction',
  'CheckSkillHasHit',
  'CheckSkillCastId',
  'CheckEnemyRank',
  'CheckSuperArmor',
  'CheckTwoDirectionAngle',
  'CheckTargetAngle',
  'CheckPoiseValue',
  'CheckSquadInFight',
  'CheckComboSkillCameraAlphaSetting',
]);

/** 引用闭包需要严格读取的动作身份；集合与分派实现同属公共来源层，调用方不再复制 switch。 */
const REFERENCE_CLOSURE_ACTION_NAMES = new Set([
  'VulnerableAction',
  'CreateBuffAction',
  'CreateBuffAttachingSkill',
  'InheritBuffAction',
  'CreateGlobalBuffAction',
  'FinishGlobalBuffAction',
  'ReadSkillSettingData',
  'AuraAction',
  'FinishBuffAction',
  'FinishBuffAdvanced',
  'LaunchProjectile',
  'SpawnAbilityEntity',
  'CastSkill',
  'ForceSpellStatusAction',
]);

export type KnownNativeActionParseScope = 'all' | 'referenceClosure';

/** 已迁移到公共来源 IR 的 Action 叶子；领域适配器只能消费该公共并集。 */
export type KnownNativeActionLeafSource =
  | { readonly family: 'condition'; readonly action: NativeConditionSource }
  | { readonly family: 'blackboardCalculation'; readonly action: BlackboardCalculationActionSource }
  | { readonly family: 'blackboardMutation'; readonly action: BlackboardMutationActionSource }
  | { readonly family: 'randomBlackboard'; readonly action: RandomBlackboardActionSource }
  | { readonly family: 'attributeSnapshot'; readonly action: AttributeSnapshotActionSource }
  | { readonly family: 'characterIdentity'; readonly action: CharacterTypeIdReadActionSource }
  | { readonly family: 'targetGroup'; readonly action: TargetGroupActionSource }
  | {
      readonly family: 'presentationCalculation';
      readonly action: PresentationCalculationActionSource;
    }
  | {
      readonly family: 'spatial';
      readonly action:
        | SelfRotateActionSource
        | TeleportActionSource
        | ReceiveMoveInputActionSource
        | MoveToActionSource
        | DisableRootMotionActionSource
        | TeleportPositionSelectionActionSource
        | CustomRootMotionActionSource
        | SnapToTargetWithRangeActionSource;
    }
  | { readonly family: 'spatialMeasurement'; readonly action: SaveTargetDistanceActionSource }
  | { readonly family: 'resource'; readonly action: ResourceGainActionSource }
  | { readonly family: 'finisherSpGain'; readonly action: FinisherSpGainActionSource }
  | {
      readonly family: 'inputControl';
      readonly action: ComboCacheActionSource | AllowNextSkillActionSource;
    }
  | { readonly family: 'castingControl'; readonly action: ChannelingCastingActionSource }
  | { readonly family: 'globalBuff'; readonly action: GlobalBuffActionSource }
  | { readonly family: 'skillSetting'; readonly action: SkillSettingReadActionSource }
  | { readonly family: 'selfDefense'; readonly action: SetSuperArmorActionSource }
  | { readonly family: 'timedMarker'; readonly action: TimedMarkerApplicationSource }
  | { readonly family: 'globalCooldown'; readonly action: GlobalCooldownApplicationSource }
  | { readonly family: 'skillCooldownMutation'; readonly action: SkillCooldownMutationActionSource }
  | { readonly family: 'buffApplication'; readonly action: BuffApplicationActionSource }
  | { readonly family: 'buffInheritance'; readonly action: BuffInheritanceActionSource }
  | {
      readonly family: 'aura';
      readonly action: GlobalPartyAuraActionSource | AuraReferenceActionSource;
    }
  | { readonly family: 'skillAffix'; readonly action: { readonly kind: 'skillAffix' } }
  | { readonly family: 'buffFinish'; readonly action: BuffFinishActionSource }
  | { readonly family: 'buffQuery'; readonly action: BuffStackReadActionSource }
  | { readonly family: 'buffBlackboardRead'; readonly action: BuffBlackboardReadActionSource }
  | { readonly family: 'buffLifeTimeRead'; readonly action: BuffLifeTimeReadActionSource }
  | { readonly family: 'buffDurationMutation'; readonly action: BuffDurationMutationActionSource }
  | {
      readonly family: 'buffModifierRefresh';
      readonly action: { readonly kind: 'buffModifierRefresh' };
    }
  | { readonly family: 'heal'; readonly action: HealActionSource }
  | { readonly family: 'environment'; readonly action: BreakInteractiveActionSource }
  | { readonly family: 'elementalInfliction'; readonly action: ElementalInflictionActionSource }
  | { readonly family: 'forcedElementalStatus'; readonly action: ForcedElementalStatusActionSource }
  | { readonly family: 'spellBurstEvent'; readonly action: TriggerSpellBurstEventSource }
  | {
      readonly family: 'levelEvent';
      readonly action:
        | SpellAbnormalLifecycleEventSource
        | SpellInflictionStartedEventSource
        | ForceTriggerWeaknessEventSource;
    }
  | { readonly family: 'keywordBuff'; readonly action: KeywordBuffActionSource }
  | { readonly family: 'lifecycle'; readonly action: FinishOwnerActionSource }
  | {
      readonly family: 'timeDilation';
      readonly action: TimeDilationActionSource | UltimateTimeActionSource;
    }
  | { readonly family: 'damage'; readonly action: DamageActionSource }
  | {
      readonly family: 'presentation';
      readonly action:
        | PlaySoundActionSource
        | DebugPrintActionSource
        | EffectActionSource
        | PlayAnimationActionSource
        | CameraPresentationActionSource;
    }
  | { readonly family: 'interrupt'; readonly action: InterruptActionSource }
  | { readonly family: 'stumpControl'; readonly action: StumpControlActionSource }
  | { readonly family: 'projectile'; readonly action: ProjectileLaunchActionSource }
  | { readonly family: 'abilityEntity'; readonly action: AbilityEntitySpawnActionSource }
  | { readonly family: 'skillCast'; readonly action: SkillCastActionSource }
  | {
      readonly family: 'modeAndResourcePolicy';
      readonly action: SwitchModeActionSource | RefrainUltimateEnergyRecoveryActionSource;
    }
  | {
      readonly family: 'eventListener';
      readonly action: {
        readonly kind: 'eventListener';
        readonly events: readonly {
          readonly abilityEvent: string | number;
          readonly actions: readonly NativeSequenceSource<KnownNativeActionLeafSource>[];
        }[];
      };
    };

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
    case 'VulnerableAction':
      return {
        family: 'keywordBuff',
        action: parseVulnerableActionSource(value, path, inheritedBlackboard),
      };
    case 'PlayAnimationAction':
      return {
        family: 'presentation',
        action: parsePlayAnimationActionSource(value, path),
      };
    case 'ShowHideActorAction':
      return {
        family: 'presentation',
        action: parseShowHideActorActionSource(value, path),
      };
    case 'BreakInteractiveAction':
      return {
        family: 'environment',
        action: parseBreakInteractiveActionSource(value, path, inheritedBlackboard),
      };
    case 'SpellInfliction':
      return {
        family: 'elementalInfliction',
        action: parseElementalInflictionActionSource(value, path),
      };
    case 'ForceSpellStatusAction':
      return {
        family: 'forcedElementalStatus',
        action: parseForcedElementalStatusActionSource(value, path, inheritedBlackboard),
      };
    case 'TriggerSpellBurstEventAction':
      return {
        family: 'spellBurstEvent',
        action: parseTriggerSpellBurstEventSource(value, path),
      };
    case 'OnSpellAbnormalStartFinish':
      return {
        family: 'levelEvent',
        action: parseSpellAbnormalLifecycleEventSource(value, path),
      };
    case 'OnSpellInflictionStart':
      return {
        family: 'levelEvent',
        action: parseSpellInflictionStartedEventSource(value, path),
      };
    case 'ForceTriggerWeakness':
      return {
        family: 'levelEvent',
        action: parseForceTriggerWeaknessEventSource(value, path),
      };
    case 'PlayAnimationWithStep':
      return {
        family: 'presentation',
        action: parsePlayAnimationWithStepActionSource(value, path, inheritedBlackboard),
      };
    case 'SelfRotateAction':
      return {
        family: 'spatial',
        action: parseSelfRotateActionSource(value, path),
      };
    case 'TeleportAction':
      return {
        family: 'spatial',
        action: parseTeleportActionSource(value, path, inheritedBlackboard),
      };
    case 'DisableRootMotionAction':
      return {
        family: 'spatial',
        action: parseDisableRootMotionActionSource(value, path),
      };
    case 'TeleportPosSelectAction':
      return {
        family: 'spatial',
        action: parseTeleportPositionSelectionActionSource(value, path, inheritedBlackboard),
      };
    case 'ReceiveMoveInputAction':
      return {
        family: 'spatial',
        action: parseReceiveMoveInputActionSource(value, path, inheritedBlackboard),
      };
    case 'MoveToAction':
      return {
        family: 'spatial',
        action: parseMoveToActionSource(value, path, inheritedBlackboard),
      };
    case 'CustomRootMotionAction':
      return {
        family: 'spatial',
        action: parseCustomRootMotionActionSource(value, path, inheritedBlackboard),
      };
    case 'SnapToTargetWithRangeAction':
      return {
        family: 'spatial',
        action: parseSnapToTargetWithRangeActionSource(value, path, inheritedBlackboard),
      };
    case 'SaveTargetDistanceAction':
      return {
        family: 'spatialMeasurement',
        action: parseSaveTargetDistanceActionSource(value, path),
      };
    case 'SetSuperArmorAction':
      return {
        family: 'selfDefense',
        action: parseSetSuperArmorActionSource(value, path),
      };
    case 'ComboCacheAction':
      return {
        family: 'inputControl',
        action: parseComboCacheActionSource(value, path, inheritedBlackboard),
      };
    case 'AllowNextSkillAction':
      return {
        family: 'inputControl',
        action: parseAllowNextSkillActionSource(value, path),
      };
    case 'CharWeaponVisibleAction':
      return {
        family: 'presentation',
        action: parseWeaponVisibilityActionSource(value, path),
      };
    case 'CharWeaponAnimationAction':
      return {
        family: 'presentation',
        action: parseWeaponAnimationActionSource(value, path),
      };
    case 'SetAnimatorParamAction':
      return {
        family: 'presentation',
        action: parseSetAnimatorParameterActionSource(value, path),
      };
    case 'IgniteBuffTextAction':
      return {
        family: 'presentation',
        action: parseIgniteBuffTextActionSource(value, path),
      };
    case 'ModifyWeaponMountPoint':
      return {
        family: 'presentation',
        action: parseModifyWeaponMountPointActionSource(value, path),
      };
    case 'VoiceTriggerAction':
      return {
        family: 'presentation',
        action: parseVoiceTriggerActionSource(value, path),
      };
    case 'SaveTwoDirectionAngle':
      return {
        family: 'presentationCalculation',
        action: parseSaveTwoDirectionAngleActionSource(value, path),
      };
    case 'CurveEvaluateFloat':
      return {
        family: 'presentationCalculation',
        action: parseCurveEvaluateFloatActionSource(value, path, inheritedBlackboard),
      };
    case 'CameraRotateAction':
      return {
        family: 'presentation',
        action: parseCameraRotateActionSource(value, path, inheritedBlackboard),
      };
    case 'AnimatedCameraAction':
      return {
        family: 'presentation',
        action: parseAnimatedCameraActionSource(value, path),
      };
    case 'HideUIAction':
      return {
        family: 'presentation',
        action: parseHideUiActionSource(value, path),
      };
    case 'UltimateShowAction':
      return {
        family: 'presentation',
        action: parseUltimateShowActionSource(value, path),
      };
    case 'LockCameraAimAction':
      return {
        family: 'presentation',
        action: parseLockCameraAimActionSource(value, path, inheritedBlackboard),
      };
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
    case 'SaveCharTypeId':
      return {
        family: 'characterIdentity',
        action: parseCharacterTypeIdReadActionSource(value, path),
      };
    case 'FindTargetAction':
    case 'ContinuousFindTargetAction':
    case 'MergeTargetAction':
    case 'PickTargetAction':
    case 'ConvertToTargetContext': {
      const targetGroup = parseTargetGroupActionSource(value, path);
      if (!targetGroup) throw new Error(`${path}: failed to parse target group action ${name}`);
      return { family: 'targetGroup', action: targetGroup };
    }
    case 'ObtainCostAction':
      return {
        family: 'resource',
        action: parseResourceGainActionSource(value, path, inheritedBlackboard),
      };
    case 'SwitchModeAction':
      return {
        family: 'modeAndResourcePolicy',
        action: parseSwitchModeActionSource(value, path),
      };
    case 'RefrainObtainUsp':
      return {
        family: 'modeAndResourcePolicy',
        action: parseRefrainUltimateEnergyRecoveryActionSource(value, path),
      };
    case 'RefreshBuffAttrModifierValue':
      requireExactFields(
        action,
        new Set(['$type', 'isEnable', 'priorityLevel', 'priorityOffset', 'serverActionIndex']),
        path,
      );
      return { family: 'buffModifierRefresh', action: { kind: 'buffModifierRefresh' } };
    case 'EventListenerAction': {
      requireExactFields(
        action,
        new Set([
          '$type',
          'isEnable',
          'priorityLevel',
          'priorityOffset',
          'serverActionIndex',
          'abilityActionMap',
        ]),
        path,
      );
      const events = requireArray(action.abilityActionMap, `${path}.abilityActionMap`).map(
        (rawEvent, eventIndex) => {
          const eventPath = `${path}.abilityActionMap[${eventIndex}]`;
          const event = requireRecord(rawEvent, eventPath);
          requireExactFields(event, new Set(['abilityEvent', 'actions']), eventPath);
          const abilityEvent =
            typeof event.abilityEvent === 'string'
              ? requireNonEmptyString(event.abilityEvent, `${eventPath}.abilityEvent`)
              : requireInteger(event.abilityEvent, `${eventPath}.abilityEvent`);
          return {
            abilityEvent,
            actions: requireArray(event.actions, `${eventPath}.actions`).map(
              (sequence, sequenceIndex) =>
                parseNativeSequenceSource(
                  sequence,
                  `${eventPath}.actions[${sequenceIndex}]`,
                  inheritedBlackboard,
                  (leaf, leafPath) =>
                    parseKnownNativeActionLeafSource(leaf, leafPath, inheritedBlackboard),
                ),
            ),
          };
        },
      );
      return { family: 'eventListener', action: { kind: 'eventListener', events } };
    }
    case 'GainBreakingAttackAtb':
      return {
        family: 'finisherSpGain',
        action: parseFinisherSpGainActionSource(value, path, inheritedBlackboard),
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
    case 'SetSkillCdAtOnce':
      return {
        family: 'skillCooldownMutation',
        action: parseSkillCooldownMutationActionSource(value, path, inheritedBlackboard),
      };
    case 'CreateBuffAction':
      return {
        family: 'buffApplication',
        action: parseBuffApplicationActionSource(value, path, inheritedBlackboard),
      };
    case 'CreateBuffAttachingSkill':
      return {
        family: 'buffApplication',
        action: parseBuffApplicationActionSource(
          value,
          path,
          inheritedBlackboard,
          'currentCastSkill',
        ),
      };
    case 'InheritBuffAction':
      return {
        family: 'buffInheritance',
        action: parseBuffInheritanceActionSource(value, path),
      };
    case 'AuraAction':
      return {
        family: 'aura',
        action:
          scope === 'referenceClosure'
            ? parseAuraReferenceActionSource(value, path)
            : parseGlobalPartyAuraActionSource(value, path),
      };
    case 'SkillAffixAction':
      requireExactFields(
        action,
        new Set(['$type', 'isEnable', 'priorityLevel', 'priorityOffset', 'serverActionIndex']),
        path,
      );
      return { family: 'skillAffix', action: { kind: 'skillAffix' } };
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
    case 'StoreBuffCount':
      return {
        family: 'buffQuery',
        action: parseStoreBuffCountActionSource(value, path),
      };
    case 'GetTargetBuffBBAdvanced':
      return {
        family: 'buffBlackboardRead',
        action: parseBuffBlackboardReadActionSource(value, path),
      };
    case 'SaveBuffLifeTime':
      return {
        family: 'buffLifeTimeRead',
        action: parseBuffLifeTimeReadActionSource(value, path),
      };
    case 'SetBuffDurationAction':
      return {
        family: 'buffDurationMutation',
        action: parseBuffDurationMutationActionSource(value, path, inheritedBlackboard),
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
    case 'DebugPrintAction':
      return { family: 'presentation', action: parseDebugPrintActionSource(value, path) };
    case 'EffectAction':
      return { family: 'presentation', action: parseEffectActionSource(value, path) };
    case 'InterruptAction':
      return { family: 'interrupt', action: parseInterruptActionSource(value, path) };
    case 'EnemyHurtAnimAction':
      return { family: 'stumpControl', action: parseEnemyHurtAnimationActionSource(value, path) };
    case 'PullAction':
      return { family: 'stumpControl', action: parsePullActionSource(value, path) };
    case 'HitStopAction':
      return { family: 'stumpControl', action: parseTargetHitStopActionSource(value, path) };
    case 'CameraImpulseAction':
      return {
        family: 'presentation',
        action: parseCameraPresentationActionSource(value, path, 'cameraImpulse'),
      };
    case 'PushBackAction':
      return {
        family: 'stumpControl',
        action: parsePushBackActionSource(value, path, inheritedBlackboard),
      };
    case 'BlowOffEnemyAction':
      return {
        family: 'stumpControl',
        action: parseBlowOffEnemyActionSource(value, path, inheritedBlackboard),
      };
    case 'ChannelingCastingAction':
      return {
        family: 'castingControl',
        action: parseChannelingCastingActionSource(value, path, inheritedBlackboard),
      };
    case 'CreateGlobalBuffAction':
      return {
        family: 'globalBuff',
        action: parseCreateGlobalBuffActionSource(value, path, inheritedBlackboard),
      };
    case 'FinishGlobalBuffAction':
      return {
        family: 'globalBuff',
        action: parseFinishGlobalBuffActionSource(value, path, inheritedBlackboard),
      };
    case 'ReadSkillSettingData':
      return {
        family: 'skillSetting',
        action: parseSkillSettingReadActionSource(value, path, inheritedBlackboard),
      };
    case 'AddCameraControlStateAction':
      return {
        family: 'presentation',
        action: parseCameraPresentationActionSource(value, path, 'cameraControlState'),
      };
    case 'AddDynamicCcsAction':
      return {
        family: 'presentation',
        action: parseCameraPresentationActionSource(value, path, 'dynamicCameraControlState'),
      };
    case 'OverrideCameraFollowAction':
      return {
        family: 'presentation',
        action: parseOverrideCameraFollowActionSource(value, path, inheritedBlackboard),
      };
    case 'TemporaryUnlockAction':
      return {
        family: 'presentation',
        action: parseTemporaryUnlockActionSource(value, path),
      };
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
