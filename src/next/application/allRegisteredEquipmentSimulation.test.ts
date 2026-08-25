import { describe, expect, it } from 'vitest';

import type { GearDefinition, WeaponDefinition } from '../core/game-data/equipmentDefinition';
import type { OperatorDefinition } from '../core/game-data/operatorDefinition';
import { createEmptyScenario } from '../core/project/createProject';
import type { TrackDocument } from '../core/project/schema';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import { skillSettings } from '../data/combat/skillSettings';
import { nextGameDataRepository } from '../data/gameDataRepository';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from './scenarioSimulationService';

const weapons = nextGameDataRepository.getWeapons();
const gears = nextGameDataRepository.getGears();
const resources = {
  sharedSpGain: { baseGainEfficiency: 1 },
  spRecoveryPauseDuration: 1.5,
  ultimateEnergySystemUnlocked: true,
  normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
} as const;

describe('所有正式武器与单件装备逐项装配和模拟', () => {
  it('锁定当前仓库的横向覆盖边界', () => {
    expect(weapons).toHaveLength(77);
    expect(gears).toHaveLength(248);
    expect(new Set(weapons.map(definition => definition.slug)).size).toBe(weapons.length);
    expect(new Set(gears.map(definition => definition.slug)).size).toBe(gears.length);
  });

  it.each(weapons)('$slug 可由兼容干员装配并跑完整模拟', async weapon => {
    const operator = requireCompatibleOperator(weapon);
    await expect(simulate(operator, { weapon })).resolves.toBeDefined();
  });

  it.each(gears)('$slug 可装入对应槽位并跑完整模拟', async gear => {
    const operator = requireBasicAttackOperator();
    await expect(simulate(operator, { gear })).resolves.toBeDefined();
  });
});

function simulate(
  operator: OperatorDefinition,
  equipment: { readonly weapon?: WeaponDefinition; readonly gear?: GearDefinition },
) {
  const identity = equipment.weapon?.slug ?? equipment.gear?.slug ?? 'bare';
  const scenario = createEmptyScenario(`audit:equipment:${identity}`, '全配装运行门禁');
  scenario.battle.durationFrames = 300;
  scenario.enemy.editable.hp = 1_000_000_000;
  scenario.battle.resourceRules = {
    maxSp: 1000,
    initialSp: 1000,
    spRecoveryPerSecond: 100,
    defaultSkillSpCost: 100,
  };
  const gears: TrackDocument['gears'] = {
    armor: null,
    gloves: null,
    accessory1: null,
    accessory2: null,
  };
  if (equipment.gear !== undefined) {
    const slot = equipment.gear.slotType === 'accessory' ? 'accessory1' : equipment.gear.slotType;
    gears[slot] = {
      gearSlug: equipment.gear.slug,
      artificingLevels: equipment.gear.traits.map(trait => trait.levelCount - 1),
    };
  }
  scenario.tracks[0] = {
    id: `track:audit:${identity}`,
    operator: {
      operatorSlug: operator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: Object.fromEntries(operator.skillGroups.map(group => [group.key, 12])),
      talentStates: Object.fromEntries(operator.talents.map((_, index) => [index, 0])),
    },
    weapon:
      equipment.weapon === undefined
        ? null
        : {
            weaponSlug: equipment.weapon.slug,
            level: 90,
            tuned: true,
            potential: 0,
            traitLevels: equipment.weapon.traits.map(trait => trait.levelCount),
          },
    gears,
    initialState: { ultimateEnergy: 1000, maxUltimateEnergyOverride: 1000 },
    skillCasts: [],
  };
  const placed = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator,
    skillGroupKey: 'basicAttack',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:equipment-audit:${identity}` },
  }).scenario;
  const service = new ScenarioSimulationService({
    index: nextGameDataRepository,
    repositoryRevision: `${nextGameDataRepository.revision}:all-equipment-audit`,
    resources,
    elementalInflictionDocument: elementalAttachments,
    spellInflictionSettings: skillSettings,
  });
  return service.simulate(placed, 300);
}

function requireCompatibleOperator(weapon: WeaponDefinition): OperatorDefinition {
  const operator = nextGameDataRepository
    .getOperators()
    .find(candidate => candidate.weaponType === weapon.weaponType && hasBasicAttack(candidate));
  if (operator === undefined) {
    throw new Error(`weapon '${weapon.slug}' has no compatible operator with a basic attack`);
  }
  return operator;
}

function requireBasicAttackOperator(): OperatorDefinition {
  const operator = nextGameDataRepository.getOperators().find(hasBasicAttack);
  if (operator === undefined) throw new Error('repository has no operator with a basic attack');
  return operator;
}

function hasBasicAttack(operator: OperatorDefinition): boolean {
  return operator.skillGroups.some(group => group.key === 'basicAttack');
}
