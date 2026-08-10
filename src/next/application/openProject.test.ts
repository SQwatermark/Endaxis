import { describe, expect, it, vi } from 'vitest';
import type { GameDataRepository } from '../core/game-data/gameDataRepository';
import { createEmptyProject } from '../core/project/createProject';
import { serializeProjectDocument } from '../core/project/serialization';
import {
  openProject,
  type GameDataRevisionMigrator,
  type GameDataRevisionMigrationResolver,
} from './openProject';

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
    });
  });

  it('reports definition reference issues when the revision matches', () => {
    const project = createProject();
    project.scenarios[0]!.tracks[0] = {
      operator: null,
      weapon: {
        id: 'weapon:1',
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

  it('does not silently open a project created with another definition revision', () => {
    const project = createProject('definitions:old');

    expect(openProject(project, { gameDataRepository: createRepository() })).toEqual({
      ok: false,
      kind: 'game-data-revision-mismatch',
      project,
      projectRevision: 'definitions:old',
      repositoryRevision: 'definitions:current',
      indexIssues: [],
    });
  });

  it('keeps target-definition reference issues subordinate to a revision mismatch', () => {
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
        kind: 'game-data-revision-mismatch',
        indexIssues: [
          {
            path: '$.scenarios[0].enemy.source.enemyId',
            message: 'unknown enemy',
          },
        ],
      }),
    );
  });

  it('reports an explicitly registered migration without executing it', () => {
    const project = createProject('definitions:old');
    const migrate = vi.fn(() => ({ ok: true as const, value: project, warnings: [] }));
    const migrator: GameDataRevisionMigrator = {
      fromRevision: 'definitions:old',
      toRevision: 'definitions:current',
      migrate,
    };
    const findMigration = vi.fn(() => migrator);
    const resolver: GameDataRevisionMigrationResolver = { findMigration };

    expect(
      openProject(project, {
        gameDataRepository: createRepository(),
        gameDataMigrationResolver: resolver,
      }),
    ).toEqual({
      ok: false,
      kind: 'game-data-migration-available',
      project,
      projectRevision: 'definitions:old',
      repositoryRevision: 'definitions:current',
      indexIssues: [],
      migrator,
    });
    expect(findMigration).toHaveBeenCalledWith('definitions:old', 'definitions:current');
    expect(migrate).not.toHaveBeenCalled();
  });

  it('reports a resolver that returns a migrator for another revision pair', () => {
    const project = createProject('definitions:old');
    const migrator: GameDataRevisionMigrator = {
      fromRevision: 'index:other',
      toRevision: 'definitions:current',
      migrate: () => ({ ok: true, value: project, warnings: [] }),
    };
    const resolver: GameDataRevisionMigrationResolver = {
      findMigration: () => migrator,
    };

    expect(
      openProject(project, {
        gameDataRepository: createRepository(),
        gameDataMigrationResolver: resolver,
      }),
    ).toEqual({
      ok: false,
      kind: 'game-data-migrator-invalid',
      project,
      projectRevision: 'definitions:old',
      repositoryRevision: 'definitions:current',
      indexIssues: [],
      migrator,
    });
  });

  it('applies revision checks after an explicitly injected legacy format migration', () => {
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
        ok: false,
        kind: 'game-data-revision-mismatch',
        project: migrated,
        projectRevision: 'definitions:old',
        repositoryRevision: 'definitions:current',
      }),
    );
  });
});
