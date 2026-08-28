import fs from 'node:fs';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import { compileOperatorFoundationSource } from '../src/domains/operator/sourceClosure.ts';
import { parseOperatorProductIdentitySource } from '../src/domains/operator/productIdentity.ts';
import { parseOperatorActiveSkillEntries } from '../src/domains/operator/activeSkills.ts';
import { assembleOperatorDefinition } from '../src/domains/operator/definition.ts';
import { renderOperatorDefinitionSource } from '../src/domains/operator/definitionSourceRenderer.ts';
import { compileAbilityEntityTemplateCatalogSource } from '../src/compiler/abilityEntityCatalog.ts';
import {
  requireArray,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireRecord,
} from '../src/source/primitives.ts';
import {
  planOperatorActiveSkillRuntime,
  prepareProjectileProjection,
  readTimeDilationPriorities,
  readGameplayTagPaths,
  type OperatorActiveSkillRuntimeArguments,
} from './generateOperatorActiveSkillRuntime.ts';
import { writeGeneratedDefinitionFiles } from '../src/compiler/writeGeneratedDefinitionFiles.ts';
import { compilePassiveSkillRequestBatch } from '../src/compiler/passiveSkillBatch.ts';
import { GameplayTagRegistry } from '../src/source/nativeGameplayTags.ts';
import { collectNativeActionNodes } from '../src/source/controlFlow.ts';
import { parseOperatorComboSkillRegistrationsSource } from '../src/domains/operator/comboSkillRegistrations.ts';

/**
 * 整名候选规划：只读原始资源，不写正式目录、不载入旧生成 Operator。
 * 沿用主动批量入口的资源参数；tableRoot 指包含五张角色/养成表的目录。
 * 此阶段用于对象差分和正式模拟门禁，不提供绕过门禁的零散写文件 CLI。
 */
export function planOperatorDefinition(
  args: Omit<
    OperatorActiveSkillRuntimeArguments,
    'key' | 'skillType' | 'sourceFile' | 'supplementalBuffIds' | 'check'
  > & {
    readonly manifest: string;
    readonly tableRoot: string;
    readonly globalBuffCatalog: string;
    readonly skillSettingCatalog: string;
  },
) {
  const manifest = requireRecord(read(args.manifest), args.manifest);
  const matches = requireArray(manifest.operators, 'manifest.operators')
    .map(value => requireRecord(value, 'operator'))
    .filter(value => value.slug === args.slug);
  if (matches.length !== 1) throw new Error(`expected one operator ${args.slug}`);
  const row = matches[0]!;
  const entries = parseOperatorActiveSkillEntries(row.skills, `${args.slug}.skills`);
  const skills = Object.fromEntries(
    entries.map(entry => [
      entry.sourceFile,
      read(path.join(args.sourceRoot, 'skill-data-cdn', entry.sourceFile)),
    ]),
  );
  const foundation = compileOperatorFoundationSource({
    identity: parseOperatorProductIdentitySource(row, args.slug),
    manifestSkills: row.skills,
    manifestSkillGroups: row.skillGroups,
    skillDataBySourceFile: skills,
    skillPatchTable: read(args.skillPatchTable),
    characterTable: read(path.join(args.tableRoot, 'CharacterTable.json')),
    charGrowthTable: read(path.join(args.tableRoot, 'CharGrowthTable.json')),
    characterPotentialTable: read(path.join(args.tableRoot, 'CharacterPotentialTable.json')),
    potentialTalentEffectTable: read(path.join(args.tableRoot, 'PotentialTalentEffectTable.json')),
    skillConditionTable: read(path.join(args.tableRoot, 'SkillConditionTable.json')),
    skillGroupValidationOptions: {
      routingOnlyNativeSkillIds: optionalStrings(
        row.routingOnlyNativeSkillIds,
        `${args.slug}.routingOnlyNativeSkillIds`,
      ),
      simulationEquivalentNativeSkillIds: optionalStrings(
        row.simulationEquivalentNativeSkillIds,
        `${args.slug}.simulationEquivalentNativeSkillIds`,
      ),
      basePassiveSkillIds: optionalStrings(
        row.basePassiveSkillIds,
        `${args.slug}.basePassiveSkillIds`,
      ),
      routedSkillKeys: optionalStrings(row.routedSkillKeys, `${args.slug}.routedSkillKeys`),
    },
  });
  const preliminaryActiveSkills = entries.map(entry =>
    planOperatorActiveSkillRuntime({
      ...args,
      key: entry.key,
      skillType: entry.skillType,
      sourceFile: entry.sourceFile,
      supplementalBuffIds: [],
    }),
  );
  const crossSkillObservedBuffIds = [
    ...new Set(preliminaryActiveSkills.flatMap(skill => skill.abilityEntityObservedBuffIds)),
  ];
  const activeSkills = entries.map(entry =>
    planOperatorActiveSkillRuntime({
      ...args,
      key: entry.key,
      skillType: entry.skillType,
      sourceFile: entry.sourceFile,
      supplementalBuffIds: [],
      preserveBuffIds: crossSkillObservedBuffIds,
    }),
  );
  const passiveRequests = [
    ...foundation.progression.talentPassiveSkillRequests,
    ...foundation.progression.potentialPassiveSkillRequests,
  ];
  const passiveSkills = compilePassiveSkillRequestBatch(
    passiveRequests,
    Object.fromEntries(
      [...new Set(passiveRequests.map(request => request.skillId))].map(id => [
        id,
        read(path.join(args.sourceRoot, 'skill-data-cdn', `${id}.json`)),
      ]),
    ),
    read(args.skillPatchTable),
  );
  const spawned = [
    ...new Set(
      activeSkills.flatMap(skill => skill.abilityEntitySpawns.map(spawn => spawn.abilityEntityId)),
    ),
  ];
  const entityCatalog = compileAbilityEntityTemplateCatalogSource(
    Object.fromEntries(
      spawned.map(id => [id, read(path.join(args.sourceRoot, 'AbilityEntityData', `${id}.json`))]),
    ),
  );
  const timeDilationPriorities = readTimeDilationPriorities(args.timeDilationCatalog);
  const gameplayTagRegistry = new GameplayTagRegistry(
    readGameplayTagPaths(args.gameplayTagCatalog),
  );
  const candidate = assembleOperatorDefinition({
    foundation,
    activeSkills,
    entityCatalog,
    loadAbilityEntity: id => read(path.join(args.sourceRoot, 'AbilityEntityData', `${id}.json`)),
    gameplayTagRegistry,
    talentBindings: requireArray(row.talents, 'talents').map(value => {
      const binding = requireRecord(value, 'talent');
      return {
        index: requireNonNegativeInteger(binding.index, 'talent.index'),
        key: requireNonEmptyString(binding.key, 'talent.key'),
      };
    }),
    // manifest 潜能 key 是产品展示顺序，原生 level 是否完整连续仍由装配层逐项验证。
    potentialBindings: requireArray(row.potentials, 'potentials').map((value, index) => ({
      level: index + 1,
      key: requireNonEmptyString(requireRecord(value, 'potential').key, 'potential.key'),
    })),
    loadSkill: id => read(path.join(args.sourceRoot, 'skill-data-cdn', `${id}.json`)),
    loadBuff: id => read(path.join(args.buffDataRoot, `${id}.json`)),
    globalBuffCatalog: read(args.globalBuffCatalog),
    skillSettingCatalog: read(args.skillSettingCatalog),
    passiveSkills,
    comboSkillRegistrations: parseOperatorComboSkillRegistrationsSource(
      row.comboSkillRegistrations,
      `${args.slug}.comboSkillRegistrations`,
      new Set(entries.map(entry => entry.key)),
    ),
    createBuffProjectionExtensions: (sources, visualOnlyIds) => {
      const resolveTimeDilationPriority = (tagId: number, sourcePath: string) => {
        const value = timeDilationPriorities.get(tagId);
        if (value === undefined)
          throw new Error(`${sourcePath}: unknown time-dilation priority ${tagId}`);
        return value;
      };
      const launches = [...sources.values()].flatMap(source =>
        [
          ...source.graph.timelineActions.map(item => item.sequence),
          ...source.graph.buffEvents.flatMap(item => item.actions),
          ...source.graph.abilityEvents.flatMap(item => item.actions),
          ...source.graph.igniteEvents.flatMap(item => item.actions),
        ].flatMap(sequence =>
          collectNativeActionNodes(sequence).flatMap(node =>
            node.metadata.enabled &&
            node.body.kind === 'leaf' &&
            node.body.value.family === 'projectile'
              ? [node.body.value.action]
              : [],
          ),
        ),
      );
      if (launches.length === 0) return { resolveTimeDilationPriority };
      const prepared = prepareProjectileProjection(args, launches, visualOnlyIds, {
        gameplayTagRegistry,
        actionOwnerTarget: 'unavailable',
        actionSourceTarget: 'caster',
        actionTargetTarget: 'enemy',
        fixedHittableTargetCount: 0,
      });
      return {
        compileProjectileLaunch: prepared.compileProjectileLaunch,
        resolveTimeDilationPriority,
      };
    },
  });
  return { ...candidate, activeSkills };
}

function optionalStrings(value: unknown, sourcePath: string): string[] | undefined {
  if (value === undefined) return undefined;
  return requireArray(value, sourcePath).map((item, index) =>
    requireNonEmptyString(item, `${sourcePath}[${index}]`),
  );
}

function read(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** 完整模式只写一个自洽资源包；共享 Buff 独立导出，不进入可编辑的 Operator 私有目录。 */
export async function generateOperatorDefinition(
  args: Parameters<typeof planOperatorDefinition>[0] & { readonly check: boolean },
) {
  for (const [directory, parent] of [
    [args.output, 'src/next/data/operators/generated-definitions'],
    [args.auditOutput, 'tmp/game-data-audit/operator-definitions'],
  ]) {
    const target = path.resolve(directory!);
    if (path.dirname(target) !== path.resolve(parent!) || path.basename(target) !== args.slug)
      throw new Error(`complete operator output must be ${parent}/${args.slug}`);
  }
  const plan = planOperatorDefinition(args);
  const prettierConfig = (await resolveConfig(path.resolve('.prettierrc.json'))) ?? {};
  const content = await format(
    renderOperatorDefinitionSource({
      commonBuffDefinitions: plan.commonBuffDefinitions,
      operator: {
        ...plan.operator,
        conversionSupport: { completeness: 'complete', missingCapabilities: [] },
      },
    }),
    { ...prettierConfig, parser: 'typescript' },
  );
  const file = {
    relativePath: `${args.slug}.operator.generated.ts`,
    content,
  };
  if (
    fs.existsSync(args.output) &&
    JSON.stringify(fs.readdirSync(args.output)) !== JSON.stringify([file.relativePath])
  )
    throw new Error('complete operator directory contains unexpected files');
  if (args.check) {
    const target = path.join(args.output, file.relativePath);
    if (
      !fs.existsSync(target) ||
      fs.readFileSync(target, 'utf8').replaceAll('\r\n', '\n') !== file.content
    )
      throw new Error(`complete operator definition is stale: ${target}`);
  } else {
    await writeGeneratedDefinitionFiles(args.auditOutput, [
      { relativePath: 'operator.audit.json', content: JSON.stringify(plan.audit, null, 2) + '\n' },
    ]);
    await writeGeneratedDefinitionFiles(args.output, [file]);
  }
  return {
    slug: args.slug,
    skillCount: plan.activeSkills.length,
    talentCount: plan.operator.talents.length,
    potentialCount: plan.operator.potentials.length,
    entityCount: Object.keys(plan.operator.abilityEntityDefinitions!).length,
    privateBuffCount: Object.keys(plan.operator.buffDefinitions!).length,
    commonBuffCount: Object.keys(plan.commonBuffDefinitions).length,
  };
}
