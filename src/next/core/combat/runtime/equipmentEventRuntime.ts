/**
 * 已编译配装事件处理器的战斗期运行实例。
 *
 * 每个处理器只注册一次；事件命中后使用独立动作黑板同步判断条件并执行有序步骤。具体步骤
 * 仍交给装配层提供的操作执行器，本模块不把武器或装备伪装成技能来源。
 */
import type {
  CompiledEquipmentContribution,
  CompiledEquipmentEventHandler,
  EquipmentContributionSource,
} from '../../compiler/compileEquipment';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import { ActionBlackboard } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import {
  CombatSemanticEventRuntime,
  type CombatSemanticEventContext,
} from './combatSemanticEventRuntime';

/** 配装操作执行器用于归因和选择实体状态的稳定上下文。 */
export interface EquipmentEventExecutionContext {
  readonly operatorId: string;
  readonly source: EquipmentContributionSource;
  readonly handlerKey: string;
  readonly event: CombatSemanticEventContext['event'];
}

export type CreateEquipmentEventOperationExecutor = (
  context: EquipmentEventExecutionContext,
) => CombatOperationExecutor;

/** 一名干员的全部配装事件监听生命周期；模拟结束后可统一释放。 */
export class EquipmentEventRuntime {
  readonly #registrations: AbilityEventRegistration[] = [];

  constructor(
    semanticEvents: CombatSemanticEventRuntime,
    operatorId: string,
    contributions: readonly CompiledEquipmentContribution[],
    createExecutor: CreateEquipmentEventOperationExecutor,
  ) {
    for (const contribution of contributions) {
      for (const handler of contribution.eventHandlers) {
        this.#registrations.push(
          semanticEvents.register({
            ownerOperatorId: operatorId,
            trigger: handler.event,
            phase: 'dataAction',
            ...(handler.condition === undefined ? {} : { condition: handler.condition }),
            createOperations: context =>
              createExecutor({
                operatorId,
                source: contribution.source,
                handlerKey: handler.key,
                event: context.event,
              }),
            handle: (context, getOperations) =>
              this.#execute(handler, getOperations(), context.event),
          }),
        );
      }
    }
  }

  dispose(): void {
    for (const registration of this.#registrations.splice(0)) registration.dispose();
  }

  #execute(
    handler: CompiledEquipmentEventHandler,
    operations: CombatOperationExecutor,
    event: CombatSemanticEventContext['event'],
  ): void {
    const blackboard = new ActionBlackboard();
    const operationContext: CombatOperationContext = { blackboard, event };
    new CombatActionSequenceRuntime(operations, operationContext)
      .createSequence(handler.sequence)
      .executeInstant({});
  }
}
