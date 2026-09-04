import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { CombatSkillCastInfo } from './skillCastInfo';

export interface SkillCastInheritanceRegistration {
  readonly skillCastInfo: CombatSkillCastInfo;
  dispose(): void;
}

/** 原生 AbilitySystem 的普通攻击施法身份继承槽；首次注册优先，按动作结束撤销。 */
export class BasicAttackSkillCastInheritanceRegistry {
  readonly #registrations = new Map<
    string,
    { readonly token: object; readonly skillCastInfo: CombatSkillCastInfo }
  >();

  register(
    operatorId: string,
    skillCastInfo: CombatSkillCastInfo,
  ): SkillCastInheritanceRegistration {
    const token = {};
    if (!this.#registrations.has(operatorId)) {
      this.#registrations.set(operatorId, { token, skillCastInfo });
    }
    return {
      skillCastInfo,
      dispose: () => {
        if (this.#registrations.get(operatorId)?.token === token) {
          this.#registrations.delete(operatorId);
        }
      },
    };
  }

  get(operatorId: string): CombatSkillCastInfo | undefined {
    return this.#registrations.get(operatorId)?.skillCastInfo;
  }
}

/** Buff enable 序列中的注册动作；同一步骤实例在 end/reset 时只撤销自己的注册。 */
export class SkillCastInheritanceOperationExecutor implements CombatOperationExecutor {
  readonly #active = new Map<ResolvedCombatOperationStep, SkillCastInheritanceRegistration>();

  constructor(
    readonly operatorId: string,
    readonly registry: BasicAttackSkillCastInheritanceRegistry,
    readonly delegate: CombatOperationExecutor,
  ) {}

  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean {
    if (step.kind !== 'inheritSkillCastInfoForBasicAttack') {
      return context === undefined
        ? this.delegate.execute(step)
        : this.delegate.execute(step, context);
    }
    if (this.#active.has(step)) return true;
    if (context?.skillCastInfo === undefined) {
      throw new Error('basic-attack SkillCastInfo inheritance requires a source SkillCastInfo');
    }
    this.#active.set(step, this.registry.register(this.operatorId, context.skillCastInfo));
    return true;
  }

  end(step: ResolvedCombatOperationStep, context?: CombatOperationContext): void {
    if (step.kind !== 'inheritSkillCastInfoForBasicAttack') {
      this.delegate.end?.(step, context);
      return;
    }
    this.#active.get(step)?.dispose();
    this.#active.delete(step);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: CombatOperationContext,
  ): boolean {
    return context === undefined
      ? this.delegate.evaluate(condition)
      : this.delegate.evaluate(condition, context);
  }
}
