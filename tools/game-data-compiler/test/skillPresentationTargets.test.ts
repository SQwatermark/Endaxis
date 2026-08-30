import { describe, expect, it } from 'vitest';
import fixture from './fixtures/avywenna-entity-child-skills.json';
import { parseKnownSkillActionGraphSource } from '../src/source/skillActionGraph.ts';
import { parseTargetReferenceSource } from '../src/source/target.ts';
import {
  collectPresentationOnlyBlackboardKeys,
  collectPresentationOnlyTargetGroups,
  collectUnconsumedTargetGroups,
  collectCombatInvisibleRandomBlackboardKeys,
  isPresentationOnlyActionSequence,
} from '../src/compiler/skillPresentationTargets.ts';
import { targetFixture } from './sourceFixtures.ts';

function graph() {
  const sample = fixture.sources[0]!;
  return parseKnownSkillActionGraphSource(sample.value, sample.file, {});
}

describe('整张 SkillData 的表现目标依赖', () => {
  it('只用于选择镜头的条件树可整体省略，任一战斗分支都会保留', () => {
    const leaf = (family: string, kind: string) => ({
      sourcePath: `fixture.${kind}`,
      metadata: { nativeName: kind, enabled: true },
      body: { kind: 'leaf', value: { family, action: { kind } } },
    });
    const sequence = {
      sourcePath: 'fixture.sequence',
      guard: null,
      actions: [
        {
          sourcePath: 'fixture.ifElse',
          metadata: { nativeName: 'IfElseAction', enabled: true },
          body: {
            kind: 'ifElse',
            condition: {
              actions: [
                leaf('condition', 'mainOperator'),
                leaf('condition', 'floatCompare'),
                leaf('condition', 'objectTypeMatch'),
                leaf('condition', 'superArmor'),
              ],
            },
            whenTrue: { actions: [leaf('spatial', 'customRootMotion')] },
            whenFalse: {
              actions: [
                {
                  sourcePath: 'fixture.nested',
                  metadata: { nativeName: 'IfElseAction', enabled: true },
                  body: {
                    kind: 'ifElse',
                    condition: { actions: [leaf('condition', 'distance')] },
                    whenTrue: { actions: [leaf('presentation', 'cameraControl')] },
                    whenFalse: { actions: [leaf('presentation', 'cameraControl')] },
                  },
                },
              ],
            },
          },
        },
      ],
    } as unknown as Parameters<typeof isPresentationOnlyActionSequence>[0];
    expect(isPresentationOnlyActionSequence(sequence)).toBe(true);
    const branch = sequence.actions[0]!;
    if (branch.body.kind !== 'ifElse') throw new Error('fixture');
    const combat = {
      ...sequence,
      actions: [
        {
          ...branch,
          body: {
            ...branch.body,
            whenFalse: {
              ...branch.body.whenFalse,
              actions: [leaf('resource', 'modifySkillPoint')],
            },
          },
        },
      ],
    } as unknown as Parameters<typeof isPresentationOnlyActionSequence>[0];
    expect(isPresentationOnlyActionSequence(combat)).toBe(false);
  });

  it('只写入镜头控制树的动作黑板键可跨时间线整体删除', () => {
    const leaf = (family: string, kind: string, action: Record<string, unknown> = { kind }) => ({
      sourcePath: `fixture.${kind}`,
      metadata: { nativeName: kind, enabled: true },
      body: { kind: 'leaf', value: { family, action } },
    });
    const branch = (condition: unknown, action: unknown) => ({
      sourcePath: 'fixture.ifElse',
      metadata: { nativeName: 'IfElseAction', enabled: true },
      body: {
        kind: 'ifElse',
        condition: { actions: [condition] },
        whenTrue: { actions: [] },
        whenFalse: { actions: [action] },
      },
    });
    const write = leaf('blackboardMutation', 'blackboardMutation', {
      kind: 'blackboardMutation',
      key: 'isWall',
    });
    const cameraCalculation = leaf('blackboardCalculation', 'blackboardCalculation', {
      kind: 'blackboardCalculation',
      key: 'cameraAngle',
      left: { kind: 'blackboard', key: 'cameraAngle' },
      right: { kind: 'constant', value: 165 },
    });
    const cameraCondition = leaf('condition', 'skillCameraMotionFree');
    const compare = leaf('condition', 'floatCompare', {
      kind: 'floatCompare',
      left: { blackboardKey: 'isWall' },
    });
    const timelines = [
      { sequence: { actions: [branch(cameraCondition, write)] } },
      {
        sequence: {
          actions: [branch(compare, leaf('presentation', 'animatedCamera'))],
        },
      },
      {
        sequence: {
          actions: [branch(cameraCondition, cameraCalculation)],
        },
      },
    ];
    const source = {
      actionGroup: { timelineActions: timelines },
    } as unknown as Parameters<typeof collectPresentationOnlyBlackboardKeys>[0];
    const keys = collectPresentationOnlyBlackboardKeys(source);
    expect([...keys]).toEqual(['isWall', 'cameraAngle']);
    expect(
      timelines.every(item => isPresentationOnlyActionSequence(item.sequence as never, keys)),
    ).toBe(true);

    const combatSource = {
      actionGroup: {
        timelineActions: [
          ...timelines,
          { sequence: { actions: [leaf('resource', 'modifySkillPoint', { key: 'isWall' })] } },
        ],
      },
    } as unknown as Parameters<typeof collectPresentationOnlyBlackboardKeys>[0];
    expect([...collectPresentationOnlyBlackboardKeys(combatSource)]).toEqual(['cameraAngle']);
  });

  it('随机黑板值只有全部消费者均为 PointFinder 空间槽时才可省略', () => {
    const leaf = (family: string, action: Record<string, unknown>) => ({
      sourcePath: `fixture.${family}`,
      metadata: { nativeName: family, enabled: true },
      body: { kind: 'leaf', value: { family, action } },
    });
    const random = leaf('randomBlackboard', {
      kind: 'randomBlackboardWrite',
      targetKey: 'pull_offset',
      minimum: { value: 0.8, blackboardKey: null },
      maximum: { value: 1.5, blackboardKey: null },
    });
    const point = leaf('targetGroup', {
      producerType: 'FindTargetAction',
      finderType: 'PointFinder',
      finderPointBlackboardKeys: ['pull_offset'],
      targetGroupKey: 'position',
    });
    const source = {
      actionGroup: { timelineActions: [{ sequence: { actions: [random, point] } }] },
    } as unknown as Parameters<typeof collectCombatInvisibleRandomBlackboardKeys>[0];
    expect([...collectCombatInvisibleRandomBlackboardKeys(source)]).toEqual(['pull_offset']);

    const presentationOnly = {
      actionGroup: { timelineActions: [{ sequence: { actions: [random] } }] },
    } as unknown as Parameters<typeof collectCombatInvisibleRandomBlackboardKeys>[0];
    expect([...collectCombatInvisibleRandomBlackboardKeys(presentationOnly)]).toEqual([
      'pull_offset',
    ]);

    const nested = {
      actionGroup: {
        timelineActions: [
          {
            sequence: {
              actions: [
                {
                  sourcePath: 'fixture.ifElse',
                  metadata: { nativeName: 'IfElseAction', enabled: true },
                  body: {
                    kind: 'ifElse',
                    condition: { actions: [] },
                    whenTrue: { actions: [random, point] },
                    whenFalse: { actions: [] },
                  },
                },
              ],
            },
          },
        ],
      },
    } as unknown as Parameters<typeof collectCombatInvisibleRandomBlackboardKeys>[0];
    expect([...collectCombatInvisibleRandomBlackboardKeys(nested)]).toEqual(['pull_offset']);

    const combatConsumer = leaf('damage', {
      attackScale: { kind: 'blackboard', key: 'pull_offset' },
    });
    const unsafe = {
      actionGroup: {
        timelineActions: [{ sequence: { actions: [random, point, combatConsumer] } }],
      },
    } as unknown as Parameters<typeof collectCombatInvisibleRandomBlackboardKeys>[0];
    expect([...collectCombatInvisibleRandomBlackboardKeys(unsafe)]).toEqual([]);
  });

  it('跨序列特效读取与方向查询均保留来源信息，两个纯表现目标可省略', () => {
    const source = graph();
    const fixedPoint = source.actionGroup.timelineActions[0]!.sequence.actions[1]!;
    expect(fixedPoint.body).toMatchObject({
      kind: 'leaf',
      value: {
        action: {
          directionTarget: 'ContextTarget',
          directionContextKey: 'avywen',
        },
      },
    });
    expect([...collectPresentationOnlyTargetGroups(source)].sort()).toEqual([
      'avywen',
      'lance_back_pos',
    ]);
  });

  it('SnapPoint 输出只被空间动作读取时可省略，同帧伤害不影响叶级证明', () => {
    const leaf = (family: string, action: Record<string, unknown>) => ({
      sourcePath: `fixture.${family}`,
      metadata: { nativeName: family, enabled: true },
      body: { kind: 'leaf', value: { family, action } },
    });
    const snap = leaf('targetGroup', {
      producerType: 'FindTargetAction',
      finderType: 'SnapPointFinder',
      targetGroupKey: 'pos',
      validatorTypes: [],
      postProcessorTypes: [],
    });
    const move = leaf('spatial', {
      kind: 'moveTo',
      target: { targetSource: 'Context', targetGroupKey: 'pos' },
    });
    const pull = leaf('stumpControl', {
      kind: 'pull',
      destination: { targetSource: 'Context', targetGroupKey: 'pos' },
    });
    const damage = leaf('damage', { kind: 'simpleDamage', attackScale: 1 });
    const source = {
      actionGroup: {
        timelineActions: [{ sequence: { actions: [damage, snap, move, pull] } }],
      },
    } as unknown as Parameters<typeof collectPresentationOnlyTargetGroups>[0];
    expect([...collectPresentationOnlyTargetGroups(source)]).toContain('pos');

    const unsafe = {
      actionGroup: {
        timelineActions: [
          {
            sequence: {
              actions: [
                snap,
                leaf('damage', {
                  kind: 'simpleDamage',
                  target: { targetSource: 'Context', targetGroupKey: 'pos' },
                }),
              ],
            },
          },
        ],
      },
    } as unknown as Parameters<typeof collectPresentationOnlyTargetGroups>[0];
    expect([...collectPresentationOnlyTargetGroups(unsafe)]).not.toContain('pos');
  });

  it('ConvertToTargetContext 的纯转向与相机链可省略，进入伤害时保留', () => {
    const leaf = (family: string, action: Record<string, unknown>) => ({
      sourcePath: `fixture.${family}`,
      metadata: { nativeName: family, enabled: true },
      body: { kind: 'leaf', value: { family, action } },
    });
    const attacker = leaf('targetGroup', {
      producerType: 'ConvertToTargetContext',
      conversionOperation: 'None',
      targetGroupKey: 'Attacker',
      inputTargets: [{ targetSource: 'Target', targetGroupKey: '' }],
    });
    const hitTarget = leaf('targetGroup', {
      producerType: 'ConvertToTargetContext',
      conversionOperation: 'None',
      targetGroupKey: 'HitTar',
      inputTargets: [{ targetSource: 'Context', targetGroupKey: 'Attacker' }],
    });
    const angle = leaf('condition', {
      kind: 'targetAngle',
      origin: { targetSource: 'Context', targetGroupKey: 'Attacker' },
    });
    const move = leaf('spatial', {
      kind: 'moveTo',
      target: { targetSource: 'Context', targetGroupKey: 'HitTar' },
    });
    const source = {
      actionGroup: {
        timelineActions: [{ sequence: { actions: [attacker, angle, hitTarget, move] } }],
      },
    } as unknown as Parameters<typeof collectPresentationOnlyTargetGroups>[0];
    expect([...collectPresentationOnlyTargetGroups(source)].sort()).toEqual(['Attacker', 'HitTar']);
    const nested = {
      actionGroup: {
        timelineActions: [
          {
            sequence: {
              actions: [
                leaf('eventListener', {
                  kind: 'eventListener',
                  events: [
                    {
                      abilityEvent: 'OnBeforeTakeDamage',
                      actions: [{ actions: [attacker, angle, hitTarget, move] }],
                    },
                  ],
                }),
              ],
            },
          },
        ],
      },
    } as unknown as Parameters<typeof collectPresentationOnlyTargetGroups>[0];
    expect([...collectPresentationOnlyTargetGroups(nested)].sort()).toEqual(['Attacker', 'HitTar']);

    const unsafe = {
      actionGroup: {
        timelineActions: [
          {
            sequence: {
              actions: [
                attacker,
                leaf('damage', {
                  kind: 'simpleDamage',
                  target: { targetSource: 'Context', targetGroupKey: 'Attacker' },
                }),
              ],
            },
          },
        ],
      },
    } as unknown as Parameters<typeof collectPresentationOnlyTargetGroups>[0];
    expect([...collectPresentationOnlyTargetGroups(unsafe)]).not.toContain('Attacker');
  });

  it('下游组被循环读取时，沿方向依赖向上收缩，不会误删上游来源查询', () => {
    const source = graph();
    const timeline = source.actionGroup.timelineActions[0]!;
    const node = timeline.sequence.actions[0]!;
    const target = parseTargetReferenceSource(
      targetFixture('Context', undefined, 'lance_back_pos'),
      'fixture.target',
    );
    const modified = {
      ...source,
      actionGroup: {
        ...source.actionGroup,
        timelineActions: [
          ...source.actionGroup.timelineActions,
          {
            ...timeline,
            sequence: {
              ...timeline.sequence,
              actions: [
                {
                  ...node,
                  body: {
                    kind: 'forEach' as const,
                    target,
                    action: { ...timeline.sequence, actions: [] },
                  },
                },
              ],
            },
          },
        ],
      },
    };
    expect([...collectPresentationOnlyTargetGroups(modified)]).toEqual([]);
  });

  it('同名组有另一种查询写入时，不能借安全写入者名义省略它', () => {
    const source = graph();
    const timeline = source.actionGroup.timelineActions[0]!;
    const node = timeline.sequence.actions[1]!;
    if (node.body.kind !== 'leaf' || node.body.value.family !== 'targetGroup')
      throw new Error('fixture');
    const unsafe = {
      ...node,
      body: {
        ...node.body,
        value: {
          ...node.body.value,
          action: {
            ...node.body.value.action,
            finderType: 'MainTargetFinder',
          },
        },
      },
    };
    const modified = {
      ...source,
      actionGroup: {
        ...source.actionGroup,
        timelineActions: [
          ...source.actionGroup.timelineActions,
          { ...timeline, sequence: { ...timeline.sequence, actions: [unsafe] } },
        ],
      },
    };
    expect([...collectPresentationOnlyTargetGroups(modified)]).toEqual([]);
  });

  it('查询后有战斗动作时，即使没有直接读取组名也不删除查询的短路作用', () => {
    const source = graph();
    const timeline = source.actionGroup.timelineActions[0]!;
    const finish = source.actionGroup.timelineActions
      .flatMap(item => item.sequence.actions)
      .find(node => node.body.kind === 'leaf' && node.body.value.family === 'lifecycle')!;
    const modified = {
      ...source,
      actionGroup: {
        ...source.actionGroup,
        timelineActions: [
          {
            ...timeline,
            sequence: { ...timeline.sequence, actions: [...timeline.sequence.actions, finish] },
          },
          ...source.actionGroup.timelineActions.slice(1),
        ],
      },
    };
    expect([...collectPresentationOnlyTargetGroups(modified)]).toEqual([]);
  });

  it('单独记录从未被读取的目标组，不把同序列其他战斗动作误判为消费者', () => {
    const write = {
      sourcePath: 'fixture.find',
      metadata: { nativeName: 'FindTargetAction', enabled: true },
      body: {
        kind: 'leaf',
        value: {
          family: 'targetGroup',
          action: { producerType: 'FindTargetAction', targetGroupKey: 'unused' },
        },
      },
    };
    const damage = {
      sourcePath: 'fixture.damage',
      metadata: { nativeName: 'DamageAction', enabled: true },
      body: { kind: 'leaf', value: { family: 'damage', action: { kind: 'damage' } } },
    };
    const source = {
      actionGroup: { timelineActions: [{ sequence: { actions: [write, damage] } }] },
    } as unknown as Parameters<typeof collectUnconsumedTargetGroups>[0];
    expect([...collectUnconsumedTargetGroups(source)]).toEqual(['unused']);

    const consumer = {
      ...damage,
      body: {
        ...damage.body,
        value: {
          ...damage.body.value,
          action: { targetSource: 'Context', targetGroupKey: 'unused' },
        },
      },
    };
    const consumed = {
      actionGroup: { timelineActions: [{ sequence: { actions: [write, consumer] } }] },
    } as unknown as Parameters<typeof collectUnconsumedTargetGroups>[0];
    expect([...collectUnconsumedTargetGroups(consumed)]).toEqual([]);
  });
});
