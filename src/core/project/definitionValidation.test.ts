import { describe, expect, it, vi } from 'vitest';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import { ActionGraphDefinitionRepository } from '../compiler/actionGraphDefinitionRepository';
import { createEmptyProject } from './createProject';
import { parseProjectDocument, serializeProjectDocument } from './serialization';
import { validateProjectWithGameData } from './definitionValidation';
import { gameDataRepository } from '../../data/gameDataRepository';

function createMissingRepository(): GameDataRepository {
  return {
    revision: 'fixture',
    getOperator: () => null,
    getWeapon: () => null,
    getGear: () => null,
    getGearSet: () => null,
    getGlobalEffect: () => null,
    getEnemy: () => null,
    getMechanic: () => null,
    getConsumable: () => null,
    getConsumables: () => [],
    actionPrograms: new ActionGraphDefinitionRepository(),
    getCommonDefinitionSources: () => [],
  };
}

function createProjectWithDefinitionReferences() {
  const project = createEmptyProject({ createdWith: 'test' });
  const scenario = project.scenarios[0]!;
  scenario.tracks[0] = {
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
  scenario.mechanics.selections.push({
    id: 'mechanic:1',
    mechanicId: 'missing-mechanic',
    enabled: true,
    parameters: {},
  });
  scenario.enemy.source = { kind: 'prefab', enemyId: 'missing-enemy', level: 90 };
  return project;
}

describe('validateProjectWithGameData', () => {
  it('keeps old projects and declared zero overrides, and rejects undeclared overrides on import', () => {
    const project = createEmptyProject({ createdWith: 'test' });
    expect(validateProjectWithGameData(project, gameDataRepository).ok).toBe(true);
    const scenario = project.scenarios[0]!;
    scenario.tracks[0] = {
      id: 'source',
      operator: {
        operatorSlug: 'perlica',
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: {},
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const plan = {
      id: 'manual',
      kind: 'apply' as const,
      frame: 0,
      buff: {
        kind: 'common' as const,
        sourceId: 'contingency-contracts',
        buffId: 'buff_cc_enemy_common_hp_up',
      },
      target: { kind: 'enemy' as const },
      sourceOperatorId: 'source',
      parameters: { hp_up: 0 },
    };
    scenario.buffInterventions = [plan];
    expect(parseProjectDocument(serializeProjectDocument(project), { gameDataRepository }).ok).toBe(
      true,
    );
    scenario.buffInterventions = [{ ...plan, parameters: { undeclared: 0 } }];
    const result = parseProjectDocument(serializeProjectDocument(project), { gameDataRepository });
    expect(result.ok).toBe(false);
    if (!result.ok && result.kind === 'invalid-document')
      expect(result.issues).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ message: expect.stringContaining('未声明') }),
        ]),
      );
  });
  it('does not access the repository when structural validation fails', () => {
    const getWeapon = vi.fn(() => {
      throw new Error('repository must not be accessed');
    });
    const repository = { ...createMissingRepository(), getWeapon };

    const result = validateProjectWithGameData({ schemaVersion: 3 }, repository);

    expect(result.ok).toBe(false);
    expect(getWeapon).not.toHaveBeenCalled();
  });

  it('combines build and mechanic index issues after structural validation', () => {
    const result = validateProjectWithGameData(
      createProjectWithDefinitionReferences(),
      createMissingRepository(),
    );

    expect(result).toEqual({
      ok: false,
      issues: [
        {
          path: '$.scenarios[0].tracks[0].weapon.weaponSlug',
          message: 'unknown weapon',
        },
        {
          path: '$.scenarios[0].enemy.source.enemyId',
          message: 'unknown enemy',
        },
        {
          path: '$.scenarios[0].mechanics.selections[0].mechanicId',
          message: 'unknown mechanic',
        },
      ],
    });
  });
});

describe('parseProjectDocument index validation', () => {
  it('runs index validation when the loading caller supplies a repository', () => {
    const project = createProjectWithDefinitionReferences();
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
          expect.objectContaining({ message: 'unknown enemy' }),
          expect.objectContaining({ message: 'unknown mechanic' }),
        ]),
      }),
    );
  });
});
