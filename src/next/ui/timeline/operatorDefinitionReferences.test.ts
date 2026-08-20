import { describe, expect, it } from 'vitest';
import type { OperatorDefinition } from '../../core/game-data/operatorDefinition';
import {
  collectOperatorDefinitionReferences,
  referencesToDefinition,
} from './operatorDefinitionReferences';

function definition(): OperatorDefinition {
  return {
    slug: 'reference-test',
    gameId: 'reference-test',
    rarity: 5,
    weaponType: 'sword',
    element: 'electric',
    role: 'guard',
    mainAttribute: 'strength',
    secondaryAttribute: 'agility',
    attributes: {
      strength: [1],
      agility: [1],
      intellect: [1],
      will: [1],
      baseAttack: [1],
      baseHealth: [1],
    },
    skillGroups: [
      {
        key: 'normal',
        skillType: 'basicAttack',
        levelSource: 'basicAttack',
        skills: {
          key: 'attack',
          timelineBlockFrames: 10,
          scheduledSequences: [
            {
              startFrame: 0,
              sequence: {
                steps: [
                  {
                    kind: 'applyBuff',
                    parameters: { target: 'caster', buffId: 'buff-a' },
                  },
                  {
                    kind: 'spawnAbilityEntity',
                    parameters: { abilityEntityId: 'entity-a', dieWhenSourceDies: true },
                  },
                ],
              },
            },
          ],
        },
      },
    ],
    buffDefinitions: {
      'buff-a': {
        stackingType: 'refresh',
        lifecycleSequences: {
          start: {
            steps: [
              {
                kind: 'finishBuffsById',
                parameters: { target: 'caster', buffIds: ['buff-b'], reason: 'early' },
              },
            ],
          },
        },
      },
      'buff-b': { stackingType: 'refresh' },
    },
    abilityEntityDefinitions: {
      'entity-a': {
        lifetime: { kind: 'infinite' },
        childSkill: {
          skillId: 'child',
          scheduledSequences: [
            {
              startFrame: 0,
              sequence: {
                steps: [
                  {
                    kind: 'findOwnerSpawnedAbilityEntities',
                    parameters: {
                      saveToContextKey: 'targets',
                      abilityEntityIds: ['entity-b'],
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      'entity-b': { lifetime: { kind: 'infinite' } },
    },
    talents: [],
    potentials: [],
  };
}

describe('operator definition references', () => {
  it('indexes references in skills, Buff lifecycles, and ability-entity child skills', () => {
    const references = collectOperatorDefinitionReferences(definition());

    expect(referencesToDefinition(references, 'buff', 'buff-a')).toMatchObject([
      { ownerKind: 'skill', ownerId: 'normal/attack' },
    ]);
    expect(referencesToDefinition(references, 'buff', 'buff-b')).toMatchObject([
      { ownerKind: 'buff', ownerId: 'buff-a' },
    ]);
    expect(referencesToDefinition(references, 'entity', 'entity-a')).toMatchObject([
      { ownerKind: 'skill', ownerId: 'normal/attack' },
    ]);
    expect(referencesToDefinition(references, 'entity', 'entity-b')).toMatchObject([
      { ownerKind: 'entity', ownerId: 'entity-a' },
    ]);
  });

  it('does not treat registry keys as references', () => {
    const references = collectOperatorDefinitionReferences(definition());

    expect(referencesToDefinition(references, 'buff', 'unused')).toEqual([]);
    expect(references.some(reference => reference.path === 'buffDefinitions["buff-a"]')).toBe(
      false,
    );
  });
});
