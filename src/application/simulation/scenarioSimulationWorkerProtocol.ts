import type {
  ScenarioSimulationService,
  ScenarioSimulationRun,
  ScenarioSimulationPerformanceSample,
} from './scenarioSimulationService';
import type { ScenarioDocument } from '../../core/project/schema';

import type { RecursiveSkillChain } from './recursiveSkillChain';
import { restoreCombatReceiptView } from '../../core/combat/receipt/combatReceiptHistory';
import type { ScenarioSimulationGameData } from './scenarioSimulationGameData';

export type SimulationPlan = Awaited<ReturnType<ScenarioSimulationService['planSkillChain']>>;
type TransferableScenarioSimulationRun = Omit<ScenarioSimulationRun, 'receiptHistory'>;
type TransferableSimulationPlan =
  | Exclude<SimulationPlan, { readonly status: 'planned' }>
  | (Omit<Extract<SimulationPlan, { readonly status: 'planned' }>, 'run'> & {
      readonly run: TransferableScenarioSimulationRun;
    });
export type SimulationWorkerResult = TransferableScenarioSimulationRun | TransferableSimulationPlan;
export interface SimulationWorkerRequest {
  readonly id: number;
  readonly revision: number;
  /** 首次请求、定义变更或场景引用集合变更时发送；其余请求复用 Worker 中的仓库。 */
  readonly gameData?: ScenarioSimulationGameData;
  readonly scenario: ScenarioDocument;
  readonly endFrame: number;
  readonly plan?: {
    readonly castIds: readonly string[];
    readonly mode: 'continuation' | 'compact';
    readonly extension?: RecursiveSkillChain;
  };
}
export type SimulationWorkerResponse = {
  readonly id: number;
  readonly samples: readonly ScenarioSimulationPerformanceSample[];
} & (
  | { readonly ok: true; readonly result: SimulationWorkerResult }
  | { readonly ok: false; readonly message: string }
);

function isTransferableSimulationRun(value: unknown): value is TransferableScenarioSimulationRun {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { readonly receiptEntries?: unknown }).receiptEntries)
  );
}

function removeHistory(run: ScenarioSimulationRun): TransferableScenarioSimulationRun {
  const { receiptHistory: _receiptHistory, ...transferable } = run;
  return transferable;
}

/** Worker 只发送结构化克隆可表达的纯数据，不发送带进程内身份的历史视图。 */
export function toSimulationWorkerResult(
  result: ScenarioSimulationRun | SimulationPlan,
): SimulationWorkerResult {
  if ('receiptHistory' in result) return removeHistory(result);
  if (result.status === 'planned') return { ...result, run: removeHistory(result.run) };
  return result;
}

/** 只恢复发布时已有的曲线保护，不递归冻结其他只读类型字段。 */
function freezePublishedCurve(curve: { readonly points: readonly object[] }): void {
  for (const point of curve.points) Object.freeze(point);
  Object.freeze(curve.points);
  Object.freeze(curve);
}

function restoreRun(run: TransferableScenarioSimulationRun): ScenarioSimulationRun {
  const receiptHistory = restoreCombatReceiptView(run.receiptEntries);
  // structuredClone 不保留 freeze。这里恢复本地收集器明确提供的快照保证，
  // 不冻结可编辑方案、编译器对象或当前仍可变的资源快照、诊断 reasons 等字段。
  freezePublishedCurve(run.resourceCurves.sp);
  for (const curve of run.resourceCurves.ultimateEnergy) freezePublishedCurve(curve);
  Object.freeze(run.resourceCurves.ultimateEnergy);
  Object.freeze(run.resourceCurves);
  Object.freeze(run.enemyVitals);
  for (const curve of run.buffProgressCurves) freezePublishedCurve(curve);
  Object.freeze(run.buffProgressCurves);
  for (const diagnostics of [
    run.availabilityDiagnostics,
    run.executionDiagnostics,
    run.comboWindowDiagnostics,
  ]) {
    for (const diagnostic of diagnostics) {
      Object.freeze(diagnostic.receiptSequences);
      Object.freeze(diagnostic);
    }
    Object.freeze(diagnostics);
  }
  return Object.freeze({
    ...run,
    receiptHistory,
    receiptEntries: receiptHistory.toArray(),
  });
}

/** 主线程为收到的纯数据重建只属于当前进程的固定历史视图。 */
export function fromSimulationWorkerResult(
  result: SimulationWorkerResult,
): ScenarioSimulationRun | SimulationPlan {
  if (isTransferableSimulationRun(result)) return restoreRun(result);
  if (result.status === 'planned') return { ...result, run: restoreRun(result.run) };
  return result;
}
