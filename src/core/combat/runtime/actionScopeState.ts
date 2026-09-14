/**
 * 一个技能或 Buff 动作宿主的作用域数据。黑板缓存以黑板数据节点为键，整图复制保留键的身份。
 * 缓存随宿主 Reset 清空；不能把它单独复制后继续引用旧黑板图。
 */
import type { ActionBlackboardState } from './actionBlackboardState';

export interface ActionScopeState {
  readonly executedOnce: Set<string>;
  readonly blackboards: Map<ActionBlackboardState, Map<string, ActionBlackboardState>>;
}

export function createActionScopeState(): ActionScopeState {
  return { executedOnce: new Set(), blackboards: new Map() };
}
