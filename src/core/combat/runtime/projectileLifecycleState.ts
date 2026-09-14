/**
 * 投射物组件的可变数据：寿命、回收阶段、来源和 reset 订阅编号。
 * 不包含技能宿主、时钟查询函数或结束回调；这些逻辑仅在当前步进中按实例编号解析。
 */
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type { ProjectileCallbackState } from './projectileCallbackState';

export interface ProjectileLifetimeState {
  readonly callback: ProjectileCallbackState | null;
  readonly instanceId: number;
  readonly source?: RuntimeTargetRef;
  phase: 'active' | 'finished' | 'marked' | 'reset';
  remainingSeconds: number;
  remainingReachTicks: number | null;
  readonly recycleDelaySeconds: number;
  /** 每次注册独立编号；值是 reset 处理程序编号。 */
  readonly resetListeners: Map<number, number>;
}

export interface ProjectileLifecycleState {
  readonly instances: Map<number, ProjectileLifetimeState>;
  /** Battle 阶段开始时准入的实例；null 表示不在该阶段中。 */
  admittedAbilities: number[] | null;
  nextResetRegistrationId: number;
}

export function createProjectileLifecycleState(): ProjectileLifecycleState {
  return { instances: new Map(), admittedAbilities: null, nextResetRegistrationId: 0 };
}
