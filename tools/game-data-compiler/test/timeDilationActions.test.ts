import { describe, expect, it } from 'vitest';
import { parseTimeDilationActionSource, parseUltimateTimeActionSource } from '../src/index.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

const META = {
  $type: 'Beyond.Gameplay.Core.TimeDilationAction+Data, Gameplay.Beyond',
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
};
const curve = [
  { time: 0, value: 0.1, inTangent: 0, outTangent: 1, weightedMode: 0, inWeight: 0, outWeight: 1 },
];

describe('时间膨胀动作来源', () => {
  it('保留普通动作的标签、曲线选择、目标和冷却影响窗口', () => {
    const parsed = parseTimeDilationActionSource(
      {
        ...META,
        layer: 'Global',
        slot: { tagId: -1 },
        timeDilationPriority: { tagId: 2 },
        duration: scalarFixture(0.8, 'duration'),
        useCurveKey: true,
        curveKey: 'ComboSkill',
        timeScaleCurve: curve,
        finishByAction: false,
        ignoreTargets: [targetFixture('SkillOwner')],
        effectTargets: [],
        useTimeScaleForSkillCdTick: true,
        influenceSkillCdTime: scalarFixture(0.4),
      },
      'fixture',
      { duration: [0.8, 1] },
    );
    expect(parsed).toMatchObject({
      kind: 'timeDilation',
      layer: 'Global',
      slotTagId: -1,
      priorityTagId: 2,
      duration: { blackboardKey: 'duration', levelValues: [0.8, 1] },
      useCurveKey: true,
      curveKey: 'ComboSkill',
      inlineCurveKeys: [{ outWeight: 1 }],
      ignoreTargets: [{ targetSource: 'SkillOwner' }],
      useTimeScaleForSkillCooldownTick: true,
    });
  });

  it('保留终结技恒定缩放，并严格拒绝未知普通层级', () => {
    const parsed = parseUltimateTimeActionSource(
      {
        ...META,
        $type: 'Beyond.Gameplay.Core.UltimateTimeAction+Data, Gameplay.Beyond',
        timeScale: 0.2,
        timeDilationPriority: { tagId: -3 },
        ignoreTargets: [],
      },
      'fixture',
    );
    expect(parsed).toEqual({
      kind: 'ultimateTimeDilation',
      timeScale: 0.2,
      priorityTagId: -3,
      ignoreTargets: [],
    });
    expect(() => parseTimeDilationActionSource({ ...META, layer: 'World' }, 'fixture', {})).toThrow(
      /unexpected fields|unsupported value/,
    );
  });
});
