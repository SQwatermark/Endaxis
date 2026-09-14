import type {
  ScenarioSimulationService,
  ScenarioSimulationRun,
  ScenarioSimulationPerformanceSample,
} from './scenarioSimulationService';
import type { ScenarioDocument, ProjectDefinitionLibraryDocument } from '../core/project/schema';
import type { RecursiveSkillChain } from './recursiveSkillChain';
import { restoreCombatReceiptView } from '../core/combat/receipt/combatReceiptHistory';

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
  readonly library?: ProjectDefinitionLibraryDocument;
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
  if (isTransferableSimulationRun(result)) return removeHistory(result);
  if (result.status === 'planned') return { ...result, run: removeHistory(result.run) };
  return result;
}

function restoreRun(run: TransferableScenarioSimulationRun): ScenarioSimulationRun {
  const receiptHistory = restoreCombatReceiptView(run.receiptEntries);
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
