import { compileResolvedAttributeModifierSource } from '../../compiler/attributeModifier.ts';
import { compilePassiveSkillRequestBatch } from '../../compiler/passiveSkillBatch.ts';
import { materializePassiveSkillInstallation } from '../../compiler/passiveSkillInstallation.ts';
import { requireRecord } from '../../source/primitives.ts';
import { discoverEquipmentSuitPassiveSkillRequests } from './passiveDiscovery.ts';
import type {
  CompiledEquipmentModifierDefinitionSource,
  EquipmentDefinitionDiagnosticSource,
} from './formalDefinition.ts';
import { projectEquipmentAttributeModifier } from './projection.ts';

export interface CompiledGearSetStaticDefinitionSource {
  readonly slug: string;
  readonly modifiers: readonly CompiledEquipmentModifierDefinitionSource[];
}

/** 静态定义之外仍需由 Buff/条件/动作编译器装配的原生依赖。 */
export interface CompiledGearSetRuntimeDependencySource {
  readonly suitId: string;
  readonly skillId: string;
  readonly startupBuffIds: readonly string[];
  readonly toggleBuffIds: readonly string[];
  readonly referencedBuffIds: readonly string[];
}

export interface CompiledEquipmentSuitStaticDefinitionBatchSource {
  readonly definitions: readonly CompiledGearSetStaticDefinitionSource[];
  readonly runtimeDependencies: readonly CompiledGearSetRuntimeDependencySource[];
  readonly diagnostics: readonly EquipmentDefinitionDiagnosticSource[];
}

/**
 * 把套装 CardSkill 中构筑期即可确定的属性投影为正式 GearSetDefinition 候选。
 * Buff、ToggleBuff 和动作图只列为运行时依赖，调用方在这些依赖闭合前不得把候选注册成完整套装。
 */
export function compileEquipmentSuitStaticDefinitionBatchSource(
  equipSuitTableValue: unknown,
  skillDataValue: unknown,
  skillPatchValue: unknown,
  suitIds?: readonly string[],
): CompiledEquipmentSuitStaticDefinitionBatchSource {
  const equipSuitTable = requireRecord(equipSuitTableValue, 'EquipSuitTable');
  const selectedSuitIds = [...(suitIds ?? Object.keys(equipSuitTable))].sort((left, right) =>
    left.localeCompare(right),
  );
  const requests = discoverEquipmentSuitPassiveSkillRequests(
    equipSuitTable,
    selectedSuitIds,
    'EquipSuitTable',
  );
  const batch = compilePassiveSkillRequestBatch(
    requests,
    skillDataValue,
    skillPatchValue,
    'SkillData',
  );
  const definitionsBySkillId = new Map(batch.definitions.map(entry => [entry.skillId, entry]));
  const definitions: CompiledGearSetStaticDefinitionSource[] = [];
  const runtimeDependencies: CompiledGearSetRuntimeDependencySource[] = [];
  const diagnostics: EquipmentDefinitionDiagnosticSource[] = [];
  const seenSuitIds = new Set<string>();

  for (const request of requests) {
    if (seenSuitIds.has(request.originId)) {
      throw new Error(
        `EquipSuitTable: suit ${JSON.stringify(request.originId)} has multiple thresholds`,
      );
    }
    seenSuitIds.add(request.originId);
    if (
      request.levelSource.kind !== 'equipmentSuitThreshold' ||
      request.levelSource.requiredCount !== 3
    ) {
      throw new Error(`${request.sourcePath}: Next GearSetDefinition requires exactly 3 pieces`);
    }
    const compiled = definitionsBySkillId.get(request.skillId);
    if (compiled === undefined) {
      throw new Error(
        `${request.sourcePath}: compiled passive skill ${request.skillId} is missing`,
      );
    }
    const installation = materializePassiveSkillInstallation(request, compiled);
    const modifiers: CompiledEquipmentModifierDefinitionSource[] = [];
    const blockedBefore = diagnostics.filter(entry => entry.status === 'blocked').length;
    for (const [
      index,
      nativeModifier,
    ] of compiled.definition.skill.cardAttributeModifiers.modifiers.entries()) {
      const sourcePath = `${compiled.sourcePath}.cardAttributeModifier.attributeModifiers[${index}]`;
      const value =
        nativeModifier.parameter.blackboardKey === null
          ? nativeModifier.parameter.value
          : installation.blackboard[nativeModifier.parameter.blackboardKey];
      if (value === undefined) {
        diagnostics.push({
          status: 'blocked',
          sourcePath,
          reason: `missing materialized blackboard value ${JSON.stringify(nativeModifier.parameter.blackboardKey)}`,
        });
        continue;
      }
      const projection = projectEquipmentAttributeModifier(
        compileResolvedAttributeModifierSource({
          sourcePath,
          modifyAttributeType: nativeModifier.modifyAttributeType,
          attributeType: nativeModifier.attributeType,
          formulaItem: nativeModifier.formulaItem,
          value,
        }),
      );
      if (projection.status !== 'supported') {
        diagnostics.push({ status: projection.status, sourcePath, reason: projection.reason });
        continue;
      }
      modifiers.push(toFormalModifier(projection.modifier));
    }
    if (diagnostics.filter(entry => entry.status === 'blocked').length === blockedBefore) {
      definitions.push({ slug: request.originId, modifiers });
    }

    const skill = compiled.definition.skill;
    runtimeDependencies.push({
      suitId: request.originId,
      skillId: request.skillId,
      startupBuffIds: skill.startupBuffs.map(entry => entry.buffId),
      toggleBuffIds: skill.toggleBuffs.flatMap(group => group.buffs.map(entry => entry.buffId)),
      referencedBuffIds: skill.references
        .filter(
          (
            reference,
          ): reference is typeof reference & { readonly kind: 'buff'; readonly id: string } =>
            reference.kind === 'buff' && reference.id !== null,
        )
        .map(reference => reference.id)
        .sort((left, right) => left.localeCompare(right)),
    });
  }

  return { definitions, runtimeDependencies, diagnostics };
}

function toFormalModifier(
  modifier: import('./projection.ts').ProjectedEquipmentModifierSource,
): CompiledEquipmentModifierDefinitionSource {
  const value = [modifier.value] as const;
  switch (modifier.kind) {
    case 'attribute':
      return {
        kind: modifier.kind,
        attribute: modifier.attribute,
        operation: modifier.operation,
        value,
      };
    case 'panelStat':
      if (modifier.stat === 'baseDefense') {
        throw new Error('equipment suit CardSkill cannot define GearDefinition.baseDefense');
      }
      return { kind: modifier.kind, stat: modifier.stat, value };
    case 'damageScale':
      return { kind: modifier.kind, target: modifier.target, value };
    case 'staticHealingIncrease':
      return { kind: modifier.kind, target: modifier.target, value };
    case 'skillCooldownMultiplier':
      return { kind: modifier.kind, skillTypes: modifier.skillTypes, value };
  }
}
