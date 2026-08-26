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
