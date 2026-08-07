/**
 * 编译后技能程序在一次战斗中的有状态执行实例。
 * 每个技能实例独立持有调度游标和黑板；调用方不能跨实例复用或直接修改其内部状态。
 */
import { ActionSequence } from '../actions/actionSequence';
import { CombatStep, type CombatExecutionContext } from '../actions/combatStep';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { TimelineActionProcessor } from '../timeline/timelineActionProcessor';
import type {
  CompiledSkillProgram,
  ResolvedActionSequence,
  ResolvedCombatStep,
} from '../../compiler/combatProgram';
import { COMBAT_FRAME_INTERVAL, type CombatClock } from './combatClock';
import type { CombatResources } from './combatResources';
import { ActionBlackboard } from './actionBlackboard';

/** 技能实例从可释放到结束的运行时生命周期状态。 */
export type RuntimeSkillState = 'ready' | 'casting' | 'ended';
/** 当前已闭环、会改变技能结束事实的中断来源。 */
export type RuntimeSkillInterruptReason = 'castNextSkill';

/** 技能运行时把普通操作和条件判断委托给战斗装配层的端口。 */
export interface CombatOperationContext {
  /** 一次技能运行实例独占的动作黑板；步骤不得把它缓存到实例生命周期之外。 */
  readonly blackboard: ActionBlackboard;
}

export interface CombatOperationExecutor {
  execute(
    step: Exclude<ResolvedCombatStep, { kind: 'conditional' }>,
    context?: CombatOperationContext,
  ): boolean;
  evaluate(
    condition: Extract<ResolvedCombatStep, { kind: 'conditional' }>['parameters']['condition'],
    context?: CombatOperationContext,
  ): boolean;
}

interface SkillRuntimeDependencies {
  readonly clock: CombatClock;
  readonly resources: CombatResources;
  readonly receipt: CombatReceiptSink;
  readonly operations: CombatOperationExecutor;
}

class RuntimeOperationStep extends CombatStep {
  constructor(
    readonly step: Exclude<ResolvedCombatStep, { kind: 'conditional' }>,
    readonly runtime: SkillRuntime,
  ) {
    super();
  }

  execute(): void {
    this.tryExecute();
  }

  override tryExecute(): boolean {
    this.runtime.record('CombatStepReached', { kind: this.step.kind });
    return this.runtime.operations.execute(this.step, this.runtime.operationContext);
  }
}

class RuntimeConditionalStep extends CombatStep {
  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'conditional' }>,
    readonly runtime: SkillRuntime,
  ) {
    super();
  }

  execute(context: CombatExecutionContext): void {
    this.tryExecute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    const passed = this.runtime.operations.evaluate(
      this.step.parameters.condition,
      this.runtime.operationContext,
    );
    this.runtime.record('CombatConditionEvaluated', {
      kind: this.step.parameters.condition.kind,
      passed,
    });
    const branch = passed ? this.step.whenTrue : this.step.whenFalse;
    if (branch === undefined) return passed;
    return this.runtime.createSequence(branch).executeInstant(context);
  }
}

/** 一次编译后技能的有状态实例；创建后只用于一场战斗。 */
export class SkillRuntime {
  readonly #program: CompiledSkillProgram;
  readonly #dependencies: SkillRuntimeDependencies;
  readonly #context: CombatExecutionContext = {};
  readonly #blackboard = new ActionBlackboard();
  readonly #operationContext: CombatOperationContext = { blackboard: this.#blackboard };
  #timeline: TimelineActionProcessor | null = null;
  #state: RuntimeSkillState = 'ready';
  #passedFrames = 0;
  #appliedCost = false;
  #attemptedCost = false;
  #nonReturnedSpCost = 0;

  constructor(program: CompiledSkillProgram, dependencies: SkillRuntimeDependencies) {
    this.#program = program;
    this.#dependencies = dependencies;
  }

  get state(): RuntimeSkillState {
    return this.#state;
  }

  get skillId(): string {
    return this.#program.skillId;
  }

  get skillType(): CompiledSkillProgram['skillType'] {
    return this.#program.skillType;
  }

  get passedFrames(): number {
    return this.#passedFrames;
  }

  get appliedCost(): boolean {
    return this.#appliedCost;
  }

  get nonReturnedSpCost(): number {
    return this.#nonReturnedSpCost;
  }

  get operations(): CombatOperationExecutor {
    return this.#dependencies.operations;
  }

  get operationContext(): CombatOperationContext {
    return this.#operationContext;
  }

  canStart(): boolean {
    return this.#state !== 'casting';
  }

  tryStart(): boolean {
    if (this.#state === 'casting') throw new Error(`skill '${this.#program.skillId}' is casting`);
    if (!this.#dependencies.resources.canPay(this.#program.operatorId, this.#program.costs)) {
      this.record('SkillCostUnavailableAtStart');
    }

    this.#timeline = new TimelineActionProcessor(
      this.#program.timelineActions.map(action => ({
        startFrame: action.startFrame,
        sequence: this.createSequence(action.sequence),
      })),
      {
        started: action =>
          this.record('TimelineActionStarted', {
            startFrame: action.startFrame,
          }),
        ended: action =>
          this.record('TimelineActionEnded', {
            startFrame: action.startFrame,
          }),
      },
    );
    this.#timeline.reset(this.#context);
    this.#blackboard.restore(this.#program.initialBlackboard);
    this.#passedFrames = 0;
    this.#appliedCost = false;
    this.#attemptedCost = false;
    this.#nonReturnedSpCost = 0;
    this.#state = 'casting';
    this.record('SkillStarted');
    // 原生 `TryCastSkill` 会立即执行一次 `OnTick(0, 0)`。
    this.#tick(0);
    return true;
  }

  advanceFrame(): void {
    if (this.#state !== 'casting') return;
    this.#passedFrames += 1;
    this.#tick(COMBAT_FRAME_INTERVAL);
  }

  end(): void {
    if (this.#state !== 'casting') return;
    this.#timeline?.end(this.#passedFrames, this.#context);
    this.#state = 'ended';
    this.record('SkillEnded');
  }

  interrupt(reason: RuntimeSkillInterruptReason): void {
    if (this.#state !== 'casting') return;
    this.#timeline?.end(this.#passedFrames, this.#context);
    this.#state = 'ended';
    this.record('SkillInterrupted', { reason });
  }

  createSequence(sequence: ResolvedActionSequence): ActionSequence {
    return new ActionSequence(
      sequence.steps.map(step =>
        step.kind === 'conditional'
          ? new RuntimeConditionalStep(step, this)
          : new RuntimeOperationStep(step, this),
      ),
    );
  }

  record(event: string, data?: Readonly<Record<string, boolean | number | string | null>>): void {
    this.#dependencies.receipt.record({
      frame: this.#dependencies.clock.frame,
      time: this.#dependencies.clock.time,
      event,
      sourceId: this.#program.operatorId,
      data: { skillId: this.#program.skillId, ...data },
    });
  }

  #tick(deltaTime: number): void {
    if (
      !this.#attemptedCost &&
      this.#program.costFrame !== undefined &&
      this.#passedFrames >= this.#program.costFrame
    ) {
      this.#attemptedCost = true;
      const payment = this.#dependencies.resources.pay(
        this.#program.operatorId,
        this.#program.costs,
      );
      if (payment.paid) {
        this.#appliedCost = true;
        this.#nonReturnedSpCost = payment.nonReturnedSpCost;
        this.record('SkillCostApplied', {
          nonReturnedSpCost: payment.nonReturnedSpCost,
          remainingSp: this.#dependencies.resources.sp,
          remainingUltimateEnergy: this.#dependencies.resources.getUltimateEnergy(
            this.#program.operatorId,
          ),
        });
      } else {
        this.record('SkillCostRejected');
      }
    }
    this.#timeline?.tick(this.#passedFrames, deltaTime, this.#context);
  }
}
