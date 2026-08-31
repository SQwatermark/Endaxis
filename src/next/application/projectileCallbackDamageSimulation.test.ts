import { describe, expect, it } from 'vitest';
import { makeReturnProjection } from '../../../tools/game-data-compiler/test/support/avywennaReturnProjection.ts';
import type {
  ActionSequenceDefinition,
  CombatStepDefinition,
  OperatorDefinition,
} from '../core/game-data/operatorDefinition';
import { validateActionSequenceDefinition } from '../core/game-data/validateSkillDefinition';
import { createEmptyScenario } from '../core/project/createProject';
import type { TrackDocument } from '../core/project/schema';
import { nextGameDataRepository } from '../data/gameDataRepository';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import { ScenarioSimulationService } from './scenarioSimulationService';

const talentBuffId = 'buff_chr_0012_avywen_talent_0';
const tagBuffId = 'test:return-target-tag';
const samples = [
  { index: 0, scaleKey: 'atk_scale_lance', poiseKey: 'poise_lance', scale: 1.68, poise: 5 },
  {
    index: 1,
    scaleKey: 'atk_scale_lance_ult',
    poiseKey: 'poise_lance_ult',
    scale: 4.32,
    poise: 10,
  },
] as const;

interface Case {
  index: number;
  energy: number;
  talent: boolean;
  rate?: number;
  tagged?: boolean;
  hit?: boolean;
  launches?: number;
  casts?: number;
  teammate?: boolean;
  normalSkillBonus?: number;
}

// 用真实场景/命中/资源系统运行源动作切片；不是正式艾维文娜整技能成功的替代门禁。
async function simulate(input: Case) {
  const sample = samples[input.index]!;
  const callback = makeReturnProjection(input.index, input.hit ?? true);
  const projected: unknown = { steps: [callback] };
  expect(validateActionSequenceDefinition(projected)).toEqual([]);
  const launches = Array.from(
    { length: input.launches ?? 1 },
    () => (projected as ActionSequenceDefinition).steps[0]!,
  );
  const setup: CombatStepDefinition[] = [
    ...(input.talent
      ? [
          {
            kind: 'applyBuff' as const,
            parameters: { buffId: talentBuffId, target: 'caster' as const },
          },
        ]
      : []),
    ...(input.tagged
      ? [
          {
            kind: 'applyBuff' as const,
            parameters: { buffId: tagBuffId, target: 'enemy' as const },
          },
        ]
      : []),
    ...(input.normalSkillBonus
      ? [
          {
            kind: 'applyBuff' as const,
            parameters: { buffId: 'test:normal-skill-bonus', target: 'caster' as const },
          },
        ]
      : []),
  ];
  const base = nextGameDataRepository.getOperator('avywenna')!;
  const operator: OperatorDefinition = {
    ...base,
    // 只借已发布面板，不安装旧的展平回收链或天赋补丁。
    skillGroups: [
      {
        key: 'battleSkill',
        skillType: 'battleSkill',
        levelSource: 'battleSkill',
        skills: {
          key: 'returnSlice',
          skillType: 'battleSkill',
          levelSource: 'battleSkill',
          timelineBlockFrames: 1,
          blackboard: {
            talent0_usp: input.energy,
            potential_5_rate: input.rate ?? 0,
            [sample.scaleKey]: sample.scale,
            [sample.poiseKey]: sample.poise,
          },
          scheduledSequences: [{ startFrame: 0, sequence: { steps: [...setup, ...launches] } }],
        },
      },
    ],
    talents: [],
    potentials: [],
    abilityEntityDefinitions: {},
    buffDefinitions: {
      [talentBuffId]: base.buffDefinitions![talentBuffId]!,
      // 场景输入：只验证原生 Tag 查询，不假称该测试 Buff 是游戏中的完整异常效果。
      [tagBuffId]: {
        stackingType: 'unique',
        priority: 0,
        maxStackCount: 1,
        applyTags: ['Skill/Character/Common/Affixes/Vulnerable/VulnerablePulse'],
      },
      'test:normal-skill-bonus': {
        stackingType: 'unique',
        priority: 0,
        maxStackCount: 1,
        attributeModifiers: [
          {
            attribute: 'normalSkillDamageIncrease',
            slot: 'addition',
            value: input.normalSkillBonus ?? 0,
          },
        ],
      },
    },
  };
  let scenario = createEmptyScenario('return-damage-slice', '回收命中与回能切片');
  scenario.battle.durationFrames = 90;
  scenario.enemy.editable.hp = 1e9;
  scenario.enemy.editable.stagger.maximum = 10000;
  const track: TrackDocument = {
    id: 'track:return-owner',
    operator: {
      operatorSlug: operator.slug,
      level: 90,
      promoted: true,
      potential: 0,
      trustLevel: 4,
      skillLevels: { battleSkill: 12 },
      talentStates: {},
    },
    weapon: null,
    gears: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0, maxUltimateEnergyOverride: 1000 },
    skillCasts: [],
  };
  scenario.tracks[0] = track;
  if (input.teammate)
    scenario.tracks[1] = { ...structuredClone(track), id: 'track:return-teammate' };
  let id = 0;
  for (let cast = 0; cast < (input.casts ?? 1); cast++) {
    scenario = placeSkillGroup({
      scenario,
      operator,
      trackIndex: 0,
      skillGroupKey: 'battleSkill',
      startFrame: 1 + 20 * cast,
      ids: { allocate: kind => `${kind}:return:${id++}` },
    }).scenario;
  }
  const result = await new ScenarioSimulationService({
    index: {
      ...nextGameDataRepository,
      getOperator: slug =>
        slug === operator.slug ? operator : nextGameDataRepository.getOperator(slug),
    },
    resources: {
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecoveryPauseDuration: 1.5,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
    },
  }).simulate(scenario, 90);
  return {
    result,
    hits: result.receiptEntries.filter(entry => entry.event === 'DamageApplied'),
    poise: result.receiptEntries.filter(entry => entry.event === 'PoiseApplied'),
    gains: result.receiptEntries.filter(entry => entry.event === 'UltimateEnergyChanged'),
  };
}

describe('回收枪伤害与回能切片进入正式模拟环境', () => {
  it.each([0, 1])('%i: 潜能和战技伤害标签均改变最终伤害，不只改变基础倍率回执', async index => {
    const baseline = await simulate({ index, energy: 4, talent: true, tagged: true });
    const potential = await simulate({ index, energy: 4, talent: true, tagged: true, rate: 1.15 });
    const bonus = await simulate({
      index,
      energy: 4,
      talent: true,
      tagged: true,
      normalSkillBonus: 0.4,
    });
    const amount = (run: typeof baseline) => Number(run.hits[0]!.data?.actualDamage);
    expect(amount(potential) / amount(baseline)).toBeCloseTo(1.15, 5);
    expect(amount(bonus) / amount(baseline)).toBeCloseTo(1.4, 5);
  });
  it.each(
    samples.flatMap(sample =>
      [false, true].flatMap(tagged => [0, 1.15].map(rate => ({ ...sample, tagged, rate }))),
    ),
  )(
    '$index: 标签 $tagged / 潜能倍率 $rate 改变真实伤害，失衡不乘潜能',
    async ({ index, scale, poise, tagged, rate }) => {
      const run = await simulate({ index, energy: 4, talent: true, tagged, rate });
      expect(run.hits).toHaveLength(1);
      expect(run.poise).toHaveLength(1);
      const expectedScale = tagged && rate > 0 ? Math.fround(scale * rate) : scale;
      expect(run.hits[0]!.data?.skillMultiplierPercent).toBeCloseTo(expectedScale * 100, 4);
      expect(Number(run.hits[0]!.data?.actualDamage)).toBeGreaterThan(0);
      expect(run.result.finalEnemyHealth).toBeLessThan(1e9);
      expect(run.poise[0]!.data?.actualDelta).toBe(-poise);
      expect(run.gains.map(entry => entry.data?.actualValue)).toEqual([4]);
      const events = run.result.receiptEntries.filter(entry =>
        ['DamageApplied', 'PoiseApplied', 'UltimateEnergyChanged'].includes(entry.event),
      );
      expect(events.map(entry => entry.event)).toEqual([
        'DamageApplied',
        'PoiseApplied',
        'UltimateEnergyChanged',
      ]);
    },
  );

  it.each(
    samples.flatMap(({ index }) =>
      [0, 2, 3, 4, 5, 6].flatMap(energy =>
        [false, true].map(talent => ({ index, energy, talent })),
      ),
    ),
  )(
    '$index: 回能值 $energy / 天赋 $talent 使用真实 Buff 守卫与资源账本',
    async ({ index, energy, talent }) => {
      const run = await simulate({ index, energy, talent, teammate: true });
      expect(run.hits).toHaveLength(1);
      expect(run.gains.map(entry => entry.data?.actualValue)).toEqual(
        talent && energy > 0 ? [energy] : [],
      );
      for (const gain of run.gains) {
        expect(gain.sourceId).toBe('track:return-owner');
        expect(gain.targetId).toBe('track:return-owner');
        expect(gain.data?.currentValue).toBe(energy);
      }
    },
  );

  it.each(samples)(
    '$index: 同一静态节点三次发射、再次施法不累乘潜能也不串实体板',
    async ({ index, scale, poise }) => {
      const run = await simulate({
        index,
        energy: 6,
        talent: true,
        rate: 1.15,
        tagged: true,
        launches: 3,
        casts: 2,
      });
      expect(run.hits).toHaveLength(6);
      for (const hit of run.hits)
        expect(hit.data?.skillMultiplierPercent).toBeCloseTo(Math.fround(scale * 1.15) * 100, 4);
      expect(run.poise.map(entry => entry.data?.actualDelta)).toEqual(Array(6).fill(-poise));
      expect(run.gains.map(entry => entry.data?.actualValue)).toEqual(Array(6).fill(6));
      expect(run.gains.at(-1)?.data?.currentValue).toBe(36);
    },
  );

  it.each([0, 1])('%i: 场景只调用 reach 时没有命中、失衡或虚构回能', async index => {
    const run = await simulate({ index, energy: 6, talent: true, hit: false });
    expect(run.hits).toEqual([]);
    expect(run.poise).toEqual([]);
    expect(run.gains).toEqual([]);
    expect(run.result.finalEnemyHealth).toBe(1e9);
  });
});
