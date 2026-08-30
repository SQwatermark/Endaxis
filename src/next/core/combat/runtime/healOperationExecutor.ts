/** 把普通治疗步骤写入干员生命账本；目标选择和面板来源由场景环境提供。 */
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { HealCalculationAttribute, HealTarget } from '../../game-data/operatorDefinition';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { resolveActionValueOperand } from './actionBlackboard';
import type { CombatClock } from './combatClock';
import type { CombatVitals } from './combatVitals';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { CombatAbilityHealEvent } from './skillRuntime';
import {
  HealCalculationContext,
  type HealModifierSide,
  type HealProcessTiming,
} from '../heal/healModifiers';

type HealStep = Extract<ResolvedCombatOperationStep, { kind: 'heal' }>;

export interface ResolvedHealTarget {
  readonly operatorId: string;
  readonly vitals: CombatVitals;
}

export interface HealOperationDependencies {
  readonly sourceOperatorId: string;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly resolveSourceAttribute: (
    sourceOperatorId: string,
    attribute: HealCalculationAttribute,
  ) => number;
  readonly resolveTarget: (
    target: HealTarget,
    buffSourceId?: string,
    buffOwnerId?: string,
  ) => ResolvedHealTarget;
  /** Context 查询保存的是实例身份；治疗只按该身份取账本，不在此处重新选择。 */
  readonly resolveContextTarget?: (operatorId: string) => ResolvedHealTarget;
  readonly applyHealModifiers?: (
    timing: HealProcessTiming,
    side: HealModifierSide,
    context: HealCalculationContext,
  ) => void;
  readonly resolveHealingIncrease?: (side: HealModifierSide, operatorId: string) => number;
  /** 原生 Modifier 成功后固定先 output、再 receive；满血治疗也必须调用。 */
  readonly emitSuccessfulHeal?: (event: CombatAbilityHealEvent) => void;
  readonly delegate: CombatOperationExecutor;
}

export class HealOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: HealOperationDependencies) {}

  prepare(step: ResolvedCombatOperationStep, context: CombatOperationContext): void {
    this.dependencies.delegate.prepare?.(step, context);
  }

  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean {
    if (step.kind !== 'heal') return this.dependencies.delegate.execute(step, context);
    const target =
      step.parameters.target === 'currentTarget'
        ? this.#resolveCurrentTarget(context)
        : step.parameters.target === 'contextTarget'
          ? this.#resolveContextTarget(step, context)
          : this.dependencies.resolveTarget(
              step.parameters.target,
              context?.buffSourceId,
              context?.buffOwnerId,
            );
    if (target === null) return step.parameters.alwaysNext === true;
    // Buff 生命周期运行在宿主的执行器上，但治疗者仍是创建该 Buff 的来源。
    // 直接技能没有 Buff 上下文，继续使用当前技能所属干员。
    const sourceOperatorId = context?.buffSourceId ?? this.dependencies.sourceOperatorId;
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
      attribute === undefined
        ? 0
        : this.dependencies.resolveSourceAttribute(sourceOperatorId, attribute);
    const calculation = new HealCalculationContext(
      sourceOperatorId,
      target.operatorId,
      target.vitals,
      Math.fround(Math.fround(attributeValue * multiplier) + addition),
      step.parameters.tags,
      this.dependencies.resolveHealingIncrease?.('healer', sourceOperatorId) ?? 0,
      this.dependencies.resolveHealingIncrease?.('receiver', target.operatorId) ?? 0,
    );
    this.dependencies.applyHealModifiers?.('beforeCalculation', 'healer', calculation);
    this.dependencies.applyHealModifiers?.('beforeCalculation', 'receiver', calculation);
    this.dependencies.applyHealModifiers?.('afterCalculation', 'healer', calculation);
    this.dependencies.applyHealModifiers?.('afterCalculation', 'receiver', calculation);
    // BattleFormula.CalculateHeal：普通治疗在 AfterCalculation 修正之后，
    // 乘创建 HealPack 时双方属性快照的 1 + output + taken。
    calculation.value *= 1 + calculation.healerOutputIncrease + calculation.receiverTakenIncrease;
    const requested = Math.max(0, calculation.value);
    const result = target.vitals.heal(requested);
    this.dependencies.receipt.record({
      frame: this.dependencies.clock.frame,
      time: this.dependencies.clock.time,
      event: 'HealingApplied',
      sourceId: sourceOperatorId,
      targetId: target.operatorId,
      data: {
        attribute: attribute ?? 'definite',
        attributeValue,
        multiplier,
        addition,
        tags: JSON.stringify(step.parameters.tags),
        requestedHealing: result.requestedHealing,
        actualHealing: result.actualHealing,
        overhealing: result.overhealing,
        previousHealth: result.previousHealth,
        currentHealth: result.currentHealth,
      },
    });
    const eventBase = {
      kind: 'abilityHeal' as const,
      sourceId: sourceOperatorId,
      targetId: target.operatorId,
      requestedHealing: result.requestedHealing,
      actualHealing: result.actualHealing,
      overhealing: result.overhealing,
      tags: step.parameters.tags,
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

  #resolveContextTarget(
    step: HealStep,
    context: CombatOperationContext | undefined,
  ): ResolvedHealTarget | null {
    if (context?.targetContext === undefined || step.parameters.contextKey === undefined) {
      throw new Error("heal target 'contextTarget' requires a combat target context key");
    }
    const targets = context.targetContext.get(step.parameters.contextKey);
    if (targets.length === 0) return null;
    const target = targets[0];
    if (targets.length !== 1 || target?.kind !== 'operator') {
      throw new Error(`heal context target '${step.parameters.contextKey}' must be one operator`);
    }
    const resolve = this.dependencies.resolveContextTarget;
    if (resolve === undefined) throw new Error('context heal target resolver is not configured');
    return resolve(target.operatorId);
  }

  #resolveCurrentTarget(context: CombatOperationContext | undefined): ResolvedHealTarget {
    if (context?.currentTarget?.kind !== 'operator') {
      throw new Error("heal target 'currentTarget' requires a current operator target");
    }
    const resolve = this.dependencies.resolveContextTarget;
    if (resolve === undefined) throw new Error('current heal target resolver is not configured');
    return resolve(context.currentTarget.operatorId);
  }
}
