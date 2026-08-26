import { describe, expect, it } from 'vitest';

import type { WeaponDefinition } from '../core/game-data/equipmentDefinition';
import type { OperatorDefinition } from '../core/game-data/operatorDefinition';
import { createEmptyScenario } from '../core/project/createProject';
import type { TrackDocument } from '../core/project/schema';
import { skillSettings } from '../data/combat/skillSettings';
import { generatedWeaponDefinitions } from '../data/equipment/generated-weapons/index.generated';
import { createGameDataRepository, nextGameDataRepository } from '../data/gameDataRepository';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from './scenarioSimulationService';
import { StandardPlayerDamageCompatibilityError } from '../core/combat/runtime/standardPlayerDamageCompatibility';

// 候选定义必须实际经过生产编译/战斗环境；不借用旧武器行为，也不依赖本地原始资源。
const candidates: readonly WeaponDefinition[] = generatedWeaponDefinitions;
const repository = createGameDataRepository({
  revision: 'generated-weapon-production-audit',
  operators: nextGameDataRepository.getOperators(),
  weapons: candidates,
  commonBuffDefinitions: nextGameDataRepository.getCommonBuffDefinitions?.(),
  commonAbilityEntityDefinitions: nextGameDataRepository.getCommonAbilityEntityDefinitions?.(),
});

// 明确失败边界，不是完成豁免：新增失败或旧失败消失都会使门禁变红，必须同步审计。
const attachedSkill =
  'currentCastSkill Buff lifetime requires a native CastSkillContext attachment port';
const originSkill = 'originSkillTypeIn requires an event source skill cast identity';
const knownBlockers: Readonly<Record<string, string>> = {
  wpn_claym_0016:
    "buff 'buff_wpn_claym_0016_dmgup' priority blackboard key 'lv' is missing or not numeric",
  wpn_funnel_0016: 'asChildBuff applyBuff requires a Buff or Ability owner context',
  wpn_lance_0006: attachedSkill,
  wpn_lance_0010: 'equipment-triggered damage requires a recovered source-classification path',
  wpn_lance_0016: originSkill,
  wpn_pistol_0004: originSkill,
  wpn_pistol_0008: originSkill,
  wpn_sword_0015: attachedSkill,
  wpn_sword_0017: attachedSkill,
  wpn_sword_0020: originSkill,
  wpn_sword_0021: attachedSkill,
  wpn_sword_0026: "standard player damage environment does not support 'heal'",
};

describe('生成武器的正式模拟门禁', () => {
  it('包含全部 77 把候选且不从旧适配定义补行为', () => {
    expect(candidates).toHaveLength(77);
    expect(new Set(candidates.map(weapon => weapon.slug)).size).toBe(77);
    expect(Object.keys(knownBlockers)).toHaveLength(12);
    expect(
      Object.keys(knownBlockers).every(slug => candidates.some(item => item.slug === slug)),
    ).toBe(true);
  });

  it.each(candidates)('$slug 四类技能生产模拟或精确报告已知阻塞', async weapon => {
    const operator = repository
      .getOperators()
      .find(
        candidate =>
          candidate.weaponType === weapon.weaponType &&
          ['basicAttack', 'battleSkill', 'comboSkill', 'ultimate'].every(key =>
            candidate.skillGroups.some(group => group.key === key),
          ),
      );
    if (!operator) throw new Error(`no compatible operator for ${weapon.slug}`);
    let result;
    try {
      result = await simulateWeapon(weapon, operator);
    } catch (error) {
      const expected = knownBlockers[weapon.slug];
      if (expected === undefined) throw error;
      if (error instanceof StandardPlayerDamageCompatibilityError) {
        expect(error.issues.length).toBeGreaterThan(0);
        expect(error.issues.every(issue => issue.detail === expected)).toBe(true);
      } else {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(expected);
      }
      return;
    }
    expect(knownBlockers[weapon.slug], '已知阻塞已修复，必须移出清单').toBeUndefined();
    expect(result.finalEnemyHealth).toBeLessThan(result.enemyVitals.initialHealth);
  });

  it('真实战技触发武器加攻，后续技能伤害提高，图标 Buff 在 20 秒后结束', async () => {
    const weapon = candidates.find(item => item.slug === 'wpn_claym_0003')!;
    const operator =
      repository.getOperator('da-pan') ??
      repository.getOperators().find(item => item.weaponType === 'greatsword')!;
    const disabled: WeaponDefinition = {
      ...weapon,
      traits: weapon.traits.map(({ eventHandlers: _events, ...trait }) => trait),
    };
    const active = await simulateWeapon(weapon, operator, ['battleSkill', 'basicAttack']);
    const baseline = await simulateWeapon(disabled, operator, ['battleSkill', 'basicAttack']);
    expect(active.operatorPanels[0]!.attack).toBe(baseline.operatorPanels[0]!.attack);
    expect(active.finalEnemyHealth).toBeLessThan(baseline.finalEnemyHealth);
    const applied = active.receiptEntries
      .filter(
        entry => entry.event === 'BuffApplied' && entry.data?.buffId === 'buff_wpn_claym_0003',
      )
      .at(-1);
    const ended = active.receiptEntries.find(
      entry => entry.event === 'BuffFinished' && entry.data?.buffId === 'buff_wpn_claym_0003',
    );
    expect(applied).toBeDefined();
    expect(ended?.data?.reason).toBe('lifetime');
    expect(ended!.time - applied!.time).toBeCloseTo(20, 1);
  });
});

async function simulateWeapon(
  weapon: WeaponDefinition,
  operator: OperatorDefinition,
  skillGroups: readonly string[] = ['basicAttack', 'battleSkill', 'comboSkill', 'ultimate'],
) {
  let scenario = createEmptyScenario(`audit:generated:${weapon.slug}`, '生成武器生产验证');
  scenario.battle.durationFrames = 1800;
  scenario.enemy.editable.hp = 1_000_000_000;
  scenario.battle.resourceRules = {
    maxSp: 1000,
    initialSp: 1000,
    spRecoveryPerSecond: 100,
    defaultSkillSpCost: 100,
  };
  const track: TrackDocument = {
    id: 'track:weapon-owner',
    operator: {
      operatorSlug: operator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: Object.fromEntries(operator.skillGroups.map(group => [group.key, 12])),
      talentStates: Object.fromEntries(operator.talents.map((_, index) => [index, 0])),
    },
    weapon: {
      weaponSlug: weapon.slug,
      level: 90,
      tuned: true,
      potential: 5,
      traitLevels: weapon.traits.map(trait => trait.levelCount),
    },
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 1000, maxUltimateEnergyOverride: 1000 },
    skillCasts: [],
  };
  scenario.tracks[0] = track;
  let id = 0;
  for (const [index, skillGroupKey] of skillGroups.entries()) {
    scenario = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator,
      skillGroupKey,
      startFrame: 1 + index * 300,
      ids: { allocate: kind => `${kind}:generated-audit:${id++}` },
    }).scenario;
  }
  return new ScenarioSimulationService({
    index: {
      ...repository,
      getWeapon: slug => (slug === weapon.slug ? weapon : repository.getWeapon(slug)),
    },
    repositoryRevision: repository.revision,
    resources: {
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecoveryPauseDuration: 1.5,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
    },
    spellInflictionSettings: skillSettings,
  }).simulate(scenario, 1800);
}
