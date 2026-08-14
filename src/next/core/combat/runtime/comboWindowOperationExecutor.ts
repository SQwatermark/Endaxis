/** 把技能调度中的开启连携窗口步骤接到场景级连携账本。 */
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { ComboWindowRuntime } from './comboWindowRuntime';

export class ComboWindowOperationExecutor implements CombatOperationExecutor {
  constructor(
    readonly operatorId: string,
    readonly windows: ComboWindowRuntime,
    readonly delegate: CombatOperationExecutor,
  ) {}

  execute(
    step: Parameters<CombatOperationExecutor['execute']>[0],
    context?: CombatOperationContext,
  ): boolean {
    if (step.kind === 'openComboWindow') {
      this.windows.open(this.operatorId, step.parameters.nextSkillKey);
      return true;
    }
    return context === undefined
      ? this.delegate.execute(step)
      : this.delegate.execute(step, context);
  }

  end(
    step: Parameters<NonNullable<CombatOperationExecutor['end']>>[0],
    context?: CombatOperationContext,
  ): void {
    if (step.kind === 'openComboWindow') return;
    if (context === undefined) this.delegate.end?.(step);
    else this.delegate.end?.(step, context);
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
