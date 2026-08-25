import {
  STANDARD_OPERATOR_PANEL_MILESTONES,
  compileOperatorAttributeGrowthSource,
  parseOperatorCharacterTableSource,
  type CompiledOperatorAttributeGrowthSource,
  type OperatorCharacterTableSource,
} from './characterTable.ts';
import { parseOperatorProgressionSource, type OperatorProgressionSource } from './progression.ts';
import {
  compileOperatorSkillLibrarySource,
  type OperatorSkillLibrarySource,
} from './skillLibrary.ts';
import type { OperatorSkillGroupValidationOptions } from './skillGroups.ts';
import {
  compilePassiveSkillRequestBatch,
  type PassiveSkillCompilationBatchSource,
} from '../../compiler/passiveSkillBatch.ts';
import {
  compileReferencedSkillDefinitionNode,
  createSkillDefinitionReferenceNode,
} from '../../compiler/referenceDefinitions.ts';
import {
  resolveDefinitionReferenceClosure,
  type DefinitionReferenceClosureSource,
  type DefinitionReferenceNodeSource,
} from '../../compiler/referenceClosure.ts';
import {
  compileActiveSkillAbilityEntityQueriesSource,
  type CompiledActiveSkillAbilityEntityQuerySource,
} from '../../compiler/activeSkillAbilityEntityQueries.ts';
import type { CompiledAbilityEntityTemplateCatalogSource } from '../../compiler/abilityEntityCatalog.ts';
import type { GameplayTagRegistry } from '../../../../../src/shared/gameplayTags.ts';
import type { OperatorProductIdentitySource } from './productIdentity.ts';

export interface OperatorAbilityEntityQueryContext {
  readonly catalog: CompiledAbilityEntityTemplateCatalogSource;
  readonly registry: GameplayTagRegistry;
}

export interface OperatorActiveSkillAbilityEntityQueriesSource {
  readonly skillKey: string;
  readonly skillId: string;
  readonly queries: readonly CompiledActiveSkillAbilityEntityQuerySource[];
}

export interface OperatorSourceClosureInput {
  readonly identity: OperatorProductIdentitySource;
  readonly manifestSkills: unknown;
  readonly manifestSkillGroups: unknown;
  readonly skillDataBySourceFile: unknown;
  readonly skillDataById: unknown;
  readonly buffDefinitionNodes: readonly DefinitionReferenceNodeSource[];
  readonly projectileDefinitionNodes: readonly DefinitionReferenceNodeSource[];
  readonly abilityEntityDefinitionNodes: readonly DefinitionReferenceNodeSource[];
  /** 下载计划阶段模板尚未到位时为空；正式编译遇到相关查询时必须提供。 */
  readonly abilityEntityQueryContext?: OperatorAbilityEntityQueryContext;
  readonly skillPatchTable: unknown;
  readonly characterTable: unknown;
  readonly charGrowthTable: unknown;
  readonly characterPotentialTable: unknown;
  readonly potentialTalentEffectTable: unknown;
  readonly skillConditionTable: unknown;
  readonly skillGroupValidationOptions?: OperatorSkillGroupValidationOptions;
}

/** 时间轴行为投影之前，Operator 所有私有入口与公共 SkillData 身份均已闭合的领域结果。 */
export interface OperatorSourceClosure {
  readonly identity: OperatorProductIdentitySource;
  readonly character: OperatorCharacterTableSource;
  readonly attributeGrowth: CompiledOperatorAttributeGrowthSource;
  readonly skillLibrary: OperatorSkillLibrarySource;
  readonly progression: OperatorProgressionSource;
  readonly passiveSkills: PassiveSkillCompilationBatchSource;
  readonly definitionClosure: DefinitionReferenceClosureSource;
  readonly activeSkillAbilityEntityQueries: readonly OperatorActiveSkillAbilityEntityQueriesSource[];
}

export function compileOperatorSourceClosure(
  input: OperatorSourceClosureInput,
): OperatorSourceClosure {
  const result = resolveOperatorSourceClosure(input);
  if (result.definitionClosure.missing.length > 0) {
    const first = result.definitionClosure.missing[0]!;
    throw new Error(
      `${first.reference.sourcePath}: missing active ${first.reference.kind} definition ${JSON.stringify(first.reference.id)}`,
    );
  }
  const unresolvedQuery = result.skillLibrary.activeSkills.entries.find(entry =>
    entry.definition.definition.targetGroupWrites.some(
      write => write.finderType === 'OwnerSpawnedEntityFinder',
    ),
  );
  if (unresolvedQuery && !input.abilityEntityQueryContext) {
    throw new Error(
      `${unresolvedQuery.sourcePath}: owner-spawned AbilityEntity query requires a versioned template catalog and GameplayTag registry`,
    );
  }
  return result;
}

/**
 * 构造完整来源闭包并保留缺失定义，供批量资源计划审计使用。正式编译必须调用上面的严格入口，
 * 不能把此函数返回的缺失边当成可执行结果。
 */
export function resolveOperatorSourceClosure(
  input: OperatorSourceClosureInput,
): OperatorSourceClosure {
  const character = parseOperatorCharacterTableSource(
    input.characterTable,
    input.identity.characterId,
  );
  const skillLibrary = compileOperatorSkillLibrarySource({
    characterId: input.identity.characterId,
    sourcePath: input.identity.slug,
    manifestSkills: input.manifestSkills,
    manifestSkillGroups: input.manifestSkillGroups,
    skillDataBySourceFile: input.skillDataBySourceFile,
    skillPatchTable: input.skillPatchTable,
    charGrowthTable: input.charGrowthTable,
    validationOptions: input.skillGroupValidationOptions,
  });
  const progression = parseOperatorProgressionSource(
    character,
    input.charGrowthTable,
    input.characterPotentialTable,
    input.potentialTalentEffectTable,
    input.skillConditionTable,
  );
  const passiveSkills = compilePassiveSkillRequestBatch(
    [...progression.talentPassiveSkillRequests, ...progression.potentialPassiveSkillRequests],
    input.skillDataById,
    input.skillPatchTable,
  );
  const skillNodes = [
    ...skillLibrary.activeSkills.definitions.map(definition =>
      createSkillDefinitionReferenceNode(definition.definition.skill, definition.sourcePath),
    ),
    ...passiveSkills.definitions.map(definition =>
      createSkillDefinitionReferenceNode(definition.definition.skill, definition.sourcePath),
    ),
  ];
  const roots = [
    ...skillNodes.map(node => [node.kind, node.id] as const),
    ...progression.compiledEffectBundles.flatMap(bundle =>
      bundle.entries
        .filter(entry => entry.kind === 'buff')
        .map(entry => ['buff', entry.buffId] as const),
    ),
  ];
  const definitionNodes = [
    ...skillNodes,
    ...input.buffDefinitionNodes,
    ...input.projectileDefinitionNodes,
    ...input.abilityEntityDefinitionNodes,
  ];
  const knownSkills = new Set(skillNodes.map(node => node.id));
  let definitionClosure = resolveDefinitionReferenceClosure(roots, definitionNodes);
  while (true) {
    const missingSkillIds = [
      ...new Set(
        definitionClosure.missing
          .filter(missing => missing.reference.kind === 'skill')
          .map(missing => missing.reference.id)
          .filter((id): id is string => Boolean(id) && !knownSkills.has(id!)),
      ),
    ];
    if (missingSkillIds.length === 0) break;
    for (const skillId of missingSkillIds) {
      definitionNodes.push(
        compileReferencedSkillDefinitionNode(skillId, input.skillDataById, input.skillPatchTable),
      );
      knownSkills.add(skillId);
    }
    definitionClosure = resolveDefinitionReferenceClosure(roots, definitionNodes);
  }
  const queryContext = input.abilityEntityQueryContext;
  const activeSkillAbilityEntityQueries = queryContext
    ? skillLibrary.activeSkills.entries
        .map(entry => ({
          skillKey: entry.key,
          skillId: entry.skillId,
          queries: compileActiveSkillAbilityEntityQueriesSource(
            entry.definition.definition,
            queryContext.catalog,
            queryContext.registry,
          ),
        }))
        .filter(entry => entry.queries.length > 0)
    : [];
  return {
    identity: input.identity,
    character,
    attributeGrowth: compileOperatorAttributeGrowthSource(
      character,
      STANDARD_OPERATOR_PANEL_MILESTONES,
    ),
    skillLibrary,
    progression,
    passiveSkills,
    definitionClosure,
    activeSkillAbilityEntityQueries,
  };
}
