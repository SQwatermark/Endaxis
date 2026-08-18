/** 将主动技能动作产生的语义事实同步发布到同一战斗事件总线。 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { CombatTarget } from '../../game-data/operatorDefinition';
import type { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import type { CombatClock } from './combatClock';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatOperationExecutor } from './skillRuntime';

export interface CombatSemanticOutputOperationExecutorOptions {
  readonly sourceOperatorId: string;
  readonly resolveTargetId: (target: CombatTarget) => string;
  readonly semanticEvents: CombatSemanticEventRuntime;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly delegate: CombatOperationExecutor;
}

export class CombatSemanticOutputOperationExecutor implements CombatOperationExecutor {
  constructor(readonly options: CombatSemanticOutputOperationExecutorOptions) {}

  execute(
    step: ResolvedCombatOperationStep,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind !== 'outputAirborne') {
      return context === undefined
        ? this.options.delegate.execute(step)
        : this.options.delegate.execute(step, context);
    }
    const targetId = this.options.resolveTargetId(step.parameters.target);
    this.options.receipt.record({
      frame: this.options.clock.frame,
      time: this.options.clock.time,
      event: 'AirborneOutput',
      sourceId: this.options.sourceOperatorId,
      targetId,
    });
    this.options.semanticEvents.emit({
      kind: 'airborneOutput',
      sourceOperatorId: this.options.sourceOperatorId,
      targetId,
    });
    return true;
  }

  end(
    step: ResolvedCombatOperationStep,
    context?: Parameters<NonNullable<CombatOperationExecutor['end']>>[1],
  ): void {
    if (step.kind === 'outputAirborne') return;
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
