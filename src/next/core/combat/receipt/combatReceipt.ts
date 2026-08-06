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

/** Stable append-only facts; localization and presentation are projections. */
export class CombatReceiptCollector implements CombatReceiptSink {
  readonly #entries: CombatReceiptEntry[] = [];

  get entries(): readonly CombatReceiptEntry[] {
    return this.#entries;
  }

  record(entry: Omit<CombatReceiptEntry, 'sequence'>): void {
    this.#entries.push({ sequence: this.#entries.length, ...entry });
  }
}
