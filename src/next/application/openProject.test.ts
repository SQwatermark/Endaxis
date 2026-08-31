import { describe, expect, it, vi } from 'vitest';
import type { GameDataRepository } from '../core/game-data/gameDataRepository';
import { createEmptyProject } from '../core/project/createProject';
import { serializeProjectDocument } from '../core/project/serialization';
import { openProject } from './openProject';

function createRepository(revision = 'definitions:current'): GameDataRepository {
  return {
    revision,
    getOperator: () => null,
    getWeapon: () => null,
    getGear: () => null,
    getGearSet: () => null,
    getEnemy: () => null,
    getMechanic: () => null,
  };
}

function createProject(gameDataRevision = 'definitions:current') {
  return createEmptyProject({ createdWith: 'test', gameDataRevision });
}

describe('openProject', () => {
  it('returns parse failure before accessing the game data repository', () => {
    const getOperator = vi.fn(() => {
      throw new Error('repository must not be accessed');
    });
    const result = openProject('{', {
      gameDataRepository: { ...createRepository(), getOperator },
    });

    expect(result).toEqual({
      ok: false,
      kind: 'parse-failed',
      cause: expect.objectContaining({ ok: false, kind: 'invalid-json' }),
    });
    expect(getOperator).not.toHaveBeenCalled();
  });

  it('opens a structurally and definition-valid project with the matching revision', () => {
    const project = createProject();

    expect(
      openProject(serializeProjectDocument(project), {
        gameDataRepository: createRepository(),
      }),
    ).toEqual({
      ok: true,
      kind: 'opened',
      project,
      gameDataRevision: 'definitions:current',
      gameDataRevisionUpdated: false,
    });
  });

  it('reports definition reference issues when the revision matches', () => {
    const project = createProject();
    project.scenarios[0]!.tracks[0] = {
      id: 'track:0',
      operator: null,
      weapon: {
        weaponSlug: 'missing-weapon',
        level: 90,
        tuned: true,
        potential: 0,
        traitLevels: [1, 1, 1],
      },
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };

    expect(openProject(project, { gameDataRepository: createRepository() })).toEqual({
      ok: false,
      kind: 'definition-validation-failed',
      project,
      issues: [
        {
          path: '$.scenarios[0].tracks[0].weapon.weaponSlug',
          message: 'unknown weapon',
        },
      ],
    });
  });

  it('opens a project created with an older marker against the only latest definition library', () => {
    const project = createProject('definitions:old');

    expect(openProject(project, { gameDataRepository: createRepository() })).toEqual({
      ok: true,
      kind: 'opened',
      project: { ...project, gameDataRevision: 'definitions:current' },
      gameDataRevision: 'definitions:current',
      gameDataRevisionUpdated: true,
    });
    expect(project.gameDataRevision).toBe('definitions:old');
  });

  it('reports references missing from the latest library regardless of the saved marker', () => {
    const project = createProject('definitions:old');
    project.scenarios[0]!.enemy.source = {
      kind: 'prefab',
      enemyId: 'enemy:removed',
      level: 90,
    };

    const result = openProject(project, { gameDataRepository: createRepository() });

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        kind: 'definition-validation-failed',
        issues: [
          {
            path: '$.scenarios[0].enemy.source.enemyId',
            message: 'unknown enemy',
          },
        ],
      }),
    );
  });

  it('normalizes the data marker after an explicitly injected legacy format migration', () => {
    const migrated = createProject('definitions:old');
    const result = openProject(
      { version: '1.0.0', scenarioList: [] },
      {
        gameDataRepository: createRepository(),
        legacyImporter: {
          migrate: () => ({ ok: true, value: migrated, warnings: [] }),
        },
      },
    );

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        kind: 'opened',
        project: { ...migrated, gameDataRevision: 'definitions:current' },
        gameDataRevision: 'definitions:current',
        gameDataRevisionUpdated: true,
      }),
    );
  });
});
