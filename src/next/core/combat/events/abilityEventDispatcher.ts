/**
 * 技能与 Buff 等 Ability 监听者共享的同步事件边界。
 * 注册动作必须使用已确认的整数优先级；同优先级仲裁未知时应拒绝配置，不能依赖插入顺序。
 */
/** 一次 Ability 事件的稳定身份和只读负载。 */
export interface AbilityEventContext<Event, Payload = unknown> {
  readonly event: Event;
  readonly payload: Payload;
}

/** 技能或 Buff 等有身份对象通过此接口接收 Ability 事件。 */
export interface AbilityEventListener<Event, Payload = unknown> {
  onAbilityEvent(context: AbilityEventContext<Event, Payload>): void;
}

/** 不持有监听者身份的轻量 Ability 事件处理函数。 */
export type AbilityEventHandler<Event, Payload = unknown> = (
  context: AbilityEventContext<Event, Payload>,
) => void;

interface RegisteredAction<Event, Payload> {
  readonly priority: number;
  readonly execute: AbilityEventHandler<Event, Payload>;
}

/**
 * 复现已确认的原生分发阶段。数据行为按优先级降序执行；
 * 在原生同优先级排序规则确认前，拒绝接受同优先级行为。
 */
export class AbilityEventDispatcher<Event, Payload = unknown> {
  readonly #callbacks = new Map<Event, AbilityEventHandler<Event, Payload>[]>();
  readonly #actions = new Map<Event, RegisteredAction<Event, Payload>[]>();

  registerCallback(event: Event, callback: AbilityEventHandler<Event, Payload>): void {
    const callbacks = this.#callbacks.get(event);
    if (callbacks === undefined) {
      this.#callbacks.set(event, [callback]);
      return;
    }
    callbacks.push(callback);
  }

  registerAction(
    event: Event,
    priority: number,
    execute: AbilityEventHandler<Event, Payload>,
  ): void {
    if (!Number.isInteger(priority)) {
      throw new TypeError('ability event action priority must be an integer');
    }
    const actions = this.#actions.get(event);
    if (actions === undefined) {
      this.#actions.set(event, [{ priority, execute }]);
      return;
    }
    if (actions.some(action => action.priority === priority)) {
      throw new Error(
        `ability event '${String(event)}' has multiple actions at unresolved priority ${priority}`,
      );
    }
    actions.push({ priority, execute });
    actions.sort((left, right) => right.priority - left.priority);
  }

  dispatch(
    context: AbilityEventContext<Event, Payload>,
    skillListeners: readonly AbilityEventListener<Event, Payload>[],
    comboListener?: AbilityEventListener<Event, Payload>,
  ): void {
    for (const callback of this.#callbacks.get(context.event)?.slice() ?? []) callback(context);
    for (const action of this.#actions.get(context.event) ?? []) action.execute(context);
    for (const listener of skillListeners.slice()) listener.onAbilityEvent(context);
    comboListener?.onAbilityEvent(context);
  }
}
