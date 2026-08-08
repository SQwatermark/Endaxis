/**
 * 把语义状态动作接到具体状态所有者，并在状态所有者完成结算后记录前后快照。
 * 本适配器不定义叠层、刷新或到期规则；这些规则必须由目标状态所有者实现。
 */
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { CombatTarget } from '../../game-data/operatorDefinition';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import type { CombatClock } from './combatClock';
import type { CombatOperationExecutor } from './skillRuntime';

type RuntimeOperation = Exclude<ResolvedCombatStep, { kind: 'conditional' | 'once' }>;
type ApplyStatusStep = Extract<RuntimeOperation, { kind: 'applyStatus' }>;
type ConsumeStatusStep = Extract<RuntimeOperation, { kind: 'consumeStatus' }>;

/** 某个语义状态在一次动作边界上的实际快照；null 时长表示没有有限到期时间。 */
export interface CombatStatusSnapshot {
  readonly stacks: number;
  readonly remainingFrames: number | null;
}

/** 状态所有者完成一次动作后返回的实际变化，不包含任何投影层推导值。 */
export interface CombatStatusTransition {
  readonly previous: CombatStatusSnapshot;
  readonly current: CombatStatusSnapshot;
}

/**
 * 语义状态的运行时所有者端口。
 * 调用方只传递编译后的原始参数；默认层数、上限、刷新和消费语义均由实现方负责。
 */
export interface CombatStatusOperationTarget {
  readonly targetId: string;
  applyStatus(parameters: ApplyStatusStep['parameters']): CombatStatusTransition;
  consumeStatus(parameters: ConsumeStatusStep['parameters']): CombatStatusTransition;
}

export interface StatusOperationDependencies {
  readonly sourceId: string;
  readonly skillId: string;
  readonly clock: CombatClock;
  readonly receipt: CombatReceiptSink;
  readonly resolveTarget: (target: CombatTarget) => CombatStatusOperationTarget;
  readonly delegate: CombatOperationExecutor;
}

/** 记录 applyStatus 与 consumeStatus 的结算事实；自然到期必须由状态所有者另行记录。 */
export class StatusOperationExecutor implements CombatOperationExecutor {
  constructor(readonly dependencies: StatusOperationDependencies) {}

  execute(
    step: RuntimeOperation,
    context?: Parameters<CombatOperationExecutor['execute']>[1],
  ): boolean {
    if (step.kind === 'applyStatus') {
      const target = this.dependencies.resolveTarget(step.parameters.target);
      const transition = target.applyStatus(step.parameters);
      this.recordTransition(target.targetId, step.parameters.statusKey, 'applied', transition, {
        requestedStacks: step.parameters.stacks ?? null,
        requestedDurationFrames: step.parameters.durationFrames ?? null,
        requestedMaxStacks: step.parameters.maxStacks ?? null,
      });
      return true;
    }

    if (step.kind === 'consumeStatus') {
      const target = this.dependencies.resolveTarget(step.parameters.target);
      const transition = target.consumeStatus(step.parameters);
      this.recordTransition(target.targetId, step.parameters.statusKey, 'consumed', transition, {
        requestedStacks: step.parameters.stacks ?? null,
        requestedDurationFrames: null,
        requestedMaxStacks: null,
      });
      return true;
    }

    return context === undefined
      ? this.dependencies.delegate.execute(step)
      : this.dependencies.delegate.execute(step, context);
  }

  evaluate(
    condition: Parameters<CombatOperationExecutor['evaluate']>[0],
    context?: Parameters<CombatOperationExecutor['evaluate']>[1],
  ): boolean {
    return context === undefined
      ? this.dependencies.delegate.evaluate(condition)
      : this.dependencies.delegate.evaluate(condition, context);
  }

  private recordTransition(
    targetId: string,
    statusKey: string,
    reason: 'applied' | 'consumed',
    transition: CombatStatusTransition,
    request: {
      readonly requestedStacks: number | null;
      readonly requestedDurationFrames: number | null;
      readonly requestedMaxStacks: number | null;
    },
  ): void {
    this.dependencies.receipt.record({
      frame: this.dependencies.clock.frame,
      time: this.dependencies.clock.time,
      event: 'StatusChanged',
      sourceId: this.dependencies.sourceId,
      targetId,
      data: {
        skillId: this.dependencies.skillId,
        statusKey,
        reason,
        ...request,
        previousStacks: transition.previous.stacks,
        previousRemainingFrames: transition.previous.remainingFrames,
        currentStacks: transition.current.stacks,
        currentRemainingFrames: transition.current.remainingFrames,
      },
    });
  }
}
