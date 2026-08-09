import { describe, expect, it, vi } from 'vitest';
import type { GameDataRepository } from '../core/game-data/gameDataRepository';
import { createEmptyProject } from '../core/project/createProject';
import { serializeProjectDocument } from '../core/project/serialization';
import {
  openProject,
  type GameDataRevisionMigrator,
  type GameDataRevisionMigrationResolver,
} from './openProject';

function createRepository(revision = 'catalog:current'): GameDataRepository {
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

function createProject(gameDataRevision = 'catalog:current') {
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

  it('opens a structurally and catalog-valid project with the matching revision', () => {
    const project = createProject();

    expect(
      openProject(serializeProjectDocument(project), {
        gameDataRepository: createRepository(),
      }),
    ).toEqual({
      ok: true,
      kind: 'opened',
      project,
      gameDataRevision: 'catalog:current',
    });
  });

  it('reports catalog reference issues when the revision matches', () => {
    const project = createProject();
    project.scenarios[0]!.builds.weapons['weapon:1'] = {
      id: 'weapon:1',
      weaponSlug: 'missing-weapon',
      level: 90,
      tuned: true,
      potential: 0,
      traitLevels: [1, 1, 1],
    };

    expect(openProject(project, { gameDataRepository: createRepository() })).toEqual({
      ok: false,
      kind: 'catalog-validation-failed',
      project,
      issues: [
        {
          path: '$.scenarios[0].builds.weapons.weapon:1.weaponSlug',
          message: 'unknown weapon',
        },
      ],
    });
  });

  it('does not silently open a project created with another catalog revision', () => {
    const project = createProject('catalog:old');

    expect(openProject(project, { gameDataRepository: createRepository() })).toEqual({
      ok: false,
      kind: 'game-data-revision-mismatch',
      project,
      projectRevision: 'catalog:old',
      repositoryRevision: 'catalog:current',
      catalogIssues: [],
    });
  });

  it('keeps target-catalog reference issues subordinate to a revision mismatch', () => {
    const project = createProject('catalog:old');
    project.scenarios[0]!.enemy.source = {
      kind: 'catalog',
      enemyId: 'enemy:removed',
      level: 90,
    };

    const result = openProject(project, { gameDataRepository: createRepository() });

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        kind: 'game-data-revision-mismatch',
        catalogIssues: [
          {
            path: '$.scenarios[0].enemy.source.enemyId',
            message: 'unknown enemy',
          },
        ],
      }),
    );
  });

  it('reports an explicitly registered migration without executing it', () => {
    const project = createProject('catalog:old');
    const migrate = vi.fn(() => ({ ok: true as const, value: project, warnings: [] }));
    const migrator: GameDataRevisionMigrator = {
      fromRevision: 'catalog:old',
      toRevision: 'catalog:current',
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
      projectRevision: 'catalog:old',
      repositoryRevision: 'catalog:current',
      catalogIssues: [],
      migrator,
    });
    expect(findMigration).toHaveBeenCalledWith('catalog:old', 'catalog:current');
    expect(migrate).not.toHaveBeenCalled();
  });

  it('reports a resolver that returns a migrator for another revision pair', () => {
    const project = createProject('catalog:old');
    const migrator: GameDataRevisionMigrator = {
      fromRevision: 'catalog:other',
      toRevision: 'catalog:current',
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
      projectRevision: 'catalog:old',
      repositoryRevision: 'catalog:current',
      catalogIssues: [],
      migrator,
    });
  });

  it('applies revision checks after an explicitly injected legacy format migration', () => {
    const migrated = createProject('catalog:old');
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
        projectRevision: 'catalog:old',
        repositoryRevision: 'catalog:current',
      }),
    );
  });
});
