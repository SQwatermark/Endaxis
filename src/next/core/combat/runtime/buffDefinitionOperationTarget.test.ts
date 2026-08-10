import { describe, expect, it } from 'vitest';
import { CombatAttributeSet } from '../attributes/combatAttributes';
import { CombatBuffContainer, type CombatBuffDefinition } from '../buffs/combatBuffs';
import { BuffDefinitionOperationTarget } from './buffDefinitionOperationTarget';

type Attribute = 'cost';

describe('BuffDefinitionOperationTarget', () => {
  it('resolves a stable identity and keeps application values on the created instance', () => {
    const attributes = new CombatAttributeSet<Attribute>();
    attributes.define('cost', 100, { minimum: 0, maximum: 100 });
    const container = new CombatBuffContainer('operator', attributes);
    const definition: CombatBuffDefinition<Attribute> = {
      id: 'free-skill',
      stackingType: 'unique',
      blackboard: { amount: -20 },
      attributeModifiers: [
        {
          attribute: 'cost',
          values: { slot: 'baseAddition', blackboardKey: 'amount' },
          timing: 'runtime',
        },
      ],
    };
    const target = new BuffDefinitionOperationTarget(container, {
      get: id => (id === definition.id ? definition : undefined),
    });

    expect(
      target.apply({
        buffId: 'free-skill',
        sourceId: 'operator',
        blackboardValues: { amount: -100 },
      }),
    ).toBe(true);
    expect(attributes.get('cost')).toBe(0);
  });

  it('rejects an unknown identity instead of creating an empty definition', () => {
    const target = new BuffDefinitionOperationTarget(
      new CombatBuffContainer('operator', new CombatAttributeSet()),
      { get: () => undefined },
    );

    expect(() =>
      target.apply({ buffId: 'missing', sourceId: 'operator', blackboardValues: {} }),
    ).toThrow("unknown combat buff 'missing'");
  });

  it('advances the owned container with the shared combat frame interval', () => {
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const definition: CombatBuffDefinition<never> = {
      id: 'one-frame',
      stackingType: 'unique',
      durationSeconds: 1 / 30,
    };
    const target = new BuffDefinitionOperationTarget(container, {
      get: id => (id === definition.id ? definition : undefined),
    });

    target.apply({ buffId: definition.id, sourceId: 'operator', blackboardValues: {} });
    expect(container.getCountById(definition.id)).toBe(1);

    target.advanceFrame();
    expect(container.getCountById(definition.id)).toBe(0);
  });

  it('stores the supplied skill-cast snapshot on the created Buff instance', () => {
    const container = new CombatBuffContainer<never>('operator', new CombatAttributeSet<never>());
    const definition: CombatBuffDefinition<never> = {
      id: 'inherited-cast',
      stackingType: 'unique',
    };
    const target = new BuffDefinitionOperationTarget(container, {
      get: () => definition,
    });
    const skillCastInfo = {
      skillCastId: 3,
      originSkillId: 'battleSkill',
      nonReturnedSpCost: 90,
    };

    target.apply({
      buffId: definition.id,
      sourceId: 'operator',
      blackboardValues: {},
      skillCastInfo,
    });

    expect(container.buffs[0]?.skillCastInfo).toEqual(skillCastInfo);
  });
});
