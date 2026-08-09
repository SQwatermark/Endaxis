import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument } from '../../core/project/schema';
import { updateTrackGearBuild, updateTrackWeaponBuild } from './loadoutBuildCommands';

function equippedScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario', 'Scenario');
  scenario.builds.operators.operator = {
    id: 'operator',
    operatorSlug: 'operator',
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: {},
    talentStates: {},
  };
  scenario.builds.weapons.weapon = {
    id: 'weapon',
    weaponSlug: 'weapon',
    level: 90,
    tuned: true,
    potential: 0,
    traitLevels: [1, 1, 1],
  };
  scenario.builds.gears.armor = {
    id: 'armor',
    gearSlug: 'armor',
    artificingLevels: [0, 0],
  };
  scenario.tracks[0] = {
    operatorBuildId: 'operator',
    weaponBuildId: 'weapon',
    gearBuildIds: { armor: 'armor', gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return scenario;
}

describe('loadoutBuildCommands', () => {
  it('updates weapon inputs without mutating the source document', () => {
    const source = equippedScenario();
    const updated = updateTrackWeaponBuild(source, 0, {
      level: 80,
      potential: 3,
      tuned: false,
      traitLevels: [4, 5, 6],
    });

    expect(updated.builds.weapons.weapon).toMatchObject({
      id: 'weapon',
      weaponSlug: 'weapon',
      level: 80,
      potential: 3,
      tuned: false,
      traitLevels: [4, 5, 6],
    });
    expect(source.builds.weapons.weapon!.level).toBe(90);
  });

  it('updates gear artificing inputs without mutating the source document', () => {
    const source = equippedScenario();
    const updated = updateTrackGearBuild(source, 0, 'armor', [1, 2]);

    expect(updated.builds.gears.armor!.artificingLevels).toEqual([1, 2]);
    expect(source.builds.gears.armor!.artificingLevels).toEqual([0, 0]);
  });

  it('rejects malformed inputs and builds that are not equipped by the track', () => {
    const scenario = equippedScenario();
    expect(() => updateTrackWeaponBuild(scenario, 0, { level: 0 })).toThrow('weapon level');
    expect(() => updateTrackWeaponBuild(scenario, 0, { traitLevels: [0] })).toThrow(
      'weapon trait level 0',
    );
    expect(() => updateTrackGearBuild(scenario, 0, 'missing', [0])).toThrow(
      "does not reference gear build 'missing'",
    );
  });
});
