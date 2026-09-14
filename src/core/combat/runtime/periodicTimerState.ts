/**
 * 原生单周期计时器的数据。无效状态仍保留 passed，行为与原计时器一致。
 * 冷却或失衡宿主负责持有此状态并决定何时消费完成事件。
 */
export interface PeriodicTimerState {
  period: number;
  remaining: number;
  passed: number;
}

export function createPeriodicTimerState(): PeriodicTimerState {
  return { period: -1, remaining: -1, passed: 0 };
}
