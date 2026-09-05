import { describe, expect, it } from 'vitest';
import { parseCompoundStatusFactories } from '../../core/combat/infliction/compoundStatusFactories';
import { INFLICTION_ELEMENTS } from '../../core/game-data/operatorDefinition';
import { compoundStatusFactories } from './compoundStatusFactories';

describe('compoundStatusFactories', () => {
  it('loads every ordered pair from the generated 1.4.4 index', () => {
    expect(compoundStatusFactories.revision).toBe('combat-1.4.4');
    expect(compoundStatusFactories.factories).toHaveLength(12);
    expect(
      new Set(
        compoundStatusFactories.factories.map(
          factory => `${factory.consumedElement}:${factory.incomingElement}`,
        ),
      ).size,
    ).toBe(12);
    expect(
      compoundStatusFactories.factories.flatMap(factory => factory.skillSettingLookups),
    ).toHaveLength(39);
    expect(
      compoundStatusFactories.factories.filter(factory =>
        factory.createdBuff.buffId.endsWith('_wrapper'),
      ),
    ).toHaveLength(3);

    for (const consumedElement of INFLICTION_ELEMENTS) {
      for (const incomingElement of INFLICTION_ELEMENTS) {
        if (consumedElement === incomingElement) continue;
        expect(
          compoundStatusFactories.factories.some(
            factory =>
              factory.consumedElement === consumedElement &&
              factory.incomingElement === incomingElement,
          ),
        ).toBe(true);
      }
    }
  });

  it('rejects schema drift instead of dropping factory fields', () => {
    expect(() =>
      parseCompoundStatusFactories({
        schemaVersion: 1,
        revision: 'test',
        factories: [
          {
            id: 'factory.test',
            consumedElement: 'heat',
            incomingElement: 'cryo',
            durationSeconds: 0.1,
            blackboard: {},
            skillSettingLookups: [],
            createdBuff: { buffId: 'status.test', blackboardAssignments: [] },
            unprojectedAction: true,
          },
        ],
      }),
    ).toThrow("unknown property 'unprojectedAction'");
  });
});
