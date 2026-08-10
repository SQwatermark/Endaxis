import { describe, expect, it } from 'vitest';
import { createEmptyProject } from '../project/createProject';
import type { EndaxisProjectDocument, TrackDocument } from '../project/schema';
import type { GearDefinition, GearSetDefinition, WeaponDefinition } from './equipmentDefinition';
import { validateProjectBuildDefinitionReferences } from './buildDefinitionValidation';

const operator = { slug: 'fixture-operator', weaponType: 'arts-unit' } as const;
const weapon: WeaponDefinition = {
  slug: 'fixture-weapon',
  rarity: 6,
  weaponType: 'arts-unit',
  baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
  traits: [
    { key: 'trait1', levelCount: 9 },
    { key: 'trait2', levelCount: 9 },
    { key: 'trait3', levelCount: 9 },
  ],
};
const gearSet: GearSetDefinition = { slug: 'fixture-set' };
const armor: GearDefinition = {
  slug: 'fixture-armor',
  slotType: 'armor',
  levelRequirement: 70,
  baseDefense: 50,
  traits: [],
  gearSetSlug: gearSet.slug,
};
const accessory: GearDefinition = {
  slug: 'fixture-accessory',
  slotType: 'accessory',
  levelRequirement: 70,
  baseDefense: 0,
  traits: [],
  gearSetSlug: gearSet.slug,
};

function createRepository(overrides?: {
  operator?: typeof operator | null;
  weapon?: WeaponDefinition | null;
  gears?: readonly GearDefinition[];
  gearSet?: GearSetDefinition | null;
}) {
  const gears = overrides?.gears ?? [armor, accessory];
  return {
    getOperator: (slug: string) =>
      slug === operator.slug
        ? overrides?.operator === undefined
          ? operator
          : overrides.operator
        : null,
    getWeapon: (slug: string) =>
      slug === weapon.slug ? (overrides?.weapon === undefined ? weapon : overrides.weapon) : null,
    getGear: (slug: string) => gears.find(definition => definition.slug === slug) ?? null,
    getGearSet: (slug: string) =>
      slug === gearSet.slug
        ? overrides?.gearSet === undefined
          ? gearSet
          : overrides.gearSet
        : null,
  };
}

function createTrack(): TrackDocument {
  return {
    operatorBuildId: 'operator:1',
    weaponBuildId: 'weapon:1',
    gearBuildIds: {
      armor: 'gear:armor',
      gloves: null,
      accessory1: 'gear:accessory',
      accessory2: null,
    },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
}

function createProject(): EndaxisProjectDocument {
  const project = createEmptyProject({ createdWith: 'test', gameDataRevision: 'fixture' });
  const scenario = project.scenarios[0]!;
  scenario.builds.operators['operator:1'] = {
    id: 'operator:1',
    operatorSlug: operator.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: {},
    talentStates: {},
  };
  scenario.builds.weapons['weapon:1'] = {
    id: 'weapon:1',
    weaponSlug: weapon.slug,
    level: 90,
    tuned: true,
    potential: 0,
    traitLevels: [1, 1, 1],
  };
  scenario.builds.gears['gear:armor'] = {
    id: 'gear:armor',
    gearSlug: armor.slug,
    artificingLevels: [],
  };
  scenario.builds.gears['gear:accessory'] = {
    id: 'gear:accessory',
    gearSlug: accessory.slug,
    artificingLevels: [],
  };
  scenario.tracks[0] = createTrack();
  return project;
}

describe('validateProjectBuildDefinitionReferences', () => {
  it('accepts definition-backed builds with compatible track equipment', () => {
    expect(validateProjectBuildDefinitionReferences(createProject(), createRepository())).toEqual(
      [],
    );
  });

  it('reports every unknown build definition reference', () => {
    const project = createProject();

    expect(
      validateProjectBuildDefinitionReferences(project, {
        getOperator: () => null,
        getWeapon: () => null,
        getGear: () => null,
        getGearSet: () => null,
      }),
    ).toEqual([
      {
        path: '$.scenarios[0].builds.operators.operator:1.operatorSlug',
        message: 'unknown operator',
      },
      {
        path: '$.scenarios[0].builds.weapons.weapon:1.weaponSlug',
        message: 'unknown weapon',
      },
      {
        path: '$.scenarios[0].builds.gears.gear:armor.gearSlug',
        message: 'unknown gear',
      },
      {
        path: '$.scenarios[0].builds.gears.gear:accessory.gearSlug',
        message: 'unknown gear',
      },
    ]);
  });

  it('rejects missing gear sets and incompatible weapon or gear slots', () => {
    const project = createProject();
    const incompatibleWeapon: WeaponDefinition = {
      ...weapon,
      weaponType: 'sword',
    };
    const misplacedArmor: GearDefinition = {
      ...armor,
      slotType: 'gloves',
    };

    expect(
      validateProjectBuildDefinitionReferences(
        project,
        createRepository({
          weapon: incompatibleWeapon,
          gears: [misplacedArmor, accessory],
          gearSet: null,
        }),
      ),
    ).toEqual([
      {
        path: '$.scenarios[0].builds.gears.gear:armor.gearSlug',
        message: "unknown gear set 'fixture-set'",
      },
      {
        path: '$.scenarios[0].builds.gears.gear:accessory.gearSlug',
        message: "unknown gear set 'fixture-set'",
      },
      {
        path: '$.scenarios[0].tracks[0].weaponBuildId',
        message: "weapon type 'sword' is incompatible with operator weapon type 'arts-unit'",
      },
      {
        path: '$.scenarios[0].tracks[0].gearBuildIds.armor',
        message: "gear slot 'gloves' is incompatible with track slot 'armor'",
      },
    ]);
  });

  it('rejects repositories that return a different definition identity', () => {
    const project = createProject();
    const mismatchedWeapon = { ...weapon, slug: 'different-weapon' };

    expect(
      validateProjectBuildDefinitionReferences(project, {
        ...createRepository(),
        getWeapon: () => mismatchedWeapon,
      }),
    ).toContainEqual({
      path: '$.scenarios[0].builds.weapons.weapon:1.weaponSlug',
      message: 'weapon definition identity mismatch',
    });
  });

  it('validates weapon trait count and equipment level bounds against index definitions', () => {
    const project = createProject();
    const scenario = project.scenarios[0]!;
    scenario.builds.weapons['weapon:1']!.traitLevels = [10, 1];
    const leveledArmor: GearDefinition = {
      ...armor,
      traits: [{ key: 'attribute', levelCount: 4 }],
    };
    scenario.builds.gears['gear:armor']!.artificingLevels = [4];

    expect(
      validateProjectBuildDefinitionReferences(
        project,
        createRepository({ gears: [leveledArmor, accessory] }),
      ),
    ).toEqual([
      {
        path: '$.scenarios[0].builds.weapons.weapon:1.traitLevels',
        message: 'expected 3 weapon trait levels',
      },
      {
        path: '$.scenarios[0].builds.gears.gear:armor.artificingLevels[0]',
        message: 'gear trait level exceeds maximum 3',
      },
    ]);
  });
});
