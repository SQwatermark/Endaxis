import { effectScope, shallowRef } from 'vue';
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
    normalSkillUltimateEnergy: { selfGainPerSp: 0.5, otherGainPerSp: 0.25 },
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

describe('useScenarioSimulation', () => {
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

  it('严格失败时丢弃旧结果并暴露错误', async () => {
    const { session, result, stop } = createHarness(createPerlicaScenario());
    try {
      await waitFor(() => result.run.value !== null);

      // 庄方宜的普攻带语义状态条件与状态步骤，标准环境尚未接入，会触发严格失败。
      session.commit('placeUnsupportedOperator', () => {
        const next = createPerlicaScenario();
        next.builds.operators[zhuangFangyi.slug] = {
          id: zhuangFangyi.slug,
          operatorSlug: zhuangFangyi.slug,
          level: 90,
          promoted: true,
          potential: 0,
          trustLevel: 4,
          skillLevels: { basicAttack: 12, battleSkill: 12, comboSkill: 12, ultimate: 12 },
          talentStates: {},
        };
        next.tracks[0] = {
          operatorBuildId: zhuangFangyi.slug,
          weaponBuildId: null,
          gearBuildIds: { armor: null, gloves: null, accessory1: null, accessory2: null },
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
      expect(result.run.value).toBeNull();
      expect(result.error.value?.length ?? 0).toBeGreaterThan(0);
    } finally {
      stop();
    }
  });

  it('把诊断按稳定身份归约到具体技能块', async () => {
    const initial = createPerlicaScenario();
    const fakeRun = {
      availabilityDiagnostics: [
        {
          frame: 1,
          sourceId: 'perlica',
          skillId: 'plungingAttack',
          reasons: ['resourceUnavailable' as const],
          receiptSequences: [0],
        },
      ],
      executionDiagnostics: [],
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
