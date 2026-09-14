/**
 * 战斗核心与曲线、诊断、日志等投影之间的事实协议。
 * 运行时只能追加已发生事实；本地化文本和面向 UI 的聚合结果不得写入回执。
 */
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
  constructor(readonly runtimeState: CombatReceiptState = { entries: [] }) {}

  get entries(): readonly CombatReceiptEntry[] {
    return this.runtimeState.entries;
  }

  record(entry: Omit<CombatReceiptEntry, 'sequence'>): void {
    appendCombatReceipt(this.runtimeState, entry);
  }
}

/** 当前分支已发生的事实；保存时与其余战斗状态一起复制，编号由本分支长度决定。 */
export interface CombatReceiptState {
  readonly entries: CombatReceiptEntry[];
}

/** 复制载荷，避免调用方之后修改原对象而改变已发生的事实。 */
export function appendCombatReceipt(
  state: CombatReceiptState,
  entry: Omit<CombatReceiptEntry, 'sequence'>,
): void {
  state.entries.push({
    sequence: state.entries.length,
    ...entry,
    ...(entry.data === undefined ? {} : { data: { ...entry.data } }),
  });
}
