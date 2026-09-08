import type { CompiledOperatorPassiveProgram } from '../../compiler/combatProgram';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type { AbilityEventRuntimeActionContext } from '../events/abilityEventActionContext';
import {
  normalizeAbilityEventPayload,
  readEventSkillCastInfo,
} from './buffLifecycleSequenceRuntime';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import { RuntimeTargetContext } from './runtimeTargetContext';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

/** 原生被动 Skill 的事件序列宿主；黑板和子 Buff 所有权由被动实例提供。 */
export class PassiveAbilityEventRuntime {
  readonly #registrations: AbilityEventRegistration[] = [];
  #disposed = false;

  constructor(
    operations: CombatOperationExecutor,
    ownerContext: CombatOperationContext,
    responses: NonNullable<CompiledOperatorPassiveProgram['abilityEventResponses']>,
    register: (
      event: NonNullable<CompiledOperatorPassiveProgram['abilityEventResponses']>[number]['event'],
      priority: number,
      handle: (payload: unknown, context?: AbilityEventRuntimeActionContext) => void,
    ) => AbilityEventRegistration,
  ) {
    try {
      for (const response of responses) {
        // 一个原生监听持有一个 SequenceAction；不能每次通知重新创建并丢失重入状态。
        const context = { ...ownerContext };
        const sequence = new CombatActionSequenceRuntime(operations, context).createSequence(
          response.sequence,
        );
        sequence.reset({});
        this.#registrations.push(
          register(response.event, response.priority, (payload, targets) => {
            if (this.#disposed) return;
            const previous = {
              event: context.event,
              eventSkillCastInfo: context.eventSkillCastInfo,
              targetContext: context.targetContext,
              actionInputTarget: context.actionInputTarget,
            };
            try {
              context.event = normalizeAbilityEventPayload(response.event, payload);
              context.eventSkillCastInfo = readEventSkillCastInfo(payload);
              context.actionInputTarget = targets?.inputTarget;
              context.targetContext = new RuntimeTargetContext();
              if (targets?.triggerTarget != null)
                context.targetContext.setSingle('trigger', targets.triggerTarget);
              sequence.executeInstant({});
            } finally {
              // 同步嵌套通知之后恢复外层上下文，不覆盖普通来源 SkillCastInfo。
              Object.assign(context, previous);
            }
          }),
        );
      }
    } catch (error) {
      this.dispose();
      throw error;
    }
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    for (const registration of this.#registrations.splice(0)) registration.dispose();
  }
}
