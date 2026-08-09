import { describe, expect, it, vi } from 'vitest';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import { createEmptyProject } from './createProject';
import { parseProjectDocument, serializeProjectDocument } from './serialization';
import { validateProjectWithGameData } from './catalogValidation';

function createMissingRepository(): GameDataRepository {
  return {
    getOperator: () => null,
    getWeapon: () => null,
    getGear: () => null,
    getGearSet: () => null,
    getMechanic: () => null,
  };
}

function createProjectWithCatalogReferences() {
  const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'fixture' });
  const scenario = project.scenarios[0]!;
  scenario.builds.weapons['weapon:1'] = {
    id: 'weapon:1',
    weaponSlug: 'missing-weapon',
    level: 90,
    tuned: true,
    potential: 0,
    traitLevels: [1, 1, 1],
  };
  scenario.mechanics.selections.push({
    id: 'mechanic:1',
    mechanicId: 'missing-mechanic',
    enabled: true,
    parameters: {},
  });
  return project;
}

describe('validateProjectWithGameData', () => {
  it('does not access the repository when structural validation fails', () => {
    const getWeapon = vi.fn(() => {
      throw new Error('repository must not be accessed');
    });
    const repository = { ...createMissingRepository(), getWeapon };

    const result = validateProjectWithGameData({ schemaVersion: 2 }, repository);

    expect(result.ok).toBe(false);
    expect(getWeapon).not.toHaveBeenCalled();
  });

  it('combines build and mechanic catalog issues after structural validation', () => {
    const result = validateProjectWithGameData(
      createProjectWithCatalogReferences(),
      createMissingRepository(),
    );

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          path: '$.scenarios[0].builds.weapons.weapon:1.weaponSlug',
          message: 'unknown weapon',
        },
        {
          path: '$.scenarios[0].mechanics.selections[0].mechanicId',
          message: 'unknown mechanic',
        },
      ],
    });
  });

  it('returns the structurally validated document when it has no catalog references', () => {
    const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'fixture' });

    expect(validateProjectWithGameData(project, createMissingRepository())).toEqual({
      ok: true,
      value: project,
    });
  });
});

describe('parseProjectDocument catalog validation', () => {
  it('runs catalog validation when the loading caller supplies a repository', () => {
    const project = createProjectWithCatalogReferences();
    const serialized = serializeProjectDocument(project);

    expect(parseProjectDocument(serialized).ok).toBe(true);
    expect(
      parseProjectDocument(serialized, { gameDataRepository: createMissingRepository() }),
    ).toEqual(
      expect.objectContaining({
        ok: false,
        kind: 'invalid-document',
        issues: expect.arrayContaining([
          expect.objectContaining({ message: 'unknown weapon' }),
          expect.objectContaining({ message: 'unknown mechanic' }),
        ]),
      }),
    );
  });

  it('applies the same catalog validation after legacy migration', () => {
    const migrated = createProjectWithCatalogReferences();
    const result = parseProjectDocument(
      { version: '1.0.0', scenarioList: [] },
      {
        legacyImporter: {
          migrate: () => ({ ok: true, value: migrated, warnings: [] }),
        },
        gameDataRepository: createMissingRepository(),
      },
    );

    expect(result).toEqual(
      expect.objectContaining({
        ok: false,
        kind: 'invalid-document',
        issues: expect.arrayContaining([
          expect.objectContaining({ message: 'unknown weapon' }),
          expect.objectContaining({ message: 'unknown mechanic' }),
        ]),
      }),
    );
  });
});
