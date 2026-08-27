import type {
  OperatorDefinition,
  SkillDefinition,
  SkillGroupDefinition,
} from '../../../../../packages/game-data-contract/src/index.ts';
import type { compileOperatorFoundationSource } from './sourceClosure.ts';
import { compileOperatorDefinitionHeaderSource } from './definitionHeader.ts';
import {
  compileOperatorTalentDefinition,
  compileOperatorPotentialDefinition,
} from './progressionDefinition.ts';
import type { CompiledOperatorActiveSkillRuntimeDefinitionSource } from './activeSkillRuntimeDefinition.ts';
import type { CompiledAbilityEntityTemplateCatalogSource } from '../../compiler/abilityEntityCatalog.ts';
import { compileAbilityEntityDefinitionSource } from '../../compiler/abilityEntityDefinition.ts';
import { compileStandardStumpBuffClosure } from '../../compiler/standardStumpBuffClosure.ts';
import type { CompiledBuffDefinitionSource } from '../../compiler/buffProjectionTypes.ts';
import { assignGeneratedDamageStepKeys } from '../../compiler/definitionStepKeys.ts';

export interface OperatorDefinitionAssemblyInput {
  readonly foundation: ReturnType<typeof compileOperatorFoundationSource>;
  readonly activeSkills: readonly {
    readonly definition: CompiledOperatorActiveSkillRuntimeDefinitionSource;
    readonly runtimeBuffIds: readonly string[];
    readonly abilityEntitySpawns: readonly {
      readonly abilityEntityId: string;
      readonly skillId: string;
      readonly sourcePath: string;
    }[];
  }[];
  readonly talentBindings: readonly { readonly index: number; readonly key: string }[];
  readonly potentialBindings: readonly { readonly level: number; readonly key: string }[];
  readonly entityCatalog: CompiledAbilityEntityTemplateCatalogSource;
  readonly loadSkill: (id: string) => unknown;
  readonly loadBuff: (id: string) => unknown;
}

/**
 * 整名候选的唯一装配层：只组合公共编译结果，不从旧 Operator 拷贝任何缺失字段。
 * 共享 Buff 独立返回给只读目录，不能因为当前干员用到它就变成干员私有资产。
 */
export function assembleOperatorDefinition(input: OperatorDefinitionAssemblyInput) {
  const { foundation } = input;
  const { skillLibrary, progression } = foundation;
  if (
    progression.talentPassiveSkillRequests.length ||
    progression.potentialPassiveSkillRequests.length
  )
    throw new Error('operator assembly: passive SkillData installation is not yet supported');
  const nativeTalentIndices = [
    ...new Set(
      progression.talentNodes.flatMap(node =>
        node.nodeType === 'passiveSkill' ? [node.passiveSkill.index] : [],
      ),
    ),
  ].sort();
  requireExactIdentities(
    nativeTalentIndices,
    input.talentBindings.map(item => item.index),
    'talents',
  );
  requireExactIdentities(
    progression.potential.unlocks.map(item => item.level),
    input.potentialBindings.map(item => item.level),
    'potentials',
  );
  const definitions = new Map<string, SkillDefinition>();
  for (const item of input.activeSkills) {
    if (definitions.has(item.definition.key))
      throw new Error(`duplicate skill ${item.definition.key}`);
    const expected = skillLibrary.activeSkills.entries.find(
      entry => entry.key === item.definition.key,
    );
    if (!expected || expected.skillId !== item.definition.sourceSkillId)
      throw new Error(`skill identity mismatch ${item.definition.key}`);
    definitions.set(
      item.definition.key,
      assignGeneratedDamageStepKeys(item.definition, item.definition.sourceSkillId),
    );
  }
  requireExactIdentities(
    skillLibrary.activeSkills.entries.map(item => item.key),
    [...definitions.keys()],
    'skills',
  );
  const context = {
    skills: skillLibrary.activeSkills.entries,
    skillGroups: skillLibrary.skillGroups,
    costResources: new Map(
      input.activeSkills.flatMap(item =>
        item.definition.costs?.length === 1
          ? [[item.definition.sourceSkillId, item.definition.costs[0]!.resource] as const]
          : [],
      ),
    ),
  };
  const talents = input.talentBindings.map(binding =>
    compileOperatorTalentDefinition(progression, binding, context),
  );
  const potentials = input.potentialBindings.map(binding =>
    compileOperatorPotentialDefinition(progression, binding, context),
  );
  const skillGroups = skillLibrary.skillGroups.map(group => {
    if (group.variants.length)
      throw new Error(`${group.key}: variant assembly is not yet supported`);
    return {
      key: group.key,
      skillType: group.skillType,
      levelSource: group.levelSource,
      skills:
        group.skillKeys.length === 1
          ? definitions.get(group.skillKeys[0]!)!
          : group.skillKeys.map(key => definitions.get(key)!),
    } satisfies SkillGroupDefinition;
  });
  const bindings = new Map<string, string>();
  for (const spawn of input.activeSkills.flatMap(item => item.abilityEntitySpawns)) {
    if (
      bindings.has(spawn.abilityEntityId) &&
      bindings.get(spawn.abilityEntityId) !== spawn.skillId
    )
      throw new Error(`${spawn.sourcePath}: one template is spawned with different child skills`);
    bindings.set(spawn.abilityEntityId, spawn.skillId);
  }
  const abilityEntityDefinitions = Object.fromEntries(
    [...bindings].map(([id, skillId]) => {
      const template = input.entityCatalog.byId.get(id);
      if (!template) throw new Error(`missing AbilityEntity ${id}`);
      return [id, compileAbilityEntityDefinitionSource(template, skillId, input.loadSkill)];
    }),
  );
  const roots = [
    ...new Set([
      ...input.activeSkills.flatMap(item => item.runtimeBuffIds),
      ...progression.compiledEffectBundles.flatMap(bundle =>
        bundle.entries.flatMap(entry => (entry.kind === 'buff' ? [entry.buffId] : [])),
      ),
    ]),
  ];
  const buffClosure = compileStandardStumpBuffClosure(roots, input.loadBuff);
  const blocked = buffClosure.diagnostics.filter(item => item.status === 'blocked');
  if (blocked.length) throw new Error(`operator Buff closure blocked: ${JSON.stringify(blocked)}`);
  const privateBuffs: Record<string, CompiledBuffDefinitionSource> = {},
    commonBuffs: Record<string, CompiledBuffDefinitionSource> = {};
  for (const [id, definition] of Object.entries(buffClosure.definitions)) {
    if (id.startsWith('buff_common_')) commonBuffs[id] = definition;
    else if (id.startsWith(`buff_${foundation.identity.characterId}_`))
      privateBuffs[id] = definition;
    else throw new Error(`Buff ownership is not established: ${id}`);
  }
  const { sourceCharacterId: _sourceCharacterId, ...header } =
    compileOperatorDefinitionHeaderSource(foundation);
  const operator: OperatorDefinition = {
    ...header,
    skillGroups,
    talents,
    potentials,
    buffDefinitions: privateBuffs,
    abilityEntityDefinitions,
  };
  return {
    operator,
    commonBuffDefinitions: commonBuffs,
    audit: {
      scope: 'operator-definition-candidate',
      rootBuffIds: roots,
      buffSourceCount: buffClosure.sources.size,
      omittedBuffIds: [...buffClosure.omittedBuffIds],
      entityBindings: [...bindings],
      diagnostics: buffClosure.diagnostics,
    },
  };
}

function requireExactIdentities(
  expected: readonly (string | number)[],
  actual: readonly (string | number)[],
  label: string,
) {
  if (
    new Set(actual).size !== actual.length ||
    JSON.stringify([...expected].sort()) !== JSON.stringify([...actual].sort())
  )
    throw new Error(`${label}: complete unique bindings are required`);
}
