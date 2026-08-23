import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../core/project/createProject';
import type { ScenarioDocument } from '../core/project/schema';
import { projectEnemyEffectViz } from '../core/projection/enemyEffectViz';
import { perlica } from '../data/operators/perlica';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import {
  createDefaultCriticalSampleSource,
  ScenarioSimulationService,
  type ScenarioSimulationPerformanceSample,
} from './scenarioSimulationService';

function createPerlicaScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:service', '服务样本');
  scenario.battle.durationFrames = 900;

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

function createTwoOperatorComboScenario(): {
  readonly scenario: ScenarioDocument;
  readonly attacker: typeof perlica;
} {
  const scenario = createPerlicaScenario();
  const attacker = {
    ...perlica,
    slug: 'perlica-combo-test-attacker',
    comboSkillRegistrations: [],
  } satisfies typeof perlica;
  scenario.tracks[0]!.operator!.operatorSlug = attacker.slug;
  scenario.tracks[1] = {
    id: 'track:1',
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
  return { scenario, attacker };
}

function createService(
  cacheLimit?: number,
  performanceNow?: () => number,
): ScenarioSimulationService {
  return new ScenarioSimulationService(
    {
      index: testIndex,
      repositoryRevision: 'test-definitions',
      resources: {
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecoveryPauseDuration: 1.5,
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0.065, otherGainPerSp: 0.065 },
      },
      ...(performanceNow === undefined ? {} : { performanceNow }),
    },
    cacheLimit,
  );
}

const testIndex = {
  revision: 'test-definitions',
  getOperator: (slug: string) => (slug === perlica.slug ? perlica : null),
  getWeapon: () => null,
  getGear: () => null,
  getGearSet: () => null,
};

describe('ScenarioSimulationService', () => {
  it('在同一份回执上投影资源、敌人生命、失衡和技能诊断', async () => {
    const scenario = createPerlicaScenario();
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'plungingAttack',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:1` },
    }).scenario;

    const run = await createService().simulate(placed, 4);

    const damage = run.receiptEntries.find(entry => entry.event === 'DamageApplied');
    expect(damage).toBeDefined();
    expect(run.enemyHealthCurve.points.at(-1)?.value).toBe(run.finalEnemyHealth);
    // 单节点失衡账本以敌人帧制失衡规则为初始值。
    expect(run.poiseCurve.maxValue).toBe(300);
    expect(run.poiseCurve.points[0]).toMatchObject({ value: 300 });
    expect(run.availabilityDiagnostics).toEqual([]);
    expect(run.executionDiagnostics).toEqual([]);
    expect(run.resourceCurves.sp.points[0]).toMatchObject({ value: run.initialResources.sp });
  });

  it('战技在附着与失衡运行时接入后可以完整执行', async () => {
    const scenario = createPerlicaScenario();
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:1` },
    }).scenario;

    const run = await createService().simulate(placed, 60);

    expect(run.receiptEntries.some(entry => entry.event === 'ElementalInflictionApplied')).toBe(
      true,
    );
    expect(run.receiptEntries.some(entry => entry.event === 'PoiseApplied')).toBe(true);
    expect(run.receiptEntries.some(entry => entry.event === 'DamageApplied')).toBe(true);
  });

  it('连携技在反应状态接入后可以完整执行', async () => {
    const scenario = createPerlicaScenario();
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'comboSkill',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:1` },
    }).scenario;

    const run = await createService().simulate(placed, 240);

    const reaction = run.receiptEntries.find(entry => entry.event === 'ElementalReactionApplied');
    expect(reaction?.data?.reaction).toBe('electrification');
    expect(reaction?.data?.level).toBe(1);
    expect(reaction?.data?.durationSeconds).toBe(5);
    if (reaction === undefined) throw new Error('expected Perlica combo reaction receipt');
    expect(projectEnemyEffectViz(run.receiptEntries, run.frame).segments).toContainEqual({
      kind: 'reaction',
      reaction: 'electrification',
      level: 1,
      startFrame: reaction.frame,
      endFrame: reaction.frame + 150,
    });
    expect(run.receiptEntries.some(entry => entry.event === 'DamageApplied')).toBe(true);
    expect(run.receiptEntries.some(entry => entry.event === 'PoiseApplied')).toBe(true);
    expect(run.comboWindowDiagnostics[0]?.reasons).toEqual(['windowMissing']);
  });

  it('由队友末段普攻开启佩丽卡窗口并在后续输入中消费', async () => {
    const { scenario, attacker } = createTwoOperatorComboScenario();
    let nextId = 0;
    const ids = { allocate: (kind: string) => `${kind}:${++nextId}` };
    const withTrigger = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: attacker,
      skillGroupKey: 'basicAttack',
      skillKey: 'basicAttack4',
      startFrame: 1,
      ids,
    }).scenario;
    const withCombo = placeSkillGroup({
      scenario: withTrigger,
      trackIndex: 1,
      operator: perlica,
      skillGroupKey: 'comboSkill',
      startFrame: 30,
      ids,
    }).scenario;
    const service = new ScenarioSimulationService({
      index: {
        getOperator: slug =>
          slug === attacker.slug ? attacker : slug === perlica.slug ? perlica : null,
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
    });

    const run = await service.simulate(withCombo, 90);
    const opened = run.receiptEntries.find(entry => entry.event === 'ComboWindowOpened');
    const consumed = run.receiptEntries.find(entry => entry.event === 'ComboWindowConsumed');

    expect(opened).toMatchObject({ frame: 27, sourceId: 'track:1' });
    expect(consumed).toMatchObject({ frame: 30, sourceId: 'track:1' });
    expect(opened!.sequence).toBeLessThan(consumed!.sequence);
    expect(run.comboWindowDiagnostics).toEqual([]);
    expect(
      run.receiptEntries.some(
        entry => entry.event === 'DamageApplied' && entry.sourceId === 'track:1',
      ),
    ).toBe(true);
  });

  it('重复施加附着时按 SkillSetting 真实打出爆发伤害', async () => {
    const scenario = createPerlicaScenario();
    const ids = { allocate: (kind: string) => `${kind}:${Math.random()}` };
    const first = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids,
    }).scenario;
    const second = placeSkillGroup({
      scenario: first,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 40,
      ids,
    }).scenario;
    const service = new ScenarioSimulationService({
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
      spellInflictionSettings: {
        schemaVersion: 1,
        revision: 'test',
        data: [
          {
            key: '法术爆发伤害倍率',
            values: [1.5, 2, 2.5, 3],
            enhanceFormulaKey: '',
          },
        ],
        enhanceFormulas: [],
      },
    });

    const run = await service.simulate(second, 120);

    const bursts = run.receiptEntries.filter(entry => entry.event === 'SpellBurstApplied');
    expect(bursts.length).toBeGreaterThan(0);
    expect(bursts[0]?.data?.burstType).toBe('Pulse');
    expect((bursts[0]?.data?.value ?? 0) as number).toBeGreaterThan(0);
    expect(run.finalEnemyHealth).toBeLessThan(run.enemy.health);
  });

  it('爆发触发但缺少 SkillSetting 数据时明确失败', async () => {
    const scenario = createPerlicaScenario();
    const ids = { allocate: (kind: string) => `${kind}:${Math.random()}` };
    const first = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 1,
      ids,
    }).scenario;
    const second = placeSkillGroup({
      scenario: first,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'battleSkill',
      startFrame: 40,
      ids,
    }).scenario;

    await expect(createService().simulate(second, 120)).rejects.toThrow(
      'requires SkillSetting data',
    );
  });

  it('相同场景内容与目标帧复用已冻结运行结果', async () => {
    const scenario = createPerlicaScenario();
    const service = createService();

    const first = await service.simulate(scenario, 30);
    const second = await service.simulate(scenario, 30);

    expect(second).toBe(first);
    expect(Object.isFrozen(second.receiptEntries)).toBe(true);
  });

  it('发布可堆叠的模拟阶段耗时并区分缓存命中', async () => {
    let now = 0;
    const service = createService(undefined, () => now++);
    const samples: ScenarioSimulationPerformanceSample[] = [];
    const unsubscribe = service.subscribePerformance(sample => samples.push(sample));

    await service.simulate(createPerlicaScenario(), 30);
    await service.simulate(createPerlicaScenario(), 30);
    unsubscribe();

    expect(samples).toHaveLength(2);
    expect(samples[0]).toMatchObject({
      totalMs: 3,
      cacheLookupMs: 1,
      simulationMs: 1,
      projectionMs: 1,
      cacheHit: false,
      outcome: 'completed',
    });
    expect(samples[1]).toMatchObject({
      totalMs: 2,
      cacheLookupMs: 2,
      simulationMs: 0,
      projectionMs: 0,
      cacheHit: true,
      outcome: 'completed',
    });
  });

  it('场景内容变化后不再命中旧缓存', async () => {
    const service = createService();
    const scenario = createPerlicaScenario();
    const placed = placeSkillGroup({
      scenario,
      trackIndex: 0,
      operator: perlica,
      skillGroupKey: 'plungingAttack',
      startFrame: 1,
      ids: { allocate: kind => `${kind}:1` },
    }).scenario;

    const emptyRun = await service.simulate(scenario, 30);
    const placedRun = await service.simulate(placed, 30);

    expect(placedRun).not.toBe(emptyRun);
    expect(placedRun.receiptEntries.some(entry => entry.event === 'DamageApplied')).toBe(true);
  });

  it('拒绝已中止的请求', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      createService().simulate(createPerlicaScenario(), 30, controller.signal),
    ).rejects.toThrow('aborted');
  });

  it('超过容量时淘汰最早完成的运行结果', async () => {
    const service = createService(1);
    const first = await service.simulate(createPerlicaScenario(), 30);
    const secondScenario = createPerlicaScenario();
    secondScenario.enemy.editable.hp = 200000;
    const second = await service.simulate(secondScenario, 30);

    expect(second).not.toBe(first);
    expect(service.findCached(secondScenario, 30)).toBe(second);
  });

  it('默认暴击策略是确定性的非暴击样本', () => {
    const samples = createDefaultCriticalSampleSource();
    expect(samples.nextCriticalSample()).toBe(1);
    expect(samples.nextCriticalSample()).toBe(1);
  });
});
