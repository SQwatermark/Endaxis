import { describe, expect, it } from 'vitest';

import { parseDamageUnitSource } from '../src/index.ts';
import { scalarFixture } from './sourceFixtures.ts';

const BASE_UNIT = {
  damageType: 'Physical',
  damageAttributeType: 'Hp',
  simpleCalculation: true,
  atkScale: scalarFixture(0, 'atk_scale'),
  takeAtkSnapshot: false,
  damageDecorateMask: 0,
  controlEffectRoll: true,
  onlyEnableForMainChar: false,
  damageProcessors: [],
  ignoreDamageImmuneLevel: 'None',
  ignorePoiseImmune: false,
  reduceDamageForGuard: true,
  reduceDamageForGuardRatio: 0.2,
  gainCost: false,
  costDataList: [],
  playDefaultHitEffect: true,
  playHitEffect: true,
  effectData: {},
  playHitSound: true,
  hitSoundData: {},
  playHitFlashEffect: true,
  hideMainCharHpScreenEffect: false,
  hidePoiseUIEffect: false,
  enablePoiseBreakTimeDilation: true,
  damageVisualImportance: 'Level0',
  enableDamageVisualCoalition: false,
  damageVisualCoalitionGroupKey: '',
  alwaysStartNewCoalition: false,
  alwaysEndCoalition: false,
  updatePositionOnCoalition: false,
} as const;

describe('伤害动作公共载荷', () => {
  it('简单计算保留失效公式存在性，但不读取其残留黑板值', () => {
    const source = parseDamageUnitSource(
      {
        ...BASE_UNIT,
        atkCalculation: {
          $type: 'Example.MultiplyAttributeCalculation, Example',
          valueSource: 'AttackerOrHealer',
          attributeType: 'Atk',
          multiplier: {
            useBlackboardKey: true,
            value: 1,
            blackboardKey: '',
          },
          addition: scalarFixture(0),
        },
      },
      'fixture.damageUnit',
      { atk_scale: [0.9] },
    );
    expect(source).toMatchObject({
      simpleCalculation: true,
      attackScale: { blackboardKey: 'atk_scale', levelValues: [0.9] },
      serializedAttackCalculationPresent: true,
      attackCalculation: null,
    });
  });

  it('非简单计算复用公共公式并保留处理器与资源载荷', () => {
    const source = parseDamageUnitSource(
      {
        ...BASE_UNIT,
        simpleCalculation: false,
        atkCalculation: {
          $type: 'Example.BreakingAttackCalculation, Example',
          atkScale: scalarFixture(1),
          multiplier: scalarFixture(0, 'break_scale'),
        },
        damageProcessors: [
          {
            $type: 'Example.DamageScaleProcessor, Example',
            side: 'Attacker',
            zoneName: 'NormalCalcZone',
            addition: scalarFixture(0, 'damage_up'),
          },
        ],
        costDataList: [{ costType: 'UltimateSp', costValue: 0.5, atbValueThreshold: 0 }],
      },
      'fixture.damageUnit',
      { break_scale: [0.5], damage_up: [0.2] },
    );
    expect(source).toMatchObject({
      attackCalculation: {
        kind: 'breakingAttack',
        multiplier: { blackboardKey: 'break_scale', levelValues: [0.5] },
      },
      processors: [
        {
          kind: 'damageScale',
          addition: { blackboardKey: 'damage_up', levelValues: [0.2] },
        },
      ],
      costs: [{ costType: 'UltimateSp', costValue: 0.5 }],
    });
  });
});
