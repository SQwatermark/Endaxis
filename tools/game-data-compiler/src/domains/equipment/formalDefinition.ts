import type {
  GearDefinition,
  GearSlotType,
  GearTraitDefinition,
} from '../../../../../packages/game-data-contract/src/equipment.ts';
import { compileResolvedAttributeModifierSource } from '../../compiler/attributeModifier.ts';
import { isBuildContributionModifier } from '../../compiler/buildAttributeProjection.ts';
import type {
  EquipmentAttributeModifierSource,
  EquipmentItemSource,
  EquipmentPartTypeSource,
} from '../../source/equipmentAttributeModifiers.ts';
import {
  projectEquipmentAttributeModifier,
  type EquipmentAttributeModifierProjectionSource,
} from './projection.ts';
import type {
  BuildDefinitionDiagnosticSource,
  CompiledBuildModifierDefinitionSource,
} from '../../compiler/formalBuildDefinition.ts';

export type EquipmentDefinitionDiagnosticSource = BuildDefinitionDiagnosticSource;
export type CompiledEquipmentModifierDefinitionSource = CompiledBuildModifierDefinitionSource;

// 兼容旧导入路径；槽位身份的唯一声明位于独立契约。
export type { GearSlotType as CompiledGearSlotTypeSource } from '../../../../../packages/game-data-contract/src/equipment.ts';

/** 正式装备词条的静态输出子集，不是来源或优化 IR。 */
export type CompiledGearTraitDefinitionSource = Readonly<
  Pick<GearTraitDefinition, 'key' | 'levelCount'>
> & {
  readonly modifiers: readonly CompiledEquipmentModifierDefinitionSource[];
};

export type CompiledGearDefinitionSource = Readonly<
  Pick<GearDefinition, 'slug' | 'slotType' | 'levelRequirement' | 'baseDefense' | 'gearSetSlug'> &
    Required<Pick<GearDefinition, 'assetSlug'>>
> & {
  readonly traits: readonly CompiledGearTraitDefinitionSource[];
};

export interface CompiledEquipmentDefinitionSource {
  readonly definition?: CompiledGearDefinitionSource;
  readonly diagnostics: readonly EquipmentDefinitionDiagnosticSource[];
}

export interface CompiledEquipmentDefinitionBatchSource {
  readonly definitions: readonly CompiledGearDefinitionSource[];
  readonly diagnostics: readonly EquipmentDefinitionDiagnosticSource[];
}

const GEAR_SLOT_BY_PART_TYPE: Readonly<Partial<Record<EquipmentPartTypeSource, GearSlotType>>> = {
  Body: 'armor',
  Hand: 'gloves',
  EDC: 'accessory',
};

type ProjectedModifierLevels = EquipmentAttributeModifierProjectionSource<readonly number[]> & {
  readonly origin: EquipmentAttributeModifierSource;
};

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
      sourcePath: entry.origin.sourcePath,
      reason: entry.reason,
    });
  }

  const baseDefenseEntries = projected.filter(
    entry =>
      entry.status === 'supported' &&
      entry.modifier.kind === 'panelStat' &&
      entry.modifier.stat === 'baseDefense',
  );
  if (baseDefenseEntries.length !== 1) {
    diagnostics.push({
      status: 'blocked',
      sourcePath: `${equipment.sourcePath}.equipAttrModifiers`,
      reason: `expected exactly one base-defense modifier, got ${baseDefenseEntries.length}`,
    });
  }
  const baseDefenseEntry = baseDefenseEntries[0];
  const baseDefenseValues =
    baseDefenseEntry?.status === 'supported' ? baseDefenseEntry.modifier.value : [];
  if (
    baseDefenseValues.length === 0 ||
    baseDefenseValues.some(value => value !== baseDefenseValues[0])
  ) {
    diagnostics.push({
      status: 'blocked',
      sourcePath: baseDefenseEntries[0]?.origin.sourcePath ?? equipment.sourcePath,
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

/** 批量入口固定按原生装备 ID 排序，并在渲染前关闭重复身份。 */
export function compileEquipmentDefinitionBatchSource(
  equipment: readonly EquipmentItemSource[],
): CompiledEquipmentDefinitionBatchSource {
  const ordered = [...equipment].sort((left, right) =>
    left.equipmentId.localeCompare(right.equipmentId),
  );
  const identities = new Set<string>();
  const definitions: CompiledGearDefinitionSource[] = [];
  const diagnostics: EquipmentDefinitionDiagnosticSource[] = [];
  for (const item of ordered) {
    if (identities.has(item.equipmentId)) {
      throw new Error(`duplicate equipment definition source ${JSON.stringify(item.equipmentId)}`);
    }
    identities.add(item.equipmentId);
    const result = compileEquipmentDefinitionSource(item);
    diagnostics.push(...result.diagnostics);
    if (result.definition !== undefined) definitions.push(result.definition);
  }
  return { definitions, diagnostics };
}

function projectModifierLevels(source: EquipmentAttributeModifierSource): ProjectedModifierLevels {
  const projection = projectEquipmentAttributeModifier(
    compileResolvedAttributeModifierSource({
      sourcePath: source.sourcePath,
      modifyAttributeType: source.modifyAttributeType,
      attributeType: source.attributeType,
      formulaItem: source.formulaItem,
      value: source.attributeValues,
    }),
  );
  return { ...projection, origin: source };
}

function compileTraits(
  projected: readonly ProjectedModifierLevels[],
  diagnostics: EquipmentDefinitionDiagnosticSource[],
): CompiledGearTraitDefinitionSource[] {
  const groups = new Map<number, ProjectedModifierLevels[]>();
  for (const entry of projected) {
    if (entry.status !== 'supported' || !isBuildContributionModifier(entry.modifier)) {
      continue;
    }
    const group = groups.get(entry.origin.attributeIndex) ?? [];
    group.push(entry);
    groups.set(entry.origin.attributeIndex, group);
  }

  const traits: CompiledGearTraitDefinitionSource[] = [];
  for (const [attributeIndex, entries] of [...groups].sort(([left], [right]) => left - right)) {
    const levelCount = entries[0]!.origin.attributeValues.length;
    if (entries.some(entry => entry.origin.attributeValues.length !== levelCount)) {
      diagnostics.push({
        status: 'blocked',
        sourcePath: entries[0]!.origin.sourcePath,
        reason: `attrIndex ${attributeIndex} contains inconsistent enhancement level counts`,
      });
      continue;
    }
    traits.push({
      key: `attribute-${attributeIndex}`,
      levelCount,
      modifiers: entries.flatMap(entry =>
        entry.status === 'supported' && isBuildContributionModifier(entry.modifier)
          ? [entry.modifier]
          : [],
      ),
    });
  }
  return traits;
}
