import { describe, expect, it } from 'vitest';
import { ExplicitCriticalSampleSource } from '../core/combat/random/criticalSampleSource';
import { createEmptyScenario } from '../core/project/createProject';
import { perlica, perlica as perlicaFormalOperator } from '../data/operators/perlica';
import perlicaGeneratedOperator from '../data/operators/generated-definitions/perlica/perlica.operator.generated';
import { arclight as arclightGeneratedOperator } from '../data/operators/arclight';
import { lifeng as lifengGeneratedOperator } from '../data/operators/lifeng';
import { endministrator as endministratorGeneratedOperator } from '../data/operators/endministrator';
import { lastRite as lastRiteGeneratedOperator } from '../data/operators/last-rite';
import { tangtang as tangtangGeneratedOperator } from '../data/operators/tangtang';
import { gilberta as gilbertaGeneratedOperator } from '../data/operators/gilberta';
import { rossi as rossiGeneratedOperator } from '../data/operators/rossi';
import { chenQianyu as chenQianyuGeneratedOperator } from '../data/operators/chen-qianyu';
import { estella as estellaGeneratedOperator, estellaBattleSkill } from '../data/operators/estella';
import { mifu as mifuGeneratedOperator } from '../data/operators/mifu';
import { akekuri } from '../data/operators/akekuri';
import { commonBuffDefinitions } from '../data/buffs/commonDefinitions';
import { elementalAttachments } from '../data/buffs/elementalAttachments';
import { scheduled, sequence, step, branch } from '../data/operators/definitionHelpers';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { StandardPlayerDamageCompatibilityError } from '../core/combat/runtime/standardPlayerDamageCompatibility';
import { runStandardPlayerDamageScenarioSimulation } from './runStandardPlayerDamageScenarioSimulation';
import type { OperatorDefinition } from '../core/game-data/operatorDefinition';

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

describe('标准入口普通倒地装配', () => {
  function fixture(observeGetUp = false) {
    const definition: OperatorDefinition = {
      ...perlica,
      comboSkillRegistrations: [],
      talents: [],
      potentials: [],
      buffDefinitions: {
        buff_physical_no_guard: { stackingType: 'refresh', durationSeconds: 2 },
        buff_physical_knockdown: { stackingType: 'refresh', durationSeconds: 2 },
      },
      skillGroups: [
        ...perlica.skillGroups.filter(group => group.key !== 'battleSkill'),
        {
          key: 'battleSkill',
          skillType: 'battleSkill',
          levelSource: 'battleSkill',
          skills: {
            key: 'battleSkill',
            timelineBlockFrames: 1,
            scheduledSequences: [
              scheduled(
                0,
                sequence(
                  ...Array.from({ length: 2 }, () =>
                    step('applyKnockDown', {
                      target: 'enemy',
                      duration: { kind: 'constant', value: 0.1 },
                      force: false,
                      isExtra: false,
                      targetFilter: 'aliveOnly',
                      returnWhen: 'always',
                    }),
                  ),
                  ...(observeGetUp
                    ? [
                        branch(
                          {
                            kind: 'entityTagMatch',
                            target: 'enemy',
                            tagQueryType: 'hasAny',
                            tags: ['Status/Immobilized/Getup'],
                          },
                          sequence(),
                        ),
                      ]
                    : []),
                ),
              ),
            ],
          },
        },
      ],
    };
    const scenario = placeSkillGroup({
      scenario: createPerlicaScenario(),
      trackIndex: 0,
      operator: definition,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:down` },
    }).scenario;
    const options = standardOptions();
    return () =>
      runStandardPlayerDamageScenarioSimulation({
        scenario,
        endFrame: 15,
        criticalSamples: {
          nextCriticalSample: () => {
            throw new Error('控制夹具不应抽伤害样本');
          },
        },
        resolveNonRandomRuntimeSnapshot: () => {
          throw new Error('控制夹具不应结算伤害');
        },
        options: { ...options, index: { ...options.index, getOperator: () => definition } },
      });
  }
  it('经项目编译、标准预检与正式入口执行首次破防和再次倒地', () => {
    const result = fixture()();
    expect(
      result.receiptEntries.filter(entry => entry.event === 'PhysicalNoGuardApplied'),
    ).toHaveLength(1);
    expect(
      result.receiptEntries.filter(entry => entry.event === 'PhysicalInflictionApplied'),
    ).toHaveLength(1);
  });
  it('正式入口拒绝需要敌方起身状态的场景，不先执行控制', () => {
    expect(fixture(true)).toThrow('cannot omit get-up');
  });
});

function placeGeneratedPerlicaFlow(operator: OperatorDefinition = perlicaGeneratedOperator) {
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
        operator,
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
    potential: operatorSlug === akekuri.slug ? potential : 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates,
  });
  scenario.tracks[0] = {
    id: 'track:akekuri',
    operator: build(akekuri.slug, talentEnabled ? { 1: 1 } : {}),
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
    operator: akekuri,
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
  const first = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: lifengGeneratedOperator,
    skillGroupKey: 'battleSkill',
    startFrame: 451,
    ids: { allocate: kind => `${kind}:1` },
  }).scenario;
  return placeSkillGroup({
    scenario: first,
    trackIndex: 0,
    operator: lifengGeneratedOperator,
    skillGroupKey: 'battleSkill',
    startFrame: 850,
    ids: { allocate: kind => `${kind}:2` },
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

function createGeneratedTangtangUltimateResponseScenario(includeAllyPlungingAttack: boolean) {
  const scenario = createEmptyScenario(
    `scenario:generated-tangtang-ultimate-response-${includeAllyPlungingAttack}`,
    '汤汤终结技队友下落攻击响应样本',
  );
  const build = (operatorSlug: string, ultimateEnergy: number) => ({
    operator: {
      operatorSlug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy },
    skillCasts: [],
  });
  scenario.tracks[0] = {
    id: 'track:tangtang',
    ...build(tangtangGeneratedOperator.slug, 90),
  };
  scenario.tracks[1] = {
    id: 'track:perlica',
    ...build(perlicaGeneratedOperator.slug, 0),
  };

  let nextId = 0;
  const ids = { allocate: (kind: string) => `${kind}:tangtang-ultimate:${++nextId}` };
  const withUltimate = placeSkillGroup({
    scenario,
    trackIndex: 0,
    operator: tangtangGeneratedOperator,
    skillGroupKey: 'ultimate',
    startFrame: 1,
    ids,
  }).scenario;
  if (!includeAllyPlungingAttack) return withUltimate;

  // 终结技水体在全局约第 198 帧向队友施加响应 Buff。佩丽卡下落攻击
  // 在起手后第 3 帧命中，因此从 197 帧放置可让命中落在监听窗口内。
  withUltimate.battle.controlSwitches.push({
    id: 'switch:tangtang-ultimate:perlica',
    frame: 190,
    trackIndex: 1,
  });
  return placeSkillGroup({
    scenario: withUltimate,
    trackIndex: 1,
    operator: perlicaGeneratedOperator,
    skillGroupKey: 'plungingAttack',
    startFrame: 197,
    ids,
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
    skillKey: 'battleSkill2',
    startFrame: 160,
    ids,
  }).scenario;
}

function createGeneratedMifuBattleChainScenario() {
  const scenario = createEmptyScenario('scenario:generated-mifu-chain', '弭弗三段战技样本');
  scenario.battle.durationFrames = 300;
  scenario.battle.resourceRules = {
    ...scenario.battle.resourceRules,
    initialSp: 300,
    spRecoveryPerSecond: 0,
  };
  const battleGroup = mifuGeneratedOperator.skillGroups.find(group => group.key === 'battleSkill')!;
  const baseSkill = Array.isArray(battleGroup.skills) ? battleGroup.skills[0]! : battleGroup.skills;
  // 原生第二段只在结算前读到至少三层 NoGuard 时换入第三段。测试前置只建立这项
  // 敌方状态，不改弭弗三段技能、换槽 Buff 或伤害定义本身。
  const battleChainOperator: OperatorDefinition = {
    ...mifuGeneratedOperator,
    skillGroups: mifuGeneratedOperator.skillGroups.map(group =>
      group !== battleGroup
        ? group
        : {
            ...group,
            skills: {
              ...baseSkill,
              scheduledSequences: [
                scheduled(
                  0,
                  sequence(
                    ...Array.from({ length: 3 }, () =>
                      step('applyBuff', {
                        buffId: 'buff_physical_no_guard',
                        target: 'enemy',
                        inheritSourceSkillCastInfo: true,
                      }),
                    ),
                  ),
                ),
                ...baseSkill.scheduledSequences,
              ],
            },
          },
    ),
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
  for (const [skillKey, startFrame] of [
    ['battleSkill1', 1],
    ['battleSkill2', 40],
    ['battleSkill3', 120],
  ] as const) {
    placed = placeSkillGroup({
      scenario: placed,
      trackIndex: 0,
      operator: battleChainOperator,
      skillGroupKey: 'battleSkill',
      skillKey,
      startFrame,
      ids,
    }).scenario;
  }
  placed.tracks[0]!.skillCasts.at(-1)!.simulationInputs = {
    cameraToTargetSignedAngleDegrees: 0,
  };
  return { scenario: placed, operator: battleChainOperator };
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
        getCommonBuffDefinitions: () => commonBuffDefinitions,
      },
    },
  });
}

describe('runStandardPlayerDamageScenarioSimulation', () => {
  it('refunds Estella talent SP after she outputs the native shatter buff', () => {
    const run = (talentLevel: 1 | 2) => {
      // The damage half of Estella's battle skill independently reads the still-unresolved
      // CharacterTemplateData key EntityBB_first_hit. Keep the exact generated talent-consume
      // sequence and feed it the native shatter Buff identity through Estella's own output event;
      // this avoids inventing an entity-blackboard initializer or changing event ownership.
      const refundSequence = estellaBattleSkill.scheduledSequences.find(
        scheduledSequence =>
          scheduledSequence.startFrame === 21 &&
          JSON.stringify(scheduledSequence.sequence).includes(
            'buff_chr_0021_whiten_talent_0_active',
          ),
      );
      if (refundSequence === undefined) throw new Error('missing Estella talent refund sequence');
      const talentTriggerAndConsumptionSkill = {
        ...estellaBattleSkill,
        scheduledSequences: [
          scheduled(
            0,
            sequence(
              step('applyBuff', {
                buffId: 'buff_common_cryst_triggered_physical_break',
                target: 'enemy',
                inheritSourceSkillCastInfo: true,
                blackboardAssignments: {
                  atk_scale: { kind: 'constant', value: 0 },
                },
              }),
            ),
          ),
          refundSequence,
        ],
      };
      const estellaForTalentTest = {
        ...estellaGeneratedOperator,
        skillGroups: estellaGeneratedOperator.skillGroups.map(group =>
          group.key === 'battleSkill'
            ? { ...group, skills: talentTriggerAndConsumptionSkill }
            : group,
        ),
      };
      const scenario = createEmptyScenario(
        `scenario:generated-estella-talent-${talentLevel}`,
        '艾斯黛拉冻结碎冰返还',
      );
      scenario.battle.durationFrames = 600;
      scenario.battle.resourceRules = {
        ...scenario.battle.resourceRules,
        initialSp: 300,
        spRecoveryPerSecond: 0,
      };
      const build = (operatorSlug: string, talentStates: Record<number, number>) => ({
        operatorSlug,
        level: 90,
        promoted: true,
        potential: 0,
        trustLevel: 4,
        skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
        talentStates,
      });
      scenario.tracks[0] = {
        id: 'track:estella',
        operator: build(estellaGeneratedOperator.slug, { 0: talentLevel }),
        weapon: null,
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [],
      };
      let nextId = 0;
      const ids = { allocate: (kind: string) => `${kind}:estella-talent:${++nextId}` };
      const placements = [
        {
          trackIndex: 0 as const,
          operator: estellaForTalentTest,
          skillGroupKey: 'battleSkill',
          startFrame: 1,
        },
      ];
      const placed = placements.reduce(
        (current, placement) => placeSkillGroup({ scenario: current, ids, ...placement }).scenario,
        scenario,
      );
      return runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 500,
        criticalSamples: new ExplicitCriticalSampleSource(Array(100).fill(1)),
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        elementalInflictionDocument: elementalAttachments,
        options: {
          ...standardOptions(),
          index: {
            getCommonBuffDefinitions: () => commonBuffDefinitions,
            getOperator: slug =>
              slug === estellaGeneratedOperator.slug ? estellaForTalentTest : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
    };

    const refunds = (talentLevel: 1 | 2) =>
      run(talentLevel).receiptEntries.filter(
        entry =>
          entry.event === 'SpChanged' &&
          entry.sourceId === 'track:estella' &&
          entry.data?.requestedValue === (talentLevel === 1 ? 7.5 : 15),
      );
    expect(refunds(1)).toHaveLength(1);
    expect(refunds(2)).toHaveLength(1);
  });

  it('stacks Chen Qianyu talent 1 from skill damage before the next attack', () => {
    const run = (talentLevel: 1 | 2) => {
      const scenario = createEmptyScenario(
        `scenario:generated-chen-talent-${talentLevel}`,
        '陈千语技能伤害叠攻',
      );
      scenario.tracks[0] = {
        id: 'track:chen-qianyu',
        operator: {
          operatorSlug: chenQianyuGeneratedOperator.slug,
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
      let nextId = 0;
      const ids = { allocate: (kind: string) => `${kind}:chen-talent:${++nextId}` };
      const skill = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: chenQianyuGeneratedOperator,
        skillGroupKey: 'battleSkill',
        startFrame: 1,
        ids,
      }).scenario;
      const attack = placeSkillGroup({
        scenario: skill,
        trackIndex: 0,
        operator: chenQianyuGeneratedOperator,
        skillGroupKey: 'basicAttack',
        skillKey: 'basicAttack1',
        startFrame: 40,
        ids,
      }).scenario;
      return runStandardPlayerDamageScenarioSimulation({
        scenario: attack,
        endFrame: 80,
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
              slug === chenQianyuGeneratedOperator.slug ? chenQianyuGeneratedOperator : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
            getCommonBuffDefinitions: () => commonBuffDefinitions,
          },
        },
      });
    };

    const attackDamage = (talentLevel: 1 | 2) =>
      run(talentLevel).receiptEntries.find(
        entry =>
          entry.event === 'DamageApplied' &&
          String(entry.data?.stepKey).includes('chr_0005_chen_attack1'),
      )?.data?.value as number | undefined;
    expect(attackDamage(1)).toBeTypeOf('number');
    expect(attackDamage(2)).toBeGreaterThan(attackDamage(1) ?? 0);
  });

  it('applies both Rossi talent 1 levels to the real battle-skill bleed chain', () => {
    const run = (talentLevel: 1 | 2) => {
      const scenario = createEmptyScenario(
        `scenario:generated-rossi-bleed-talent-${talentLevel}`,
        '洛茜战技流血天赋',
      );
      scenario.battle.durationFrames = 1200;
      scenario.enemy.editable.stagger = {
        ...scenario.enemy.editable.stagger,
        maximum: 1,
      };
      scenario.battle.resourceRules = {
        ...scenario.battle.resourceRules,
        initialSp: 100,
        spRecoveryPerSecond: 0,
      };
      scenario.tracks[0] = {
        id: 'track:perlica',
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
        gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
        initialState: { ultimateEnergy: 0 },
        skillCasts: [],
      };
      scenario.tracks[1] = {
        id: 'track:rossi',
        operator: {
          operatorSlug: rossiGeneratedOperator.slug,
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
      let nextId = 0;
      const ids = {
        allocate: (kind: string) => `${kind}:rossi-bleed-${talentLevel}:${++nextId}`,
      };
      const staggered = placeSkillGroup({
        scenario,
        trackIndex: 0,
        operator: perlicaGeneratedOperator,
        skillGroupKey: 'battleSkill',
        startFrame: 1,
        ids,
      }).scenario;
      const placed = placeSkillGroup({
        scenario: staggered,
        trackIndex: 1,
        operator: rossiGeneratedOperator,
        skillGroupKey: 'battleSkill',
        startFrame: 20,
        ids,
      }).scenario;
      return runStandardPlayerDamageScenarioSimulation({
        scenario: placed,
        endFrame: 1100,
        criticalSamples: new ExplicitCriticalSampleSource(Array(200).fill(1)),
        resolveNonRandomRuntimeSnapshot: () => ({
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        }),
        elementalInflictionDocument: elementalAttachments,
        options: {
          ...standardOptions(),
          index: {
            getCommonBuffDefinitions: () => commonBuffDefinitions,
            getOperator: slug =>
              slug === rossiGeneratedOperator.slug
                ? rossiGeneratedOperator
                : slug === perlicaGeneratedOperator.slug
                  ? perlicaGeneratedOperator
                  : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
    };

    const bleedDamage = (talentLevel: 1 | 2) => {
      const entries = run(talentLevel).receiptEntries;
      return entries.filter(
        entry =>
          entry.event === 'DamageApplied' &&
          String(entry.data?.stepKey).includes(
            'buff_chr_0028_wulfa_normal_bleed:/lifecycleSequences/trigger',
          ),
      );
    };
    const level1 = bleedDamage(1);
    const level2 = bleedDamage(2);
    expect(level1.length).toBeGreaterThan(0);
    expect(level2.length).toBeGreaterThan(level1.length);
    expect(level2[0]?.data?.value as number).toBeGreaterThan(level1[0]?.data?.value as number);
  });

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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
            getCommonBuffDefinitions: () => commonBuffDefinitions,
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
            String(entry.data?.stepKey).includes('chr_0028_wulfa_attack4'),
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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
      delayedDamage.filter(entry =>
        String(entry.data?.stepKey).includes('/lifecycleSequences/trigger'),
      ),
    ).toHaveLength(3);
    expect(
      delayedDamage.filter(entry => String(entry.data?.stepKey).includes('/scheduledSequences/')),
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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
        // 时间轴保存玩家显式选择的具体技能形态。原生换槽状态只负责
        // 校验此时输入实际会解析成什么，不再暗中改写技能块。
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
            getCommonBuffDefinitions: () => commonBuffDefinitions,
            getOperator: slug =>
              slug === rossiGeneratedOperator.slug ? rossiGeneratedOperator : null,
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
    };

    // 正式产物保留命中停帧；QTE 有效 Buff 的现实时间窗口为 60..75 帧。
    const inside = simulate(65);
    const outside = simulate(82);

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
            getCommonBuffDefinitions: () => commonBuffDefinitions,
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
      endFrame: 2000,
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
      simulate(potential)
        .receiptEntries.filter(entry => entry.event === 'DamageApplied')
        .reduce(
          (sum, entry) => sum + (typeof entry.data?.value === 'number' ? entry.data.value : 0),
          0,
        );

    expect(damage(0)).toBeTypeOf('number');
    expect(damage(3)).toBeGreaterThan(damage(0) as number);
  });

  it('lets an ally plunging attack upgrade Tangtang ultimate ability-entity follow-up', () => {
    const simulate = (includeAllyPlungingAttack: boolean) =>
      runStandardPlayerDamageScenarioSimulation({
        scenario: createGeneratedTangtangUltimateResponseScenario(includeAllyPlungingAttack),
        endFrame: 240,
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
            getCommonBuffDefinitions: () => commonBuffDefinitions,
            getOperator: slug => {
              if (slug === tangtangGeneratedOperator.slug) return tangtangGeneratedOperator;
              if (slug === perlicaGeneratedOperator.slug) return perlicaGeneratedOperator;
              return null;
            },
            getWeapon: () => null,
            getGear: () => null,
            getGearSet: () => null,
          },
        },
      });
    const baseline = simulate(false);
    const triggered = simulate(true);
    const tangtangDamage = (result: typeof baseline) =>
      result.receiptEntries
        .filter(entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:tangtang')
        .map(entry => entry.data!);

    expect(triggered.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'BuffApplied',
        sourceId: expect.stringMatching(/^ability-entity:/),
        targetId: 'track:perlica',
        data: expect.objectContaining({ buffId: 'buff_chr_0027_tangtang_ultskill_buff_damage' }),
      }),
    );
    expect(tangtangDamage(triggered)).toHaveLength(tangtangDamage(baseline).length);
    expect(tangtangDamage(baseline).at(-1)?.stepKey).toContain('/scheduledSequences/1/');
    expect(tangtangDamage(triggered).at(-1)?.stepKey).toContain('/scheduledSequences/2/');
    expect(tangtangDamage(triggered).at(-1)?.value).toBeGreaterThan(
      tangtangDamage(baseline).at(-1)?.value as number,
    );
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
            getCommonBuffDefinitions: () => commonBuffDefinitions,
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

  it('runs generated Mifu shield creation and active battle-skill replacement', () => {
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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
        event: 'SkillStarted',
        sourceId: 'track:mifu',
        data: expect.objectContaining({ skillId: 'battleSkill2' }),
      }),
    );
  });

  it('runs all three generated Mifu battle-skill forms with stable hit identities', () => {
    const fixture = createGeneratedMifuBattleChainScenario();
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: fixture.scenario,
      endFrame: 300,
      criticalSamples: new ExplicitCriticalSampleSource(Array(20).fill(1)),
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      options: {
        ...standardOptions(),
        index: {
          getCommonBuffDefinitions: () => commonBuffDefinitions,
          getOperator: slug => (slug === fixture.operator.slug ? fixture.operator : null),
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
    expect(damageSteps.filter(stepKey => stepKey.includes('normalskill_1'))).toHaveLength(1);
    expect(damageSteps.filter(stepKey => stepKey.includes('normalskill_2'))).toHaveLength(3);
    expect(damageSteps.filter(stepKey => stepKey.includes('normalskill_3'))).toHaveLength(1);
    const thirdFormDamage = result.receiptEntries.find(
      entry =>
        entry.event === 'DamageApplied' && String(entry.data?.stepKey).includes('normalskill_3'),
    );
    expect(thirdFormDamage?.data?.value).toBeTypeOf('number');
    expect(thirdFormDamage?.data?.value as number).toBeGreaterThan(0);
    expect(
      result.receiptEntries
        .filter(
          entry =>
            entry.event === 'DamageApplied' &&
            String(entry.data?.stepKey).includes('chr_0031_mifu_normalskill_'),
        )
        .every(
          entry => typeof entry.data?.castId === 'string' && typeof entry.data?.hitId === 'string',
        ),
    ).toBe(true);
  });

  it('keeps generated Last Rite party Buff damage attributed to the Buff source', () => {
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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
    expect(phantomDamage).toMatchObject({ sourceId: 'track:last-rite-source' });
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'ElementalInflictionApplied',
        sourceId: 'track:last-rite-source',
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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
          reason: 'ignite',
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
          stepKey: expect.stringContaining('buff_common_originum_frozen:'),
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
            getCommonBuffDefinitions: () => commonBuffDefinitions,
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
        event: 'BuffApplied',
        sourceId: 'track:endministrator',
        targetId: 'track:endministrator',
        data: expect.objectContaining({
          buffId: 'buff_chr_0003_endminf_talent_1_tirgger',
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
            getCommonBuffDefinitions: () => commonBuffDefinitions,
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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
      endFrame: 1400,
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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
        },
      },
    });
    // 技能内动作会受已编译的实体命中停顿影响；轴上释放时刻固定，但内部第 54 帧
    // 不能再用旧逻辑帧常量反推现实帧。以实际倒地输出验证同帧潜能响应。
    const knockDown = result.receiptEntries.find(
      entry => entry.event === 'PhysicalInflictionApplied' && entry.data?.type === 'knockDown',
    );
    expect(knockDown).toBeDefined();
    const knockDownFrame = knockDown!.frame;
    const damageAtKnockDown = result.receiptEntries.filter(
      entry => entry.frame === knockDownFrame && entry.event === 'DamageApplied',
    );
    expect(damageAtKnockDown).toHaveLength(3);
    expect(damageAtKnockDown).toContainEqual(
      expect.objectContaining({
        data: expect.objectContaining({
          stepKey:
            'buff_chr_0015_lifeng_talent_2:/abilityEventResponses/0/sequence/steps/0/whenTrue/steps/4',
        }),
      }),
    );
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
            getCommonBuffDefinitions: () => commonBuffDefinitions,
            getOperator: slug =>
              [akekuri, perlicaGeneratedOperator].find(operator => operator.slug === slug) ?? null,
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

    expect(perlicaBattleDamage(simulate(true, 0, 240))).toBeCloseTo(perlicaBattleDamage(baseline));
    expect(perlicaBattleDamage(simulate(true, 5, 240))).toBeCloseTo(
      perlicaBattleDamage(baseline) * 1.3,
    );
    expect(perlicaBattleDamage(simulate(true, 5, 360))).toBeCloseTo(perlicaBattleDamage(baseline));
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
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
        event: 'SkillCostUnavailableAtStart',
        sourceId: 'track:1',
        data: expect.objectContaining({ skillId: 'ultimate' }),
      }),
    );
    expect(
      result.receiptEntries.filter(
        entry =>
          entry.event === 'SkillCostApplied' &&
          entry.sourceId === 'track:1' &&
          entry.data?.skillId === 'ultimate',
      ),
    ).toHaveLength(2);
    expect(result.receiptEntries).toContainEqual(
      expect.objectContaining({
        event: 'UltimateEnergyChanged',
        sourceId: 'track:1',
        data: expect.objectContaining({ requestedValue: -80, actualValue: 0, currentValue: 0 }),
      }),
    );
  });

  it('runs every generated Perlica skill type through the production simulation flow', () => {
    const result = runStandardPlayerDamageScenarioSimulation({
      scenario: placeGeneratedPerlicaFlow(perlicaFormalOperator),
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
          getOperator: slug => (slug === perlicaFormalOperator.slug ? perlicaFormalOperator : null),
          getWeapon: () => null,
          getGear: () => null,
          getGearSet: () => null,
          getCommonBuffDefinitions: () => commonBuffDefinitions,
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
