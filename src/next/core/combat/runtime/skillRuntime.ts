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
import type { CombatSkillCastInfo } from './skillCastInfo';
import { SkillCooldown, type SkillCooldownSnapshot } from './skillCooldown';

/** 技能实例从可释放到结束的运行时生命周期状态。 */
export type RuntimeSkillState = 'ready' | 'casting' | 'ended';
/** 当前已闭环、会改变技能结束事实的中断来源。 */
export type RuntimeSkillInterruptReason = 'castNextSkill';

/** 技能运行时把普通操作和条件判断委托给战斗装配层的端口。 */
export interface CombatOperationContext {
  /** 一次技能运行实例独占的动作黑板；步骤不得把它缓存到实例生命周期之外。 */
  readonly blackboard: ActionBlackboard;
  /** 执行到当前步骤时的施法信息；扣费前后的未返还技力可能不同。 */
  readonly skillCastInfo?: CombatSkillCastInfo;
}

export interface CombatOperationExecutor {
  execute(
    step: Exclude<ResolvedCombatStep, { kind: 'conditional' | 'once' }>,
    context?: CombatOperationContext,
  ): boolean;
  end?(
    step: Exclude<ResolvedCombatStep, { kind: 'conditional' | 'once' }>,
    context?: CombatOperationContext,
  ): void;
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
  readonly allocateSkillCastId: () => number;
  /** 干员实体级黑板由同一能力系统下的所有技能共享，技能 direct blackboard 仅回退读取它。 */
  readonly entityBlackboard?: ActionBlackboard;
}

class RuntimeOperationStep extends CombatStep {
  constructor(
    readonly step: Exclude<ResolvedCombatStep, { kind: 'conditional' | 'once' }>,
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

  override end(): void {
    this.runtime.operations.end?.(this.step, this.runtime.operationContext);
  }
}

class RuntimeOnceStep extends CombatStep {
  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'once' }>,
    readonly runtime: SkillRuntime,
  ) {
    super();
  }

  execute(context: CombatExecutionContext): void {
    this.tryExecute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    return this.runtime.tryExecuteOnce(this.step.parameters.scopeKey, this.step.body, context);
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
  readonly #blackboard: ActionBlackboard;
  readonly #operationContext: CombatOperationContext;
  readonly #cooldown: SkillCooldown;
  #timeline: TimelineActionProcessor | null = null;
  #state: RuntimeSkillState = 'ready';
  #passedFrames = 0;
  #appliedCost = false;
  #attemptedCost = false;
  #nonReturnedSpCost = 0;
  #skillCastId = 0;
  readonly #executedOnceScopes = new Set<string>();

  constructor(program: CompiledSkillProgram, dependencies: SkillRuntimeDependencies) {
    this.#program = program;
    this.#dependencies = dependencies;
    this.#blackboard = new ActionBlackboard(undefined, dependencies.entityBlackboard);
    this.#cooldown = new SkillCooldown(program.cooldownFrames, program.costFrame);
    const runtime = this;
    this.#operationContext = {
      blackboard: this.#blackboard,
      get skillCastInfo() {
        return runtime.skillCastInfo;
      },
    };
  }

  get state(): RuntimeSkillState {
    return this.#state;
  }

  get skillId(): string {
    return this.#program.skillId;
  }

  /** 文档中的技能释放身份；单元测试程序可能缺失。 */
  get castId(): string | undefined {
    return this.#program.castId;
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

  get cooldown(): SkillCooldownSnapshot {
    return this.#cooldown.snapshot;
  }

  get skillCastInfo(): CombatSkillCastInfo {
    if (this.#skillCastId === 0)
      throw new Error(`skill '${this.#program.skillId}' has not started`);
    return {
      skillCastId: this.#skillCastId,
      originSkillId: this.#program.skillId,
      nonReturnedSpCost: this.#nonReturnedSpCost,
    };
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
    const cooldownReserved = this.#cooldown.tryReserve();
    if (this.#cooldown.snapshot.configured) {
      this.record(cooldownReserved ? 'SkillCooldownReserved' : 'SkillCooldownUnavailableAtStart', {
        remainingFrames: this.#cooldown.snapshot.remainingFrames,
      });
    }
    if (!this.#dependencies.resources.canPay(this.#program.operatorId, this.#program.costs)) {
      this.record('SkillCostUnavailableAtStart');
    }

    this.#timeline = new TimelineActionProcessor(
      this.#program.timelineActions.map(action => ({
        startFrame: action.startFrame,
        ...(action.endFrame === undefined ? {} : { endFrame: action.endFrame }),
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
    this.#executedOnceScopes.clear();
    this.#passedFrames = 0;
    this.#appliedCost = false;
    this.#attemptedCost = false;
    this.#nonReturnedSpCost = 0;
    this.#skillCastId = this.#dependencies.allocateSkillCastId();
    if (!Number.isSafeInteger(this.#skillCastId) || this.#skillCastId <= 0) {
      throw new RangeError('allocated skill cast id must be a positive safe integer');
    }
    this.#state = 'casting';
    this.record('SkillStarted');
    // 原生 `TryCastSkill` 会立即执行一次 `OnTick(0, 0)`。
    this.#tick(0);
    return true;
  }

  advanceFrame(): void {
    if (this.#cooldown.advanceFrame()) this.record('SkillCooldownReady');
    if (this.#state !== 'casting') return;
    this.#passedFrames += 1;
    this.#tick(COMBAT_FRAME_INTERVAL);
    // 时间轴动作全部执行完毕后技能自然结束，允许同技能再次释放。
    if (this.#timeline?.isComplete === true) this.end();
  }

  end(): void {
    if (this.#state !== 'casting') return;
    this.#timeline?.end(this.#passedFrames, this.#context);
    if (this.#cooldown.finishCast()) this.record('SkillCooldownRefunded');
    this.#state = 'ended';
    this.record('SkillEnded');
  }

  interrupt(reason: RuntimeSkillInterruptReason): void {
    if (this.#state !== 'casting') return;
    this.#timeline?.end(this.#passedFrames, this.#context);
    if (this.#cooldown.finishCast()) this.record('SkillCooldownRefunded');
    this.#state = 'ended';
    this.record('SkillInterrupted', { reason });
  }

  createSequence(sequence: ResolvedActionSequence): ActionSequence {
    return new ActionSequence(
      sequence.steps.map(step => {
        if (step.kind === 'conditional') return new RuntimeConditionalStep(step, this);
        if (step.kind === 'once') return new RuntimeOnceStep(step, this);
        return new RuntimeOperationStep(step, this);
      }),
    );
  }

  /**
   * 复现原生 DoOnceAction：内部序列无论返回真假，当前释放实例后续都不再重复执行。
   * 作用域在下一次 tryStart 时统一清空，不能放进跨释放共享的实体黑板。
   */
  tryExecuteOnce(
    scopeKey: string,
    body: ResolvedActionSequence,
    context: CombatExecutionContext,
  ): boolean {
    if (this.#executedOnceScopes.has(scopeKey)) return true;
    this.createSequence(body).executeInstant(context);
    this.#executedOnceScopes.add(scopeKey);
    return true;
  }

  record(
    event: string,
    data?: Readonly<Record<string, boolean | number | string | null>>,
    targetId?: string,
  ): void {
    this.#dependencies.receipt.record({
      frame: this.#dependencies.clock.frame,
      time: this.#dependencies.clock.time,
      event,
      sourceId: this.#program.operatorId,
      ...(targetId === undefined ? {} : { targetId }),
      data: {
        skillId: this.#program.skillId,
        ...(this.#program.castId === undefined ? {} : { castId: this.#program.castId }),
        ...data,
      },
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
        for (const change of payment.changes) {
          if (change.resource === 'sp') {
            this.record('SpChanged', {
              recipient: 'team',
              baseValue: change.baseValue,
              requestedValue: change.requestedValue,
              actualValue: change.actualValue,
              previousValue: change.previousValue,
              currentValue: change.currentValue,
            });
          } else {
            this.record(
              'UltimateEnergyChanged',
              {
                recipient: 'operator',
                baseValue: change.baseValue,
                requestedValue: change.requestedValue,
                applied: change.applied,
                actualValue: change.actualValue,
                previousValue: change.previousValue,
                currentValue: change.currentValue,
              },
              change.operatorId,
            );
          }
        }
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
