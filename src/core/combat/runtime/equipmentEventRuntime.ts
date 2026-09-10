/**
 * 已编译配装事件处理器的战斗期运行实例。
 *
 * 每个处理器只注册一次；同一能力的初始化和事件响应共享黑板，序列保持各自状态。具体步骤
 * 仍交给装配层提供的操作执行器，本模块不把武器或装备伪装成技能来源。
 */
import type {
  CompiledEquipmentContribution,
  CompiledEquipmentEventHandler,
  EquipmentContributionSource,
} from '../../compiler/compileEquipment';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type { EquipmentAbilityEvent } from '../../game-data/equipmentDefinition';
import { ActionBlackboard } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import {
  CombatSemanticEventRuntime,
  type CombatSemanticEventContext,
} from './combatSemanticEventRuntime';
import type { AbilityResponseEvent } from '../events/combatAbilityEvent';
import type { AbilityEventRuntimeActionContext } from '../events/abilityEventActionContext';
import {
  withAbilityEventResponseContext,
  withCombatEventResponseContext,
} from './abilityEventResponseContext';
import type { CombatAbilityEvent } from '../events/combatAbilityEvent';
import type { BuffApplicationHandle } from '../buffs/combatBuffs';
import {
  AbilityEventHostLifecycle,
  runAbilityHostCleanup,
  failAfterAbilityHostCleanup,
} from './abilityEventHostLifecycle';

export type RegisterEquipmentAbilityEventAction = (
  operatorId: string,
  event: EquipmentAbilityEvent,
  priority: number,
  handle: (
    published: CombatAbilityEvent<EquipmentAbilityEvent>,
    actionContext?: AbilityEventRuntimeActionContext,
  ) => void,
) => AbilityEventRegistration;

/** 配装操作执行器用于归因和选择实体状态的稳定上下文。 */
export interface EquipmentEventExecutionContext {
  readonly operatorId: string;
  readonly source: EquipmentContributionSource;
  readonly handlerKey: string;
  readonly event: CombatSemanticEventContext['event'] | AbilityResponseEvent;
}

export type CreateEquipmentEventOperationExecutor = (
  context: EquipmentEventExecutionContext,
) => CombatOperationExecutor;

/** 一名干员的全部配装事件监听生命周期；模拟结束后可统一释放。 */
export class EquipmentEventRuntime {
  readonly #operatorId: string;
  readonly #blackboards = new Map<number, ActionBlackboard>();
  #disposed = false;
  // 固定配装的被动 Ability 存活到本运行实例释放；不能把子 Buff 挂到触发它的主动技能。
  readonly #hosts = new Map<number, AbilityEventHostLifecycle>();

  constructor(
    semanticEvents: CombatSemanticEventRuntime,
    operatorId: string,
    contributions: readonly CompiledEquipmentContribution[],
    createExecutor: CreateEquipmentEventOperationExecutor,
    registerAbilityEventAction?: RegisterEquipmentAbilityEventAction,
  ) {
    this.#operatorId = operatorId;
    try {
      for (const [contributionIndex, contribution] of contributions.entries()) {
        if (
          contribution.eventHandlers.length === 0 &&
          contribution.initializationSequence === undefined &&
          contribution.enableSequence === undefined
        )
          continue;
        const host = new AbilityEventHostLifecycle();
        this.#hosts.set(contributionIndex, host);
        this.#blackboards.set(contributionIndex, new ActionBlackboard(contribution.blackboard));
        for (const handler of contribution.eventHandlers) {
          const executeResponse = this.#createResponse(contributionIndex, handler);
          if (handler.abilityEvent !== undefined) {
            if (registerAbilityEventAction === undefined) {
              throw new Error(
                `equipment handler '${handler.key}' requires an AbilityEvent registration port`,
              );
            }
            host.register(
              registerAbilityEventAction(
                operatorId,
                handler.abilityEvent,
                handler.priority ?? 0,
                (published, actionContext) => {
                  if (!host.acceptsEvents) return;
                  const event = published;
                  executeResponse(
                    createExecutor({
                      operatorId,
                      source: contribution.source,
                      handlerKey: handler.key,
                      event,
                    }),
                    event,
                    published,
                    actionContext,
                  );
                },
              ),
            );
            continue;
          }
          host.register(
            semanticEvents.register({
              ownerOperatorId: operatorId,
              trigger: handler.event,
              phase: 'dataAction',
              priority: handler.priority ?? 0,
              createOperations: context =>
                createExecutor({
                  operatorId,
                  source: contribution.source,
                  handlerKey: handler.key,
                  event: context.event,
                }),
              handle: (context, getOperations) => {
                if (!host.acceptsEvents) return;
                executeResponse(getOperations(), context.event, undefined, context.actionContext);
              },
            }),
          );
        }
      }
    } catch (error) {
      failAfterAbilityHostCleanup(error, [() => this.dispose()]);
    }
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    try {
      runAbilityHostCleanup([...this.#hosts.values()].map(host => () => host.dispose()));
    } finally {
      this.#hosts.clear();
      this.#blackboards.clear();
    }
  }

  /** 原生 Ability.Enable 成功后开放本能力，不提前开放整名干员或整队。 */
  enable(contributionIndex: number): void {
    this.blackboardFor(contributionIndex);
    this.#hosts.get(contributionIndex)!.enable();
  }

  assertAllEnabled(): void {
    for (const index of this.#blackboards.keys()) {
      if (!this.#hosts.get(index)!.acceptsEvents)
        throw new Error(`equipment Ability '${index}' has no completed initialization program`);
    }
  }

  blackboardFor(contributionIndex: number): ActionBlackboard {
    const blackboard = this.#blackboards.get(contributionIndex);
    if (blackboard === undefined)
      throw new Error(`equipment Ability '${contributionIndex}' is not active`);
    return blackboard;
  }

  /** 初始化和事件动作共享被动 Ability 的所有权，不随单次初始化序列结束。 */
  addChildBuff(contributionIndex: number, child: BuffApplicationHandle): void {
    const host = this.#hosts.get(contributionIndex);
    if (host === undefined)
      throw new Error(`equipment Ability '${contributionIndex}' is not active`);
    host.addChildBuff(child);
  }

  onDisable(contributionIndex: number, cleanup: () => void): void {
    this.blackboardFor(contributionIndex);
    this.#hosts.get(contributionIndex)!.onDisable(cleanup);
  }

  #createResponse(contributionIndex: number, handler: CompiledEquipmentEventHandler) {
    let activeOperations: CombatOperationExecutor | undefined;
    const operations = () => {
      if (activeOperations === undefined) throw new Error('equipment response is not executing');
      return activeOperations;
    };
    const operationContext = {
      blackboard: this.blackboardFor(contributionIndex),
      canExecuteAction: () => this.#hosts.get(contributionIndex)?.canExecuteAction === true,
      actionOwnerId: this.#operatorId,
      actionSourceId: this.#operatorId,
      addAbilityChildBuff: (child: BuffApplicationHandle) => {
        this.addChildBuff(contributionIndex, child);
      },
    } satisfies CombatOperationContext;
    // 原生队列保存 SequenceAction 实例；不能在同步重入时重新创建 Pending 状态。
    const sequence = new CombatActionSequenceRuntime(
      {
        prepare: (step, context) => operations().prepare?.(step, context),
        execute: (step, context) => operations().execute(step, context),
        end: (step, context) => operations().end?.(step, context),
        evaluate: (condition, context) => operations().evaluate(condition, context),
      },
      operationContext,
    ).createSequence(handler.sequence);
    return (
      executor: CombatOperationExecutor,
      event: EquipmentEventExecutionContext['event'],
      published?: CombatAbilityEvent<EquipmentAbilityEvent>,
      actionContext?: AbilityEventRuntimeActionContext,
    ): void => {
      if (!this.#hosts.get(contributionIndex)?.acceptsEvents) return;
      const previousOperations = activeOperations;
      activeOperations = executor;
      const execute = () => {
        if (
          handler.condition !== undefined &&
          !executor.evaluate(handler.condition, operationContext)
        )
          return;
        sequence.executeInstant({});
      };
      try {
        if (published !== undefined)
          withAbilityEventResponseContext(operationContext, published, actionContext, execute);
        else if ('event' in event)
          withAbilityEventResponseContext(operationContext, event, actionContext, execute);
        else withCombatEventResponseContext(operationContext, { event }, execute);
      } finally {
        activeOperations = previousOperations;
      }
    };
  }
}
