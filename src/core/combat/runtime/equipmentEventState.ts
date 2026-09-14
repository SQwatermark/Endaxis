/**
 * 一名干员的装备 Ability 事件状态。
 *
 * 每项贡献按编译数组下标保存。贡献内的黑板由初始化、启用和所有事件响应共享；宿主保存启用、
 * 订阅和子 Buff 关系；响应数组与编译处理器顺序一致。处理函数和临时执行器不进入切面。
 */
import type { ActionSequenceState } from '../actions/actionSequenceState';
import { createAbilityEventHostState, type AbilityEventHostState } from './abilityEventHostState';
import type { ActionBlackboardState } from './actionBlackboardState';

export interface EquipmentEventHandlerState {
  /** 用于拒绝把同一数组位置误接到另一条处理器。 */
  readonly key: string;
  readonly sequence: ActionSequenceState;
}

export interface EquipmentContributionEventState {
  readonly blackboard: ActionBlackboardState;
  readonly host: AbilityEventHostState;
  readonly responses: EquipmentEventHandlerState[];
}

export interface EquipmentEventState {
  readonly contributions: Map<number, EquipmentContributionEventState>;
}

export function createEquipmentEventState(): EquipmentEventState {
  return { contributions: new Map() };
}

export function createEquipmentContributionEventState(
  blackboard: ActionBlackboardState,
): EquipmentContributionEventState {
  return {
    blackboard,
    host: createAbilityEventHostState(),
    responses: [],
  };
}
