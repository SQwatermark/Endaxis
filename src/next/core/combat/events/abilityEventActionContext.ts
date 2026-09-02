import {
  ABILITY_EVENT_ACTION_CONTEXT_BINDINGS,
  ACTION_CONTEXT_BOUND_ABILITY_EVENTS,
  type AbilityEvent,
  type ActionContextBoundAbilityEvent,
} from '../../../../../packages/game-data-contract/src/abilityEvents';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';

export { ACTION_CONTEXT_BOUND_ABILITY_EVENTS };

/** AbilityEvent 回调进入动作序列时恢复出的公共原生动作目标。 */
export interface AbilityEventRuntimeActionContext {
  readonly inputTarget: RuntimeTargetRef;
  readonly triggerTarget: RuntimeTargetRef | null;
}

export function hasAbilityEventActionContextBinding(
  event: AbilityEvent,
): event is ActionContextBoundAbilityEvent {
  return (ACTION_CONTEXT_BOUND_ABILITY_EVENTS as readonly AbilityEvent[]).includes(event);
}

/**
 * 把公共事件负载恢复成原生动作环境的 InputTarget 与发布者（Trigger）。
 * 输出 Buff/附着事件发布在施加方上，其余已审计事件发布在承受者上。
 */
export function resolveAbilityEventActionContextBinding(
  event: ActionContextBoundAbilityEvent,
  payload: { readonly sourceId: string; readonly targetId: string },
): { readonly inputTargetId: string; readonly triggerTargetId: string | null } {
  const binding = ABILITY_EVENT_ACTION_CONTEXT_BINDINGS[event];
  return {
    inputTargetId: binding.inputTarget === 'eventSource' ? payload.sourceId : payload.targetId,
    triggerTargetId:
      binding.triggerTarget === null
        ? null
        : binding.triggerTarget === 'eventSource'
          ? payload.sourceId
          : payload.targetId,
  };
}
