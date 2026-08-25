import { compileResolvedAttributeModifierSource } from '../../compiler/attributeModifier.ts';
import { compilePassiveSkillRequestBatch } from '../../compiler/passiveSkillBatch.ts';
import {
  materializePassiveBuffInstallation,
  materializePassiveSkillInstallation,
  type MaterializedPassiveBuffInstallationSource,
  type MaterializedPassiveSkillInstallationSource,
  type UnresolvedPassiveSkillBlackboardValueSource,
} from '../../compiler/passiveSkillInstallation.ts';
import type { CompiledPassiveSkillDefinitionSource } from '../../compiler/passiveSkillBatch.ts';
import type { PassiveSkillCompileRequestSource } from '../../compiler/passiveSkillRequest.ts';
import type { ProjectedWeaponTypeSource } from '../../compiler/weaponType.ts';
import type {
  BuildDefinitionDiagnosticSource,
  CompiledBuildModifierDefinitionSource,
} from '../../compiler/formalBuildDefinition.ts';
import {
  projectBuildAttributeModifier,
  type ProjectedBuildModifierSource,
} from '../../compiler/buildAttributeProjection.ts';
import { parseWeaponBaseAttackSources } from './baseAttack.ts';
import { parseWeaponBasicSources } from './basicTable.ts';
import { discoverWeaponPassiveSkillRequests } from './passiveDiscovery.ts';

const FORMAL_BASE_ATTACK_LEVELS = [1, 20, 40, 60, 80, 90] as const;
const FORMAL_WEAPON_RARITIES = new Set([3, 4, 5, 6]);

export interface CompiledWeaponTraitStaticDefinitionSource {
  readonly key: string;
  readonly levelCount: number;
  readonly modifiers: readonly CompiledBuildModifierDefinitionSource[];
}

/** 尚未装配 Buff/动作图的正式 WeaponDefinition 候选。 */
export interface CompiledWeaponStaticDefinitionSource {
  readonly slug: string;
  readonly rarity: 3 | 4 | 5 | 6;
  readonly weaponType: ProjectedWeaponTypeSource;
  readonly baseAttackAtLevelNodes: readonly number[];
  readonly traits: readonly CompiledWeaponTraitStaticDefinitionSource[];
}

export interface CompiledWeaponToggleConditionSource {
  readonly kind: 'currentHpRatio';
  readonly comparison: string;
  readonly value: number | UnresolvedPassiveSkillBlackboardValueSource;
}

export interface CompiledWeaponToggleBuffGroupSource {
  readonly conditions: readonly CompiledWeaponToggleConditionSource[];
  readonly buffs: readonly MaterializedPassiveBuffInstallationSource[];
}

/** 一条武器词条在一个真实 SkillPatch 等级上的安装输入。 */
export interface CompiledWeaponTraitLevelRuntimeDependencySource {
  readonly level: number;
  readonly installation: MaterializedPassiveSkillInstallationSource;
  readonly startupBuffs: readonly MaterializedPassiveBuffInstallationSource[];
  readonly toggleBuffs: readonly CompiledWeaponToggleBuffGroupSource[];
}

/** 静态属性之外仍须交给公共 Buff/动作编译器闭合的词条依赖。 */
export interface CompiledWeaponTraitRuntimeDependencySource {
  readonly weaponId: string;
  readonly traitKey: string;
  readonly slotIndex: number;
  readonly skillId: string;
  readonly levels: readonly CompiledWeaponTraitLevelRuntimeDependencySource[];
  readonly referencedBuffIds: readonly string[];
}

export interface CompiledWeaponStaticDefinitionBatchSource {
  readonly definitions: readonly CompiledWeaponStaticDefinitionSource[];
  readonly runtimeDependencies: readonly CompiledWeaponTraitRuntimeDependencySource[];
  readonly diagnostics: readonly BuildDefinitionDiagnosticSource[];
}

/**
 * 编译武器中无需运行时解释即可确定的正式定义部分。
 *
 * 身份暂时使用原生 weaponId；展示名、图标和稳定公开 slug 必须由独立身份表提供，不能从
 * modelPath 或文本猜测。只要任一静态词条被阻断，该武器就不会出现在 definitions 中；但
 * 已解析的逐档运行依赖仍完整返回，供后续 Buff/动作闭包审计使用。
 */
export function compileWeaponStaticDefinitionBatchSource(
  weaponBasicTableValue: unknown,
  weaponUpgradeTemplateTableValue: unknown,
  skillDataValue: unknown,
  skillPatchValue: unknown,
  weaponIds?: readonly string[],
): CompiledWeaponStaticDefinitionBatchSource {
  const selectedIds = [
    ...(weaponIds ?? Object.keys(requireWeaponTable(weaponBasicTableValue))),
  ].sort((left, right) => left.localeCompare(right));
  const weapons = parseWeaponBasicSources(weaponBasicTableValue, selectedIds);
  const baseAttackSources = parseWeaponBaseAttackSources(
    weaponBasicTableValue,
    weaponUpgradeTemplateTableValue,
    selectedIds,
  );
  const requests = discoverWeaponPassiveSkillRequests(weaponBasicTableValue, selectedIds);
  const passiveBatch = compilePassiveSkillRequestBatch(requests, skillDataValue, skillPatchValue);
  const baseAttackByWeaponId = new Map(baseAttackSources.map(source => [source.weaponId, source]));
  const compiledBySkillId = new Map(
    passiveBatch.definitions.map(definition => [definition.skillId, definition]),
  );
  const requestsByWeaponId = groupRequestsByWeapon(requests);
  const definitions: CompiledWeaponStaticDefinitionSource[] = [];
  const runtimeDependencies: CompiledWeaponTraitRuntimeDependencySource[] = [];
  const diagnostics: BuildDefinitionDiagnosticSource[] = [];

  for (const weapon of weapons) {
    const blockedBefore = blockedCount(diagnostics);
    const baseAttack = baseAttackByWeaponId.get(weapon.weaponId)!;
    const baseAttackAtLevelNodes = FORMAL_BASE_ATTACK_LEVELS.map(level => {
      const row = baseAttack.upgradeLevels.find(entry => entry.weaponLevel === level);
      if (row === undefined) {
        diagnostics.push({
          status: 'blocked',
          sourcePath: `${baseAttack.sourcePath}.levelTemplateId`,
          reason: `WeaponDefinition requires an exact base-attack row at level ${level}`,
        });
        return Number.NaN;
      }
      return row.baseAttack;
    });
    if (!FORMAL_WEAPON_RARITIES.has(weapon.rarity)) {
      diagnostics.push({
        status: 'blocked',
        sourcePath: `${weapon.sourcePath}.rarity`,
        reason: `WeaponDefinition cannot represent rarity ${weapon.rarity}`,
      });
    }

    const traits: CompiledWeaponTraitStaticDefinitionSource[] = [];
    for (const request of requestsByWeaponId.get(weapon.weaponId) ?? []) {
      const compiled = requireCompiledSkill(request, compiledBySkillId);
      const levels = [...compiled.definition.blackboard.levels];
      const traitKey = `skill${request.levelSource.kind === 'weaponProgression' ? request.levelSource.slotIndex + 1 : traits.length + 1}`;
      const installations = levels.map(level =>
        materializePassiveSkillInstallation(request, compiled, level),
      );
      traits.push({
        key: traitKey,
        levelCount: levels.length,
        modifiers: compileTraitModifiers(compiled, installations, diagnostics),
      });
      runtimeDependencies.push({
        weaponId: weapon.weaponId,
        traitKey,
        slotIndex:
          request.levelSource.kind === 'weaponProgression' ? request.levelSource.slotIndex : -1,
        skillId: request.skillId,
        levels: installations.map(installation => ({
          level: installation.level,
          installation,
          startupBuffs: compiled.definition.skill.startupBuffs.map(buff =>
            materializePassiveBuffInstallation(buff, installation.blackboard),
          ),
          toggleBuffs: compileToggleBuffs(compiled, installation),
        })),
        referencedBuffIds: compiled.definition.skill.references
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

    if (blockedCount(diagnostics) === blockedBefore && FORMAL_WEAPON_RARITIES.has(weapon.rarity)) {
      definitions.push({
        slug: weapon.weaponId,
        rarity: weapon.rarity as 3 | 4 | 5 | 6,
        weaponType: weapon.weaponType,
        baseAttackAtLevelNodes,
        traits,
      });
    }
  }

  return { definitions, runtimeDependencies, diagnostics };
}

function requireWeaponTable(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('WeaponBasicTable: expected an object');
  }
  return value as Record<string, unknown>;
}

function groupRequestsByWeapon(
  requests: readonly PassiveSkillCompileRequestSource[],
): Map<string, PassiveSkillCompileRequestSource[]> {
  const result = new Map<string, PassiveSkillCompileRequestSource[]>();
  for (const request of requests) {
    const group = result.get(request.originId) ?? [];
    group.push(request);
    result.set(request.originId, group);
  }
  return result;
}

function requireCompiledSkill(
  request: PassiveSkillCompileRequestSource,
  definitions: ReadonlyMap<string, CompiledPassiveSkillDefinitionSource>,
): CompiledPassiveSkillDefinitionSource {
  const compiled = definitions.get(request.skillId);
  if (compiled === undefined) {
    throw new Error(`${request.sourcePath}: compiled passive skill ${request.skillId} is missing`);
  }
  return compiled;
}

function compileTraitModifiers(
  compiled: CompiledPassiveSkillDefinitionSource,
  installations: readonly MaterializedPassiveSkillInstallationSource[],
  diagnostics: BuildDefinitionDiagnosticSource[],
): CompiledBuildModifierDefinitionSource[] {
  return compiled.definition.skill.cardAttributeModifiers.modifiers.flatMap(
    (nativeModifier, modifierIndex) => {
      const sourcePath = `${compiled.sourcePath}.cardAttributeModifier.attributeModifiers[${modifierIndex}]`;
      const projected = installations.map(installation => {
        const key = nativeModifier.parameter.blackboardKey;
        const value = key === null ? nativeModifier.parameter.value : installation.blackboard[key];
        if (value === undefined) {
          return {
            status: 'missing' as const,
            reason: `missing materialized blackboard value ${JSON.stringify(key)}`,
          };
        }
        return projectBuildAttributeModifier(
          compileResolvedAttributeModifierSource({
            sourcePath,
            modifyAttributeType: nativeModifier.modifyAttributeType,
            attributeType: nativeModifier.attributeType,
            formulaItem: nativeModifier.formulaItem,
            value,
          }),
        );
      });
      const first = projected[0]!;
      if (first.status === 'missing') {
        diagnostics.push({ status: 'blocked', sourcePath, reason: first.reason });
        return [];
      }
      if (first.status !== 'supported') {
        diagnostics.push({ status: first.status, sourcePath, reason: first.reason });
        return [];
      }
      if (
        projected.some(
          entry =>
            entry.status !== 'supported' ||
            modifierIdentity(entry.modifier) !== modifierIdentity(first.modifier),
        )
      ) {
        diagnostics.push({
          status: 'blocked',
          sourcePath,
          reason: 'weapon trait modifier changes semantic identity between SkillPatch levels',
        });
        return [];
      }
      return [
        toFormalModifier(
          first.modifier,
          projected.map(entry =>
            entry.status === 'supported' ? entry.modifier.value : Number.NaN,
          ),
        ),
      ];
    },
  );
}

function compileToggleBuffs(
  compiled: CompiledPassiveSkillDefinitionSource,
  installation: MaterializedPassiveSkillInstallationSource,
): CompiledWeaponToggleBuffGroupSource[] {
  return compiled.definition.skill.toggleBuffs.map((group, groupIndex) => ({
    conditions: group.conditions.map((condition, conditionIndex) => {
      if (condition.kind !== 'currentHpRatio') {
        throw new Error(
          `${compiled.sourcePath}.toggleBuffs[${groupIndex}].conditions[${conditionIndex}]: unsupported weapon toggle condition ${JSON.stringify(condition.kind)}`,
        );
      }
      const key = condition.value.blackboardKey;
      const value = key === null ? condition.value.value : installation.blackboard[key];
      return {
        kind: 'currentHpRatio' as const,
        comparison: condition.comparison,
        value: value ?? { kind: 'unresolvedSkillBlackboard' as const, key: key! },
      };
    }),
    buffs: group.buffs.map(buff =>
      materializePassiveBuffInstallation(buff, installation.blackboard),
    ),
  }));
}

function toFormalModifier(
  modifier: ProjectedBuildModifierSource,
  value: readonly number[],
): CompiledBuildModifierDefinitionSource {
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
        throw new Error('weapon CardSkill cannot define GearDefinition.baseDefense');
      }
      return { kind: modifier.kind, stat: modifier.stat, value };
    case 'damageScale':
      return { kind: modifier.kind, target: modifier.target, slot: modifier.slot, value };
    case 'staticHealingIncrease':
      return { kind: modifier.kind, target: modifier.target, value };
    case 'skillCooldownMultiplier':
      return { kind: modifier.kind, skillTypes: modifier.skillTypes, value };
  }
}

function modifierIdentity(modifier: ProjectedBuildModifierSource): string {
  switch (modifier.kind) {
    case 'attribute':
      return `${modifier.kind}/${modifier.attribute}/${modifier.operation}`;
    case 'panelStat':
      return `${modifier.kind}/${modifier.stat}`;
    case 'damageScale':
      return `${modifier.kind}/${modifier.target}/${modifier.slot}`;
    case 'staticHealingIncrease':
      return `${modifier.kind}/${modifier.target}`;
    case 'skillCooldownMultiplier':
      return `${modifier.kind}/${modifier.skillTypes}`;
  }
}

function blockedCount(diagnostics: readonly BuildDefinitionDiagnosticSource[]): number {
  return diagnostics.filter(entry => entry.status === 'blocked').length;
}
