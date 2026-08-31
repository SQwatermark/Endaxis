/**
 * 场景一变，就重新跑一遍模拟。
 *
 * 上一次的模拟还没跑完就被作废，只认最新一次的结果；技能块的警告标记也从
 * 这次模拟的结果里标出来。本文件只负责"什么时候跑、用哪次结果"，不算任何战斗数值。
 */
import { computed, onScopeDispose, ref, shallowRef, watch, type ComputedRef, type Ref } from 'vue';
import type { ScenarioSimulationRun } from '../../application/scenarioSimulationService';
import type { ScenarioSimulationPerformanceSample } from '../../application/scenarioSimulationService';
import type { ScenarioSimulationService } from '../../application/scenarioSimulationService';
import type { ScenarioDocument } from '../../core/project/schema';
import type { SkillAvailabilityDiagnosticReason } from '../../core/projection/skillAvailabilityDiagnostics';
import type { SkillExecutionDiagnosticReason } from '../../core/projection/skillExecutionDiagnostics';
import type { ComboWindowDiagnosticReason } from '../../core/projection/comboWindowDiagnostics';
import { appendSimulationPerformanceSample } from './simulationPerformanceAudit';

export type TimelineSkillDiagnosticReason =
  SkillAvailabilityDiagnosticReason | SkillExecutionDiagnosticReason | ComboWindowDiagnosticReason;

export interface UseScenarioSimulationOptions {
  readonly scenario: Ref<ScenarioDocument>;
  readonly service: ScenarioSimulationService;
  /** 编辑停止后的触发延迟；默认 150ms。 */
  readonly debounceMs?: number;
}

/** 一次成功模拟的完整发布单元；后台计算完成前不会改变。 */
export interface PublishedScenarioSimulation {
  readonly scenario: ScenarioDocument;
  readonly run: ScenarioSimulationRun;
}

export interface UseScenarioSimulationResult {
  /** 上一次成功模拟的完整快照；新模拟成功后整体替换。 */
  readonly published: ComputedRef<PublishedScenarioSimulation | null>;
  readonly run: ComputedRef<ScenarioSimulationRun | null>;
  readonly running: Ref<boolean>;
  /** 当前展示的结果是否已经落后于最新场景内容。 */
  readonly stale: Ref<boolean>;
  readonly error: Ref<string | null>;
  /** 最近的模拟墙钟耗时样本，供实时性能审计展示。 */
  readonly performanceSamples: Ref<readonly ScenarioSimulationPerformanceSample[]>;
  /** 每个技能块的警告原因列表，键是技能块的 id。 */
  readonly diagnosticsByCastId: ComputedRef<
    ReadonlyMap<string, readonly TimelineSkillDiagnosticReason[]>
  >;
  /** 立即取消等待并执行一次模拟。 */
  /** 立即运行并返回本次结果是否成功成为新的已发布快照。 */
  readonly simulateNow: () => Promise<boolean>;
}

const DEFAULT_DEBOUNCE_MS = 150;

export function useScenarioSimulation(
  options: UseScenarioSimulationOptions,
): UseScenarioSimulationResult {
  const debounceMs = options.debounceMs ?? DEFAULT_DEBOUNCE_MS;
  const publishedState = shallowRef<PublishedScenarioSimulation | null>(null);
  const published = computed(() => publishedState.value);
  const run = computed(() => publishedState.value?.run ?? null);
  const running = ref(false);
  const stale = ref(false);
  const error = ref<string | null>(null);
  const performanceSamples = shallowRef<readonly ScenarioSimulationPerformanceSample[]>([]);
  let latestRunId = 0;
  let pendingTimer: ReturnType<typeof setTimeout> | null = null;
  const unsubscribePerformance =
    options.service.subscribePerformance?.(sample => {
      performanceSamples.value = appendSimulationPerformanceSample(
        performanceSamples.value,
        sample,
      );
    }) ?? (() => undefined);

  async function runSimulation(): Promise<boolean> {
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
      const result = await options.service.simulate(
        scenario,
        scenario.battle.simulationRange?.endFrame ?? scenario.battle.durationFrames,
      );
      // 跑完才发现有更新的任务或场景已经变了，这次结果就不要了。
      if (runId !== latestRunId || options.scenario.value !== scenario) return false;
      publishedState.value = Object.freeze({ scenario, run: result });
      stale.value = false;
      return true;
    } catch (caught) {
      if (runId !== latestRunId || options.scenario.value !== scenario) return false;
      error.value = caught instanceof Error ? caught.message : String(caught);
      // 失败不发布半成品，也不拆掉上一份完整快照。
      stale.value = publishedState.value !== null && publishedState.value.scenario !== scenario;
      return false;
    } finally {
      if (runId === latestRunId) running.value = false;
    }
  }

  function scheduleSimulation(): void {
    if (pendingTimer !== null) clearTimeout(pendingTimer);
    // 场景一变化立即标脏，使诊断不再冒充当前结果；展示层仍可保留上一份投影，
    // 等新模拟完成后原子替换，避免时间映射和效果层在等待期间闪回默认状态。
    stale.value = true;
    pendingTimer = setTimeout(() => {
      pendingTimer = null;
      void runSimulation();
    }, debounceMs);
  }

  function simulateNow(): Promise<boolean> {
    return runSimulation();
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
    unsubscribePerformance();
  });

  const diagnosticsByCastId = computed<
    ReadonlyMap<string, readonly TimelineSkillDiagnosticReason[]>
  >(() => {
    const snapshot = publishedState.value;
    if (snapshot === null) return new Map();
    const current = snapshot.run;
    const scenario = snapshot.scenario;

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
    published,
    run,
    running,
    stale,
    error,
    performanceSamples,
    diagnosticsByCastId,
    simulateNow,
  };
}
