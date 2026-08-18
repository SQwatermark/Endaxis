import { describe, expect, it } from 'vitest';
import { ExplicitCriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { createEmptyScenario } from '../core/project/createProject';
import { perlica } from '../data/operators/perlica';
import { perlicaGeneratedOperator } from '../data/operators/generated/perlica.operator.generated';
import { arclightGeneratedOperator } from '../data/operators/generated/arclight.operator.generated';
import { lifengGeneratedOperator } from '../data/operators/generated/lifeng.operator.generated';
import { endministratorGeneratedOperator } from '../data/operators/generated/endministrator.operator.generated';
import { lastRiteGeneratedOperator } from '../data/operators/generated/last-rite.operator.generated';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { StandardPlayerDamageCompatibilityError } from '../core/combat/runtime/standardPlayerDamageCompatibility';
import { runStandardPlayerDamageScenarioSimulation } from './runStandardPlayerDamageScenarioSimulation';

function createPerlicaScenario() {
  const scenario = createEmptyScenario('scenario:standard-damage', '标准伤害样本');

  scenario.tracks[0] = {
    id: 'track:0',
    operator: {
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
      normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
    },
  };
}

function placeGeneratedPerlicaFlow() {
  const scenario = createPerlicaScenario();
  scenario.enemy.editable.stagger = {
    ...scenario.enemy.editable.stagger,
    maximum: 30,
    finisherSpRecovery: 80,
  };
  scenario.tracks[0] = {
    ...scenario.tracks[0]!,
    initialState: { ultimateEnergy: 80 },
  };
  let nextId = 0;
  const ids = { allocate: (kind: string) => `${kind}:${++nextId}` };
  const placements = [
    { skillGroupKey: 'basicAttack', startFrame: 1 },
    { skillGroupKey: 'comboSkill', startFrame: 106 },
    { skillGroupKey: 'battleSkill', startFrame: 132 },
    { skillGroupKey: 'ultimate', startFrame: 161 },
    { skillGroupKey: 'plungingAttack', startFrame: 225 },
    { skillGroupKey: 'finisher', startFrame: 247 },
  ] as const;

  return placements.reduce(
    (current, placement) =>
      placeSkillGroup({
        scenario: current,
        trackIndex: 0,
        operator: perlicaGeneratedOperator,
        ...placement,
        ids,
      }).scenario,
    scenario,
  );
}

function createGeneratedTeamScenario() {
  const scenario = createEmptyScenario('scenario:generated-team', '自动生成干员组队样本');
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 100,
    spRecoveryPerSecond: 0,
  };
  const build = (operatorSlug: string) => ({
    operatorSlug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates: {},
  });
  scenario.tracks[0] = {
    id: 'track:0',
    operator: build(arclightGeneratedOperator.slug),
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  scenario.tracks[1] = {
    id: 'track:1',
    operator: build(perlicaGeneratedOperator.slug),
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 80 },
    skillCasts: [],
  };

  let nextId = 0;
  const ids = { allocate: (kind: string) => `${kind}:${++nextId}` };
  const placements = [
    {
      trackIndex: 0,
      operator: arclightGeneratedOperator,
      skillGroupKey: 'basicAttack',
      skillKey: 'basicAttack5',
      startFrame: 1,
    },
    {
      trackIndex: 1,
      operator: perlicaGeneratedOperator,
      skillGroupKey: 'comboSkill',
      startFrame: 20,
    },
    {
      trackIndex: 1,
      operator: perlicaGeneratedOperator,
      skillGroupKey: 'battleSkill',
      startFrame: 40,
    },
    {
      trackIndex: 1,
      operator: perlicaGeneratedOperator,
      skillGroupKey: 'ultimate',
      startFrame: 180,
    },
    {
      trackIndex: 1,
      operator: perlicaGeneratedOperator,
      skillGroupKey: 'ultimate',
      startFrame: 260,
    },
  ] as const;
  return placements.reduce(
    (current, placement) => placeSkillGroup({ scenario: current, ids, ...placement }).scenario,
    scenario,
  );
}

function createGeneratedArclightBattleSkillScenario() {
  const scenario = createEmptyScenario('scenario:generated-arclight-battle-skill', '弧光战技样本');
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 100,
    spRecoveryPerSecond: 0,
  };
  scenario.tracks[0] = {
    id: 'track:next-sample:arclight',
    operator: {
      operatorSlug: arclightGeneratedOperator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: { 0: 1 },
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: arclightGeneratedOperator,
    skillGroupKey: 'battleSkill',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:1` },
  }).scenario;
}

function createGeneratedArclightUltimateScenario() {
  const scenario = createEmptyScenario('scenario:generated-arclight-ultimate', '弧光终结技样本');
  scenario.tracks[0] = {
    id: 'track:next-sample:arclight',
    operator: {
      operatorSlug: arclightGeneratedOperator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 90 },
    skillCasts: [],
  };
  return placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: arclightGeneratedOperator,
    skillGroupKey: 'ultimate',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:1` },
  }).scenario;
}

function createGeneratedLifengScenario(talentLevel: number) {
  const scenario = createEmptyScenario('scenario:lifeng-talent', '莱锋常驻天赋样本');
  scenario.tracks[0] = {
    id: 'track:0',
    operator: {
      operatorSlug: lifengGeneratedOperator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 1, battleSkill: 1, comboSkill: 1, ultimate: 1 },
      talentStates: { 0: talentLevel },
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: lifengGeneratedOperator,
    skillGroupKey: 'plungingAttack',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:1` },
  }).scenario;
}

function createGeneratedEndministratorIgniteScenario() {
  const scenario = createEmptyScenario('scenario:endministrator-ignite', '管理员冻结点燃样本');
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 0,
    spRecoveryPerSecond: 0,
  };
  scenario.tracks[0] = {
    id: 'track:endministrator',
    operator: {
      operatorSlug: endministratorGeneratedOperator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 80 },
    skillCasts: [],
  };
  let nextId = 0;
  const ids = { allocate: (kind: string) => `${kind}:${++nextId}` };
  const withFrozen = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: endministratorGeneratedOperator,
    skillGroupKey: 'comboSkill',
    skillKey: 'comboSkill',
    startFrame: 1,
    ids,
  }).scenario;
  return placeSkillGroup({
    scenario: withFrozen,
    trackIndex: 0,
    operator: endministratorGeneratedOperator,
    skillGroupKey: 'ultimate',
    skillKey: 'ultimate',
    startFrame: 80,
    ids,
  }).scenario;
}

function createGeneratedLastRitePartyBuffScenario() {
  const scenario = createEmptyScenario('scenario:last-rite-party-buff', '余烬队伍 Buff 样本');
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 100,
    spRecoveryPerSecond: 0,
  };
  const build = () => ({
    operatorSlug: lastRiteGeneratedOperator.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates: {},
  });
  scenario.tracks[0] = {
    id: 'track:last-rite-source',
    operator: build(),
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  scenario.tracks[1] = {
    id: 'track:last-rite-ally',
    operator: build(),
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  scenario.battle.controlSwitches.push({ id: 'switch:last-rite-ally', frame: 35, trackIndex: 1 });
  let nextId = 0;
  const ids = { allocate: (kind: string) => `${kind}:${++nextId}` };
  const withBuff = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: lastRiteGeneratedOperator,
    skillGroupKey: 'battleSkill',
    startFrame: 1,
    ids,
  }).scenario;
  return placeSkillGroup({
    scenario: withBuff,
    trackIndex: 1,
    operator: lastRiteGeneratedOperator,
    skillGroupKey: 'basicAttack',
    skillKey: 'basicAttack4',
    startFrame: 40,
    ids,
  }).scenario;
}

function runGeneratedLifengScenario(talentLevel: number) {
  return runStandardPlayerDamageScenarioSimulation({
    scenario: createGeneratedLifengScenario(talentLevel),
    endFrame: 60,
    criticalSamples: new ExplicitCriticalSampleSource([1, 1]),
    resolveNonRandomRuntimeSnapshot: () => ({
      runtimeExtensionMultiplier: 1,
      appliesIgniteDamageMultiplier: false,
      appliesPhysicalInflictionDamageMultiplier: false,
    }),
    options: {
      ...standardOptions(),
      index: {
        getOperator: slug =>
          slug === lifengGeneratedOperator.slug ? lifengGeneratedOperator : null,
        getWeapon: () => null,
        getGear: () => null,
        getGearSet: () => null,
      },
    },
  });
}

describe('runStandardPlayerDamageScenarioSimulation', () => {
  it('runs generated Last Rite party Buff events relative to the controlled owner', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: createGeneratedLastRitePartyBuffScenario(),
      endFrame: 100,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      elementalInflictionDocument: elementalAttachments,
      options: {
        ...standardOptions(),
        index: {
          getOperator: slug =>
            slug === lastRiteGeneratedOperator.slug ? lastRiteGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    const phantomDamage = result.receiptEntries.find(
      entry =>
        entry.event === 'DamageApplied' &&
        String(entry.data?.stepKey).includes('buff_chr_0026_lastrite_normal_skill_phantom'),
    );
    expect(phantomDamage).toMatchObject({ sourceId: 'track:last-rite-ally' });
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'ElementalInflictionApplied',
        sourceId: 'track:last-rite-ally',
      }),
    );
  });

  it('runs generated Endministrator freeze and ultimate ignition through production simulation', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: createGeneratedEndministratorIgniteScenario(),
      endFrame: 220,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        ...standardOptions(),
        index: {
          getOperator: slug =>
            slug === endministratorGeneratedOperator.slug ? endministratorGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    expect(
      result.receiptEntries
        .filter(entry => entry.event === 'SkillStarted')
        .map(entry => entry.data?.skillId),
    ).toEqual(['comboSkill', 'ultimate']);
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'BuffFinished',
        targetId: 'enemy',
        data: expect.objectContaining({
          buffId: 'buff_common_originum_frozen',
          reason: 'other',
        }),
      }),
    );
    const damageEntries = result.receiptEntries.filter(
      entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:endministrator',
    );
    expect(damageEntries).toHaveLength(5);
    expect(damageEntries).toContainEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          stepKey: expect.stringContaining('buff_common_originum_frozen:ignite:EndminUlt'),
        }),
      }),
    );
  });

  it('ends generated Arclight ultimate time freeze and advances the scenario timeline', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: createGeneratedArclightUltimateScenario(),
      endFrame: 150,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      elementalInflictionDocument: elementalAttachments,
      options: {
        ...standardOptions(),
        index: {
          getOperator: slug =>
            slug === arclightGeneratedOperator.slug ? arclightGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    expect(result.frame).toBeGreaterThanOrEqual(150);
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'TimeDilationEnded',
        sourceId: 'track:next-sample:arclight',
        data: expect.objectContaining({ sourceActionId: 'ultimate', reason: 'stopped' }),
      }),
    );
    expect(
      result.receiptEntries.filter(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:next-sample:arclight',
      ),
    ).toHaveLength(2);
  });

  it('accepts the generated Arclight battle skill Buff and entity-tag operations', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: createGeneratedArclightBattleSkillScenario(),
      endFrame: 150,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        ...standardOptions(),
        index: {
          getOperator: slug =>
            slug === arclightGeneratedOperator.slug ? arclightGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillStarted',
        sourceId: 'track:next-sample:arclight',
        data: expect.objectContaining({ skillId: 'battleSkill' }),
      }),
    );
  });

  it('applies generated Lifeng talent factors to the runtime attack snapshot', () => {
    const withoutTalent = runGeneratedLifengScenario(0);
    const withTalent = runGeneratedLifengScenario(1);
    const damageValue = (result: typeof withTalent) =>
      result.receiptEntries.find(entry => entry.event === 'DamageApplied')?.data?.value;

    expect(withTalent.operatorPanels[0]?.attack).toBe(withoutTalent.operatorPanels[0]?.attack);
    expect(damageValue(withoutTalent)).toBeTypeOf('number');
    expect(damageValue(withTalent)).toBeTypeOf('number');
    expect(damageValue(withTalent) as number).toBeGreaterThan(damageValue(withoutTalent) as number);
    expect(withTalent.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'PassiveSkillEnabled',
        sourceId: 'track:0',
        data: expect.objectContaining({ passiveKey: 'chr_0015_lifeng_talent_1' }),
      }),
    );
  });

  it('runs generated operators through team events, combo windows and shared resources', () => {
    const definitions = [arclightGeneratedOperator, perlicaGeneratedOperator];
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: createGeneratedTeamScenario(),
      endFrame: 400,
      criticalSamples: new ExplicitCriticalSampleSource(Array(40).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      elementalInflictionDocument: elementalAttachments,
      options: {
        ...standardOptions(),
        index: {
          getOperator: slug => definitions.find(operator => operator.slug === slug) ?? null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    expect(
      result.receiptEntries
        .filter(entry => entry.event === 'SkillStarted')
        .map(entry => [entry.sourceId, entry.data?.skillId]),
    ).toEqual([
      ['track:0', 'basicAttack5'],
      ['track:1', 'comboSkill'],
      ['track:1', 'battleSkill'],
      ['track:1', 'ultimate'],
      ['track:1', 'ultimate'],
    ]);
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({ event: 'ComboWindowOpened', sourceId: 'track:1' }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({ event: 'ComboWindowConsumed', sourceId: 'track:1' }),
    );
    expect(
      new Set(
        result.receiptEntries
          .filter(entry => entry.event === 'DamageApplied')
          .map(entry => entry.sourceId),
      ),
    ).toEqual(new Set(['track:0', 'track:1']));
    expect(result.finalResources.sp).toBeGreaterThan(0);
    expect(result.finalResources.sp).toBeLessThan(result.initialResources.sp);
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillCostApplied',
        sourceId: 'track:1',
        data: expect.objectContaining({ skillId: 'battleSkill', nonReturnedSpCost: 100 }),
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillCostApplied',
        sourceId: 'track:1',
        data: expect.objectContaining({ skillId: 'ultimate', remainingUltimateEnergy: 0 }),
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillCooldownUnavailableAtStart',
        sourceId: 'track:1',
        data: expect.objectContaining({ skillId: 'ultimate' }),
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillCostRejected',
        sourceId: 'track:1',
        data: expect.objectContaining({ skillId: 'ultimate' }),
      }),
    );
  });

  it('runs every generated Perlica skill type through the production simulation flow', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placeGeneratedPerlicaFlow(),
      endFrame: 283,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      elementalInflictionDocument: elementalAttachments,
      options: {
        ...standardOptions(),
        index: {
          getOperator: slug =>
            slug === perlicaGeneratedOperator.slug ? perlicaGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    expect(
      result.receiptEntries
        .filter(entry => entry.event === 'SkillStarted')
        .map(entry => entry.data?.skillId),
    ).toEqual([
      'basicAttack1',
      'basicAttack2',
      'basicAttack3',
      'basicAttack4',
      'comboSkill',
      'battleSkill',
      'ultimate',
      'plungingAttack',
      'finisher',
    ]);
    expect(result.receiptEntries.some(entry => entry.event === 'ComboWindowOpened')).toBe(true);
    expect(result.receiptEntries.some(entry => entry.event === 'ComboWindowConsumed')).toBe(true);
    expect(result.receiptEntries.some(entry => entry.event === 'ElementalInflictionApplied')).toBe(
      true,
    );
    expect(result.receiptEntries.some(entry => entry.event === 'ElementalReactionApplied')).toBe(
      true,
    );
    expect(result.enemyVitals.finalPoise).toBe(0);

    const finisherRecoveryIndex = result.receiptEntries.findIndex(
      entry => entry.event === 'SpChanged' && entry.data?.skillId === 'finisher',
    );
    expect(finisherRecoveryIndex).toBeGreaterThan(0);
    const finisherRecovery = result.receiptEntries[finisherRecoveryIndex]!;
    const finisherDamageIndex = result.receiptEntries.findIndex(
      entry =>
        entry.frame === finisherRecovery.frame &&
        entry.event === 'DamageApplied' &&
        entry.sourceId === 'track:0',
    );
    expect(finisherDamageIndex).toBeGreaterThanOrEqual(0);
    expect(finisherDamageIndex).toBeLessThan(finisherRecoveryIndex);
    expect(finisherRecovery).toMatchObject({
      sourceId: 'track:0',
      data: {
        skillId: 'finisher',
        baseValue: 80,
        gainKind: 'gain',
      },
    });
    expect(result.finalResources.squad[0]?.ultimateEnergy).toBeLessThan(80);
  });

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
    // 最终结果与投影共用本次模拟唯一的敌人账本快照，不再回退到静态敌人数值。
    expect(result.enemyVitals.initialHealth).toBe(result.enemy.health);
    expect(result.enemyVitals.maxHealth).toBe(result.enemy.health);
    expect(result.enemyVitals.initialPoise).toBe(result.enemyVitals.maxPoise);
    // 普攻只写生命不写失衡，失衡快照保持满值。
    expect(result.enemyVitals.finalPoise).toBe(result.enemyVitals.initialPoise);
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
