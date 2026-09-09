import type { CompiledOperatorPassiveProgram } from '../../compiler/combatProgram';
import type { CombatAbilityEvent } from '../events/combatAbilityEvent';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type { AbilityEventRuntimeActionContext } from '../events/abilityEventActionContext';
import { withAbilityEventResponseContext } from './abilityEventResponseContext';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

/** 原生被动 Skill 的事件序列宿主；黑板和子 Buff 所有权由被动实例提供。 */
export class PassiveAbilityEventRuntime {
  readonly #registrations: AbilityEventRegistration[] = [];
  #disposed = false;
  #enabled = false;

  constructor(
    operations: CombatOperationExecutor,
    ownerContext: CombatOperationContext,
    responses: NonNullable<CompiledOperatorPassiveProgram['abilityEventResponses']>,
    register: (
      event: NonNullable<CompiledOperatorPassiveProgram['abilityEventResponses']>[number]['event'],
      priority: number,
      handle: (
        published: CombatAbilityEvent<
          NonNullable<CompiledOperatorPassiveProgram['abilityEventResponses']>[number]['event']
        >,
        context?: AbilityEventRuntimeActionContext,
      ) => void,
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
          register(response.event, response.priority, (published, targets) => {
            if (this.#disposed || !this.#enabled) return;
            withAbilityEventResponseContext(context, published, targets, () => {
              sequence.executeInstant({});
            });
          }),
        );
      }
    } catch (error) {
      this.dispose();
      throw error;
    }
  }

  /** 注册早于初始化，但原生 Ability 在启动 Buff 安装完成后才允许执行响应。 */
  enable(): void {
    if (this.#disposed) throw new Error('cannot enable a disposed passive event host');
    this.#enabled = true;
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    for (const registration of this.#registrations.splice(0)) registration.dispose();
  }
}
