import { describe, expect, it } from 'vitest';
import { ExplicitCriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { createEmptyScenario } from '../core/project/createProject';
import { perlica } from '../data/operators/perlica';
import { perlicaGeneratedOperator } from '../data/operators/generated/perlica.operator.generated';
import { arclightGeneratedOperator } from '../data/operators/generated/arclight.operator.generated';
import { lifengGeneratedOperator } from '../data/operators/generated/lifeng.operator.generated';
import { endministratorGeneratedOperator } from '../data/operators/generated/endministrator.operator.generated';
import { lastRiteGeneratedOperator } from '../data/operators/generated/last-rite.operator.generated';
import { tangtangGeneratedOperator } from '../data/operators/generated/tangtang.operator.generated';
import { gilbertaGeneratedOperator } from '../data/operators/generated/gilberta.operator.generated';
import { rossiGeneratedOperator } from '../data/operators/generated/rossi.operator.generated';
import { mifuGeneratedOperator } from '../data/operators/generated/mifu.operator.generated';
import { akekuriGeneratedOperator } from '../data/operators/generated/akekuri.operator.generated';
import { generatedCommonBuffDefinitions } from '../data/operators/generated/commonBuffDefinitions.generated';
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

function createGeneratedAkekuriComboImbueScenario(
  talentEnabled: boolean,
  potential: number,
  battleSkillStartFrame = 60,
) {
  const scenario = createEmptyScenario(
    `scenario:akekuri-combo-imbue-${talentEnabled ? 'on' : 'off'}-p${potential}`,
    '弭弗连击增伤样本',
  );
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 300,
    spRecoveryPerSecond: 0,
  };
  const build = (operatorSlug: string, talentStates: Record<number, number>) => ({
    operatorSlug,
    level: 90,
    promoted: true,
    potential: operatorSlug === akekuriGeneratedOperator.slug ? potential : 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates,
  });
  scenario.tracks[0] = {
    id: 'track:akekuri',
    operator: build(akekuriGeneratedOperator.slug, talentEnabled ? { 1: 1 } : {}),
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 80 },
    skillCasts: [],
  };
  scenario.tracks[1] = {
    id: 'track:perlica-imbue',
    operator: build(perlicaGeneratedOperator.slug, {}),
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  let nextId = 0;
  const ids = { allocate: (kind: string) => `${kind}:akekuri:${++nextId}` };
  const withUltimate = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: akekuriGeneratedOperator,
    skillGroupKey: 'ultimate',
    startFrame: 1,
    ids,
  }).scenario;
  return placeSkillGroup({
    scenario: withUltimate,
    trackIndex: 1,
    operator: perlicaGeneratedOperator,
    skillGroupKey: 'battleSkill',
    startFrame: battleSkillStartFrame,
    ids,
  }).scenario;
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

function createGeneratedLifengKnockDownScenario() {
  const scenario = createEmptyScenario('scenario:lifeng-knockdown', '黎风击倒天赋与潜能样本');
  scenario.tracks[0] = {
    id: 'track:lifeng-knockdown',
    operator: {
      operatorSlug: lifengGeneratedOperator.slug,
      level: 90,
      promoted: true,
      potential: 5,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: { 1: 2 },
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
    skillGroupKey: 'battleSkill',
    startFrame: 451,
    ids: { allocate: kind => `${kind}:1` },
  }).scenario;
}

function createGeneratedEndministratorIgniteScenario(talent1Level?: 1 | 2) {
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
      potential: 3,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: talent1Level === undefined ? {} : { 0: talent1Level },
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
  const withUltimate = placeSkillGroup({
    scenario: withFrozen,
    trackIndex: 0,
    operator: endministratorGeneratedOperator,
    skillGroupKey: 'ultimate',
    skillKey: 'ultimate',
    startFrame: 80,
    ids,
  }).scenario;
  if (talent1Level === undefined) return withUltimate;
  return placeSkillGroup({
    scenario: withUltimate,
    trackIndex: 0,
    operator: endministratorGeneratedOperator,
    skillGroupKey: 'basicAttack',
    startFrame: 170,
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

function createGeneratedTangtangComboScenario() {
  const scenario = createEmptyScenario('scenario:generated-tangtang', '唐棠连携水体样本');
  scenario.tracks[0] = {
    id: 'track:tangtang',
    operator: {
      operatorSlug: tangtangGeneratedOperator.slug,
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
  return placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: tangtangGeneratedOperator,
    skillGroupKey: 'comboSkill',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:tangtang` },
  }).scenario;
}

function createGeneratedTangtangBattleScenario(potential: number) {
  const scenario = createEmptyScenario(
    `scenario:generated-tangtang-p${potential}`,
    '唐棠战技潜能样本',
  );
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 300,
    spRecoveryPerSecond: 0,
  };
  scenario.tracks[0] = {
    id: 'track:tangtang',
    operator: {
      operatorSlug: tangtangGeneratedOperator.slug,
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
  return placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: tangtangGeneratedOperator,
    skillGroupKey: 'battleSkill',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:tangtang:p${potential}` },
  }).scenario;
}

function createGeneratedGilbertaBattleScenario(talentLevel: 0 | 2, potential: number) {
  const scenario = createEmptyScenario(
    `scenario:generated-gilberta-t${talentLevel}-p${potential}`,
    '吉尔伯塔回能天赋样本',
  );
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 300,
    spRecoveryPerSecond: 0,
  };
  scenario.tracks[0] = {
    id: 'track:gilberta',
    operator: {
      operatorSlug: gilbertaGeneratedOperator.slug,
      level: 90,
      promoted: true,
      potential,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: talentLevel === 0 ? {} : { 0: talentLevel },
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: gilbertaGeneratedOperator,
    skillGroupKey: 'battleSkill',
    startFrame: 1,
    ids: { allocate: kind => `${kind}:gilberta:t${talentLevel}:p${potential}` },
  }).scenario;
}

function createGeneratedMifuProtectionScenario() {
  const scenario = createEmptyScenario('scenario:generated-mifu', '弭弗护盾与战技换槽样本');
  scenario.battle.durationFrames = 240;
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 300,
    spRecoveryPerSecond: 0,
  };
  scenario.tracks[0] = {
    id: 'track:mifu',
    operator: {
      operatorSlug: mifuGeneratedOperator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: { 1: 1 },
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 80 },
    skillCasts: [],
  };
  let nextId = 0;
  const ids = { allocate: (kind: string) => `${kind}:mifu:${++nextId}` };
  const combo = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: mifuGeneratedOperator,
    skillGroupKey: 'comboSkill',
    startFrame: 1,
    ids,
  }).scenario;
  const ultimate = placeSkillGroup({
    scenario: combo,
    trackIndex: 0,
    operator: mifuGeneratedOperator,
    skillGroupKey: 'ultimate',
    startFrame: 40,
    ids,
  }).scenario;
  return placeSkillGroup({
    scenario: ultimate,
    trackIndex: 0,
    operator: mifuGeneratedOperator,
    skillGroupKey: 'battleSkill',
    startFrame: 160,
    ids,
  }).scenario;
}

function createGeneratedMifuBattleChainScenario() {
  const scenario = createEmptyScenario('scenario:generated-mifu-chain', '弭弗三段战技样本');
  scenario.battle.durationFrames = 140;
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 300,
    spRecoveryPerSecond: 0,
  };
  scenario.tracks[0] = {
    id: 'track:mifu-chain',
    operator: {
      operatorSlug: mifuGeneratedOperator.slug,
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
  let nextId = 0;
  const ids = { allocate: (kind: string) => `${kind}:mifu-chain:${++nextId}` };
  let placed = scenario;
  for (const startFrame of [1, 20, 60]) {
    placed = placeSkillGroup({
      scenario: placed,
      trackIndex: 0,
      operator: mifuGeneratedOperator,
      skillGroupKey: 'battleSkill',
      startFrame,
      ids,
    }).scenario;
  }
  placed.tracks[0]!.skillCasts.at(-1)!.simulationInputs = {
    cameraToTargetSignedAngleDegrees: 0,
  };
  return placed;
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
  it('does not run Rossi conditional follow-up without the required enemy Buff tag', () => {
    const scenario = createEmptyScenario('scenario:generated-rossi-claw-mark', '洛茜爪印样本');
    scenario.battle.durationFrames = 300;
    scenario.battle.resourceRules = {
      ...scenario.battle.resourceRules,
      initialSp: 100,
      spRecoveryPerSecond: 0,
    };
    scenario.tracks[0] = {
      id: 'track:rossi',
      operator: {
        operatorSlug: rossiGeneratedOperator.slug,
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
      operator: rossiGeneratedOperator,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:rossi` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 250,
      criticalSamples: new ExplicitCriticalSampleSource(Array(40).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        ...standardOptions(),
        index: {
          getOperator: slug =>
            slug === rossiGeneratedOperator.slug ? rossiGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    const clawMarkDamage = result.receiptEntries.filter(
      entry =>
        entry.event === 'DamageApplied' &&
        String(entry.data?.stepKey).includes('buff_chr_0028_wulfa_normal_defup') &&
        String(entry.data?.stepKey).includes('buffInterval'),
    );
    expect(clawMarkDamage).toEqual([]);

    const tutorialSuccessDamage = result.receiptEntries.filter(
      entry =>
        entry.event === 'DamageApplied' &&
        String(entry.data?.stepKey).includes('buff_chr_0028_wulfa_tut_normalskill_success') &&
        String(entry.data?.stepKey).includes('buffInterval'),
    );
    expect(tutorialSuccessDamage).toEqual([]);
    expect(
      result.receiptEntries.some(
        entry => entry.event === 'SkillTimelineFinished' && entry.sourceId === 'track:rossi',
      ),
    ).toBe(true);
  });

  it('runs Rossi attack 4 on the controlled and off-field native timeline branches', () => {
    const simulate = (controlled: boolean) => {
      const scenario = createEmptyScenario(
        `scenario:rossi-attack4-${controlled ? 'controlled' : 'off-field'}`,
        '洛茜第四段普攻主控分支',
      );
      const rossiTrack = controlled ? 0 : 1;
      if (!controlled) {
        scenario.tracks[0] = {
          id: 'track:anchor',
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
      }
      scenario.tracks[rossiTrack] = {
        id: 'track:rossi',
        operator: {
          operatorSlug: rossiGeneratedOperator.slug,
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
        trackIndex: rossiTrack as 0 | 1,
        operator: rossiGeneratedOperator,
        skillGroupKey: 'basicAttack',
        skillKey: 'basicAttack4',
        startFrame: 1,
        ids: { allocate: kind => `${kind}:rossi-attack4` },
      }).scenario;
      const result = runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 220,
        criticalSamples: new ExplicitCriticalSampleSource(Array(40).fill(0)),
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        options: {
          ...standardOptions(),
          index: {
            getOperator: slug =>
              slug === rossiGeneratedOperator.slug
                ? rossiGeneratedOperator
                : slug === perlica.slug
                  ? perlica
                  : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
      return result.receiptEntries
        .filter(
          entry =>
            entry.event === 'DamageApplied' &&
            entry.sourceId === 'track:rossi' &&
            String(entry.data?.stepKey).includes('basicAttack4'),
        )
        .map(entry => entry.frame);
    };

    expect(simulate(true)).toEqual([6, 8, 13, 15, 23]);
    expect(simulate(false)).toEqual([6, 9, 14, 16, 24]);
  });

  it('runs Rossi delayed combo Buff trigger and local interval damage', () => {
    const scenario = createEmptyScenario(
      'scenario:generated-rossi-combo-delay',
      '洛茜连携延迟伤害',
    );
    scenario.battle.durationFrames = 120;
    scenario.tracks[0] = {
      id: 'track:rossi',
      operator: {
        operatorSlug: rossiGeneratedOperator.slug,
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
      operator: rossiGeneratedOperator,
      skillGroupKey: 'comboSkill',
      skillKey: 'comboSkill2',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:rossi-combo` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 80,
      criticalSamples: new ExplicitCriticalSampleSource(Array(40).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        ...standardOptions(),
        index: {
          getOperator: slug =>
            slug === rossiGeneratedOperator.slug ? rossiGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    const delayedDamage = result.receiptEntries.filter(
      entry =>
        entry.event === 'DamageApplied' &&
        String(entry.data?.stepKey).includes('buff_chr_0028_wulfa_combo_2_damage'),
    );
    expect(delayedDamage).toHaveLength(7);
    expect(delayedDamage.every(entry => entry.sourceId === 'track:rossi')).toBe(true);
    expect(
      delayedDamage.filter(entry => String(entry.data?.stepKey).includes(':trigger:')),
    ).toHaveLength(3);
    expect(
      delayedDamage.filter(entry => String(entry.data?.stepKey).includes('buffInterval')),
    ).toHaveLength(4);
  });

  it('runs Rossi ultimate with its conditional critical-damage Buff', () => {
    const scenario = createEmptyScenario('scenario:generated-rossi-ultimate', '洛茜终结技');
    scenario.battle.durationFrames = 300;
    scenario.tracks[0] = {
      id: 'track:rossi',
      operator: {
        operatorSlug: rossiGeneratedOperator.slug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates: {},
      },
      weapon: null,
      gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
      initialState: { ultimateEnergy: 100 },
      skillCasts: [],
    };
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: rossiGeneratedOperator,
      skillGroupKey: 'ultimate',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:rossi-ultimate` },
    }).scenario;

    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placed,
      endFrame: 260,
      criticalSamples: new ExplicitCriticalSampleSource(Array(100).fill(0)),
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
            slug === rossiGeneratedOperator.slug ? rossiGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    expect(
      result.receiptEntries.some(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:rossi',
      ),
    ).toBe(true);
  });

  it('uses Rossi QTE active timer as the precise-link input boundary', () => {
    const simulate = (comboSkill3StartFrame: number) => {
      const scenario = createEmptyScenario(
        `scenario:generated-rossi-qte-${comboSkill3StartFrame}`,
        '洛茜精准衔接',
      );
      scenario.battle.durationFrames = 180;
      scenario.tracks[0] = {
        id: 'track:rossi',
        operator: {
          operatorSlug: rossiGeneratedOperator.slug,
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
      const afterFirstStage = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: rossiGeneratedOperator,
        skillGroupKey: 'comboSkill',
        skillKey: 'comboSkill2',
        startFrame: 1,
        ids: { allocate: kind => `${kind}:rossi-qte-first` },
      }).scenario;
      const placed = placeSkillGroup({
        scenario: afterFirstStage,
        trackIndex: 0,
        operator: rossiGeneratedOperator,
        skillGroupKey: 'comboSkill',
        skillKey: 'comboSkill3',
        startFrame: comboSkill3StartFrame,
        ids: { allocate: kind => `${kind}:rossi-qte-second-${comboSkill3StartFrame}` },
      }).scenario;
      return runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 150,
        criticalSamples: new ExplicitCriticalSampleSource(Array(80).fill(1)),
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        options: {
          ...standardOptions(),
          index: {
            getCommonBuffDefinitions: () => generatedCommonBuffDefinitions,
            getOperator: slug =>
              slug === rossiGeneratedOperator.slug ? rossiGeneratedOperator : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
    };

    const inside = simulate(55);
    const outside = simulate(75);

    expect(
      inside.receiptEntries.some(
        entry =>
          entry.event === 'TimeDilationStarted' &&
          entry.sourceId === 'track:rossi' &&
          entry.data?.priority === 50,
      ),
    ).toBe(true);
    expect(
      outside.receiptEntries.some(
        entry => entry.event === 'TimeDilationStarted' && entry.data?.priority === 50,
      ),
    ).toBe(false);
  });

  it('pauses Rossi combo timers for the native power-attack action interval', () => {
    const simulate = (withPowerAttack: boolean) => {
      const scenario = createEmptyScenario(
        `scenario:generated-rossi-combo-pause-${withPowerAttack}`,
        '洛茜连携计时暂停',
      );
      scenario.battle.durationFrames = 420;
      scenario.tracks[0] = {
        id: 'track:rossi',
        operator: {
          operatorSlug: rossiGeneratedOperator.slug,
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
      let placed = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: rossiGeneratedOperator,
        skillGroupKey: 'comboSkill',
        skillKey: 'comboSkill2',
        startFrame: 1,
        ids: { allocate: kind => `${kind}:rossi-pause-combo` },
      }).scenario;
      if (withPowerAttack) {
        placed = placeSkillGroup({
          scenario: placed,
          trackIndex: 0,
          operator: rossiGeneratedOperator,
          skillGroupKey: 'finisher',
          skillKey: 'finisher',
          startFrame: 60,
          ids: { allocate: kind => `${kind}:rossi-pause-power` },
        }).scenario;
      }
      const result = runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 380,
        criticalSamples: new ExplicitCriticalSampleSource(Array(120).fill(1)),
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        options: {
          ...standardOptions(),
          index: {
            getCommonBuffDefinitions: () => generatedCommonBuffDefinitions,
            getOperator: slug =>
              slug === rossiGeneratedOperator.slug ? rossiGeneratedOperator : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
      return result.receiptEntries.find(
        entry =>
          entry.event === 'BuffFinished' &&
          entry.data?.buffId === 'buff_chr_0028_wulfa_combo_usetimer' &&
          entry.data?.reason === 'lifetime',
      )?.frame;
    };

    const normalFinishFrame = simulate(false);
    const pausedFinishFrame = simulate(true);
    expect(normalFinishFrame).toBeTypeOf('number');
    expect(pausedFinishFrame).toBeTypeOf('number');
    expect(pausedFinishFrame!).toBeGreaterThan(normalFinishFrame!);
  });

  it('runs generated Tangtang combo damage and water entity lifecycle', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: createGeneratedTangtangComboScenario(),
      endFrame: 930,
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
          getOperator: slug =>
            slug === tangtangGeneratedOperator.slug ? tangtangGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });

    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillStarted',
        sourceId: 'track:tangtang',
        data: expect.objectContaining({ skillId: 'comboSkill' }),
      }),
    );
    expect(
      result.receiptEntries.some(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:tangtang',
      ),
    ).toBe(true);
    const spawnedIds = new Set(
      result.receiptEntries
        .filter(entry => entry.event === 'AbilityEntitySpawned')
        .map(entry => entry.targetId),
    );
    const finishedIds = new Set(
      result.receiptEntries
        .filter(entry => entry.event === 'AbilityEntityFinished')
        .map(entry => entry.targetId),
    );
    expect(spawnedIds.size).toBeGreaterThan(0);
    expect([...spawnedIds].some(id => finishedIds.has(id))).toBe(true);
  });

  it('applies Tangtang potential 3 to battle-skill and base-passive damage inputs', () => {
    const simulate = (potential: number) =>
      runStandardPlayerDamageScenarioSimulation({
        scenario: createGeneratedTangtangBattleScenario(potential),
        endFrame: 180,
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
              slug === tangtangGeneratedOperator.slug ? tangtangGeneratedOperator : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
    const damage = (potential: number) =>
      simulate(potential).receiptEntries.find(entry => entry.event === 'DamageApplied')?.data
        ?.value;

    expect(damage(0)).toBeTypeOf('number');
    expect(damage(3)).toBeGreaterThan(damage(0) as number);
  });

  it('applies Gilberta talent and potential to the live ultimate-energy gain attribute', () => {
    const simulate = (talentLevel: 0 | 2, potential: number) =>
      runStandardPlayerDamageScenarioSimulation({
        scenario: createGeneratedGilbertaBattleScenario(talentLevel, potential),
        endFrame: 120,
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
              slug === gilbertaGeneratedOperator.slug ? gilbertaGeneratedOperator : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
    const gained = (talentLevel: 0 | 2, potential: number) =>
      simulate(talentLevel, potential).receiptEntries.find(
        entry => entry.event === 'UltimateEnergyChanged' && entry.targetId === 'track:gilberta',
      )?.data?.actualValue;

    expect(gained(0, 0)).toBeCloseTo(6.5);
    expect(gained(2, 0)).toBeCloseTo(6.5 * 1.07);
    expect(gained(2, 3)).toBeCloseTo(6.5 * 1.12);
  });

  it('runs generated Mifu shield creation and chained battle-skill replacement', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: createGeneratedMifuProtectionScenario(),
      endFrame: 240,
      criticalSamples: new ExplicitCriticalSampleSource(Array(30).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        ...standardOptions(),
        index: {
          getCommonBuffDefinitions: () => generatedCommonBuffDefinitions,
          getOperator: slug => (slug === mifuGeneratedOperator.slug ? mifuGeneratedOperator : null),
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
    ).toEqual(['comboSkill', 'ultimate', 'battleSkill2']);
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'CombatStepReached',
        frame: 1,
        sourceId: 'track:mifu',
        data: expect.objectContaining({ skillId: 'comboSkill', kind: 'applyBuff' }),
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'SkillSlotChanged',
        sourceId: 'track:mifu',
        data: expect.objectContaining({
          skillGroupKey: 'battleSkill',
          targetSkillKey: 'battleSkill3',
        }),
      }),
    );
  });

  it('runs all three generated Mifu battle-skill forms with stable hit identities', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: createGeneratedMifuBattleChainScenario(),
      endFrame: 140,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        ...standardOptions(),
        index: {
          getCommonBuffDefinitions: () => generatedCommonBuffDefinitions,
          getOperator: slug => (slug === mifuGeneratedOperator.slug ? mifuGeneratedOperator : null),
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
    ).toEqual(['battleSkill1', 'battleSkill2', 'battleSkill3']);
    const damageSteps = result.receiptEntries
      .filter(entry => entry.event === 'DamageApplied')
      .map(entry => String(entry.data?.stepKey));
    expect(damageSteps.filter(stepKey => stepKey.includes('battleSkill1'))).toHaveLength(1);
    expect(damageSteps.filter(stepKey => stepKey.includes('battleSkill2'))).toHaveLength(3);
    expect(damageSteps.filter(stepKey => stepKey.includes('battleSkill3'))).toHaveLength(1);
    const thirdFormDamage = result.receiptEntries.find(
      entry =>
        entry.event === 'DamageApplied' && String(entry.data?.stepKey).includes('battleSkill3'),
    );
    expect(thirdFormDamage?.data?.value).toBeTypeOf('number');
    expect(thirdFormDamage?.data?.value as number).toBeGreaterThan(0);
    expect(
      result.receiptEntries
        .filter(entry => entry.event === 'DamageApplied')
        .every(
          entry => typeof entry.data?.castId === 'string' && typeof entry.data?.hitId === 'string',
        ),
    ).toBe(true);
  });

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
          getCommonBuffDefinitions: () => generatedCommonBuffDefinitions,
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
    expect(result.finalResources.squad[0]?.ultimateEnergy).toBe(15);
  });

  it('applies Endministrator talent 1 attack Buff after igniting frozen', () => {
    const run = (talent1Level: 1 | 2) =>
      runStandardPlayerDamageScenarioSimulation({
        scenario: createGeneratedEndministratorIgniteScenario(talent1Level),
        endFrame: 240,
        criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        options: {
          ...standardOptions(),
          index: {
            getCommonBuffDefinitions: () => generatedCommonBuffDefinitions,
            getOperator: slug =>
              slug === endministratorGeneratedOperator.slug
                ? endministratorGeneratedOperator
                : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });

    const level1 = run(1);
    const level2 = run(2);
    expect(level2.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'PassiveSkillEnabled',
        sourceId: 'track:endministrator',
        data: expect.objectContaining({
          passiveKey: 'buff_chr_0003_endminf_talent_1',
        }),
      }),
    );
    const basicDamage = (result: typeof level1) =>
      result.receiptEntries.find(
        entry => entry.event === 'DamageApplied' && entry.data?.castId === 'skillCast:3',
      )?.data?.value as number | undefined;
    expect(basicDamage(level1)).toBeTypeOf('number');
    expect(basicDamage(level2)).toBeGreaterThan(basicDamage(level1) ?? 0);
  });

  it('applies Endministrator talent 2 only to physical damage against frozen', () => {
    const run = (talent2Level: 1 | 2) => {
      const scenario = createGeneratedEndministratorIgniteScenario();
      const track = scenario.tracks[0];
      if (track?.operator == null) throw new Error('missing Endministrator track');
      track.operator.talentStates = { 1: talent2Level };
      return runStandardPlayerDamageScenarioSimulation({
        scenario,
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
            getCommonBuffDefinitions: () => generatedCommonBuffDefinitions,
            getOperator: slug =>
              slug === endministratorGeneratedOperator.slug
                ? endministratorGeneratedOperator
                : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
    };

    const level1 = run(1);
    const level2 = run(2);
    const firstUltimateDamage = (result: typeof level1) =>
      result.receiptEntries.find(
        entry => entry.event === 'DamageApplied' && entry.data?.castId === 'skillCast:2',
      );
    expect(firstUltimateDamage(level1)?.data?.damageType).toBe('physical');
    expect(firstUltimateDamage(level2)?.data?.value as number).toBeGreaterThan(
      firstUltimateDamage(level1)?.data?.value as number,
    );
  });

  it('ends generated Arclight ultimate time freeze within the fixed actual-time range', () => {
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

    expect(result.frame).toBe(150);
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'TimeDilationEnded',
        sourceId: 'track:next-sample:arclight',
        data: expect.objectContaining({ sourceActionId: 'ultimate', reason: 'stopped' }),
      }),
    );
    const arclightDamage = result.receiptEntries.filter(
      entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:next-sample:arclight',
    );
    expect(arclightDamage).toHaveLength(2);
    expect(
      arclightDamage.every(
        entry => entry.data?.castId === 'skillCast:1' && typeof entry.data.hitId === 'string',
      ),
    ).toBe(true);
    expect(arclightDamage.map(entry => entry.frame)).toEqual([63, 119]);
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

  it('consumes Lifeng potential 5 on the next knockdown and restarts its timer', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: createGeneratedLifengKnockDownScenario(),
      endFrame: 960,
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
            slug === lifengGeneratedOperator.slug ? lifengGeneratedOperator : null,
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
        },
      },
    });
    // Generated action frame 54 is one-based, so it executes 53 runtime frames
    // after the cast input frame.
    const knockDownFrame = 451 + 53;
    const damageAtKnockDown = result.receiptEntries.filter(
      entry => entry.frame === knockDownFrame && entry.event === 'DamageApplied',
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        frame: knockDownFrame,
        event: 'KnockDownOutput',
        sourceId: 'track:lifeng-knockdown',
      }),
    );
    expect(damageAtKnockDown).toHaveLength(2);
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        frame: knockDownFrame,
        event: 'BuffFinished',
        data: expect.objectContaining({ buffId: 'buff_chr_0015_lifeng_potential_5_1' }),
      }),
    );
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        frame: knockDownFrame + 450,
        event: 'BuffFinished',
        data: expect.objectContaining({ buffId: 'buff_chr_0015_lifeng_potential_5' }),
      }),
    );
  });

  it('projects Akekuri global combo layers onto the party and consumes one layer per skill', () => {
    const simulate = (talentEnabled: boolean, potential = 0, battleSkillStartFrame = 60) =>
      runStandardPlayerDamageScenarioSimulation({
        scenario: createGeneratedAkekuriComboImbueScenario(
          talentEnabled,
          potential,
          battleSkillStartFrame,
        ),
        endFrame: battleSkillStartFrame + 120,
        criticalSamples: new ExplicitCriticalSampleSource(Array(30).fill(1)),
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        elementalInflictionDocument: elementalAttachments,
        options: {
          ...standardOptions(),
          index: {
            getCommonBuffDefinitions: () => generatedCommonBuffDefinitions,
            getOperator: slug =>
              [akekuriGeneratedOperator, perlicaGeneratedOperator].find(
                operator => operator.slug === slug,
              ) ?? null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
    const perlicaBattleDamage = (result: ReturnType<typeof simulate>) =>
      result.receiptEntries.find(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:perlica-imbue',
      )?.data?.value as number;

    const baseline = simulate(false);
    const imbued = simulate(true);
    expect(perlicaBattleDamage(baseline)).toBeGreaterThan(0);
    expect(perlicaBattleDamage(imbued)).toBeCloseTo(perlicaBattleDamage(baseline) * 1.3);
    expect(
      imbued.receiptEntries.filter(
        entry =>
          entry.event === 'BuffFinished' &&
          entry.data?.buffId === 'buff_common_affixes_combo_trigger',
      ),
    ).toHaveLength(2);

    expect(perlicaBattleDamage(simulate(true, 0, 360))).toBeCloseTo(perlicaBattleDamage(baseline));
    expect(perlicaBattleDamage(simulate(true, 5, 360))).toBeCloseTo(
      perlicaBattleDamage(baseline) * 1.3,
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
