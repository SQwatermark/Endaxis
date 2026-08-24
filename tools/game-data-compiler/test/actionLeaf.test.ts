import { describe, expect, it } from 'vitest';

import {
  parseKnownNativeActionLeafSource,
  parseKnownNativeActionSequenceSource,
} from '../src/index.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

const META = {
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
} as const;

describe('公共 Action 叶子分派', () => {
  it('控制流和叶子使用同一入口，不由领域适配器再次解释类型', () => {
    const parsed = parseKnownNativeActionSequenceSource(
      sequence([
        {
          ...META,
          $type: 'Example.IfElseAction+IfElseActionData, Example',
          conditionAction: sequence([
            {
              ...META,
              $type: 'Example.CompareFloat+Data, Example',
              compare: 'Greater',
              valueA: scalarFixture(0, 'talent'),
              valueB: scalarFixture(0.5),
            },
          ]),
          succeedActions: sequence([
            {
              ...META,
              serverActionIndex: 2,
              $type: 'Example.CastSkill+Data, Example',
              caster: targetFixture('Owner'),
              target: targetFixture('Target'),
              skillId: { value: 'fixture_child', useBlackboardKey: false, blackboardKey: '' },
              skipApplyCost: true,
              inheritSourceSkillCastId: true,
            },
          ]),
          failActions: sequence([]),
          alwaysNext: true,
        },
      ]),
      'fixture.sequence',
      { talent: [0, 1] },
    );
    expect(parsed.actions[0]?.body).toMatchObject({
      kind: 'ifElse',
      condition: {
        actions: [
          {
            body: {
              kind: 'leaf',
              value: {
                family: 'condition',
                action: { kind: 'floatCompare', left: { levelValues: [0, 1] } },
              },
            },
          },
        ],
      },
      whenTrue: {
        actions: [
          {
            body: {
              value: { family: 'skillCast', action: { skillId: { value: 'fixture_child' } } },
            },
          },
        ],
      },
    });
  });

  it('未迁移动作携带路径明确阻塞', () => {
    expect(() =>
      parseKnownNativeActionLeafSource(
        { ...META, $type: 'Example.UnknownCombatAction+Data, Example' },
        'fixture.unknown',
        {},
      ),
    ).toThrow('fixture.unknown.$type: unsupported native action "UnknownCombatAction"');
  });
});

function sequence(actionData: unknown[]): Record<string, unknown> {
  return {
    actionData,
    onlyExecuteWhenSourceIsMainChar: false,
    onlyExecuteWhenSourceIsGuard: false,
  };
}
