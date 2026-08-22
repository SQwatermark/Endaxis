import { describe, expect, it } from 'vitest';
import { ExplicitCriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { compileOperatorEntityBlackboardInitialValues } from '../core/compiler/compileScenarioRuntimeAssembly';
import { compileOperatorDefinitionSkills } from '../core/compiler/compileScenarioTimeline';
import { resolveOperatorPanel } from '../core/compiler/resolveOperatorPanel';
import { resolveScenarioBuilds } from '../core/compiler/resolveScenarioBuilds';
import { createEmptyScenario } from '../core/project/createProject';
import { nextGameDataRepository } from '../data/gameDataRepository';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import {
  arcane,
  camille,
  ember,
  laevatain,
  perlica,
  pogranichnik,
  snowshine,
  yvonne,
  zhuangFangyi,
} from '../data/operators';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { runStandardPlayerDamageScenarioSimulation } from './runStandardPlayerDamageScenarioSimulation';

describe('registered generated operators', () => {
  it('runs Arcane intellect-form battle entities and compiles the conditional combo cooldown', () => {
    const scenario = createEmptyScenario('scenario:arcane:registered', 'Arcane 默认仓库回归');
    scenario.battle.durationFrames = 180;
    scenario.tracks[0] = {
      id: 'track:arcane',
      operator: {
        operatorSlug: arcane.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 2 },
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: arcane,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:arcane` },
    }).scenario;

    const [build] = resolveScenarioBuilds(placed, nextGameDataRepository);
    if (build === undefined) throw new Error('missing Arcane resolved build');
    const panel = resolveOperatorPanel(build);
    const allSkills = compileOperatorDefinitionSkills(
      build.track.id,
      build.operatorInstance,
      build.operator,
      nextGameDataRepository.getCommonAbilityEntityDefinitions?.() ?? {},
      panel.attributes,
    );
    expect(allSkills.find(skill => skill.skillId === 'comboSkill')?.cooldownFrames).toBe(360);
    expect(compileOperatorEntityBlackboardInitialValues(build.operator, panel)).toMatchObject({
      EntityBB_wisd_greater_will: 1,
    });

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 180,
      criticalSamples: new ExplicitCriticalSampleSource(Array(80).fill(1)),
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
      result.receiptEntries.filter(
        entry =>
          entry.event === 'SkillStarted' &&
          entry.sourceId === 'track:arcane' &&
          entry.data?.skillId === 'battleSkill',
      ),
    ).toHaveLength(1);
    expect(
      result.receiptEntries.filter(
        entry =>
          entry.event === 'AbilityEntitySpawned' &&
          entry.sourceId === 'track:arcane' &&
          entry.data?.abilityEntityId === 'abilityentity_chr_0032_lizhiyan_normal_skill',
      ),
    ).toHaveLength(1);
    expect(
      result.receiptEntries.some(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:arcane',
      ),
    ).toBe(true);
  });

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

  it('runs Pogranichnik physical infliction, SP talent, and ultimate soldiers', () => {
    const run = (talentLevel: 0 | 2) => {
      const scenario = createEmptyScenario(
        `scenario:pogranichnik:${talentLevel}`,
        '波格兰尼奇默认仓库回归',
      );
      scenario.battle.durationFrames = 500;
      scenario.battle.resourceRules = {
        ...scenario.battle.resourceRules,
        initialSp: 300,
        spRecoveryPerSecond: 0,
      };
      scenario.tracks[0] = {
        id: 'track:pogranichnik',
        operator: {
          operatorSlug: pogranichnik.slug,
          level: 90,
          promoted: true,
          potential: 0,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: talentLevel === 0 ? {} : { 0: talentLevel },
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 90 },
        skillCasts: [],
      };
      let nextId = 0;
      const ids = { allocate: (kind: string) => `${kind}:pogranichnik:${++nextId}` };
      const ultimate = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: pogranichnik,
        skillGroupKey: 'ultimate',
        startFrame: 1,
        ids,
      }).scenario;
      const battle = placeSkillGroup({
        scenario: ultimate,
        trackIndex: 0,
        operator: pogranichnik,
        skillGroupKey: 'battleSkill',
        startFrame: 120,
        ids,
      }).scenario;
      const combo = placeSkillGroup({
        scenario: battle,
        trackIndex: 0,
        operator: pogranichnik,
        skillGroupKey: 'comboSkill',
        startFrame: 180,
        ids,
      }).scenario;
      const placed = placeSkillGroup({
        scenario: combo,
        trackIndex: 0,
        operator: pogranichnik,
        skillGroupKey: 'basicAttack',
        startFrame: 260,
        ids,
      }).scenario;

      return runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 500,
        criticalSamples: new ExplicitCriticalSampleSource(Array(80).fill(1)),
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        options: {
          index: nextGameDataRepository,
          resources: {
            sharedSpGain: { baseGainEfficiency: 20 },
            spRecoveryPauseDuration: 1.5,
            ultimateEnergySystemUnlocked: true,
            normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
          },
        },
      });
    };

    const withoutTalent = run(0);
    const withTalent = run(2);
    const basicDamage = (result: typeof withTalent) =>
      result.receiptEntries.find(
        entry =>
          entry.event === 'DamageApplied' && String(entry.data?.stepKey).includes('basicAttack1'),
      )?.data?.value;

    expect(basicDamage(withoutTalent)).toBeTypeOf('number');
    expect(basicDamage(withTalent)).toBeTypeOf('number');
    expect(Number(basicDamage(withTalent))).toBeGreaterThan(Number(basicDamage(withoutTalent)));
    const soldiers = withTalent.receiptEntries.filter(
      entry =>
        entry.event === 'AbilityEntitySpawned' &&
        entry.data?.abilityEntityId === 'abilityentity_chr_0029_pograni_ultimate_skill',
    );
    expect(soldiers).toHaveLength(8);
    expect(
      soldiers.filter(entry => String(entry.data?.childSkillId).endsWith('_finish4')),
    ).toHaveLength(4);
    expect(
      soldiers.filter(
        entry => entry.data?.childSkillId === 'chr_0029_pograni_ultimate_skill_abilityentity',
      ),
    ).toHaveLength(4);
    expect(
      withTalent.receiptEntries.some(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:pogranichnik',
      ),
    ).toBe(true);
  });

  it('routes Camille battle skill through her ultimate transformation and restores the slot', () => {
    const scenario = createEmptyScenario('scenario:camille:registered', '卡米拉默认仓库回归');
    scenario.battle.durationFrames = 360;
    scenario.battle.resourceRules = {
      ...scenario.battle.resourceRules,
      initialSp: 300,
      spRecoveryPerSecond: 0,
    };
    scenario.tracks[0] = {
      id: 'track:camille',
      operator: {
        operatorSlug: camille.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 2 },
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 130 },
      skillCasts: [],
    };
    let nextId = 0;
    const ids = { allocate: (kind: string) => `${kind}:camille:${++nextId}` };
    const ultimate = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: camille,
      skillGroupKey: 'ultimate',
      startFrame: 1,
      ids,
    }).scenario;
    const placed = placeSkillGroup({
      scenario: ultimate,
      trackIndex: 0,
      operator: camille,
      skillGroupKey: 'battleSkill',
      startFrame: 180,
      ids,
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 360,
      criticalSamples: new ExplicitCriticalSampleSource(Array(80).fill(1)),
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
    ).toEqual(['ultimate', 'battleSkillDuringUltimate']);
    const slotChanges = result.receiptEntries
      .filter(entry => entry.event === 'SkillSlotChanged' && entry.sourceId === 'track:camille')
      .map(entry => entry.data?.targetSkillKey);
    expect(slotChanges).toEqual(['battleSkillDuringUltimate', 'battleSkill']);
    expect(
      result.receiptEntries.some(
        entry =>
          entry.event === 'SpChanged' &&
          entry.sourceId === 'track:camille' &&
          entry.data?.skillId === 'battleSkillDuringUltimate' &&
          entry.data?.requestedValue === -40,
      ),
    ).toBe(true);
    expect(
      result.receiptEntries.some(
        entry =>
          entry.event === 'DamageApplied' &&
          entry.sourceId === 'track:camille' &&
          String(entry.data?.stepKey).includes('comboSkill2'),
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

  it('runs Snowshine combo ability entity and records full-health healing', () => {
    const scenario = createEmptyScenario('scenario:snowshine:registered', '雪绒默认仓库回归');
    scenario.battle.durationFrames = 150;
    scenario.tracks[0] = {
      id: 'track:snowshine',
      operator: {
        operatorSlug: snowshine.slug,
        level: 90,
        promoted: true,
        potential: 5,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 2, 1: 2 },
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    scenario.tracks[1] = {
      id: 'track:perlica',
      operator: {
        operatorSlug: perlica.slug,
        level: 90,
        promoted: true,
        potential: 5,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 1, 1: 1 },
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: snowshine,
      skillGroupKey: 'comboSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:snowshine` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 150,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
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
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
          ultimateEnergySystemUnlocked: false,
        },
      },
    });

    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'AbilityEntitySpawned',
        sourceId: 'track:snowshine',
        data: expect.objectContaining({
          abilityEntityId: 'abilityentity_chr_0014_aurora_combo_skill',
        }),
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'HealingApplied',
        sourceId: 'track:snowshine',
        targetId: 'track:perlica',
        data: expect.objectContaining({ actualHealing: 0 }),
      }),
    );
  });
});
