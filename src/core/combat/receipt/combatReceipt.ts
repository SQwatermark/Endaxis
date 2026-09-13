/**
 * 战斗核心与曲线、诊断、日志等投影之间的事实协议。
 * 运行时只能追加已发生事实；本地化文本和面向 UI 的聚合结果不得写入回执。
 */
import type { RuntimeCheckpointParticipant } from '../runtime/runtimeCheckpoint';

export type CombatReceiptValue = boolean | number | string | null;

/** 一条带帧、事实类型和结构化数据的运行时回执。 */
export interface CombatReceiptEntry {
  readonly sequence: number;
  readonly frame: number;
  readonly time: number;
  readonly event: string;
  readonly sourceId?: string;
  readonly targetId?: string;
  readonly data?: Readonly<Record<string, CombatReceiptValue>>;
}

/** 运行时追加事实的最小端口，投影层只读取其最终结果。 */
export interface CombatReceiptSink {
  record(entry: Omit<CombatReceiptEntry, 'sequence'>): void;
}

/** 稳定且仅追加的事实记录；本地化与展示均属于投影。 */
export class CombatReceiptCollector
  implements CombatReceiptSink, RuntimeCheckpointParticipant<CombatReceiptCheckpointState>
{
  readonly #entries: CombatReceiptEntry[] = [];

  get entries(): readonly CombatReceiptEntry[] {
    return this.#entries;
  }

  record(entry: Omit<CombatReceiptEntry, 'sequence'>): void {
    this.#entries.push({ sequence: this.#entries.length, ...entry });
  }

  /** 回执只追加，因此切面保存长度和边界对象即可，不复制此前的完整日志。 */
  captureCheckpointState(): CombatReceiptCheckpointState {
    return Object.freeze({
      length: this.#entries.length,
      boundary: this.#entries[this.#entries.length - 1],
    });
  }

  validateCheckpointState(state: CombatReceiptCheckpointState): void {
    if (
      !Number.isInteger(state.length) ||
      state.length < 0 ||
      state.length > this.#entries.length
    ) {
      throw new Error('receipt checkpoint is not an ancestor of the current branch');
    }
    if (state.length > 0 && this.#entries[state.length - 1] !== state.boundary) {
      throw new Error('receipt checkpoint belongs to a discarded branch');
    }
  }

  restoreCheckpointState(state: CombatReceiptCheckpointState): void {
    this.#entries.length = state.length;
  }
}

interface CombatReceiptCheckpointState {
  readonly length: number;
  readonly boundary: CombatReceiptEntry | undefined;
}
