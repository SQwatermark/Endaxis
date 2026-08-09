import { describe, expect, it, vi } from 'vitest';
import { createEmptyProject } from '../project/createProject';
import { validateProjectEnemyCatalogReferences } from './enemyCatalogValidation';
import { getEnemyHpAtLevel, type EnemyDefinition } from './enemyDefinition';

const enemy: EnemyDefinition = {
  id: 'enemy-1',
  gameId: 'game_enemy_1',
  tier: 'normal',
  levelHp: [
    { level: 1, hp: 100 },
    { level: 90, hp: 1000 },
  ],
  defense: 20,
  resistances: { physical: 0, heat: 0, cryo: 0, electric: 0, nature: 0 },
  superArmor: 0,
  stagger: {
    maximum: 100,
    nodeCount: 1,
    nodeDurationSeconds: 2,
    brokenDurationSeconds: 10,
    finisherRecovery: 100,
  },
  finisherMultiplier: 1,
};

describe('enemyDefinition', () => {
  it('only resolves HP nodes explicitly present in the catalog', () => {
    expect(getEnemyHpAtLevel(enemy, 90)).toBe(1000);
    expect(getEnemyHpAtLevel(enemy, 45)).toBeNull();
  });

  it('does not query the catalog for a custom enemy instance', () => {
    const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'fixture' });
    const getEnemy = vi.fn(() => null);

    expect(validateProjectEnemyCatalogReferences(project, { getEnemy })).toEqual([]);
    expect(getEnemy).not.toHaveBeenCalled();
  });

  it('reports missing and mismatched catalog identities', () => {
    const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'fixture' });
    project.scenarios[0]!.enemy.source = { kind: 'catalog', enemyId: 'enemy-1', level: 90 };

    expect(validateProjectEnemyCatalogReferences(project, { getEnemy: () => null })).toEqual([
      { path: '$.scenarios[0].enemy.source.enemyId', message: 'unknown enemy' },
    ]);
    expect(
      validateProjectEnemyCatalogReferences(project, {
        getEnemy: () => ({ ...enemy, id: 'enemy-2' }),
      }),
    ).toEqual([
      {
        path: '$.scenarios[0].enemy.source.enemyId',
        message: 'enemy catalog identity mismatch',
      },
    ]);
  });
});
