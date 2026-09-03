import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { describe, expect, it } from 'vitest';
import { compileCombatActionSequenceSource } from '../src/compiler/buffRuntimeProjection.ts';
import { collectNativeActionNodes } from '../src/source/controlFlow.ts';
import type { TargetReferenceSource } from '../src/source/target.ts';
import { parseReturnSequence } from './support/avywennaReturnProjection.ts';
import {
  makeReturnTargetProjection,
  returnTargetContext,
  returnTargetFixture,
} from './support/avywennaReturnTargets.ts';

function nodes(index = 0) {
  return parseReturnSequence(returnTargetFixture.timelines[index]!.sequence, 'return');
}

function fixedTarget(targetSource: string): TargetReferenceSource {
  return {
    targetSource,
    targetGroupKey: '',
    selectorOwner: 'ActionOwner',
    ownerContextKey: '',
    centerType: 'ActionSource',
    centerContextKey: '',
    centerToGround: false,
    target: 'ActionSource',
    targetContextKey: '',
    enableAdvancedDirection: false,
    selectorDirection: 'SourceForward',
    finderType: null,
    finderShape: null,
    finderOwnerPartsQuery: null,
    validatorTypes: [],
    postProcessorTypes: [],
    priorityFilters: [],
    shuffleTargets: [],
    distanceValidators: [],
    finderSpawnedObjectType: null,
    validatorTagQueries: [],
  };
}

describe('原生查询 → Context → 逐能力实体动作的公共投影', () => {
  it('FinishOwner(All) 在同步投射物木桩模型中结束施法者全部逻辑能力实体', () => {
    const source = nodes();
    const metadata = source.actions[0]!.metadata;
    const result = compileCombatActionSequenceSource(
      {
        ...source,
        actions: [
          {
            sourcePath: 'finishOwner.allSpawned',
            metadata,
            body: {
              kind: 'leaf',
              value: {
                family: 'lifecycle',
                action: {
                  kind: 'finishOwner',
                  owner: {
                    ...fixedTarget('InstantSearch'),
                    finderType: 'OwnerSpawnedEntityFinder',
                    finderSpawnedObjectType: 'All',
                  },
                  skipDieDisplay: false,
                },
              },
            },
          },
        ],
      },
      returnTargetContext,
    );
    expect(result.steps).toEqual([
      {
        kind: 'findOwnerSpawnedAbilityEntities',
        parameters: { saveToContextKey: '__finishOwnerAll:finishOwner.allSpawned' },
      },
      {
        kind: 'forEachContextTarget',
        parameters: { contextKey: '__finishOwnerAll:finishOwner.allSpawned' },
        body: { steps: [{ kind: 'finishCurrentAbilityEntity', parameters: {} }] },
      },
    ]);
  });

  it('把当前能力实体剩余时长条件投射为运行时可求值条件', () => {
    const source = nodes();
    const metadata = source.actions[0]!.metadata;
    const result = compileCombatActionSequenceSource(
      {
        ...source,
        actions: [
          {
            sourcePath: 'duration.condition',
            metadata,
            body: {
              kind: 'leaf',
              value: {
                family: 'condition',
                action: {
                  kind: 'abilityEntityDuration',
                  sourceType: 'CheckAbilityEntityCurDuration',
                  target: fixedTarget('Target'),
                  comparison: 'LT',
                  value: { value: 3, blackboardKey: null, levelValues: null },
                  saveCurrentDuration: true,
                  outputKey: 'remaining',
                },
              },
            },
          },
        ],
      },
      { ...returnTargetContext, actionTargetTarget: 'currentAbilityEntity' },
    );
    expect(result.steps).toEqual([
      {
        kind: 'conditional',
        parameters: {
          condition: {
            kind: 'abilityEntityRemainingDurationCompare',
            operator: 'less',
            value: { kind: 'constant', value: 3 },
            outputKey: 'remaining',
          },
        },
        whenTrue: { steps: [] },
      },
    ]);
  });

  it('ExtendBuffAction 映射为随时间轴区间释放的施法者 Buff hold', () => {
    const source = nodes();
    const metadata = source.actions[0]!.metadata;
    expect(
      compileCombatActionSequenceSource(
        {
          ...source,
          actions: [
            {
              sourcePath: 'extendBuff.id',
              metadata,
              body: {
                kind: 'leaf',
                value: {
                  family: 'buffHold',
                  action: {
                    kind: 'buffHold',
                    owner: { targetSource: 'Source', targetGroupKey: '' } as never,
                    settings: {
                      checkType: 'Id',
                      buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
                      tagQuery: { queryType: 'hasAny', tagIds: [] },
                    },
                  },
                },
              },
            },
          ],
        },
        returnTargetContext,
      ).steps,
    ).toEqual([
      {
        kind: 'holdBuffsById',
        parameters: {
          target: 'caster',
          buffIds: ['buff_chr_0030_zhuangfy_ult_base'],
        },
      },
    ]);
  });

  it('敌人 FixedPoint 出生锚点与能力实体直接字符串赋值都被保留', () => {
    const source = nodes();
    const metadata = source.actions[0]!.metadata;
    const result = compileCombatActionSequenceSource(
      {
        ...source,
        actions: [
          {
            sourcePath: 'spawn.stringAssignment',
            metadata,
            body: {
              kind: 'leaf',
              value: {
                family: 'abilityEntity',
                action: {
                  kind: 'abilityEntitySpawn',
                  abilityEntityId: 'abilityentity.fixture',
                  setSource: true,
                  sourceType: 'ActionSource',
                  sourceContextKey: '',
                  setTarget: true,
                  target: fixedTarget('Target'),
                  bornAt: { ...fixedTarget('Target'), finderType: 'FixedPointFinder' },
                  bornMountPoint: 'None',
                  bornPositionOffset: [0, 0, 0],
                  checkNavmeshAreaName: false,
                  forbiddenAreaNames: [],
                  attachToClosestMeshPoint: false,
                  rotateYFromBoneToCurrentPosition: false,
                  bornRotation: 'SourceForward',
                  bornRotationContextTarget: '',
                  useAdvancedDirection: false,
                  advancedDirection: {} as never,
                  clampToXZPlane: false,
                  applyBornRotationOffset: false,
                  bornRotationOffset: [0, 0, 0, 1],
                  assignEntityBlackboard: true,
                  assignments: [
                    {
                      targetKey: 'EntityBB_hitedMark',
                      inputValueKey: '',
                      useDirectValue: true,
                      valueType: 'String',
                      numericValue: 0,
                      stringValue: 'attack1UltHitMark',
                    },
                  ],
                  assignBlackboard: true,
                  skillId: '',
                  overrideDuration: false,
                  duration: { value: 0, blackboardKey: null, levelValues: null },
                  saveToContext: false,
                  contextKey: '',
                  pauseEffectOnEnd: false,
                  inheritSourceSkillCastId: true,
                  dieWhenSourceDies: false,
                  forceSyncInit: false,
                  dieOnEnd: false,
                  allowMultipleInputTargets: false,
                },
              },
            },
          },
        ],
      },
      returnTargetContext,
    );
    expect(result.steps[0]).toMatchObject({
      kind: 'spawnAbilityEntity',
      parameters: {
        stringBlackboardAssignments: { EntityBB_hitedMark: 'attack1UltHitMark' },
      },
    });
    expect(
      result.steps[0]?.kind === 'spawnAbilityEntity'
        ? result.steps[0].parameters.childSkillId
        : 'unexpected-step',
    ).toBeUndefined();
  });

  it('ForEach 的 InputTarget 可直接修改当前能力实体剩余时间', () => {
    const source = nodes();
    const metadata = source.actions[0]!.metadata;
    expect(
      compileCombatActionSequenceSource(
        {
          ...source,
          actions: [
            {
              sourcePath: 'duration.inputTarget',
              metadata,
              body: {
                kind: 'leaf',
                value: {
                  family: 'abilityEntityDuration',
                  action: {
                    kind: 'abilityEntityDurationMutation',
                    setMultipleTargets: false,
                    target: {} as never,
                    actionTargetType: 'InputTarget',
                    targetContextKey: '',
                    operation: 'Assign',
                    value: { value: 3, blackboardKey: null, levelValues: null },
                  },
                },
              },
            },
          ],
        },
        { ...returnTargetContext, actionTargetTarget: 'currentAbilityEntity' },
      ).steps,
    ).toEqual([
      {
        kind: 'setAbilityEntityRemainingDuration',
        parameters: { value: { kind: 'constant', value: 3 } },
      },
    ]);
  });

  it.each([0, 1])('真实枪类型 %i 只查询模板候选，不制造实例；Buff 的 Target 是当前枪', index => {
    const result = makeReturnTargetProjection(index);
    expect(result.steps[0]).toEqual({
      kind: 'findOwnerSpawnedAbilityEntities',
      parameters: {
        saveToContextKey: index === 0 ? 'ComboLances' : 'UltiLances',
        abilityEntityIds: [
          index === 0
            ? 'abilityentity_chr_0012_avywen_combo_skill_lance'
            : 'abilityentity_chr_0012_avywen_ultimate_skill',
        ],
      },
    });
    const guard = result.steps[1];
    expect(guard?.kind).toBe('conditional');
    if (guard?.kind !== 'conditional') throw new Error('missing count guard');
    const loop = guard.whenTrue.steps[1];
    if (loop?.kind !== 'forEachContextTarget') throw new Error('missing loop');
    expect(loop.body.steps[0]).toMatchObject({
      kind: 'conditional',
      parameters: {
        condition: {
          kind: 'actionValueCompare',
          operator: 'lessOrEqual',
          left: { kind: 'constant', value: 0 },
          right: { kind: 'constant', value: 50 },
        },
      },
      whenTrue: {
        steps: [
          {
            kind: 'applyBuff',
            parameters: { target: 'currentAbilityEntity', inheritSourceSkillCastInfo: true },
          },
        ],
      },
    });
    const distance = loop.body.steps[0]!;
    if (distance.kind !== 'conditional') throw new Error('missing distance');
    expect(distance.whenTrue.steps[0]).not.toHaveProperty('parameters.source'); // defaults to caster, not eventSource
  });

  it('未提供目录时拒绝查询，不能用木桩代替能力实体', () => {
    const { abilityEntityQueries: _, ...context } = returnTargetContext;
    expect(() => compileCombatActionSequenceSource(nodes(), context)).toThrow('target group');
  });

  it('当前枪不覆盖 owner/source，未绑定宿主时拒绝 owner 查询', () => {
    expect(() =>
      compileCombatActionSequenceSource(nodes(), {
        gameplayTagRegistry: fixtureGameplayTagRegistry,
        ...returnTargetContext,
        actionOwnerTarget: 'unavailable',
      }),
    ).toThrow('query environment');
  });

  it('ForEach 必须来自已投影的实体查询，不能猜一个 Context 的类型', () => {
    const source = nodes();
    expect(() =>
      compileCombatActionSequenceSource(
        { ...source, actions: source.actions.slice(3) },
        returnTargetContext,
      ),
    ).toThrow('unsupported Buff runtime action');
  });

  it('查询零对象掩码保留空 ID 列表，不能退化成所有实体', () => {
    const source = nodes();
    const first = source.actions[0]!;
    if (first.body.kind !== 'leaf' || first.body.value.family !== 'targetGroup') throw new Error();
    const query = { ...first.body.value.action, finderSpawnedObjectType: '0' };
    const result = compileCombatActionSequenceSource(
      {
        ...source,
        actions: [
          { ...first, body: { kind: 'leaf', value: { family: 'targetGroup', action: query } } },
          ...source.actions.slice(1),
        ],
      },
      returnTargetContext,
    );
    expect(result.steps[0]).toHaveProperty('parameters.abilityEntityIds', []);
  });

  it('OwnerSpawnedEntityFinder 没有空间过滤时不读取序列化的 Context center', () => {
    const source = nodes();
    const first = source.actions[0]!;
    if (first.body.kind !== 'leaf' || first.body.value.family !== 'targetGroup') throw new Error();
    const query = {
      ...first.body.value.action,
      center: 'ContextTarget',
      centerContextKey: 'unbound-spatial-center',
    };
    const result = compileCombatActionSequenceSource(
      {
        ...source,
        actions: [
          { ...first, body: { kind: 'leaf', value: { family: 'targetGroup', action: query } } },
          ...source.actions.slice(1),
        ],
      },
      returnTargetContext,
    );

    expect(result.steps[0]).toEqual({
      kind: 'findOwnerSpawnedAbilityEntities',
      parameters: {
        saveToContextKey: 'ComboLances',
        abilityEntityIds: ['abilityentity_chr_0012_avywen_combo_skill_lance'],
      },
    });
  });

  it('唯一敌人排除当前 Target 后建立显式空目标组', () => {
    const source = nodes();
    const first = source.actions[0]!;
    if (first.body.kind !== 'leaf' || first.body.value.family !== 'targetGroup') throw new Error();
    const query = {
      ...first.body.value.action,
      finderType: 'HitBoxFinder',
      finderFactionTarget: 'Anti',
      finderTargetObjectType: 'Normal',
      finderCheckAlive: true,
      finderShape: {} as never,
      finderSpawnedObjectType: null,
      validatorTypes: [],
      validatorTagQueries: [],
      postProcessorTypes: ['ExcludeTarget', 'PriorityFilter'],
      excludesCurrentTarget: true,
      excludesOwner: false,
      priorityFilters: [
        {
          filterType: 'DistanceFromCenterAsc' as const,
          processTargetType: 'Targets' as const,
          onlyReserveMaxPriorityTargets: false,
          limitMaxNum: true,
          maxNum: 1,
          buffFilter: {
            checkType: 'Id',
            buffIds: [],
            tagQuery: { queryType: 'hasAny' as const, tagIds: [] },
            stackCountType: 'BuffCount',
          },
        },
      ],
      distanceValidators: [],
      shuffleTargets: [],
      center: 'ActionSource',
      centerContextKey: '',
      selectorOwner: 'ActionOwner',
      selectorOwnerContextKey: '',
    };
    const result = compileCombatActionSequenceSource(
      {
        ...source,
        actions: [
          { ...first, body: { kind: 'leaf', value: { family: 'targetGroup', action: query } } },
          {
            ...first,
            sourcePath: 'fixture.empty-projectile',
            body: {
              kind: 'leaf',
              value: {
                family: 'projectile',
                action: {
                  target: { targetSource: 'Context', targetGroupKey: 'ComboLances' },
                } as never,
              },
            },
          },
        ],
      },
      returnTargetContext,
      new Set(),
      {
        compileProjectileLaunch: () => {
          throw new Error('empty target group must not launch a projectile');
        },
      },
    );

    expect(result.steps).toEqual([
      {
        kind: 'mergeContextTargets',
        parameters: { saveToContextKey: 'ComboLances', sources: [] },
      },
    ]);
  });

  it.each([
    'ContinuousFindTargetAction',
    'contextOwner',
    'postProcessor',
    'excludeDeadEntity',
  ] as const)('未知投影选项 %s 严格拒绝，不静默丢失时序或过滤', option => {
    const source = nodes();
    const first = source.actions[0]!;
    const second = source.actions[1]!;
    if (
      first.body.kind !== 'leaf' ||
      first.body.value.family !== 'targetGroup' ||
      second.body.kind !== 'leaf' ||
      second.body.value.family !== 'condition' ||
      second.body.value.action.kind !== 'entityCount'
    )
      throw new Error();
    const query = first.body.value.action;
    const changed =
      option === 'ContinuousFindTargetAction'
        ? { ...query, producerType: option }
        : option === 'contextOwner'
          ? { ...query, selectorOwner: 'ContextTarget', selectorOwnerContextKey: 'missing' }
          : option === 'postProcessor'
            ? { ...query, postProcessorTypes: ['unknown'] }
            : query;
    const condition =
      option === 'excludeDeadEntity'
        ? { ...second.body.value.action, excludeDeadEntity: true }
        : second.body.value.action;
    expect(() =>
      compileCombatActionSequenceSource(
        {
          ...source,
          actions: [
            { ...first, body: { kind: 'leaf', value: { family: 'targetGroup', action: changed } } },
            {
              ...second,
              body: { kind: 'leaf', value: { family: 'condition', action: condition } },
            },
            ...source.actions.slice(2),
          ],
        },
        returnTargetContext,
      ),
    ).toThrow();
  });

  it.each(['source', 'includeTargetRadius', 'containsHittableObject'] as const)(
    '未证明的距离选项 %s 不在循环外或未知目标上放行',
    field => {
      const source = nodes();
      const node = collectNativeActionNodes(source).find(
        node =>
          node.body.kind === 'leaf' &&
          node.body.value.family === 'condition' &&
          node.body.value.action.kind === 'distance',
      )!;
      if (
        node.body.kind !== 'leaf' ||
        node.body.value.family !== 'condition' ||
        node.body.value.action.kind !== 'distance'
      )
        throw new Error();
      const condition = node.body.value.action;
      const bad =
        field === 'source'
          ? { ...condition, source: { ...condition.source, targetSource: 'Context' } }
          : { ...condition, [field]: true };
      expect(() =>
        compileCombatActionSequenceSource(
          {
            ...source,
            actions: [
              { ...node, body: { kind: 'leaf', value: { family: 'condition', action: bad } } },
              source.actions[2]!,
            ],
          },
          {
            ...returnTargetContext,
            actionTargetTarget: 'currentAbilityEntity',
          },
        ),
      ).toThrow(/distance|zero-distance/);
    },
  );

  it('主动技能入口已证明的敌人 Context 按零距离处理目标半径', () => {
    const source = nodes();
    const node = collectNativeActionNodes(source).find(
      node =>
        node.body.kind === 'leaf' &&
        node.body.value.family === 'condition' &&
        node.body.value.action.kind === 'distance',
    )!;
    if (
      node.body.kind !== 'leaf' ||
      node.body.value.family !== 'condition' ||
      node.body.value.action.kind !== 'distance'
    )
      throw new Error();
    const condition = {
      ...node.body.value.action,
      source: { ...node.body.value.action.source, targetSource: 'Owner', targetGroupKey: '' },
      target: {
        ...node.body.value.action.target,
        targetSource: 'Context',
        targetGroupKey: 'smart_target',
      },
      distance: 5,
      lessThan: true,
      includeTargetRadius: true,
      containsHittableObject: false,
    };

    expect(
      compileCombatActionSequenceSource(
        {
          ...source,
          actions: [
            { ...node, body: { kind: 'leaf', value: { family: 'condition', action: condition } } },
            source.actions[2]!,
          ],
        },
        {
          ...returnTargetContext,
          actionTargetTarget: 'enemy',
          staticEnemyTargetGroupKeys: new Set(['smart_target']),
        },
      ).steps[0],
    ).toMatchObject({
      kind: 'conditional',
      parameters: {
        condition: {
          kind: 'actionValueCompare',
          left: { kind: 'constant', value: 0 },
          operator: 'lessOrEqual',
          right: { kind: 'constant', value: 5 },
        },
      },
    });
  });

  it('直接动作 Target 已证明为唯一木桩时按零距离处理目标半径与 hittable 回退', () => {
    const source = nodes();
    const node = collectNativeActionNodes(source).find(
      node =>
        node.body.kind === 'leaf' &&
        node.body.value.family === 'condition' &&
        node.body.value.action.kind === 'distance',
    )!;
    if (
      node.body.kind !== 'leaf' ||
      node.body.value.family !== 'condition' ||
      node.body.value.action.kind !== 'distance'
    )
      throw new Error();
    const condition = {
      ...node.body.value.action,
      source: { ...node.body.value.action.source, targetSource: 'Owner', targetGroupKey: '' },
      target: { ...node.body.value.action.target, targetSource: 'Target', targetGroupKey: '' },
      distance: 10,
      lessThan: true,
      includeTargetRadius: true,
      containsHittableObject: true,
    };

    expect(
      compileCombatActionSequenceSource(
        {
          ...source,
          actions: [
            { ...node, body: { kind: 'leaf', value: { family: 'condition', action: condition } } },
            source.actions[2]!,
          ],
        },
        {
          ...returnTargetContext,
          actionTargetTarget: 'enemy',
        },
      ).steps[0],
    ).toMatchObject({
      kind: 'conditional',
      parameters: {
        condition: {
          kind: 'actionValueCompare',
          left: { kind: 'constant', value: 0 },
          operator: 'lessOrEqual',
          right: { kind: 'constant', value: 10 },
        },
      },
    });
  });
});
