import { describe, expect, it } from 'vitest';
import { ExplicitCriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { ExplicitProbabilitySampleSource } from '../core/combat/random/probabilitySampleSource';
import type { SkillDefinition } from '../core/game-data/operatorDefinition';
import { compileOperatorEntityBlackboardInitialValues } from '../core/compiler/compileScenarioRuntimeAssembly';
import { compileOperatorDefinitionSkills } from '../core/compiler/compileScenarioTimeline';
import { resolveOperatorPanel } from '../core/compiler/resolveOperatorPanel';
import { resolveScenarioBuilds } from '../core/compiler/resolveScenarioBuilds';
import { createEmptyScenario } from '../core/project/createProject';
import { nextGameDataRepository } from '../data/gameDataRepository';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import { scheduled, sequence, step } from '../data/operators/definitionHelpers';
import {
  alesh,
  antal,
  arcane,
  camille,
  chenQianyu,
  daPan,
  ember,
  fluorite,
  laevatain,
  perlica,
  pogranichnik,
  snowshine,
  wulfgard,
  xaihi,
  yvonne,
  zhuangFangyi,
} from '../data/operators';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { runStandardPlayerDamageScenarioSimulation } from './runStandardPlayerDamageScenarioSimulation';

describe('registered generated operators', () => {
  it('applies Xaihi ultimate Crystal enhancement to a later basic attack', () => {
    expect(
      xaihi.buffDefinitions?.['buff_chr_0011_seraph_atk_buff']?.childPresentations?.map(
        child => child.buffId,
      ),
    ).toEqual(['buff_chr_0011_seraph_ultimate_effect', 'buff_chr_0011_seraph_ultimate_effect_2']);
    const run = (withUltimate: boolean) => {
      const scenario = createEmptyScenario(`scenario:xaihi:${withUltimate}`, '熙海终结技增幅回归');
      scenario.battle.durationFrames = 180;
      scenario.enemy.editable.hp = 10_000_000;
      scenario.tracks[0] = {
        id: 'track:xaihi',
        operator: {
          operatorSlug: xaihi.slug,
          level: 90,
          promoted: true,
          potential: 0,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: { 0: 0, 1: 0 },
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 80 },
        skillCasts: [],
      };
      let nextId = 0;
      const ids = { allocate: (kind: string) => `${kind}:xaihi:${++nextId}` };
      let placed = scenario;
      if (withUltimate) {
        placed = placeSkillGroup({
          scenario: placed,
          trackIndex: 0,
          operator: xaihi,
          skillGroupKey: 'ultimate',
          startFrame: 1,
          ids,
        }).scenario;
      }
      placed = placeSkillGroup({
        scenario: placed,
        trackIndex: 0,
        operator: xaihi,
        skillGroupKey: 'basicAttack',
        startFrame: 100,
        ids,
      }).scenario;
      return runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 180,
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
            ultimateEnergySystemUnlocked: true,
          },
        },
      });
    };

    const damage = (result: ReturnType<typeof run>) =>
      Number(
        result.receiptEntries.find(
          entry =>
            entry.event === 'DamageApplied' &&
            entry.sourceId === 'track:xaihi' &&
            entry.frame >= 100,
        )?.data?.value,
      );
    const base = damage(run(false));
    const enhanced = damage(run(true));

    expect(base).toBeGreaterThan(0);
    expect(enhanced).toBeGreaterThan(base);
  });

  it('applies Chen talent 2 poise damage from an explicit weakness-window output fact', () => {
    const scenario = createEmptyScenario('scenario:chen:talent2', '陈千语天赋二回归');
    scenario.battle.durationFrames = 2;
    scenario.enemy.editable.stagger.maximum = 100;
    scenario.tracks[0] = {
      id: 'track:chen',
      operator: {
        operatorSlug: chenQianyu.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: { 0: 0, 1: 2 },
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    scenario.battle.externalEventMarkers = [
      {
        id: 'weakness:chen',
        frame: 0,
        target: { scope: 'operator', trackIndex: 0 },
        event: { kind: 'operatorWeaknessTriggeredOutput' },
      },
    ];
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: chenQianyu,
      skillGroupKey: 'basicAttack',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:chen` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 1,
      criticalSamples: new ExplicitCriticalSampleSource([]),
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
        event: 'ExternalOperatorWeaknessTriggeredOutputProcessed',
        sourceId: 'track:chen',
        targetId: 'enemy',
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'PoiseApplied',
        sourceId: 'track:chen',
        targetId: 'enemy',
        data: expect.objectContaining({ calculatedDamage: 10, currentPoise: 90 }),
      }),
    );
  });

  it('lets Da Pan Crush consume no-guard before the same-frame hit and activate talent 1', () => {
    const run = (talentLevel: number) => {
      const scenario = createEmptyScenario(`scenario:dapan:${talentLevel}`, '大潘压制天赋回归');
      scenario.battle.durationFrames = 660;
      scenario.enemy.editable.hp = 10_000_000;
      scenario.tracks[0] = {
        id: 'track:dapan',
        operator: {
          operatorSlug: daPan.slug,
          level: 90,
          promoted: true,
          potential: 0,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: { 0: talentLevel, 1: 0 },
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [],
      };
      let nextId = 0;
      const ids = { allocate: (kind: string) => `${kind}:dapan:${++nextId}` };
      const first = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: daPan,
        skillGroupKey: 'comboSkill',
        startFrame: 1,
        ids,
      }).scenario;
      const placed = placeSkillGroup({
        scenario: first,
        trackIndex: 0,
        operator: daPan,
        skillGroupKey: 'comboSkill',
        startFrame: 550,
        ids,
      }).scenario;
      return runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 660,
        criticalSamples: new ExplicitCriticalSampleSource(Array(80).fill(1)),
        elementalInflictionDocument: elementalAttachments,
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: true,
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
    };

    const withoutTalent = run(0);
    const withTalent = run(2);
    const secondComboDamage = (result: ReturnType<typeof run>) => {
      const value = result.receiptEntries.find(
        entry =>
          entry.event === 'DamageApplied' &&
          entry.sourceId === 'track:dapan' &&
          entry.frame >= 572 &&
          String(entry.data?.stepKey).includes('comboSkill'),
      )?.data?.value;
      return typeof value === 'number' ? value : undefined;
    };

    const baseline = secondComboDamage(withoutTalent);
    expect(baseline).toBeTypeOf('number');
    expect(secondComboDamage(withTalent)).toBeCloseTo((baseline ?? 0) * 1.06);
  });

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

  it('activates Laevatain fire-resistance ignore after absorbing four heat attachments', () => {
    const run = (talentLevel: 1 | 3) => {
      const scenario = createEmptyScenario(
        `scenario:laevatain:talent1:${talentLevel}`,
        '莱万汀天赋一默认仓库回归',
      );
      scenario.battle.durationFrames = 180;
      scenario.enemy.editable.resistances.heat = 50;
      scenario.tracks[0] = {
        id: 'track:laevatain',
        operator: {
          operatorSlug: laevatain.slug,
          level: 90,
          promoted: true,
          potential: 0,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: { 0: talentLevel },
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
        skillKey: 'basicAttack1',
        startFrame: 1,
        ids: { allocate: kind => `${kind}:laevatain:talent1:${talentLevel}` },
      }).scenario;
      const cast = placed.tracks[0]?.skillCasts[0];
      if (cast === undefined) throw new Error('missing Laevatain test cast');
      const attachmentAndHit = (key: string): SkillDefinition => ({
        key: 'basicAttack1',
        sourceSkillId: 'test_laevatain_talent_1_attachment',
        timelineBlockFrames: 1,
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('applyElementalInfliction', { element: 'heat', isExtra: false }),
              step(
                'dealDamage',
                {
                  damageType: 'heat',
                  attackScale: 1,
                  tags: ['normalAttack', 'normalAttackLastCombo'],
                },
                key,
              ),
            ),
          ),
        ],
      });
      const probe: SkillDefinition = {
        key: 'basicAttack1',
        sourceSkillId: 'test_laevatain_talent_1_probe',
        timelineBlockFrames: 1,
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step(
                'dealDamage',
                { damageType: 'heat', attackScale: 1, tags: ['normalAttack'] },
                'probe',
              ),
            ),
          ),
        ],
      };
      const track = placed.tracks[0];
      if (track === null) throw new Error('missing Laevatain test track');
      track.skillCasts = [1, 32, 63, 94].map((startFrame, index) => ({
        ...cast,
        id: `skillCast:laevatain:talent1:${talentLevel}:absorb:${index + 1}`,
        placement: { startFrame },
        customDefinition: attachmentAndHit(`absorb:${index + 1}`),
      }));
      track.skillCasts.push({
        ...cast,
        id: `skillCast:laevatain:talent1:${talentLevel}:probe`,
        placement: { startFrame: 125 },
        customDefinition: probe,
      });

      const result = runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 180,
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
            ultimateEnergySystemUnlocked: true,
            normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
          },
        },
      });
      const damage = result.receiptEntries.filter(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:laevatain',
      );
      return damage.at(-1)?.data?.value as number | undefined;
    };

    const level1 = run(1);
    const level3 = run(3);
    expect(level1).toBeTypeOf('number');
    expect(level3).toBeTypeOf('number');
    expect(level3!).toBeGreaterThan(level1!);
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

  it('applies Fluorite talent 2 only when the external hit type and patched probability match', () => {
    const run = (potential: 1 | 2) => {
      const scenario = createEmptyScenario(
        `scenario:fluorite:talent2:${potential}`,
        '萤石天赋二默认仓库回归',
      );
      scenario.battle.durationFrames = 120;
      scenario.tracks[0] = {
        id: 'track:fluorite',
        operator: {
          operatorSlug: fluorite.slug,
          level: 90,
          promoted: true,
          potential,
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
        operator: fluorite,
        skillGroupKey: 'basicAttack',
        startFrame: 1,
        ids: { allocate: kind => `${kind}:fluorite:${potential}` },
      }).scenario;
      placed.battle.externalEventMarkers = [
        {
          id: `hit:fluorite:${potential}`,
          frame: 0,
          target: { scope: 'operator', trackIndex: 0 },
          event: { kind: 'operatorHit', damageType: 'heat', tags: [], features: [] },
        },
      ];

      const result = runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 120,
        criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
        probabilitySamples: new ExplicitProbabilitySampleSource([0.25]),
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
      return result.receiptEntries.find(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:fluorite',
      )?.data?.value as number | undefined;
    };

    const withoutPotential2 = run(1);
    const withPotential2 = run(2);
    expect(withoutPotential2).toBeTypeOf('number');
    expect(withPotential2).toBeTypeOf('number');
    expect(withPotential2!).toBeGreaterThan(withoutPotential2!);
  });

  it('reduces Fluorite combo cooldown once when her nature infliction reaches the enemy', () => {
    const run = (potential: 4 | 5) => {
      const scenario = createEmptyScenario(
        `scenario:fluorite:potential5:${potential}`,
        '萤石潜能五默认仓库回归',
      );
      scenario.battle.durationFrames = 1175;
      scenario.tracks[0] = {
        id: 'track:fluorite',
        operator: {
          operatorSlug: fluorite.slug,
          level: 90,
          promoted: true,
          potential,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: {},
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [],
      };
      let placed = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: fluorite,
        skillGroupKey: 'comboSkill',
        startFrame: 1,
        ids: { allocate: kind => `${kind}:fluorite:${potential}:first` },
      }).scenario;
      placed = placeSkillGroup({
        scenario: placed,
        trackIndex: 0,
        operator: fluorite,
        skillGroupKey: 'comboSkill',
        startFrame: 1128,
        ids: { allocate: kind => `${kind}:fluorite:${potential}:second` },
      }).scenario;
      const comboDefinition = fluorite.skillGroups.find(group => group.key === 'comboSkill')
        ?.skills as SkillDefinition | undefined;
      if (comboDefinition === undefined) {
        throw new Error('missing Fluorite combo definition');
      }
      placed.tracks[0]!.skillCasts.forEach(cast => {
        cast.customDefinition = {
          ...comboDefinition,
          blackboard: { ...comboDefinition.blackboard, EntityBB_combo_index: 2 },
        };
      });

      return runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 1175,
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
            ultimateEnergySystemUnlocked: true,
            normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
          },
        },
      }).receiptEntries;
    };

    const unavailable = (potential: 4 | 5) =>
      run(potential).some(
        entry =>
          entry.event === 'SkillCooldownUnavailableAtStart' &&
          entry.sourceId === 'track:fluorite' &&
          entry.data?.castId === 'skillCast:fluorite:' + potential + ':second',
      );

    expect(unavailable(4)).toBe(true);
    expect(unavailable(5)).toBe(false);
  });

  it('runs all four Fluorite ultimate projectile hits with the native per-target marker', () => {
    const scenario = createEmptyScenario('scenario:fluorite:ultimate', '萤石终结技完整回归');
    scenario.battle.durationFrames = 120;
    scenario.enemy.editable.hp = 10_000_000;
    scenario.tracks[0] = {
      id: 'track:fluorite',
      operator: {
        operatorSlug: fluorite.slug,
        level: 90,
        promoted: true,
        potential: 5,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: {},
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 100, maxUltimateEnergyOverride: 100 },
      skillCasts: [],
    };
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: fluorite,
      skillGroupKey: 'ultimate',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:fluorite:ultimate` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 120,
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
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      },
    });
    const hits = result.receiptEntries.filter(
      entry =>
        entry.event === 'DamageApplied' &&
        entry.sourceId === 'track:fluorite' &&
        entry.data?.castId === 'skillCast:fluorite:ultimate',
    );

    expect(hits).toHaveLength(4);
    expect(hits.map(entry => entry.frame)).toEqual([59, 63, 67, 72]);
    expect(hits.every(entry => Number(entry.data?.value) > 0)).toBe(true);
    expect(fluorite.conversionSupport).toEqual({
      completeness: 'complete',
      missingCapabilities: [],
    });
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

  it('lets a standalone Zhuang Fangyi battle skill find its spawned sword and produce hits', () => {
    const scenario = createEmptyScenario(
      'scenario:zhuang-fangyi:battle-only',
      '庄方宜单放战技回归',
    );
    scenario.battle.durationFrames = 90;
    scenario.battle.resourceRules = {
      ...scenario.battle.resourceRules,
      initialSp: 100,
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
      initialState: { ultimateEnergy: 0 },
      skillCasts: [],
    };
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: zhuangFangyi,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:zhuang-fangyi:battle-only` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 90,
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
          ultimateEnergySystemUnlocked: true,
          normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
        },
      },
    });

    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'AbilityEntitySpawned',
        sourceId: 'track:zhuang-fangyi',
        data: expect.objectContaining({
          abilityEntityId: 'abilityentity_chr_0030_zhuangfy_normal_skill_sword',
        }),
      }),
    );
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
    const panels = new Map(
      resolveScenarioBuilds(placed, nextGameDataRepository).map(build => [
        build.track.id,
        resolveOperatorPanel(build),
      ]),
    );
    const snowshinePanel = panels.get('track:snowshine');
    const perlicaPanel = panels.get('track:perlica');
    if (snowshinePanel === undefined || perlicaPanel === undefined) {
      throw new Error('missing Snowshine production panels');
    }
    const expectedInitialHealing =
      (snowshinePanel.attributes.will * 0.5 + 216) *
      (1 + perlicaPanel.attributes.will * Math.fround(0.001));

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
    const initialHealing = result.receiptEntries.find(
      entry => entry.event === 'HealingApplied' && entry.targetId === 'track:perlica',
    );
    expect(initialHealing?.data?.requestedHealing).toBeCloseTo(expectedInitialHealing);
  });

  it('runs Wulfgard battle skill through the registered production repository', () => {
    const scenario = createEmptyScenario('scenario:wulfgard:registered', '狼卫默认仓库回归');
    scenario.battle.durationFrames = 150;
    scenario.tracks[0] = {
      id: 'track:wulfgard',
      operator: {
        operatorSlug: wulfgard.slug,
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
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: wulfgard,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:wulfgard` },
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
        event: 'DamageApplied',
        sourceId: 'track:wulfgard',
        targetId: 'enemy',
      }),
    );
  });

  it.each(['basicAttack', 'finisher', 'comboSkill'] as const)(
    'runs Alesh %s through the registered production repository',
    skillGroupKey => {
      const scenario = createEmptyScenario(
        `scenario:alesh:${skillGroupKey}:registered`,
        '阿列什默认仓库回归',
      );
      scenario.battle.durationFrames = 160;
      scenario.tracks[0] = {
        id: 'track:alesh',
        operator: {
          operatorSlug: alesh.slug,
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
      const placed = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: alesh,
        skillGroupKey,
        startFrame: 1,
        ids: { allocate: kind => `${kind}:alesh:${skillGroupKey}` },
      }).scenario;

      const result = runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 160,
        criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
        probabilitySamples: new ExplicitProbabilitySampleSource(Array(20).fill(1)),
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
          event: 'DamageApplied',
          sourceId: 'track:alesh',
          targetId: 'enemy',
        }),
      );
    },
  );

  it('applies Antal battle-skill vulnerability and its potential-5 keyword enhancement', () => {
    const run = (potential: number) => {
      const scenario = createEmptyScenario(`scenario:antal:${potential}`, '安塔尔关键词增强回归');
      scenario.battle.durationFrames = 1_340;
      scenario.tracks[0] = {
        id: 'track:antal',
        operator: {
          operatorSlug: antal.slug,
          level: 90,
          promoted: true,
          potential,
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
          potential: 0,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: { 0: 0, 1: 0 },
        },
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [],
      };
      let placed = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: antal,
        skillGroupKey: 'battleSkill',
        startFrame: 1,
        ids: { allocate: kind => `${kind}:antal:${potential}` },
      }).scenario;
      placed = placeSkillGroup({
        scenario: placed,
        trackIndex: 1,
        operator: perlica,
        skillGroupKey: 'basicAttack',
        startFrame: 1_280,
        ids: { allocate: kind => `${kind}:perlica:${potential}` },
      }).scenario;
      return runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 1_340,
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
            normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
            ultimateEnergySystemUnlocked: false,
          },
        },
      });
    };

    const base = run(4);
    const enhanced = run(5);
    const perlicaDamage = (result: typeof enhanced) =>
      Number(
        result.receiptEntries.find(
          entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:perlica',
        )?.data?.value,
      );
    expect(perlicaDamage(base)).toBeGreaterThan(0);
    expect(perlicaDamage(enhanced)).toBeGreaterThan(perlicaDamage(base));
  });

  it('injects the triggering infliction type into Antal combo skill blackboard', () => {
    const scenario = createEmptyScenario('scenario:antal:combo-input', '安塔尔连携输入回归');
    scenario.battle.durationFrames = 180;
    const createTrack = (id: string, operatorSlug: string) => ({
      id,
      operator: {
        operatorSlug,
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
    });
    scenario.tracks[0] = createTrack('track:antal', antal.slug);
    scenario.tracks[1] = createTrack('track:wulfgard', wulfgard.slug);

    let placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: antal,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:antal:focus` },
    }).scenario;
    placed = placeSkillGroup({
      scenario: placed,
      trackIndex: 1,
      operator: wulfgard,
      skillGroupKey: 'battleSkill',
      startFrame: 40,
      ids: { allocate: kind => `${kind}:wulfgard:infliction` },
    }).scenario;
    placed = placeSkillGroup({
      scenario: placed,
      trackIndex: 0,
      operator: antal,
      skillGroupKey: 'comboSkill',
      startFrame: 80,
      ids: { allocate: kind => `${kind}:antal:combo` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 180,
      criticalSamples: new ExplicitCriticalSampleSource(Array(40).fill(1)),
      elementalInflictionDocument: elementalAttachments,
      spellInflictionSettings: {
        schemaVersion: 1,
        revision: 'antal-combo-regression',
        data: [
          {
            key: '法术爆发伤害倍率',
            values: [1.5, 2, 2.5, 3],
            enhanceFormulaKey: '',
          },
        ],
        enhanceFormulas: [],
      },
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
      expect.objectContaining({ event: 'ComboWindowConsumed', sourceId: 'track:antal' }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'DamageApplied',
        sourceId: 'track:antal',
        targetId: 'enemy',
      }),
    );
  });

  it('keeps Antal forced combo casts simulatable while diagnosing the missing trigger', () => {
    const scenario = createEmptyScenario('scenario:antal:forced-combo', '安塔尔强制连携回归');
    scenario.battle.durationFrames = 80;
    scenario.tracks[0] = {
      id: 'track:antal',
      operator: {
        operatorSlug: antal.slug,
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
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: antal,
      skillGroupKey: 'comboSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:antal:forced-combo` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 80,
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
        event: 'ComboWindowUnavailableAtStart',
        sourceId: 'track:antal',
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({ event: 'DamageApplied', sourceId: 'track:antal' }),
    );
  });
});
