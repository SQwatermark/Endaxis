import { describe, expect, it } from 'vitest';
import { createEmptyScenario } from '../core/project/createProject';
import type { ScenarioDocument } from '../core/project/schema';
import { perlica } from '../data/operators/perlica';
import { placeSkillGroup } from '../ui/timeline/placeSkillGroup';
import {
  createDefaultCriticalSampleSource,
  ScenarioSimulationService,
} from './scenarioSimulationService';

function createPerlicaScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:service', '服务样本');
  scenario.battle.durationFrames = 900;
  scenario.builds.operators.perlica = {
    id: 'perlica',
    operatorSlug: perlica.slug,
    level: 90,
    promoted: true,
    potential: 0,
    trustLevel: 4,
    skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
    talentStates: {},
  };
  scenario.tracks[0] = {
    operatorBuildId: 'perlica',
    weaponBuildId: null,
    gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
    initialState: { ultimateEnergy: 0 },
    skillCasts: [],
  };
  return scenario;
}

function createService(cacheLimit?: number): ScenarioSimulationService {
  return new ScenarioSimulationService(
    {
      index: testIndex,
      repositoryRevision: 'test-definitions',
      resources: {
        sharedSpGain: { baseGainEfficiency: 1 },
        spRecoveryPauseDuration: 1.5,
        ultimateEnergySystemUnlocked: true,
        normalSkillUltimateEnergy: { selfGainPerSp: 0.5, otherGainPerSp: 0.25 },
      },
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

    const run = await createService().simulate(placed, 120);

    const reaction = run.receiptEntries.find(entry => entry.event === 'ElementalReactionApplied');
    expect(reaction?.data?.reaction).toBe('electrification');
    expect(reaction?.data?.level).toBe(1);
    expect(run.receiptEntries.some(entry => entry.event === 'DamageApplied')).toBe(true);
    expect(run.receiptEntries.some(entry => entry.event === 'PoiseApplied')).toBe(true);
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
        normalSkillUltimateEnergy: { selfGainPerSp: 0.5, otherGainPerSp: 0.25 },
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
