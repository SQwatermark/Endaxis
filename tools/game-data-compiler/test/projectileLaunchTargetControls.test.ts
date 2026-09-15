import { describe, expect, it } from 'vitest';
import scopeFixtures from './fixtures/avywenna-return-blackboard.json';
import runtimeFixtures from './fixtures/avywenna-return-projectile-runtime.json';
import lifetimeFixture from './fixtures/liino-no-callback-lifetime-current.ts';
import type { ProjectileRuntimeSource } from '../src/source/projectileRuntime.ts';
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
} from '../src/compiler/abilities/projectileRuntimeProjection.ts';
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
  it('无回调直线分段按移动Tick数到达，拒绝可能由命中或阻挡提前结束的形状', () => {
    const launch = lifetimeFixture.launch;
    const data: ProjectileRuntimeSource = {
      ...lifetimeFixture.runtime,
      moveModeTypes: new Map([
        ['one', 0],
        ['two', 0],
      ]),
      useSegmentMove: true,
      moveSegments: [
        {
          startPointKey: 'LaunchPoint',
          endPointKey: 'TargetPoint',
          moveModeId: 'one',
          earlyNextByDuration: true,
          segmentDuration: 0.3,
          skipHitAndBlockDetection: false,
        },
        {
          startPointKey: 'TargetPoint',
          endPointKey: 'TargetPoint',
          moveModeId: 'two',
          earlyNextByDuration: false,
          segmentDuration: 0,
          skipHitAndBlockDetection: false,
        },
      ],
      blockLayerDef: { value: 0, name: 'Nothing' },
      maxHitCount: -1,
      finishDistance: { value: 50, blackboardKey: null, levelValues: null },
      finishDuration: 2,
    };
    const compile = (changes: Partial<ProjectileRuntimeSource> = {}) =>
      createZeroDistanceProjectileProjectionExtensionSource({
        catalog: {
          runtimes: new Map([[data.projectileId, { ...data, ...changes }]]),
          templates: new Map(),
          callbackGraphs: new Map(),
        },
        callbackContext: returnProjectionContext,
      })(launch, 'segments', returnProjectionContext);
    expect(compile()).toEqual([
      {
        kind: 'launchProjectileLifetime',
        parameters: {
          finish: { reachAfterTicks: 2, maxDurationSeconds: 2 },
        },
      },
    ]);
    expect(() => compile({ maxHitCount: 1 })).toThrow('launch/reset lifetime');
    expect(() => compile({ blockLayerDef: { value: 1, name: 'WallAndGround' } })).toThrow(
      'launch/reset lifetime',
    );
    expect(() =>
      compile({
        moveModeTypes: new Map([
          ['one', 1],
          ['two', 0],
        ]),
      }),
    ).toThrow('launch/reset lifetime');
  });
  it('表现回调保留发射和按原生技能时长计算的回收延迟，支持首Tick先阻挡结束', () => {
    const launch = {
      ...lifetimeFixture.launch,
      callbacks: [{ event: 'hit' as const, enabled: true, skillId: 'presentation' }],
    };
    const data: ProjectileRuntimeSource = {
      ...lifetimeFixture.runtime,
      moveModeTypes: new Map(lifetimeFixture.runtime.moveModeTypes),
      blockLayerDef: { value: -1, name: 'Custom' },
      finishOnBlock: true,
    };
    const compile = (
      changes: Partial<ProjectileRuntimeSource> = {},
      durationFrame = 45,
      target = launch.target,
    ) =>
      createZeroDistanceProjectileProjectionExtensionSource({
        catalog: {
          runtimes: new Map([[data.projectileId, { ...data, ...changes }]]),
          templates: new Map(),
          callbackGraphs: new Map([['presentation', { ...graph('presentation'), durationFrame }]]),
        },
        callbackContext: returnProjectionContext,
      })({ ...launch, target }, 'presentation.launch', returnProjectionContext);
    expect(compile()).toEqual([
      {
        kind: 'launchProjectileLifetime',
        parameters: { finish: 'firstTickReach', recycleDelaySeconds: 1.5 },
      },
    ]);
    expect(compile({}, 0)).toMatchObject([
      {
        parameters: { recycleDelaySeconds: Math.fround(1 / 30) },
      },
    ]);
    expect(() => compile({ finishOnReach: false })).toThrow('launch/reset lifetime');
    expect(() => compile({ finishOnBlock: false })).toThrow('reach shape');
    expect(() => compile({}, -1)).toThrow('invalid callback durationFrame');
    expect(
      compile({ finishOnReach: false, hitOnReach: true, maxHitCount: 1 }, 45, {
        ...launch.target,
        targetSource: 'Target',
        targetGroupKey: '',
      }),
    ).toMatchObject([{ parameters: { finish: 'firstTickReach', recycleDelaySeconds: 1.5 } }]);
    expect(() =>
      compile({ finishOnReach: false, hitOnReach: true, maxHitCount: 2 }, 45, {
        ...launch.target,
        targetSource: 'Target',
        targetGroupKey: '',
      }),
    ).toThrow('launch/reset lifetime');
  });
  it('当前黎风无回调发射保留同点到达寿命，不要求回调SkillData或虚构技能', () => {
    // 旧的无回调定义不需要显式写入零回收延迟。
    const launch = lifetimeFixture.launch;
    const data: ProjectileRuntimeSource = {
      ...lifetimeFixture.runtime,
      moveModeTypes: new Map(lifetimeFixture.runtime.moveModeTypes),
    };
    const compile = createZeroDistanceProjectileProjectionExtensionSource({
      catalog: {
        runtimes: new Map([[data.projectileId, data]]),
        templates: new Map(),
        callbackGraphs: new Map(),
      },
      callbackContext: returnProjectionContext,
    });
    expect(compile(launch, 'liino.current', returnProjectionContext)).toEqual([
      { kind: 'launchProjectileLifetime', parameters: { finish: 'firstTickReach' } },
    ]);
    expect(() =>
      compile({ ...launch, syncTimeScale: true }, 'liino.sync', returnProjectionContext),
    ).toThrow('launch/reset lifetime is not projected');
  });
  it('无启用回调仍须保留发射寿命，不能以空动作成功转换', () => {
    const launch = parse();
    expect(() =>
      extension(
        {
          ...launch,
          callbacks: launch.callbacks.map(callback => ({ ...callback, enabled: false })),
        },
        'no-callback-launch',
        returnProjectionContext,
      ),
    ).toThrow('no enabled callbacks, but launch/reset lifetime is not projected');
  });

  it('duration finish 在发射处初始化实体板，回调 direct 板留在延迟程序内', () => {
    const callbackId = 'fixture.finish';
    const activeSkills = {
      skillIds: [callbackId],
      initialNativeSkillTypeById: { [callbackId]: 'normalSkill' as const },
    };
    const launch = {
      ...parse(),
      syncTimeScale: false,
      callbacks: [
        { event: 'block' as const, enabled: true, skillId: callbackId },
        { event: 'finish' as const, enabled: true, skillId: callbackId },
      ],
    };
    const compile = createZeroDistanceProjectileProjectionExtensionSource({
      catalog: {
        runtimes: new Map([
          [
            runtime.projectileId,
            {
              ...runtime,
              blockLayerDef: { value: 1, name: 'WallAndGround' },
              finishDuration: 3,
              activeSkills,
              finishDistance: { ...runtime.finishDistance, value: 0, blackboardKey: null },
              finishOnReach: false,
              hitOnReach: false,
            },
          ],
        ]),
        templates: new Map([[template.projectileId, template]]),
        callbackGraphs: new Map([
          [
            callbackId,
            {
              ...graph(callbackId),
              durationFrame: 900,
              declaredBlackboard: [{ key: 'value', value: 2, isDynamic: true }],
              actionGroup: {
                passiveEvents: [],
                timelineActions: [
                  [0, 1],
                  [2, 5],
                ].map(([startFrame, endFrame]) => ({
                  startFrame: startFrame!,
                  endFrame: endFrame!,
                  forceSyncAnimation: {
                    forceSync: false,
                    montageName: '',
                    targetFrame: 0,
                    playbackSpeed: 1,
                  },
                  sequence: {
                    onlyExecuteWhenSourceIsMainCharacter: false,
                    onlyExecuteWhenSourceIsGuard: false,
                    actions: [],
                  },
                })),
              },
            },
          ],
        ]),
        callbackCastResources: new Map([
          [
            callbackId,
            {
              costFrame: 0,
              cooldownSeconds: 0,
              maxChargeTime: 1,
              cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
            },
          ],
        ]),
      },
      callbackContext: returnProjectionContext,
    });
    expect(compile(launch, 'fixture.launch', returnProjectionContext)).toMatchObject([
      {
        kind: 'withActionBlackboardScope',
        parameters: { scopeKey: `fixture.launch:${launch.projectileId}`, lifetime: 'execution' },
        body: {
          steps: [
            {
              kind: 'scheduleProjectileFinishCallback',
              parameters: { delaySeconds: 3, recycleDelaySeconds: 30 },
              callback: {
                skillId: callbackId,
                nativeSkillType: 'normalSkill',
                naturalDurationFrames: 900,
                castResource: {
                  costFrame: 0,
                  cooldownSeconds: 0,
                  maxChargeTime: 1,
                  cost: { resource: 'ultimateEnergy', value: 0, availabilityThreshold: 0 },
                },
                blackboard: { value: 2 },
                scheduledSequences: [
                  { startFrame: 0, endFrame: 1, sequence: { steps: [] } },
                  { startFrame: 2, endFrame: 5, sequence: { steps: [] } },
                ],
              },
            },
          ],
        },
      },
    ]);
    Reflect.deleteProperty(activeSkills.initialNativeSkillTypeById, callbackId);
    expect(() => compile(launch, 'fixture.launch', returnProjectionContext)).toThrow(
      'requires its owning AbilitySystem skill registration',
    );
  });

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

  it.each([
    ['None', 0],
    ['OnlyHit', 1],
    ['NeverHit', 2],
  ] as const)('归一化命名/数值枚举 %s 和额外发射开关', (mode, nativeValue) => {
    expect(
      parse({ ...controls, targetFilterMode: mode, alsoLaunchToHittableTarget: true }),
    ).toMatchObject({ targetFilterMode: mode, alsoLaunchToHittableTarget: true });
    expect(
      parse({ ...controls, targetFilterMode: nativeValue, alsoLaunchToHittableTarget: true }),
    ).toMatchObject({ targetFilterMode: mode, alsoLaunchToHittableTarget: true });
  });

  it.each([3, -1, '0', 'Unknown', null])('不接受未知枚举值或字符串强转 %s', mode => {
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

  it('没有启用回调也不能绕过发射寿命门禁并丢弃过滤条件', () => {
    const launch = parse({
      ...controls,
      targetFilterMode: 'OnlyHit',
      alsoLaunchToHittableTarget: true,
      castSkillOnHit: false,
      castSkillOnReach: false,
    });
    expect(() => extension(launch, 'fixture.launch', returnProjectionContext)).toThrow(
      'targetFilterMode',
    );
  });
});
