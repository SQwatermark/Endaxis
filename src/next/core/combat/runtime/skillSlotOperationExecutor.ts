/** 切换稳定技能组后续释放形态；当前释放已经持有的 SkillRuntime 引用不会改变。 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { CombatOperationExecutor } from './skillRuntime';

export interface SkillSlotOperationExecutorOptions {
  readonly changeSkillSlot: (
    skillGroupKey: string,
    targetSkillKey: string,
    inheritOriginSkillCooldownProgress: boolean,
  ) => void;
  readonly delegate: CombatOperationExecutor;
}

export class SkillSlotOperationExecutor implements CombatOperationExecutor {
  constructor(readonly options: SkillSlotOperationExecutorOptions) {}

  execute(
    step: ResolvedCombatOperationStep,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind !== 'changeSkillSlot') {
      return context === undefined
        ? this.options.delegate.execute(step)
        : this.options.delegate.execute(step, context);
    }
    this.options.changeSkillSlot(
      step.parameters.skillGroupKey,
      step.parameters.targetSkillKey,
      step.parameters.inheritOriginSkillCooldownProgress ?? false,
    );
    return true;
  }

  end(
    step: ResolvedCombatOperationStep,
    context?: Parameters<NonNullable<CombatOperationExecutor['end']>>[1],
  ): void {
    if (step.kind === 'changeSkillSlot') return;
    this.options.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.options.delegate.evaluate(condition)
      : this.options.delegate.evaluate(condition, context);
  }
}
