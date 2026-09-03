import { describe, expect, it } from 'vitest';
import scopeFixtures from './fixtures/avywenna-return-blackboard.json';
import runtimeFixtures from './fixtures/avywenna-return-projectile-runtime.json';
import { parseProjectileLaunchActionSource } from '../src/source/referenceActions.ts';
import { parseProjectileRuntimeSource } from '../src/source/projectileRuntime.ts';
import { parseBlackboardDataPairs } from '../src/source/blackboard.ts';
import type { KnownNativeActionLeafSource } from '../src/source/actionLeaf.ts';
import type { SkillActionGraphSource } from '../src/source/skillActionGraph.ts';
import {
  compileZeroDistanceFirstTickBlockProjectileSource,
  compileZeroDistanceFirstTickHitProjectileSource,
  compileZeroDistanceFirstTickProjectileSource,
  compileZeroDistanceFirstTickReachProjectileSource,
  compileZeroDistanceProjectileLaunchFromSources,
  createZeroDistanceProjectileProjectionExtensionSource,
} from '../src/compiler/projectileRuntimeProjection.ts';
import { returnProjectionContext } from './support/avywennaReturnProjection.ts';

const raw = scopeFixtures[0]!;
const controls = {
  targetFilterMode: 'None',
  targetFilterSettings: raw.launch.targetSettings,
  alsoLaunchToHittableTarget: false,
};
const parse = (fields: Record<string, unknown> = {}) =>
  parseProjectileLaunchActionSource({ ...raw.launch, ...fields }, 'fixture.launch');
const runtime = parseProjectileRuntimeSource(runtimeFixtures[0], 'fixture.runtime');
const template = {
  projectileId: raw.template.projectileId,
  entityBlackboard: parseBlackboardDataPairs(raw.template.entityBlackboard, 'fixture.template'),
};
const graph = (skillId: string): SkillActionGraphSource<KnownNativeActionLeafSource> => ({
  skillId,
  level: 1,
  durationFrame: 0,
  declaredBlackboard: [],
  actionGroup: { timelineActions: [], passiveEvents: [] },
});
const callback = (skillId: string) => ({
  skillId,
  declaredBlackboard: [],
  sequence: { steps: [] },
  delayedSequences: [],
});
const input = (fields: Record<string, unknown> = {}) => ({
  sourcePath: 'fixture.launch',
  launch: parse(fields),
  runtime,
  template,
  hit: callback(raw.hit.skillId),
  reach: callback(raw.reach.skillId),
  hitGraph: graph(raw.hit.skillId),
  reachGraph: graph(raw.reach.skillId),
  blockGraph: graph('fixture.block'),
  callbackContext: returnProjectionContext,
  projectionContext: returnProjectionContext,
});
const extension = createZeroDistanceProjectileProjectionExtensionSource({
  catalog: {
    runtimes: new Map([[runtime.projectileId, runtime]]),
    templates: new Map([[template.projectileId, template]]),
    callbackGraphs: new Map([
      [raw.hit.skillId, graph(raw.hit.skillId)],
      [raw.reach.skillId, graph(raw.reach.skillId)],
    ]),
  },
  callbackContext: returnProjectionContext,
});

describe('LaunchProjectile 原生新增目标控制', () => {
  it('旧结构明确没有过滤配置，当前关闭结构保留完整目标设置', () => {
    expect(parse()).toMatchObject({
      targetFilterMode: 'None',
      targetFilterSettings: null,
      alsoLaunchToHittableTarget: false,
    });
    expect(parse(controls).targetFilterSettings).toEqual(parse().target);
    expect(compileZeroDistanceFirstTickProjectileSource(input(controls))).toEqual(
      compileZeroDistanceFirstTickProjectileSource(input()),
    );
  });

  it.each(['None', 'OnlyHit', 'NeverHit'])('保留命名枚举 %s 和额外发射开关', mode => {
    expect(
      parse({ ...controls, targetFilterMode: mode, alsoLaunchToHittableTarget: true }),
    ).toMatchObject({ targetFilterMode: mode, alsoLaunchToHittableTarget: true });
  });

  it.each([0, 1, 2, '0', 'Unknown', null])('不接受枚举编码或未知名称 %s', mode => {
    expect(() => parse({ ...controls, targetFilterMode: mode })).toThrow('targetFilterMode');
  });

  it.each(Object.keys(controls))('新字段组缺少 %s 时不降级成旧结构', field => {
    const incomplete: Record<string, unknown> = { ...controls };
    delete incomplete[field];
    expect(() => parse(incomplete)).toThrow(field);
  });

  it('关闭配置也严格校验数据类型，保留未知字段失败边界', () => {
    expect(() => parse({ ...controls, targetFilterSettings: null })).toThrow(
      'targetFilterSettings',
    );
    expect(() => parse({ ...controls, alsoLaunchToHittableTarget: 0 })).toThrow(
      'alsoLaunchToHittableTarget',
    );
    expect(() => parse({ ...controls, unexpectedLaunchField: false })).toThrow();
  });

  // 所有公开投影入口共用边界，避免绕开工厂调用底层函数时静默丢失新增语义。
  it.each([
    ['OnlyHit', { targetFilterMode: 'OnlyHit' }, 'targetFilterMode'],
    ['NeverHit', { targetFilterMode: 'NeverHit' }, 'targetFilterMode'],
    ['额外发射', { alsoLaunchToHittableTarget: true }, 'alsoLaunchToHittableTarget'],
  ] as const)('%s 在所有战斗投影入口明确失败', (_name, override, field) => {
    const data = input({ ...controls, ...override });
    for (const compile of [
      compileZeroDistanceFirstTickProjectileSource,
      compileZeroDistanceFirstTickHitProjectileSource,
      compileZeroDistanceFirstTickReachProjectileSource,
      compileZeroDistanceFirstTickBlockProjectileSource,
      compileZeroDistanceProjectileLaunchFromSources,
    ])
      expect(() => compile(data)).toThrow(`fixture.launch.${field}`);
    expect(() => extension(data.launch, data.sourcePath, returnProjectionContext)).toThrow(
      `fixture.launch.${field}`,
    );
  });

  it('没有启用回调的投射物先按无实际行为剔除，不要求建模其过滤条件', () => {
    const launch = parse({
      ...controls,
      targetFilterMode: 'OnlyHit',
      alsoLaunchToHittableTarget: true,
      castSkillOnHit: false,
      castSkillOnReach: false,
    });
    expect(extension(launch, 'fixture.launch', returnProjectionContext)).toEqual([]);
  });
});
