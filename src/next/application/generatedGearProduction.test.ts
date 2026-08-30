import { describe, expect, it } from 'vitest';

import { ExplicitCriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { compileScenarioEquipment } from '../core/compiler/compileScenarioEquipment';
import { createEmptyScenario } from '../core/project/createProject';
import type { ScenarioDocument, TrackDocument } from '../core/project/schema';
import { nextGearDefinitions } from '../data/equipment';
import { nextGameDataRepository } from '../data/gameDataRepository';
import { perlica as perlicaGeneratedOperator } from '../data/operators/perlica';
import { pogranichnik as pogranichnikGeneratedOperator } from '../data/operators/pogranichnik';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { runStandardPlayerDamageScenarioSimulation } from './runStandardPlayerDamageScenarioSimulation';

const CANONICAL_GEAR_SLUG = 'item_equip_t4_suit_burst01_edc_02';
const LEGACY_GEAR_SLUG = 'turbid-cutting-torch';

describe('generated gear production integration', () => {
  it('compiles every current native gear at its highest available artificing levels', () => {
    const current = nextGearDefinitions.filter(definition => definition.slug.startsWith('item_'));

    for (const definition of current) {
      const levels = definition.traits.map(trait => trait.levelCount - 1);
      const [compiled] = compileScenarioEquipment(
        createScenarioWithGear(definition.slug, definition.slotType, levels),
        nextGameDataRepository,
      );
      expect(compiled?.contributions, definition.slug).toHaveLength(definition.traits.length);
      for (const contribution of compiled?.contributions ?? []) {
        expect(contribution.source, definition.slug).toMatchObject({
          kind: 'gearTrait',
          slug: definition.slug,
        });
        for (const modifier of contribution.modifiers) {
          expect(Number.isFinite(modifier.value), definition.slug).toBe(true);
        }
      }
    }
    expect(current).toHaveLength(243);
  });

  it('resolves canonical and legacy identities and applies the selected native artificing level to damage', () => {
    const low = runWithGear(CANONICAL_GEAR_SLUG, 0);
    const high = runWithGear(CANONICAL_GEAR_SLUG, 3);
    const legacyHigh = runWithGear(LEGACY_GEAR_SLUG, 3);

    expect(high.finalEnemyHealth).toBeLessThan(low.finalEnemyHealth);
    expect(legacyHigh.finalEnemyHealth).toBe(high.finalEnemyHealth);
    expect(nextGameDataRepository.getGear(LEGACY_GEAR_SLUG)).toMatchObject({
      slug: LEGACY_GEAR_SLUG,
      traits: [
        expect.anything(),
        expect.anything(),
        expect.objectContaining({
          modifiers: [
            expect.objectContaining({
              kind: 'damageScale',
              target: 'normalAttack',
              value: [0.27599999999999997, 0.3036, 0.33119999999999994, 0.35879999999999995],
            }),
          ],
        }),
      ],
    });
  });

  it('refunds SP for only the first battle skill with the generated ultimate-energy set', () => {
    const scenario = createEmptyScenario('scenario:ultimate-set', '终结技能量套生产回归');
    scenario.battle.durationFrames = 300;
    scenario.battle.resourceRules.maxSp = 400;
    scenario.battle.resourceRules.initialSp = 200;
    scenario.enemy.editable.hp = 10_000_000;
    scenario.tracks[0] = {
      id: 'track:pogranichnik-ultimate-set',
      operator: {
        operatorSlug: pogranichnikGeneratedOperator.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 0, 1: 0 },
      },
      weapon: null,
      gears: {
        armor: {
          gearSlug: 'item_equip_t3_suit_usp01_body_01',
          artificingLevels: [0, 0, 0],
        },
        gloves: {
          gearSlug: 'item_equip_t3_suit_usp01_hand_01',
          artificingLevels: [0, 0, 0],
        },
        accessory1: {
          gearSlug: 'item_equip_t3_suit_usp01_edc_03',
          artificingLevels: [0, 0, 0],
        },
        accessory2: null,
      },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    let placed = scenario;
    let nextId = 0;
    for (const startFrame of [1, 181]) {
      placed = placeSkillGroup({
        scenario: placed,
        trackIndex: 0,
        operator: pogranichnikGeneratedOperator,
        skillGroupKey: 'battleSkill',
        startFrame,
        ids: { allocate: kind => `${kind}:ultimate-set:${++nextId}` },
      }).scenario;
    }

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      options: {
        index: nextGameDataRepository,
        resources: {
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecoveryPauseDuration: 1.5,
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      },
      endFrame: 300,
      criticalSamples: new ExplicitCriticalSampleSource(Array.from({ length: 40 }, () => 1)),
      elementalInflictionDocument: elementalAttachments,
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
    });

    expect(
      result.receiptEntries.filter(
        entry =>
          entry.event === 'SpChanged' &&
          entry.data?.gainKind === 'refund' &&
          entry.data?.baseValue === 50,
      ),
    ).toHaveLength(1);
  });

  it('runs the physical-status set proc once while its 15-second marker is active', () => {
    const scenario = createEmptyScenario('scenario:physical-set', '物理异常套装生产回归');
    scenario.battle.durationFrames = 260;
    scenario.battle.resourceRules.maxSp = 400;
    scenario.battle.resourceRules.initialSp = 400;
    scenario.enemy.editable.hp = 10_000_000;
    scenario.tracks[0] = {
      id: 'track:pogranichnik',
      operator: {
        operatorSlug: pogranichnikGeneratedOperator.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 0, 1: 0 },
      },
      weapon: null,
      gears: {
        armor: {
          gearSlug: 'item_equip_t4_suit_phy01_body_01',
          artificingLevels: [0, 0, 0],
        },
        gloves: {
          gearSlug: 'item_equip_t4_suit_phy01_hand_01',
          artificingLevels: [0, 0, 0],
        },
        accessory1: {
          gearSlug: 'item_equip_t4_suit_phy01_edc_01',
          artificingLevels: [0, 0],
        },
        accessory2: null,
      },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    let placed = scenario;
    let nextId = 0;
    for (const startFrame of [1, 61, 121, 181]) {
      placed = placeSkillGroup({
        scenario: placed,
        trackIndex: 0,
        operator: pogranichnikGeneratedOperator,
        skillGroupKey: 'battleSkill',
        startFrame,
        ids: { allocate: kind => `${kind}:physical-set:${++nextId}` },
      }).scenario;
    }

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      options: {
        index: nextGameDataRepository,
        resources: {
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecoveryPauseDuration: 1.5,
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      },
      endFrame: 260,
      criticalSamples: new ExplicitCriticalSampleSource(Array.from({ length: 40 }, () => 1)),
      elementalInflictionDocument: elementalAttachments,
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
    });
    const setProcDamage = result.receiptEntries.filter(
      entry =>
        entry.event === 'DamageApplied' &&
        entry.data?.castId === 'upgrade-initialization:gear-set:suit_phy01',
    );
    expect(setProcDamage).toHaveLength(1);
    expect(setProcDamage[0]).toMatchObject({
      sourceId: 'track:pogranichnik',
      targetId: 'enemy',
      data: { damageType: 'physical', skillMultiplierPercent: 250 },
    });
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'PoiseApplied',
        sourceId: 'track:pogranichnik',
        targetId: 'enemy',
        data: expect.objectContaining({ calculationValue: 10 }),
      }),
    );
  });

  it('applies the generated fracture/crush set Buff during a physical infliction chain', () => {
    const scenario = createEmptyScenario('scenario:crush-fracture-set', '碎甲猛击套生产回归');
    scenario.battle.durationFrames = 260;
    scenario.battle.resourceRules.maxSp = 400;
    scenario.battle.resourceRules.initialSp = 400;
    scenario.enemy.editable.hp = 10_000_000;
    scenario.tracks[0] = {
      id: 'track:pogranichnik',
      operator: {
        operatorSlug: pogranichnikGeneratedOperator.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 0, 1: 0 },
      },
      weapon: null,
      gears: {
        armor: {
          gearSlug: 'item_equip_t4_suit_crush_fracture_body_01',
          artificingLevels: [0, 0, 0],
        },
        gloves: {
          gearSlug: 'item_equip_t4_suit_crush_fracture_hand_01',
          artificingLevels: [0, 0, 0],
        },
        accessory1: {
          gearSlug: 'item_equip_t4_suit_crush_fracture_edc_01',
          artificingLevels: [0, 0, 0],
        },
        accessory2: null,
      },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    let placed = scenario;
    let nextId = 0;
    for (const startFrame of [1, 61, 121, 181]) {
      placed = placeSkillGroup({
        scenario: placed,
        trackIndex: 0,
        operator: pogranichnikGeneratedOperator,
        skillGroupKey: 'battleSkill',
        startFrame,
        ids: { allocate: kind => `${kind}:crush-fracture-set:${++nextId}` },
      }).scenario;
    }

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      options: {
        index: nextGameDataRepository,
        resources: {
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecoveryPauseDuration: 1.5,
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      },
      endFrame: 260,
      criticalSamples: new ExplicitCriticalSampleSource(Array.from({ length: 40 }, () => 1)),
      elementalInflictionDocument: elementalAttachments,
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
    });

    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'BuffApplied',
        sourceId: 'track:pogranichnik',
        targetId: 'track:pogranichnik',
        data: expect.objectContaining({
          buffId: 'buff_equipsuit_crush_fracture_physicdamage',
        }),
      }),
    );
  });
});

function runWithGear(gearSlug: string, damageTraitLevel: number) {
  const scenario = createScenarioWithGear(gearSlug, 'accessory', [0, 0, damageTraitLevel]);
  const placed = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: perlicaGeneratedOperator,
    skillGroupKey: 'basicAttack',
    startFrame: 1,
    ids: { allocate: (kind: string) => `${kind}:generated-gear` },
  }).scenario;

  return runStandardPlayerDamageScenarioSimulation({
    scenario: placed,
    options: {
      index: nextGameDataRepository,
      resources: {
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecoveryPauseDuration: 1.5,
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
      },
    },
    endFrame: 100,
    criticalSamples: new ExplicitCriticalSampleSource(Array.from({ length: 20 }, () => 1)),
    resolveNonRandomRuntimeSnapshot: () => ({
      runtimeExtensionMultiplier: 1,
      appliesIgniteDamageMultiplier: false,
      appliesPhysicalInflictionDamageMultiplier: false,
    }),
  });
}

function createScenarioWithGear(
  gearSlug: string,
  slotType: 'armor' | 'gloves' | 'accessory',
  artificingLevels: readonly number[],
): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:generated-gear', '生成装备生产回归');
  const gears: TrackDocument['gears'] = {
    armor: null,
    gloves: null,
    accessory1: null,
    accessory2: null,
  };
  const slot = slotType === 'accessory' ? 'accessory1' : slotType;
  gears[slot] = { gearSlug, artificingLevels: [...artificingLevels] };
  scenario.tracks[0] = {
    id: 'track:0',
    operator: {
      operatorSlug: perlicaGeneratedOperator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears,
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return scenario;
}
