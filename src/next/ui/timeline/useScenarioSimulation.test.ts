import { effectScope, nextTick, shallowRef } from 'vue';
import { describe, expect, it } from 'vitest';
import type { ScenarioDocument } from '../../core/project/schema';
import { ScenarioEditorSession } from '../../application/editor/scenarioEditorSession';
import { createEmptyScenario } from '../../core/project/createProject';
import { perlica, zhuangFangyi } from '../../data/operators';
import { placeSkillGroup } from './placeSkillGroup';
import { ScenarioSimulationService } from '../../application/scenarioSimulationService';
import { useScenarioSimulation, type UseScenarioSimulationResult } from './useScenarioSimulation';

const service = new ScenarioSimulationService({
  index: {
    getOperator: (slug: string) =>
      slug === perlica.slug ? perlica : slug === zhuangFangyi.slug ? zhuangFangyi : null,
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

async function waitFor(predicate: () => boolean, timeoutMs = 1000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error('waitFor timed out');
    await new Promise(resolve => setTimeout(resolve, 1));
  }
}

function createHarness(initial: ScenarioDocument) {
  const session = new ScenarioEditorSession(initial);
  const scenario = shallowRef<ScenarioDocument>(initial);
  session.subscribe(snapshot => {
    scenario.value = snapshot.scenario;
  });
  let result!: UseScenarioSimulationResult;
  const scope = effectScope();
  scope.run(() => {
    result = useScenarioSimulation({ scenario, service, debounceMs: 0 });
  });
  return { session, scenario, result, stop: () => scope.stop() };
}

function createPerlicaScenario(): ScenarioDocument {
  const scenario = createEmptyScenario('scenario:composable', '组合式函数样本');
  scenario.battle.durationFrames = 300;

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

describe('useScenarioSimulation', () => {
  it('场景变化后立即把旧模拟标记为过期', async () => {
    const initial = createPerlicaScenario();
    const scenario = shallowRef<ScenarioDocument>(initial);
    const fakeRun = {
      availabilityDiagnostics: [],
      executionDiagnostics: [],
      comboWindowDiagnostics: [],
    };
    const fakeService = {
      simulate: async () => fakeRun,
    } as unknown as ScenarioSimulationService;
    let result!: UseScenarioSimulationResult;
    const scope = effectScope();
    scope.run(() => {
      result = useScenarioSimulation({ scenario, service: fakeService, debounceMs: 10_000 });
    });
    try {
      result.simulateNow();
      await waitFor(() => result.run.value !== null);
      expect(result.stale.value).toBe(false);

      scenario.value = { ...initial, name: '拖动预览' };
      await nextTick();

      expect(result.run.value).not.toBeNull();
      expect(result.stale.value).toBe(true);
    } finally {
      scope.stop();
    }
  });

  it('场景变化后自动运行并保留防竞态的最新结果', async () => {
    const { session, result, stop } = createHarness(createPerlicaScenario());
    try {
      await waitFor(() => result.run.value !== null);
      expect(result.running.value).toBe(false);
      expect(result.stale.value).toBe(false);
      expect(result.error.value).toBeNull();

      session.commit(
        'placeSkillGroup',
        current =>
          placeSkillGroup({
            scenario: current,
            trackIndex: 0,
            operator: perlica,
            skillGroupKey: 'plungingAttack',
            startFrame: 1,
            ids: { allocate: kind => `${kind}:1` },
          }).scenario,
      );
      await waitFor(
        () =>
          result.run.value?.receiptEntries.some(entry => entry.event === 'DamageApplied') ?? false,
      );
      expect(result.stale.value).toBe(false);
    } finally {
      stop();
    }
  });

  it('严格失败时保留上一份完整快照并暴露错误', async () => {
    const { session, result, stop } = createHarness(createPerlicaScenario());
    try {
      await waitFor(() => result.run.value !== null);
      const previous = result.published.value;

      // 庄方宜的普攻带语义状态条件与状态步骤，标准环境尚未接入，会触发严格失败。
      session.commit('placeUnsupportedOperator', () => {
        const next = createPerlicaScenario();
        next.tracks[0] = {
          id: 'track:0',
          operator: {
            operatorSlug: zhuangFangyi.slug,
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
          scenario: next,
          trackIndex: 0,
          operator: zhuangFangyi,
          skillGroupKey: 'basicAttack',
          startFrame: 1,
          ids: { allocate: kind => `${kind}:1` },
        }).scenario;
      });
      await waitFor(() => result.error.value !== null);
      expect(result.published.value).toBe(previous);
      expect(result.run.value).toBe(previous?.run ?? null);
      expect(result.stale.value).toBe(true);
      expect(result.error.value?.length ?? 0).toBeGreaterThan(0);
    } finally {
      stop();
    }
  });

  it('新模拟完成前不改动已发布快照，完成后只替换一次快照引用', async () => {
    const initial = createPerlicaScenario();
    const scenario = shallowRef<ScenarioDocument>(initial);
    const firstRun = {
      availabilityDiagnostics: [],
      executionDiagnostics: [],
      comboWindowDiagnostics: [],
    };
    const secondRun = {
      availabilityDiagnostics: [],
      executionDiagnostics: [],
      comboWindowDiagnostics: [],
    };
    let resolveSecond!: (value: typeof secondRun) => void;
    let calls = 0;
    const fakeService = {
      simulate: async () => {
        calls += 1;
        if (calls === 1) return firstRun;
        return new Promise<typeof secondRun>(resolve => {
          resolveSecond = resolve;
        });
      },
    } as unknown as ScenarioSimulationService;
    let result!: UseScenarioSimulationResult;
    const scope = effectScope();
    scope.run(() => {
      result = useScenarioSimulation({ scenario, service: fakeService, debounceMs: 0 });
    });
    try {
      await waitFor(() => result.published.value !== null);
      const firstSnapshot = result.published.value;

      scenario.value = { ...initial, name: '后台构造的新场景' };
      await waitFor(() => calls === 2);
      expect(result.running.value).toBe(true);
      expect(result.stale.value).toBe(true);
      expect(result.published.value).toBe(firstSnapshot);
      expect(result.run.value).toBe(firstRun);

      resolveSecond(secondRun);
      await waitFor(() => result.published.value !== firstSnapshot);
      expect(result.published.value).toEqual({ scenario: scenario.value, run: secondRun });
      expect(result.run.value).toBe(secondRun);
      expect(result.stale.value).toBe(false);
    } finally {
      scope.stop();
    }
  });

  it('把诊断按稳定身份归约到具体技能块', async () => {
    const initial = createPerlicaScenario();
    const fakeRun = {
      availabilityDiagnostics: [
        {
          frame: 1,
          sourceId: 'track:0',
          skillId: 'plungingAttack',
          reasons: ['resourceUnavailable' as const],
          receiptSequences: [0],
        },
      ],
      executionDiagnostics: [],
      comboWindowDiagnostics: [],
    };
    const fakeService = {
      simulate: async () => fakeRun,
    } as unknown as ScenarioSimulationService;
    const session = new ScenarioEditorSession(initial);
    const scenario = shallowRef<ScenarioDocument>(initial);
    session.subscribe(snapshot => {
      scenario.value = snapshot.scenario;
    });
    let result!: UseScenarioSimulationResult;
    const scope = effectScope();
    scope.run(() => {
      result = useScenarioSimulation({ scenario, service: fakeService, debounceMs: 0 });
    });
    try {
      session.commit(
        'placeSkillGroup',
        current =>
          placeSkillGroup({
            scenario: current,
            trackIndex: 0,
            operator: perlica,
            skillGroupKey: 'plungingAttack',
            startFrame: 1,
            ids: { allocate: kind => `${kind}:1` },
          }).scenario,
      );
      await waitFor(() => result.diagnosticsByCastId.value.size > 0);

      const cast = session.snapshot.scenario.tracks[0]?.skillCasts[0];
      const castId = cast?.id ?? 'missing';
      expect(result.diagnosticsByCastId.value.get(castId)).toEqual(['resourceUnavailable']);
    } finally {
      scope.stop();
    }
  });
});
