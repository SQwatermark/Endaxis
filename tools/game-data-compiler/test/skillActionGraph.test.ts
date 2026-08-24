import { describe, expect, it } from 'vitest';

import { nativeActionName, parseSkillActionGroupSource } from '../src/index.ts';

const META = {
  $type: 'Example.PresentationAction+Data, Example',
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
} as const;

describe('SkillData 动作图切片', () => {
  it('保留时间轴区间、强制动画同步和多个被动事件序列', () => {
    const parsed = parseSkillActionGroupSource(
      {
        timelineActions: [
          {
            _startFrame: 3,
            _endFrame: 8,
            _sequenceActionData: sequence([META]),
            forceSyncAnimData: {
              forceSync: true,
              montageName: 'NormalSkill',
              targetFrame: 6,
              playbackSpeed: 1.25,
            },
          },
        ],
        passiveEventActions: [
          {
            abilityEvent: 'OnTakeDamage',
            actions: [sequence([META]), sequence([])],
          },
        ],
      },
      'fixture.actionGroupData',
      {},
      value => nativeActionName((value as { $type: string }).$type),
    );
    expect(parsed).toMatchObject({
      timelineActions: [
        {
          startFrame: 3,
          endFrame: 8,
          forceSyncAnimation: {
            forceSync: true,
            montageName: 'NormalSkill',
            targetFrame: 6,
            playbackSpeed: 1.25,
          },
          sequence: { actions: [{ body: { value: 'PresentationAction' } }] },
        },
      ],
      passiveEvents: [
        { abilityEvent: 'OnTakeDamage', actions: [{ actions: [{}] }, { actions: [] }] },
      ],
    });
  });
});

function sequence(actionData: unknown[]): Record<string, unknown> {
  return {
    actionData,
    onlyExecuteWhenSourceIsMainChar: false,
    onlyExecuteWhenSourceIsGuard: false,
  };
}
