/**
 * 将一组 Ability 事件动作绑定到外层战斗步骤的生命周期。
 * 外层时间线负责在监听区间结束或技能中断时调用 end；本层不推算监听时长，也不解释事件负载。
 */
import { CombatStep, type CombatExecutionContext } from '../actions/combatStep';
import type {
  AbilityEventDispatcher,
  AbilityEventHandler,
  AbilityEventRegistration,
} from './abilityEventDispatcher';

/** 一条事件身份、原生优先级与执行行为的已解析映射。 */
export interface AbilityEventActionMap<Event, Payload = unknown> {
  readonly event: Event;
  readonly priority: number;
  readonly execute: AbilityEventHandler<Event, Payload>;
}

/**
 * 对应原生 EventListenerAction 的运行时作用域。
 * 同一实例不能重复启动；需要并行运行时必须通过 createRuntimeInstance 创建独立状态。
 */
export class AbilityEventListenerStep<Event, Payload = unknown> extends CombatStep {
  readonly #dispatcher: AbilityEventDispatcher<Event, Payload>;
  readonly #actionMaps: readonly AbilityEventActionMap<Event, Payload>[];
  #registrations: AbilityEventRegistration[] = [];

  constructor(
    dispatcher: AbilityEventDispatcher<Event, Payload>,
    actionMaps: readonly AbilityEventActionMap<Event, Payload>[],
  ) {
    super();
    this.#dispatcher = dispatcher;
    this.#actionMaps = actionMaps.slice();
  }

  override createRuntimeInstance(): AbilityEventListenerStep<Event, Payload> {
    return new AbilityEventListenerStep(this.#dispatcher, this.#actionMaps);
  }

  execute(_context: CombatExecutionContext): void {
    if (this.#registrations.length > 0) {
      throw new Error('ability event listener step is already active');
    }

    try {
      for (const actionMap of this.#actionMaps) {
        this.#registrations.push(
          this.#dispatcher.registerAction(actionMap.event, actionMap.priority, actionMap.execute),
        );
      }
    } catch (error) {
      this.#disposeRegistrations();
      throw error;
    }
  }

  override end(_context: CombatExecutionContext): void {
    this.#disposeRegistrations();
  }

  #disposeRegistrations(): void {
    for (const registration of this.#registrations) registration.dispose();
    this.#registrations = [];
  }
}
