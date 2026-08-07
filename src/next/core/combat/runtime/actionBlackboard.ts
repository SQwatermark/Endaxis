/**
 * 同一行为实例内多个数据驱动步骤共享值的受控容器。
 * 键和值只在实例生命周期内有效，不能作为跨技能全局状态或持久化身份使用。
 */
export type ActionBlackboardValue = string | number | null;

/** 数据驱动战斗行为使用的、按运行时实例隔离的可变值。 */
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
