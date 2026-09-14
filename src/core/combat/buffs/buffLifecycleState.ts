/**
 * Buff 实例的寿命与生命周期数据。修正器、叠层组和动作实例还需由完整战斗数据一起保存。
 * finishing 等同步标记保留原有重入语义，但不能据此允许在动作执行中保存切面。
 */
import type { BuffFinishReason } from './combatBuffs';

export interface BuffLifecycleState {
  affixSkillCastId: number;
  passedTime: number;
  remainingDuration: number | null;
  timedGrowthPeriod: number | null;
  timedGrowthRemaining: number;
  started: boolean;
  enabled: boolean;
  finished: boolean;
  finishing: boolean;
  timePaused: boolean;
  finishable: boolean;
  appliedTags: boolean;
  appliedExtendTags: boolean;
  finishReason: BuffFinishReason | null;
  released: boolean;
  recycled: boolean;
  enhanceCount: number;
}

export function createBuffLifecycleState(): BuffLifecycleState {
  return {
    affixSkillCastId: 0,
    passedTime: 0,
    remainingDuration: null,
    timedGrowthPeriod: null,
    timedGrowthRemaining: 0,
    started: false,
    enabled: false,
    finished: false,
    finishing: false,
    timePaused: false,
    finishable: true,
    appliedTags: false,
    appliedExtendTags: false,
    finishReason: null,
    released: false,
    recycled: false,
    enhanceCount: 1,
  };
}
