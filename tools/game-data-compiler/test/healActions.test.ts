import { describe, expect, it } from 'vitest';

import { parseHealActionSource } from '../src/index.ts';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';

const BASE = {
  $type: 'Example.HealAction+Data, Example',
  isEnable: true,
  priorityLevel: 'Default',
  priorityOffset: 0,
  serverActionIndex: 1,
  alwaysNext: true,
  healType: 'Normal',
  healer: 'ActionOwner',
  contextKey: '',
  target: targetFixture('Target'),
  showHealText: true,
  playHealEffect: true,
  effectData: { effectName: 'P_common_heal_01_start' },
  onlyPlayEffectOnActualHeal: false,
  useHealTags: true,
  healTags: { predefinedTag: [{ tagId: -1480463572 }] },
} as const;

describe('治疗动作公共载荷', () => {
  it('属性计算不限制原生 valueSource 和 healer 枚举', () => {
    const source = parseHealActionSource(
      {
        ...BASE,
        healCalculation: {
          $type: 'Example.MultiplyAttributeCalculation, Example',
          valueSource: 'Target',
          attributeType: 'MaxHp',
          multiplier: scalarFixture(0, 'heal_ratio'),
          addition: scalarFixture(5),
        },
      },
      'fixture.heal',
      { heal_ratio: [0.1, 0.2] },
    );
    expect(source).toMatchObject({
      kind: 'heal',
      healer: 'ActionOwner',
      calculation: {
        kind: 'attribute',
        valueSource: 'Target',
        attributeType: 'MaxHp',
        multiplier: { blackboardKey: 'heal_ratio', levelValues: [0.1, 0.2] },
      },
      useHealTags: true,
      healTagIds: [-1480463572],
      effectName: 'P_common_heal_01_start',
    });
  });

  it('定值计算保留缩放开关及缩放来源', () => {
    expect(
      parseHealActionSource(
        {
          ...BASE,
          useHealTags: false,
          healTags: { predefinedTag: [] },
          healCalculation: {
            $type: 'Example.DefiniteValueCalculation, Example',
            value: scalarFixture(100),
            applyScale: true,
            valueScale: scalarFixture(0, 'heal_scale'),
          },
        },
        'fixture.heal',
        { heal_scale: [1, 1.5] },
      ),
    ).toMatchObject({
      calculation: {
        kind: 'definite',
        value: { value: 100 },
        applyScale: true,
        valueScale: { blackboardKey: 'heal_scale', levelValues: [1, 1.5] },
      },
    });
  });
});
