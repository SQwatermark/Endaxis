export type CombatReceiptValue = boolean | number | string | null;

export interface CombatReceiptEntry {
  readonly sequence: number;
  readonly frame: number;
  readonly time: number;
  readonly event: string;
  readonly sourceId?: string;
  readonly targetId?: string;
  readonly data?: Readonly<Record<string, CombatReceiptValue>>;
}

export interface CombatReceiptSink {
  record(entry: Omit<CombatReceiptEntry, 'sequence'>): void;
}

/** 稳定且仅追加的事实记录；本地化与展示均属于投影。 */
export class CombatReceiptCollector implements CombatReceiptSink {
  readonly #entries: CombatReceiptEntry[] = [];

  get entries(): readonly CombatReceiptEntry[] {
    return this.#entries;
  }

  record(entry: Omit<CombatReceiptEntry, 'sequence'>): void {
    this.#entries.push({ sequence: this.#entries.length, ...entry });
  }
}
