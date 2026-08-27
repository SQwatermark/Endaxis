import { describe, expect, it } from 'vitest';
import fixtures from './fixtures/avywenna-return-damage.json';
import scopeFixtures from './fixtures/avywenna-return-blackboard.json';
import runtimeFixtures from './fixtures/avywenna-return-projectile-runtime.json';
import { parseDamageActionSource } from '../src/source/damageActions.ts';
import { compileEventTargetSimpleDamageOperationSource } from '../src/compiler/simpleDamageOperation.ts';
import { compileCombatActionSequenceSource } from '../src/compiler/buffRuntimeProjection.ts';
import { compileImmediateProjectileCallbackSkillSource } from '../src/compiler/projectileRuntimeProjection.ts';
import { parseProjectileLaunchActionSource } from '../src/source/referenceActions.ts';
import {
  makeReturnProjection,
  parseReturnSequence,
  returnProjectionContext,
} from './support/avywennaReturnProjection.ts';

function rawDamage(index = 0) {
  return structuredClone(fixtures[index]!.branch.failActions.actionData[0]!);
}
function damageSource(index = 0) {
  return parseDamageActionSource(rawDamage(index), 'return.damage', {});
}

describe('公共回调伤害投影', () => {
  it.each(['Target', 'Context'])('%s 不执行残留选择器，但 Context 必须绑定已证明的敌人组', targetSource => {
    const raw = rawDamage();
    const redundantSelector = {
      finderData: { $type: 'Beyond.Gameplay.Core.Selector+MainTargetFinder+Data, Gameplay.Beyond' },
      validatorData: [{ $type: 'Beyond.Gameplay.Core.Selector+ExcludeOwnerValidator+Data, Gameplay.Beyond' }],
      postProcessorData: [],
    };
    const action = parseDamageActionSource({
      ...raw,
      targetSettings: { ...raw.targetSettings, targetSource, targetGroupKey: 'tar', selectorData: redundantSelector },
      effectSource: { ...raw.effectSource, selectorData: redundantSelector },
    }, 'damage', {});
    const context = {
      actionOwnerTarget: 'caster', actionSourceTarget: 'caster',
      staticEnemyTargetGroupKeys: new Set(['tar']),
    } as const;
    expect(compileEventTargetSimpleDamageOperationSource(action, 'damage', context))
      .toEqual(compileEventTargetSimpleDamageOperationSource(damageSource(), 'baseline'));
    if (targetSource === 'Context') {
      expect(() => compileEventTargetSimpleDamageOperationSource(action, 'damage'))
        .toThrow('unsupported simple event damage target');
      expect(() => compileEventTargetSimpleDamageOperationSource({
        ...action, target: { ...action.target, targetGroupKey: '' },
      }, 'damage', { ...context, staticEnemyTargetGroupKeys: new Set(['']) }))
        .toThrow('unsupported simple event damage target');
    }
  });

  it('InstantSearch 不能借用同名已保存目标组绕过搜索投影', () => {
    const source = damageSource();
    expect(() => compileEventTargetSimpleDamageOperationSource({
      ...source, target: { ...source.target, targetSource: 'InstantSearch', targetGroupKey: 'tar' },
    }, 'damage', {
      actionOwnerTarget: 'caster', actionSourceTarget: 'caster',
      staticEnemyTargetGroupKeys: new Set(['tar']),
    })).toThrow('unsupported simple event damage target');
  });

  it('非搜索路径仍通过来源解析器拒绝未知残留选择器', () => {
    const raw = rawDamage();
    expect(() => parseDamageActionSource({
      ...raw,
      targetSettings: { ...raw.targetSettings, targetSource: 'Context', targetGroupKey: 'tar',
        selectorData: {
          finderData: { $type: 'Beyond.Gameplay.Core.Selector+UnknownFinder+Data, Gameplay.Beyond' },
          validatorData: [], postProcessorData: [],
        },
      },
    }, 'damage', {})).toThrow('unsupported finder');
  });

  it('完整回调动作图保留 startFrame=0 的区间时间膨胀，并拒绝延迟启动', () => {
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
    expect(() =>
      compileImmediateProjectileCallbackSkillSource({
        graph,
        context: returnProjectionContext,
        extensions: { resolveTimeDilationPriority: () => 10 },
      }),
    ).toThrow('delayed projectile callback is unsupported');
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

  it.each(['attacker', 'effectSource'] as const)(
    '未投影的投射物 Owner 不能由 %s 借用为施法者',
    field => {
      const source = damageSource();
      const action =
        field === 'attacker'
          ? { ...source, attacker: 'ActionOwner' }
          : { ...source, effectSource: { ...source.effectSource, targetSource: 'Owner' } };
      expect(() =>
        compileEventTargetSimpleDamageOperationSource(action, 'damage', {
          actionOwnerTarget: 'unavailable',
          actionSourceTarget: 'caster',
        }),
      ).toThrow('Owner projection is unavailable');
    },
  );

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
    { value: 0.5, blackboardKey: null, levelValues: null },
    { value: 0, blackboardKey: 'unused_scale', levelValues: null },
  ])('未缩放失衡不读取残留倍率 %j；开启缩放时仍严格阻断', valueScale => {
    const source = damageSource();
    const poise = source.units[1]!;
    if (poise.poiseCalculation?.kind !== 'definite') throw new Error('fixture');
    const calculation = { ...poise.poiseCalculation, valueScale };
    const project = (applyScale: boolean) => compileEventTargetSimpleDamageOperationSource({
      ...source,
      units: [source.units[0]!, { ...poise, poiseCalculation: { ...calculation, applyScale } }],
    }, 'damage');
    expect(project(false).parameters.stagger).toEqual({ kind: 'blackboard', key: 'poise_lance' });
    expect(() => project(true)).toThrow('unsupported simple event Poise DamageUnit behavior');
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

  it.each([1, 8, 16384, 4353, 2 ** 32 + 4352, Number.MAX_SAFE_INTEGER + 1, -1, 0.5])(
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

  it.each([0, 1])('第 %i 单元的施法时攻击快照未接入时严格拒绝', index => {
    const source = damageSource();
    expect(() =>
      compileEventTargetSimpleDamageOperationSource(
        {
          ...source,
          units: source.units.map((unit, i) =>
            i === index ? { ...unit, takeAttackSnapshot: true } : unit,
          ),
        },
        'damage',
      ),
    ).toThrow('DamageUnit behavior');
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
            { kind: 'buffStackCompare', target: 'enemy', buffTagIds: [-1640994543] },
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
