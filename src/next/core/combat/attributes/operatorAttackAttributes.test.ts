import { describe, expect, it } from 'vitest';
import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
  attributeModifierValues,
} from './combatAttributes';
import {
  createOperatorAttackAttributes,
  resolveOperatorAttack,
  type OperatorAttackDerivationInput,
} from './operatorAttackAttributes';

const input: OperatorAttackDerivationInput = {
  attributes: { strength: 100, agility: 80, intellect: 120, will: 200 },
  attackBeforeAttributeScalar: 500,
  artsIntensity: 16,
  mainAttribute: 'intellect',
  secondaryAttribute: 'will',
};

describe('operator attack attributes', () => {
  it('exposes panel defense through the native Def runtime attribute', () => {
    const attributes = createOperatorAttackAttributes({ ...input, defense: 420 });

    expect(attributes.get('Def')).toBe(420);
  });

  it('uses panel arts intensity as native infliction enhance and accepts Buff additions', () => {
    const attributes = createOperatorAttackAttributes(input);
    attributes.addModifier(
      new CombatAttributeModifier(
        'PhysicalAndSpellInflictionEnhance',
        attributeModifierValues('baseAddition', 10),
        ATTRIBUTE_MODIFIER_SOURCES.buff,
        'runtime',
      ),
    );

    expect(attributes.get('PhysicalAndSpellInflictionEnhance')).toBe(26);
  });

  it('从面板初始化终结技回能效率并保留 Buff 动态修正', () => {
    const attributes = createOperatorAttackAttributes({
      ...input,
      ultimateEnergyGainEfficiency: 1.2,
    });
    attributes.addModifier(
      new CombatAttributeModifier(
        'UltimateSpGainScalar',
        attributeModifierValues('baseAddition', 0.05),
        ATTRIBUTE_MODIFIER_SOURCES.buff,
        'runtime',
      ),
    );

    expect(attributes.get('UltimateSpGainScalar')).toBeCloseTo(1.25);
  });

  it('按原生主副属性系数计算静态攻击', () => {
    const attributes = createOperatorAttackAttributes(input);

    expect(resolveOperatorAttack(input, attributes)).toBe(
      Math.floor(500 * (1 + 120 * Math.fround(0.005) + 200 * Math.fround(0.002))),
    );
  });

  it('运行时 Buff 修改派生系数后重新计算攻击', () => {
    const attributes = createOperatorAttackAttributes(input);
    attributes.addModifier(
      new CombatAttributeModifier(
        'AtkIncreaseFactorFromWisd',
        attributeModifierValues('baseAddition', 0.001),
        ATTRIBUTE_MODIFIER_SOURCES.buff,
        'runtime',
      ),
    );
    attributes.addModifier(
      new CombatAttributeModifier(
        'AtkIncreaseFactorFromWill',
        attributeModifierValues('baseAddition', 0.001),
        ATTRIBUTE_MODIFIER_SOURCES.buff,
        'runtime',
      ),
    );

    expect(resolveOperatorAttack(input, attributes)).toBe(
      Math.floor(
        500 * (1 + 120 * (Math.fround(0.005) + 0.001) + 200 * (Math.fround(0.002) + 0.001)),
      ),
    );
  });

  it('applies native Atk base-multiplier buffs before attribute scaling', () => {
    const attributes = createOperatorAttackAttributes(input);
    attributes.addModifier(
      new CombatAttributeModifier(
        'Atk',
        attributeModifierValues('baseMultiplier', 0.4),
        ATTRIBUTE_MODIFIER_SOURCES.buff,
        'runtime',
      ),
    );

    expect(resolveOperatorAttack(input, attributes)).toBe(
      Math.floor(500 * 1.4 * (1 + 120 * Math.fround(0.005) + 200 * Math.fround(0.002))),
    );
  });

  it('derives healing attributes from Will and static progression modifiers', () => {
    const attributes = createOperatorAttackAttributes({
      ...input,
      combatModifiers: [
        { kind: 'staticHealingIncrease', target: 'output', value: 0.1 },
        { kind: 'staticHealingIncrease', target: 'taken', value: 0.05 },
      ],
    });

    expect(attributes.get('healOutputIncrease')).toBeCloseTo(0.1);
    expect(attributes.get('healTakenIncrease')).toBeCloseTo(0.25);
  });
});
