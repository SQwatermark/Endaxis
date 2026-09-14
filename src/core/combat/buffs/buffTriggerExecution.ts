/**
 * Buff 周期触发的无状态算法。按原有余量和 epsilon 补齐本帧到期次数。
 * 每次触发可同步关闭宿主，因此必须在每一项之前重新检查，不能先算好次数后盲目全执行。
 */
import type { BuffTriggerState } from './buffTriggerState';

const BUFF_LIFETIME_EPSILON = 0.00001;

export function advanceBuffTriggers(
  state: BuffTriggerState,
  deltaTime: number,
  host: { isEnabled(): boolean; trigger(): void },
): void {
  if (state.remainingCount === 0 || state.intervalSeconds === null) return;
  state.remainingSeconds -= deltaTime;
  if (state.remainingSeconds > BUFF_LIFETIME_EPSILON) return;
  const triggerCount = Math.max(0, Math.trunc(-state.remainingSeconds / state.intervalSeconds)) + 1;
  state.remainingSeconds += triggerCount * state.intervalSeconds;
  for (let index = 0; index < triggerCount; index++) {
    if (state.remainingCount === 0 || !host.isEnabled()) break;
    state.remainingCount -= 1;
    host.trigger();
  }
}
