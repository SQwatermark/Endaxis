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
  mainAttribute: 'intellect',
  secondaryAttribute: 'will',
};

describe('operator attack attributes', () => {
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
});
