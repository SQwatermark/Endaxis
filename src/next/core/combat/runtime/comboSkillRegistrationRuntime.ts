/**
 * 安装干员级首段连携规则，并把命中的语义事件提交给场景连携窗口。
 * 它随参战干员创建一次，不随时间轴上的技能块数量重复注册。
 */
import type { CompiledComboSkillRegistration } from '../../compiler/combatProgram';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type { CombatOperationExecutor } from './skillRuntime';
import type { ComboWindowRuntime } from './comboWindowRuntime';
import type { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';

export interface ComboSkillRegistrationRuntimeOptions {
  readonly operatorId: string;
  readonly registrations: readonly CompiledComboSkillRegistration[];
  readonly semanticEvents: CombatSemanticEventRuntime;
  readonly comboWindows: ComboWindowRuntime;
  /** 连携条件与其他事件监听器共用同一条操作执行链。 */
  readonly createOperations?: () => CombatOperationExecutor;
  /** 立即施放不是窗口消费，必须由具有完整技能索引的能力系统实现。 */
  readonly castImmediately?: (operatorId: string, skillKey: string) => void;
}

/** 一名干员在一场战斗中的首段连携监听集合。 */
export class ComboSkillRegistrationRuntime {
  readonly #registrations: AbilityEventRegistration[] = [];

  constructor(readonly options: ComboSkillRegistrationRuntimeOptions) {
    for (const registration of options.registrations) {
      for (const rule of registration.rules) {
        this.#registrations.push(
          options.semanticEvents.register({
            ownerOperatorId: options.operatorId,
            trigger: rule.trigger,
            phase: 'combo',
            ...(rule.condition === undefined ? {} : { condition: rule.condition }),
            ...(options.createOperations === undefined
              ? {}
              : { createOperations: options.createOperations }),
            handle: () => {
              if (rule.castImmediately === true) {
                const castImmediately = options.castImmediately;
                if (castImmediately === undefined) {
                  throw new Error(
                    `combo skill '${registration.skillKey}' requires immediate-cast support`,
                  );
                }
                castImmediately(options.operatorId, registration.skillKey);
                return;
              }

              options.comboWindows.open(
                options.operatorId,
                registration.skillKey,
                registration.blackboard,
              );
            },
          }),
        );
      }
    }
  }

  dispose(): void {
    for (const registration of this.#registrations.splice(0)) registration.dispose();
  }
}
