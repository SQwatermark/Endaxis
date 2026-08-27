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
import type { PassiveSkillCompilationBatchSource } from '../../compiler/passiveSkillBatch.ts';
import { compileOperatorUpgradePassiveSkills } from './passiveSkillDefinition.ts';
import type { GameplayTagRegistry } from '../../../../../src/shared/gameplayTags.ts';
import type { BuffRuntimeSource } from '../../source/buffRuntime.ts';
import type { CombatActionProjectionExtensionsSource } from '../../compiler/combatProjectionCommon.ts';
import {
  collectCompiledBuffApplications,
  collectCompiledBuffIds,
  collectCompiledBuffIdentityReadIds,
} from '../../compiler/compiledBuffReferences.ts';
import { collectCombatInvisibleBuffClosureIds } from '../../compiler/combatInvisibleBuffClosure.ts';

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
  readonly gameplayTagRegistry: GameplayTagRegistry;
  readonly loadSkill: (id: string) => unknown;
  readonly loadBuff: (id: string) => unknown;
  readonly globalBuffCatalog: unknown;
  readonly skillSettingCatalog: unknown;
  readonly passiveSkills: PassiveSkillCompilationBatchSource;
  readonly createBuffProjectionExtensions?: (
    sources: ReadonlyMap<string, BuffRuntimeSource>,
    visualOnlyIds: ReadonlySet<string>,
  ) => CombatActionProjectionExtensionsSource;
}

/**
 * 整名候选的唯一装配层：只组合公共编译结果，不从旧 Operator 拷贝任何缺失字段。
 * 共享 Buff 独立返回给只读目录，不能因为当前干员用到它就变成干员私有资产。
 */
export function assembleOperatorDefinition(input: OperatorDefinitionAssemblyInput) {
  const { foundation } = input;
  const { skillLibrary, progression } = foundation;
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
  const talentPassivePlans = input.talentBindings.map(binding => {
    const effectIds = progression.talentNodes
      .filter(node => node.nodeType === 'passiveSkill' && node.passiveSkill.index === binding.index)
      .sort((left, right) => left.passiveSkill.level - right.passiveSkill.level)
      .map(node => node.talentEffectId);
    return compileOperatorUpgradePassiveSkills(
      effectIds,
      progression.talentPassiveSkillRequests,
      input.passiveSkills.definitions,
    );
  });
  const potentialPassivePlans = input.potentialBindings.map(binding => {
    const effectIds = progression.potential.unlocks
      .filter(unlock => unlock.level === binding.level)
      .map(unlock => unlock.effectId);
    return compileOperatorUpgradePassiveSkills(
      effectIds,
      progression.potentialPassiveSkillRequests,
      input.passiveSkills.definitions,
    );
  });
  const installedPassiveSkillSourcePaths = new Set([
    ...talentPassivePlans.flatMap(plan => plan.handledSourcePaths),
    ...potentialPassivePlans.flatMap(plan => plan.handledSourcePaths),
  ]);
  const passiveSkillKeys = new Set([
    ...talentPassivePlans.flatMap(plan => plan.definitions.map(definition => definition.key)),
    ...potentialPassivePlans.flatMap(plan => plan.definitions.map(definition => definition.key)),
  ]);
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
    installedPassiveSkillSourcePaths,
    passiveSkillKeys,
  };
  const talents = input.talentBindings.map((binding, index) => {
    const definition = compileOperatorTalentDefinition(progression, binding, context);
    const passiveSkills = talentPassivePlans[index]!.definitions;
    return passiveSkills.length ? { ...definition, passiveSkills } : definition;
  });
  const potentials = input.potentialBindings.map((binding, index) => {
    const definition = compileOperatorPotentialDefinition(progression, binding, context);
    const passiveSkills = potentialPassivePlans[index]!.definitions;
    return passiveSkills.length ? { ...definition, passiveSkills } : definition;
  });
  const skillGroups = skillLibrary.skillGroups.map(group => {
    return {
      key: group.key,
      skillType: group.skillType,
      levelSource: group.levelSource,
      skills:
        group.skillKeys.length === 1
          ? definitions.get(group.skillKeys[0]!)!
          : group.skillKeys.map(key => definitions.get(key)!),
      ...(group.variants.length === 0
        ? {}
        : {
            variants: group.variants.map(variant => ({
              key: variant.key,
              levelSource: variant.levelSource,
              skills:
                variant.skillKeys.length === 1
                  ? definitions.get(variant.skillKeys[0]!)!
                  : variant.skillKeys.map(key => definitions.get(key)!),
            })),
          }),
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
  const preliminaryAbilityEntityDefinitions = Object.fromEntries(
    [...bindings].map(([id, skillId]) => {
      const template = input.entityCatalog.byId.get(id);
      if (!template) throw new Error(`missing AbilityEntity ${id}`);
      return [id, compileAbilityEntityDefinitionSource(template, skillId, input.loadSkill)];
    }),
  );
  const preliminaryEntityBuffIds = collectCompiledBuffIds(preliminaryAbilityEntityDefinitions);
  const entityBuffIdentityReads = collectCompiledBuffIdentityReadIds(
    preliminaryAbilityEntityDefinitions,
  );
  const entityVisualOnlyBuffIds = new Set(
    [...collectCombatInvisibleBuffClosureIds([...preliminaryEntityBuffIds], input.loadBuff)].filter(
      id => !entityBuffIdentityReads.has(id),
    ),
  );
  const abilityEntityDefinitions = Object.fromEntries(
    [...bindings].map(([id, skillId]) => {
      const template = input.entityCatalog.byId.get(id);
      if (!template) throw new Error(`missing AbilityEntity ${id}`);
      return [
        id,
        compileAbilityEntityDefinitionSource(
          template,
          skillId,
          input.loadSkill,
          entityVisualOnlyBuffIds,
        ),
      ];
    }),
  );
  const roots = [
    ...new Set([
      ...input.activeSkills.flatMap(item => item.runtimeBuffIds),
      ...collectCompiledBuffIds(abilityEntityDefinitions),
      ...progression.compiledEffectBundles.flatMap(bundle =>
        bundle.entries.flatMap(entry => (entry.kind === 'buff' ? [entry.buffId] : [])),
      ),
      ...talentPassivePlans.flatMap(plan => plan.buffIds),
      ...potentialPassivePlans.flatMap(plan => plan.buffIds),
    ]),
  ];
  const rootBuffOwnerTargets = new Map<string, 'caster' | 'enemy' | 'currentAbilityEntity'>();
  const rootBuffOwnerTargetConflicts = new Set<string>();
  for (const application of collectCompiledBuffApplications([
    ...input.activeSkills.map(item => item.definition),
    abilityEntityDefinitions,
  ])) {
    if (
      application.target !== 'caster' &&
      application.target !== 'enemy' &&
      application.target !== 'currentAbilityEntity'
    )
      continue;
    const target = application.target;
    const previous = rootBuffOwnerTargets.get(application.buffId);
    if (previous === undefined && !rootBuffOwnerTargetConflicts.has(application.buffId))
      rootBuffOwnerTargets.set(application.buffId, target);
    else if (previous !== undefined && previous !== target) {
      rootBuffOwnerTargets.delete(application.buffId);
      rootBuffOwnerTargetConflicts.add(application.buffId);
    }
  }
  const buffClosure = compileStandardStumpBuffClosure(
    roots,
    input.loadBuff,
    input.globalBuffCatalog,
    input.skillSettingCatalog,
    {
      catalog: input.entityCatalog,
      gameplayTagRegistry: input.gameplayTagRegistry,
    },
    input.createBuffProjectionExtensions,
    rootBuffOwnerTargets,
    new Set([
      ...entityBuffIdentityReads,
      ...collectCompiledBuffIdentityReadIds(input.activeSkills.map(item => item.definition)),
    ]),
  );
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
      omittedEntityVisualOnlyBuffIds: [...entityVisualOnlyBuffIds],
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
