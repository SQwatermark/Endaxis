import fs from 'node:fs';
import path from 'node:path';
import { format, resolveConfig } from 'prettier';
import { compileOperatorFoundationSource } from '../src/domains/operator/sourceClosure.ts';
import { parseOperatorProductIdentitySource } from '../src/domains/operator/productIdentity.ts';
import {
  parseOperatorActiveSkillEntries,
  type OperatorActiveSkillEntrySource,
} from '../src/domains/operator/activeSkills.ts';
import { assembleOperatorDefinition } from '../src/domains/operator/definition.ts';
import { renderOperatorDefinitionSource } from '../src/domains/operator/definitionSourceRenderer.ts';
import { compileAbilityEntityTemplateCatalogSource } from '../src/compiler/abilityEntityCatalog.ts';
import {
  requireArray,
  requireExactFields,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireNumber,
  requireRecord,
} from '../src/source/primitives.ts';
import {
  planOperatorActiveSkillRuntime,
  prepareProjectileProjection,
  readTimeDilationPriorities,
  readGameplayTagPaths,
  type OperatorActiveSkillRuntimeArguments,
  type PlannedOperatorActiveSkillRuntime,
} from './generateOperatorActiveSkillRuntime.ts';
import { writeGeneratedDefinitionFiles } from '../src/compiler/writeGeneratedDefinitionFiles.ts';
import { compilePassiveSkillRequestBatch } from '../src/compiler/passiveSkillBatch.ts';
import { GameplayTagRegistry } from '../src/source/nativeGameplayTags.ts';
import { collectNativeActionNodes } from '../src/source/controlFlow.ts';
import { parseOperatorComboSkillRegistrationsSource } from '../src/domains/operator/comboSkillRegistrations.ts';
import { prepareSkillDefinitionInputSource } from '../src/compiler/skillDefinitionInput.ts';
import { parseKnownSkillActionGraphSource } from '../src/source/skillActionGraph.ts';
import type { NativeConditionSource } from '../src/source/condition.ts';
import type { SkillSlotReplacementActionSource } from '../src/source/skillSlotActions.ts';

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
  const basePassiveSkillIds =
    optionalStrings(row.basePassiveSkillIds, `${args.slug}.basePassiveSkillIds`) ?? [];
  const runtimeReplacementSkillKeys =
    optionalStrings(row.runtimeReplacementSkillKeys, `${args.slug}.runtimeReplacementSkillKeys`) ??
    [];
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
      basePassiveSkillIds,
      routedSkillKeys: optionalStrings(row.routedSkillKeys, `${args.slug}.routedSkillKeys`),
      runtimeReplacementSkillKeys,
    },
  });
  const compileSkillSlotReplacement = createActiveSkillSlotReplacementProjection(
    foundation.skillLibrary.activeSkills.entries,
    foundation.skillLibrary.skillGroups,
    new Set(runtimeReplacementSkillKeys),
  );
  const basePassiveSkillRequests = basePassiveSkillIds.map(id => ({
    originKind: 'operatorProgression' as const,
    originId: id,
    sourcePath: `${args.slug}.basePassiveSkillIds`,
    skillId: id,
    levelSource: resolveBasePassiveLevelSource(foundation.skillLibrary, id),
    inputBlackboard: {},
  }));
  const passiveRequests = [
    ...basePassiveSkillRequests,
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
  const preliminaryActiveSkills = entries.map(entry =>
    planOperatorActiveSkillRuntime({
      ...args,
      key: entry.key,
      skillType: entry.skillType,
      sourceFile: entry.sourceFile,
      supplementalBuffIds: [],
      allowMissingSkillPatch: runtimeReplacementSkillKeys.includes(entry.key),
      compileSkillSlotReplacement,
    }),
  );
  const crossSkillObservedBuffIds = [
    ...new Set([
      ...preliminaryActiveSkills.flatMap(skill => skill.abilityEntityObservedBuffIds),
      ...passiveSkills.definitions.flatMap(definition =>
        collectObservedBuffIdsFromPassiveSkill(definition.definition.skill.actionGraph),
      ),
    ]),
  ];
  const activeSkills = entries.map(entry =>
    planOperatorActiveSkillRuntime({
      ...args,
      key: entry.key,
      skillType: entry.skillType,
      sourceFile: entry.sourceFile,
      supplementalBuffIds: [],
      preserveBuffIds: crossSkillObservedBuffIds,
      allowMissingSkillPatch: runtimeReplacementSkillKeys.includes(entry.key),
      compileSkillSlotReplacement,
    }),
  );
  const routedSkills = planRoutedSkills(row, entries, activeSkills, foundation, skills, args.slug);
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
    runtimeReplacementSkillKeys,
    routedSkills,
    nativeMissingBlackboardZeroKeys: parseNativeMissingBlackboardZeroKeys(
      row.nativeMissingBlackboardZeroKeys,
      `${args.slug}.nativeMissingBlackboardZeroKeys`,
    ),
    nativeMissingEntityBlackboardZeroKeys: parseNativeMissingEntityBlackboardZeroKeys(
      row.nativeMissingEntityBlackboardZeroKeys,
      `${args.slug}.nativeMissingEntityBlackboardZeroKeys`,
    ),
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
    basePassiveSkillRequests,
    comboSkillRegistrations: parseOperatorComboSkillRegistrationsSource(
      row.comboSkillRegistrations,
      `${args.slug}.comboSkillRegistrations`,
      new Set(entries.map(entry => entry.key)),
      gameplayTagRegistry,
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
    createAbilityEntityProjectionExtensions: (skillId, value, visualOnlyIds) => {
      const resolveTimeDilationPriority = (tagId: number, sourcePath: string) => {
        const priority = timeDilationPriorities.get(tagId);
        if (priority === undefined)
          throw new Error(`${sourcePath}: unknown time-dilation priority ${tagId}`);
        return priority;
      };
      const preparedInput = prepareSkillDefinitionInputSource(value, skillId, null);
      const graph = parseKnownSkillActionGraphSource(
        value,
        `SkillData.${skillId}`,
        preparedInput.blackboard.values,
      );
      const launches = graph.actionGroup.timelineActions.flatMap(timeline =>
        collectNativeActionNodes(timeline.sequence).flatMap(node =>
          node.metadata.enabled &&
          node.body.kind === 'leaf' &&
          node.body.value.family === 'projectile'
            ? [node.body.value.action]
            : [],
        ),
      );
      if (launches.length === 0) return { resolveTimeDilationPriority };
      const projectile = prepareProjectileProjection(args, launches, visualOnlyIds, {
        gameplayTagRegistry,
        actionOwnerTarget: 'unavailable',
        actionSourceTarget: 'caster',
        actionTargetTarget: 'enemy',
        fixedHittableTargetCount: 0,
      });
      return {
        compileProjectileLaunch: projectile.compileProjectileLaunch,
        resolveTimeDilationPriority,
      };
    },
  });
  return { ...candidate, activeSkills };
}

function createActiveSkillSlotReplacementProjection(
  skills: readonly { readonly key: string; readonly skillId: string }[],
  groups: readonly {
    readonly key: string;
    readonly skillType: string;
    readonly skillKeys: readonly string[];
  }[],
  runtimeReplacementSkillKeys: ReadonlySet<string>,
) {
  const skillKeyByNativeId = new Map(skills.map(skill => [skill.skillId, skill.key] as const));
  return (action: SkillSlotReplacementActionSource, sourcePath: string) => {
    if (
      !['Owner', 'Source'].includes(action.skillSource.targetSource) ||
      action.skillSource.targetGroupKey !== '' ||
      action.skillSource.selectorOwner !== 'ActionOwner' ||
      action.skillSource.finderType !== null ||
      action.skillSource.validatorTypes.length !== 0 ||
      action.skillSource.postProcessorTypes.length !== 0
    ) {
      throw new Error(`${sourcePath}: active skill replacement must target its plain Owner/Source`);
    }
    if (action.overrideCacheTime) {
      throw new Error(
        `${sourcePath}: active skill replacement input-cache override is unsupported`,
      );
    }
    if (action.lifetime === 'SpecificTime') {
      throw new Error(`${sourcePath}: timed active skill replacement is unsupported`);
    }
    const targetSkillKey = skillKeyByNativeId.get(action.targetSkillId);
    if (targetSkillKey === undefined) {
      throw new Error(`${sourcePath}: unknown replacement target skill '${action.targetSkillId}'`);
    }
    const expectedSkillType =
      action.skillSlot === 'NormalSkill'
        ? 'battleSkill'
        : action.skillSlot === 'ComboSkill'
          ? 'comboSkill'
          : 'ultimate';
    const matchingGroups = groups.filter(
      group => group.skillType === expectedSkillType && group.skillKeys.includes(targetSkillKey),
    );
    if (matchingGroups.length !== 1) {
      throw new Error(`${sourcePath}: expected one stable skill group for replacement target`);
    }
    const group = matchingGroups[0]!;
    const mappedRevertedSkillKey = action.specificRevertedSkillId
      ? skillKeyByNativeId.get(action.revertedSkillId)
      : undefined;
    if (mappedRevertedSkillKey !== undefined && !group.skillKeys.includes(mappedRevertedSkillKey)) {
      throw new Error(`${sourcePath}: reverted skill does not belong to replacement group`);
    }
    if (mappedRevertedSkillKey === undefined && runtimeReplacementSkillKeys.has(targetSkillKey)) {
      const visibleSkillKeys = group.skillKeys.filter(key => !runtimeReplacementSkillKeys.has(key));
      if (visibleSkillKeys.length !== 1) {
        throw new Error(`${sourcePath}: replacement group must have one stable base skill`);
      }
    }
    return [
      {
        kind: 'changeSkillSlot' as const,
        parameters: {
          skillGroupKey: group.key,
          targetSkillKey,
          inheritOriginSkillCooldownProgress: action.inheritOriginSkillCooldownProgress,
          lifetime:
            action.lifetime === 'Infinite' ? ('infinite' as const) : ('finishByAction' as const),
          ...(mappedRevertedSkillKey === undefined
            ? {}
            : { revertedSkillKey: mappedRevertedSkillKey }),
        },
      },
    ];
  };
}

function resolveBasePassiveLevelSource(
  skillLibrary: ReturnType<typeof compileOperatorFoundationSource>['skillLibrary'],
  passiveSkillId: string,
) {
  const nativeGroups = skillLibrary.nativeSkillGroups.filter(group =>
    group.skillIds.includes(passiveSkillId),
  );
  if (nativeGroups.length > 1) {
    throw new Error(
      `base passive ${JSON.stringify(passiveSkillId)} belongs to multiple native skill groups`,
    );
  }
  if (nativeGroups.length === 0) return { kind: 'nativeDefault' as const };
  const nativeGroup = nativeGroups[0]!;
  const projectedSources = [
    ...skillLibrary.skillGroups
      .filter(group => group.nativeGroupType === nativeGroup.nativeGroupType)
      .map(group => group.levelSource),
    ...skillLibrary.skillGroups.flatMap(group =>
      group.variants
        .filter(variant => variant.nativeGroupType === nativeGroup.nativeGroupType)
        .map(variant => variant.levelSource),
    ),
  ];
  const levelSources = [...new Set(projectedSources)];
  if (levelSources.length !== 1) {
    throw new Error(
      `${nativeGroup.sourcePath}: base passive ${JSON.stringify(passiveSkillId)} must resolve to exactly one project skill level source`,
    );
  }
  return { kind: 'operatorSkillGroup' as const, levelSource: levelSources[0]! };
}

function optionalStrings(value: unknown, sourcePath: string): string[] | undefined {
  if (value === undefined) return undefined;
  return requireArray(value, sourcePath).map((item, index) =>
    requireNonEmptyString(item, `${sourcePath}[${index}]`),
  );
}

function parseNativeMissingBlackboardZeroKeys(
  value: unknown,
  sourcePath: string,
): ReadonlyMap<string, ReadonlySet<string>> {
  if (value === undefined) return new Map();
  const record = requireRecord(value, sourcePath);
  return new Map(
    Object.entries(record).map(([skillId, keys]) => [
      requireNonEmptyString(skillId, `${sourcePath} skillId`),
      new Set(
        requireArray(keys, `${sourcePath}.${skillId}`).map((key, index) =>
          requireNonEmptyString(key, `${sourcePath}.${skillId}[${index}]`),
        ),
      ),
    ]),
  );
}

function parseNativeMissingEntityBlackboardZeroKeys(
  value: unknown,
  sourcePath: string,
): ReadonlySet<string> {
  if (value === undefined) return new Set();
  return new Set(
    requireArray(value, sourcePath).map((rawKey, index) => {
      const key = requireNonEmptyString(rawKey, `${sourcePath}[${index}]`);
      if (!key.startsWith('EntityBB_') || key.length === 'EntityBB_'.length) {
        throw new Error(`${sourcePath}[${index}]: expected a non-empty EntityBB_ key`);
      }
      return key;
    }),
  );
}

/**
 * 空 Buff 也可能是已安装被动监听的事件协议。主动技能的纯表现闭包必须在裁剪前看见
 * 这些跨 SkillData 的身份读取，否则会删掉唯一负责发布事件的 applyBuff。
 */
function collectObservedBuffIdsFromPassiveSkill(
  graph: ReturnType<typeof parseKnownSkillActionGraphSource>,
): string[] {
  const collectCondition = (condition: NativeConditionSource): string[] => {
    if (condition.kind === 'buffStack') return [...condition.buffIds];
    if (condition.kind === 'contextBuff' && condition.matcher.kind === 'id') {
      return condition.matcher.buffIds.flatMap(id =>
        id.kind === 'constant' && id.value.length > 0 ? [id.value] : [],
      );
    }
    if (condition.kind === 'any') {
      return condition.groups.flatMap(group => group.conditions.flatMap(collectCondition));
    }
    return [];
  };
  return [
    ...graph.actionGroup.timelineActions.map(item => item.sequence),
    ...graph.actionGroup.passiveEvents.flatMap(item => item.actions),
  ].flatMap(sequence =>
    collectNativeActionNodes(sequence).flatMap(node =>
      node.metadata.enabled && node.body.kind === 'leaf' && node.body.value.family === 'condition'
        ? collectCondition(node.body.value.action)
        : [],
    ),
  );
}

const ROUTED_SKILL_CONFIG_FIELDS = new Set([
  'kind',
  'targetSkillKey',
  'executionSkillType',
  'executionLevelSource',
  'activationBuffId',
  'routingBuffId',
  'costResource',
]);

/** 把旧 Python 已取证的跨组路由语义收进 TS 整名主干；这里只接受完全同构的包装器。 */
function planRoutedSkills(
  row: Record<string, unknown>,
  entries: readonly OperatorActiveSkillEntrySource[],
  activeSkills: readonly PlannedOperatorActiveSkillRuntime[],
  foundation: ReturnType<typeof compileOperatorFoundationSource>,
  skillDataBySourceFile: Readonly<Record<string, unknown>>,
  slug: string,
) {
  const routedKeys = optionalStrings(row.routedSkillKeys, `${slug}.routedSkillKeys`) ?? [];
  const entryByKey = new Map(entries.map(entry => [entry.key, entry] as const));
  const plannedByKey = new Map(activeSkills.map(item => [item.definition.key, item] as const));
  return routedKeys.map(key => {
    const entry = entryByKey.get(key);
    const wrapper = plannedByKey.get(key)?.definition;
    if (entry === undefined || wrapper === undefined || entry.projectionConfig === null) {
      throw new Error(
        `${slug}.routedSkillKeys: unknown or unconfigured key ${JSON.stringify(key)}`,
      );
    }
    const path = `${entry.sourcePath}.compile`;
    const config = entry.projectionConfig;
    requireExactFields(config, ROUTED_SKILL_CONFIG_FIELDS, path);
    if (config.kind !== 'routedSkill') throw new Error(`${path}.kind: expected routedSkill`);
    const targetSkillKey = requireNonEmptyString(config.targetSkillKey, `${path}.targetSkillKey`);
    const targetEntry = entryByKey.get(targetSkillKey);
    const target = plannedByKey.get(targetSkillKey)?.definition;
    if (targetEntry === undefined || target === undefined) {
      throw new Error(`${path}.targetSkillKey: unknown skill ${JSON.stringify(targetSkillKey)}`);
    }
    const executionSkillType = requireNonEmptyString(
      config.executionSkillType,
      `${path}.executionSkillType`,
    );
    if (executionSkillType !== targetEntry.skillType) {
      throw new Error(`${path}.executionSkillType: expected ${targetEntry.skillType}`);
    }
    const executionLevelSource = requireNonEmptyString(
      config.executionLevelSource,
      `${path}.executionLevelSource`,
    );
    const targetGroups = foundation.skillLibrary.skillGroups.filter(group =>
      group.skillKeys.includes(targetSkillKey),
    );
    if (targetGroups.length !== 1 || targetGroups[0]!.levelSource !== executionLevelSource) {
      throw new Error(`${path}: target group or level source does not match`);
    }
    const activationBuffId = requireNonEmptyString(
      config.activationBuffId,
      `${path}.activationBuffId`,
    );
    const routingBuffId = requireNonEmptyString(config.routingBuffId, `${path}.routingBuffId`);
    if (config.costResource !== 'sp') throw new Error(`${path}.costResource: expected sp`);
    const route = wrapper.switchToBuffCast;
    const condition = route?.condition;
    const routeStep = route?.sequence.steps[0];
    if (
      route?.asSkillCast !== false ||
      route.sequence.steps.length !== 1 ||
      condition?.kind !== 'buffIdStackCompare' ||
      condition.target !== 'caster' ||
      condition.operator !== 'greaterOrEqual' ||
      condition.buffIds.length !== 1 ||
      condition.buffIds[0] !== activationBuffId ||
      (typeof condition.value === 'number'
        ? condition.value !== 1
        : condition.value.kind !== 'constant' || condition.value.value !== 1) ||
      routeStep?.kind !== 'applyBuff' ||
      routeStep.parameters.buffId !== routingBuffId ||
      routeStep.parameters.target !== 'caster' ||
      routeStep.parameters.inheritSourceSkillCastInfo !== true ||
      wrapper.scheduledSequences.length !== 0
    ) {
      throw new Error(`${path}: SwitchToAddBuff wrapper does not match routed-skill evidence`);
    }
    const source = requireRecord(skillDataBySourceFile[entry.sourceFile], entry.sourceFile);
    const cast = requireRecord(source.castData, `${entry.sourceFile}.castData`);
    const cost = requireRecord(cast.costData, `${entry.sourceFile}.castData.costData`);
    const cooldownSeconds = requireNumber(
      cast.cooldownTime,
      `${entry.sourceFile}.castData.cooldownTime`,
    );
    const costValue = requireNumber(
      cost.costValue,
      `${entry.sourceFile}.castData.costData.costValue`,
    );
    const cooldownFrames = cooldownSeconds * 30;
    if (
      cast.startCdFrame !== wrapper.costFrame ||
      cost.costType !== 'Atb' ||
      costValue <= 0 ||
      cooldownSeconds <= 0 ||
      !Number.isInteger(cooldownFrames)
    ) {
      throw new Error(`${path}: routed wrapper CastData cost/cooldown is unsupported`);
    }
    return {
      key,
      targetSkillKey,
      skillType: targetEntry.skillType,
      levelSource: targetGroups[0]!.levelSource,
      executionSkillGroupKey: targetGroups[0]!.key,
      costs: [{ resource: 'sp' as const, value: costValue }],
      costFrame: wrapper.costFrame,
      cooldownFrames,
    };
  });
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
