/** 时间膨胀的活动实例、编号和累计时间。曲线函数由运行时程序按编号提供，不放进状态。 */
import type { TimeDilationInstanceSnapshot } from './timeDilationRuntime';

export interface MutableTimeDilationInstance extends TimeDilationInstanceSnapshot {
  elapsedSeconds: number;
  currentScale: number;
  active: boolean;
}

export interface GlobalTimeDilationInstance extends MutableTimeDilationInstance {
  readonly curveId?: number;
  readonly constantScale?: number;
  readonly influenceSkillCooldownSeconds?: number;
  readonly ignoredOperatorIds: ReadonlySet<string>;
}

export interface EntityTimeDilationInstance extends MutableTimeDilationInstance {
  readonly entityId: string;
  readonly curveId: number;
  readonly lifetimeUsesGlobalScale: boolean;
}

export interface TimeDilationState {
  readonly globalInstances: GlobalTimeDilationInstance[];
  readonly entityInstances: EntityTimeDilationInstance[];
  readonly ignoreGlobalTimeScaleEntityIds: Set<string>;
  nextInstanceId: number;
  globalScaledTime: number;
}

export function createTimeDilationState(): TimeDilationState {
  return {
    globalInstances: [],
    entityInstances: [],
    ignoreGlobalTimeScaleEntityIds: new Set(),
    nextInstanceId: 0,
    globalScaledTime: 0,
  };
}
