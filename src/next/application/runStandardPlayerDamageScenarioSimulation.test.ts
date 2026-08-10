import { describe, expect, it } from 'vitest';
import { ExplicitCriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { createEmptyScenario } from '../core/project/createProject';
import { perlica } from '../data/operators/perlica';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { StandardPlayerDamageCompatibilityError } from '../core/combat/runtime/standardPlayerDamageCompatibility';
import { runStandardPlayerDamageScenarioSimulation } from './runStandardPlayerDamageScenarioSimulation';

function createPerlicaScenario() {
  const scenario = createEmptyScenario('scenario:standard-damage', '标准伤害样本');

  scenario.tracks[0] = {
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
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return scenario;
}

function standardOptions() {
  return {
    index: {
      getOperator: (slug: string) => (slug === perlica.slug ? perlica : null),
      getWeapon: () => null,
      getGear: () => null,
      getGearSet: () => null,
    },
    resources: {
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecoveryPauseDuration: 1.5,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.5, otherGainPerSp: 0.25 },
    },
  };
}

describe('runStandardPlayerDamageScenarioSimulation', () => {
  it('compiles a placed pure-damage skill and returns enemy health from the same runtime', () => {
    const scenario = createPerlicaScenario();
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'plungingAttack',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:1` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 4,
      criticalSamples: new ExplicitCriticalSampleSource([1]),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: standardOptions(),
    });

    const damage = result.receiptEntries.find(entry => entry.event === 'DamageApplied');
    expect(damage).toBeDefined();
    expect(damage?.data?.value).toBeCloseTo(635.4);
    expect(result.finalEnemyHealth).toBeCloseTo(result.enemy.health - 635.4);
    expect(damage?.data?.remainingHealth).toBe(result.finalEnemyHealth);
  });

  it('rejects an unsupported scheduled skill before consuming runtime dependencies', () => {
    const placed = placeSkillGroup({
      scenario: createPerlicaScenario(),
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:1` },
    }).scenario;
    let criticalSampleCalls = 0;
    let runtimeSnapshotCalls = 0;

    expect(() =>
      runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 60,
        criticalSamples: {
          nextCriticalSample: () => {
            criticalSampleCalls += 1;
            return 1;
          },
        },
        resolveNonRandomRuntimeSnapshot: () => {
          runtimeSnapshotCalls += 1;
          return {
            runtimeExtensionMultiplier: 1,
            appliesIgniteDamageMultiplier: false,
            appliesPhysicalInflictionDamageMultiplier: false,
          };
        },
        options: standardOptions(),
      }),
    ).toThrow(StandardPlayerDamageCompatibilityError);
    expect(criticalSampleCalls).toBe(0);
    expect(runtimeSnapshotCalls).toBe(0);
  });

  it('executes a battle skill with the installed elemental infliction and poise runtimes', () => {
    const placed = placeSkillGroup({
      scenario: createPerlicaScenario(),
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:1` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 60,
      criticalSamples: new ExplicitCriticalSampleSource([1]),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      elementalInflictionDocument: elementalAttachments,
      options: standardOptions(),
    });

    expect(result.receiptEntries.some(entry => entry.event === 'DamageApplied')).toBe(true);
    const infliction = result.receiptEntries.find(
      entry => entry.event === 'ElementalInflictionApplied',
    );
    expect(infliction?.data?.requestedElement).toBe('electric');
    expect(infliction?.data?.outcomeKind).toBe('attachmentOnly');
    const poise = result.receiptEntries.find(entry => entry.event === 'PoiseApplied');
    expect(poise?.data?.currentPoise).toBe(290);
  });
});
