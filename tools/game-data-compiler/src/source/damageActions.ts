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
      readonly modifyAttributeType: string;
      readonly attributeType: string;
      readonly formulaItem: string;
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
  requireExactFields(unit, expectedFields, path);
  // 两个字段是完整表现配置；只校验对象存在。
  requireRecord(unit.effectData, `${path}.effectData`);
  requireRecord(unit.hitSoundData, `${path}.hitSoundData`);
  const attributeType = requireNonEmptyString(
    unit.damageAttributeType,
    `${path}.damageAttributeType`,
  );
  const simpleCalculation = requireBoolean(unit.simpleCalculation, `${path}.simpleCalculation`);
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

function parseDamageProcessors(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): DamageProcessorSource[] {
  return requireArray(value, path).map((rawProcessor, index) => {
    const processorPath = `${path}[${index}]`;
    const processor = requireRecord(rawProcessor, processorPath);
    const sourceType = typeof processor.$type === 'string' ? nativeActionName(processor.$type) : '';
    if (sourceType === 'InstantModifyAttribute') {
      requireExactFields(
        processor,
        new Set(['$type', 'modifyTargetSide', 'modifier']),
        processorPath,
      );
      const modifier = requireRecord(processor.modifier, `${processorPath}.modifier`);
      requireExactFields(
        modifier,
        new Set(['modifyAttributeType', 'attributeType', 'formulaItem', 'param']),
        `${processorPath}.modifier`,
      );
      return {
        kind: 'instantAttributeModifier',
        targetSide: requireNonEmptyString(
          processor.modifyTargetSide,
          `${processorPath}.modifyTargetSide`,
        ),
        modifyAttributeType: requireNonEmptyString(
          modifier.modifyAttributeType,
          `${processorPath}.modifier.modifyAttributeType`,
        ),
        attributeType: requireNonEmptyString(
          modifier.attributeType,
          `${processorPath}.modifier.attributeType`,
        ),
        formulaItem: requireNonEmptyString(
          modifier.formulaItem,
          `${processorPath}.modifier.formulaItem`,
        ),
        parameter: parseScalarSource(
          modifier.param,
          `${processorPath}.modifier.param`,
          inheritedBlackboard,
        ),
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
