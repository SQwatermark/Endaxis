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
import { compileAbilityEntityTemplateCatalogSource } from '../../compiler/abilityEntityCatalog.ts';
import { compileAbilityEntityDefinitionSource } from '../../compiler/abilityEntityDefinition.ts';
import { compileStandardStumpBuffClosure } from '../../compiler/standardStumpBuffClosure.ts';
import type { CompiledBuffDefinitionSource } from '../../compiler/buffProjectionTypes.ts';
import { assignGeneratedDamageStepKeys } from '../../compiler/definitionStepKeys.ts';
import type { PassiveSkillCompilationBatchSource } from '../../compiler/passiveSkillBatch.ts';
import { compileOperatorUpgradePassiveSkills } from './passiveSkillDefinition.ts';
import type { GameplayTagRegistry } from '../../source/nativeGameplayTags.ts';
import type { BuffRuntimeSource } from '../../source/buffRuntime.ts';
import type { CombatActionProjectionExtensionsSource } from '../../compiler/combatProjectionCommon.ts';
import {
  collectCompiledBuffApplications,
  collectCompiledBuffIds,
  collectCompiledBuffIdentityReadIds,
} from '../../compiler/compiledBuffReferences.ts';
import { collectCombatInvisibleBuffClosureIds } from '../../compiler/combatInvisibleBuffClosure.ts';
import { collectBuffRuntimeClosure } from '../../compiler/buffReferenceClosure.ts';
import { collectNativeActionNodes } from '../../source/controlFlow.ts';
import { parseGlobalBuffTemplateCatalogSource } from '../../source/globalBuffTemplate.ts';

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
  /** Buff 动作可能在主动技能规划之后才暴露实体；按发现的精确 ID 读取，不预载无关模板。 */
  readonly loadAbilityEntity?: (id: string) => unknown;
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
  const addEntityBinding = (spawn: {
    readonly abilityEntityId: string;
    readonly skillId: string;
    readonly sourcePath: string;
  }) => {
    if (
      bindings.has(spawn.abilityEntityId) &&
      bindings.get(spawn.abilityEntityId) !== spawn.skillId
    )
      throw new Error(`${spawn.sourcePath}: one template is spawned with different child skills`);
    const added = !bindings.has(spawn.abilityEntityId);
    bindings.set(spawn.abilityEntityId, spawn.skillId);
    return added;
  };
  for (const spawn of input.activeSkills.flatMap(item => item.abilityEntitySpawns)) {
    addEntityBinding(spawn);
  }
  const baseRoots = [
    ...new Set([
      ...input.activeSkills.flatMap(item => item.runtimeBuffIds),
      ...progression.compiledEffectBundles.flatMap(bundle =>
        bundle.entries.flatMap(entry => (entry.kind === 'buff' ? [entry.buffId] : [])),
      ),
      ...talentPassivePlans.flatMap(plan => plan.buffIds),
      ...potentialPassivePlans.flatMap(plan => plan.buffIds),
    ]),
  ];
  const globalBuffCatalog = parseGlobalBuffTemplateCatalogSource(input.globalBuffCatalog);
  let preliminaryAbilityEntityDefinitions: Readonly<
    Record<string, ReturnType<typeof compileAbilityEntityDefinitionSource>>
  > = {};
  let entityCatalog = input.entityCatalog;
  let roots = baseRoots;
  let changed = true;
  while (changed) {
    if (input.loadAbilityEntity !== undefined) {
      entityCatalog = compileAbilityEntityTemplateCatalogSource(
        Object.fromEntries([...bindings.keys()].map(id => [id, input.loadAbilityEntity!(id)])),
      );
    }
    preliminaryAbilityEntityDefinitions = Object.fromEntries(
      [...bindings].map(([id, skillId]) => {
        const template = entityCatalog.byId.get(id);
        if (!template) throw new Error(`missing AbilityEntity ${id}`);
        return [
          id,
          compileAbilityEntityDefinitionSource(
            template,
            skillId,
            input.loadSkill,
            new Set(),
            input.gameplayTagRegistry,
          ),
        ];
      }),
    );
    roots = [
      ...new Set([...baseRoots, ...collectCompiledBuffIds(preliminaryAbilityEntityDefinitions)]),
    ];
    const sources = collectBuffRuntimeClosure(roots, input.loadBuff, globalBuffCatalog);
    changed = false;
    for (const source of sources.values()) {
      const sequences = [
        ...source.graph.timelineActions.map(item => item.sequence),
        ...source.graph.buffEvents.flatMap(item => item.actions),
        ...source.graph.abilityEvents.flatMap(item => item.actions),
        ...source.graph.igniteEvents.flatMap(item => item.actions),
      ];
      for (const node of sequences.flatMap(sequence => collectNativeActionNodes(sequence))) {
        if (
          !node.metadata.enabled ||
          node.body.kind !== 'leaf' ||
          node.body.value.family !== 'abilityEntity' ||
          node.body.value.action.kind !== 'abilityEntitySpawn'
        )
          continue;
        changed =
          addEntityBinding({
            abilityEntityId: node.body.value.action.abilityEntityId,
            skillId: node.body.value.action.skillId,
            sourcePath: node.sourcePath,
          }) || changed;
      }
    }
  }
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
      const template = entityCatalog.byId.get(id);
      if (!template) throw new Error(`missing AbilityEntity ${id}`);
      return [
        id,
        compileAbilityEntityDefinitionSource(
          template,
          skillId,
          input.loadSkill,
          entityVisualOnlyBuffIds,
          input.gameplayTagRegistry,
        ),
      ];
    }),
  );
  roots = [...new Set([...baseRoots, ...collectCompiledBuffIds(abilityEntityDefinitions)])];
  const rootBuffOwnerTargets = new Map<string, 'caster' | 'enemy' | 'currentAbilityEntity'>();
  const rootBuffOwnerTargetConflicts = new Set<string>();
  for (const application of collectCompiledBuffApplications([
    ...input.activeSkills.map(item => item.definition),
    abilityEntityDefinitions,
  ])) {
    // 编译后的 `caster` 在 Buff 生命周期中绑定实际 Buff 宿主。所有干员集合目标都会
    // 为每个命中的干员各建一份实例，因此其固定宿主种类同样是 operator/caster；
    // 这不表示原施法者独占该 Buff，也不会丢掉运行时逐实例 owner 身份。
    const target =
      application.target === 'enemy'
        ? ('enemy' as const)
        : application.target === 'currentAbilityEntity'
          ? ('currentAbilityEntity' as const)
          : application.target === 'caster' ||
              application.target === 'controlledOperator' ||
              application.target === 'party' ||
              application.target === 'partyExceptCaster' ||
              application.target === 'partyExceptCasterAndSameCharacterType' ||
              application.target === 'casterAndControlledOperator' ||
              application.target === 'casterAndLowestHealthRatioOperatorExceptCaster'
            ? ('caster' as const)
            : null;
    if (target === null) continue;
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
      catalog: entityCatalog,
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
    if (id.startsWith(`buff_${foundation.identity.characterId}_`)) privateBuffs[id] = definition;
    else if (id.startsWith('buff_chr_')) {
      throw new Error(`foreign operator Buff ownership is not established: ${id}`);
    } else {
      // 物理/元素反应等系统 Buff 不使用 buff_common_ 前缀，但与角色私有 Buff 一样
      // 由稳定身份决定归属；旧统一链接器也把所有非 buff_chr_* 定义放入共享目录。
      commonBuffs[id] = definition;
    }
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
