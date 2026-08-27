import { describe, expect, it } from 'vitest';

import {
  collectTargetGroupWrites,
  parseBlackboardCalculationActionSource,
  parseBlackboardCalculationPayloadSource,
  parseBlackboardMutationActionSource,
  parseBlackboardMutationPayloadSource,
  parseAttributeSnapshotActionSource,
  parseRandomBlackboardActionSource,
  parseTargetGroupActionSource,
  parseTargetGroupWriteAction,
} from '../src/index.ts';
import { runPythonOracle } from './pythonOracle.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

describe('黑板运行时动作载荷', () => {
  const meta = {
    $type: 'Example.Action+Data, Example',
    isEnable: true,
    priorityLevel: 'Default',
    priorityOffset: 0,
    serverActionIndex: 1,
  } as const;

  it('完整来源入口严格读取 SimpleCalcBBAction 字段', () => {
    expect(
      parseBlackboardCalculationActionSource(
        {
          ...meta,
          key: 'result',
          operation: 'Add',
          value1: scalarFixture(1),
          value2: scalarFixture(0, 'bonus'),
        },
        'skill.SimpleCalcBBAction',
        { bonus: [2, 3] },
      ),
    ).toMatchObject({
      kind: 'blackboardCalculation',
      key: 'result',
      right: { blackboardKey: 'bonus', levelValues: [2, 3] },
    });
  });

  it('完整来源入口保留尚不能投影的 HpRatio 间接写入', () => {
    expect(
      parseBlackboardMutationActionSource(
        {
          ...meta,
          key: 'hp_ratio',
          operation: 'Assign',
          directValue: false,
          value: scalarFixture(0),
          calculationTarget: targetFixture('Owner'),
          calculateType: 'HpRatio',
        },
        'skill.ModifyDynamicBlackboard',
        {},
      ),
    ).toMatchObject({
      kind: 'blackboardMutation',
      directValue: false,
      calculationTarget: { targetSource: 'Owner' },
      calculationType: 'HpRatio',
    });
  });

  it('RandomAction 保留范围来源和输出键，不猜测上下界包含性', () => {
    expect(
      parseRandomBlackboardActionSource(
        {
          ...meta,
          randomType: 'Int',
          minValue: scalarFixture(0),
          maxValue: scalarFixture(0, 'random_max'),
          targetBlackboardKey: 'roll',
        },
        'skill.RandomAction',
        { random_max: [3, 4] },
      ),
    ).toMatchObject({
      kind: 'randomBlackboardWrite',
      randomType: 'Int',
      minimum: { value: 0 },
      maximum: { blackboardKey: 'random_max', levelValues: [3, 4] },
      targetKey: 'roll',
    });
  });

  it('StoreAttributeValue 保留属性来源、换算参数和输出黑板键', () => {
    expect(
      parseAttributeSnapshotActionSource(
        {
          ...meta,
          targetSettings: targetFixture('Source'),
          primaryAttributeType: 'Specific',
          attributeType: 'Str',
          storeAttributeType: 'FinalNonConverted',
          useFloor: false,
          divisorValue: scalarFixture(1),
          multiplierValue: scalarFixture(0.01, 'str_ratio'),
          baseValue: scalarFixture(4, 'duration'),
          key: 'duration',
        },
        'skill.StoreAttributeValue',
        { str_ratio: [0.01, 0.02], duration: [4, 5] },
      ),
    ).toMatchObject({
      kind: 'attributeSnapshot',
      target: { targetSource: 'Source' },
      primaryAttributeType: 'Specific',
      attributeType: 'Str',
      storeAttributeType: 'FinalNonConverted',
      useFloor: false,
      multiplier: { blackboardKey: 'str_ratio', levelValues: [0.01, 0.02] },
      baseValue: { blackboardKey: 'duration', levelValues: [4, 5] },
      outputKey: 'duration',
    });
  });

  it('SimpleCalcBBAction 与 Python oracle 对象级一致', () => {
    const payload = {
      value: {
        key: 'final_scale',
        operation: 'Multiply',
        value1: scalarFixture(0, 'atk_scale'),
        value2: scalarFixture(1.5),
      },
      path: 'skill.SimpleCalcBBAction',
      blackboard: { atk_scale: [1, 1.1, 1.2] },
    };
    expect(
      parseBlackboardCalculationPayloadSource(payload.value, payload.path, payload.blackboard),
    ).toEqual(runPythonOracle({ operation: 'parseBlackboardCalculation', payload }));
  });

  it('ModifyDynamicBlackboard 与 Python oracle 对象级一致', () => {
    const payload = {
      value: {
        key: 'hit_count',
        operation: 'Add',
        directValue: true,
        value: scalarFixture(1),
      },
      path: 'skill.ModifyDynamicBlackboard',
      blackboard: {},
    };
    expect(
      parseBlackboardMutationPayloadSource(payload.value, payload.path, payload.blackboard),
    ).toEqual(runPythonOracle({ operation: 'parseBlackboardMutation', payload }));
  });

  it('拒绝未取证的间接黑板写入', () => {
    expect(() =>
      parseBlackboardMutationPayloadSource(
        {
          key: 'hit_count',
          operation: 'Add',
          directValue: false,
          value: scalarFixture(1),
        },
        'skill.ModifyDynamicBlackboard',
        {},
      ),
    ).toThrow('skill.ModifyDynamicBlackboard.directValue: unsupported false');
  });
});

describe('目标组单动作解析', () => {
  const schedule = {
    startFrame: 3,
    endFrame: 8,
    actionPath: ['timelineActions[0]', '_sequenceActionData', 'actionData', '[0]'],
  } as const;

  it('MergeTargetAction 保留每个输入目标的原生身份', () => {
    const action = {
      $type: 'Example.MergeTargetAction+Data, Example',
      isEnable: true,
      priorityLevel: 'Default',
      priorityOffset: 0,
      serverActionIndex: 4,
      targetGroupKey: 'combined',
      targets: [targetFixture('Context', undefined, 'first'), targetFixture('Target')],
    };
    const root = timelineRoot(action, schedule.startFrame, schedule.endFrame);
    const payload = { root, sourceName: 'fixture.json' };
    expect(parseTargetGroupActionSource(action, 'fixture.action')).toMatchObject({
      producerType: 'MergeTargetAction',
      targetGroupKey: 'combined',
    });
    expect(
      withoutTargetGroupSourcePaths(
        parseTargetGroupWriteAction(action, 'fixture.action', schedule),
      ),
    ).toEqual(runPythonOracle({ operation: 'parseTargetGroupWrite', payload }));
  });

  it('PickTargetAction 保留直接索引或黑板索引', () => {
    const action = {
      $type: 'Example.PickTargetAction+Data, Example',
      isEnable: true,
      priorityLevel: 'Default',
      priorityOffset: 0,
      serverActionIndex: 5,
      target: targetFixture('Context', undefined, 'combined'),
      index: scalarFixture(0, 'pick_index'),
      contextKey: 'picked',
    };
    const root = timelineRoot(action, schedule.startFrame, schedule.endFrame);
    const payload = { root, sourceName: 'fixture.json' };
    expect(
      withoutTargetGroupSourcePaths(
        parseTargetGroupWriteAction(action, 'fixture.action', schedule),
      ),
    ).toEqual(runPythonOracle({ operation: 'parseTargetGroupWrite', payload }));
  });

  it('非目标组动作和禁用动作不产生写入事实', () => {
    expect(
      parseTargetGroupWriteAction(
        { $type: 'Example.DamageAction+Data, Example', isEnable: true },
        'fixture.damage',
        schedule,
      ),
    ).toBeNull();
    expect(
      parseTargetGroupWriteAction(
        { $type: 'Example.MergeTargetAction+Data, Example', isEnable: false },
        'fixture.disabled',
        schedule,
      ),
    ).toBeNull();
  });

  it.each([
    ['FindTargetAction', undefined],
    ['ContinuousFindTargetAction', 0.1],
  ] as const)('%s 保留 owner-spawned 实体及有符号 Tag 身份', (kind, interval) => {
    const action: Record<string, unknown> = {
      $type: `Example.${kind}+Data, Example`,
      isEnable: true,
      priorityLevel: 'Default',
      priorityOffset: 0,
      serverActionIndex: 7,
      targetGroupKey: 'lances',
      center: 'ActionSource',
      centerContextKey: '',
      useCenterEntityMountPoint: false,
      centerMountPoint: 'None',
      centerToGround: false,
      selectorOwner: 'ActionOwner',
      selectorOwnerContextKey: '',
      selectorData: {
        finderData: {
          $type: 'Example.Selector+OwnerSpawnedEntityFinder+Data, Example',
          spawnedObjectType: 'AbilityEntity',
        },
        validatorData: [
          {
            $type: 'Example.Selector+TagValidator+Data, Example',
            query: { queryType: 'HasAny', tags: [{ tagId: -549424863 }] },
          },
        ],
        postProcessorData: [],
      },
      selectorDirection: 'SourceForward',
      target: 'ActionSource',
      contextKey: '',
      useAdvancedDirectionSetting: false,
      advancedSelectorDirection: {},
    };
    if (interval !== undefined) action.findInterval = interval;
    const root = timelineRoot(action, schedule.startFrame, schedule.endFrame);
    const payload = { root, sourceName: 'fixture.json' };
    expect(
      withoutTargetGroupSourcePaths(
        parseTargetGroupWriteAction(action, 'fixture.action', schedule),
      ),
    ).toEqual(runPythonOracle({ operation: 'parseTargetGroupWrite', payload }));
  });

  it('HitBox、零距离验证和 PriorityFilter 事实与 Python 一致', () => {
    const action = findActionFixture({
      finderData: {
        $type: 'Example.Selector+HitBoxFinder+Data, Example',
        factionTarget: 'Enemy',
        targetObjectType: 'Character',
        checkAlive: true,
      },
      validatorData: [
        {
          $type: 'Example.Selector+DistanceValidator+Data, Example',
          compareType: 'LE',
          value: scalarFixture(8),
          clampToXZ: false,
        },
      ],
      postProcessorData: [
        {
          $type: 'Example.Selector+PriorityFilter+Data, Example',
          filterType: 'DistanceFromOwnerAsc',
          onlyReserveMaxPriorityTargets: false,
          limitMaxNum: true,
          maxNum: 1,
          buffFilterSettings: {
            buffSettings: {
              checkType: 'Id',
              buffIdList: [],
              tagQuery: { queryType: 'HasAny', tags: [] },
            },
            buffStackNumType: 'BuffCount',
          },
        },
      ],
    });
    const root = timelineRoot(action, schedule.startFrame, schedule.endFrame);
    const payload = { root, sourceName: 'fixture.json' };
    const actual = parseTargetGroupWriteAction(action, 'fixture.action', schedule);
    const oracle = runPythonOracle({ operation: 'parseTargetGroupWrite', payload }) as Record<
      string,
      unknown
    >;
    expect(
      withoutTargetGroupSourcePaths({ ...actual, priorityFilters: [], distanceValidators: [] }),
    ).toEqual(oracle);
    expect(actual?.priorityFilters).toEqual([
      {
        filterType: 'DistanceFromOwnerAsc',
        onlyReserveMaxPriorityTargets: false,
        limitMaxNum: true,
        maxNum: 1,
        buffFilter: {
          checkType: 'Id',
          buffIds: [],
          tagQuery: { queryType: 'hasAny', tagIds: [] },
          stackCountType: 'BuffCount',
        },
      },
    ]);
    expect(actual?.distanceValidators).toEqual([
      {
        threshold: { value: 8, blackboardKey: null, levelValues: null },
        compareType: 'LE',
        clampToXZ: false,
      },
    ]);
  });

  it('收集器关联同层 CheckEntityNum 的数量写回键', () => {
    const merge = {
      $type: 'Example.MergeTargetAction+Data, Example',
      isEnable: true,
      priorityLevel: 'Default',
      priorityOffset: 0,
      serverActionIndex: 4,
      targetGroupKey: 'combined',
      targets: [targetFixture('Target')],
    };
    const count = {
      $type: 'Example.CheckEntityNum+Data, Example',
      isEnable: true,
      serverActionIndex: 5,
      storeKey: 'target_count',
      checkTarget: { targetSource: 'Context', targetGroupKey: 'combined' },
    };
    const root = {
      actionGroupData: {
        timelineActions: [
          {
            _startFrame: 3,
            _endFrame: 8,
            _sequenceActionData: { actionData: [merge, count] },
          },
        ],
      },
    };
    const payload = { root, sourceName: 'fixture.json' };
    const writes = collectTargetGroupWrites(root, payload.sourceName);
    expect(withoutTargetGroupSourcePaths(writes)).toEqual(
      runPythonOracle({ operation: 'collectTargetGroupWrites', payload }),
    );
    expect(writes[0]?.sourcePath).toBe(
      'fixture.json.actionGroupData.timelineActions[0]._sequenceActionData.actionData[0]',
    );
  });
});

function withoutTargetGroupSourcePaths(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutTargetGroupSourcePaths);
  if (typeof value !== 'object' || value === null) return value;
  // Python oracle 不保留方向目标；新增字段由 skillPresentationTargets.test.ts 的原始数据单独验证。
  const {
    sourcePath: _sourcePath,
    directionTarget: _directionTarget,
    directionContextKey: _directionContextKey,
    ...rest
  } = value as Record<string, unknown>;
  return rest;
}

function timelineRoot(
  action: Record<string, unknown>,
  startFrame: number,
  endFrame: number,
): Record<string, unknown> {
  return {
    actionGroupData: {
      timelineActions: [
        {
          _startFrame: startFrame,
          _endFrame: endFrame,
          _sequenceActionData: { actionData: [action] },
        },
      ],
    },
  };
}

function findActionFixture(selectorData: Record<string, unknown>): Record<string, unknown> {
  return {
    $type: 'Example.FindTargetAction+Data, Example',
    isEnable: true,
    priorityLevel: 'Default',
    priorityOffset: 0,
    serverActionIndex: 7,
    targetGroupKey: 'targets',
    center: 'ActionSource',
    centerContextKey: '',
    useCenterEntityMountPoint: false,
    centerMountPoint: 'None',
    centerToGround: false,
    selectorOwner: 'ActionOwner',
    selectorOwnerContextKey: '',
    selectorData,
    selectorDirection: 'SourceForward',
    target: 'ActionSource',
    contextKey: '',
    useAdvancedDirectionSetting: false,
    advancedSelectorDirection: {},
  };
}
