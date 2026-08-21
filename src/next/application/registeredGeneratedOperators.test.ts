import { describe, expect, it } from 'vitest';
import { ExplicitCriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { createEmptyScenario } from '../core/project/createProject';
import { nextGameDataRepository } from '../data/gameDataRepository';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import { ember, laevatain, yvonne, zhuangFangyi } from '../data/operators';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { runStandardPlayerDamageScenarioSimulation } from './runStandardPlayerDamageScenarioSimulation';

describe('registered generated operators', () => {
  it('runs Laevatain basic attack through the default repository', () => {
    const scenario = createEmptyScenario('scenario:laevatain:registered', '莱万汀默认仓库回归');
    scenario.battle.durationFrames = 120;
    scenario.tracks[0] = {
      id: 'track:laevatain',
      operator: {
        operatorSlug: laevatain.slug,
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
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: laevatain,
      skillGroupKey: 'basicAttack',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:laevatain` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 120,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        index: nextGameDataRepository,
        resources: {
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecoveryPauseDuration: 1.5,
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      },
    });

    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillStarted',
        sourceId: 'track:laevatain',
        data: expect.objectContaining({ skillId: 'basicAttack1' }),
      }),
    );
    expect(
      result.receiptEntries.some(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:laevatain',
      ),
    ).toBe(true);
  });

  it('runs Yvonne basic attack through the default repository', () => {
    const scenario = createEmptyScenario('scenario:yvonne:registered', '伊冯默认仓库回归');
    scenario.battle.durationFrames = 120;
    scenario.tracks[0] = {
      id: 'track:yvonne',
      operator: {
        operatorSlug: yvonne.slug,
        level: 90,
        promoted: true,
        potential: 3,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 2, 1: 2 },
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: yvonne,
      skillGroupKey: 'basicAttack',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:yvonne` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 120,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        index: nextGameDataRepository,
        resources: {
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecoveryPauseDuration: 1.5,
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      },
    });

    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillStarted',
        sourceId: 'track:yvonne',
        data: expect.objectContaining({ skillId: 'basicAttack1' }),
      }),
    );
    expect(
      result.receiptEntries.some(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:yvonne',
      ),
    ).toBe(true);
  });

  it('runs Ember basic attack through the default repository', () => {
    const scenario = createEmptyScenario('scenario:ember:registered', 'Ember 默认仓库回归');
    scenario.battle.durationFrames = 120;
    scenario.tracks[0] = {
      id: 'track:ember',
      operator: {
        operatorSlug: ember.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 1: 2 },
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: ember,
      skillGroupKey: 'basicAttack',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:ember` },
    }).scenario;
    placed.battle.externalEventMarkers = [
      {
        id: 'hit:ember-talent2',
        frame: 0,
        target: { scope: 'operator', trackIndex: 0 },
        event: { kind: 'operatorHit', tags: [], features: [] },
      },
    ];

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 120,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        index: nextGameDataRepository,
        resources: {
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecoveryPauseDuration: 1.5,
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      },
    });

    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillStarted',
        sourceId: 'track:ember',
        data: expect.objectContaining({ skillId: 'basicAttack1' }),
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'ExternalOperatorHitProcessed',
        sourceId: 'enemy',
        targetId: 'track:ember',
      }),
    );
    expect(
      result.receiptEntries.some(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:ember',
      ),
    ).toBe(true);
  });

  it('resolves Zhuang Fangyi ultimate slot replacement and enhanced battle entity damage', () => {
    const scenario = createEmptyScenario('scenario:zhuang-fangyi:registered', '庄方宜默认仓库回归');
    scenario.battle.durationFrames = 300;
    scenario.battle.resourceRules = {
      ...scenario.battle.resourceRules,
      initialSp: 300,
      spRecoveryPerSecond: 0,
    };
    scenario.tracks[0] = {
      id: 'track:zhuang-fangyi',
      operator: {
        operatorSlug: zhuangFangyi.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 2, 1: 2 },
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 240 },
      skillCasts: [],
    };
    let nextId = 0;
    const ids = { allocate: (kind: string) => `${kind}:zhuang-fangyi:${++nextId}` };
    const ultimate = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: zhuangFangyi,
      skillGroupKey: 'ultimate',
      startFrame: 1,
      ids,
    }).scenario;
    const placed = placeSkillGroup({
      scenario: ultimate,
      trackIndex: 0,
      operator: zhuangFangyi,
      skillGroupKey: 'battleSkill',
      startFrame: 100,
      ids,
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 300,
      criticalSamples: new ExplicitCriticalSampleSource(Array(40).fill(1)),
      elementalInflictionDocument: elementalAttachments,
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        index: nextGameDataRepository,
        resources: {
          sharedSpGain: { baseGainEfficiency: 1 },
          spRecoveryPauseDuration: 1.5,
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      },
    });

    expect(
      result.receiptEntries
        .filter(entry => entry.event === 'SkillStarted')
        .map(entry => entry.data?.skillId),
    ).toEqual(['ultimate', 'enhancedBattleSkill']);
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillSlotChanged',
        sourceId: 'track:zhuang-fangyi',
        data: expect.objectContaining({
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'enhancedBattleSkill',
        }),
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'AbilityEntitySpawned',
        sourceId: 'track:zhuang-fangyi',
        data: expect.objectContaining({
          abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_ult',
        }),
      }),
    );
    expect(
      result.receiptEntries.some(
        entry => entry.event === 'SpChanged' && entry.data?.skillId === 'enhancedBattleSkill',
      ),
    ).toBe(false);
    expect(
      result.receiptEntries.some(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:zhuang-fangyi',
      ),
    ).toBe(true);
  });
});
