import {
  parseGameplayAttributeModifierSource,
  type GameplayAttributeModifierSource,
} from './attributeModifiers.ts';
import { numericDeclaredBlackboard } from './blackboard.ts';
import {
  parseKnownNativeBuffActionGraphSource,
  type BuffActionGraphSource,
} from './buffActionGraph.ts';
import type { KnownNativeActionLeafSource } from './actionLeaf.ts';
import { parseKnownNativeActionLeafSource } from './actionLeaf.ts';
import { parseDamageProcessors, type DamageProcessorSource } from './damageActions.ts';
import { parseNativeSequenceSource, type NativeSequenceSource } from './controlFlow.ts';
import {
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

export const BUFF_STACKING_TYPES = [
  'Unlimited',
  'HighPriority',
  'Stack',
  'Enhance',
  'Refresh',
  'Extend',
  'Modify',
  'Unique',
  'EnhanceAndRefresh',
  'OverwriteDuration',
  'EnhanceAndOverwriteDuration',
  'HighPriorityWithMaxStack',
] as const;
export type BuffStackingTypeSource = (typeof BUFF_STACKING_TYPES)[number];

export interface BuffPresentationSource {
  readonly hasIcon: boolean;
  readonly spritePath: string;
  readonly showInHeadBarCommon: boolean;
  readonly showInHeadBarAttached: boolean;
  readonly showInSquadIcon: boolean;
  readonly onlyShowForMainCharacter: boolean;
  readonly iconStyleInSquad: string;
  readonly abnormalColorType: string;
  readonly orderUseDirectoryValue: boolean;
  readonly orderPriorityValue: number;
  readonly orderPriorityEnum: string;
}

export interface BuffLifecycleSource {
  readonly lifeType: 'Limited' | 'Infinity';
  readonly duration: ScalarSource;
  readonly triggerInterval: ScalarSource;
  readonly waitFirstTriggerInterval: boolean;
  readonly maxTriggerCount: ScalarSource;
  readonly stackingIdentifierType: 'Id' | 'StackingKey';
  readonly stackingType: BuffStackingTypeSource;
  readonly stackingKey: string;
  readonly priority: ScalarSource;
  readonly negatePriority: boolean;
  readonly maxStackCount: ScalarSource;
  readonly needsStackEffect: boolean;
  readonly stackEffectCount: number;
  /** 原生 stackingSettings.stackEffects 的类型化表现槽；当前导出结构只允许 EffectAction。 */
  readonly stackEffectActionTypes: readonly 'EffectAction'[];
}

export interface UnsupportedBuffPayloadSource {
  readonly field: string;
  readonly entryCount: number;
}

export interface BuffDamageModifierSource {
  readonly enabledSide: string;
  readonly condition: NativeSequenceSource<KnownNativeActionLeafSource>;
  readonly processors: readonly DamageProcessorSource[];
}

/**
 * BuffData 的公共、可审计运行时切片。根字段先由动作图读取器做精确校验；这里再保留生命
 * 周期、图标、标签和属性修正，并把尚未结构化的非空载荷显式列出。
 */
export interface BuffRuntimeSource {
  readonly graph: BuffActionGraphSource<KnownNativeActionLeafSource>;
  readonly presentation: BuffPresentationSource;
  readonly lifecycle: BuffLifecycleSource;
  readonly attributeModifiers: GameplayAttributeModifierSource;
  readonly damageModifiers: readonly BuffDamageModifierSource[];
  readonly applyTagIds: readonly number[];
  readonly extendTagIds: readonly number[];
  readonly unsupportedPayloads: readonly UnsupportedBuffPayloadSource[];
}

export function parseBuffRuntimeSource(
  value: unknown,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues = {},
): BuffRuntimeSource {
  const root = requireRecord(value, sourcePath);
  // The reference parser owns the version-sensitive root field list. Parse once to discover the
  // local declarations, then parse executable leaves with local fixed defaults available.
  const declarationGraph = parseKnownNativeBuffActionGraphSource(
    value,
    sourcePath,
    inheritedBlackboard,
  );
  const localBlackboard = {
    ...inheritedBlackboard,
    ...numericDeclaredBlackboard(declarationGraph.declaredBlackboard, true),
  };
  const graph = parseKnownNativeBuffActionGraphSource(value, sourcePath, localBlackboard);

  validatePassiveFlags(root, sourcePath, localBlackboard);
  const unsupportedPayloads = [
    ...unsupportedArray(root, sourcePath, 'healModifier'),
    ...unsupportedArray(root, sourcePath, 'poiseModifier'),
    ...unsupportedArray(root, sourcePath, 'globalModifier'),
    ...unsupportedArray(root, sourcePath, 'shieldConfigs'),
  ];

  const stacking = requireRecord(root.stackingSettings, `${sourcePath}.stackingSettings`);
  requireExactFields(
    stacking,
    new Set([
      'identifierType',
      'stackingType',
      'stackingKey',
      'usePriorityKey',
      'priorityKey',
      'negatePriority',
      'priority',
      'useMaxStackCntKey',
      'maxStackCntKey',
      'maxStackCnt',
      'isNeedStackEffect',
      'stackEffects',
    ]),
    `${sourcePath}.stackingSettings`,
  );
  const stackEffects = parsePresentationStackEffects(
    stacking.stackEffects,
    `${sourcePath}.stackingSettings.stackEffects`,
  );

  return {
    graph,
    presentation: parsePresentation(root, sourcePath),
    lifecycle: {
      lifeType: requireOneOf(root.lifeType, ['Limited', 'Infinity'], `${sourcePath}.lifeType`),
      duration: parseScalarSource(root.duration, `${sourcePath}.duration`, localBlackboard),
      triggerInterval: parseScalarSource(
        root.triggerInterval,
        `${sourcePath}.triggerInterval`,
        localBlackboard,
      ),
      waitFirstTriggerInterval: requireBoolean(
        root.waitFirstTriggerInterval,
        `${sourcePath}.waitFirstTriggerInterval`,
      ),
      maxTriggerCount: parseScalarSource(
        root.maxTriggerCnt,
        `${sourcePath}.maxTriggerCnt`,
        localBlackboard,
      ),
      stackingIdentifierType: requireOneOf(
        stacking.identifierType,
        ['Id', 'StackingKey'],
        `${sourcePath}.stackingSettings.identifierType`,
      ),
      stackingType: requireOneOf(
        stacking.stackingType,
        BUFF_STACKING_TYPES,
        `${sourcePath}.stackingSettings.stackingType`,
      ),
      stackingKey: requireString(
        stacking.stackingKey,
        `${sourcePath}.stackingSettings.stackingKey`,
      ),
      priority: scalarFromToggle(
        stacking.usePriorityKey,
        stacking.priorityKey,
        stacking.priority,
        `${sourcePath}.stackingSettings.priority`,
        localBlackboard,
      ),
      negatePriority: requireBoolean(
        stacking.negatePriority,
        `${sourcePath}.stackingSettings.negatePriority`,
      ),
      maxStackCount: scalarFromToggle(
        stacking.useMaxStackCntKey,
        stacking.maxStackCntKey,
        stacking.maxStackCnt,
        `${sourcePath}.stackingSettings.maxStackCnt`,
        localBlackboard,
      ),
      needsStackEffect: requireBoolean(
        stacking.isNeedStackEffect,
        `${sourcePath}.stackingSettings.isNeedStackEffect`,
      ),
      stackEffectCount: stackEffects.length,
      stackEffectActionTypes: stackEffects.flatMap(effect => effect.actionTypes),
    },
    attributeModifiers: parseGameplayAttributeModifierSource(
      root.attributeModifier,
      `${sourcePath}.attributeModifier`,
      localBlackboard,
    ),
    damageModifiers: parseBuffDamageModifiers(
      root.damageModifier,
      `${sourcePath}.damageModifier`,
      localBlackboard,
    ),
    applyTagIds: parseTagIds(root.applyTags, `${sourcePath}.applyTags`),
    extendTagIds: parseTagIds(
      root.tagsAfterTriggerExtendBuffAction,
      `${sourcePath}.tagsAfterTriggerExtendBuffAction`,
    ),
    unsupportedPayloads,
  };
}

function parseBuffDamageModifiers(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): readonly BuffDamageModifierSource[] {
  return requireArray(value, path).map((raw, index) => {
    const itemPath = `${path}[${index}]`;
    const item = requireRecord(raw, itemPath);
    requireExactFields(item, new Set(['enableSide', 'condition', 'damageProcessors']), itemPath);
    return {
      enabledSide: requireNonEmptyString(item.enableSide, `${itemPath}.enableSide`),
      condition: parseNativeSequenceSource(
        item.condition,
        `${itemPath}.condition`,
        inheritedBlackboard,
        (leaf, leafPath) => parseKnownNativeActionLeafSource(leaf, leafPath, inheritedBlackboard),
      ),
      processors: parseDamageProcessors(
        item.damageProcessors,
        `${itemPath}.damageProcessors`,
        inheritedBlackboard,
      ),
    };
  });
}

function parsePresentation(
  root: Record<string, unknown>,
  sourcePath: string,
): BuffPresentationSource {
  const icon = requireRecord(root.iconConfig, `${sourcePath}.iconConfig`);
  requireExactFields(
    icon,
    new Set([
      '_spritePath',
      'showInHeadBarCommon',
      'showInHeadBarAttached',
      'showInSquadIcon',
      'onlyShowForMainCharacter',
      'blinkInMainCharHpBar',
      'showProgressInHpBar',
      'showProgressInNormalSkillButton',
      'useWeakProgressInNormalSkillButton',
      'showProgressInUltimateSkillButton',
      'forceRaiseIconEvent',
      'iconStyleInSquad',
      'abnormalColorType',
      '_orderPriorityConfig',
      'showWarningBackground',
      'playStrongInAnimation',
      'hasCharHpBarVfxType',
      'charHpBarVfxType',
    ]),
    `${sourcePath}.iconConfig`,
  );
  const order = requireRecord(
    icon._orderPriorityConfig,
    `${sourcePath}.iconConfig._orderPriorityConfig`,
  );
  requireExactFields(
    order,
    new Set(['useDirectoryValue', 'priorityValue', 'priorityEnum']),
    `${sourcePath}.iconConfig._orderPriorityConfig`,
  );
  // Read currently non-projected flags as well: a type drift or malformed value still fails here.
  for (const field of [
    'blinkInMainCharHpBar',
    'showProgressInHpBar',
    'showProgressInNormalSkillButton',
    'useWeakProgressInNormalSkillButton',
    'showProgressInUltimateSkillButton',
    'forceRaiseIconEvent',
    'showWarningBackground',
    'playStrongInAnimation',
    'hasCharHpBarVfxType',
  ])
    requireBoolean(icon[field], `${sourcePath}.iconConfig.${field}`);
  requireNonEmptyString(icon.charHpBarVfxType, `${sourcePath}.iconConfig.charHpBarVfxType`);
  return {
    hasIcon: requireBoolean(root.hasIcon, `${sourcePath}.hasIcon`),
    spritePath: requireString(icon._spritePath, `${sourcePath}.iconConfig._spritePath`),
    showInHeadBarCommon: requireBoolean(
      icon.showInHeadBarCommon,
      `${sourcePath}.iconConfig.showInHeadBarCommon`,
    ),
    showInHeadBarAttached: requireBoolean(
      icon.showInHeadBarAttached,
      `${sourcePath}.iconConfig.showInHeadBarAttached`,
    ),
    showInSquadIcon: requireBoolean(
      icon.showInSquadIcon,
      `${sourcePath}.iconConfig.showInSquadIcon`,
    ),
    onlyShowForMainCharacter: requireBoolean(
      icon.onlyShowForMainCharacter,
      `${sourcePath}.iconConfig.onlyShowForMainCharacter`,
    ),
    iconStyleInSquad: requireNonEmptyString(
      icon.iconStyleInSquad,
      `${sourcePath}.iconConfig.iconStyleInSquad`,
    ),
    abnormalColorType: requireNonEmptyString(
      icon.abnormalColorType,
      `${sourcePath}.iconConfig.abnormalColorType`,
    ),
    orderUseDirectoryValue: requireBoolean(
      order.useDirectoryValue,
      `${sourcePath}.iconConfig._orderPriorityConfig.useDirectoryValue`,
    ),
    orderPriorityValue: requireNumber(
      order.priorityValue,
      `${sourcePath}.iconConfig._orderPriorityConfig.priorityValue`,
    ),
    orderPriorityEnum: requireNonEmptyString(
      order.priorityEnum,
      `${sourcePath}.iconConfig._orderPriorityConfig.priorityEnum`,
    ),
  };
}

function validatePassiveFlags(
  root: Record<string, unknown>,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
): void {
  for (const field of [
    'ignoreTagImmune',
    'finishOnRepatriate',
    'hasAddingCooldown',
    'ignoreCooldownWhenAdding',
  ]) {
    requireBoolean(root[field], `${sourcePath}.${field}`);
  }
  parseScalarSource(root.addingCooldown, `${sourcePath}.addingCooldown`, inheritedBlackboard);
  const dispel = requireRecord(root.dispelConfig, `${sourcePath}.dispelConfig`);
  requireExactFields(
    dispel,
    new Set(['canBeDispelled', 'dispelledLevel']),
    `${sourcePath}.dispelConfig`,
  );
  requireBoolean(dispel.canBeDispelled, `${sourcePath}.dispelConfig.canBeDispelled`);
  requireNonEmptyString(dispel.dispelledLevel, `${sourcePath}.dispelConfig.dispelledLevel`);
}

function unsupportedArray(
  root: Record<string, unknown>,
  sourcePath: string,
  field: string,
): UnsupportedBuffPayloadSource[] {
  const count = requireArray(root[field], `${sourcePath}.${field}`).length;
  return count === 0 ? [] : [{ field, entryCount: count }];
}

interface PresentationStackEffectSource {
  readonly actionTypes: readonly 'EffectAction'[];
}

/**
 * stackEffects 不是任意动作并集：当前 1.4.4 导出把它序列化成专用 effectActions 槽。
 * 因此可以在不解释粒子参数的前提下证明它只承载表现；字段漂移会在这里失败。
 */
function parsePresentationStackEffects(
  value: unknown,
  path: string,
): PresentationStackEffectSource[] {
  return requireArray(value, path).map((rawEffect, effectIndex) => {
    const effectPath = `${path}[${effectIndex}]`;
    const effect = requireRecord(rawEffect, effectPath);
    requireExactFields(effect, new Set(['effectActions']), effectPath);
    const actions = requireArray(effect.effectActions, `${effectPath}.effectActions`);
    actions.forEach((rawAction, actionIndex) => {
      const actionPath = `${effectPath}.effectActions[${actionIndex}]`;
      const action = requireRecord(rawAction, actionPath);
      requireExactFields(
        action,
        new Set([
          'isEnable',
          'priorityLevel',
          'priorityOffset',
          'serverActionIndex',
          'targetSettings',
          'effectSource',
          'useGuardLodSourceOverride',
          'guardLodSource',
          'isMainCharacterActive',
          'isTargetMainCharacterActive',
          'isShowBigEffect',
          'bigEffectName',
          'playOnHittableObjects',
          'effectActionCfg',
          'forceMainBody',
          'saveEffectIdToBlackboard',
          'isCreateWithSourceModelActive',
        ]),
        actionPath,
      );
      requireBoolean(action.isEnable, `${actionPath}.isEnable`);
      requireNonEmptyString(action.priorityLevel, `${actionPath}.priorityLevel`);
      requireNumber(action.priorityOffset, `${actionPath}.priorityOffset`);
      requireInteger(action.serverActionIndex, `${actionPath}.serverActionIndex`);
      requireRecord(action.targetSettings, `${actionPath}.targetSettings`);
      requireRecord(action.effectSource, `${actionPath}.effectSource`);
      requireBoolean(action.useGuardLodSourceOverride, `${actionPath}.useGuardLodSourceOverride`);
      requireRecord(action.guardLodSource, `${actionPath}.guardLodSource`);
      for (const field of [
        'isMainCharacterActive',
        'isTargetMainCharacterActive',
        'isShowBigEffect',
        'playOnHittableObjects',
        'forceMainBody',
        'isCreateWithSourceModelActive',
      ]) {
        requireBoolean(action[field], `${actionPath}.${field}`);
      }
      requireString(action.bigEffectName, `${actionPath}.bigEffectName`);
      requireString(action.saveEffectIdToBlackboard, `${actionPath}.saveEffectIdToBlackboard`);
      requireRecord(action.effectActionCfg, `${actionPath}.effectActionCfg`);
    });
    return { actionTypes: actions.map(() => 'EffectAction' as const) };
  });
}

function parseTagIds(value: unknown, path: string): number[] {
  return requireArray(value, path).map((entry, index) => {
    const entryPath = `${path}[${index}]`;
    const tag = requireRecord(entry, entryPath);
    requireExactFields(tag, new Set(['tagId']), entryPath);
    return requireInteger(tag.tagId, `${entryPath}.tagId`);
  });
}

function scalarFromToggle(
  rawUseKey: unknown,
  rawKey: unknown,
  rawValue: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): ScalarSource {
  const useBlackboardKey = requireBoolean(rawUseKey, `${path}.useBlackboardKey`);
  const blackboardKey = requireString(rawKey, `${path}.blackboardKey`);
  const value = requireNumber(rawValue, `${path}.value`);
  return parseScalarSource({ useBlackboardKey, blackboardKey, value }, path, inheritedBlackboard);
}

function requireOneOf<const T extends readonly string[]>(
  value: unknown,
  options: T,
  path: string,
): T[number] {
  const name = requireNonEmptyString(value, path);
  if (!(options as readonly string[]).includes(name))
    throw new Error(`${path}: unsupported value ${JSON.stringify(name)}`);
  return name as T[number];
}
