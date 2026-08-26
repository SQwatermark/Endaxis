import scopeFixtures from '../fixtures/avywenna-return-blackboard.json';
import damageFixtures from '../fixtures/avywenna-return-damage.json';
import { compileCombatActionSequenceSource } from '../../src/compiler/buffRuntimeProjection.ts';
import { compileSynchronousProjectileCallbackScopesSource } from '../../src/compiler/projectileCallbackScopes.ts';
import { parseKnownNativeActionLeafSource } from '../../src/source/actionLeaf.ts';
import { parseBlackboardDataPairs, parseDeclaredBlackboard } from '../../src/source/blackboard.ts';
import { parseNativeSequenceSource } from '../../src/source/controlFlow.ts';
import { parseProjectileLaunchActionSource } from '../../src/source/referenceActions.ts';

export const returnProjectionContext = {
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
 * 测试显式给定 hit→reach 或只有 reach，不把这个输入顺序当作真实零距离调度证据。
 * 此切片的伤害/资源均读 ActionSource；没有把投射物 Owner 的原生行为映射成 caster。
 */
export function makeReturnProjection(index: number, hit = true) {
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
  return compileSynchronousProjectileCallbackScopesSource({
    sourcePath,
    launch: parseProjectileLaunchActionSource(raw.launch, sourcePath),
    template: {
      projectileId: raw.template.projectileId,
      entityBlackboard: parseBlackboardDataPairs(raw.template.entityBlackboard, sourcePath),
    },
    invocations: [
      ...(hit
        ? [
            {
              event: 'hit' as const,
              skillId: raw.hit.skillId,
              declaredBlackboard: parseDeclaredBlackboard(raw.hit, raw.hit.skillId),
              sequence: compileCombatActionSequenceSource(hitSequence, returnProjectionContext),
            },
          ]
        : []),
      {
        event: 'reach',
        skillId: raw.reach.skillId,
        declaredBlackboard: parseDeclaredBlackboard(raw.reach, raw.reach.skillId),
        sequence: compileCombatActionSequenceSource(reachSequence, returnProjectionContext),
      },
    ],
  });
}
