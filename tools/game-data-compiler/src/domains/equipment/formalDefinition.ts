import { compileResolvedAttributeModifierSource } from '../../compiler/attributeModifier.ts';
import type { ResolvedAttributeModifierSource } from '../../source/attributeModifiers.ts';
import type {
  EquipmentAttributeModifierSource,
  EquipmentItemSource,
  EquipmentPartTypeSource,
} from './attributeModifiers.ts';
import {
  projectEquipmentAttributeModifier,
  type EquipmentAttributeModifierProjectionSource,
  type ProjectedEquipmentModifierSource,
} from './projection.ts';

export interface EquipmentDefinitionDiagnosticSource {
  readonly status: 'scenario-omitted' | 'blocked';
  readonly sourcePath: string;
  readonly reason: string;
}

export type CompiledGearSlotTypeSource = 'armor' | 'gloves' | 'accessory';
export type CompiledEquipmentModifierDefinitionSource =
  | {
      readonly kind: 'attribute';
      readonly attribute: 'strength' | 'agility' | 'intellect' | 'will' | 'main' | 'secondary';
      readonly operation: 'flat' | 'percent';
      readonly value: readonly number[];
    }
  | {
      readonly kind: 'panelStat';
      readonly stat:
        | 'attackFlat'
        | 'attackPercent'
        | 'healthFlat'
        | 'healthPercent'
        | 'criticalRate'
        | 'artsIntensity'
        | 'ultimateEnergyGainEfficiency';
      readonly value: readonly number[];
    }
  | {
      readonly kind: 'damageScale';
      readonly target: import('./projection.ts').ProjectedEquipmentDamageScale;
      readonly value: readonly number[];
    }
  | {
      readonly kind: 'staticHealingIncrease';
      readonly target: 'output';
      readonly value: readonly number[];
    };

export interface CompiledGearTraitDefinitionSource {
  readonly key: string;
  readonly levelCount: number;
  readonly modifiers: readonly CompiledEquipmentModifierDefinitionSource[];
}

export interface CompiledGearDefinitionSource {
  readonly slug: string;
  readonly assetSlug: string;
  readonly slotType: CompiledGearSlotTypeSource;
  readonly levelRequirement: number;
  readonly baseDefense: number;
  readonly traits: readonly CompiledGearTraitDefinitionSource[];
  readonly gearSetSlug?: string;
}

export interface CompiledEquipmentDefinitionSource {
  readonly definition?: CompiledGearDefinitionSource;
  readonly diagnostics: readonly EquipmentDefinitionDiagnosticSource[];
}

const GEAR_SLOT_BY_PART_TYPE: Readonly<
  Partial<Record<EquipmentPartTypeSource, CompiledGearSlotTypeSource>>
> = {
  Body: 'armor',
  Hand: 'gloves',
  EDC: 'accessory',
};

type ProjectedModifierLevelValues = ProjectedEquipmentModifierSource extends infer T
  ? T extends ProjectedEquipmentModifierSource
    ? Omit<T, 'value'> & { readonly value: readonly number[] }
    : never
  : never;

interface ProjectedModifierLevels {
  readonly source: EquipmentAttributeModifierSource;
  readonly status: EquipmentAttributeModifierProjectionSource['status'];
  readonly modifier?: ProjectedModifierLevelValues;
  readonly reason?: string;
}

/**
 * 把一条原生装备记录组装成 Next 正式定义。
 * 基础防御仍来自同一属性修正程序，但 GearDefinition 将其提升为单独字段；只有当前四档完全
 * 相等时才能无损提升。其余修正严格按 attrIndex 分组，保持装备实例精锻选择的原生边界。
 */
export function compileEquipmentDefinitionSource(
  equipment: EquipmentItemSource,
): CompiledEquipmentDefinitionSource {
  const diagnostics: EquipmentDefinitionDiagnosticSource[] = [];
  const slotType = GEAR_SLOT_BY_PART_TYPE[equipment.partType];
  if (slotType === undefined) {
    diagnostics.push({
      status: 'blocked',
      sourcePath: `${equipment.sourcePath}.partType`,
      reason: `native equipment part ${equipment.partType} is not a formal Endaxis gear slot`,
    });
  }

  const projected = equipment.attributeModifiers.map(projectModifierLevels);
  for (const entry of projected) {
    if (entry.status === 'supported') continue;
    diagnostics.push({
      status: entry.status,
      sourcePath: entry.source.sourcePath,
      reason: entry.reason ?? 'equipment modifier projection failed without a reason',
    });
  }

  const baseDefenseEntries = projected.filter(
    entry =>
      entry.status === 'supported' &&
      entry.modifier?.kind === 'panelStat' &&
      entry.modifier.stat === 'baseDefense',
  );
  if (baseDefenseEntries.length !== 1) {
    diagnostics.push({
      status: 'blocked',
      sourcePath: `${equipment.sourcePath}.equipAttrModifiers`,
      reason: `expected exactly one base-defense modifier, got ${baseDefenseEntries.length}`,
    });
  }
  const baseDefenseValues = baseDefenseEntries[0]?.modifier?.value ?? [];
  if (
    baseDefenseValues.length === 0 ||
    baseDefenseValues.some(value => value !== baseDefenseValues[0])
  ) {
    diagnostics.push({
      status: 'blocked',
      sourcePath: baseDefenseEntries[0]?.source.sourcePath ?? equipment.sourcePath,
      reason: 'GearDefinition.baseDefense cannot represent enhancement-dependent values',
    });
  }

  const traits = compileTraits(projected, diagnostics);
  if (diagnostics.some(diagnostic => diagnostic.status === 'blocked') || slotType === undefined) {
    return { diagnostics };
  }

  return {
    definition: {
      slug: equipment.equipmentId,
      assetSlug: equipment.identity.iconId,
      slotType,
      levelRequirement: equipment.minimumWearLevel,
      baseDefense: baseDefenseValues[0]!,
      traits,
      ...(equipment.suitId === '' ? {} : { gearSetSlug: equipment.suitId }),
    },
    diagnostics,
  };
}

function projectModifierLevels(source: EquipmentAttributeModifierSource): ProjectedModifierLevels {
  const projections = source.attributeValues.map(value =>
    projectEquipmentAttributeModifier(
      compileResolvedAttributeModifierSource({
        sourcePath: source.sourcePath,
        modifyAttributeType: source.modifyAttributeType,
        attributeType: source.attributeType,
        formulaItem: source.formulaItem,
        value,
      } satisfies ResolvedAttributeModifierSource),
    ),
  );
  const first = projections[0]!;
  if (projections.some(projection => projection.status !== first.status)) {
    return {
      source,
      status: 'blocked',
      reason: 'the same native modifier changes projection status between enhancement levels',
    };
  }
  if (first.status !== 'supported') {
    return { source, status: first.status, reason: first.reason };
  }
  if (
    projections.some(
      projection =>
        projection.status !== 'supported' ||
        modifierIdentity(projection.modifier) !== modifierIdentity(first.modifier),
    )
  ) {
    return {
      source,
      status: 'blocked',
      reason: 'the same native modifier changes semantic identity between enhancement levels',
    };
  }
  return {
    source,
    status: 'supported',
    modifier: {
      ...first.modifier,
      value: projections.map(projection =>
        projection.status === 'supported' ? projection.modifier.value : Number.NaN,
      ),
    },
  };
}

function compileTraits(
  projected: readonly ProjectedModifierLevels[],
  diagnostics: EquipmentDefinitionDiagnosticSource[],
): CompiledGearTraitDefinitionSource[] {
  const groups = new Map<number, ProjectedModifierLevels[]>();
  for (const entry of projected) {
    if (
      entry.status !== 'supported' ||
      (entry.modifier?.kind === 'panelStat' && entry.modifier.stat === 'baseDefense')
    ) {
      continue;
    }
    const group = groups.get(entry.source.attributeIndex) ?? [];
    group.push(entry);
    groups.set(entry.source.attributeIndex, group);
  }

  const traits: CompiledGearTraitDefinitionSource[] = [];
  for (const [attributeIndex, entries] of [...groups].sort(([left], [right]) => left - right)) {
    const levelCount = entries[0]!.source.attributeValues.length;
    if (entries.some(entry => entry.source.attributeValues.length !== levelCount)) {
      diagnostics.push({
        status: 'blocked',
        sourcePath: entries[0]!.source.sourcePath,
        reason: `attrIndex ${attributeIndex} contains inconsistent enhancement level counts`,
      });
      continue;
    }
    traits.push({
      key: `attribute-${attributeIndex}`,
      levelCount,
      modifiers: entries.map(entry => toFormalModifier(entry.modifier!)),
    });
  }
  return traits;
}

function toFormalModifier(
  modifier: NonNullable<ProjectedModifierLevels['modifier']>,
): CompiledEquipmentModifierDefinitionSource {
  switch (modifier.kind) {
    case 'attribute':
      return {
        kind: 'attribute',
        attribute: modifier.attribute,
        operation: modifier.operation,
        value: modifier.value,
      };
    case 'panelStat':
      if (modifier.stat === 'baseDefense') {
        throw new Error('baseDefense must be lifted before compiling gear traits');
      }
      return { kind: 'panelStat', stat: modifier.stat, value: modifier.value };
    case 'damageScale':
      return { kind: 'damageScale', target: modifier.target, value: modifier.value };
    case 'staticHealingIncrease':
      return {
        kind: 'staticHealingIncrease',
        target: modifier.target,
        value: modifier.value,
      };
  }
}

function modifierIdentity(modifier: ProjectedEquipmentModifierSource): string {
  switch (modifier.kind) {
    case 'attribute':
      return `${modifier.kind}/${modifier.attribute}/${modifier.operation}`;
    case 'panelStat':
      return `${modifier.kind}/${modifier.stat}`;
    case 'damageScale':
      return `${modifier.kind}/${modifier.target}`;
    case 'staticHealingIncrease':
      return `${modifier.kind}/${modifier.target}`;
  }
}
