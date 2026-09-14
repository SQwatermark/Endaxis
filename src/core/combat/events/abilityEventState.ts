/**
 * Ability 事件订阅的纯数据。每项只记录事件、阶段、优先级和处理程序编号，不保存函数。
 * 同一次分发中的临时遍历数组属于调用栈；帧结束后只需保留这里的订阅关系与编号。
 */
export type AbilityEventPhase = 'callback' | 'action' | 'skill' | 'combo';

export interface AbilityEventSubscription {
  /** 当前状态内唯一的订阅编号，用于精确注销某一次注册。 */
  readonly id: number;
  /** 处理逻辑的引用，由本次执行的宿主解析；不是函数对象。 */
  readonly handlerId: number;
  /** 仅 action 阶段按优先级降序排列，其余阶段保持注册顺序。 */
  readonly priority: number;
}

export interface AbilityEventState<Event extends PropertyKey> {
  nextRegistrationId: number;
  readonly phases: Record<AbilityEventPhase, Map<Event, AbilityEventSubscription[]>>;
}

/**
 * 精确指向一次订阅。事件中心之间的编号可能相同，因此必须同时保留目录引用。
 * 复制整场数据图时，这里的目录与根目录仍指向同一份复制结果，不保存分发器对象。
 */
export interface AbilityEventSubscriptionReference {
  readonly state: AbilityEventState<PropertyKey>;
  readonly event: PropertyKey;
  readonly phase: AbilityEventPhase;
  readonly id: number;
}

export function createAbilityEventState<Event extends PropertyKey>(): AbilityEventState<Event> {
  return {
    nextRegistrationId: 0,
    phases: { callback: new Map(), action: new Map(), skill: new Map(), combo: new Map() },
  };
}
