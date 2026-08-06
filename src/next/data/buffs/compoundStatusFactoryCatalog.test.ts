import { describe, expect, it } from 'vitest';
import { parseCompoundStatusFactoryCatalog } from '../../core/combat/infliction/compoundStatusFactoryCatalog';
import { INFLICTION_ELEMENTS } from '../../core/game-data/operatorDefinition';
import { compoundStatusFactoryCatalog } from './compoundStatusFactoryCatalog';

describe('compoundStatusFactoryCatalog', () => {
  it('loads every ordered pair from the generated 1.4.4 catalog', () => {
    expect(compoundStatusFactoryCatalog.revision).toBe('combat-1.4.4');
    expect(compoundStatusFactoryCatalog.factories).toHaveLength(12);
    expect(
      new Set(
        compoundStatusFactoryCatalog.factories.map(
          factory => `${factory.consumedElement}:${factory.incomingElement}`,
        ),
      ).size,
    ).toBe(12);
    expect(
      compoundStatusFactoryCatalog.factories.flatMap(factory => factory.skillSettingLookups),
    ).toHaveLength(39);
    expect(
      compoundStatusFactoryCatalog.factories.filter(factory =>
        factory.createdBuff.buffId.endsWith('_wrapper'),
      ),
    ).toHaveLength(3);

    for (const consumedElement of INFLICTION_ELEMENTS) {
      for (const incomingElement of INFLICTION_ELEMENTS) {
        if (consumedElement === incomingElement) continue;
        expect(
          compoundStatusFactoryCatalog.factories.some(
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
      parseCompoundStatusFactoryCatalog({
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
