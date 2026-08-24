import { describe, expect, it } from 'vitest';

import { ExplicitCriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { compileScenarioEquipment } from '../core/compiler/compileScenarioEquipment';
import { createEmptyScenario } from '../core/project/createProject';
import type { ScenarioDocument, TrackDocument } from '../core/project/schema';
import { nextGearDefinitions } from '../data/equipment';
import { nextGameDataRepository } from '../data/gameDataRepository';
import { perlicaGeneratedOperator } from '../data/operators/generated/perlica.operator.generated';
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
