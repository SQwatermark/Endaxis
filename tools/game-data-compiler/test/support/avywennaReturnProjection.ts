import { fixtureGameplayTagRegistry } from '../gameplayTagFixtures.ts';
import scopeFixtures from '../fixtures/avywenna-return-blackboard.json';
import damageFixtures from '../fixtures/avywenna-return-damage.json';
import runtimeFixtures from '../fixtures/avywenna-return-projectile-runtime.json';
import { compileCombatActionSequenceSource } from '../../src/compiler/buffRuntimeProjection.ts';
import { compileZeroDistanceProjectileLaunchFromSources } from '../../src/compiler/projectileRuntimeProjection.ts';
import { compileSynchronousProjectileCallbackScopesSource } from '../../src/compiler/projectileCallbackScopes.ts';
import { parseKnownNativeActionLeafSource } from '../../src/source/actionLeaf.ts';
import { parseBlackboardDataPairs, parseDeclaredBlackboard } from '../../src/source/blackboard.ts';
import { parseNativeSequenceSource } from '../../src/source/controlFlow.ts';
import { parseProjectileLaunchActionSource } from '../../src/source/referenceActions.ts';
import { parseProjectileRuntimeSource } from '../../src/source/projectileRuntime.ts';

export const returnProjectionContext = {
  gameplayTagRegistry: fixtureGameplayTagRegistry,
  actionOwnerTarget: 'unavailable',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'enemy',
} as const;

export function parseReturnSequence(value: unknown, path: string) {
  return parseNativeSequenceSource(value, path, {}, (value, path) =>
    parseKnownNativeActionLeafSource(value, path, {}),
  );
}

/**
 * 故意有界的测试载体，不是生产干员转换器。只选择写入、潜能条件/倍率/伤害、到达回能守卫。
 * 未纳入命中资格、拉拽/中断、时间膨胀、终结技枪附着及发射/回收生命周期。
 * hit→reach 只由已审计 ProjectileData 首帧形状与 combat-spec 原生阶段顺序产生。
 * 此切片的伤害/资源均读 ActionSource；没有把投射物 Owner 的原生行为映射成 caster。
 */
export function makeReturnProjection(index: number, hit = true, runtimeOverride?: unknown) {
  const raw = scopeFixtures[index]!;
  const damage = damageFixtures[index]!;
  if (
    damage.skillId !== raw.hit.skillId ||
    !raw.sources.some(source => source.sha256 === damage.sha256)
  ) {
    throw new Error('return fixtures must describe the same source file');
  }
  const sourcePath = `${raw.kind}.LaunchProjectile`;
  const hitSequence = parseReturnSequence(
    {
      actionData: [raw.hit.write, damage.branch],
      onlyExecuteWhenSourceIsMainChar: false,
      onlyExecuteWhenSourceIsGuard: false,
    },
    `${raw.hit.skillId}.damageAndWriteSlice`,
  );
  const reachSequence = parseReturnSequence(
    raw.reach.sequence,
    `${raw.reach.skillId}.resourceSlice`,
  );
  const runtimeFixture = runtimeFixtures[index]!;
  if (runtimeFixture.sourceSha256 !== raw.template.rawSha256)
    throw new Error('ProjectileData and template evidence hashes must match');
  const launch = parseProjectileLaunchActionSource(raw.launch, sourcePath);
  const template = {
    projectileId: raw.template.projectileId,
    entityBlackboard: parseBlackboardDataPairs(raw.template.entityBlackboard, sourcePath),
  };
  const reach = {
    skillId: raw.reach.skillId,
    declaredBlackboard: parseDeclaredBlackboard(raw.reach, raw.reach.skillId),
    sequence: compileCombatActionSequenceSource(reachSequence, returnProjectionContext),
  };
  if (!hit) {
    // 负向场景显式注入“只有 reach”，仅证明 reach 不会伪造 hit；不代表零距离调度。
    return compileSynchronousProjectileCallbackScopesSource({
      sourcePath,
      launch,
      template,
      invocations: [{ event: 'reach', ...reach }],
    });
  }
  const timeline = (sequence: ReturnType<typeof parseReturnSequence>) => ({
    startFrame: 0,
    endFrame: 0,
    sequence,
    forceSyncAnimation: { forceSync: false, montageName: '', targetFrame: 0, playbackSpeed: 1 },
  });
  return compileZeroDistanceProjectileLaunchFromSources({
    sourcePath,
    launch,
    runtime: parseProjectileRuntimeSource(
      runtimeOverride ?? runtimeFixture,
      `${sourcePath}.ProjectileData`,
    ),
    template,
    hitGraph: {
      skillId: raw.hit.skillId,
      level: 1,
      durationFrame: 0,
      declaredBlackboard: parseDeclaredBlackboard(raw.hit, raw.hit.skillId),
      actionGroup: { timelineActions: [timeline(hitSequence)], passiveEvents: [] },
    },
    reachGraph: {
      skillId: raw.reach.skillId,
      level: 1,
      durationFrame: 0,
      declaredBlackboard: reach.declaredBlackboard,
      actionGroup: { timelineActions: [timeline(reachSequence)], passiveEvents: [] },
    },
    callbackContext: returnProjectionContext,
  });
}
