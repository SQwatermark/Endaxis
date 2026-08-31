import { describe, expect, it } from 'vitest';
import type { BuffTimelineSegment } from './buffTimelineViz';
import { projectCombatStatusIndicators } from './combatStatusIndicators';

const segment: BuffTimelineSegment = {
  targetId: 'operator:1',
  buffId: 'buff:progress',
  instanceId: 7,
  startFrame: 10,
  endFrame: 40,
  layers: 3,
  placement: 'upper',
  nameKey: 'effects.name.progress',
  iconPath: '/icons/progress.webp',
  showInSquadIcon: true,
  onlyShowForMainCharacter: true,
  showProgressInNormalSkillButton: true,
  useWeakProgressInNormalSkillButton: true,
  showWarningBackground: true,
  iconStyleInSquad: 'LifeTime',
  abnormalColorType: 'Fire',
  orderUseDirectoryValue: false,
  orderPriorityValue: 12,
  orderPriorityCategory: 'CommonCharBuff',
};

describe('projectCombatStatusIndicators', () => {
  it('按原生显示标志生成多个 HUD 去向，不按 Buff ID 猜测', () => {
    expect(projectCombatStatusIndicators([segment], 20)).toEqual([
      {
        targetId: 'operator:1',
        buffId: 'buff:progress',
        instanceId: 7,
        layers: 3,
        startFrame: 10,
        endFrame: 40,
        slots: ['squadIcon', 'normalSkillProgress'],
        onlyForControlledOperator: true,
        nameKey: 'effects.name.progress',
        iconPath: '/icons/progress.webp',
        iconStyle: 'LifeTime',
        abnormalColorType: 'Fire',
        showWarningBackground: true,
        useWeakNormalSkillProgress: true,
        order: {
          useDirectoryValue: false,
          value: 12,
          category: 'CommonCharBuff',
        },
      },
    ]);
  });

  it('只返回光标帧内且具有原生 HUD 去向的状态', () => {
    expect(projectCombatStatusIndicators([segment], 9)).toEqual([]);
    expect(projectCombatStatusIndicators([segment], 40)).toEqual([]);
    expect(
      projectCombatStatusIndicators(
        [{ ...segment, showInSquadIcon: false, showProgressInNormalSkillButton: false }],
        20,
      ),
    ).toEqual([]);
  });
});
