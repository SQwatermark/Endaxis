/** 普通倒地是否生效及其剩余计时；倒地标签仍由同一实体的 Buff 容器保存。 */
import { createPeriodicTimerState, type PeriodicTimerState } from './periodicTimerState';

export interface OrdinaryKnockDownState {
  active: boolean;
  readonly timer: PeriodicTimerState;
}

export function createOrdinaryKnockDownState(): OrdinaryKnockDownState {
  return { active: false, timer: createPeriodicTimerState() };
}
