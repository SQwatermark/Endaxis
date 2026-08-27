import { describe, expect, it } from 'vitest';
import fixture from './fixtures/avywenna-entity-child-skills.json';
import { parseKnownSkillActionGraphSource } from '../src/source/skillActionGraph.ts';
import { parseTargetReferenceSource } from '../src/source/target.ts';
import {
  collectPresentationOnlyTargetGroups,
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
              actions: [leaf('condition', 'mainOperator'), leaf('condition', 'floatCompare')],
            },
            whenTrue: { actions: [leaf('presentation', 'cameraControl')] },
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
});
