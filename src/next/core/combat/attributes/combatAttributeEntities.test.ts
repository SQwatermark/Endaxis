import { describe, expect, it, vi } from 'vitest';
import { compileCombatBuffCatalog } from '../buffs/combatBuffCatalog';
import { CombatBuffContainer } from '../buffs/combatBuffs';
import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
  CombatAttributeSet,
  attributeModifierValues,
} from './combatAttributes';
import {
  CombatAttributeEntityRegistry,
  createCombatBuffCatalogAttributeReader,
} from './combatAttributeEntities';

type Attribute = 'strength' | 'agility' | 'intellect' | 'will' | 'special';

function createAttributes(): CombatAttributeSet<Attribute> {
  const attributes = new CombatAttributeSet<Attribute>();
  for (const [key, value] of [
    ['strength', 10],
    ['agility', 20],
    ['intellect', 30],
    ['will', 40],
    ['special', 5],
  ] as const) {
    attributes.define(key, value, { minimum: 0, maximum: 1000 });
  }
  attributes.addModifier(
    new CombatAttributeModifier(
      'strength',
      attributeModifierValues('baseAddition', 2),
      ATTRIBUTE_MODIFIER_SOURCES.buff,
      'runtime',
    ),
  );
  attributes.addModifier(
    new CombatAttributeModifier(
      'strength',
      attributeModifierValues('baseAddition', 100),
      ATTRIBUTE_MODIFIER_SOURCES.converted,
      'runtime',
    ),
  );
  attributes.addModifier(
    new CombatAttributeModifier(
      'strength',
      attributeModifierValues('addition', 3),
      ATTRIBUTE_MODIFIER_SOURCES.talent,
      'runtime',
    ),
  );
  attributes.addModifier(
    new CombatAttributeModifier(
      'strength',
      attributeModifierValues('addition', 200),
      ATTRIBUTE_MODIFIER_SOURCES.converted,
      'runtime',
    ),
  );
  return attributes;
}

function createRegistry(): CombatAttributeEntityRegistry<Attribute> {
  const registry = new CombatAttributeEntityRegistry<Attribute>();
  registry.register({
    entityId: 'operator-a',
    attributes: createAttributes(),
    mainAttribute: 'intellect',
    secondaryAttribute: 'will',
  });
  return registry;
}

describe('CombatAttributeEntityRegistry', () => {
  it('locates the source and resolves specific, main, secondary and all selectors', () => {
    const registry = createRegistry();

    expect(
      registry.read('operator-a', {
        target: 'source',
        attribute: { kind: 'specific', key: 'special' },
        stage: 'finalNonConverted',
      }),
    ).toBe(5);
    expect(
      registry.read('operator-a', {
        target: 'source',
        attribute: { kind: 'main' },
        stage: 'finalNonConverted',
      }),
    ).toBe(30);
    expect(
      registry.read('operator-a', {
        target: 'source',
        attribute: { kind: 'secondary' },
        stage: 'finalNonConverted',
      }),
    ).toBe(40);
    expect(
      registry.read('operator-a', {
        target: 'source',
        attribute: { kind: 'all' },
        stage: 'finalNonConverted',
      }),
    ).toBe(105);
  });

  it('distinguishes armed from final and excludes Converted modifiers in both stages', () => {
    const registry = createRegistry();

    expect(
      registry.read('operator-a', {
        target: 'source',
        attribute: { kind: 'specific', key: 'strength' },
        stage: 'armedNonConverted',
      }),
    ).toBe(12);
    expect(
      registry.read('operator-a', {
        target: 'source',
        attribute: { kind: 'specific', key: 'strength' },
        stage: 'finalNonConverted',
      }),
    ).toBe(15);
  });

  it('fails explicitly for unknown sources, duplicate identities and missing attributes', () => {
    const registry = createRegistry();

    expect(() =>
      registry.read('missing', {
        target: 'source',
        attribute: { kind: 'main' },
        stage: 'finalNonConverted',
      }),
    ).toThrow("combat attribute source 'missing' is not configured");
    expect(() =>
      registry.read('operator-a', {
        target: 'source',
        attribute: { kind: 'specific', key: 'unknown' },
        stage: 'finalNonConverted',
      }),
    ).toThrow("combat attribute entity 'operator-a' has no attribute 'unknown'");
    expect(() =>
      registry.register({
        entityId: 'operator-a',
        attributes: createAttributes(),
        mainAttribute: 'strength',
        secondaryAttribute: 'agility',
      }),
    ).toThrow("duplicate combat attribute entity 'operator-a'");
  });

  it('adapts sourceId lookup into a real StoreAttributeValue catalog port', () => {
    const catalog = compileCombatBuffCatalog<Attribute>(
      {
        schemaVersion: 1,
        revision: 'attribute-reader-test',
        buffs: [
          {
            id: 'status.attribute-reader',
            stackingType: 'unique',
            actions: {
              start: [
                {
                  kind: 'storeAttributeValue',
                  target: 'source',
                  attribute: { kind: 'all' },
                  stage: 'finalNonConverted',
                  useFloor: false,
                  divisor: 1,
                  multiplier: 1,
                  base: 0,
                  targetKey: 'result',
                },
              ],
            },
          },
        ],
      },
      {
        emitElementalInflictionStarted: vi.fn(),
        readAttribute: createCombatBuffCatalogAttributeReader(createRegistry()),
      },
    );
    const definition = catalog.get('status.attribute-reader');
    if (definition === undefined) throw new Error('compiled test buff is missing');
    const target = new CombatBuffContainer('enemy', new CombatAttributeSet<Attribute>());

    const buff = target.add(definition, 'operator-a');

    expect(buff?.blackboard.getNumber('result')).toBe(105);
  });
});
