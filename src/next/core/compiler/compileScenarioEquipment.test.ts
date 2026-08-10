import { describe, expect, it } from 'vitest';
import { perlica } from '../../data/operators/perlica';
import type {
  GearDefinition,
  GearSetDefinition,
  WeaponDefinition,
} from '../game-data/equipmentDefinition';
import { createEmptyScenario } from '../project/createProject';
import { compileScenarioEquipment } from './compileScenarioEquipment';

const weapon: WeaponDefinition = {
  slug: 'test-weapon',
  rarity: 6,
  weaponType: perlica.weaponType,
  baseAttackAtLevelNodes: [1, 2, 3, 4, 5, 6],
  traits: [
    {
      key: 'main-attribute',
      levelCount: 2,
      modifiers: [{ kind: 'attribute', attribute: 'main', operation: 'flat', value: [5, 10] }],
    },
  ],
};

function gear(slug: string, slotType: GearDefinition['slotType']): GearDefinition {
  return {
    slug,
    slotType,
    levelRequirement: 1,
    baseDefense: 0,
    gearSetSlug: 'test-set',
    traits: [
      {
        key: 'secondary-attribute',
        levelCount: 2,
        modifiers: [
          { kind: 'attribute', attribute: 'secondary', operation: 'flat', value: [1, 2] },
        ],
      },
    ],
  };
}

const armor = gear('test-armor', 'armor');
const gloves = gear('test-gloves', 'gloves');
const accessory = gear('test-accessory', 'accessory');
const gearSet: GearSetDefinition = {
  slug: 'test-set',
  modifiers: [{ kind: 'panelStat', stat: 'artsIntensity', value: 10 }],
};

function scenario() {
  const value = createEmptyScenario('scenario:equipment', '装备编译样本');
  value.tracks[0] = {
    operator: {
      id: 'perlica',
      operatorSlug: perlica.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: {
      id: 'weapon',
      weaponSlug: weapon.slug,
      level: 90,
      tuned: true,
      potential: 0,
      traitLevels: [2],
    },
    gears: {
      armor: { id: armor.slug, gearSlug: armor.slug, artificingLevels: [1] },
      gloves: { id: gloves.slug, gearSlug: gloves.slug, artificingLevels: [1] },
      accessory1: { id: accessory.slug, gearSlug: accessory.slug, artificingLevels: [1] },
      accessory2: null,
    },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return value;
}

function index() {
  const gears = new Map(
    [armor, gloves, accessory].map(definition => [definition.slug, definition]),
  );
  return {
    getOperator: (slug: string) => (slug === perlica.slug ? perlica : null),
    getWeapon: (slug: string) => (slug === weapon.slug ? weapon : null),
    getGear: (slug: string) => gears.get(slug) ?? null,
    getGearSet: (slug: string) => (slug === gearSet.slug ? gearSet : null),
  };
}

describe('compileScenarioEquipment', () => {
  it('compiles equipped builds, relative attributes, and one active three-piece set', () => {
    const [compiled] = compileScenarioEquipment(scenario(), index());

    expect(compiled!.operatorId).toBe('perlica');
    expect(compiled!.contributions.map(entry => entry.source)).toEqual([
      { kind: 'weaponTrait', slug: weapon.slug, traitKey: 'main-attribute' },
      { kind: 'gearTrait', slug: armor.slug, traitKey: 'secondary-attribute' },
      { kind: 'gearTrait', slug: gloves.slug, traitKey: 'secondary-attribute' },
      { kind: 'gearTrait', slug: accessory.slug, traitKey: 'secondary-attribute' },
      { kind: 'gearSet', slug: gearSet.slug },
    ]);
    expect(compiled!.contributions[0]!.modifiers[0]).toEqual({
      kind: 'attribute',
      attribute: perlica.mainAttribute,
      operation: 'flat',
      value: 10,
    });
    expect(compiled!.contributions[1]!.modifiers[0]).toEqual({
      kind: 'attribute',
      attribute: perlica.secondaryAttribute,
      operation: 'flat',
      value: 2,
    });
    expect(compiled!.contributions.at(-1)!.modifiers[0]).toEqual({
      kind: 'panelStat',
      stat: 'artsIntensity',
      value: 10,
    });
  });

  it('fails closed when an equipped Build has no definition', () => {
    expect(() =>
      compileScenarioEquipment(scenario(), { ...index(), getWeapon: () => null }),
    ).toThrow("weapon definition 'test-weapon' does not exist");
  });

  it('rejects equipment references on a track without an operator', () => {
    const value = scenario();
    value.tracks[0]!.operator = null;

    expect(() => compileScenarioEquipment(value, index())).toThrow(
      'configures equipment without an operator instance',
    );
  });
});
