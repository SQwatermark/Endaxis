import { notifySimulationPerformanceSubscribers } from './simulationPerformanceNotification';
import type { ScenarioDocument } from '../../core/project/schema';
import type { CombatReceiptDetail } from '../../core/combat/receipt/combatReceipt';

import type { RecursiveSkillChain } from './recursiveSkillChain';
import type {
  ScenarioSimulationRun,
  ScenarioSimulationPerformanceSubscriber,
} from './scenarioSimulationService';
import type {
  SimulationWorkerRequest,
  SimulationWorkerResponse,
  SimulationPlan,
} from './scenarioSimulationWorkerProtocol';
import { fromSimulationWorkerResult } from './scenarioSimulationWorkerProtocol';
import {
  scenarioSimulationGameDataSelectionKey,
  type ScenarioSimulationGameData,
} from './scenarioSimulationGameData';

type Pending = {
  request: SimulationWorkerRequest;
  resolve(value: ScenarioSimulationRun | SimulationPlan): void;
  reject(reason: Error): void;
  cleanup(): void;
};
const abort = () => new DOMException('模拟请求已被较新位置替代', 'AbortError');

/** 复制消息中的纯数据并剥离 Vue 代理；JSON 往返会把原生曲线使用的 Infinity 改成 null。 */
function transferableData<T>(value: T): T {
  const copied = new WeakMap<object, unknown>();
  const visit = (current: unknown): unknown => {
    if (current === null || typeof current !== 'object') {
      if (typeof current === 'function' || typeof current === 'symbol')
        throw new TypeError('simulation worker request contains non-transferable data');
      return current;
    }
    const previous = copied.get(current);
    if (previous !== undefined) return previous;
    if (Array.isArray(current)) {
      const array: unknown[] = [];
      copied.set(current, array);
      for (const item of current) array.push(visit(item));
      return array;
    }
    if (
      Object.getPrototypeOf(current) !== Object.prototype &&
      Object.getPrototypeOf(current) !== null
    )
      throw new TypeError('simulation worker request contains a non-plain object');
    const record: Record<string, unknown> = Object.create(null);
    copied.set(current, record);
    for (const [key, item] of Object.entries(current)) record[key] = visit(item);
    return record;
  };
  return visit(value) as T;
}

/** 单个在途、单个最新待算请求；不向 Worker 消息队列堆积拖动中间位置。 */
export class WorkerScenarioSimulationService {
  private active?: Pending;
  private pending?: Pending;
  private sequence = 0;
  private revision = 0;
  private sentGameDataKey: string | undefined;
  private disposed = false;
  private subscribers = new Set<ScenarioSimulationPerformanceSubscriber>();
  constructor(
    private worker: Worker,
    private captureGameData: (scenario: ScenarioDocument) => ScenarioSimulationGameData,
  ) {
    worker.onmessage = (event: MessageEvent<SimulationWorkerResponse>) => {
      const response = event.data;
      const current = this.active;
      if (!current || current.request.id !== response.id) return;
      // 错误可能来自定义初始化；后续同一选择集合也必须重新发送定义。
      if (!response.ok) this.sentGameDataKey = undefined;
      this.active = undefined;
      try {
        current.cleanup();
        for (const sample of response.samples)
          notifySimulationPerformanceSubscribers(this.subscribers, sample);
        if (this.disposed || current.request.revision !== this.revision) current.reject(abort());
        else if (response.ok) current.resolve(fromSimulationWorkerResult(response.result));
        else current.reject(new Error(response.message));
      } catch (error) {
        // 回执重建等结果处理失败也必须结算当前请求，不能丢失已移出 active 的任务。
        current.reject(error instanceof Error ? error : new Error(String(error)));
      } finally {
        this.pump();
      }
    };
    worker.onerror = event => this.fail(new Error(event.message || '后台模拟线程失败'));
    worker.onmessageerror = () => this.fail(new Error('后台模拟结果无法反序列化'));
  }
  subscribePerformance(listener: ScenarioSimulationPerformanceSubscriber) {
    this.subscribers.add(listener);
    return () => this.subscribers.delete(listener);
  }
  simulate(
    scenario: ScenarioDocument,
    endFrame: number,
    signal?: AbortSignal,
    receiptDetail: CombatReceiptDetail = 'standard',
  ): Promise<ScenarioSimulationRun> {
    return this.enqueue(
      scenario,
      endFrame,
      signal,
      undefined,
      receiptDetail,
    ) as Promise<ScenarioSimulationRun>;
  }
  planSkillChain(
    scenario: ScenarioDocument,
    castIds: readonly string[],
    endFrame: number,
    signal?: AbortSignal,
    mode: 'continuation' | 'compact' = 'continuation',
    extension?: RecursiveSkillChain,
    receiptDetail: CombatReceiptDetail = 'standard',
  ): Promise<SimulationPlan> {
    return this.enqueue(
      scenario,
      endFrame,
      signal,
      {
        castIds,
        mode,
        ...(extension ? { extension } : {}),
      },
      receiptDetail,
    ) as Promise<SimulationPlan>;
  }
  clearCache() {
    this.revision++;
    if (this.pending) {
      this.pending.cleanup();
      this.pending.reject(abort());
      this.pending = undefined;
    }
  }
  dispose() {
    this.fail(abort());
  }
  private fail(error: Error) {
    this.disposed = true;
    this.worker.terminate();
    for (const task of [this.active, this.pending]) {
      task?.cleanup();
      task?.reject(error);
    }
    this.active = this.pending = undefined;
    this.subscribers.clear();
  }
  private enqueue(
    scenario: ScenarioDocument,
    endFrame: number,
    signal?: AbortSignal,
    plan?: SimulationWorkerRequest['plan'],
    receiptDetail: CombatReceiptDetail = 'standard',
  ) {
    if (this.disposed || signal?.aborted) return Promise.reject(abort());
    return new Promise<ScenarioSimulationRun | SimulationPlan>((resolve, reject) => {
      this.pending?.cleanup();
      this.pending?.reject(abort());
      const task: Pending = {
        request: {
          id: ++this.sequence,
          revision: this.revision,
          scenario,
          endFrame,
          receiptDetail,
          ...(plan ? { plan } : {}),
        },
        resolve,
        reject,
        cleanup: () => signal?.removeEventListener('abort', cancel),
      };
      const cancel = () => {
        if (this.pending === task) this.pending = undefined;
        task.cleanup();
        reject(abort());
      };
      signal?.addEventListener('abort', cancel, { once: true });
      this.pending = task;
      this.pump();
    });
  }
  private pump() {
    if (this.active || !this.pending || this.disposed) return;
    const task = this.pending;
    this.pending = undefined;
    this.active = task;
    try {
      // 场景和定义是纯数据；发送前去掉 Vue 代理，定义集合未变化时由 Worker 复用。
      const selectionKey = scenarioSimulationGameDataSelectionKey(task.request.scenario);
      const gameDataKey = `${this.revision}\u001e${selectionKey}`;
      const gameData =
        this.sentGameDataKey === gameDataKey
          ? undefined
          : this.captureGameData(task.request.scenario);
      const request = {
        ...task.request,
        ...(gameData === undefined ? {} : { gameData }),
      };
      this.worker.postMessage(transferableData(request));
      this.sentGameDataKey = gameDataKey;
    } catch (error) {
      this.active = undefined;
      task.cleanup();
      task.reject(error instanceof Error ? error : new Error(String(error)));
      this.pump();
    }
  }
}
