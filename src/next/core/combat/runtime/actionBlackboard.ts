export type ActionBlackboardValue = string | number | null;

/** Mutable per-runtime-instance values used by data-driven combat actions. */
export class ActionBlackboard {
  readonly #values = new Map<string, ActionBlackboardValue>();

  constructor(values?: Readonly<Record<string, ActionBlackboardValue>>) {
    this.assign(values);
  }

  assign(values?: Readonly<Record<string, ActionBlackboardValue>>): void {
    if (values === undefined) return;
    for (const [key, value] of Object.entries(values)) this.#values.set(key, value);
  }

  getString(key: string): string | undefined {
    const value = this.#values.get(key);
    return typeof value === 'string' ? value : undefined;
  }

  getNumber(key: string): number | undefined {
    const value = this.#values.get(key);
    return typeof value === 'number' ? value : undefined;
  }

  assignDynamic(key: string, value: number): boolean {
    this.#values.set(key, value);
    return true;
  }

  snapshot(): Readonly<Record<string, ActionBlackboardValue>> {
    return Object.fromEntries(this.#values);
  }

  restore(values: Readonly<Record<string, ActionBlackboardValue>>): void {
    this.#values.clear();
    this.assign(values);
  }
}
