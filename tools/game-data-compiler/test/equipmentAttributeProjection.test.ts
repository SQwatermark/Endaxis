import { describe, expect, it } from 'vitest';

import {
  projectEquipmentAttributeModifier,
  type AttributeModifierSlotSource,
  type AttributeTypeSource,
  type CompiledAttributeModifierTargetSource,
} from '../src/index.ts';

describe('单件装备属性投影', () => {
  it.each([
    ['specific', 'Str', 'baseAddition', 'attribute', 'strength', 'flat'],
    ['specific', 'Agi', 'baseAddition', 'attribute', 'agility', 'flat'],
    ['specific', 'Wisd', 'baseAddition', 'attribute', 'intellect', 'flat'],
    ['specific', 'Will', 'baseAddition', 'attribute', 'will', 'flat'],
    ['main', 'Level', 'baseMultiplier', 'attribute', 'main', 'percent'],
    ['sub', 'Level', 'baseMultiplier', 'attribute', 'secondary', 'percent'],
    ['specific', 'Def', 'baseAddition', 'panelStat', 'baseDefense', undefined],
    ['specific', 'Atk', 'baseMultiplier', 'panelStat', 'attackPercent', undefined],
    ['specific', 'Atk', 'baseFinalAddition', 'panelStat', 'attackFlat', undefined],
    ['specific', 'MaxHp', 'baseMultiplier', 'panelStat', 'healthPercent', undefined],
    ['specific', 'MaxHp', 'baseFinalAddition', 'panelStat', 'healthFlat', undefined],
    ['specific', 'CriticalRate', 'baseAddition', 'panelStat', 'criticalRate', undefined],
    [
      'specific',
      'PhysicalAndSpellInflictionEnhance',
      'baseAddition',
      'panelStat',
      'artsIntensity',
      undefined,
    ],
    [
      'specific',
      'UltimateSpGainScalar',
      'baseAddition',
      'panelStat',
      'ultimateEnergyGainEfficiency',
      undefined,
    ],
  ] as const)('maps %s/%s/%s', (target, attribute, slot, kind, semanticTarget, operation) => {
    expect(projectEquipmentAttributeModifier(fixture(target, attribute, slot))).toMatchObject({
      status: 'supported',
      modifier: {
        kind,
        ...(kind === 'attribute' ? { attribute: semanticTarget, operation } : {}),
        ...(kind === 'panelStat' ? { stat: semanticTarget } : {}),
        value: 0.25,
      },
    });
  });

  it.each([
    ['NormalAttackDamageIncrease', 'normalAttack'],
    ['NormalSkillDamageIncrease', 'battleSkill'],
    ['ComboSkillDamageIncrease', 'comboSkill'],
    ['UltimateSkillDamageIncrease', 'ultimate'],
    ['PhysicalDamageIncrease', 'physical'],
    ['FireDamageIncrease', 'heat'],
    ['PulseDamageIncrease', 'electric'],
    ['CrystDamageIncrease', 'cryo'],
    ['NaturalDamageIncrease', 'nature'],
    ['DamageToBrokenUnitIncrease', 'staggeredEnemy'],
  ] as const)('maps %s to damage scale %s', (attribute, target) => {
    expect(
      projectEquipmentAttributeModifier(fixture('specific', attribute, 'baseAddition')),
    ).toMatchObject({
      status: 'supported',
      modifier: { kind: 'damageScale', target, value: 0.25 },
    });
  });

  it('maps healing and keeps player damage-taken modifiers as scenario omissions', () => {
    expect(
      projectEquipmentAttributeModifier(fixture('specific', 'HealOutputIncrease', 'baseAddition')),
    ).toMatchObject({
      status: 'supported',
      modifier: { kind: 'staticHealingIncrease', target: 'output', value: 0.25 },
    });
    expect(
      projectEquipmentAttributeModifier(
        fixture('specific', 'FireDamageTakenScalar', 'baseFinalMultiplier'),
      ),
    ).toMatchObject({
      status: 'scenario-omitted',
      reason: 'playerDamageTakenRequiresEnemyActiveDamage',
    });
  });

  it('does not reuse a mapping when the native target or formula slot changes', () => {
    expect(
      projectEquipmentAttributeModifier(fixture('specific', 'Atk', 'baseAddition')),
    ).toMatchObject({ status: 'blocked' });
    expect(projectEquipmentAttributeModifier(fixture('main', 'Str', 'baseAddition'))).toMatchObject(
      { status: 'blocked' },
    );
    expect(
      projectEquipmentAttributeModifier(
        fixture('specific', 'PhysicalDamageTakenScalar', 'baseAddition'),
      ),
    ).toMatchObject({ status: 'blocked' });
  });
});

function fixture(
  target: CompiledAttributeModifierTargetSource,
  declaredAttributeType: AttributeTypeSource,
  slot: AttributeModifierSlotSource,
) {
  return {
    sourcePath: 'EquipTable.fixture.equipAttrModifiers[0]',
    target,
    declaredAttributeType,
    slot,
    value: 0.25,
  };
}
