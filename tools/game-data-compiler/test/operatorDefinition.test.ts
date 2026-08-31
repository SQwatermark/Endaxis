import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  planOperatorDefinition,
  generateOperatorDefinition,
} from '../scripts/planOperatorDefinition.ts';
import { avywenna } from '../../../src/next/data/operators/avywenna';
import { commonBuffDefinitions } from '../../../src/next/data/buffs/commonDefinitions';
import {
  validateAbilityEntityDefinition,
  validateSkillDefinition,
} from '../../../src/next/core/game-data/validateSkillDefinition';
import { ScenarioSimulationService } from '../../../src/next/application/scenarioSimulationService';
import { createEmptyScenario } from '../../../src/next/core/project/createProject';
import { placeSkillGroup } from '../../../src/next/ui/timeline/placeSkillGroup';
import { skillSettings } from '../../../src/next/data/combat/skillSettings';

let sourceRoot: string;
let candidate: ReturnType<typeof planOperatorDefinition>;
let args: Parameters<typeof planOperatorDefinition>[0];

function avywennaRuntimeTemplateFixture(): unknown {
  return {
    format: 'character-template-prefix-v1',
    decodeStatus: 'partial',
    sourceSha256: 'aefbe71b7b9b14a258c922be943c3329fcb3cef8dd8f57dd860f7c8c7e3549cc',
    root: {
      class: 'CharacterTemplateData',
      namespace: 'Beyond.Gameplay',
      assembly: 'Gameplay.Beyond',
    },
    abilitySystemEntry: {
      class: 'AbilitySystemData',
      namespace: 'Beyond.Gameplay.Core',
      assembly: 'Gameplay.Beyond',
    },
    data: { id: 'chr_0012_avywen' },
    abilitySystem: {
      modeConfig: {
        modes: [
          {
            modeId: 'default',
            modeLayer: 'default',
            defaultEnable: true,
            overrideNormalAttackList: false,
            normalAttackList: [],
            overrideCmdMapping: false,
            cmdMapping: { keys: [], values: [] },
          },
        ],
      },
      entityBlackboard: [],
      skillDataBundle: {
        allNormalAttackId: [
          'chr_0012_avywen_attack1',
          'chr_0012_avywen_attack2',
          'chr_0012_avywen_attack3',
          'chr_0012_avywen_attack4',
          'chr_0012_avywen_attack5',
          'chr_0012_avywen_plunging_attack_start',
          'chr_0012_avywen_plunging_attack_end',
          'chr_0012_avywen_dash_attack',
          'chr_0012_avywen_power_attack',
        ],
        allActiveSkillId: [
          'chr_0012_avywen_normal_skill',
          'chr_0012_avywen_ultimate_skill',
          'common_character_perfect_dodge',
          'chr_0012_avywen_combo_skill',
        ],
        allPassiveSkillId: [],
        normalAttackList: [
          'chr_0012_avywen_attack1',
          'chr_0012_avywen_attack2',
          'chr_0012_avywen_attack3',
          'chr_0012_avywen_attack4',
          'chr_0012_avywen_attack5',
        ],
        enabledBreakingNormalAttacks: ['chr_0012_avywen_power_attack'],
        enabledPassiveSkills: [],
        normalSkillId: 'chr_0012_avywen_normal_skill',
        ultimateSkillId: 'chr_0012_avywen_ultimate_skill',
        plungingAttackStartId: 'chr_0012_avywen_plunging_attack_start',
        plungingAttackEndId: 'chr_0012_avywen_plunging_attack_end',
        dodgeSkillId: 'common_character_perfect_dodge',
        comboSkillId: 'chr_0012_avywen_combo_skill',
        defaultCmdMapping: {
          keys: [0, 3, 4, 5],
          values: [
            'chr_0012_avywen_attack1',
            'chr_0012_avywen_normal_skill',
            'chr_0012_avywen_combo_skill',
            'chr_0012_avywen_ultimate_skill',
          ],
        },
        activeSkillTypeOverrides: { keys: [], values: [] },
        enableComboSkillBlackboard: false,
        comboSkillBlackboard: [],
        comboSkillConditions: [],
      },
    },
    conditionReferences: {},
  };
}

beforeAll(() => {
  sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'endaxis-operator-inputs-'));
  const fixture = JSON.parse(
    fs.readFileSync(new URL('./fixtures/avywenna-operator-inputs.json', import.meta.url), 'utf8'),
  ) as {
    files: Record<string, { data: unknown }>;
  };
  for (const [file, { data }] of Object.entries(fixture.files)) {
    const destination = path.resolve(sourceRoot, file);
    if (!destination.startsWith(sourceRoot + path.sep)) throw new Error('unsafe fixture path');
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, JSON.stringify(data));
  }
  const runtimeTemplatePath = path.join(
    sourceRoot,
    'CharacterData/chr_0012_avywen.runtime-template.json',
  );
  fs.mkdirSync(path.dirname(runtimeTemplatePath), { recursive: true });
  fs.writeFileSync(runtimeTemplatePath, JSON.stringify(avywennaRuntimeTemplateFixture()));
  args = {
    manifest: 'tools/game-data-compiler/config/operators.json',
    sourceRoot,
    tableRoot: path.join(sourceRoot, 'TableCfg-1.4.4-9433094-12'),
    skillPatchTable: path.join(sourceRoot, 'TableCfg-1.4.4-9433094-12/SkillPatchTable.json'),
    buffDataRoot: path.join(sourceRoot, 'BuffData'),
    abilityEntityCatalog: 'src/next/data/ability-entities/ability-entity-templates-1.4.4.json',
    projectileBlackboardCatalog:
      'src/next/data/projectiles/projectile-entity-blackboards-1.4.4.json',
    gameplayTagCatalog: 'src/next/data/combat/gameplayTagCatalog.generated.ts',
    timeDilationCatalog: 'src/next/data/combat/timeDilationCatalog.ts',
    globalBuffCatalog: 'src/next/data/global-buffs/global-buff-templates-1.4.4.json',
    skillSettingCatalog: 'src/next/data/combat/skill-setting.combat-1.4.4.json',
    slug: 'avywenna',
    output: 'src/next/data/operators/generated-definitions/avywenna',
    auditOutput: 'tmp/game-data-audit/operator-definitions/avywenna',
  };
  candidate = planOperatorDefinition(args);
});
afterAll(() => {
  if (sourceRoot) fs.rmSync(sourceRoot, { recursive: true, force: true });
});

describe('原始整名候选：不依赖旧 Operator 补空', () => {
  it('正式注册消费整名产物，异地原始快照重建 --check 一致', async () => {
    expect(avywenna).toEqual({
      ...candidate.operator,
      conversionSupport: { completeness: 'complete', missingCapabilities: [] },
    });
    expect(commonBuffDefinitions).toMatchObject(candidate.commonBuffDefinitions);
    await expect(generateOperatorDefinition({ ...args, check: true })).resolves.toMatchObject({
      skillCount: 10,
      entityCount: 2,
    });
  });

  it('原始依赖缺失就阻塞，不能回退旧 Buff 定义', () => {
    const file = path.join(sourceRoot, 'BuffData/buff_chr_0012_avywen_talent_0.json');
    const original = fs.readFileSync(file, 'utf8');
    try {
      fs.rmSync(file);
      expect(() => planOperatorDefinition(args)).toThrow(/buff_chr_0012_avywen_talent_0/);
    } finally {
      fs.writeFileSync(file, original);
    }
  });
  it('头部、技能库、养成、Buff 与实体同时闭合，公共 Buff 保持只读目录归属', () => {
    const operator = candidate.operator;
    expect(operator.skillGroups).toHaveLength(6);
    expect(operator.skillGroups.flatMap(group => group.skills)).toHaveLength(10);
    expect(operator.talents).toHaveLength(2);
    expect(operator.potentials).toEqual(avywenna.potentials);
    for (const key of [
      'slug',
      'gameId',
      'rarity',
      'weaponType',
      'element',
      'role',
      'mainAttribute',
      'secondaryAttribute',
      'attributes',
    ] as const)
      expect(operator[key], key).toEqual(avywenna[key]);
    expect(Object.keys(operator.abilityEntityDefinitions!)).toHaveLength(2);
    expect(Object.keys(operator.buffDefinitions!)).toHaveLength(4);
    expect(operator.buffDefinitions).not.toHaveProperty(
      'buff_chr_0012_avywen_lance_becalled_ready',
    );
    expect(
      Object.keys(operator.buffDefinitions!).every(id => id.startsWith('buff_chr_0012_avywen_')),
    ).toBe(true);
    expect(
      Object.keys(candidate.commonBuffDefinitions).every(id => !id.startsWith('buff_chr_')),
    ).toBe(true);
    expect(candidate.audit.buffSourceCount).toBe(10);
    for (const skill of operator.skillGroups.flatMap(group => group.skills))
      expect(validateSkillDefinition(skill)).toEqual([]);
    for (const entity of Object.values(operator.abilityEntityDefinitions!))
      expect(validateAbilityEntityDefinition(entity)).toEqual([]);
  });

  it.each([0, 1, 2, 3, 4, 5])('潜能 %i：真实连携→战技能生成枪、召回并造成伤害', async potential => {
    const result = await simulate(
      [
        ['comboSkill', 1],
        ['battleSkill', 200],
      ],
      potential,
    );
    const spawned = result.receiptEntries.filter(entry => entry.event === 'AbilityEntitySpawned');
    const finished = result.receiptEntries.filter(entry => entry.event === 'AbilityEntityFinished');
    expect(spawned.length).toBeGreaterThan(0);
    expect(finished).toHaveLength(spawned.length);
    expect(finished.every(entry => entry.frame < 600)).toBe(true);
    expect(
      result.receiptEntries.some(entry => entry.event === 'DamageApplied' && entry.frame > 200),
    ).toBe(true);
  });

  it.each([0, 1, 2, 3, 4, 5])('潜能 %i：真实终结技→战技走完整实体/Buff/回收链', async potential => {
    const result = await simulate(
      [
        ['ultimate', 1],
        ['battleSkill', 200],
      ],
      potential,
    );
    expect(
      result.receiptEntries.filter(entry => entry.event === 'AbilityEntitySpawned'),
    ).toHaveLength(1);
    expect(
      result.receiptEntries.filter(entry => entry.event === 'AbilityEntityFinished'),
    ).toHaveLength(1);
    expect(result.receiptEntries.some(entry => entry.event === 'DamageApplied')).toBe(true);
  });
  it('实际普攻链、处决和下落攻击均能模拟', async () => {
    const result = await simulate(
      [
        ['basicAttack', 1],
        ['finisher', 220],
        ['plungingAttack', 320],
      ],
      5,
    );
    expect(
      result.receiptEntries.filter(entry => entry.event === 'DamageApplied').length,
    ).toBeGreaterThanOrEqual(7);
  });
});

async function simulate(casts: readonly (readonly [string, number])[], potential: number) {
  const operator = candidate.operator;
  let scenario = createEmptyScenario('full-operator', '真实艾维文娜整名候选');
  scenario.battle.durationFrames = 600;
  scenario.enemy.editable.hp = 1e9;
  scenario.tracks[0] = {
    id: 'track:full',
    operator: {
      operatorSlug: operator.slug,
      level: 90,
      promoted: true,
      potential,
      trustLevel: 4,
      skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
      talentStates: { '0': 2, '1': 2 },
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 1000, maxUltimateEnergyOverride: 1000 },
    skillCasts: [],
  };
  let serial = 0;
  for (const [skillGroupKey, startFrame] of casts)
    scenario = placeSkillGroup({
      scenario,
      operator,
      trackIndex: 0,
      skillGroupKey,
      startFrame,
      ids: { allocate: kind => `${kind}:full:${serial++}` },
    }).scenario;
  return new ScenarioSimulationService({
    index: {
      getOperator: slug => (slug === operator.slug ? operator : null),
      getCommonBuffDefinitions: () => candidate.commonBuffDefinitions,
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
    spellInflictionSettings: skillSettings,
  }).simulate(scenario, 600);
}
