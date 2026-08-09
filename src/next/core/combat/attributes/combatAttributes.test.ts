import { describe, expect, it } from 'vitest';
import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
  CombatAttributeSet,
  attributeModifierValues,
} from './combatAttributes';

type Attribute = 'attack';

function addModifier(
  attributes: CombatAttributeSet<Attribute>,
  slot: Parameters<typeof attributeModifierValues>[0],
  value: number,
  source: (typeof ATTRIBUTE_MODIFIER_SOURCES)[keyof typeof ATTRIBUTE_MODIFIER_SOURCES],
): CombatAttributeModifier<Attribute> {
  const modifier = new CombatAttributeModifier(
    'attack',
    attributeModifierValues(slot, value),
    source,
    'runtime',
  );
  attributes.addModifier(modifier);
  return modifier;
}

describe('CombatAttributeSet', () => {
  it('aggregates all eight slots across the recovered three stages', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, {
      minimum: 0,
      maximum: 1000,
      otherAttributeBaseAddition: 5,
      otherAttributeBaseFinalMultiplier: 2,
      otherAttributeFinalMultiplier: 0.5,
    });
    addModifier(attributes, 'baseAddition', 10, ATTRIBUTE_MODIFIER_SOURCES.equipment);
    addModifier(attributes, 'baseMultiplier', 0.2, ATTRIBUTE_MODIFIER_SOURCES.buff);
    addModifier(attributes, 'baseFinalAddition', 3, ATTRIBUTE_MODIFIER_SOURCES.talent);
    addModifier(attributes, 'baseFinalMultiplier', 0.5, ATTRIBUTE_MODIFIER_SOURCES.weapon);
    addModifier(attributes, 'addition', 7, ATTRIBUTE_MODIFIER_SOURCES.buff);
    addModifier(attributes, 'multiplier', 0.5, ATTRIBUTE_MODIFIER_SOURCES.instant);
    addModifier(attributes, 'finalAddition', 11, ATTRIBUTE_MODIFIER_SOURCES.potential);
    addModifier(attributes, 'finalMultiplier', 2, ATTRIBUTE_MODIFIER_SOURCES.buff);

    expect(attributes.get('attack')).toBe(233);
  });

  it('filters converted modifiers with the recovered non-converted mask', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    addModifier(attributes, 'addition', 20, ATTRIBUTE_MODIFIER_SOURCES.buff);
    addModifier(attributes, 'addition', 50, ATTRIBUTE_MODIFIER_SOURCES.converted);

    expect(attributes.get('attack')).toBe(170);
    expect(attributes.get('attack', ATTRIBUTE_MODIFIER_SOURCES.nonConverted)).toBe(120);
  });

  it('reads armed and final non-converted stages without mixing their modifier slots', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    addModifier(attributes, 'baseAddition', 10, ATTRIBUTE_MODIFIER_SOURCES.buff);
    addModifier(attributes, 'baseAddition', 40, ATTRIBUTE_MODIFIER_SOURCES.converted);
    addModifier(attributes, 'baseMultiplier', 0.5, ATTRIBUTE_MODIFIER_SOURCES.weapon);
    addModifier(attributes, 'addition', 20, ATTRIBUTE_MODIFIER_SOURCES.talent);
    addModifier(attributes, 'addition', 80, ATTRIBUTE_MODIFIER_SOURCES.converted);
    addModifier(attributes, 'multiplier', 0.25, ATTRIBUTE_MODIFIER_SOURCES.buff);

    expect(attributes.getArmed('attack', ATTRIBUTE_MODIFIER_SOURCES.nonConverted)).toBe(165);
    expect(attributes.get('attack', ATTRIBUTE_MODIFIER_SOURCES.nonConverted)).toBe(231.25);
    expect(attributes.getArmed('attack')).toBe(225);
    expect(attributes.get('attack')).toBe(406.25);
  });

  it('exposes whether an attribute is configured separately from its numeric value', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 0, { minimum: 0, maximum: 1000 });

    expect(attributes.has('attack')).toBe(true);
    expect(attributes.has('unknown')).toBe(false);
    expect(attributes.get('attack')).toBe(0);
  });

  it('uses modifier identity and clears only instant modifiers', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('attack', 100, { minimum: 0, maximum: 1000 });
    const persistent = addModifier(attributes, 'addition', 20, ATTRIBUTE_MODIFIER_SOURCES.buff);
    const instant = addModifier(attributes, 'addition', 30, ATTRIBUTE_MODIFIER_SOURCES.instant);
    attributes.addModifier(persistent);

    expect(attributes.modifierCount).toBe(2);
    expect(attributes.get('attack')).toBe(150);
    attributes.clearInstantModifiers();
    expect(attributes.get('attack')).toBe(120);
    expect(attributes.removeModifier(instant)).toBe(false);
    expect(attributes.removeModifier(persistent)).toBe(true);
  });

  it('requires explicit native bounds before a modifier is attached', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.setRawValue('attack', 100);
    const modifier = new CombatAttributeModifier(
      'attack',
      attributeModifierValues('addition', 10),
      ATTRIBUTE_MODIFIER_SOURCES.buff,
      'runtime',
    );

    expect(() => attributes.addModifier(modifier)).toThrow('explicit native bounds');
  });
});
