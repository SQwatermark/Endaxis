/** 一项共享冷却的当前计时和本次施放预占事实。固定基础周期另由程序提供。 */
import type { PeriodicTimerState } from './periodicTimerState';
/** 投影与合法性诊断可读取的冷却事实快照。 */
export interface SkillCooldownSnapshot {
  readonly configured: boolean;
  readonly ready: boolean;
  readonly remainingFrames: number;
  readonly progress: number;
}

export interface SkillCooldownState {
  readonly timer: PeriodicTimerState | undefined;
  reservedByCurrentCast: boolean;
}

/** 冷却固定配置；动态倍率只在实际预占时读取，不存储回调。 */
export interface SkillCooldownProgram {
  readonly periodFrames: number;
  readonly commitFrame?: number;
}
