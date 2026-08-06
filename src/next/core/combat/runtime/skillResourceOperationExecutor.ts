import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { CombatClock } from './combatClock';
import type { CombatResources } from './combatResources';
import type { CombatOperationExecutor } from './skillRuntime';

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' }>;

export interface SkillResourceOperationDependencies {
  readonly sourceOperatorId: string;
  readonly skillId: string;
  readonly clock: CombatClock;
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptSink;
  readonly getNonReturnedSpCost: () => number;
  readonly delegate: CombatOperationExecutor;
}

/** Handles recovered skill-resource actions and delegates every other operation. */
export class SkillResourceOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: SkillResourceOperationDependencies) {}

  execute(step: RuntimeOperation): boolean {
    if (step.kind !== 'gainSquadUltimateEnergyFromSkillCost') {
      return this.dependencies.delegate.execute(step);
    }

    const changes = this.dependencies.resources.gainSquadUltimateEnergyFromSkillCost(
      this.dependencies.sourceOperatorId,
      this.dependencies.getNonReturnedSpCost(),
      step.parameters.coefficient,
    );
    for (const change of changes) {
      this.dependencies.receipt.record({
        frame: this.dependencies.clock.frame,
        time: this.dependencies.clock.time,
        event: 'UltimateEnergyChanged',
        sourceId: this.dependencies.sourceOperatorId,
        targetId: change.operatorId,
        data: {
          skillId: this.dependencies.skillId,
          baseValue: change.baseValue,
          requestedValue: change.requestedValue,
          applied: change.applied,
          actualValue: change.actualValue,
          previousValue: change.previousValue,
          currentValue: change.currentValue,
        },
      });
    }
    return true;
  }

  evaluate(condition: Parameters<CombatOperationExecutor['evaluate']>[0]): boolean {
    return this.dependencies.delegate.evaluate(condition);
  }
}
