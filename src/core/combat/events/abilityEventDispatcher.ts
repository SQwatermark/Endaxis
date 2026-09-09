/**
 * 技能与 Buff 等 Ability 监听者共享的同步事件边界。
 * 注册动作使用整数优先级；同优先级按原生双缓冲优先队列保持注册顺序。
 */
/** 一次 Ability 事件的稳定身份和只读负载。 */
export interface AbilityEventContext<Event, Payload = unknown> {
  readonly event: Event;
  readonly payload: Payload;
}

/** 先构造完整映射再取订阅子集，泛型订阅也能保留名称与载荷关联。 */
export type AbilityEventFromMap<
  Event extends PropertyKey,
  Payloads extends Record<Event, unknown>,
> = {
  [Name in keyof Payloads]: AbilityEventContext<Name, Payloads[Name]>;
}[Event];

/** 技能或 Buff 等有身份对象通过此接口接收 Ability 事件。 */
export interface AbilityEventListener<
  Event extends PropertyKey,
  Payloads extends Record<Event, unknown> = Record<Event, unknown>,
> {
  onAbilityEvent(context: AbilityEventFromMap<Event, Payloads>): void;
}

/** 不持有监听者身份的轻量 Ability 事件处理函数。 */
export type AbilityEventHandler<
  Event extends PropertyKey,
  Payloads extends Record<Event, unknown> = Record<Event, unknown>,
> = (context: AbilityEventFromMap<Event, Payloads>) => void;

/**
 * 一组已注册事件行为的生命周期句柄。
 * 原生 EventListenerAction 会在结束或中断时释放对应句柄；调用方也必须在所属作用域结束时释放。
 */
export interface AbilityEventRegistration {
  dispose(): void;
}

interface RegisteredAction<Event extends PropertyKey, Payloads extends Record<Event, unknown>> {
  readonly priority: number;
  readonly registrationOrder: number;
  readonly execute: AbilityEventHandler<Event, Payloads>;
}

/**
 * 复现已确认的原生分发阶段。数据行为按优先级降序执行，同优先级先注册者先执行。
 */
export class AbilityEventDispatcher<
  Event extends PropertyKey,
  Payloads extends Record<Event, unknown> = Record<Event, unknown>,
> {
  readonly #callbacks = new Map<Event, AbilityEventHandler<Event, Payloads>[]>();
  readonly #actions = new Map<Event, RegisteredAction<Event, Payloads>[]>();
  readonly #skillListeners = new Map<Event, AbilityEventHandler<Event, Payloads>[]>();
  readonly #comboListeners = new Map<Event, AbilityEventHandler<Event, Payloads>[]>();
  #nextActionRegistrationOrder = 0;

  registerCallback<Name extends Event>(
    event: Name,
    callback: AbilityEventHandler<Name, Payloads>,
  ): AbilityEventRegistration {
    // 注册表按事件键隔离；这里只擦除键关联，不包装事件或替换回调身份。
    const registered = callback as AbilityEventHandler<Event, Payloads>;
    const callbacks = this.#callbacks.get(event);
    if (callbacks === undefined) {
      this.#callbacks.set(event, [registered]);
    } else {
      callbacks.push(registered);
    }
    return this.#createRegistration(this.#callbacks, event, registered);
  }

  registerAction<Name extends Event>(
    event: Name,
    priority: number,
    execute: AbilityEventHandler<Name, Payloads>,
  ): AbilityEventRegistration {
    if (!Number.isInteger(priority)) {
      throw new TypeError('ability event action priority must be an integer');
    }
    const actions = this.#actions.get(event);
    const action = {
      priority,
      registrationOrder: this.#nextActionRegistrationOrder++,
      execute: execute as AbilityEventHandler<Event, Payloads>,
    };
    if (actions === undefined) {
      this.#actions.set(event, [action]);
      return this.#createRegistration(this.#actions, event, action);
    }
    actions.push(action);
    actions.sort(
      (left, right) =>
        right.priority - left.priority || left.registrationOrder - right.registrationOrder,
    );
    return this.#createRegistration(this.#actions, event, action);
  }

  /** 持续监听器也进入同一次分发的原生阶段，不另开一轮事件循环。 */
  registerListener<Name extends Event>(
    event: Name,
    phase: 'skill' | 'combo',
    callback: AbilityEventHandler<Name, Payloads>,
  ): AbilityEventRegistration {
    const registry = phase === 'skill' ? this.#skillListeners : this.#comboListeners;
    // 与回调注册相同：存储时擦除键关联，分发时始终按同一事件键读取。
    const registered = callback as AbilityEventHandler<Event, Payloads>;
    const entries = registry.get(event);
    if (entries === undefined) registry.set(event, [registered]);
    else entries.push(registered);
    return this.#createRegistration(registry, event, registered);
  }

  dispatch(
    context: AbilityEventFromMap<Event, Payloads>,
    skillListeners: readonly AbilityEventListener<Event, Payloads>[],
    comboListener?: AbilityEventListener<Event, Payloads>,
  ): void {
    for (const callback of this.#callbacks.get(context.event)?.slice() ?? []) callback(context);
    for (const action of this.#actions.get(context.event)?.slice() ?? []) action.execute(context);
    for (const listener of this.#skillListeners.get(context.event)?.slice() ?? [])
      listener(context);
    for (const listener of skillListeners.slice()) listener.onAbilityEvent(context);
    for (const listener of this.#comboListeners.get(context.event)?.slice() ?? [])
      listener(context);
    comboListener?.onAbilityEvent(context);
  }

  #createRegistration<Value>(
    registry: Map<Event, Value[]>,
    event: Event,
    value: Value,
  ): AbilityEventRegistration {
    let disposed = false;
    return {
      dispose: () => {
        if (disposed) return;
        disposed = true;

        const values = registry.get(event);
        if (values === undefined) return;
        const index = values.indexOf(value);
        if (index >= 0) values.splice(index, 1);
        if (values.length === 0) registry.delete(event);
      },
    };
  }
}
