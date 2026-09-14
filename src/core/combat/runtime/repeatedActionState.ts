/**
 * 重复动作的计时与次数。保存这些数值才能在恢复后从原来的触发位置继续。
 * 不包含动作体、黑板或宿主引用；这些由程序及战斗数据根分别持有。
 */
export interface RepeatedActionState {
  skipInitialTick: boolean;
  timerSeconds: number;
  scanCount: number;
  targetTriggerCount: number;
  lastTargetTriggerSeconds: number;
}

export function createRepeatedActionState(): RepeatedActionState {
  return {
    skipInitialTick: false,
    timerSeconds: 0,
    scanCount: 0,
    targetTriggerCount: 0,
    lastTargetTriggerSeconds: 0,
  };
}
