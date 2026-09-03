import { describe, expect, it } from 'vitest';
import fixtures from './fixtures/avywenna-return-damage.json';
import scopeFixtures from './fixtures/avywenna-return-blackboard.json';
import runtimeFixtures from './fixtures/avywenna-return-projectile-runtime.json';
import { parseDamageActionSource } from '../src/source/damageActions.ts';
import { compileEventTargetSimpleDamageOperationSource } from '../src/compiler/simpleDamageOperation.ts';
import { compileCombatActionSequenceSource } from '../src/compiler/buffRuntimeProjection.ts';
import {
  compileImmediateProjectileCallbackSkillSource,
  compileZeroDistanceFirstTickBlockProjectileSource,
  compileZeroDistanceFirstTickHitProjectileSource,
  compileZeroDistanceFirstTickReachProjectileSource,
  createZeroDistanceProjectileProjectionExtensionSource,
} from '../src/compiler/projectileRuntimeProjection.ts';
import { parseProjectileLaunchActionSource } from '../src/source/referenceActions.ts';
import { parseProjectileRuntimeSource } from '../src/source/projectileRuntime.ts';
import { gameplayTagIdFromPath } from '../src/source/nativeGameplayTags.ts';
import {
  makeReturnProjection,
  parseReturnSequence,
  returnProjectionContext,
} from './support/avywennaReturnProjection.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

function rawDamage(index = 0) {
  return structuredClone(fixtures[index]!.branch.failActions.actionData[0]!);
}
function damageSource(index = 0) {
  return parseDamageActionSource(rawDamage(index), 'return.damage', {});
}

describe('公共回调伤害投影', () => {
  it('HP 单元中序列化但未启用的失衡计算不产生额外失衡伤害', () => {
    const source = damageSource();
    const withInactivePoiseCalculation = {
      ...source,
      units: [
        {
          ...source.units[0]!,
          serializedPoiseCalculationPresent: true,
          poiseCalculation: null,
        },
        ...source.units.slice(1),
      ],
    };

    expect(
      compileEventTargetSimpleDamageOperationSource(
        withInactivePoiseCalculation,
        'gilberta.damage',
      ),
    ).toEqual(compileEventTargetSimpleDamageOperationSource(source, 'baseline'));
  });

  it('敌方木桩不会进入仅针对玩家 Guard 的伤害倍率分支', () => {
    const source = damageSource();
    const guarded = {
      ...source,
      units: [
        {
          ...source.units[0]!,
          reduceDamageForGuard: true,
          reduceDamageForGuardRatio: 0,
        },
        ...source.units.slice(1),
      ],
    };

    expect(compileEventTargetSimpleDamageOperationSource(guarded, 'guard-only')).toEqual(
      compileEventTargetSimpleDamageOperationSource(source, 'baseline'),
    );
  });

  it.each([
    ['Atk', 'Atk'],
    ['CriticalRate', 'criticalRate'],
    ['CriticalDamageIncrease', 'criticalDamageIncrease'],
  ] as const)('即时属性 %s 使用与 Buff 相同的运行时身份', (attributeType, attribute) => {
    const source = damageSource();
    const compiled = compileEventTargetSimpleDamageOperationSource(
      {
        ...source,
        units: [
          {
            ...source.units[0]!,
            processors: [
              {
                kind: 'instantAttributeModifier',
                targetSide: 'Attacker',
                modifyAttributeType: 'Specific',
                attributeType,
                formulaItem: 'BaseMultiplier',
                parameter: { value: 0, blackboardKey: 'bonus', levelValues: null },
              },
            ],
          },
        ],
      },
      'damage',
    );
    expect(compiled.parameters.instantAttributeModifiers).toEqual([
      {
        targetSide: 'attacker',
        attribute,
        slot: 'baseMultiplier',
        value: { kind: 'blackboard', key: 'bonus' },
        attributeTiming: 'runtime',
      },
    ]);
  });

  it('别礼终结技的防御方晶脆弱即时修正只进入当前伤害包', () => {
    const source = damageSource();
    const compiled = compileEventTargetSimpleDamageOperationSource(
      {
        ...source,
        units: [
          {
            ...source.units[0]!,
            processors: [
              {
                kind: 'instantAttributeModifier',
                targetSide: 'Defender',
                modifyAttributeType: 'Specific',
                attributeType: 'CrystVulnerableDmgIncrease',
                formulaItem: 'BaseFinalMultiplier',
                parameter: { value: 0, blackboardKey: 'rate', levelValues: null },
              },
            ],
          },
        ],
      },
      'lastrite.ultimate',
    );

    expect(compiled.parameters.instantAttributeModifiers).toEqual([
      {
        targetSide: 'defender',
        attribute: 'cryoVulnerabilityIncrease',
        slot: 'baseFinalMultiplier',
        value: { kind: 'blackboard', key: 'rate' },
        attributeTiming: 'runtime',
      },
    ]);
  });

  it('单次 DamageScaleProcessor 保留来源侧、命名区间和动作黑板值', () => {
    const source = damageSource();
    expect(
      compileEventTargetSimpleDamageOperationSource(
        {
          ...source,
          units: [
            {
              ...source.units[0]!,
              processors: [
                {
                  kind: 'damageScale',
                  side: 'Attacker',
                  zoneName: 'NormalCalcZone',
                  addition: { value: 0, blackboardKey: 'dmg_up', levelValues: null },
                },
              ],
            },
          ],
        },
        'damage',
      ),
    ).toMatchObject({
      parameters: {
        instantDamageScaleModifiers: [
          {
            side: 'attacker',
            zone: 'normal',
            addition: { kind: 'blackboard', key: 'dmg_up' },
          },
        ],
      },
    });
  });

  it.each(['Target', 'Context'])(
    '%s 不执行残留选择器，但 Context 必须绑定已证明的敌人组',
    targetSource => {
      const raw = rawDamage();
      const redundantSelector = {
        finderData: {
          $type: 'Beyond.Gameplay.Core.Selector+MainTargetFinder+Data, Gameplay.Beyond',
        },
        validatorData: [
          { $type: 'Beyond.Gameplay.Core.Selector+ExcludeOwnerValidator+Data, Gameplay.Beyond' },
        ],
        postProcessorData: [],
      };
      const action = parseDamageActionSource(
        {
          ...raw,
          targetSettings: {
            ...raw.targetSettings,
            targetSource,
            targetGroupKey: 'tar',
            selectorData: redundantSelector,
          },
          effectSource: { ...raw.effectSource, selectorData: redundantSelector },
        },
        'damage',
        {},
      );
      const context = {
        actionOwnerTarget: 'caster',
        actionSourceTarget: 'caster',
        staticEnemyTargetGroupKeys: new Set(['tar']),
      } as const;
      expect(compileEventTargetSimpleDamageOperationSource(action, 'damage', context)).toEqual(
        compileEventTargetSimpleDamageOperationSource(damageSource(), 'baseline'),
      );
      if (targetSource === 'Context') {
        expect(() => compileEventTargetSimpleDamageOperationSource(action, 'damage')).toThrow(
          'unsupported simple event damage target',
        );
        expect(() =>
          compileEventTargetSimpleDamageOperationSource(
            {
              ...action,
              target: { ...action.target, targetGroupKey: '' },
            },
            'damage',
            { ...context, staticEnemyTargetGroupKeys: new Set(['']) },
          ),
        ).toThrow('unsupported simple event damage target');
      }
    },
  );

  it('InstantSearch 不能借用同名已保存目标组绕过搜索投影', () => {
    const source = damageSource();
    expect(() =>
      compileEventTargetSimpleDamageOperationSource(
        {
          ...source,
          target: { ...source.target, targetSource: 'InstantSearch', targetGroupKey: 'tar' },
        },
        'damage',
        {
          actionOwnerTarget: 'caster',
          actionSourceTarget: 'caster',
          staticEnemyTargetGroupKeys: new Set(['tar']),
        },
      ),
    ).toThrow('unsupported simple event damage target');
  });

  it('能力实体子技能可由已证明的角色 ActionSource 归属伤害', () => {
    const source = damageSource();
    expect(
      compileEventTargetSimpleDamageOperationSource(source, 'damage', {
        actionOwnerTarget: 'unavailable',
        actionSourceTarget: 'caster',
      }),
    ).toEqual(compileEventTargetSimpleDamageOperationSource(source, 'baseline'));
    expect(() =>
      compileEventTargetSimpleDamageOperationSource(
        { ...source, attacker: 'ActionOwner' },
        'damage',
        { actionOwnerTarget: 'unavailable', actionSourceTarget: 'caster' },
      ),
    ).toThrow('Owner projection is unavailable');
  });

  it('敌人持有的周期 Buff 可直接伤害自身 Owner', () => {
    const source = damageSource();
    const ownerTarget = {
      ...source,
      target: { ...source.target, targetSource: 'Owner', targetGroupKey: '' },
    };
    expect(
      compileEventTargetSimpleDamageOperationSource(ownerTarget, 'damage', {
        actionOwnerTarget: 'buffOwner',
        actionSourceTarget: 'caster',
        fixedBuffOwnerTarget: 'enemy',
      }),
    ).toEqual(compileEventTargetSimpleDamageOperationSource(source, 'baseline'));
    expect(() =>
      compileEventTargetSimpleDamageOperationSource(ownerTarget, 'damage', {
        actionOwnerTarget: 'buffOwner',
        actionSourceTarget: 'caster',
        fixedBuffOwnerTarget: 'caster',
      }),
    ).toThrow('unsupported simple event damage target');
  });

  it('非搜索路径仍通过来源解析器拒绝未知残留选择器', () => {
    const raw = rawDamage();
    expect(() =>
      parseDamageActionSource(
        {
          ...raw,
          targetSettings: {
            ...raw.targetSettings,
            targetSource: 'Context',
            targetGroupKey: 'tar',
            selectorData: {
              finderData: {
                $type: 'Beyond.Gameplay.Core.Selector+UnknownFinder+Data, Gameplay.Beyond',
              },
              validatorData: [],
              postProcessorData: [],
            },
          },
        },
        'damage',
        {},
      ),
    ).toThrow('unsupported finder');
  });

  it('完整回调动作图保留区间时间膨胀，延迟项仅允许静态动作', () => {
    const launch = parseProjectileLaunchActionSource(scopeFixtures[0]!.launch, 'launch');
    const controlled = {
      ...launch.projectileSource,
      targetSource: 'InstantSearch',
      finderType: 'CharacterTeamFinder',
      validatorTypes: ['MainCharacterValidator'],
    };
    const graph = {
      skillId: 'callback',
      level: 1,
      durationFrame: 15,
      declaredBlackboard: [],
      actionGroup: {
        passiveEvents: [],
        timelineActions: [
          {
            startFrame: 0,
            endFrame: 15,
            forceSyncAnimation: {
              forceSync: false,
              montageName: '',
              targetFrame: 0,
              playbackSpeed: 1,
            },
            sequence: {
              onlyExecuteWhenSourceIsMainCharacter: false,
              onlyExecuteWhenSourceIsGuard: false,
              actions: [
                {
                  sourcePath: 'callback.timeDilation',
                  metadata: {
                    nativeType: 'TimeDilationAction',
                    nativeName: 'TimeDilationAction',
                    enabled: true,
                    priorityLevel: 'Default',
                    priorityOffset: 0,
                    serverActionIndex: 0,
                  },
                  body: {
                    kind: 'leaf' as const,
                    value: {
                      family: 'timeDilation' as const,
                      action: {
                        kind: 'timeDilation' as const,
                        layer: 'Global' as const,
                        slotTagId: 1464849466,
                        priorityTagId: 451969779,
                        duration: { value: 0.2, blackboardKey: null, levelValues: null },
                        useCurveKey: false,
                        curveKey: '',
                        inlineCurveKeys: [
                          {
                            time: 0,
                            value: 0.2,
                            inTangent: 0,
                            outTangent: 0,
                            weightedMode: 0,
                            inWeight: 0,
                            outWeight: 0,
                          },
                        ],
                        finishByAction: false,
                        ignoreTargets: [controlled],
                        effectTargets: [launch.projectileSource],
                        useTimeScaleForSkillCooldownTick: false,
                        influenceSkillCooldownTime: {
                          value: 0,
                          blackboardKey: null,
                          levelValues: null,
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    };
    expect(
      compileImmediateProjectileCallbackSkillSource({
        graph,
        context: returnProjectionContext,
        extensions: { resolveTimeDilationPriority: () => 10 },
      }).sequence.steps[0],
    ).toMatchObject({
      kind: 'startTimeDilation',
      parameters: { scope: 'global', priority: 10, ignoredTargets: ['controlled'] },
    });
    const key =
      graph.actionGroup.timelineActions[0]!.sequence.actions[0]!.body.value.action
        .inlineCurveKeys[0]!;
    for (const mode of [0, 1, 2, 3]) {
      key.weightedMode = mode;
      const step = compileImmediateProjectileCallbackSkillSource({
        graph,
        context: returnProjectionContext,
        extensions: { resolveTimeDilationPriority: () => 10 },
      }).sequence.steps[0]!;
      expect(step).toMatchObject({
        parameters: { curve: { kind: 'inline', keys: [{ ...key }] } },
      });
    }
    for (const mode of [-1, 4, 0.5, NaN]) {
      key.weightedMode = mode;
      expect(() =>
        compileImmediateProjectileCallbackSkillSource({
          graph,
          context: returnProjectionContext,
          extensions: { resolveTimeDilationPriority: () => 10 },
        }),
      ).toThrow('callback.timeDilation.timeScaleCurve[0].weightedMode: unsupported value');
      expect(key.weightedMode).toBe(mode);
    }
    key.weightedMode = 0;
    graph.actionGroup.timelineActions[0]!.startFrame = 1;
    const delayed = compileImmediateProjectileCallbackSkillSource({
      graph,
      context: returnProjectionContext,
      extensions: { resolveTimeDilationPriority: () => 10 },
    });
    expect(delayed.sequence.steps).toEqual([]);
    expect(delayed.delayedSequences).toMatchObject([
      {
        startFrame: 1,
        endFrame: 15,
        sequence: { steps: [{ kind: 'startTimeDilation' }] },
      },
    ]);
    const duration =
      graph.actionGroup.timelineActions[0]!.sequence.actions[0]!.body.value.action.duration;
    (duration as { blackboardKey: string | null }).blackboardKey = 'dynamic_duration';
    expect(() =>
      compileImmediateProjectileCallbackSkillSource({
        graph,
        context: returnProjectionContext,
        extensions: { resolveTimeDilationPriority: () => 10 },
      }),
    ).toThrow('delayed projectile callback reads action blackboard');
  });

  it('公共序列入口只在宿主提供投射物投影扩展时消费 LaunchProjectile', () => {
    const sequence = parseReturnSequence(
      {
        actionData: [scopeFixtures[0]!.launch],
        onlyExecuteWhenSourceIsMainChar: false,
        onlyExecuteWhenSourceIsGuard: false,
      },
      'battle.returnLaunch',
    );
    expect(() => compileCombatActionSequenceSource(sequence, returnProjectionContext)).toThrow(
      'projectile launch projection is unavailable',
    );
    const projected = compileCombatActionSequenceSource(
      sequence,
      returnProjectionContext,
      new Set(),
      {
        compileProjectileLaunch: (_launch, sourcePath) => {
          expect(sourcePath).toContain('battle.returnLaunch');
          return [makeReturnProjection(0)];
        },
      },
    );
    expect(projected.steps[0]).toMatchObject({
      kind: 'withActionBlackboardScope',
      parameters: { entityInitialValues: { EntityBB_talent0: 0 } },
    });
  });

  it('不把 hitOnReach 或非首帧形状冒充艾维文娜的命中后到达链', () => {
    const runtime = structuredClone(runtimeFixtures[0]!);
    runtime.hitOnReach = true;
    expect(() => makeReturnProjection(0, true, runtime)).toThrow(
      'outside the proven zero-distance first-tick shape',
    );
  });

  it('按 1.4.4 数值映射恢复缺少 name 的 ProjectileBlockLayerDef', () => {
    const raw = structuredClone(runtimeFixtures[0]!);
    expect(
      parseProjectileRuntimeSource(
        { ...raw, blockLayerDef: { value: -1, hex: '0xffffffff' } },
        'projectile',
      ).blockLayerDef,
    ).toEqual({
      value: -1,
      name: 'Custom',
    });
    expect(
      parseProjectileRuntimeSource(
        { ...raw, blockLayerDef: { value: 1, name: 'Nothing' } },
        'projectile',
      ).blockLayerDef,
    ).toEqual({ value: 1, name: 'WallAndGround' });
  });

  it('useBlackboardKey=false 时忽略导出数据残留的 blackboardKey', () => {
    const raw = structuredClone(runtimeFixtures[0]!);
    raw.finishDuration = {
      useBlackboardKey: false,
      value: 2,
      blackboardKey: 'EntityBB_lifetime',
    };

    expect(parseProjectileRuntimeSource(raw, 'projectile').finishDuration).toBe(2);
  });

  it('保留动态 finishDistance 的投射物实体黑板来源', () => {
    const raw = structuredClone(runtimeFixtures[0]!);
    raw.finishDistance = {
      useBlackboardKey: true,
      value: 11,
      blackboardKey: 'EntityBB_max_dist',
    };

    expect(parseProjectileRuntimeSource(raw, 'projectile').finishDistance).toEqual({
      value: 11,
      blackboardKey: 'EntityBB_max_dist',
      levelValues: null,
    });
  });

  it('固定空间点目标的 reach-only 投射物在零空间首帧执行回调', () => {
    const raw = structuredClone(scopeFixtures[0]!);
    const launchInput: Record<string, unknown> = structuredClone(raw.launch);
    launchInput.castSkillOnHit = false;
    launchInput.projectileSkillId = '';
    launchInput.castSkillOnReach = true;
    launchInput.skillIdOnReach = 'reach_fixture';
    launchInput.targetSettings = {
      ...(launchInput.targetSettings as Record<string, unknown>),
      targetSource: 'Source',
      targetGroupKey: '',
      selectorData: {
        finderData: {
          $type: 'Beyond.Gameplay.Core.Selector+FixedPointFinder+Data, Gameplay.Beyond',
          positionOffset: { x: 0, y: 0, z: 0 },
          rotationOffset: { x: 0, y: 0, z: 0, w: 1 },
          snapToNavmesh: false,
          sampleRadius: { useBlackboardKey: false, value: 0, blackboardKey: '' },
        },
        validatorData: [],
        postProcessorData: [],
      },
    };
    const runtime: Record<string, unknown> = structuredClone(runtimeFixtures[0]!);
    runtime.blockLayerDef = { value: 1, name: 'WallAndGround' };
    // Reach 先施放 reachSkill；finishOnReach 只决定之后是否结束投射物。
    runtime.finishOnReach = false;
    runtime.hitOnReach = false;
    const launch = parseProjectileLaunchActionSource(launchInput, 'reach.launch');
    const projected = compileZeroDistanceFirstTickReachProjectileSource({
      sourcePath: 'reach.launch',
      launch,
      runtime: parseProjectileRuntimeSource(runtime, 'reach.projectile'),
      template: null,
      reachGraph: {
        skillId: 'reach_fixture',
        level: 1,
        durationFrame: 0,
        declaredBlackboard: [],
        actionGroup: { timelineActions: [], passiveEvents: [] },
      },
      callbackContext: returnProjectionContext,
      projectionContext: returnProjectionContext,
    });

    expect(projected.body.steps).toMatchObject([
      {
        kind: 'withActionBlackboardScope',
        parameters: { scopeKey: 'reach.launch:reach_fixture' },
      },
    ]);

    const contextLaunchInput = structuredClone(launchInput);
    contextLaunchInput.targetSettings = {
      ...(contextLaunchInput.targetSettings as Record<string, unknown>),
      targetSource: 'Context',
      targetGroupKey: 'bullet_target',
    };
    expect(() =>
      compileZeroDistanceFirstTickReachProjectileSource({
        sourcePath: 'reach.context.launch',
        launch: parseProjectileLaunchActionSource(contextLaunchInput, 'reach.context.launch'),
        runtime: parseProjectileRuntimeSource(runtime, 'reach.context.projectile'),
        template: null,
        reachGraph: {
          skillId: 'reach_fixture',
          level: 1,
          durationFrame: 0,
          declaredBlackboard: [],
          actionGroup: { timelineActions: [], passiveEvents: [] },
        },
        callbackContext: returnProjectionContext,
        projectionContext: {
          ...returnProjectionContext,
          staticZeroSpaceTargetGroupKeys: new Set(['bullet_target']),
        },
      }),
    ).not.toThrow();
  });

  it('把锚定施法者的 InstantSearch 固定点归约为零空间 reach，不丢固定偏移证据', () => {
    const raw = structuredClone(scopeFixtures[0]!);
    const launchInput: Record<string, unknown> = structuredClone(raw.launch);
    launchInput.castSkillOnHit = false;
    launchInput.projectileSkillId = '';
    launchInput.castSkillOnReach = true;
    launchInput.skillIdOnReach = 'reach_fixture';
    launchInput.targetSettings = {
      ...(launchInput.targetSettings as Record<string, unknown>),
      targetSource: 'InstantSearch',
      selectorOwner: 'ActionSource',
      centerType: 'ActionSource',
      target: 'ActionSource',
      targetGroupKey: '',
      selectorData: {
        finderData: {
          $type: 'Beyond.Gameplay.Core.Selector+FixedPointFinder+Data, Gameplay.Beyond',
          positionOffset: { x: 3, y: 7, z: 1.5 },
          rotationOffset: { x: 0, y: 0, z: 0, w: 1 },
          snapToNavmesh: false,
          sampleRadius: { useBlackboardKey: false, value: 0, blackboardKey: '' },
        },
        validatorData: [],
        postProcessorData: [],
      },
    };
    const runtime: Record<string, unknown> = structuredClone(runtimeFixtures[0]!);
    runtime.blockLayerDef = { value: 0, name: 'Custom' };
    runtime.hitOnReach = false;
    // 非 segment 模式的原生数据可以不序列化 segmentMoveData；Default MoveMode
    // 仍按 LaunchPoint -> TargetPoint 运行。在零空间无需借此推断实际飞行时间。
    runtime.moveSegments = [];
    const launch = parseProjectileLaunchActionSource(launchInput, 'reach.instant.launch');
    expect(launch.target.finderFixedPoint?.positionOffset).toEqual([3, 7, 1.5]);
    expect(
      compileZeroDistanceFirstTickReachProjectileSource({
        sourcePath: 'reach.instant.launch',
        launch,
        runtime: parseProjectileRuntimeSource(runtime, 'reach.instant.projectile'),
        template: null,
        reachGraph: {
          skillId: 'reach_fixture',
          level: 1,
          durationFrame: 0,
          declaredBlackboard: [],
          actionGroup: { timelineActions: [], passiveEvents: [] },
        },
        callbackContext: returnProjectionContext,
        projectionContext: returnProjectionContext,
      }).body.steps,
    ).toHaveLength(1);
  });

  it('唯一木桩下允许 allowHitSameTarget=false 且 maxHitCount=-1 的 hit-only 投射物', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(raw.launch, 'launch');
    const runtime = parseProjectileRuntimeSource(runtimeFixtures[0], 'projectile');
    const compile = (allowHitSameTarget: boolean) =>
      compileZeroDistanceFirstTickHitProjectileSource({
        sourcePath: 'hit-only',
        launch,
        runtime: {
          ...runtime,
          maxHitCount: -1,
          allowHitSameTarget,
          colliderShape: { shapeType: 1, radius: 0.45, extent: [0, 0, 0] },
          // 测试的是汤汤式“到达即结束” hit-only 形状，不沿用
          // 艾维文娜回收枪的 keepMoveOnReach=true。
          keepMoveOnReach: false,
        },
        template: null,
        hitGraph: {
          skillId: raw.hit.skillId,
          level: 1,
          durationFrame: 0,
          declaredBlackboard: [],
          actionGroup: { timelineActions: [], passiveEvents: [] },
        },
        callbackContext: returnProjectionContext,
      });

    expect(compile(false).body.steps).toHaveLength(1);
    expect(() => compile(true)).toThrow('outside the proven zero-distance first-tick shape');
  });

  it('零距离模型仅折叠从中心开始的整圆环形 hit-only 投射物', () => {
    const scalar = (value: number) => ({
      useBlackboardKey: false,
      value,
      blackboardKey: '',
      valueFloatCandidate: value,
    });
    const vector = (x: number, y: number, z: number) => ({
      x: scalar(x),
      y: scalar(y),
      z: scalar(z),
      valueCandidate: { x, y, z },
    });
    const rawRuntime: Record<string, unknown> = structuredClone(runtimeFixtures[0]!);
    rawRuntime.finishOnReach = false;
    rawRuntime.colliderShapeData = {
      $decoded: true,
      layout: 'Beyond.Gameplay.Core.ProjectileComponentData/ShapeData',
      shapeType: { value: 3, name: 'Ring' },
      radius: scalar(0.3),
      center: vector(0, 0, 0),
      extent: vector(0, 0, 0),
      initOuterRadius: scalar(2),
      initInnerRadius: scalar(0),
      outerRadiusIncreaseSpeed: scalar(10),
      innerRadiusIncreaseSpeed: scalar(10),
      height: scalar(3),
      isSector: true,
      sectorDirection: { value: 2, name: 'SelfToTarget' },
      sectorAngle: scalar(360),
    };
    const runtime = parseProjectileRuntimeSource(rawRuntime, 'ring.projectile');
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(raw.launch, 'ring.launch');
    const compile = (candidate: typeof runtime) =>
      compileZeroDistanceFirstTickHitProjectileSource({
        sourcePath: 'ring-hit-only',
        launch,
        runtime: candidate,
        template: null,
        hitGraph: {
          skillId: raw.hit.skillId,
          level: 1,
          durationFrame: 0,
          declaredBlackboard: [],
          actionGroup: { timelineActions: [], passiveEvents: [] },
        },
        callbackContext: returnProjectionContext,
      });

    expect(runtime.colliderShape?.ring).toEqual({
      initialOuterRadius: 2,
      initialInnerRadius: 0,
      outerRadiusIncreaseSpeed: 10,
      innerRadiusIncreaseSpeed: 10,
      height: 3,
      isSector: true,
      sectorDirection: 2,
      sectorAngle: 360,
    });
    expect(compile(runtime).body.steps).toHaveLength(1);
    expect(() =>
      compile({
        ...runtime,
        colliderShape: {
          ...runtime.colliderShape!,
          ring: { ...runtime.colliderShape!.ring!, initialInnerRadius: 0.5 },
        },
      }),
    ).toThrow('outside the proven zero-distance first-tick shape');
    expect(() =>
      compile({
        ...runtime,
        colliderShape: {
          ...runtime.colliderShape!,
          ring: { ...runtime.colliderShape!.ring!, sectorAngle: 90 },
        },
      }),
    ).toThrow('outside the proven zero-distance first-tick shape');
  });

  it('Good Character 的首帧声波逐个治疗队伍成员而不落到敌方目标', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(
      {
        ...raw.launch,
        castSkillOnReach: false,
        skillIdOnReach: '',
      },
      'friendly-wave.launch',
    );
    const parsedRuntime = parseProjectileRuntimeSource(
      runtimeFixtures[0],
      'friendly-wave.projectile',
    );
    const healSequence = parseReturnSequence(
      {
        actionData: [
          {
            $type: 'Beyond.Gameplay.Core.HealAction+Data, Gameplay.Beyond',
            isEnable: true,
            priorityLevel: 'Default',
            priorityOffset: 0,
            serverActionIndex: 0,
            alwaysNext: true,
            healType: 'Normal',
            healer: 'ActionSource',
            contextKey: '',
            target: targetFixture('Target'),
            showHealText: true,
            playHealEffect: false,
            effectData: { effectName: '' },
            onlyPlayEffectOnActualHeal: false,
            useHealTags: false,
            healTags: { predefinedTag: [] },
            healCalculation: {
              $type: 'Beyond.Gameplay.Core.DefiniteValueCalculation, Gameplay.Beyond',
              value: scalarFixture(100),
              applyScale: false,
              valueScale: scalarFixture(1),
            },
          },
        ],
        onlyExecuteWhenSourceIsMainChar: false,
        onlyExecuteWhenSourceIsGuard: false,
      },
      'friendly-wave.heal',
    );
    const hitGraph = {
      skillId: raw.hit.skillId,
      level: 1,
      durationFrame: 0,
      declaredBlackboard: [],
      actionGroup: {
        timelineActions: [
          {
            startFrame: 0,
            endFrame: 0,
            sequence: healSequence,
            forceSyncAnimation: {
              forceSync: false,
              montageName: '',
              targetFrame: 0,
              playbackSpeed: 1,
            },
          },
        ],
        passiveEvents: [],
      },
    } as const;
    const compile = createZeroDistanceProjectileProjectionExtensionSource({
      catalog: {
        runtimes: new Map([
          [
            launch.projectileId,
            {
              ...parsedRuntime,
              finishOnReach: false,
              targetFilter: {
                ...parsedRuntime.targetFilter,
                autoSetTargetFaction: false,
                targetFactionType: 4,
                filterObjectType: true,
                objectType: 8,
              },
              colliderShape: {
                shapeType: 3,
                radius: 0.3,
                extent: [0, 0, 0],
                ring: {
                  initialOuterRadius: 2,
                  initialInnerRadius: 0,
                  outerRadiusIncreaseSpeed: 10,
                  innerRadiusIncreaseSpeed: 10,
                  height: 3,
                  isSector: true,
                  sectorDirection: 2,
                  sectorAngle: 360,
                },
              },
            },
          ],
        ]),
        templates: new Map(),
        callbackGraphs: new Map([[hitGraph.skillId, hitGraph]]),
      },
      callbackContext: returnProjectionContext,
    });

    expect(compile(launch, 'friendly-wave', returnProjectionContext)).toMatchObject([
      {
        kind: 'findCharacterTeamTargets',
        parameters: { selection: { kind: 'allOperators' } },
      },
      {
        kind: 'forEachContextTarget',
        body: {
          steps: [
            {
              kind: 'withActionBlackboardScope',
              body: {
                steps: [
                  {
                    kind: 'withActionBlackboardScope',
                    body: { steps: [{ kind: 'heal', parameters: { target: 'currentTarget' } }] },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);
  });

  it('唯一木桩下 Box 碰撞体和正数命中上限仍只触发一次 hit-only 回调', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(raw.launch, 'launch');
    const runtime = parseProjectileRuntimeSource(runtimeFixtures[0], 'projectile');
    const compile = (extent: readonly [number, number, number]) =>
      compileZeroDistanceFirstTickHitProjectileSource({
        sourcePath: 'box-hit-only',
        launch,
        runtime: {
          ...runtime,
          maxHitCount: 99,
          allowHitSameTarget: false,
          colliderShape: { shapeType: 2, radius: 0.2, extent },
          keepMoveOnReach: false,
        },
        template: null,
        hitGraph: {
          skillId: raw.hit.skillId,
          level: 1,
          durationFrame: 0,
          declaredBlackboard: [],
          actionGroup: { timelineActions: [], passiveEvents: [] },
        },
        callbackContext: returnProjectionContext,
      });

    expect(compile([1.6, 2.1, 3]).body.steps).toHaveLength(1);
    expect(() => compile([1.6, 0, 3])).toThrow('outside the proven zero-distance first-tick shape');
  });

  it('首 tick block 先于 reach，因此 finishOnReach 不会吞掉梨诺式墙地回调', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(
      {
        ...raw.launch,
        castSkillOnHit: false,
        projectileSkillId: '',
        castSkillOnBlock: true,
        skillIdOnBlock: 'block_fixture',
        castSkillOnReach: false,
        skillIdOnReach: '',
      },
      'block.launch',
    );
    const parsed = parseProjectileRuntimeSource(runtimeFixtures[0], 'block.projectile');
    const projected = compileZeroDistanceFirstTickBlockProjectileSource({
      sourcePath: 'block.launch',
      launch,
      runtime: {
        ...parsed,
        finishOnReach: true,
        blockLayerDef: { value: 1, name: 'WallAndGround' },
        colliderShape: { shapeType: 1, radius: 0.3, extent: [0, 0, 0] },
        useSegmentMove: false,
        moveSegments: [
          {
            startPointKey: 'LaunchPoint',
            moveModeId: 'Default',
            endPointKey: 'TargetPoint',
            earlyNextByDuration: false,
            segmentDuration: 0,
            skipHitAndBlockDetection: false,
          },
        ],
      },
      template: null,
      blockGraph: {
        skillId: 'block_fixture',
        level: 1,
        durationFrame: 0,
        declaredBlackboard: [],
        actionGroup: { timelineActions: [], passiveEvents: [] },
      },
      callbackContext: returnProjectionContext,
    });

    expect(projected.body.steps).toHaveLength(1);
  });

  it('block layer 为 Nothing 时忽略不可达的独立 block 技能，只执行 hit', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(
      {
        ...raw.launch,
        castSkillOnBlock: true,
        skillIdOnBlock: 'unreachable-block',
        castSkillOnReach: false,
        skillIdOnReach: '',
      },
      'launch',
    );
    const runtime = parseProjectileRuntimeSource(runtimeFixtures[0], 'projectile');
    const hitGraph = {
      skillId: raw.hit.skillId,
      level: 1,
      durationFrame: 0,
      declaredBlackboard: [],
      actionGroup: { timelineActions: [], passiveEvents: [] },
    } as const;
    const unreachableBlockGraph = {
      ...hitGraph,
      skillId: 'unreachable-block',
      // 若实现错误地尝试编译不可达 block，这个被动事件会让测试严格失败。
      actionGroup: { timelineActions: [], passiveEvents: [{}] },
    } as unknown as typeof hitGraph;
    const compile = createZeroDistanceProjectileProjectionExtensionSource({
      catalog: {
        runtimes: new Map([
          [
            launch.projectileId,
            {
              ...runtime,
              blockLayerDef: { value: 0, name: 'Nothing' },
              maxHitCount: 1,
              allowHitSameTarget: false,
              colliderShape: { shapeType: 1, radius: 0.45, extent: [0, 0, 0] },
              keepMoveOnReach: false,
            },
          ],
        ]),
        templates: new Map(),
        callbackGraphs: new Map([
          [hitGraph.skillId, hitGraph],
          [unreachableBlockGraph.skillId, unreachableBlockGraph],
        ]),
      },
      callbackContext: returnProjectionContext,
    });

    expect(compile(launch, 'nothing-block-layer', returnProjectionContext)).toHaveLength(1);
  });

  it('WallAndGround 的纯表现 block 回调不遮蔽首碰撞 hit 伤害', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(
      {
        ...raw.launch,
        castSkillOnBlock: true,
        skillIdOnBlock: 'presentation-block',
        castSkillOnReach: false,
        skillIdOnReach: '',
      },
      'launch',
    );
    const runtime = parseProjectileRuntimeSource(runtimeFixtures[0], 'projectile');
    const hitGraph = {
      skillId: raw.hit.skillId,
      level: 1,
      durationFrame: 0,
      declaredBlackboard: [],
      actionGroup: { timelineActions: [], passiveEvents: [] },
    } as const;
    const presentationBlockGraph = {
      ...hitGraph,
      skillId: 'presentation-block',
      actionGroup: {
        passiveEvents: [],
        timelineActions: [
          {
            startFrame: 0,
            endFrame: 1,
            sequence: {
              onlyExecuteWhenSourceIsMainCharacter: false,
              onlyExecuteWhenSourceIsGuard: false,
              actions: [
                {
                  metadata: { enabled: true },
                  body: { kind: 'leaf', value: { family: 'presentation', action: {} } },
                },
              ],
            },
          },
        ],
      },
    } as unknown as typeof hitGraph;
    const compile = createZeroDistanceProjectileProjectionExtensionSource({
      catalog: {
        runtimes: new Map([
          [
            launch.projectileId,
            {
              ...runtime,
              blockLayerDef: { value: 1, name: 'WallAndGround' },
              maxHitCount: 1,
              allowHitSameTarget: false,
              colliderShape: { shapeType: 1, radius: 0.45, extent: [0, 0, 0] },
              keepMoveOnReach: false,
            },
          ],
        ]),
        templates: new Map(),
        callbackGraphs: new Map([
          [hitGraph.skillId, hitGraph],
          [presentationBlockGraph.skillId, presentationBlockGraph],
        ]),
      },
      callbackContext: returnProjectionContext,
    });

    expect(compile(launch, 'presentation-block', returnProjectionContext)).toHaveLength(1);
  });

  it('投射物 GameplayTag 过滤保留为唯一敌人的运行时命中条件', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(
      {
        ...raw.launch,
        castSkillOnBlock: true,
        skillIdOnBlock: 'presentation-block',
        castSkillOnReach: false,
        skillIdOnReach: '',
      },
      'launch',
    );
    const runtimeInput: Record<string, unknown> = structuredClone(runtimeFixtures[0]!);
    const targetFilter = runtimeInput.targetFilter as Record<string, unknown>;
    targetFilter.filterGameplayTag = true;
    const filterTagId = gameplayTagIdFromPath('Test/Tag123');
    targetFilter.tagQuery = {
      queryType: { value: 2, name: 'ExceptAny' },
      tags: [{ tagId: { value: filterTagId, hex: 'fixture' } }],
    };
    const runtime = parseProjectileRuntimeSource(runtimeInput, 'projectile');
    expect(runtime.targetFilter.gameplayTagQuery).toEqual({
      queryType: 'exceptAny',
      tagIds: [filterTagId],
    });
    const hitGraph = {
      skillId: raw.hit.skillId,
      level: 1,
      durationFrame: 0,
      declaredBlackboard: [],
      actionGroup: { timelineActions: [], passiveEvents: [] },
    } as const;
    const presentationBlockGraph = {
      ...hitGraph,
      skillId: 'presentation-block',
      actionGroup: {
        passiveEvents: [],
        timelineActions: [
          {
            startFrame: 0,
            endFrame: 1,
            sequence: {
              onlyExecuteWhenSourceIsMainCharacter: false,
              onlyExecuteWhenSourceIsGuard: false,
              actions: [
                {
                  metadata: { enabled: true },
                  body: { kind: 'leaf', value: { family: 'presentation', action: {} } },
                },
              ],
            },
          },
        ],
      },
    } as unknown as typeof hitGraph;
    const compile = createZeroDistanceProjectileProjectionExtensionSource({
      catalog: {
        runtimes: new Map([
          [
            launch.projectileId,
            {
              ...runtime,
              blockLayerDef: { value: 1, name: 'WallAndGround' },
              maxHitCount: 1,
              allowHitSameTarget: false,
              colliderShape: { shapeType: 1, radius: 0.45, extent: [0, 0, 0] },
              keepMoveOnReach: false,
            },
          ],
        ]),
        templates: new Map(),
        callbackGraphs: new Map([
          [hitGraph.skillId, hitGraph],
          [presentationBlockGraph.skillId, presentationBlockGraph],
        ]),
      },
      callbackContext: returnProjectionContext,
    });

    expect(compile(launch, 'tag-filtered-projectile', returnProjectionContext)).toMatchObject([
      {
        kind: 'conditional',
        parameters: {
          condition: {
            kind: 'entityTagMatch',
            target: 'enemy',
            tagQueryType: 'exceptAny',
          },
        },
        whenTrue: { steps: [{ kind: 'withActionBlackboardScope' }] },
      },
    ]);
  });

  it('唯一回调为空时连同目录外标签过滤一起省略纯表现投射物', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(
      {
        ...raw.launch,
        castSkillOnBlock: false,
        skillIdOnBlock: '',
        castSkillOnReach: false,
        skillIdOnReach: '',
      },
      'launch',
    );
    const runtimeInput: Record<string, unknown> = structuredClone(runtimeFixtures[0]!);
    const targetFilter = runtimeInput.targetFilter as Record<string, unknown>;
    targetFilter.filterGameplayTag = true;
    targetFilter.tagQuery = {
      queryType: { value: 2, name: 'ExceptAny' },
      tags: [{ tagId: { value: -1920865197, hex: '0x8d81ec53' } }],
    };
    const runtime = parseProjectileRuntimeSource(runtimeInput, 'projectile');
    const hitGraph = {
      skillId: raw.hit.skillId,
      level: 1,
      durationFrame: 0,
      declaredBlackboard: [],
      actionGroup: { timelineActions: [], passiveEvents: [] },
    } as const;
    const compile = createZeroDistanceProjectileProjectionExtensionSource({
      catalog: {
        runtimes: new Map([
          [
            launch.projectileId,
            {
              ...runtime,
              blockLayerDef: { value: 1, name: 'WallAndGround' },
              maxHitCount: 1,
              allowHitSameTarget: false,
              colliderShape: { shapeType: 1, radius: 0.45, extent: [0, 0, 0] },
              keepMoveOnReach: false,
            },
          ],
        ]),
        templates: new Map(),
        callbackGraphs: new Map([[hitGraph.skillId, hitGraph]]),
      },
      callbackContext: returnProjectionContext,
    });

    expect(compile(launch, 'unregistered-exclusion-tag', returnProjectionContext)).toEqual([]);
  });

  it('首碰撞以 maxHitCount=1 回收时不读取其后的多段移动形状', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(raw.launch, 'launch');
    const runtime = parseProjectileRuntimeSource(runtimeFixtures[0], 'projectile');
    const compile = (maxHitCount: number) =>
      compileZeroDistanceFirstTickHitProjectileSource({
        sourcePath: 'first-hit-before-segments',
        launch,
        runtime: {
          ...runtime,
          maxHitCount,
          allowHitSameTarget: false,
          colliderShape: { shapeType: 1, radius: 0.4, extent: [0, 0, 0] },
          finishOnReach: false,
          keepMoveOnReach: true,
          presetPointKeys: ['LaunchPoint', 'TargetPoint', 'first'],
          useSegmentMove: true,
          moveSegments: [
            {
              startPointKey: 'LaunchPoint',
              moveModeId: 'first',
              endPointKey: 'first',
              earlyNextByDuration: false,
              segmentDuration: 0,
              skipHitAndBlockDetection: false,
            },
            {
              startPointKey: 'first',
              moveModeId: 'Default',
              endPointKey: 'TargetPoint',
              earlyNextByDuration: false,
              segmentDuration: 0,
              skipHitAndBlockDetection: false,
            },
          ],
        },
        template: null,
        hitGraph: {
          skillId: raw.hit.skillId,
          level: 1,
          durationFrame: 0,
          declaredBlackboard: [],
          actionGroup: { timelineActions: [], passiveEvents: [] },
        },
        callbackContext: returnProjectionContext,
      });

    expect(compile(1).body.steps).toHaveLength(1);
    expect(() => compile(-1)).toThrow('outside the proven zero-distance first-tick shape');
  });

  it('零距离模型允许同目标只命中一次的单段点到点投射物在首 tick 命中', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(raw.launch, 'launch');
    const runtime = parseProjectileRuntimeSource(runtimeFixtures[0], 'projectile');
    const result = compileZeroDistanceFirstTickHitProjectileSource({
      sourcePath: 'single-segment-zero-distance-hit',
      launch,
      runtime: {
        ...runtime,
        maxHitCount: -1,
        allowHitSameTarget: false,
        colliderShape: { shapeType: 1, radius: 0.3, extent: [0, 0, 0] },
        finishOnReach: false,
        keepMoveOnReach: true,
        presetPointKeys: ['LaunchPoint', 'TargetPoint'],
        useSegmentMove: true,
        moveSegments: [
          {
            startPointKey: 'LaunchPoint',
            moveModeId: 'Default',
            endPointKey: 'TargetPoint',
            earlyNextByDuration: false,
            segmentDuration: 0,
            skipHitAndBlockDetection: false,
          },
        ],
      },
      template: null,
      hitGraph: {
        skillId: raw.hit.skillId,
        level: 1,
        durationFrame: 0,
        declaredBlackboard: [],
        actionGroup: { timelineActions: [], passiveEvents: [] },
      },
      callbackContext: returnProjectionContext,
    });

    expect(result.body.steps).toHaveLength(1);
  });

  it('两段同点直线在第二 tick Reach 前不会让可重复命中投射物再次碰撞', () => {
    const raw = scopeFixtures[0]!;
    const launch = parseProjectileLaunchActionSource(raw.launch, 'launch');
    const runtime = parseProjectileRuntimeSource(runtimeFixtures[0], 'projectile');
    const compile = (moveModeTypes: ReadonlyMap<string, number>) =>
      compileZeroDistanceFirstTickHitProjectileSource({
        sourcePath: 'two-segment-reach-before-repeat-hit',
        launch,
        runtime: {
          ...runtime,
          maxHitCount: -1,
          allowHitSameTarget: true,
          colliderShape: { shapeType: 2, radius: 0, extent: [3, 3, 3] },
          finishOnReach: true,
          keepMoveOnReach: false,
          presetPointKeys: ['LaunchPoint', 'TargetPoint'],
          useSegmentMove: true,
          moveModeTypes,
          moveSegments: [
            {
              startPointKey: 'LaunchPoint',
              moveModeId: 'point1',
              endPointKey: 'TargetPoint',
              earlyNextByDuration: true,
              segmentDuration: 0.3,
              skipHitAndBlockDetection: false,
            },
            {
              startPointKey: 'TargetPoint',
              moveModeId: 'point2',
              endPointKey: 'TargetPoint',
              earlyNextByDuration: false,
              segmentDuration: 0,
              skipHitAndBlockDetection: false,
            },
          ],
        },
        template: null,
        hitGraph: {
          skillId: raw.hit.skillId,
          level: 1,
          durationFrame: 0,
          declaredBlackboard: [],
          actionGroup: { timelineActions: [], passiveEvents: [] },
        },
        callbackContext: returnProjectionContext,
      });

    expect(
      compile(
        new Map([
          ['point1', 0],
          ['point2', 0],
        ]),
      ).body.steps,
    ).toHaveLength(1);
    expect(() =>
      compile(
        new Map([
          ['point1', 4],
          ['point2', 0],
        ]),
      ),
    ).toThrow('outside the proven zero-distance first-tick shape');
  });

  it('未投影的投射物 Owner 不能作为伤害攻击者借用施法者身份', () => {
    const source = damageSource();
    expect(() =>
      compileEventTargetSimpleDamageOperationSource(
        { ...source, attacker: 'ActionOwner' },
        'damage',
        { actionOwnerTarget: 'unavailable', actionSourceTarget: 'caster' },
      ),
    ).toThrow('Owner projection is unavailable');
  });

  it('表现专用 effectSource 不要求投射物 Owner 映射为施法者', () => {
    const source = damageSource();
    expect(
      compileEventTargetSimpleDamageOperationSource(
        { ...source, effectSource: { ...source.effectSource, targetSource: 'Owner' } },
        'damage',
        { actionOwnerTarget: 'unavailable', actionSourceTarget: 'caster' },
      ),
    ).toEqual(compileEventTargetSimpleDamageOperationSource(source, 'baseline'));
  });

  it('未绑定的 Owner Buff 条件不能查询施法者的 Buff', () => {
    const raw = structuredClone(scopeFixtures[0]!.reach.sequence);
    const guard = raw.actionData[1]!;
    if (!('checkTarget' in guard) || !guard.checkTarget) throw new Error('fixture');
    guard.checkTarget.targetSource = 'Owner';
    expect(() =>
      compileCombatActionSequenceSource(parseReturnSequence(raw, 'reach'), returnProjectionContext),
    ).toThrow('Owner projection is unavailable');
  });

  it('未绑定的 Owner 回能不能记到施法者的资源账本', () => {
    const raw = structuredClone(scopeFixtures[0]!.reach.sequence);
    const gain = raw.actionData[2]!;
    if (!('source' in gain) || !gain.source || !('target' in gain) || !gain.target)
      throw new Error('fixture');
    gain.source.targetSource = 'Owner';
    gain.target.targetSource = 'Owner';
    expect(() =>
      compileCombatActionSequenceSource(parseReturnSequence(raw, 'reach'), returnProjectionContext),
    ).toThrow('resource gain source/target');
  });
  it.each([0, 1])('%i: 真实 Hp/Poise 读取动作黑板，并保留战技分类和击破弱点位', index => {
    const source = damageSource(index);
    expect(source.units[0]!.damageDecorateMask).toBe(4352);
    expect(compileEventTargetSimpleDamageOperationSource(source, 'return.damage')).toEqual({
      kind: 'dealDamage',
      parameters: {
        damageType: 'electric',
        attackScale: {
          kind: 'blackboard',
          key: index === 0 ? 'atk_scale_lance' : 'atk_scale_lance_ult',
        },
        tags: ['normalSkill'],
        features: ['canBreakWeakness'],
        stagger: { kind: 'blackboard', key: index === 0 ? 'poise_lance' : 'poise_lance_ult' },
      },
    });
  });

  it.each([0, 256, 512, 4096, 4352, 4608, 8192, 12288])('严格分解已覆盖伤害位 %i', mask => {
    const source = damageSource();
    const result = compileEventTargetSimpleDamageOperationSource(
      {
        ...source,
        units: [{ ...source.units[0]!, damageDecorateMask: mask }],
      },
      'damage',
    );
    expect(result.parameters.tags).toEqual(
      mask === 256 || mask === 4352
        ? ['normalSkill']
        : mask === 512 || mask === 4608
          ? ['ultimateSkill']
          : mask === 8192 || mask === 12288
            ? ['comboSkill']
            : [],
    );
    expect(result.parameters.features).toEqual(
      Math.floor(mask / 4096) % 2 === 1 ? ['canBreakWeakness'] : undefined,
    );
  });

  it('PoisePack 不保存元素类型，允许 Hp 电磁与 Poise 物理共用同一伤害动作', () => {
    const source = damageSource();
    const units = source.units.map((unit, index) =>
      index === 1 ? { ...unit, damageType: 'Physical' as const } : unit,
    );
    expect(
      compileEventTargetSimpleDamageOperationSource({ ...source, units }, 'ultimate.damage')
        .parameters.stagger,
    ).toEqual({ kind: 'blackboard', key: 'poise_lance' });
  });

  it.each([
    { value: 2, blackboardKey: null, levelValues: null },
    { value: 0, blackboardKey: 'unused_poise_atk_scale', levelValues: null },
  ])('Poise 分支不读取顶层 atkScale 残留 %j', attackScale => {
    const source = damageSource();
    const poise = source.units[1]!;
    expect(
      compileEventTargetSimpleDamageOperationSource(
        { ...source, units: [source.units[0]!, { ...poise, attackScale }] },
        'damage',
      ).parameters.stagger,
    ).toEqual({ kind: 'blackboard', key: 'poise_lance' });
  });

  it.each([
    { value: 0.5, blackboardKey: null, levelValues: null },
    { value: 0, blackboardKey: 'unused_scale', levelValues: null },
  ])('未缩放失衡不读取残留倍率 %j；开启缩放时保留运行时倍率', valueScale => {
    const source = damageSource();
    const poise = source.units[1]!;
    if (poise.poiseCalculation?.kind !== 'definite') throw new Error('fixture');
    const calculation = { ...poise.poiseCalculation, valueScale };
    const project = (applyScale: boolean) =>
      compileEventTargetSimpleDamageOperationSource(
        {
          ...source,
          units: [source.units[0]!, { ...poise, poiseCalculation: { ...calculation, applyScale } }],
        },
        'damage',
      );
    expect(project(false).parameters.stagger).toEqual({ kind: 'blackboard', key: 'poise_lance' });
    expect(project(false).parameters.staggerMultiplier).toBeUndefined();
    expect(project(true).parameters.staggerMultiplier).toEqual(
      valueScale.blackboardKey === null
        ? { kind: 'constant', value: valueScale.value }
        : { kind: 'blackboard', key: valueScale.blackboardKey },
    );
  });

  it.each([
    [4, ['powerAttack']],
    [128, ['normalAttack']],
    [1024, ['plungingAttack']],
    [131072, ['dashAttack']],
    [2097152, ['normalAttackLastCombo']],
    [2097284, ['normalAttack', 'normalAttackLastCombo', 'powerAttack']],
  ] as const)('严格分解普攻家族伤害位 %i', (mask, tags) => {
    const source = damageSource();
    expect(
      compileEventTargetSimpleDamageOperationSource(
        { ...source, units: [{ ...source.units[0]!, damageDecorateMask: mask }] },
        'damage',
      ).parameters.tags,
    ).toEqual(tags);
  });

  it.each([1, 8, 4353, 2 ** 32 + 4352, Number.MAX_SAFE_INTEGER + 1, -1, 0.5])(
    '未知位/非安全整数 %s 不被位运算截断后放行',
    mask => {
      const source = damageSource();
      expect(() =>
        compileEventTargetSimpleDamageOperationSource(
          {
            ...source,
            units: [{ ...source.units[0]!, damageDecorateMask: mask }],
          },
          'damage',
        ),
      ).toThrow('damage decorate mask');
    },
  );

  it.each([16384, 32768, 1073741824])('物理异常伤害位 %i 启用统一倍率特征', mask => {
    const source = damageSource();
    expect(
      compileEventTargetSimpleDamageOperationSource(
        { ...source, units: [{ ...source.units[0]!, damageDecorateMask: mask }] },
        'damage',
      ).parameters.features,
    ).toEqual(['physicalInfliction']);
  });

  it('投影生命伤害的攻击快照、灼烧/DOT 分类和禁暴击即时修正', () => {
    const source = damageSource();
    expect(
      compileEventTargetSimpleDamageOperationSource(
        {
          ...source,
          units: [
            {
              ...source.units[0]!,
              takeAttackSnapshot: true,
              damageDecorateMask: 67108864 + 268435456,
              processors: [
                {
                  kind: 'instantAttributeModifier',
                  targetSide: 'Attacker',
                  modifyAttributeType: 'Specific',
                  attributeType: 'CriticalRate',
                  formulaItem: 'FinalMultiplier',
                  parameter: { value: 0, blackboardKey: null, levelValues: null },
                },
              ],
            },
          ],
        },
        'damage',
      ).parameters,
    ).toMatchObject({
      takeAttackSnapshot: true,
      tags: ['fireAbnormal'],
      features: ['dot'],
      instantAttributeModifiers: [
        {
          targetSide: 'attacker',
          attribute: 'criticalRate',
          slot: 'finalMultiplier',
          value: { kind: 'constant', value: 0 },
          attributeTiming: 'runtime',
        },
      ],
    });
  });

  it('失衡单元和破防公式仍不接受攻击快照', () => {
    const source = damageSource();
    expect(() =>
      compileEventTargetSimpleDamageOperationSource(
        {
          ...source,
          units: source.units.map((unit, index) =>
            index === 1 ? { ...unit, takeAttackSnapshot: true } : unit,
          ),
        },
        'damage',
      ),
    ).toThrow('Poise DamageUnit behavior');
  });

  it('普通 AtkScaleCalculation 只读嵌套倍率，简单路径不读失效的残留公式', () => {
    const raw = rawDamage();
    const hp = raw.damageUnits[0]!;
    const nested = {
      $type: 'Beyond.Gameplay.Core.AtkScaleCalculation, Gameplay.Beyond',
      atkScale: { useBlackboardKey: true, blackboardKey: 'nested_scale', value: 999 },
    };
    const source = parseDamageActionSource(
      {
        ...raw,
        damageUnits: [{ ...hp, simpleCalculation: false, atkCalculation: nested }],
      },
      'normal',
      { nested_scale: [2, 3] },
    );
    expect(
      compileEventTargetSimpleDamageOperationSource(source, 'normal').parameters.attackScale,
    ).toEqual({ kind: 'blackboard', key: 'nested_scale' });

    const simple = parseDamageActionSource(
      {
        ...raw,
        damageUnits: [
          {
            ...hp,
            simpleCalculation: true,
            atkCalculation: { ...nested, atkScale: { ...nested.atkScale, blackboardKey: '' } },
          },
        ],
      },
      'simple',
      {},
    );
    expect(
      compileEventTargetSimpleDamageOperationSource(simple, 'simple').parameters.attackScale,
    ).toEqual({ kind: 'blackboard', key: 'atk_scale_lance' });
  });

  it('普通公式缺失或公式种类不同不能回落到顶层倍率', () => {
    const source = damageSource();
    for (const attackCalculation of [
      null,
      {
        kind: 'definite' as const,
        value: source.units[0]!.attackScale,
        applyScale: false,
        valueScale: source.units[0]!.attackScale,
      },
    ]) {
      expect(() =>
        compileEventTargetSimpleDamageOperationSource(
          {
            ...source,
            units: [
              {
                ...source.units[0]!,
                simpleCalculation: false,
                serializedAttackCalculationPresent: true,
                attackCalculation,
              },
            ],
          },
          'damage',
        ),
      ).toThrow('unsupported event attack calculation');
    }
  });

  it('事件伤害保留来源角色属性倍率与加算，且不把受击者属性当作攻击来源', () => {
    const source = damageSource();
    const attributeCalculation = {
      kind: 'attribute' as const,
      valueSource: 'AttackerOrHealer',
      attributeType: 'Def' as const,
      multiplier: { value: 0, blackboardKey: 'def_scale', levelValues: null },
      addition: { value: 0, blackboardKey: 'dmg_base', levelValues: null },
    };
    const withCalculation = {
      ...source,
      units: [
        {
          ...source.units[0]!,
          simpleCalculation: false,
          serializedAttackCalculationPresent: true,
          attackCalculation: attributeCalculation,
        },
      ],
    };

    expect(
      compileEventTargetSimpleDamageOperationSource(withCalculation, 'catcher.potential1'),
    ).toMatchObject({
      parameters: {
        attackScale: { kind: 'blackboard', key: 'def_scale' },
        calculation: 'attribute',
        calculationAttribute: 'Def',
        calculationAddition: { kind: 'blackboard', key: 'dmg_base' },
      },
    });

    expect(() =>
      compileEventTargetSimpleDamageOperationSource(
        {
          ...withCalculation,
          units: [
            {
              ...withCalculation.units[0]!,
              attackCalculation: { ...attributeCalculation, valueSource: 'Target' },
            },
          ],
        },
        'unsafe-target-attribute',
      ),
    ).toThrow('unsupported event attack calculation source');
  });

  it.each([0, 1])('%i: 木桩 Target 与事件 Target 分开，原生条件和先乘再伤害顺序不变', index => {
    const scope = makeReturnProjection(index);
    const hit = scope.body.steps[0]!;
    if (hit.kind !== 'withActionBlackboardScope') throw new Error('fixture');
    const branch = hit.body.steps[1]!;
    expect(branch).toMatchObject({
      kind: 'conditional',
      parameters: {
        alwaysNext: true,
        condition: {
          kind: 'all',
          conditions: [
            { kind: 'actionValueCompare' },
            {
              kind: 'buffStackCompare',
              target: 'enemy',
              buffTags: ['Skill/Character/Common/Affixes/Vulnerable/VulnerablePulse'],
            },
          ],
        },
      },
      whenTrue: { steps: [{ kind: 'modifyActionValue' }, { kind: 'dealDamage' }] },
      whenFalse: { steps: [{ kind: 'dealDamage' }] },
    });
  });

  it('没有被证明的主动物理事件条件不可借用事件上下文', () => {
    const raw = scopeFixtures[0]!.reach.sequence;
    const source = parseReturnSequence(raw, 'reach');
    const condition = source.actions[1]!;
    const unsafe = {
      ...source,
      actions: [
        {
          ...condition,
          body: {
            kind: 'leaf' as const,
            value: {
              family: 'condition' as const,
              action: {
                kind: 'skillType' as const,
                sourceType: 'CheckSkillType',
                skillTypes: ['NormalSkill'],
              },
            },
          },
        },
      ],
    };
    expect(() => compileCombatActionSequenceSource(unsafe, returnProjectionContext)).toThrow(
      'unaudited single-enemy action condition',
    );
  });

  it('命中回调的 Enemy 对象类型守卫按唯一敌人木桩折叠为真', () => {
    const damage = rawDamage();
    const source = parseReturnSequence(
      {
        actionData: [
          {
            $type: 'Beyond.Gameplay.Core.Conditions.CheckObjectTypeMatch+Data, Gameplay.Beyond',
            isEnable: true,
            priorityLevel: 'Default',
            priorityOffset: 0,
            serverActionIndex: 0,
            target: structuredClone(damage.targetSettings),
            objectTypeMask: 'Enemy',
          },
          damage,
        ],
        onlyExecuteWhenSourceIsMainChar: false,
        onlyExecuteWhenSourceIsGuard: false,
      },
      'enemy-object-type-guard',
    );

    expect(compileCombatActionSequenceSource(source, returnProjectionContext).steps).toMatchObject([
      { kind: 'dealDamage' },
    ]);
  });

  it('伤害不能在明确绑定为队友集合的 Target 上伪装为木桩伤害', () => {
    const sequence = parseReturnSequence(
      {
        actionData: [rawDamage()],
        onlyExecuteWhenSourceIsMainChar: false,
        onlyExecuteWhenSourceIsGuard: false,
      },
      'damage',
    );
    expect(() =>
      compileCombatActionSequenceSource(sequence, {
        ...returnProjectionContext,
        actionTargetTarget: 'partyExceptCaster',
      }),
    ).toThrow('damage source');
  });
});
