/** 把普通治疗步骤写入干员生命账本；目标选择和面板来源由场景环境提供。 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { HealCalculationAttribute, HealTarget } from '../../game-data/operatorDefinition';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { resolveActionValueOperand } from './actionBlackboard';
import type { CombatClock } from './combatClock';
import type { CombatVitals } from './combatVitals';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { CombatAbilityHealEvent } from './skillRuntime';

type HealStep = Extract<ResolvedCombatOperationStep, { kind: 'heal' }>;

export interface ResolvedHealTarget {
  readonly operatorId: string;
  readonly vitals: CombatVitals;
}

export interface HealOperationDependencies {
  readonly sourceOperatorId: string;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly resolveSourceAttribute: (attribute: HealCalculationAttribute) => number;
  readonly resolveTarget: (target: HealTarget, buffSourceId?: string) => ResolvedHealTarget;
  /** 原生 Modifier 成功后固定先 output、再 receive；满血治疗也必须调用。 */
  readonly emitSuccessfulHeal?: (event: CombatAbilityHealEvent) => void;
  readonly delegate: CombatOperationExecutor;
}

export class HealOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: HealOperationDependencies) {}

  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean {
    if (step.kind !== 'heal') return this.dependencies.delegate.execute(step, context);
    const target = this.dependencies.resolveTarget(step.parameters.target, context?.buffSourceId);
    const definiteAmount = step.parameters.amount;
    const attribute = definiteAmount === undefined ? step.parameters.attribute : undefined;
    const multiplier =
      definiteAmount === undefined
        ? this.#resolveValue(step.parameters.multiplier, context, step)
        : 0;
    const addition =
      definiteAmount === undefined
        ? this.#resolveValue(step.parameters.addition, context, step)
        : this.#resolveValue(definiteAmount, context, step);
    const attributeValue =
      attribute === undefined ? 0 : this.dependencies.resolveSourceAttribute(attribute);
    const requested = Math.max(0, Math.fround(Math.fround(attributeValue * multiplier) + addition));
    const result = target.vitals.heal(requested);
    this.dependencies.receipt.record({
      frame: this.dependencies.clock.frame,
      time: this.dependencies.clock.time,
      event: 'HealingApplied',
      sourceId: this.dependencies.sourceOperatorId,
      targetId: target.operatorId,
      data: {
        attribute: attribute ?? 'definite',
        attributeValue,
        multiplier,
        addition,
        tagIds: JSON.stringify(step.parameters.tagIds),
        requestedHealing: result.requestedHealing,
        actualHealing: result.actualHealing,
        overhealing: result.overhealing,
        previousHealth: result.previousHealth,
        currentHealth: result.currentHealth,
      },
    });
    const eventBase = {
      kind: 'abilityHeal' as const,
      sourceId: this.dependencies.sourceOperatorId,
      targetId: target.operatorId,
      requestedHealing: result.requestedHealing,
      actualHealing: result.actualHealing,
      overhealing: result.overhealing,
      tagIds: step.parameters.tagIds,
    };
    this.dependencies.emitSuccessfulHeal?.({ ...eventBase, event: 'outputHeal' });
    this.dependencies.emitSuccessfulHeal?.({ ...eventBase, event: 'receiveHeal' });
    return true;
  }

  end(step: ResolvedCombatOperationStep, context?: CombatOperationContext): void {
    this.dependencies.delegate.end?.(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: CombatOperationContext,
  ): boolean {
    return this.dependencies.delegate.evaluate(condition, context);
  }

  #resolveValue(
    value: NonNullable<HealStep['parameters']['multiplier']>,
    context: CombatOperationContext | undefined,
    step: HealStep,
  ): number {
    if (typeof value === 'number') return value;
    if (context === undefined) {
      throw new Error(`heal '${step.parameters.target}' requires an action blackboard`);
    }
    return resolveActionValueOperand(value, context.blackboard);
  }
}
