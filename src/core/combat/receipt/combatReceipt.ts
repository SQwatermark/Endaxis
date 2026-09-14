/**
 * 战斗核心与曲线、诊断、日志等投影之间的事实协议。
 * 运行时只能追加已发生事实；本地化文本和面向 UI 的聚合结果不得写入回执。
 */
import { CombatReceiptHistory, type CombatReceiptView } from './combatReceiptHistory';
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
export class CombatReceiptCollector implements CombatReceiptSink {
  readonly history: CombatReceiptHistory;
  constructor(saved?: CombatReceiptView) {
    this.history = saved?.fork() ?? new CombatReceiptHistory();
  }

  get entries(): readonly CombatReceiptEntry[] {
    return this.history.snapshot().toArray();
  }

  record(entry: Omit<CombatReceiptEntry, 'sequence'>): void {
    this.history.append(entry);
  }
}
