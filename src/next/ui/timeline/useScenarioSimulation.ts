/**
 * 场景一变，就重新跑一遍模拟。
 *
 * 上一次的模拟还没跑完就被作废，只认最新一次的结果；技能块的警告标记也从
 * 这次模拟的结果里标出来。本文件只负责"什么时候跑、用哪次结果"，不算任何战斗数值。
 */
import { computed, onScopeDispose, ref, shallowRef, watch, type ComputedRef, type Ref } from 'vue';
import type { ScenarioSimulationRun } from '../../application/scenarioSimulationService';
import type { ScenarioSimulationService } from '../../application/scenarioSimulationService';
import type { ScenarioDocument } from '../../core/project/schema';
import type { SkillAvailabilityDiagnosticReason } from '../../core/projection/skillAvailabilityDiagnostics';
import type { SkillExecutionDiagnosticReason } from '../../core/projection/skillExecutionDiagnostics';
import type { ComboWindowDiagnosticReason } from '../../core/projection/comboWindowDiagnostics';

export type TimelineSkillDiagnosticReason =
  SkillAvailabilityDiagnosticReason | SkillExecutionDiagnosticReason | ComboWindowDiagnosticReason;

export interface UseScenarioSimulationOptions {
  readonly scenario: Ref<ScenarioDocument>;
  readonly service: ScenarioSimulationService;
  /** 编辑停止后的触发延迟；默认 150ms。 */
  readonly debounceMs?: number;
}

export interface UseScenarioSimulationResult {
  /** 与最新场景内容一致的运行结果；重新调度期间保留上一次结果。 */
  readonly run: Ref<ScenarioSimulationRun | null>;
  readonly running: Ref<boolean>;
  /** 当前展示的结果是否已经落后于最新场景内容。 */
  readonly stale: Ref<boolean>;
  readonly error: Ref<string | null>;
  /** 每个技能块的警告原因列表，键是技能块的 id。 */
  readonly diagnosticsByCastId: ComputedRef<
    ReadonlyMap<string, readonly TimelineSkillDiagnosticReason[]>
  >;
  /** 立即取消等待并执行一次模拟。 */
  readonly simulateNow: () => void;
}

const DEFAULT_DEBOUNCE_MS = 150;

export function useScenarioSimulation(
  options: UseScenarioSimulationOptions,
): UseScenarioSimulationResult {
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const run = shallowRef<ScenarioSimulationRun | null>(null);
  const running = ref(false);
  const stale = ref(false);
  const error = ref<string | null>(null);
  let latestRunId = 0;
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;
  let lastSimulatedScenario: ScenarioDocument | null = null;

  async function runSimulation(): Promise<void> {
    if (pendingTimer !== null) {
      clearTimeout(pendingTimer);
      pendingTimer = null;
    }
    const scenario = options.scenario.value;
    const runId = ++latestRunId;
    running.value = true;
    stale.value = true;
    error.value = null;
    try {
      const result = await options.service.simulate(scenario, scenario.battle.durationFrames);
      // 跑完才发现有更新的任务或场景已经变了，这次结果就不要了。
      if (runId !== latestRunId || options.scenario.value !== scenario) return;
      run.value = result;
      lastSimulatedScenario = scenario;
      stale.value = false;
    } catch (caught) {
      if (runId !== latestRunId || options.scenario.value !== scenario) return;
      error.value = caught instanceof Error ? caught.message : String(caught);
      // 模拟失败就清掉旧结果，免得页面上展示和当前场景对不上的曲线。
      run.value = null;
      lastSimulatedScenario = null;
      stale.value = false;
    } finally {
      if (runId === latestRunId) running.value = false;
    }
  }

  function scheduleSimulation(): void {
    if (pendingTimer !== null) clearTimeout(pendingTimer);
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      void runSimulation();
    }, debounceMs);
  }

  function simulateNow(): void {
    void runSimulation();
  }

  const stopWatch = watch(
    () => options.scenario.value,
    () => scheduleSimulation(),
    { immediate: true },
  );

  onScopeDispose(() => {
    stopWatch();
    if (pendingTimer !== null) clearTimeout(pendingTimer);
    latestRunId += 1;
  });

  const diagnosticsByCastId = computed<
    ReadonlyMap<string, readonly TimelineSkillDiagnosticReason[]>
  >(() => {
    const current = run.value;
    const scenario = options.scenario.value;
    if (current === null || lastSimulatedScenario !== scenario) return new Map();

    const diagnostics = [
      ...current.availabilityDiagnostics.map(diagnostic => ({
        frame: diagnostic.frame,
        sourceId: diagnostic.sourceId,
        skillId: diagnostic.skillId,
        reason: diagnostic.reasons,
      })),
      ...current.executionDiagnostics.map(diagnostic => ({
        frame: diagnostic.frame,
        sourceId: diagnostic.sourceId,
        skillId: diagnostic.skillId,
        reason: diagnostic.reasons,
      })),
      ...current.comboWindowDiagnostics.map(diagnostic => ({
        frame: diagnostic.frame,
        sourceId: diagnostic.sourceId,
        skillId: diagnostic.skillId,
        reason: diagnostic.reasons,
      })),
    ];
    const byCastId = new Map<string, TimelineSkillDiagnosticReason[]>();
    for (const diagnostic of diagnostics) {
      for (const track of scenario.tracks) {
        if (track === null || track.id !== diagnostic.sourceId) continue;
        for (const cast of track.skillCasts) {
          if (cast.source.kind !== 'operatorSkill') continue;
          if (
            cast.source.skillKey === diagnostic.skillId &&
            cast.placement.startFrame === diagnostic.frame
          ) {
            const existing = byCastId.get(cast.id) ?? [];
            byCastId.set(cast.id, [...existing, ...diagnostic.reason]);
          }
        }
      }
    }
    return byCastId;
  });

  return {
    run,
    running,
    stale,
    error,
    diagnosticsByCastId,
    simulateNow,
  };
}
