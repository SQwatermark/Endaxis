import type { DeclaredBlackboardValueSource } from '../source/blackboard.ts';
import type { ProjectileLaunchActionSource } from '../source/referenceActions.ts';
import type { ProjectileRuntimeSource } from '../source/projectileRuntime.ts';
import type { KnownNativeActionLeafSource } from '../source/actionLeaf.ts';
import type { SkillActionGraphSource } from '../source/skillActionGraph.ts';
import {
  compileCombatActionSequenceSource,
  type CombatActionProjectionContextSource,
  type CombatActionProjectionExtensionsSource,
  type CompiledBuffSequenceSource,
} from './buffRuntimeProjection.ts';
import {
  compileSynchronousProjectileCallbackScopesSource,
  type CompiledActionBlackboardScopeSource,
  type ProjectileCallbackInvocationSource,
} from './projectileCallbackScopes.ts';

export interface ZeroDistanceProjectileCallbackSource {
  readonly skillId: string;
  readonly declaredBlackboard: readonly DeclaredBlackboardValueSource[];
  readonly sequence: CompiledBuffSequenceSource;
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
  return (launch, sourcePath) => {
    const runtime = input.catalog.runtimes.get(launch.projectileId);
    if (!runtime) throw new Error(`${sourcePath}: missing ProjectileData ${launch.projectileId}`);
    const template = input.catalog.templates.get(launch.projectileId) ?? null;
    const enabled = launch.callbacks.filter(callback => callback.enabled);
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
          callbackContext: input.callbackContext,
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
        callbackContext: input.callbackContext,
        visualOnlyIds: input.visualOnlyIds,
        callbackExtensions: input.callbackExtensions,
      }),
    ];
  };
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
  const steps = graph.actionGroup.timelineActions.flatMap((timeline, index) => {
    if (timeline.startFrame !== 0)
      throw new Error(
        `${graph.skillId}.timelineActions[${index}]: delayed projectile callback is unsupported`,
      );
    return compileCombatActionSequenceSource(timeline.sequence, context, visualOnlyIds, extensions)
      .steps;
  });
  return {
    skillId: graph.skillId,
    declaredBlackboard: graph.declaredBlackboard,
    sequence: { steps },
  };
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
  return compileZeroDistanceFirstTickProjectileSource({
    sourcePath: input.sourcePath,
    launch: input.launch,
    runtime: input.runtime,
    template: input.template,
    hit: compileImmediateProjectileCallbackSkillSource({
      graph: input.hitGraph,
      ...callbackInput,
    }),
    reach: compileImmediateProjectileCallbackSkillSource({
      graph: input.reachGraph,
      ...callbackInput,
    }),
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

function assertSupportedFirstTickShape(runtime: ProjectileRuntimeSource, path: string): void {
  const segment = runtime.moveSegments[0];
  if (
    !runtime.finishOnReach ||
    runtime.hitOnReach ||
    runtime.allowHitSameTarget ||
    runtime.maxHitCount !== -1 ||
    runtime.collisionDetectTiming !== 0 ||
    runtime.hitAndBlockDetectDelayTime !== 0 ||
    runtime.hitAndBlockDetectDelayDistance !== 0 ||
    runtime.keepMoveOnReach ||
    runtime.canTraceTargetAfterReach ||
    !runtime.targetFilter.checkAlive ||
    !runtime.targetFilter.autoSetTargetFaction ||
    runtime.targetFilter.factionTarget !== 1 ||
    runtime.targetFilter.filterObjectType ||
    runtime.targetFilter.filterSlot ||
    runtime.targetFilter.filterGameplayTag ||
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
