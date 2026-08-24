import type {
  AttributeTypeSource,
  ResolvedAttributeModifierSource,
} from '../source/attributeModifiers.ts';

export const ATTRIBUTE_MODIFIER_SLOTS = [
  'addition',
  'multiplier',
  'finalAddition',
  'finalMultiplier',
  'baseAddition',
  'baseMultiplier',
  'baseFinalAddition',
  'baseFinalMultiplier',
] as const;
export type AttributeModifierSlotSource = (typeof ATTRIBUTE_MODIFIER_SLOTS)[number];

export type CompiledAttributeModifierTargetSource = 'specific' | 'main' | 'sub' | 'all';

/**
 * 领域无关的静态属性修正程序。声明属性即使在 Main/Sub/All 模式下不参与目标选择也继续保留，
 * 以便审计原始数据，不能因运行时忽略而从公共 IR 删除。
 */
export interface CompiledAttributeModifierSource {
  readonly sourcePath: string;
  readonly target: CompiledAttributeModifierTargetSource;
  readonly declaredAttributeType: AttributeTypeSource;
  readonly slot: AttributeModifierSlotSource;
  readonly value: number;
}

export function compileResolvedAttributeModifierSource(
  source: ResolvedAttributeModifierSource,
): CompiledAttributeModifierSource {
  if (!Number.isFinite(source.value)) {
    throw new Error(`${source.sourcePath}: attribute modifier value must be finite`);
  }
  return {
    sourcePath: source.sourcePath,
    target: source.modifyAttributeType.toLowerCase() as CompiledAttributeModifierTargetSource,
    declaredAttributeType: source.attributeType,
    slot: compileModifierSlot(source.formulaItem, source.sourcePath),
    value: source.value,
  };
}

/** 按原生 AttributeModifierTargetResolver 展开 Specific/Main/Sub/All。 */
export function resolveCompiledAttributeModifierTargets(
  modifier: CompiledAttributeModifierSource,
  mainAttribute: AttributeTypeSource | null,
  subAttribute: AttributeTypeSource | null,
): readonly AttributeTypeSource[] {
  switch (modifier.target) {
    case 'specific':
      return [modifier.declaredAttributeType];
    case 'main':
      return mainAttribute === null ? [] : [mainAttribute];
    case 'sub':
      return subAttribute === null ? [] : [subAttribute];
    case 'all':
      return ['Str', 'Agi', 'Wisd', 'Will'];
  }
}

function compileModifierSlot(
  formulaItem: ResolvedAttributeModifierSource['formulaItem'],
  sourcePath: string,
): AttributeModifierSlotSource {
  switch (formulaItem) {
    case 'Addition':
      return 'addition';
    case 'Multiplier':
      return 'multiplier';
    case 'FinalAddition':
      return 'finalAddition';
    case 'FinalMultiplier':
      return 'finalMultiplier';
    case 'BaseAddition':
      return 'baseAddition';
    case 'BaseMultiplier':
      return 'baseMultiplier';
    case 'BaseFinalAddition':
      return 'baseFinalAddition';
    case 'BaseFinalMultiplier':
      return 'baseFinalMultiplier';
    case 'None':
    case 'Enum':
      throw new Error(`${sourcePath}: ModifierType ${formulaItem} is not a numeric formula slot`);
  }
}
