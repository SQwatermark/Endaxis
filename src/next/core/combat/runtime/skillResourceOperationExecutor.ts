/**
 * 技能操作执行链中的资源职责节点。
 * 只消费已闭环的资源步骤，其他步骤必须显式委托；未知步骤不能被吞掉或视作成功。
 */
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { CombatClock } from './combatClock';
import type { CombatResources } from './combatResources';
import type { CombatOperationExecutor } from './skillRuntime';
import { resolveActionValueOperand } from './actionBlackboard';

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' | 'once' }>;

/** 资源执行节点所需的来源身份、账本、回执和后继执行器。 */
export interface SkillResourceOperationDependencies {
  readonly sourceOperatorId: string;
  readonly skillId: string;
  readonly clock: CombatClock;
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptSink;
  readonly getNonReturnedSpCost: () => number;
  readonly delegate: CombatOperationExecutor;
}

/** 处理已还原的技能资源操作，并将其他操作继续委托。 */
export class SkillResourceOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: SkillResourceOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind === 'changeResourceByActionValue') {
      if (context === undefined) {
        throw new Error('changeResourceByActionValue requires a combat operation context');
      }
      return this.execute(
        {
          kind: 'changeResource',
          parameters: {
            ...step.parameters,
            amount: Math.fround(
              resolveActionValueOperand(step.parameters.amount, context.blackboard),
            ),
          },
        },
        context,
      );
    }
    if (
      step.kind === 'changeResource' &&
      step.parameters.resource === 'sp' &&
      step.parameters.recipient === 'team'
    ) {
      const amount = Math.fround(step.parameters.amount * (step.parameters.coefficient ?? 1));
      const change = this.dependencies.resources.gainSp(
        amount,
        step.parameters.spGainKind,
        step.parameters.spGainSource ?? 'default',
      );
      this.dependencies.receipt.record({
        frame: this.dependencies.clock.frame,
        time: this.dependencies.clock.time,
        event: 'SpChanged',
        sourceId: this.dependencies.sourceOperatorId,
        data: {
          skillId: this.dependencies.skillId,
          recipient: 'team',
          baseValue: change.baseValue,
          requestedValue: change.requestedValue,
          actualValue: change.actualValue,
          previousValue: change.previousValue,
          currentValue: change.currentValue,
          gainKind: change.gainKind,
        },
      });
      return true;
    }

    if (
      step.kind === 'changeResource' &&
      step.parameters.resource === 'ultimateEnergy' &&
      step.parameters.recipient === 'caster'
    ) {
      const amount = Math.fround(step.parameters.amount);
      const change = this.dependencies.resources.changeUltimateEnergy(
        this.dependencies.sourceOperatorId,
        amount,
        {
          coefficient: step.parameters.coefficient,
          isPercentValue: step.parameters.isPercentValue,
          recoveryTagId: step.parameters.ultimateRecoveryTagId,
          ignoreGainMultiplier: step.parameters.ignoreUltimateEnergyGainMultiplier,
        },
      );
      this.#recordUltimateEnergyChange(change);
      return true;
    }

    if (step.kind !== 'gainSquadUltimateEnergyFromSkillCost') {
      return context === undefined
        ? this.dependencies.delegate.execute(step)
        : this.dependencies.delegate.execute(step, context);
    }

    const changes = this.dependencies.resources.gainSquadUltimateEnergyFromSkillCost(
      this.dependencies.sourceOperatorId,
      this.dependencies.getNonReturnedSpCost(),
      step.parameters.coefficient,
    );
    for (const change of changes) this.#recordUltimateEnergyChange(change);
    return true;
  }

  end(
    step: Parameters<NonNullable<CombatOperationExecutor['end']>>[0],
    context?: Parameters<NonNullable<CombatOperationExecutor['end']>>[1],
  ): void {
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }

  #recordUltimateEnergyChange(change: ReturnType<CombatResources['changeUltimateEnergy']>): void {
    this.dependencies.receipt.record({
      frame: this.dependencies.clock.frame,
      time: this.dependencies.clock.time,
      event: 'UltimateEnergyChanged',
      sourceId: this.dependencies.sourceOperatorId,
      targetId: change.operatorId,
      data: {
        skillId: this.dependencies.skillId,
        recipient: 'operator',
        baseValue: change.baseValue,
        requestedValue: change.requestedValue,
        applied: change.applied,
        actualValue: change.actualValue,
        previousValue: change.previousValue,
        currentValue: change.currentValue,
      },
    });
  }
}
