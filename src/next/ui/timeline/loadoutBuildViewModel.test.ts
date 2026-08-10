import { describe, expect, it } from 'vitest';
import { createGameDataRepository } from '../../data/gameDataRepository';
import { perlica } from '../../data/operators';
import {
  sharedGearDefinitions,
  sharedGearSetDefinitions,
  sharedWeaponDefinitions,
} from '../../data/equipment';
import { createEmptyScenario } from '../../core/project/createProject';
import type { ScenarioDocument } from '../../core/project/schema';
import { projectTrackLoadoutBuilds } from './loadoutBuildViewModel';

const weapon = sharedWeaponDefinitions.find(value => value.weaponType === perlica.weaponType)!;
const armor = sharedGearDefinitions.find(value => value.slotType === 'armor')!;
const accessory = sharedGearDefinitions.find(value => value.slotType === 'accessory')!;
const repository = createGameDataRepository({
  revision: 'fixture',
  operators: [perlica],
  weapons: [weapon],
  gears: [armor, accessory],
  gearSets: sharedGearSetDefinitions,
});

function createEquippedScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario', 'Scenario');
  scenario.builds.operators.operator = {
    id: 'operator',
    operatorSlug: perlica.slug,
    level: 90,
    promoted: true,
    potential: 3,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 11 },
    talentStates: { talent1: 2 },
    baseStatOverrides: { attack: 1234 },
  };
  scenario.builds.weapons.weapon = {
    id: 'weapon',
    weaponSlug: weapon.slug,
    level: 80,
    tuned: true,
    potential: 2,
    traitLevels: [3, 4, 5],
  };
  scenario.builds.gears.armor = {
    id: 'armor',
    gearSlug: armor.slug,
    artificingLevels: [1, 2],
  };
  scenario.builds.gears.accessory = {
    id: 'accessory',
    gearSlug: accessory.slug,
    artificingLevels: [3],
  };
  scenario.tracks[0] = {
    operatorBuildId: 'operator',
    weaponBuildId: 'weapon',
    gearBuildIds: {
      armor: 'armor',
      gloves: null,
      accessory1: 'accessory',
      accessory2: null,
    },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return scenario;
}

describe('projectTrackLoadoutBuilds', () => {
  it('解析指定轨道的完整 Build 输入与定义', () => {
    const scenario = createEquippedScenario();

    const projected = projectTrackLoadoutBuilds(scenario, 0, repository);

    expect(projected.operator).toMatchObject({
      buildId: 'operator',
      operatorSlug: perlica.slug,
      level: 90,
      promoted: true,
      potential: 3,
      trustLevel: 4,
      definition: perlica,
    });
    expect(projected.operator?.skillLevels).toEqual({ basicAttack: 12, battleSkill: 11 });
    expect(projected.operator?.talentStates).toEqual({ talent1: 2 });
    expect(projected.operator?.baseStatOverrides).toEqual({ attack: 1234 });
    expect(projected.weapon).toMatchObject({
      buildId: 'weapon',
      weaponSlug: weapon.slug,
      level: 80,
      tuned: true,
      potential: 2,
      traitLevels: [3, 4, 5],
      definition: weapon,
    });
    expect(projected.gears.armor).toMatchObject({
      slot: 'armor',
      buildId: 'armor',
      gearSlug: armor.slug,
      artificingLevels: [1, 2],
      definition: armor,
    });
    expect(projected.gears.accessory1).toMatchObject({
      slot: 'accessory1',
      buildId: 'accessory',
      gearSlug: accessory.slug,
      artificingLevels: [3],
      definition: accessory,
    });
    expect(projected.gears.gloves).toBeNull();
    expect(projected.gears.accessory2).toBeNull();
  });

  it('复制项目中的可编辑集合，避免投影被源文档后续修改', () => {
    const scenario = createEquippedScenario();
    const projected = projectTrackLoadoutBuilds(scenario, 0, repository);

    scenario.builds.operators.operator!.skillLevels.basicAttack = 1;
    scenario.builds.weapons.weapon!.traitLevels[0] = 9;
    scenario.builds.gears.armor!.artificingLevels[0] = 3;

    expect(projected.operator?.skillLevels.basicAttack).toBe(12);
    expect(projected.weapon?.traitLevels).toEqual([3, 4, 5]);
    expect(projected.gears.armor?.artificingLevels).toEqual([1, 2]);
  });

  it('为空轨道和未装备槽位返回固定的 null 结构', () => {
    const scenario = createEmptyScenario('scenario', 'Scenario');

    expect(projectTrackLoadoutBuilds(scenario, 2, repository)).toEqual({
      trackIndex: 2,
      operator: null,
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    });
  });

  it('拒绝非空但缺失的 Build 引用', () => {
    const scenario = createEquippedScenario();
    delete scenario.builds.weapons.weapon;

    expect(() => projectTrackLoadoutBuilds(scenario, 0, repository)).toThrow(
      "scenario.tracks[0].weaponBuildId references missing build 'weapon'",
    );
  });

  it('拒绝 Build 指向的缺失定义', () => {
    const scenario = createEquippedScenario();
    scenario.builds.gears.armor!.gearSlug = 'missing-gear';

    expect(() => projectTrackLoadoutBuilds(scenario, 0, repository)).toThrow(
      "gear definition 'missing-gear' does not exist",
    );
  });

  it('拒绝索引返回与查询身份不一致的定义', () => {
    const scenario = createEquippedScenario();
    const inconsistentRepository = {
      ...repository,
      getOperator: () => ({ ...perlica, slug: 'wrong-operator' }),
    };

    expect(() => projectTrackLoadoutBuilds(scenario, 0, inconsistentRepository)).toThrow(
      `operator definition '${perlica.slug}' resolved definition identity 'wrong-operator'`,
    );
  });
});
