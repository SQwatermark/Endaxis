import type { DeclaredBlackboardValueSource } from '../source/blackboard.ts';
import type { ProjectileLaunchActionSource } from '../source/referenceActions.ts';
import type { ProjectileRuntimeSource } from '../source/projectileRuntime.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { SkillActionGraphSource } from '../source/skillActionGraph.ts';
import { collectNativeActionNodes } from '../source/controlFlow.ts';
import { compileCombatActionSequenceSource } from './buffRuntimeProjection.ts';
import type {
  CombatActionProjectionContextSource,
  CombatActionProjectionExtensionsSource,
} from './combatProjectionCommon.ts';
import type { CompiledBuffSequenceSource } from './combatActionProjectionTypes.ts';
import {
  compileSynchronousProjectileCallbackScopesSource,
  type CompiledActionBlackboardScopeSource,
  type ProjectileCallbackInvocationSource,
} from './projectileCallbackScopes.ts';
import { isStaticSingleEnemyTargetGroup } from './combatProjectionCommon.ts';

export interface ZeroDistanceProjectileCallbackSource {
  readonly skillId: string;
  readonly declaredBlackboard: readonly DeclaredBlackboardValueSource[];
  readonly sequence: CompiledBuffSequenceSource;
  readonly delayedSequences: readonly {
    readonly startFrame: number;
    readonly endFrame: number;
    readonly sequence: CompiledBuffSequenceSource;
  }[];
}

export interface ZeroDistanceProjectileProjectionCatalogSource {
  readonly runtimes: ReadonlyMap<string, ProjectileRuntimeSource>;
  readonly templates: ReadonlyMap<
    string,
    {
      readonly projectileId: string;
      readonly entityBlackboard: readonly DeclaredBlackboardValueSource[];
    }
  >;
  readonly callbackGraphs: ReadonlyMap<string, SkillActionGraphSource<KnownNativeActionLeafSource>>;
}

/**
 * 把版本化 ProjectileData、实体模板与回调 SkillData 目录接成公共动作扩展。
 * 这里只接受已证明的首帧零距离形状；目录缺边、重复路由或其他事件均在来源路径上失败。
 */
export function createZeroDistanceProjectileProjectionExtensionSource(input: {
  readonly catalog: ZeroDistanceProjectileProjectionCatalogSource;
  readonly callbackContext: CombatActionProjectionContextSource;
  readonly visualOnlyIds?: ReadonlySet<string>;
  readonly callbackExtensions?: CombatActionProjectionExtensionsSource;
}): NonNullable<CombatActionProjectionExtensionsSource['compileProjectileLaunch']> {
  return (launch, sourcePath, projectionContext) => {
    const callbackContext = {
      ...input.callbackContext,
      ...(projectionContext.scheduleRelativeProjectileCallback === undefined
        ? {}
        : {
            scheduleRelativeProjectileCallback:
              projectionContext.scheduleRelativeProjectileCallback,
          }),
    };
    const runtime = input.catalog.runtimes.get(launch.projectileId);
    if (!runtime) throw new Error(`${sourcePath}: missing ProjectileData ${launch.projectileId}`);
    const template = input.catalog.templates.get(launch.projectileId) ?? null;
    const enabled = launch.callbacks.filter(callback => callback.enabled);
    // 没有任何启用回调的投射物只承载空间与表现；关闭槽位中的 skillId 是序列化残留。
    if (enabled.length === 0) return [];
    const callback = (event: 'block' | 'hit' | 'reach') => {
      const routes = enabled.filter(item => item.event === event);
      if (routes.length !== 1 || !routes[0]!.skillId)
        throw new Error(`${sourcePath}: expected one enabled projectile ${event} callback`);
      const graph = input.catalog.callbackGraphs.get(routes[0]!.skillId);
      if (!graph)
        throw new Error(
          `${sourcePath}: missing projectile callback SkillData ${routes[0]!.skillId}`,
        );
      return graph;
    };
    if (enabled.length === 1 && enabled[0]!.event === 'block') {
      return [
        compileZeroDistanceFirstTickBlockProjectileSource({
          sourcePath,
          launch,
          runtime,
          template,
          blockGraph: callback('block'),
          callbackContext,
          visualOnlyIds: input.visualOnlyIds,
          callbackExtensions: input.callbackExtensions,
        }),
      ];
    }
    if (enabled.length === 1 && enabled[0]!.event === 'hit') {
      return [
        compileZeroDistanceFirstTickHitProjectileSource({
          sourcePath,
          launch,
          runtime,
          template,
          hitGraph: callback('hit'),
          callbackContext,
          visualOnlyIds: input.visualOnlyIds,
          callbackExtensions: input.callbackExtensions,
        }),
      ];
    }
    if (
      enabled.length === 2 &&
      enabled.some(item => item.event === 'block') &&
      enabled.some(item => item.event === 'hit') &&
      enabled[0]!.skillId === enabled[1]!.skillId
    ) {
      // combat-spec 已闭环首 Tick 顺序为 collision(hit) → move/block；零距离唯一木桩
      // 先命中并以 maxHitCount=1 结束该投射物，因此同路由的 block 是未到达备选。
      return [
        compileZeroDistanceFirstTickHitProjectileSource({
          sourcePath,
          launch,
          runtime,
          template,
          hitGraph: callback('hit'),
          callbackContext,
          visualOnlyIds: input.visualOnlyIds,
          callbackExtensions: input.callbackExtensions,
        }),
      ];
    }
    const unsupported = enabled.filter(item => item.event !== 'hit' && item.event !== 'reach');
    if (unsupported.length > 0 || enabled.length !== 2)
      throw new Error(
        `${sourcePath}: unsupported projectile callback set ${enabled.map(item => item.event).join(',')}`,
      );
    return [
      compileZeroDistanceProjectileLaunchFromSources({
        sourcePath,
        launch,
        runtime,
        template,
        hitGraph: callback('hit'),
        reachGraph: callback('reach'),
        callbackContext,
        visualOnlyIds: input.visualOnlyIds,
        callbackExtensions: input.callbackExtensions,
      }),
    ];
  };
}

/** 首帧必然碰撞但没有 reach 路由的投射物；只执行原生启用的 hit 回调。 */
export function compileZeroDistanceFirstTickHitProjectileSource(input: {
  readonly sourcePath: string;
  readonly launch: ProjectileLaunchActionSource;
  readonly runtime: ProjectileRuntimeSource;
  readonly template: {
    readonly projectileId: string;
    readonly entityBlackboard: readonly DeclaredBlackboardValueSource[];
  } | null;
  readonly hitGraph: SkillActionGraphSource<KnownNativeActionLeafSource>;
  readonly callbackContext: CombatActionProjectionContextSource;
  readonly visualOnlyIds?: ReadonlySet<string>;
  readonly callbackExtensions?: CombatActionProjectionExtensionsSource;
}): CompiledActionBlackboardScopeSource {
  const { sourcePath, launch, runtime, template } = input;
  if (runtime.projectileId !== launch.projectileId)
    throw new Error(`${sourcePath}: ProjectileData identity mismatch`);
  assertSupportedFirstTickShape(runtime, sourcePath, {
    // combat-spec 已证明 allowHitSameTarget=false 使同一目标在整枚投射物
    // 生命周期内最多成功命中一次。因此唯一木桩下，-1 与首击回收的 1
    // 对 hit-only 路由都只产生一次战斗可见回调。
    maxHitCounts: new Set([-1, 1]),
    requireCollider: !runtime.hitOnReach,
    allowHitOnReach: true,
    allowFinishByFirstHitCount: true,
  });
  const hit = compileImmediateProjectileCallbackSkillSource({
    graph: input.hitGraph,
    context: input.callbackContext,
    visualOnlyIds: input.visualOnlyIds,
    extensions: input.callbackExtensions,
  });
  scheduleDelayedProjectileCallbackSource(hit, input.callbackContext, sourcePath);
  return compileSynchronousProjectileCallbackScopesSource({
    sourcePath,
    launch,
    template,
    invocations: [{ event: 'hit', ...hit }],
    // 此形状不做实体板赋值，回调声明也不读取 EntityBB；完整 ProjectileData 已足够
    // 证明同步 hit 路由，不要求另造一个空模板目录项。
    allowMissingEntityBlackboardEvidence: true,
  });
}

/**
 * 将首 tick 墙地阻挡回调编译为同步回调。空间折叠只消除行进距离；阻挡层、检测时机、
 * 碰撞体和回调路由仍须由 ProjectileData/LaunchProjectile 逐项证明。
 */
export function compileZeroDistanceFirstTickBlockProjectileSource(input: {
  readonly sourcePath: string;
  readonly launch: ProjectileLaunchActionSource;
  readonly runtime: ProjectileRuntimeSource;
  readonly template: {
    readonly projectileId: string;
    readonly entityBlackboard: readonly DeclaredBlackboardValueSource[];
  } | null;
  readonly blockGraph: SkillActionGraphSource<KnownNativeActionLeafSource>;
  readonly callbackContext: CombatActionProjectionContextSource;
  readonly visualOnlyIds?: ReadonlySet<string>;
  readonly callbackExtensions?: CombatActionProjectionExtensionsSource;
}): CompiledActionBlackboardScopeSource {
  const { sourcePath, launch, runtime, template } = input;
  if (runtime.projectileId !== launch.projectileId)
    throw new Error(`${sourcePath}: ProjectileData identity mismatch`);
  assertSupportedFirstTickBlockShape(runtime, sourcePath);
  const block = compileImmediateProjectileCallbackSkillSource({
    graph: input.blockGraph,
    context: input.callbackContext,
    visualOnlyIds: input.visualOnlyIds,
    extensions: input.callbackExtensions,
  });
  scheduleDelayedProjectileCallbackSource(block, input.callbackContext, sourcePath);
  return compileSynchronousProjectileCallbackScopesSource({
    sourcePath,
    launch,
    template,
    invocations: [{ event: 'block', ...block }],
    allowMissingEntityBlackboardEvidence: true,
  });
}

/** 将立即执行的回调 SkillData 动作图完整编译为一次回调，不抽取手选动作切片。 */
export function compileImmediateProjectileCallbackSkillSource(input: {
  readonly graph: SkillActionGraphSource<KnownNativeActionLeafSource>;
  readonly context: CombatActionProjectionContextSource;
  readonly visualOnlyIds?: ReadonlySet<string>;
  readonly extensions?: CombatActionProjectionExtensionsSource;
}): ZeroDistanceProjectileCallbackSource {
  const { graph, context, visualOnlyIds = new Set(), extensions = {} } = input;
  if (graph.actionGroup.passiveEvents.length > 0)
    throw new Error(`${graph.skillId}: projectile callback passive events are unsupported`);
  const discoveredEnemyGroups = graph.actionGroup.timelineActions.flatMap(timeline =>
    collectNativeActionNodes(timeline.sequence)
      .filter(
        node =>
          node.body.kind === 'leaf' &&
          node.body.value.family === 'targetGroup' &&
          isStaticSingleEnemyTargetGroup(node.body.value.action),
      )
      .map(node =>
        node.body.kind === 'leaf' && node.body.value.family === 'targetGroup'
          ? node.body.value.action.targetGroupKey
          : '',
      ),
  );
  const callbackContext: CombatActionProjectionContextSource = {
    ...context,
    staticEnemyTargetGroupKeys: new Set([
      ...(context.staticEnemyTargetGroupKeys ?? []),
      ...discoveredEnemyGroups,
    ]),
  };
  const timelines = graph.actionGroup.timelineActions.map((timeline, index) => {
    const sequence = compileCombatActionSequenceSource(
      timeline.sequence,
      callbackContext,
      visualOnlyIds,
      extensions,
    );
    if (timeline.startFrame !== 0) {
      assertDelayedCallbackSequenceDoesNotReadBlackboard(
        sequence,
        `${graph.skillId}.timelineActions[${index}]`,
      );
    }
    return { startFrame: timeline.startFrame, endFrame: timeline.endFrame, sequence };
  });
  return {
    skillId: graph.skillId,
    declaredBlackboard: graph.declaredBlackboard,
    sequence: {
      steps: timelines
        .filter(timeline => timeline.startFrame === 0)
        .flatMap(timeline => timeline.sequence.steps),
    },
    delayedSequences: timelines.filter(
      timeline => timeline.startFrame !== 0 && timeline.sequence.steps.length > 0,
    ),
  };
}

function assertDelayedCallbackSequenceDoesNotReadBlackboard(
  sequence: CompiledBuffSequenceSource,
  sourcePath: string,
): void {
  const visit = (value: unknown): boolean => {
    if (Array.isArray(value)) return value.some(visit);
    if (value === null || typeof value !== 'object') return false;
    const record = value as Readonly<Record<string, unknown>>;
    if (record.kind === 'blackboard') return true;
    return Object.values(record).some(visit);
  };
  if (visit(sequence))
    throw new Error(`${sourcePath}: delayed projectile callback reads action blackboard`);
}

function scheduleDelayedProjectileCallbackSource(
  callback: ZeroDistanceProjectileCallbackSource,
  context: CombatActionProjectionContextSource,
  sourcePath: string,
): void {
  if (callback.delayedSequences.length === 0) return;
  const schedule = context.scheduleRelativeProjectileCallback;
  if (schedule === undefined)
    throw new Error(`${sourcePath}: delayed projectile callback requires a relative scheduler`);
  callback.delayedSequences.forEach(schedule);
}

/** 由完整 hit/reach SkillData 动作图建立首帧投射物回调链。 */
export function compileZeroDistanceProjectileLaunchFromSources(input: {
  readonly sourcePath: string;
  readonly launch: ProjectileLaunchActionSource;
  readonly runtime: ProjectileRuntimeSource;
  readonly template: {
    readonly projectileId: string;
    readonly entityBlackboard: readonly DeclaredBlackboardValueSource[];
  } | null;
  readonly hitGraph: SkillActionGraphSource<KnownNativeActionLeafSource>;
  readonly reachGraph: SkillActionGraphSource<KnownNativeActionLeafSource>;
  readonly callbackContext: CombatActionProjectionContextSource;
  readonly visualOnlyIds?: ReadonlySet<string>;
  readonly callbackExtensions?: CombatActionProjectionExtensionsSource;
}): CompiledActionBlackboardScopeSource {
  const callbackInput = {
    context: input.callbackContext,
    visualOnlyIds: input.visualOnlyIds,
    extensions: input.callbackExtensions,
  };
  const hit = compileImmediateProjectileCallbackSkillSource({
    graph: input.hitGraph,
    ...callbackInput,
  });
  const reach = compileImmediateProjectileCallbackSkillSource({
    graph: input.reachGraph,
    ...callbackInput,
  });
  scheduleDelayedProjectileCallbackSource(hit, input.callbackContext, input.sourcePath);
  scheduleDelayedProjectileCallbackSource(reach, input.callbackContext, input.sourcePath);
  return compileZeroDistanceFirstTickProjectileSource({
    sourcePath: input.sourcePath,
    launch: input.launch,
    runtime: input.runtime,
    template: input.template,
    hit,
    reach,
  });
}

/**
 * 只投影“首帧与唯一木桩重叠且同帧到达”的 ProjectileData 形状。
 * combat-spec 已证明该边界的原生阶段为 collision(hit) → move/reach；其他形状严格拒绝。
 */
export function compileZeroDistanceFirstTickProjectileSource(input: {
  readonly sourcePath: string;
  readonly launch: ProjectileLaunchActionSource;
  readonly runtime: ProjectileRuntimeSource;
  readonly template: {
    readonly projectileId: string;
    readonly entityBlackboard: readonly DeclaredBlackboardValueSource[];
  } | null;
  readonly hit: ZeroDistanceProjectileCallbackSource;
  readonly reach: ZeroDistanceProjectileCallbackSource;
}): CompiledActionBlackboardScopeSource {
  const { sourcePath, launch, runtime, template, hit, reach } = input;
  if (runtime.projectileId !== launch.projectileId)
    throw new Error(`${sourcePath}: ProjectileData identity mismatch`);
  assertSupportedFirstTickShape(runtime, sourcePath);
  const invocations: ProjectileCallbackInvocationSource[] = [
    { event: 'hit', ...hit },
    { event: 'reach', ...reach },
  ];
  return compileSynchronousProjectileCallbackScopesSource({
    sourcePath,
    launch,
    template,
    invocations,
  });
}

function assertSupportedFirstTickShape(
  runtime: ProjectileRuntimeSource,
  path: string,
  options: {
    readonly maxHitCounts?: ReadonlySet<number>;
    readonly requireCollider?: boolean;
    readonly allowHitOnReach?: boolean;
    readonly allowFinishByFirstHitCount?: boolean;
  } = {},
): void {
  const segment = runtime.moveSegments[0];
  const maxHitCounts = options.maxHitCounts ?? new Set([-1]);
  // ProjectileComponent.HitTarget increments m_hitCount, resolves maxHitCount, and calls
  // FinishProjectile(HitCount) as soon as the positive limit is reached. For a hit-only
  // route with maxHitCount=1, finishOnReach/keepMoveOnReach therefore cannot affect any
  // later combat-visible callback in the zero-distance single-target model. maxHitCount=-1
  // is only admitted by callers that also retain allowHitSameTarget=false below.
  const finishesOnFirstHit =
    options.allowFinishByFirstHitCount === true && runtime.maxHitCount === 1;
  if (
    (!runtime.finishOnReach && !finishesOnFirstHit) ||
    (runtime.hitOnReach && options.allowHitOnReach !== true) ||
    runtime.allowHitSameTarget ||
    !maxHitCounts.has(runtime.maxHitCount) ||
    runtime.collisionDetectTiming !== 0 ||
    runtime.hitAndBlockDetectDelayTime !== 0 ||
    runtime.hitAndBlockDetectDelayDistance !== 0 ||
    (runtime.keepMoveOnReach && !finishesOnFirstHit) ||
    runtime.canTraceTargetAfterReach ||
    !runtime.targetFilter.checkAlive ||
    !runtime.targetFilter.autoSetTargetFaction ||
    runtime.targetFilter.factionTarget !== 1 ||
    runtime.targetFilter.filterObjectType ||
    runtime.targetFilter.filterSlot ||
    runtime.targetFilter.filterGameplayTag ||
    (options.requireCollider === true &&
      (runtime.colliderShape === null ||
        runtime.colliderShape.shapeType !== 1 ||
        !(runtime.colliderShape.radius > 0))) ||
    runtime.presetPointKeys.length !== 2 ||
    runtime.presetPointKeys[0] !== 'LaunchPoint' ||
    runtime.presetPointKeys[1] !== 'TargetPoint' ||
    runtime.useSegmentMove ||
    runtime.moveSegments.length !== 1 ||
    segment === undefined ||
    segment.startPointKey !== 'LaunchPoint' ||
    segment.moveModeId !== 'Default' ||
    segment.endPointKey !== 'TargetPoint' ||
    segment.earlyNextByDuration ||
    segment.segmentDuration !== 0 ||
    segment.skipHitAndBlockDetection
  ) {
    throw new Error(`${path}: ProjectileData is outside the proven zero-distance first-tick shape`);
  }
}

function assertSupportedFirstTickBlockShape(runtime: ProjectileRuntimeSource, path: string): void {
  const segment = runtime.moveSegments[0];
  if (
    runtime.finishOnReach ||
    runtime.hitOnReach ||
    runtime.collisionDetectTiming !== 0 ||
    runtime.hitAndBlockDetectDelayTime !== 0 ||
    runtime.hitAndBlockDetectDelayDistance !== 0 ||
    runtime.colliderShape === null ||
    runtime.colliderShape.shapeType !== 1 ||
    !(runtime.colliderShape.radius > 0) ||
    runtime.blockLayerDef === null ||
    runtime.blockLayerDef.value !== 1 ||
    runtime.blockLayerDef.name !== 'WallAndGround' ||
    runtime.presetPointKeys.length !== 2 ||
    runtime.presetPointKeys[0] !== 'LaunchPoint' ||
    runtime.presetPointKeys[1] !== 'TargetPoint' ||
    runtime.useSegmentMove ||
    runtime.moveSegments.length !== 1 ||
    segment === undefined ||
    segment.startPointKey !== 'LaunchPoint' ||
    segment.moveModeId !== 'Default' ||
    segment.endPointKey !== 'TargetPoint' ||
    segment.earlyNextByDuration ||
    segment.segmentDuration !== 0 ||
    segment.skipHitAndBlockDetection
  ) {
    throw new Error(`${path}: ProjectileData is outside the proven zero-distance block shape`);
  }
}
