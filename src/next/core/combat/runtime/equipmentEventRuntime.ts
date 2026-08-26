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
import type { EquipmentAbilityEvent } from '../../game-data/equipmentDefinition';
import { ActionBlackboard } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import {
  CombatSemanticEventRuntime,
  type CombatSemanticEventContext,
} from './combatSemanticEventRuntime';
import {
  normalizeAbilityEventPayload,
  readEventSkillCastInfo,
} from './buffLifecycleSequenceRuntime';
import type { CombatSkillCastInfo } from './skillCastInfo';

export type RegisterEquipmentAbilityEventAction = (
  operatorId: string,
  event: EquipmentAbilityEvent,
  priority: number,
  handle: (payload: unknown) => void,
) => AbilityEventRegistration;

/** 配装操作执行器用于归因和选择实体状态的稳定上下文。 */
export interface EquipmentEventExecutionContext {
  readonly operatorId: string;
  readonly source: EquipmentContributionSource;
  readonly handlerKey: string;
  readonly event:
    CombatSemanticEventContext['event'] | ReturnType<typeof normalizeAbilityEventPayload>;
}

export type CreateEquipmentEventOperationExecutor = (
  context: EquipmentEventExecutionContext,
) => CombatOperationExecutor;

/** 一名干员的全部配装事件监听生命周期；模拟结束后可统一释放。 */
export class EquipmentEventRuntime {
  readonly #registrations: AbilityEventRegistration[] = [];
  readonly #operatorId: string;
  // 固定配装的被动 Ability 存活到本运行实例释放；不能把子 Buff 挂到触发它的主动技能。
  readonly #children: { finish(reason: 'other'): boolean }[] = [];

  constructor(
    semanticEvents: CombatSemanticEventRuntime,
    operatorId: string,
    contributions: readonly CompiledEquipmentContribution[],
    createExecutor: CreateEquipmentEventOperationExecutor,
    registerAbilityEventAction?: RegisterEquipmentAbilityEventAction,
  ) {
    this.#operatorId = operatorId;
    for (const contribution of contributions) {
      for (const handler of contribution.eventHandlers) {
        if (handler.abilityEvent !== undefined) {
          if (registerAbilityEventAction === undefined) {
            throw new Error(
              `equipment handler '${handler.key}' requires an AbilityEvent registration port`,
            );
          }
          this.#registrations.push(
            registerAbilityEventAction(
              operatorId,
              handler.abilityEvent,
              handler.priority ?? 0,
              payload => {
                const event = normalizeAbilityEventPayload(handler.abilityEvent!, payload);
                this.#execute(
                  handler,
                  createExecutor({
                    operatorId,
                    source: contribution.source,
                    handlerKey: handler.key,
                    event,
                  }),
                  event,
                  readEventSkillCastInfo(payload),
                );
              },
            ),
          );
          continue;
        }
        this.#registrations.push(
          semanticEvents.register({
            ownerOperatorId: operatorId,
            trigger: handler.event,
            phase: 'dataAction',
            priority: handler.priority ?? 0,
            ...(handler.condition === undefined ? {} : { condition: handler.condition }),
            createOperations: context =>
              createExecutor({
                operatorId,
                source: contribution.source,
                handlerKey: handler.key,
                event: context.event,
              }),
            handle: (context, getOperations) =>
              this.#execute(
                handler,
                getOperations(),
                context.event,
                readEventSkillCastInfo(context.event),
              ),
          }),
        );
      }
    }
  }

  dispose(): void {
    for (const registration of this.#registrations.splice(0)) registration.dispose();
    for (const child of this.#children.splice(0)) child.finish('other');
  }

  #execute(
    handler: CompiledEquipmentEventHandler,
    operations: CombatOperationExecutor,
    event: EquipmentEventExecutionContext['event'],
    eventSkillCastInfo?: CombatSkillCastInfo,
  ): void {
    const blackboard = new ActionBlackboard(handler.blackboard ?? {});
    const operationContext: CombatOperationContext = {
      blackboard,
      event,
      actionOwnerId: this.#operatorId,
      ...(eventSkillCastInfo === undefined ? {} : { eventSkillCastInfo }),
      addAbilityChildBuff: child => {
        this.#children.push(child);
      },
    };
    new CombatActionSequenceRuntime(operations, operationContext)
      .createSequence(handler.sequence)
      .executeInstant({});
  }
}
