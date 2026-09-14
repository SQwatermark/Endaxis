/**
 * 动作序列的执行进度。这里只保存数据，步骤实现按数组下标由执行端口提供。
 * steps 收集已接入的具体动作数据；尚未接入的步骤留 null，仍需继续迁移。
 */
import type { ActionStepData } from './actionStepData';

export const COMBAT_STEP_STATE = {
  pending: 'pending',
  started: 'started',
  ticking: 'ticking',
  ended: 'ended',
} as const;

/** 步骤尚未开始、已经进入、正在持续执行或已经结束。 */
export type CombatStepState = (typeof COMBAT_STEP_STATE)[keyof typeof COMBAT_STEP_STATE];

/** 执行结果决定是否继续 Tick，进入时的许可决定是否调用 End。 */
export interface ActionStepState {
  state: CombatStepState;
  executeResult: boolean;
  executionPermitted: boolean;
}

/** 数组顺序与不可变程序中的步骤顺序一致，不持有步骤对象。 */
export interface ActionSequenceState {
  readonly entries: ActionStepState[];
  /** 与 entries 同下标；保存实际步骤数据的引用，不复制一份镜像。 */
  readonly steps: (ActionStepData | null)[];
}

export function createActionSequenceState(stepCount: number): ActionSequenceState {
  return {
    steps: Array.from({ length: stepCount }, () => null),
    entries: Array.from({ length: stepCount }, () => ({
      state: COMBAT_STEP_STATE.pending,
      executeResult: false,
      executionPermitted: false,
    })),
  };
}
