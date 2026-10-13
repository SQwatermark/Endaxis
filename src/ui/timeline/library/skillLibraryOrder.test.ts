import { describe, expect, it } from 'vitest';
import type { OperationType } from '../../../core/game-data/operatorDefinition';
import { orderTimelineSkillLibrary } from './skillLibraryOrder';

function entry(key: string, operationType: OperationType, nameKey?: string) {
  return { entryKey: key, operationType, nameKey };
}

describe('skill library presentation order', () => {
  it('orders semantic actions without changing identity or same-slot declaration order', () => {
    const source = [
      entry('ultimate', 'ultimate'),
      entry('combo-enhanced', 'comboSkill', 'skillNames.enhanced'),
      entry('basic-2', 'basicAttack'),
      entry('finisher', 'finisher'),
      entry('battle-enhanced', 'battleSkill', 'skillNames.enhanced'),
      entry('plunge', 'plungingAttack'),
      entry('combo', 'comboSkill'),
      entry('basic-1', 'basicAttack'),
      entry('battle', 'battleSkill'),
      entry('basic-enhanced', 'basicAttack', 'skillNames.enhanced'),
    ];

    const original = [...source];
    const ordered = orderTimelineSkillLibrary(source);
    expect(source).toEqual(original);
    expect(ordered.every(value => source.includes(value))).toBe(true);
    expect(ordered.map(value => value.entryKey)).toEqual([
      'basic-2',
      'basic-1',
      'basic-enhanced',
      'plunge',
      'finisher',
      'battle-enhanced',
      'battle',
      'combo-enhanced',
      'combo',
      'ultimate',
    ]);
  });
});
