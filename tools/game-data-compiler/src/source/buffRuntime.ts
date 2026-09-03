import {
  parseGameplayAttributeModifierEntrySource,
  parseGameplayAttributeModifierSource,
  parseAttributeTypeName,
  type GameplayAttributeModifierEntrySource,
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
  requireNativeActionPriority,
  requireNativeEnum,
  requireNonEmptyString,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import {
  parseIntegerScalarSource,
  parseScalarSource,
  type BlackboardLevelValues,
  type IntegerScalarSource,
  type ScalarSource,
} from './scalar.ts';

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
  'TimedGrowingEnhance',
] as const;
export type BuffStackingTypeSource = (typeof BUFF_STACKING_TYPES)[number];

export interface BuffPresentationSource {
  readonly hasIcon: boolean;
  readonly spritePath: string;
  readonly showInHeadBarCommon: boolean;
  readonly showInHeadBarAttached: boolean;
  /** Current VFS snapshots expose this flag; historical fixtures omit it. */
  readonly showDirectlyInHeadBuff?: boolean;
  readonly showInSquadIcon: boolean;
  readonly onlyShowForMainCharacter: boolean;
  readonly blinkInMainCharHpBar: boolean;
  readonly showProgressInHpBar: boolean;
  readonly showProgressInNormalSkillButton: boolean;
  readonly useWeakProgressInNormalSkillButton: boolean;
  readonly showProgressInUltimateSkillButton: boolean;
  readonly forceRaiseIconEvent: boolean;
  readonly showWarningBackground: boolean;
  readonly playStrongInAnimation: boolean;
  readonly hasCharHpBarVfxType: boolean;
  readonly charHpBarVfxType: string;
  readonly iconStyleInSquad: string;
  readonly abnormalColorType: string;
  readonly orderUseDirectoryValue: boolean;
  readonly orderPriorityValue: number;
  readonly orderPriorityEnum: string;
}

const BUFF_ICON_STYLES = [
  'Default',
  'Attached',
  'LifeTime',
  'NoLifeTime',
  'SpellAbnormal',
] as const;
const DAMAGE_TYPES = [
  'Physical',
  'Real',
  'Fire',
  'Pulse',
  'Cryst',
  'LifeDrain',
  'Natural',
  'Ether',
] as const;
const SPELL_INFLICTION_ON_CHAR_TYPES = ['Fire', 'Pulse', 'Cryst', 'Natural', 'Enum'] as const;
const DAMAGE_SCALE_SIDES = ['Attacker', 'Defender'] as const;

function parseDamageScaleSide(value: unknown, path: string): string {
  // Historical decoded snapshots named the heal-specific endpoints directly.
  if (value === 'Healer' || value === 'HealReceiver') return value;
  return requireNativeEnum(value, DAMAGE_SCALE_SIDES, path);
}
const BUFF_ORDER_PRIORITY_BY_VALUE = new Map([
  [100, 'CommonCharBuff'],
  [110, 'CommonCharDebuff'],
  [120, 'KeywordBuff'],
  [130, 'KeywordDebuff'],
  [150, 'AttachedAndAbnormal'],
  [180, 'AttentionBuff'],
  [200, 'AttentionDebuff'],
] as const);

export interface BuffLifecycleSource {
  readonly lifeType: 'Limited' | 'Infinity';
  readonly duration: ScalarSource;
  readonly triggerInterval: ScalarSource;
  readonly waitFirstTriggerInterval: boolean;
  readonly maxTriggerCount: ScalarSource;
  readonly addingCooldown: ScalarSource | null;
  readonly ignoreCooldownWhenAdding: boolean;
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

export interface BuffHealModifierSource {
  readonly enabledSide: string;
  readonly condition: NativeSequenceSource<KnownNativeActionLeafSource>;
  readonly processors: readonly (
    | {
        readonly kind: 'instantAttribute';
        readonly modifyTargetSide: string;
        readonly modifier: GameplayAttributeModifierEntrySource;
      }
    | {
        readonly kind: 'modifyCalculationResult';
        readonly baseMultiplier: ScalarSource;
        readonly multiplierCount: ScalarSource;
      }
  )[];
}

export interface BuffPoiseModifierSource {
  readonly enabledSide: string;
  readonly condition: NativeSequenceSource<KnownNativeActionLeafSource>;
  readonly processors: readonly {
    readonly kind: 'instantAttribute';
    readonly modifyTargetSide: string;
    readonly modifier: GameplayAttributeModifierEntrySource;
  }[];
}

export interface BuffShieldSource {
  readonly infinityValue: boolean;
  readonly value:
    | {
        readonly kind: 'definite';
        readonly value: ScalarSource;
        readonly applyScale: boolean;
        readonly valueScale: ScalarSource;
      }
    | {
        readonly kind: 'attribute';
        readonly valueSource: string;
        readonly attributeType: import('./attributeModifiers.ts').AttributeTypeSource;
        readonly multiplier: ScalarSource;
        readonly addition: ScalarSource;
      };
  readonly damageAbsorptions: readonly {
    readonly damageType: string;
    readonly ratio: ScalarSource;
    readonly scale: ScalarSource;
  }[];
  readonly absorbCount: IntegerScalarSource;
  readonly absorbAllDamageWhenConsumed: boolean;
  readonly removeBuffWhenConsumed: boolean;
  readonly priority: string;
  readonly replaceHitEffect: boolean;
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
  readonly healModifiers: readonly BuffHealModifierSource[];
  readonly poiseModifiers: readonly BuffPoiseModifierSource[];
  readonly shields: readonly BuffShieldSource[];
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

  const passiveSettings = parsePassiveSettings(root, sourcePath, localBlackboard);
  const unsupportedPayloads = [...unsupportedArray(root, sourcePath, 'globalModifier')];

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
  const stackingType = requireOneOf(
    stacking.stackingType,
    BUFF_STACKING_TYPES,
    `${sourcePath}.stackingSettings.stackingType`,
  );
  const stackingIdentifierType = requireOneOf(
    stacking.identifierType,
    ['Id', 'StackingKey'],
    `${sourcePath}.stackingSettings.identifierType`,
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
      addingCooldown: passiveSettings.addingCooldown,
      ignoreCooldownWhenAdding: passiveSettings.ignoreCooldownWhenAdding,
      stackingIdentifierType,
      stackingType,
      stackingKey: requireString(
        stacking.stackingKey,
        `${sourcePath}.stackingSettings.stackingKey`,
      ),
      priority: parseBuffPriorityScalar(
        stacking,
        stackingType,
        stackingIdentifierType,
        `${sourcePath}.stackingSettings.priority`,
        localBlackboard,
      ),
      negatePriority: requireBoolean(
        stacking.negatePriority,
        `${sourcePath}.stackingSettings.negatePriority`,
      ),
      maxStackCount: parseBuffMaxStackCountScalar(
        stacking,
        stackingType,
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
    healModifiers: parseBuffHealModifiers(
      root.healModifier,
      `${sourcePath}.healModifier`,
      localBlackboard,
    ),
    poiseModifiers: parseBuffPoiseModifiers(
      root.poiseModifier,
      `${sourcePath}.poiseModifier`,
      localBlackboard,
    ),
    shields: parseBuffShields(root.shieldConfigs, `${sourcePath}.shieldConfigs`, localBlackboard),
    applyTagIds: parseTagIds(root.applyTags, `${sourcePath}.applyTags`),
    extendTagIds: parseTagIds(
      root.tagsAfterTriggerExtendBuffAction,
      `${sourcePath}.tagsAfterTriggerExtendBuffAction`,
    ),
    unsupportedPayloads,
  };
}

function parseBuffShields(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): readonly BuffShieldSource[] {
  return requireArray(value, path).map((raw, index) => {
    const itemPath = `${path}[${index}]`;
    const item = requireRecord(raw, itemPath);
    requireExactFields(
      item,
      new Set([
        'infinityValue',
        'valueCalculation',
        'damageAbsorptions',
        'absorbCnt',
        'absorbAllDmgWhenConsume',
        'removeBuffWhenConsume',
        'priority',
        'replaceHitEffect',
        'hitEffect',
      ]),
      itemPath,
    );
    const calculationPath = `${itemPath}.valueCalculation`;
    const calculation = requireRecord(item.valueCalculation, calculationPath);
    const calculationType = requireNonEmptyString(
      calculation.$type,
      `${calculationPath}.$type`,
    ).split(',', 1)[0]!;
    let shieldValue: BuffShieldSource['value'];
    if (calculationType === 'Beyond.Gameplay.Core.DefiniteValueCalculation') {
      requireExactFields(
        calculation,
        new Set(['$type', 'value', 'applyScale', 'valueScale']),
        calculationPath,
      );
      shieldValue = {
        kind: 'definite',
        value: parseScalarSource(
          calculation.value,
          `${calculationPath}.value`,
          inheritedBlackboard,
        ),
        applyScale: requireBoolean(calculation.applyScale, `${calculationPath}.applyScale`),
        valueScale: parseScalarSource(
          calculation.valueScale,
          `${calculationPath}.valueScale`,
          inheritedBlackboard,
        ),
      };
    } else if (calculationType === 'Beyond.Gameplay.Core.MultiplyAttributeCalculation') {
      requireExactFields(
        calculation,
        new Set(['$type', 'valueSource', 'attributeType', 'multiplier', 'addition']),
        calculationPath,
      );
      shieldValue = {
        kind: 'attribute',
        valueSource: requireNativeEnum(
          calculation.valueSource,
          ['AttackerOrHealer', 'Target'] as const,
          `${calculationPath}.valueSource`,
        ),
        attributeType: parseAttributeTypeName(
          calculation.attributeType,
          `${calculationPath}.attributeType`,
        ),
        multiplier: parseScalarSource(
          calculation.multiplier,
          `${calculationPath}.multiplier`,
          inheritedBlackboard,
        ),
        addition: parseScalarSource(
          calculation.addition,
          `${calculationPath}.addition`,
          inheritedBlackboard,
        ),
      };
    } else {
      throw new Error(
        `${calculationPath}.$type: unsupported shield calculation ${JSON.stringify(calculationType)}`,
      );
    }
    requireRecord(item.hitEffect, `${itemPath}.hitEffect`);
    return {
      infinityValue: requireBoolean(item.infinityValue, `${itemPath}.infinityValue`),
      value: shieldValue,
      damageAbsorptions: requireArray(item.damageAbsorptions, `${itemPath}.damageAbsorptions`).map(
        (rawAbsorption, absorptionIndex) => {
          const absorptionPath = `${itemPath}.damageAbsorptions[${absorptionIndex}]`;
          const absorption = requireRecord(rawAbsorption, absorptionPath);
          requireExactFields(
            absorption,
            new Set(['damageType', 'absorptionRatio', 'absorptionScale']),
            absorptionPath,
          );
          return {
            damageType: requireNativeEnum(
              absorption.damageType,
              [
                'Physical',
                'Real',
                'Fire',
                'Pulse',
                'Cryst',
                'LifeDrain',
                'Natural',
                'Ether',
              ] as const,
              `${absorptionPath}.damageType`,
            ),
            ratio: parseScalarSource(
              absorption.absorptionRatio,
              `${absorptionPath}.absorptionRatio`,
              inheritedBlackboard,
            ),
            scale: parseScalarSource(
              absorption.absorptionScale,
              `${absorptionPath}.absorptionScale`,
              inheritedBlackboard,
            ),
          };
        },
      ),
      absorbCount: parseIntegerScalarSource(item.absorbCnt, `${itemPath}.absorbCnt`),
      absorbAllDamageWhenConsumed: requireBoolean(
        item.absorbAllDmgWhenConsume,
        `${itemPath}.absorbAllDmgWhenConsume`,
      ),
      removeBuffWhenConsumed: requireBoolean(
        item.removeBuffWhenConsume,
        `${itemPath}.removeBuffWhenConsume`,
      ),
      priority: requireNativeEnum(
        item.priority,
        ['Normal', 'PrioritizeConsume'] as const,
        `${itemPath}.priority`,
      ),
      replaceHitEffect: requireBoolean(item.replaceHitEffect, `${itemPath}.replaceHitEffect`),
    };
  });
}

function parseBuffPoiseModifiers(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): readonly BuffPoiseModifierSource[] {
  return requireArray(value, path).map((raw, index) => {
    const itemPath = `${path}[${index}]`;
    const item = requireRecord(raw, itemPath);
    requireExactFields(item, new Set(['enableSide', 'condition', 'poiseProcessors']), itemPath);
    const processors = requireArray(item.poiseProcessors, `${itemPath}.poiseProcessors`).map(
      (rawProcessor, processorIndex) => {
        const processorPath = `${itemPath}.poiseProcessors[${processorIndex}]`;
        const processor = requireRecord(rawProcessor, processorPath);
        requireExactFields(
          processor,
          new Set(['$type', 'modifyTargetSide', 'modifier']),
          processorPath,
        );
        const type = requireNonEmptyString(processor.$type, `${processorPath}.$type`).split(
          ',',
          1,
        )[0]!;
        if (type !== 'Beyond.Gameplay.Core.InstantModifyAttributeForPoise') {
          throw new Error(
            `${processorPath}.$type: unsupported poise processor ${JSON.stringify(type)}`,
          );
        }
        return {
          kind: 'instantAttribute' as const,
          modifyTargetSide: requireNativeEnum(
            processor.modifyTargetSide,
            DAMAGE_SCALE_SIDES,
            `${processorPath}.modifyTargetSide`,
          ),
          modifier: parseGameplayAttributeModifierEntrySource(
            processor.modifier,
            `${processorPath}.modifier`,
            inheritedBlackboard,
          ),
        };
      },
    );
    return {
      enabledSide: parseDamageScaleSide(item.enableSide, `${itemPath}.enableSide`),
      condition: parseNativeSequenceSource(
        item.condition,
        `${itemPath}.condition`,
        inheritedBlackboard,
        (leaf, leafPath) => parseKnownNativeActionLeafSource(leaf, leafPath, inheritedBlackboard),
      ),
      processors,
    };
  });
}

function parseBuffHealModifiers(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): readonly BuffHealModifierSource[] {
  return requireArray(value, path).map((raw, index) => {
    const itemPath = `${path}[${index}]`;
    const item = requireRecord(raw, itemPath);
    requireExactFields(item, new Set(['enableSide', 'condition', 'healProcessors']), itemPath);
    const processors = requireArray(item.healProcessors, `${itemPath}.healProcessors`).map(
      (rawProcessor, processorIndex) => {
        const processorPath = `${itemPath}.healProcessors[${processorIndex}]`;
        const processor = requireRecord(rawProcessor, processorPath);
        const type = requireNonEmptyString(processor.$type, `${processorPath}.$type`).split(
          ',',
          1,
        )[0]!;
        if (type === 'Beyond.Gameplay.Core.ModifyHealCalcResult') {
          requireExactFields(
            processor,
            new Set(['$type', 'modifyType', 'baseMultiplier', 'multiplierCnt']),
            processorPath,
          );
          if (
            requireNativeEnum(
              processor.modifyType,
              ['Multiply'] as const,
              `${processorPath}.modifyType`,
            ) !== 'Multiply'
          )
            throw new Error(`${processorPath}.modifyType: expected "Multiply"`);
          return {
            kind: 'modifyCalculationResult' as const,
            baseMultiplier: parseScalarSource(
              processor.baseMultiplier,
              `${processorPath}.baseMultiplier`,
              inheritedBlackboard,
            ),
            multiplierCount: parseScalarSource(
              processor.multiplierCnt,
              `${processorPath}.multiplierCnt`,
              inheritedBlackboard,
            ),
          };
        }
        requireExactFields(
          processor,
          new Set(['$type', 'modifyTargetSide', 'modifier']),
          processorPath,
        );
        if (type !== 'Beyond.Gameplay.Core.InstantModifyAttributeForHeal')
          throw new Error(
            `${processorPath}.$type: unsupported heal processor ${JSON.stringify(type)}`,
          );
        return {
          kind: 'instantAttribute' as const,
          modifyTargetSide: requireNativeEnum(
            processor.modifyTargetSide,
            DAMAGE_SCALE_SIDES,
            `${processorPath}.modifyTargetSide`,
          ),
          modifier: parseGameplayAttributeModifierEntrySource(
            processor.modifier,
            `${processorPath}.modifier`,
            inheritedBlackboard,
          ),
        };
      },
    );
    return {
      enabledSide: parseDamageScaleSide(item.enableSide, `${itemPath}.enableSide`),
      condition: parseNativeSequenceSource(
        item.condition,
        `${itemPath}.condition`,
        inheritedBlackboard,
        (leaf, leafPath) => parseKnownNativeActionLeafSource(leaf, leafPath, inheritedBlackboard),
      ),
      processors,
    };
  });
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
      enabledSide: parseDamageScaleSide(item.enableSide, `${itemPath}.enableSide`),
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
  const hasDirectHeadBuffFlag = 'showDirectlyInHeadBuff' in icon;
  requireExactFields(
    icon,
    new Set([
      '_spritePath',
      'showInHeadBarCommon',
      'showInHeadBarAttached',
      ...(hasDirectHeadBuffFlag ? ['showDirectlyInHeadBuff'] : []),
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
    showDirectlyInHeadBuff: hasDirectHeadBuffFlag
      ? requireBoolean(
          icon.showDirectlyInHeadBuff,
          `${sourcePath}.iconConfig.showDirectlyInHeadBuff`,
        )
      : false,
    showInSquadIcon: requireBoolean(
      icon.showInSquadIcon,
      `${sourcePath}.iconConfig.showInSquadIcon`,
    ),
    onlyShowForMainCharacter: requireBoolean(
      icon.onlyShowForMainCharacter,
      `${sourcePath}.iconConfig.onlyShowForMainCharacter`,
    ),
    blinkInMainCharHpBar: requireBoolean(
      icon.blinkInMainCharHpBar,
      `${sourcePath}.iconConfig.blinkInMainCharHpBar`,
    ),
    showProgressInHpBar: requireBoolean(
      icon.showProgressInHpBar,
      `${sourcePath}.iconConfig.showProgressInHpBar`,
    ),
    showProgressInNormalSkillButton: requireBoolean(
      icon.showProgressInNormalSkillButton,
      `${sourcePath}.iconConfig.showProgressInNormalSkillButton`,
    ),
    useWeakProgressInNormalSkillButton: requireBoolean(
      icon.useWeakProgressInNormalSkillButton,
      `${sourcePath}.iconConfig.useWeakProgressInNormalSkillButton`,
    ),
    showProgressInUltimateSkillButton: requireBoolean(
      icon.showProgressInUltimateSkillButton,
      `${sourcePath}.iconConfig.showProgressInUltimateSkillButton`,
    ),
    forceRaiseIconEvent: requireBoolean(
      icon.forceRaiseIconEvent,
      `${sourcePath}.iconConfig.forceRaiseIconEvent`,
    ),
    showWarningBackground: requireBoolean(
      icon.showWarningBackground,
      `${sourcePath}.iconConfig.showWarningBackground`,
    ),
    playStrongInAnimation: requireBoolean(
      icon.playStrongInAnimation,
      `${sourcePath}.iconConfig.playStrongInAnimation`,
    ),
    hasCharHpBarVfxType: requireBoolean(
      icon.hasCharHpBarVfxType,
      `${sourcePath}.iconConfig.hasCharHpBarVfxType`,
    ),
    charHpBarVfxType: requireNativeEnum(
      icon.charHpBarVfxType,
      SPELL_INFLICTION_ON_CHAR_TYPES,
      `${sourcePath}.iconConfig.charHpBarVfxType`,
    ),
    iconStyleInSquad: requireNativeEnum(
      icon.iconStyleInSquad,
      BUFF_ICON_STYLES,
      `${sourcePath}.iconConfig.iconStyleInSquad`,
    ),
    abnormalColorType: requireNativeEnum(
      icon.abnormalColorType,
      DAMAGE_TYPES,
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
    orderPriorityEnum: requireNativeEnum(
      order.priorityEnum,
      BUFF_ORDER_PRIORITY_BY_VALUE,
      `${sourcePath}.iconConfig._orderPriorityConfig.priorityEnum`,
    ),
  };
}

function parsePassiveSettings(
  root: Record<string, unknown>,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
): { addingCooldown: ScalarSource | null; ignoreCooldownWhenAdding: boolean } {
  for (const field of ['ignoreTagImmune', 'finishOnRepatriate']) {
    requireBoolean(root[field], `${sourcePath}.${field}`);
  }
  const ignoreCooldownWhenAdding = requireBoolean(
    root.ignoreCooldownWhenAdding,
    `${sourcePath}.ignoreCooldownWhenAdding`,
  );
  const hasAddingCooldown = requireBoolean(
    root.hasAddingCooldown,
    `${sourcePath}.hasAddingCooldown`,
  );
  if (hasAddingCooldown) {
    const addingCooldown = parseScalarSource(
      root.addingCooldown,
      `${sourcePath}.addingCooldown`,
      inheritedBlackboard,
    );
    validateDispelConfig(root, sourcePath);
    return { addingCooldown, ignoreCooldownWhenAdding };
  }
  // 关闭槽在 1.4.4 中存在 useBlackboardKey=true + 空 key 的序列化脏值；
  // 结构仍须严格，禁用值则不应被提升成运行时黑板依赖。
  const addingCooldown = requireRecord(root.addingCooldown, `${sourcePath}.addingCooldown`);
  requireExactFields(
    addingCooldown,
    new Set(['useBlackboardKey', 'value', 'blackboardKey']),
    `${sourcePath}.addingCooldown`,
  );
  requireBoolean(addingCooldown.useBlackboardKey, `${sourcePath}.addingCooldown.useBlackboardKey`);
  requireNumber(addingCooldown.value, `${sourcePath}.addingCooldown.value`);
  requireString(addingCooldown.blackboardKey, `${sourcePath}.addingCooldown.blackboardKey`);
  validateDispelConfig(root, sourcePath);
  return { addingCooldown: null, ignoreCooldownWhenAdding };
}

function validateDispelConfig(root: Record<string, unknown>, sourcePath: string): void {
  const dispel = requireRecord(root.dispelConfig, `${sourcePath}.dispelConfig`);
  requireExactFields(
    dispel,
    new Set(['canBeDispelled', 'dispelledLevel']),
    `${sourcePath}.dispelConfig`,
  );
  requireBoolean(dispel.canBeDispelled, `${sourcePath}.dispelConfig.canBeDispelled`);
  requireNativeEnum(
    dispel.dispelledLevel,
    ['Default'] as const,
    `${sourcePath}.dispelConfig.dispelledLevel`,
  );
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
      const actionFields = new Set([
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
      ]);
      if (Object.hasOwn(action, 'bigEffectTarget')) actionFields.add('bigEffectTarget');
      requireExactFields(action, actionFields, actionPath);
      requireBoolean(action.isEnable, `${actionPath}.isEnable`);
      requireNativeActionPriority(action.priorityLevel, `${actionPath}.priorityLevel`);
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
      if (Object.hasOwn(action, 'bigEffectTarget'))
        requireRecord(action.bigEffectTarget, `${actionPath}.bigEffectTarget`);
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

function parseBuffPriorityScalar(
  stacking: Record<string, unknown>,
  stackingType: BuffStackingTypeSource,
  stackingIdentifierType: 'Id' | 'StackingKey',
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): ScalarSource {
  if (stackingType === 'HighPriority' || stackingType === 'HighPriorityWithMaxStack') {
    if (
      stacking.usePriorityKey === true &&
      (stacking.priorityKey === '' ||
        (typeof stacking.priorityKey === 'string' &&
          /^\d+$/.test(stacking.priorityKey) &&
          !Object.hasOwn(inheritedBlackboard, stacking.priorityKey))) &&
      stackingIdentifierType === 'Id'
    ) {
      // 当前正式数据存在两个 Id 优先队列 Buff 启用了不可读取的优先级键：一个空串，
      // 一个未声明的编辑器数字占位。旧版本对照均关闭该开关，当前实例也没有任何
      // 施加路径为这些键赋值；原生缺键无法形成有意义的动态排序。保留静态 priority，
      // 但不把普通的非空黑板键或 StackingKey 分组降级。
      return scalarFromToggle(false, '', stacking.priority, path, inheritedBlackboard);
    }
    return scalarFromToggle(
      stacking.usePriorityKey,
      stacking.priorityKey,
      stacking.priority,
      path,
      inheritedBlackboard,
    );
  }
  // 原生 Buff._LoadPriority 只为两类 priority stacking 读取动态键。其他类型中的
  // usePriorityKey/priorityKey 是未消费的编辑器残留，不能因此制造黑板依赖。
  requireBoolean(stacking.usePriorityKey, `${path}.useBlackboardKey`);
  requireString(stacking.priorityKey, `${path}.blackboardKey`);
  return scalarFromToggle(false, '', stacking.priority, path, inheritedBlackboard);
}

function parseBuffMaxStackCountScalar(
  stacking: Record<string, unknown>,
  stackingType: BuffStackingTypeSource,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): ScalarSource {
  const useKey = requireBoolean(stacking.useMaxStackCntKey, `${path}.useBlackboardKey`);
  const key = requireString(stacking.maxStackCntKey, `${path}.blackboardKey`);
  const value = requireNumber(stacking.maxStackCnt, `${path}.value`);

  if (
    !useKey &&
    stackingType === 'HighPriorityWithMaxStack' &&
    value <= 0 &&
    key !== '' &&
    Object.hasOwn(inheritedBlackboard, key)
  ) {
    // 当前 VFS 的 11 个 HighPriorityWithMaxStack Buff 全部关闭了动态上限开关，
    // 但其中三个伤害相关配置的静态上限为 0/-1，且技能/装备施加链明确向该键传入
    // 3/4/5 层上限，本地化也声明相同层数。当前原生 fallback 按静态值会让三项效果
    // 全部失活，IFix patch 又未覆盖相关入口。这是当前内容资产与客户端 fallback 的
    // 已记录冲突；这里只对“非正静态值 + 已声明动态键”的精确形状采用内容上限，
    // 不改变其余八个使用正静态上限的同类 Buff。
    return parseScalarSource(
      { useBlackboardKey: true, blackboardKey: key, value },
      path,
      inheritedBlackboard,
    );
  }

  return parseScalarSource(
    { useBlackboardKey: useKey, blackboardKey: key, value },
    path,
    inheritedBlackboard,
  );
}

function requireOneOf<const T extends readonly string[]>(
  value: unknown,
  options: T,
  path: string,
): T[number] {
  return requireNativeEnum(value, options, path);
}
