/**
 * 解释原生 MarkInheritSkillCastIdOnNormalAttack 的 Buff 生命周期动作。
 * 登记属于 Buff 实例的执行上下文；同一干员重复登记时原生保留首个来源。
 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { CombatSkillCastInfo } from './skillCastInfo';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

export interface NormalAttackSkillCastInheritanceHandle {
  finish(): void;
}

export class SkillCastInheritanceOperationExecutor implements CombatOperationExecutor {
  readonly #handles = new WeakMap<CombatOperationContext, NormalAttackSkillCastInheritanceHandle>();

  constructor(
    readonly register: (
      operatorId: string,
      skillCastInfo: CombatSkillCastInfo,
    ) => NormalAttackSkillCastInheritanceHandle,
    readonly delegate: CombatOperationExecutor,
  ) {}

  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean {
    if (step.kind !== 'inheritNormalAttackSkillCastInfo') {
      return context === undefined
        ? this.delegate.execute(step)
        : this.delegate.execute(step, context);
    }
    if (context?.buffOwnerId === undefined || context.skillCastInfo === undefined) {
      throw new Error(
        'normal-attack skill-cast inheritance requires a Buff owner and source SkillCastInfo',
      );
    }
    this.#handles.get(context)?.finish();
    this.#handles.set(context, this.register(context.buffOwnerId, context.skillCastInfo));
    return true;
  }

  end(step: ResolvedCombatOperationStep, context?: CombatOperationContext): void {
    if (step.kind !== 'inheritNormalAttackSkillCastInfo') {
      this.delegate.end?.(step, context);
      return;
    }
    if (context === undefined) return;
    this.#handles.get(context)?.finish();
    this.#handles.delete(context);
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
