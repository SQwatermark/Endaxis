/**
 * Buff 周期触发器的全部计时数据。负触发次数沿用原生无限触发表示，不归一化成另一种规则。
 * 本状态只覆盖周期触发；Buff 的属性、叠层、生命周期和子对象仍由各自的完整状态负责。
 */
export interface BuffTriggerState {
  intervalSeconds: number | null;
  remainingSeconds: number;
  remainingCount: number;
}

export function createBuffTriggerState(): BuffTriggerState {
  return { intervalSeconds: null, remainingSeconds: 0, remainingCount: 0 };
}
