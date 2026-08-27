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
import { avywennaGeneratedOperator as old } from '../../../src/next/data/operators/generated/avywenna.operator.generated';
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
  args = {
    manifest: 'scripts/generate_next_operators/operators.json',
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
    expect(operator.potentials).toEqual(old.potentials);
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
      expect(operator[key], key).toEqual(old[key]);
    expect(Object.keys(operator.abilityEntityDefinitions!)).toHaveLength(2);
    expect(Object.keys(operator.buffDefinitions!)).toHaveLength(5);
    expect(
      Object.keys(operator.buffDefinitions!).every(id => id.startsWith('buff_chr_0012_avywen_')),
    ).toBe(true);
    expect(
      Object.keys(candidate.commonBuffDefinitions).every(id => id.startsWith('buff_common_')),
    ).toBe(true);
    expect(candidate.audit.buffSourceCount).toBe(11);
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
