import { parseNativeCalculationSource, type NativeCalculationSource } from './calculation.ts';
import {
  nativeActionName,
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireNumber,
  requireRecord,
  requireString,
} from './primitives.ts';
import {
  parseGameplayAttributeModifierEntrySource,
  type AttributeTypeSource,
  type ModifierTypeSource,
  type ModifyAttributeTypeSource,
} from './attributeModifiers.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';
import { parseTargetReferenceSource, type TargetReferenceSource } from './target.ts';

const ACTION_META_FIELDS = [
  '$type',
  'isEnable',
  'priorityLevel',
  'priorityOffset',
  'serverActionIndex',
];
const DAMAGE_UNIT_BASE_FIELDS = [
  'damageType',
  'damageAttributeType',
  'simpleCalculation',
  'atkScale',
  'takeAtkSnapshot',
  'damageDecorateMask',
  'controlEffectRoll',
  'onlyEnableForMainChar',
  'damageProcessors',
  'ignoreDamageImmuneLevel',
  'ignorePoiseImmune',
  'reduceDamageForGuard',
  'reduceDamageForGuardRatio',
  'gainCost',
  'costDataList',
  'playDefaultHitEffect',
  'playHitEffect',
  'effectData',
  'playHitSound',
  'hitSoundData',
  'playHitFlashEffect',
  'hideMainCharHpScreenEffect',
  'hidePoiseUIEffect',
  'enablePoiseBreakTimeDilation',
  'damageVisualImportance',
  'enableDamageVisualCoalition',
  'damageVisualCoalitionGroupKey',
  'alwaysStartNewCoalition',
  'alwaysEndCoalition',
  'updatePositionOnCoalition',
];

export interface DamageCostSource {
  readonly costType: string;
  readonly costValue: number;
  readonly atbValueThreshold: number;
}

export type DamageProcessorSource =
  | {
      readonly kind: 'instantAttributeModifier';
      readonly targetSide: string;
      readonly modifyAttributeType: ModifyAttributeTypeSource;
      readonly attributeType: AttributeTypeSource;
      readonly formulaItem: ModifierTypeSource;
      readonly parameter: ScalarSource;
    }
  | {
      readonly kind: 'damageScale';
      readonly side: string;
      readonly zoneName: string;
      readonly addition: ScalarSource;
    };

export interface DamageUnitSource {
  readonly damageType: string;
  readonly attributeType: string;
  readonly simpleCalculation: boolean;
  readonly attackScale: ScalarSource;
  readonly serializedAttackCalculationPresent: boolean;
  readonly attackCalculation: NativeCalculationSource | null;
  readonly serializedPoiseCalculationPresent: boolean;
  readonly poiseCalculation: NativeCalculationSource | null;
  readonly takeAttackSnapshot: boolean;
  readonly damageDecorateMask: number;
  readonly controlEffectRoll: boolean;
  readonly onlyEnableForMainOperator: boolean;
  readonly processors: readonly DamageProcessorSource[];
  readonly ignoreDamageImmuneLevel: string;
  readonly ignorePoiseImmune: boolean;
  readonly reduceDamageForGuard: boolean;
  readonly reduceDamageForGuardRatio: number;
  readonly gainCost: boolean;
  readonly costs: readonly DamageCostSource[];
  readonly enablePoiseBreakTimeDilation: boolean;
  readonly visualImportance: string;
  readonly visualCoalitionEnabled: boolean;
  readonly visualCoalitionGroupKey: string;
  readonly alwaysStartNewCoalition: boolean;
  readonly alwaysEndCoalition: boolean;
  readonly updatePositionOnCoalition: boolean;
}

export interface DamageActionSource {
  readonly kind: 'damage';
  readonly alwaysNext: boolean;
  readonly attacker: string;
  readonly target: TargetReferenceSource;
  readonly effectSource: TargetReferenceSource;
  readonly hitEnvironment: boolean;
  readonly units: readonly DamageUnitSource[];
}

/** 读取 DamageAction 的原生战斗事实；标准伤害公式兼容性由后续投影层判断。 */
export function parseDamageActionSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): DamageActionSource {
  const action = requireRecord(value, path);
  requireExactFields(
    action,
    new Set([
      ...ACTION_META_FIELDS,
      'alwaysNext',
      'attacker',
      'targetSettings',
      'effectSource',
      'damageUnits',
      'hitEnvironment',
      'hitEnvData',
    ]),
    path,
  );
  // hitEnvData 只描述环境命中特效；确认对象存在，但不复制进战斗 IR。
  requireRecord(action.hitEnvData, `${path}.hitEnvData`);
  return {
    kind: 'damage',
    alwaysNext: requireBoolean(action.alwaysNext, `${path}.alwaysNext`),
    attacker: requireNonEmptyString(action.attacker, `${path}.attacker`),
    target: parseTargetReferenceSource(action.targetSettings, `${path}.targetSettings`),
    effectSource: parseTargetReferenceSource(action.effectSource, `${path}.effectSource`),
    hitEnvironment: requireBoolean(action.hitEnvironment, `${path}.hitEnvironment`),
    units: requireArray(action.damageUnits, `${path}.damageUnits`).map((unit, index) =>
      parseDamageUnitSource(unit, `${path}.damageUnits[${index}]`, inheritedBlackboard),
    ),
  };
}

export function parseDamageUnitSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): DamageUnitSource {
  const unit = requireRecord(value, path);
  const expectedFields = new Set(DAMAGE_UNIT_BASE_FIELDS);
  if ('atkCalculation' in unit) expectedFields.add('atkCalculation');
  if ('poiseCalculation' in unit) expectedFields.add('poiseCalculation');
  if ('damageTags' in unit) expectedFields.add('damageTags');
  requireExactFields(unit, expectedFields, path);
  // 新版标签会参与原生伤害免疫等规则，不能当成显示字段丢弃；仅空列表等价于旧结构。
  // 非空列表留待公共伤害标签链接入，不在来源层猜标签含义或新增运行时数字 ID。
  if ('damageTags' in unit && requireArray(unit.damageTags, `${path}.damageTags`).length > 0) {
    throw new Error(`${path}.damageTags: non-empty damage tags require native consumer projection`);
  }
  // 两个字段是完整表现配置；只校验对象存在。
  requireRecord(unit.effectData, `${path}.effectData`);
  requireRecord(unit.hitSoundData, `${path}.hitSoundData`);
  const attributeType = requireNonEmptyString(
    unit.damageAttributeType,
    `${path}.damageAttributeType`,
  );
  const simpleCalculation = requireBoolean(unit.simpleCalculation, `${path}.simpleCalculation`);
  if ('poiseCalculation' in unit && attributeType === 'Hp') {
    // combat-spec: DamageAction._ProcessDamage branches on damageAttributeType at
    // 0x0353FFE5. The Hp branch never reads the +0x68 poiseCalculation field, but
    // real data may still serialize an inactive calculation object (Gilberta battle skill).
    requireRecord(unit.poiseCalculation, `${path}.poiseCalculation`);
  }
  if ('atkCalculation' in unit && attributeType === 'Poise') {
    // The Poise branch reads poiseCalculation directly after damageAttributeType
    // dispatch; simpleCalculation and atkCalculation belong to the inactive Hp path.
    requireRecord(unit.atkCalculation, `${path}.atkCalculation`);
  }
  for (const field of [
    'playDefaultHitEffect',
    'playHitEffect',
    'playHitSound',
    'playHitFlashEffect',
    'hideMainCharHpScreenEffect',
    'hidePoiseUIEffect',
  ]) {
    requireBoolean(unit[field], `${path}.${field}`);
  }
  return {
    damageType: requireNonEmptyString(unit.damageType, `${path}.damageType`),
    attributeType,
    simpleCalculation,
    attackScale: parseScalarSource(unit.atkScale, `${path}.atkScale`, inheritedBlackboard),
    serializedAttackCalculationPresent: 'atkCalculation' in unit,
    attackCalculation:
      'atkCalculation' in unit && attributeType === 'Hp' && !simpleCalculation
        ? parseNativeCalculationSource(
            unit.atkCalculation,
            `${path}.atkCalculation`,
            inheritedBlackboard,
          )
        : null,
    serializedPoiseCalculationPresent: 'poiseCalculation' in unit,
    poiseCalculation:
      'poiseCalculation' in unit && attributeType === 'Poise'
        ? parseNativeCalculationSource(
            unit.poiseCalculation,
            `${path}.poiseCalculation`,
            inheritedBlackboard,
          )
        : null,
    takeAttackSnapshot: requireBoolean(unit.takeAtkSnapshot, `${path}.takeAtkSnapshot`),
    damageDecorateMask: requireNonNegativeInteger(
      unit.damageDecorateMask,
      `${path}.damageDecorateMask`,
    ),
    controlEffectRoll: requireBoolean(unit.controlEffectRoll, `${path}.controlEffectRoll`),
    onlyEnableForMainOperator: requireBoolean(
      unit.onlyEnableForMainChar,
      `${path}.onlyEnableForMainChar`,
    ),
    processors: parseDamageProcessors(
      unit.damageProcessors,
      `${path}.damageProcessors`,
      inheritedBlackboard,
    ),
    ignoreDamageImmuneLevel: requireNonEmptyString(
      unit.ignoreDamageImmuneLevel,
      `${path}.ignoreDamageImmuneLevel`,
    ),
    ignorePoiseImmune: requireBoolean(unit.ignorePoiseImmune, `${path}.ignorePoiseImmune`),
    reduceDamageForGuard: requireBoolean(unit.reduceDamageForGuard, `${path}.reduceDamageForGuard`),
    reduceDamageForGuardRatio: requireNumber(
      unit.reduceDamageForGuardRatio,
      `${path}.reduceDamageForGuardRatio`,
    ),
    gainCost: requireBoolean(unit.gainCost, `${path}.gainCost`),
    costs: parseDamageCosts(unit.costDataList, `${path}.costDataList`),
    enablePoiseBreakTimeDilation: requireBoolean(
      unit.enablePoiseBreakTimeDilation,
      `${path}.enablePoiseBreakTimeDilation`,
    ),
    visualImportance: requireNonEmptyString(
      unit.damageVisualImportance,
      `${path}.damageVisualImportance`,
    ),
    visualCoalitionEnabled: requireBoolean(
      unit.enableDamageVisualCoalition,
      `${path}.enableDamageVisualCoalition`,
    ),
    visualCoalitionGroupKey: requireString(
      unit.damageVisualCoalitionGroupKey,
      `${path}.damageVisualCoalitionGroupKey`,
    ),
    alwaysStartNewCoalition: requireBoolean(
      unit.alwaysStartNewCoalition,
      `${path}.alwaysStartNewCoalition`,
    ),
    alwaysEndCoalition: requireBoolean(unit.alwaysEndCoalition, `${path}.alwaysEndCoalition`),
    updatePositionOnCoalition: requireBoolean(
      unit.updatePositionOnCoalition,
      `${path}.updatePositionOnCoalition`,
    ),
  };
}

function parseDamageCosts(value: unknown, path: string): DamageCostSource[] {
  return requireArray(value, path).map((rawCost, index) => {
    const costPath = `${path}[${index}]`;
    const cost = requireRecord(rawCost, costPath);
    requireExactFields(cost, new Set(['costType', 'costValue', 'atbValueThreshold']), costPath);
    return {
      costType: requireNonEmptyString(cost.costType, `${costPath}.costType`),
      costValue: requireNumber(cost.costValue, `${costPath}.costValue`),
      atbValueThreshold: requireNumber(cost.atbValueThreshold, `${costPath}.atbValueThreshold`),
    };
  });
}

export function parseDamageProcessors(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): DamageProcessorSource[] {
  return requireArray(value, path).map((rawProcessor, index) => {
    const processorPath = `${path}[${index}]`;
    const processor = requireRecord(rawProcessor, processorPath);
    const sourceType = typeof processor.$type === 'string' ? nativeActionName(processor.$type) : '';
    if (sourceType === 'InstantModifyAttribute') {
      const hasExportedCache =
        'm_attributeModifierLoader' in processor || '<attributeMask>k__BackingField' in processor;
      requireExactFields(
        processor,
        new Set([
          '$type',
          'modifyTargetSide',
          'modifier',
          ...(hasExportedCache
            ? ['m_attributeModifierLoader', '<attributeMask>k__BackingField']
            : []),
        ]),
        processorPath,
      );
      if (hasExportedCache) {
        // 原生每次处理伤害时由 modifier 与当前黑板重新装载缓存；只接受导出器写出的空初态。
        // 证据见 combat-spec/docs/damage-processors.md，不能据此忽略真实 modifier 或非空运行状态。
        const loaderPath = `${processorPath}.m_attributeModifierLoader`;
        requireExactFields(
          requireRecord(processor.m_attributeModifierLoader, loaderPath),
          new Set(),
          loaderPath,
        );
        const maskPath = `${processorPath}.<attributeMask>k__BackingField`;
        const mask = requireRecord(processor['<attributeMask>k__BackingField'], maskPath);
        requireExactFields(mask, new Set(['lowerMask', 'higherMask']), maskPath);
        for (const key of ['lowerMask', 'higherMask'] as const) {
          if (requireNumber(mask[key], `${maskPath}.${key}`) !== 0)
            throw new Error(`${maskPath}.${key}: expected empty exported attribute mask`);
        }
      }
      const modifier = requireRecord(processor.modifier, `${processorPath}.modifier`);
      requireExactFields(
        modifier,
        new Set(['modifyAttributeType', 'attributeType', 'formulaItem', 'param']),
        `${processorPath}.modifier`,
      );
      const parsedModifier = parseGameplayAttributeModifierEntrySource(
        modifier,
        `${processorPath}.modifier`,
        inheritedBlackboard,
      );
      return {
        kind: 'instantAttributeModifier',
        targetSide: requireNonEmptyString(
          processor.modifyTargetSide,
          `${processorPath}.modifyTargetSide`,
        ),
        modifyAttributeType: parsedModifier.modifyAttributeType,
        attributeType: parsedModifier.attributeType,
        formulaItem: parsedModifier.formulaItem,
        parameter: parsedModifier.parameter,
      };
    }
    if (sourceType === 'DamageScaleProcessor') {
      requireExactFields(
        processor,
        new Set(['$type', 'side', 'zoneName', 'addition']),
        processorPath,
      );
      return {
        kind: 'damageScale',
        side: requireNonEmptyString(processor.side, `${processorPath}.side`),
        zoneName: requireNonEmptyString(processor.zoneName, `${processorPath}.zoneName`),
        addition: parseScalarSource(
          processor.addition,
          `${processorPath}.addition`,
          inheritedBlackboard,
        ),
      };
    }
    throw new Error(`${processorPath}: unsupported damage processor ${JSON.stringify(sourceType)}`);
  });
}
