import { selectNativeAbilityEntityTemplateFields } from '../src/source/abilityEntity.ts';
import { readGameplayTagPaths } from './readGameplayTagPaths.ts';
export { readGameplayTagPaths } from './readGameplayTagPaths.ts';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { GameplayTagRegistry, gameplayTagIdFromPath } from '../src/source/nativeGameplayTags.ts';
import { compileAbilityEntityTemplateCatalogSource } from '../src/compiler/abilityEntityCatalog.ts';
import { collectNativeActionNodes } from '../src/source/controlFlow.ts';
import { collectBuffRuntimeClosure } from '../src/compiler/buffReferenceClosure.ts';
import { parseBlackboardDataPairs } from '../src/source/blackboard.ts';
import { parseProjectileRuntimeSource } from '../src/source/projectileRuntime.ts';
import { parseSkillPatchSource } from '../src/source/skillPatch.ts';
import { parseKnownSkillActionGraphSource } from '../src/source/skillActionGraph.ts';
import {
  prepareSkillDefinitionInputSource,
  assertNoUnprojectedSkillRootEffects,
} from '../src/compiler/skillDefinitionInput.ts';
import { createZeroDistanceProjectileProjectionExtensionSource } from '../src/compiler/projectileRuntimeProjection.ts';
import {
  compileOperatorActiveSkillRuntimeDefinitionSource,
  renderOperatorActiveSkillRuntimeDefinitionSource,
} from '../src/domains/operator/activeSkillRuntimeDefinition.ts';
import type { OperatorActiveSkillTypeSource } from '../src/domains/operator/activeSkills.ts';
import { writeGeneratedDefinitionFiles } from '../src/compiler/writeGeneratedDefinitionFiles.ts';
import { compileStandardStumpBuffClosure } from '../src/compiler/standardStumpBuffClosure.ts';
import { collectCombatInvisibleBuffClosureIds } from '../src/compiler/combatInvisibleBuffClosure.ts';
import {
  collectCompiledBuffApplications,
  collectCompiledBuffCapturedTargetGroups,
  collectCompiledBuffIds,
  collectCompiledPhysicalInflictionBuffIds,
} from '../src/compiler/compiledBuffReferences.ts';
import {
  collectSkillActionReferences,
  collectSkillRootBuffReferences,
} from '../src/source/referenceGraph.ts';
import type { ProjectileLaunchActionSource } from '../src/source/referenceActions.ts';
import type { NativeConditionSource } from '../src/source/condition.ts';
import type {
  CombatActionProjectionContextSource,
  CombatActionProjectionExtensionsSource,
} from '../src/compiler/combatProjectionCommon.ts';
import { parseGlobalBuffTemplateCatalogSource } from '../src/source/globalBuffTemplate.ts';
import { createGlobalBuffProjectionExtensions } from '../src/compiler/globalBuffProjection.ts';
import { parseSkillSettingCatalogSource } from '../src/source/skillSettingCatalog.ts';
import { createSkillSettingProjectionExtensions } from '../src/compiler/skillSettingProjection.ts';

export interface OperatorActiveSkillRuntimeArguments {
  readonly sourceRoot: string;
  readonly sourceFile: string;
  readonly skillPatchTable: string;
  readonly skillSettingCatalog?: string;
  /** 整名生成时提供；单技能入口未遇到 GlobalBuff 时可省略。 */
  readonly globalBuffCatalog?: string;
  readonly buffDataRoot: string;
  readonly supplementalBuffIds: readonly string[];
  /** 整名两阶段规划中，由其他技能生成的能力实体子技能所观察的逻辑 Buff 身份。 */
  readonly preserveBuffIds?: readonly string[];
  /** 仅供已显式审计的内部/替换技能；它们可能不在 SkillPatchTable 养成等级组中。 */
  readonly allowMissingSkillPatch?: boolean;
  readonly abilityEntityCatalog: string;
  readonly projectileBlackboardCatalog: string;
  readonly gameplayTagCatalog: string;
  readonly timeDilationCatalog: string;
  readonly slug: string;
  readonly key: string;
  readonly skillType: OperatorActiveSkillTypeSource;
  readonly output: string;
  readonly auditOutput: string;
  readonly check: boolean;
  /** 整名规划提供；单技能诊断入口没有足够信息解析原生换槽身份。 */
  readonly compileSkillSlotReplacement?: NonNullable<
    CombatActionProjectionExtensionsSource['compileSkillSlotReplacement']
  >;
  readonly compileSkillTypeMutation?: NonNullable<
    CombatActionProjectionExtensionsSource['compileSkillTypeMutation']
  >;
}

export interface PlannedOperatorActiveSkillRuntime {
  /** 整名装配直接消费结构化结果，不解析生成的 TS 字符串，也不加载旧定义补空。 */
  readonly definition: ReturnType<typeof compileOperatorActiveSkillRuntimeDefinitionSource>;
  readonly runtimeBuffIds: readonly string[];
  readonly abilityEntitySpawns: readonly {
    readonly abilityEntityId: string;
    readonly skillId: string;
    readonly sourcePath: string;
  }[];
  readonly file: { readonly relativePath: string; readonly content: string };
  readonly auditFile: { readonly relativePath: string; readonly content: string };
  readonly output: string;
  readonly skillId: string;
  readonly sequences: number;
  readonly abilityEntityObservedBuffIds: readonly string[];
}

function collectProjectileLaunches(
  graph: ReturnType<typeof parseKnownSkillActionGraphSource>,
): ProjectileLaunchActionSource[] {
  return graph.actionGroup.timelineActions.flatMap(timeline =>
    collectNativeActionNodes(timeline.sequence).flatMap(node =>
      node.metadata.enabled && node.body.kind === 'leaf' && node.body.value.family === 'projectile'
        ? [node.body.value.action]
        : [],
    ),
  );
}

/** 递归读取投射物回调 SkillData；Python 旧后端已经按同一闭包处理嵌套发射。 */
function loadProjectileCallbackClosure(
  initialLaunches: readonly ProjectileLaunchActionSource[],
  sourceRoot: string,
  patchTable: Record<string, unknown>,
): {
  readonly launches: readonly ProjectileLaunchActionSource[];
  readonly callbackGraphs: ReadonlyMap<string, ReturnType<typeof parseKnownSkillActionGraphSource>>;
} {
  const launches = [...initialLaunches];
  const callbackGraphs = new Map<string, ReturnType<typeof parseKnownSkillActionGraphSource>>();
  for (let index = 0; index < launches.length; index += 1) {
    for (const callback of launches[index]!.callbacks) {
      if (!callback.enabled || callbackGraphs.has(callback.skillId)) continue;
      const id = callback.skillId;
      const value = readJson(path.resolve(sourceRoot, 'SkillData', `${id}.json`));
      assertNoUnprojectedSkillRootEffects(value, `SkillData.${id}`);
      const callbackPatch = id in patchTable ? parseSkillPatchSource(patchTable[id], id) : null;
      const prepared = prepareSkillDefinitionInputSource(value, id, callbackPatch);
      const graph = parseKnownSkillActionGraphSource(value, id, prepared.blackboard.values);
      callbackGraphs.set(id, graph);
      launches.push(...collectProjectileLaunches(graph));
    }
  }
  return { launches, callbackGraphs };
}

/** 技能本体和 Buff 闭包共用的零距离投射物目录；回调 SkillData 仍逐个严格解析。 */
export function prepareProjectileProjection(
  args: Pick<
    OperatorActiveSkillRuntimeArguments,
    'sourceRoot' | 'skillPatchTable' | 'projectileBlackboardCatalog' | 'timeDilationCatalog'
  >,
  launches: readonly ProjectileLaunchActionSource[],
  visualOnlyIds: ReadonlySet<string>,
  callbackContext: CombatActionProjectionContextSource,
): {
  readonly compileProjectileLaunch: NonNullable<
    CombatActionProjectionExtensionsSource['compileProjectileLaunch']
  >;
  readonly callbackGraphs: ReadonlyMap<string, ReturnType<typeof parseKnownSkillActionGraphSource>>;
  readonly projectileIds: readonly string[];
  readonly callbackIds: readonly string[];
} {
  const patchTable = readJson(args.skillPatchTable) as Record<string, unknown>;
  const closure = loadProjectileCallbackClosure(launches, args.sourceRoot, patchTable);
  const projectileIds = [...new Set(closure.launches.map(launch => launch.projectileId))].sort();
  const callbackGraphs = closure.callbackGraphs;
  const callbackIds = [...callbackGraphs.keys()].sort();
  const runtimeCatalog = new Map(
    projectileIds.map(
      id =>
        [
          id,
          parseProjectileRuntimeSource(
            readJson(path.resolve(args.sourceRoot, 'ProjectileData', `${id}.json`)),
            `ProjectileData.${id}`,
          ),
        ] as const,
    ),
  );
  const blackboardEvidence = readJson(args.projectileBlackboardCatalog) as {
    projectiles: readonly {
      projectileId: string;
      entityBlackboard: readonly { key: string; value: number; isDynamic: boolean }[];
    }[];
  };
  const templateCatalog = new Map(
    blackboardEvidence.projectiles
      .filter(row => projectileIds.includes(row.projectileId))
      .map(
        row =>
          [
            row.projectileId,
            {
              projectileId: row.projectileId,
              entityBlackboard: parseBlackboardDataPairs(
                row.entityBlackboard.map(item => ({
                  key: item.key,
                  valueDouble: item.value,
                  valueStr: '',
                  isDynamic: item.isDynamic,
                })),
                `ProjectileTemplateData.${row.projectileId}.entityBlackboard`,
              ),
            },
          ] as const,
      ),
  );
  const priorities = readTimeDilationPriorities(args.timeDilationCatalog);
  const resolveTimeDilationPriority = (tagId: number, actionPath: string) => {
    const value = priorities.get(tagId);
    if (value === undefined)
      throw new Error(`${actionPath}: unknown time-dilation priority ${tagId}`);
    return value;
  };
  let compileProjectileLaunch: NonNullable<
    CombatActionProjectionExtensionsSource['compileProjectileLaunch']
  >;
  compileProjectileLaunch = createZeroDistanceProjectileProjectionExtensionSource({
    catalog: { runtimes: runtimeCatalog, templates: templateCatalog, callbackGraphs },
    callbackContext,
    callbackExtensions: {
      resolveTimeDilationPriority,
      compileProjectileLaunch: (action, actionPath, context) =>
        compileProjectileLaunch(action, actionPath, context),
    },
    visualOnlyIds,
  });
  return {
    compileProjectileLaunch,
    callbackGraphs,
    projectileIds,
    callbackIds,
  };
}

/**
 * 只计算一个主动技能的正式文件和审计文件，不接触文件系统输出目录。
 * 整名干员生成器会先把所有技能计划完成，再用一次目录事务提交，避免留下半名干员。
 */
export function planOperatorActiveSkillRuntime(
  args: Omit<OperatorActiveSkillRuntimeArguments, 'check'>,
): PlannedOperatorActiveSkillRuntime {
  const sourcePath = path.resolve(args.sourceRoot, 'SkillData', args.sourceFile);
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const source = JSON.parse(sourceText);
  const skillId = String(source.skillId ?? '');
  if (!skillId) throw new Error(`${sourcePath}.skillId: expected non-empty string`);
  const sourceIdentity = `SkillData.${skillId}`;
  const patchTable = readJson(args.skillPatchTable) as Record<string, unknown>;
  if (!(skillId in patchTable) && args.allowMissingSkillPatch !== true)
    throw new Error(`SkillPatchTable: missing ${skillId}`);
  const patch = skillId in patchTable ? parseSkillPatchSource(patchTable[skillId], skillId) : null;
  const prepared = prepareSkillDefinitionInputSource(source, sourceIdentity, patch);
  const globalBuffCatalogValue =
    args.globalBuffCatalog === undefined ? undefined : readJson(args.globalBuffCatalog);
  const globalBuffCatalog =
    globalBuffCatalogValue === undefined
      ? undefined
      : parseGlobalBuffTemplateCatalogSource(globalBuffCatalogValue);
  const skillSettingCatalogValue =
    args.skillSettingCatalog === undefined ? undefined : readJson(args.skillSettingCatalog);
  const skillSettingCatalog =
    skillSettingCatalogValue === undefined
      ? undefined
      : parseSkillSettingCatalogSource(skillSettingCatalogValue);
  const graph = parseKnownSkillActionGraphSource(
    source,
    sourceIdentity,
    prepared.blackboard.values,
  );
  const rootLaunches = collectProjectileLaunches(graph);
  const projectileClosure = loadProjectileCallbackClosure(
    rootLaunches,
    args.sourceRoot,
    patchTable,
  );
  const callbackGraphs = projectileClosure.callbackGraphs;
  const projectileIds = [
    ...new Set(projectileClosure.launches.map(launch => launch.projectileId)),
  ].sort();
  const callbackIds = [...callbackGraphs.keys()].sort();
  const runtimeCatalog = new Map(
    projectileIds.map(id => {
      const value = readJson(path.resolve(args.sourceRoot, 'ProjectileData', `${id}.json`));
      return [id, parseProjectileRuntimeSource(value, `ProjectileData.${id}`)] as const;
    }),
  );
  const blackboardEvidence = readJson(args.projectileBlackboardCatalog) as {
    projectiles: readonly {
      projectileId: string;
      entityBlackboard: readonly { key: string; value: number; isDynamic: boolean }[];
    }[];
  };
  const templateCatalog = new Map(
    blackboardEvidence.projectiles
      .filter(row => projectileIds.includes(row.projectileId))
      .map(
        row =>
          [
            row.projectileId,
            {
              projectileId: row.projectileId,
              entityBlackboard: parseBlackboardDataPairs(
                row.entityBlackboard.map(item => ({
                  key: item.key,
                  valueDouble: item.value,
                  valueStr: '',
                  isDynamic: item.isDynamic,
                })),
                `ProjectileTemplateData.${row.projectileId}.entityBlackboard`,
              ),
            },
          ] as const,
      ),
  );
  const abilityEvidence = readAbilityEntityEvidence(args.abilityEntityCatalog);
  const abilityCatalog = compileAbilityEntityTemplateCatalogSource(
    Object.fromEntries(
      Object.entries(abilityEvidence.templates).map(([id, raw]) => [
        id,
        selectNativeAbilityEntityTemplateFields(raw),
      ]),
    ),
  );
  const registry = new GameplayTagRegistry(readGameplayTagPaths(args.gameplayTagCatalog));
  const priorities = readTimeDilationPriorities(args.timeDilationCatalog);
  const resolveTimeDilationPriority = (tagId: number, actionPath: string) => {
    const value = priorities.get(tagId);
    if (value === undefined)
      throw new Error(`${actionPath}: unknown time-dilation priority ${tagId}`);
    return value;
  };
  const abilityChildGraphs = new Map<string, ReturnType<typeof parseKnownSkillActionGraphSource>>();
  const pendingAbilitySkillIds = [graph, ...callbackGraphs.values()].flatMap(skill =>
    skill.actionGroup.timelineActions.flatMap(timeline =>
      collectNativeActionNodes(timeline.sequence).flatMap(node =>
        node.metadata.enabled &&
        node.body.kind === 'leaf' &&
        node.body.value.family === 'abilityEntity' &&
        node.body.value.action.skillId.length > 0
          ? [node.body.value.action.skillId]
          : [],
      ),
    ),
  );
  while (pendingAbilitySkillIds.length > 0) {
    const id = pendingAbilitySkillIds.shift()!;
    if (abilityChildGraphs.has(id)) continue;
    const value = readJson(path.resolve(args.sourceRoot, 'SkillData', `${id}.json`));
    const childPatch = id in patchTable ? parseSkillPatchSource(patchTable[id], id) : null;
    const childPrepared = prepareSkillDefinitionInputSource(value, id, childPatch);
    const child = parseKnownSkillActionGraphSource(value, id, childPrepared.blackboard.values);
    abilityChildGraphs.set(id, child);
    pendingAbilitySkillIds.push(
      ...child.actionGroup.timelineActions.flatMap(timeline =>
        collectNativeActionNodes(timeline.sequence).flatMap(node =>
          node.metadata.enabled &&
          node.body.kind === 'leaf' &&
          node.body.value.family === 'abilityEntity' &&
          node.body.value.action.skillId.length > 0
            ? [node.body.value.action.skillId]
            : [],
        ),
      ),
    );
  }
  const actionReferences = [graph, ...callbackGraphs.values()].flatMap(skill =>
    collectSkillActionReferences(skill),
  );
  const switchRootBuffIds = collectSkillRootBuffReferences(source, sourceIdentity)
    .filter(
      reference =>
        reference.kind === 'buff' &&
        reference.usage === 'switch' &&
        reference.state === 'active' &&
        reference.id !== null,
    )
    .map(reference => reference.id!);
  const directlyReferencedBuffIds = actionReferences
    .filter(
      reference =>
        reference.kind === 'buff' &&
        reference.state === 'active' &&
        reference.id !== null &&
        ['apply', 'aura', 'finish', 'finishQuery', 'inherit'].includes(reference.usage),
    )
    .map(reference => reference.id!);
  const referencedClosureSources = collectBuffRuntimeClosure(
    [...new Set([...directlyReferencedBuffIds, ...switchRootBuffIds])],
    id => readJson(path.resolve(args.buffDataRoot, `${id}.json`)),
    globalBuffCatalog,
  );
  const collectObservedBuffIds = (condition: NativeConditionSource): string[] => {
    if (condition.kind === 'buffStack') return [...condition.buffIds];
    if (condition.kind === 'contextBuff' && condition.matcher.kind === 'id')
      return condition.matcher.buffIds.flatMap(id =>
        id.kind === 'constant' && id.value.length > 0 ? [id.value] : [],
      );
    if (condition.kind === 'any')
      return condition.groups.flatMap(group => group.conditions.flatMap(collectObservedBuffIds));
    return [];
  };
  const combatInvisibleClosureIds = collectCombatInvisibleBuffClosureIds(
    directlyReferencedBuffIds,
    id => readJson(path.resolve(args.buffDataRoot, `${id}.json`)),
  );
  const identityObservedBuffIds = new Set([
    ...[graph, ...callbackGraphs.values(), ...abilityChildGraphs.values()].flatMap(skill =>
      skill.actionGroup.timelineActions.flatMap(timeline =>
        collectNativeActionNodes(timeline.sequence).flatMap(node =>
          node.metadata.enabled &&
          node.body.kind === 'leaf' &&
          node.body.value.family === 'condition'
            ? collectObservedBuffIds(node.body.value.action)
            : [],
        ),
      ),
    ),
    ...[...referencedClosureSources.values()].flatMap(buff =>
      combatInvisibleClosureIds.has(buff.graph.buffId)
        ? []
        : [
            ...buff.graph.timelineActions.map(item => item.sequence),
            ...buff.graph.buffEvents.flatMap(item => item.actions),
            ...buff.graph.abilityEvents.flatMap(item => item.actions),
            ...buff.graph.igniteEvents.flatMap(item => item.actions),
          ].flatMap(sequence =>
            collectNativeActionNodes(sequence).flatMap(node =>
              node.metadata.enabled &&
              node.body.kind === 'leaf' &&
              node.body.value.family === 'condition'
                ? collectObservedBuffIds(node.body.value.action)
                : [],
            ),
          ),
    ),
    ...[...referencedClosureSources.values()].flatMap(buff => {
      if (combatInvisibleClosureIds.has(buff.graph.buffId)) return [];
      const nodes = [
        ...buff.graph.timelineActions.map(item => item.sequence),
        ...buff.graph.buffEvents.flatMap(item => item.actions),
        ...buff.graph.abilityEvents.flatMap(item => item.actions),
        ...buff.graph.igniteEvents.flatMap(item => item.actions),
      ].flatMap(sequence => collectNativeActionNodes(sequence));
      const activeDurationKeys = new Set(
        nodes.flatMap(node =>
          node.metadata.enabled &&
          node.body.kind === 'leaf' &&
          node.body.value.family === 'comboQte' &&
          node.body.value.action.activeDuration.blackboardKey !== null
            ? [node.body.value.action.activeDuration.blackboardKey]
            : [],
        ),
      );
      return nodes.flatMap(node =>
        node.metadata.enabled &&
        node.body.kind === 'leaf' &&
        node.body.value.family === 'buffApplication'
          ? node.body.value.action.buffs.flatMap(entry =>
              entry.assignments.some(
                assignment =>
                  !assignment.useDirectValue && activeDurationKeys.has(assignment.inputValueKey),
              )
                ? [entry.buffId]
                : [],
            )
          : [],
      );
    }),
  ]);
  const syntheticComboQteTriggerBlackboardKeys = new Set(
    [...referencedClosureSources.values()].flatMap(buff =>
      [
        ...buff.graph.timelineActions.map(item => item.sequence),
        ...buff.graph.buffEvents.flatMap(item => item.actions),
        ...buff.graph.abilityEvents.flatMap(item => item.actions),
        ...buff.graph.igniteEvents.flatMap(item => item.actions),
      ].flatMap(sequence =>
        collectNativeActionNodes(sequence).flatMap(node => {
          if (
            !node.metadata.enabled ||
            node.body.kind !== 'leaf' ||
            node.body.value.family !== 'comboQte'
          )
            return [];
          const mutation = node.body.value.action.triggerMutation;
          return mutation.body.kind === 'leaf' &&
            mutation.body.value.family === 'blackboardMutation'
            ? [mutation.body.value.action.key]
            : [];
        }),
      ),
    ),
  );
  const visualOnlyIds = new Set(
    [...combatInvisibleClosureIds].filter(
      id =>
        !switchRootBuffIds.includes(id) &&
        !identityObservedBuffIds.has(id) &&
        !args.preserveBuffIds?.includes(id),
    ),
  );
  let projectile: NonNullable<CombatActionProjectionExtensionsSource['compileProjectileLaunch']>;
  projectile = createZeroDistanceProjectileProjectionExtensionSource({
    catalog: { runtimes: runtimeCatalog, templates: templateCatalog, callbackGraphs },
    callbackContext: {
      gameplayTagRegistry: registry,
      actionOwnerTarget: 'unavailable',
      actionSourceTarget: 'caster',
      actionTargetTarget: 'enemy',
      // 轴上放置表达一次技能操作，不同时表达方向移动；原生方向派生守卫因此走基准段。
      fixedMoveInput: false,
      fixedHittableTargetCount: 0,
    },
    callbackExtensions: {
      resolveTimeDilationPriority,
      compileProjectileLaunch: (action, actionPath, context) =>
        projectile(action, actionPath, context),
      ...(skillSettingCatalog === undefined
        ? {}
        : createSkillSettingProjectionExtensions(skillSettingCatalog)),
    },
    visualOnlyIds,
  });
  const definition = compileOperatorActiveSkillRuntimeDefinitionSource({
    key: args.key,
    skillType: args.skillType,
    value: source,
    sourcePath: sourceIdentity,
    patch,
    context: {
      gameplayTagRegistry: registry,
      actionOwnerTarget: 'caster',
      actionSourceTarget: 'caster',
      actionTargetTarget: 'enemy',
      fixedHittableTargetCount: 0,
      // Endaxis 的标准排轴操作不携带角色移动输入。显式固定为“未移动”，让
      // CheckHasMoveInput 按原生短路规则排除其后的 SaveMoveAxisAngle 与方向动画分支；
      // 这不是把未知角度猜成 0，未来若引入移动操作应由场景输入覆盖这一边界。
      fixedMoveInput: false,
      abilityEntityQueries: { catalog: abilityCatalog, gameplayTagRegistry: registry },
      syntheticComboQteTriggerBlackboardKeys,
    },
    extensions: {
      compileProjectileLaunch: projectile,
      resolveTimeDilationPriority,
      ...(globalBuffCatalog === undefined
        ? {}
        : createGlobalBuffProjectionExtensions(globalBuffCatalog)),
      ...(skillSettingCatalog === undefined
        ? {}
        : createSkillSettingProjectionExtensions(skillSettingCatalog)),
      ...(args.compileSkillSlotReplacement === undefined
        ? {}
        : { compileSkillSlotReplacement: args.compileSkillSlotReplacement }),
      ...(args.compileSkillTypeMutation === undefined
        ? {}
        : { compileSkillTypeMutation: args.compileSkillTypeMutation }),
    },
    visualOnlyIds,
  });
  const runtimeBuffIds = new Set(collectCompiledBuffIds(definition));
  for (const id of args.supplementalBuffIds)
    if (!runtimeBuffIds.has(id))
      throw new Error(`supplemental Buff '${id}' is not applied by the compiled runtime`);
  // 正式动作已经给出完整静态 Buff 身份；闭包根不能只依赖命令行手填补充项，
  // 否则物理异常等隐式公共 Buff 会在最终内联阶段虚假报缺失。
  const buffClosureRoots = [
    ...new Set([
      ...collectCompiledPhysicalInflictionBuffIds(definition),
      ...collectCompiledBuffIds(definition.switchToBuffCast),
      ...args.supplementalBuffIds,
    ]),
  ].sort();
  const switchToBuffIds = collectCompiledBuffIds(definition.switchToBuffCast);
  const compiledBuffApplications = collectCompiledBuffApplications(definition);
  const buffData = loadBuffClosureSources(buffClosureRoots, args.buffDataRoot, globalBuffCatalog);
  const buffClosure = compileStandardStumpBuffClosure(
    buffClosureRoots,
    buffData,
    globalBuffCatalogValue,
    skillSettingCatalogValue,
    undefined,
    () => ({ resolveTimeDilationPriority }),
    new Map(
      buffClosureRoots.map(id => [id, switchToBuffIds.has(id) ? 'caster' : 'enemy'] as const),
    ),
    new Set([...switchRootBuffIds, ...identityObservedBuffIds, ...(args.preserveBuffIds ?? [])]),
    registry,
    // SwitchToAddBuff 的 buffSource 已由严格投影证明为当前技能施放者；物理异常根同样由
    // 当前主动技能命中施加。不能只种 owner 而让后继 Buff 的 Source 链退化成 unknown。
    new Map(buffClosureRoots.map(id => [id, 'caster'] as const)),
    new Set(),
    collectCompiledBuffCapturedTargetGroups(definition),
    new Set(
      [...new Set(compiledBuffApplications.map(item => item.buffId))].filter(buffId => {
        const producers = compiledBuffApplications.filter(item => item.buffId === buffId);
        return (
          producers.length > 0 && producers.every(item => item.inheritSourceSkillCastInfo === true)
        );
      }),
    ),
  );
  const blockedBuffs = buffClosure.diagnostics.filter(item => item.status === 'blocked');
  if (blockedBuffs.length > 0)
    throw new Error(`active skill Buff closure is blocked: ${JSON.stringify(blockedBuffs)}`);
  const rendered = renderOperatorActiveSkillRuntimeDefinitionSource({
    operatorSlug: args.slug,
    definition,
    supplementalBuffDefinitions: buffClosure.definitions,
  });
  const auditName = `${args.slug}.${args.key}.runtime.audit.json`;
  const destination = path.resolve(args.output, rendered.relativePath);
  return {
    definition,
    runtimeBuffIds: [...runtimeBuffIds].sort(),
    abilityEntitySpawns: [graph, ...callbackGraphs.values()].flatMap(source =>
      source.actionGroup.timelineActions
        .flatMap(timeline => collectNativeActionNodes(timeline.sequence))
        .flatMap(node =>
          node.metadata.enabled &&
          node.body.kind === 'leaf' &&
          node.body.value.family === 'abilityEntity'
            ? [
                {
                  abilityEntityId: node.body.value.action.abilityEntityId,
                  skillId: node.body.value.action.skillId,
                  sourcePath: node.sourcePath,
                },
              ]
            : [],
        ),
    ),
    file: rendered,
    auditFile: {
      relativePath: auditName,
      content:
        JSON.stringify(
          {
            skillId,
            projectileIds,
            callbackIds,
            runtimeBuffIds: [...runtimeBuffIds].sort(),
            supplementalBuffIds: [...args.supplementalBuffIds].sort(),
            omittedVisualOnlyBuffIds: [...visualOnlyIds].sort(),
            source: { file: sourcePath, sha256: sha256(sourceText) },
            scope: 'full-active-skill-action-graph-zero-distance-runtime',
          },
          null,
          2,
        ) + '\n',
    },
    output: destination,
    skillId,
    sequences: definition.scheduledSequences.length,
    abilityEntityObservedBuffIds: [...identityObservedBuffIds].sort(),
  };
}

export async function generateOperatorActiveSkillRuntime(
  args: OperatorActiveSkillRuntimeArguments,
) {
  requireExactOwnedDirectory(
    args.output,
    path.resolve('tmp/game-data-generated/operator-active-skills'),
    args.slug,
  );
  requireExactOwnedDirectory(
    args.auditOutput,
    path.resolve('tmp/game-data-audit/operator-active-skills'),
    args.slug,
  );
  const planned = planOperatorActiveSkillRuntime(args);
  requireOwnedDirectory(args.output, args.slug, planned.file.relativePath);
  requireOwnedDirectory(args.auditOutput, args.slug, planned.auditFile.relativePath);
  if (args.check) {
    if (
      !fs.existsSync(planned.output) ||
      normalize(fs.readFileSync(planned.output, 'utf8')) !== planned.file.content
    )
      throw new Error(`operator active skill runtime is stale: ${planned.output}`);
  } else {
    await writeGeneratedDefinitionFiles(args.output, [
      ...readOwnedSiblingFiles(args.output, planned.file.relativePath),
      planned.file,
    ]);
    await writeGeneratedDefinitionFiles(args.auditOutput, [
      ...readOwnedSiblingFiles(args.auditOutput, planned.auditFile.relativePath),
      planned.auditFile,
    ]);
  }
  return { output: planned.output, skillId: planned.skillId, sequences: planned.sequences };
}

function readOwnedSiblingFiles(
  directory: string,
  replacedName: string,
): Array<{ relativePath: string; content: string }> {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter(name => name !== replacedName)
    .map(name => ({
      relativePath: name,
      content: fs.readFileSync(path.resolve(directory, name), 'utf8'),
    }));
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function readAbilityEntityEvidence(source: string): {
  readonly templates: Record<string, Record<string, unknown>>;
} {
  if (!fs.statSync(source).isDirectory())
    return readJson(source) as { templates: Record<string, Record<string, unknown>> };
  const templates: Record<string, Record<string, unknown>> = {};
  for (const name of fs
    .readdirSync(source)
    .filter(name => name.endsWith('.json'))
    .sort()) {
    const file = path.resolve(source, name);
    const value = readJson(file);
    if (value === null || typeof value !== 'object' || Array.isArray(value))
      throw new Error(`${file}: expected AbilityEntityData object`);
    const record = value as Record<string, unknown>;
    if (typeof record.gameId !== 'string' || record.gameId.length === 0)
      throw new Error(`${file}.gameId: expected non-empty string`);
    if (templates[record.gameId] !== undefined)
      throw new Error(`${source}: duplicate AbilityEntityData ${JSON.stringify(record.gameId)}`);
    templates[record.gameId] = record;
  }
  return { templates };
}

function loadBuffClosureSources(
  rootIds: readonly string[],
  directory: string,
  globalBuffCatalog?: ReturnType<typeof parseGlobalBuffTemplateCatalogSource>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  // 读取由公共闭包要求的资源，CLI 不另维护一套只认识静态引用的遍历规则。
  collectBuffRuntimeClosure(
    rootIds,
    id => {
      const value = readJson(path.resolve(directory, `${id}.json`));
      result[id] = value;
      return value;
    },
    globalBuffCatalog,
  );
  return result;
}

export function readTimeDilationPriorities(file: string): Map<number, number> {
  const text = fs.readFileSync(file, 'utf8');
  const rows = [...text.matchAll(/^\s*priority\('([^']+)',\s*(-?\d+(?:\.\d+)?)\),?\s*$/gm)];
  if (rows.length === 0) throw new Error(`${file}: time-dilation priorities not found`);
  return new Map(rows.map(match => [gameplayTagIdFromPath(match[1]!), Number(match[2])]));
}

function requireOwnedDirectory(directory: string, slug: string, expectedName: string): void {
  if (path.basename(path.resolve(directory)) !== slug)
    throw new Error(`output directory must belong to '${slug}'`);
  if (!fs.existsSync(directory)) return;
  const names = fs.readdirSync(directory);
  const suffix = expectedName.endsWith('.runtime.generated.ts')
    ? '.runtime.generated.ts'
    : expectedName.endsWith('.runtime.audit.json')
      ? '.runtime.audit.json'
      : null;
  const siblingPattern =
    suffix === null
      ? null
      : new RegExp(`^${escapeRegExp(slug)}\\.[A-Za-z][A-Za-z0-9]*${escapeRegExp(suffix)}$`);
  if (names.some(name => name !== expectedName && siblingPattern?.test(name) !== true))
    throw new Error(`refusing to replace unrelated files in ${directory}`);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const normalize = (value: string) => value.replaceAll('\r\n', '\n');
const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

function requireExactOwnedDirectory(directory: string, parent: string, slug: string): void {
  const resolved = path.resolve(directory);
  if (path.dirname(resolved) !== parent || path.basename(resolved) !== slug)
    throw new Error(`directory must be exactly ${path.join(parent, slug)}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const values = new Map<string, string>();
  let check = false;
  const allowed = new Set([
    '--source-root',
    '--source-file',
    '--skill-patch-table',
    '--skill-setting-catalog',
    '--buff-data-root',
    '--ability-entity-catalog',
    '--projectile-blackboard-catalog',
    '--gameplay-tag-catalog',
    '--time-dilation-catalog',
    '--slug',
    '--key',
    '--skill-type',
    '--supplemental-buff-ids',
    '--output',
    '--audit-output',
  ]);
  for (let index = 2; index < process.argv.length; index++) {
    const flag = process.argv[index]!;
    if (flag === '--check') {
      check = true;
      continue;
    }
    if (!allowed.has(flag)) throw new Error(`unsupported argument ${flag}`);
    if (values.has(flag)) throw new Error(`duplicate argument ${flag}`);
    const value = process.argv[++index];
    if (!value || value.startsWith('--')) throw new Error(`missing value for ${flag}`);
    values.set(flag, value);
  }
  const required = (flag: string) => {
    const value = values.get(flag);
    if (!value) throw new Error(`missing ${flag}`);
    return value;
  };
  const skillType = required('--skill-type');
  const supported = [
    'basicAttack',
    'finisher',
    'plungingAttack',
    'battleSkill',
    'comboSkill',
    'ultimate',
  ];
  if (!supported.includes(skillType)) throw new Error(`unsupported --skill-type ${skillType}`);
  console.log(
    await generateOperatorActiveSkillRuntime({
      sourceRoot: required('--source-root'),
      sourceFile: required('--source-file'),
      skillPatchTable: required('--skill-patch-table'),
      ...(values.has('--skill-setting-catalog')
        ? { skillSettingCatalog: required('--skill-setting-catalog') }
        : {}),
      buffDataRoot: required('--buff-data-root'),
      supplementalBuffIds: (values.get('--supplemental-buff-ids') ?? '')
        .split(',')
        .map(value => value.trim())
        .filter(value => value.length > 0),
      abilityEntityCatalog: required('--ability-entity-catalog'),
      projectileBlackboardCatalog: required('--projectile-blackboard-catalog'),
      gameplayTagCatalog: required('--gameplay-tag-catalog'),
      timeDilationCatalog: required('--time-dilation-catalog'),
      slug: required('--slug'),
      key: required('--key'),
      skillType: skillType as OperatorActiveSkillTypeSource,
      output: required('--output'),
      auditOutput: required('--audit-output'),
      check,
    }),
  );
}
