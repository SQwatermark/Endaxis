/**
 * 监听动作已经安装的响应序列，顺序与定义中的 responses 一致。
 * 注销时清空；注册失败时也清空已安装部分。每项通过订阅引用关联事件目录，
 * 一项响应可能同时监听多个实体或原生事件与手工标记，必须保留全部订阅。
 */
import type { ActionSequenceState } from '../actions/actionSequenceState';
import type { AbilityEventSubscriptionReference } from '../events/abilityEventState';

export interface CombatEventListenerState {
  readonly responses: {
    readonly sequence: ActionSequenceState;
    readonly subscriptions: readonly AbilityEventSubscriptionReference[];
  }[];
}
