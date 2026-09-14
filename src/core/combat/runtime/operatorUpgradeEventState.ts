/**
 * 干员养成事件监听的可保存数据。
 *
 * 每次事件响应都在同一同步分发中创建并结束局部黑板和动作序列；稳定帧边界只需保存各编译程序
 * 的订阅身份。数组顺序与编译程序一致，key 用于恢复时拒绝错接。
 */
import type { AbilityEventSubscriptionReference } from '../events/abilityEventState';

export interface OperatorUpgradeEventProgramState {
  readonly key: string;
  readonly subscriptions: readonly AbilityEventSubscriptionReference[];
}

export interface OperatorUpgradeEventState {
  readonly programs: OperatorUpgradeEventProgramState[];
}

export function createOperatorUpgradeEventState(): OperatorUpgradeEventState {
  return { programs: [] };
}
