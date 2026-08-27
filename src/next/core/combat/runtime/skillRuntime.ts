/**
 * 编译后技能程序在一次战斗中的有状态执行实例。
 * 每个放置块独立持有调度游标和黑板；同一技能的冷却由装配层显式共享。
 */
import type { ActionSequence } from '../actions/actionSequence';
import type { CombatExecutionContext } from '../actions/combatStep';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { TimelineActionProcessor } from '../timeline/timelineActionProcessor';
import type {
  CompiledSkillProgram,
  ResolvedActionSequence,
  ResolvedCombatOperationStep,
  ResolvedCombatStep,
} from '../../compiler/combatProgram';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import { COMBAT_FRAME_INTERVAL, COMBAT_FRAMES_PER_SECOND, type CombatClock } from './combatClock';
import type { CombatResources } from './combatResources';
import { ActionBlackboard } from './actionBlackboard';
import type { CombatSkillCastInfo } from './skillCastInfo';
import { SkillCooldown, type SkillCooldownSnapshot } from './skillCooldown';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type { CombatSemanticEvent, CombatSemanticEventRuntime } from './combatSemanticEventRuntime';
import type { DamageFeature, DamageTag } from '../../game-data/operatorDefinition';
import type { BuffFinishReason } from '../buffs/combatBuffs';
import { RuntimeTargetContext } from './runtimeTargetContext';
import type { BuffApplicationHandle } from './buffOperationExecutor';

/** 技能实例从可释放到结束的运行时生命周期状态。 */
export type RuntimeSkillState = 'ready' | 'casting' | 'ended';
/** 当前已闭环、会改变技能结束事实的中断来源。 */
export type RuntimeSkillInterruptReason = 'castNextSkill';

/** Ability 承伤事件进入通用条件执行器前的只读归一化负载。 */
export interface CombatAbilityDamageEvent {
  readonly kind: 'abilityDamage';
  readonly event:
    | 'beforeCalculateDamage'
    | 'beforeOutputDamage'
    | 'beforeTakeDamage'
    | 'takeDamage'
    | 'takeCriticalDamage'
    | 'outputDamage'
    | 'outputCriticalDamage';
  readonly sourceId: string;
  readonly targetId: string;
  readonly damageType?: import('../../game-data/operatorDefinition').DamageType;
  readonly tags: readonly DamageTag[];
  readonly features: readonly DamageFeature[];
}

/** AbilitySystem 即将承受物理异常时的同步事件；来源是施加该异常的实体。 */
export interface CombatAbilityPhysicalInflictionEvent {
  readonly kind: 'abilityPhysicalInfliction';
  readonly event:
    | 'beforeTakePhysicalInfliction'
    | 'beforeOutputPhysicalInfliction'
    | 'afterOutputPhysicalInfliction';
  readonly sourceId: string;
  readonly targetId: string;
  readonly type?: 'airborne' | 'knockDown' | 'fracture' | 'crush';
}

/** AbilitySystem 元素附着前后同步事件；当前木桩模型不会自行产生角色承术事件。 */
export interface CombatAbilitySpellInflictionEvent {
  readonly kind: 'abilitySpellInfliction';
  readonly event:
    | 'beforeTakeSpellInfliction'
    | import('./elementalInflictionOperationExecutor').ElementalInflictionEvent;
  readonly sourceId: string;
  readonly targetId: string;
  /** 角色受术旧事件不一定提供元素；敌人承受元素附着事件始终提供。 */
  readonly element?: import('../../game-data/operatorDefinition').InflictionElement;
}

/** AbilitySystem 即将输出一次元素爆发；爆发来源施法身份由事件上下文单独携带。 */
export interface CombatAbilitySpellBurstEvent {
  readonly kind: 'abilitySpellBurst';
  readonly event: 'beforeOutputSpellBurst';
  readonly sourceId: string;
  readonly targetId: string;
  readonly burstType: string;
}

/** AbilitySystem 的失衡归零同步事件；保留本次失衡来源与目标身份。 */
export interface CombatAbilityPoiseEvent {
  readonly kind: 'abilityPoise';
  readonly event: 'poiseZero';
  readonly sourceId: string;
  readonly targetId: string;
}

/** AbilitySystem 成功治疗事件；actualHealing 为零时仍是有效事件。 */
export interface CombatAbilityHealEvent {
  readonly kind: 'abilityHeal';
  readonly event: 'outputHeal' | 'receiveHeal';
  readonly sourceId: string;
  readonly targetId: string;
  readonly requestedHealing: number;
  readonly actualHealing: number;
  readonly overhealing: number;
  readonly tagIds: readonly number[];
}

/** AbilitySystem 在技能正式启动前发出的施放事件。 */
export interface CombatAbilitySkillEvent {
  readonly kind: 'abilitySkill';
  readonly event: 'beforeCastSkill' | 'afterSkillApplyCost' | 'skillEnd';
  readonly sourceId: string;
  readonly targetId: string;
  readonly skillType: import('../../game-data/operatorDefinition').SkillType;
  readonly skillId: string;
  readonly skillCastId: number;
  /** 当前 CastSkillContext 的技能对象端口；不能用来源施法信息或动作宿主替代。 */
  readonly attachBuffToCurrentSkill?: (buff: BuffApplicationHandle) => void;
}

/** 本场固定战斗在装配完成后向已注册 Buff 发布的一次实体入战事件。 */
export interface CombatAbilityLifecycleEvent {
  readonly kind: 'abilityLifecycle';
  readonly event: 'enterFight' | 'ownerHpZero';
  readonly sourceId: string;
  readonly targetId: string;
}

/** 敌方弱点窗口确认触发后，在攻击者 AbilitySystem 上发布的同步事件。 */
export interface CombatAbilityWeaknessTriggeredEvent {
  readonly kind: 'abilityWeaknessTriggered';
  readonly event: 'afterOutputWeaknessTriggered';
  readonly sourceId: string;
  readonly targetId: string;
}

/** 技能运行时把普通操作和条件判断委托给战斗装配层的端口。 */
export interface CombatOperationContext {
  /** 当前动作环境独占的 direct 黑板；生命周期由技能、Buff 或连携条件宿主管理。 */
  readonly blackboard: ActionBlackboard;
  /** 只有读取或写入原生 Context 目标组的步骤才要求存在。 */
  readonly targetContext?: RuntimeTargetContext;
  /** 连携条件的原生 InputTarget；承受附着事件中它是施加者，不是物理事件 targetId。 */
  readonly actionInputTarget?: RuntimeTargetRef;
  /** 只在 forEachContextTarget 的 body 内存在。 */
  readonly currentTarget?: RuntimeTargetRef;
  /** 执行到当前步骤时的施法信息；扣费前后的未返还技力可能不同。 */
  readonly skillCastInfo?: CombatSkillCastInfo;
  /**
   * 当前同步事件的来源施法；与拥有该响应的 Buff 自身来源施法严格分离。
   * null 明确表示原生事件载荷没有来源；undefined 表示生产端未提供该端口。
   */
  readonly eventSkillCastInfo?: CombatSkillCastInfo | null;
  /** 仅在同步事件响应期间存在；普通技能步骤不得假设它可用。 */
  readonly event?:
    | CombatSemanticEvent
    | CombatAbilityDamageEvent
    | CombatAbilityPhysicalInflictionEvent
    | CombatAbilitySpellInflictionEvent
    | CombatAbilitySpellBurstEvent
    | CombatAbilityPoiseEvent
    | CombatAbilityHealEvent
    | CombatAbilitySkillEvent
    | CombatAbilityLifecycleEvent
    | CombatAbilityWeaknessTriggeredEvent;
  /** 仅由 Buff 实例响应提供；用于保留原生 ActionSource 身份。 */
  readonly buffSourceId?: string;
  /** 仅由 Buff 实例响应提供；用于保留原生 ActionOwner 身份。 */
  readonly buffOwnerId?: string;
  /** 事件动作宿主；武器/装备是装备者，Buff 是当前 Buff owner。 */
  readonly actionOwnerId?: string;
  /** 已证明的动作来源；用于折叠为初始化后不再拥有事件载荷的 Ability 程序。 */
  readonly actionSourceId?: string;
  /** 仅由 Buff 生命周期与事件响应提供；Environment 查询精确指向当前实例。 */
  readonly finishCurrentBuff?: (reason: BuffFinishReason) => boolean;
  /** 只由 GlobalBuff 投影出的子 Buff 提供；不得按 ID 猜测父层。 */
  readonly finishParentGlobalBuff?: (reason: 'early' | 'other') => boolean;
  /** Environment BuffCount 查询读取正在执行的当前 Buff 增强层数。 */
  readonly getCurrentBuffEnhanceCount?: () => number;
  /** Environment SaveBuffLifeTime 读取当前实例的剩余秒数；无限时长返回 null。 */
  readonly getCurrentBuffRemainingDuration?: () => number | null;
  /** SetBuffDurationAction 修改当前有限时长实例。 */
  readonly setCurrentBuffRemainingDuration?: (duration: number) => void;
  /** 把本次创建的 Buff 绑定为当前生命周期 Buff 的子实例。 */
  readonly addCurrentBuffChild?: (child: { finish(reason: 'other'): boolean }) => void;
  /** 动作所有者为 Ability 时绑定到其自身寿命，不能绑定到当前事件的来源技能。 */
  readonly addAbilityChildBuff?: (child: { finish(reason: 'other'): boolean }) => void;
  /** 仅由 Buff 生命周期与事件响应提供；暂停只作用于当前实例。 */
  readonly setCurrentBuffTimePaused?: (paused: boolean) => void;
  /** Buff 黑板写入后重建依赖动态键的属性修正；普通技能上下文不提供。 */
  readonly refreshCurrentBuffAttributeModifiers?: () => void;
  /** 仅由宿主技能/能力实体子技能提供；普通操作不得缓存或跨宿主调用。 */
  readonly requestTimelineJump?: (destinationFrame: number) => void;
  /** 仅由技能时间轴宿主提供；结束当前技能且不改写局部帧。 */
  readonly requestTimelineFinish?: () => void;
  /** 仅由技能时间轴宿主提供；返回原生 StoreCurSkillExecuteFrame 使用的整数局部帧。 */
  readonly getCurrentTimelineFrame?: () => number;
}

export interface CombatOperationExecutor {
  execute(step: ResolvedCombatOperationStep, context?: CombatOperationContext): boolean;
  end?(step: ResolvedCombatOperationStep, context?: CombatOperationContext): void;
  evaluate(
    condition: Extract<ResolvedCombatStep, { kind: 'conditional' }>['parameters']['condition'],
    context?: CombatOperationContext,
  ): boolean;
}

/** Start 恢复局部板及目标组之后、执行第零帧之前；不得用于改写实体初始化。 */
export type AfterSkillCastStart = (context: CombatOperationContext) => void;

interface SkillRuntimeDependencies {
  readonly clock: CombatClock;
  readonly resources: CombatResources;
  /** 原生费用属性在开始门禁和实际扣费时分别重新求值。 */
  readonly resolveCosts?: (
    costs: readonly CompiledSkillProgram['costs'][number][],
  ) => readonly CompiledSkillProgram['costs'][number][];
  readonly receipt: CombatReceiptSink;
  readonly operations: CombatOperationExecutor;
  readonly allocateSkillCastId: () => number;
  readonly semanticEvents?: CombatSemanticEventRuntime;
  /** 干员实体级黑板由同一能力系统下的所有技能共享，技能 direct blackboard 仅回退读取它。 */
  readonly entityBlackboard?: ActionBlackboard;
  /** 同一干员同一技能的多个时间轴块共用冷却账本。 */
  readonly cooldown?: SkillCooldown;
  /** 共享账本只能由一个运行实例逐帧推进。 */
  readonly advancesCooldown?: boolean;
  /** 原生 CastEnd 清理完成后向所有者 AbilitySystem 同步发布 OnSkillEnd。 */
  readonly emitSkillEnd?: (payload: CombatAbilitySkillEvent) => void;
  /** 原生费用实际应用成功后、同帧时间轴动作前同步发布 OnAfterSkillApplyCost。 */
  readonly emitAfterSkillApplyCost?: (payload: CombatAbilitySkillEvent) => void;
}

/** 一次编译后技能的有状态实例；创建后只用于一场战斗。 */
export class SkillRuntime {
  readonly #program: CompiledSkillProgram;
  readonly #dependencies: SkillRuntimeDependencies;
  readonly #context: CombatExecutionContext = {};
  readonly #blackboard: ActionBlackboard;
  readonly #targetContext = new RuntimeTargetContext();
  readonly #operationContext: CombatOperationContext;
  readonly #sequenceRuntime: CombatActionSequenceRuntime;
  readonly #cooldown: SkillCooldown;
  readonly #advancesCooldown: boolean;
  #timeline: TimelineActionProcessor | null = null;
  #state: RuntimeSkillState = 'ready';
  #passedFrames = 0;
  #appliedCost = false;
  #attemptedCost = false;
  #nonReturnedSpCost = 0;
  #skillCastId = 0;
  #preparedSkillCastId = 0;
  readonly #attachedBuffs = new Set<BuffApplicationHandle>();
  #preparedStartBlackboard: Readonly<Record<string, number>> = {};
  #afterCastStart: AfterSkillCastStart | undefined;

  constructor(program: CompiledSkillProgram, dependencies: SkillRuntimeDependencies) {
    this.#program = program;
    this.#dependencies = dependencies;
    this.#blackboard = new ActionBlackboard(undefined, dependencies.entityBlackboard);
    this.#cooldown =
      dependencies.cooldown ?? new SkillCooldown(program.cooldownFrames, program.costFrame);
    this.#advancesCooldown = dependencies.advancesCooldown ?? true;
    const runtime = this;
    this.#operationContext = {
      blackboard: this.#blackboard,
      targetContext: this.#targetContext,
      requestTimelineJump: destinationFrame => this.#requestTimelineJump(destinationFrame),
      requestTimelineFinish: () => this.#requestTimelineFinish(),
      getCurrentTimelineFrame: () => roundToEven(this.#passedFrames),
      get skillCastInfo() {
        return runtime.skillCastInfo;
      },
    };
    this.#sequenceRuntime = new CombatActionSequenceRuntime(
      dependencies.operations,
      this.#operationContext,
      {
        stepReached: step => this.record('CombatStepReached', { kind: step.kind }),
        conditionEvaluated: (condition, passed) =>
          this.record('CombatConditionEvaluated', { kind: condition.kind, passed }),
      },
      dependencies.semanticEvents,
      program.operatorId,
    );
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

  get timelineBlockFrames(): number {
    return this.#program.timelineBlockFrames;
  }

  get passedFrames(): number {
    return this.#passedFrames;
  }

  get currentTimelineFrame(): number {
    return roundToEven(this.#passedFrames);
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
      originSkillType: this.#program.skillType,
      ...(this.#program.castId === undefined ? {} : { originCastId: this.#program.castId }),
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

  prepareStartBlackboard(values: Readonly<Record<string, number>>): void {
    if (this.#state === 'casting') {
      throw new Error(`skill '${this.#program.skillId}' is already casting`);
    }
    this.#preparedStartBlackboard = Object.freeze({ ...values });
  }

  prepareAfterCastStart(callback: AfterSkillCastStart): void {
    if (!this.canStart()) throw new Error(`skill '${this.skillId}' is already casting`);
    this.#afterCastStart = callback;
  }

  prepareSkillCastId(skillCastId: number): void {
    if (this.#state === 'casting') {
      throw new Error(`skill '${this.#program.skillId}' is already casting`);
    }
    if (!Number.isSafeInteger(skillCastId) || skillCastId <= 0) {
      throw new RangeError('prepared skill cast id must be a positive safe integer');
    }
    this.#preparedSkillCastId = skillCastId;
  }

  attachBuffToCast(skillCastId: number, buff: BuffApplicationHandle): void {
    const currentCastId = this.#preparedSkillCastId || this.#skillCastId;
    if (skillCastId <= 0 || skillCastId !== currentCastId) {
      throw new Error('cannot attach a Buff using a stale skill cast context');
    }
    // 原生 Skill.AttachBuff 按实例去重，并保留首次附着顺序。
    this.#attachedBuffs.add(buff);
  }

  tryStart(): boolean {
    if (this.#state === 'casting') throw new Error(`skill '${this.#program.skillId}' is casting`);
    const cooldownReserved = this.#cooldown.tryReserve();
    if (this.#cooldown.snapshot.configured) {
      this.record(cooldownReserved ? 'SkillCooldownReserved' : 'SkillCooldownUnavailableAtStart', {
        remainingFrames: this.#cooldown.snapshot.remainingFrames,
      });
    }
    if (!this.#dependencies.resources.canPay(this.#program.operatorId, this.#resolvedCosts())) {
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
    this.#targetContext.clear();
    this.#blackboard.assign(this.#preparedStartBlackboard);
    this.#preparedStartBlackboard = {};
    this.#sequenceRuntime.reset();
    this.#passedFrames = 0;
    this.#appliedCost = false;
    this.#attemptedCost = false;
    this.#nonReturnedSpCost = 0;
    this.#skillCastId =
      this.#preparedSkillCastId === 0
        ? this.#dependencies.allocateSkillCastId()
        : this.#preparedSkillCastId;
    this.#preparedSkillCastId = 0;
    if (!Number.isSafeInteger(this.#skillCastId) || this.#skillCastId <= 0) {
      throw new RangeError('allocated skill cast id must be a positive safe integer');
    }
    this.#state = 'casting';
    this.record('SkillStarted');
    const afterCastStart = this.#afterCastStart;
    this.#afterCastStart = undefined;
    afterCastStart?.(this.#operationContext);
    // 原生 `TryCastSkill` 会立即执行一次 `OnTick(0, 0)`。
    this.#tick(0);
    return true;
  }

  advanceFrame(): void {
    this.advance(COMBAT_FRAME_INTERVAL, COMBAT_FRAME_INTERVAL);
  }

  /** 技能时间线和冷却使用不同原生时钟；输入单位均为秒。 */
  advance(timelineDeltaSeconds: number, cooldownDeltaSeconds: number): void {
    if (
      !Number.isFinite(timelineDeltaSeconds) ||
      timelineDeltaSeconds < 0 ||
      !Number.isFinite(cooldownDeltaSeconds) ||
      cooldownDeltaSeconds < 0
    ) {
      throw new RangeError('skill deltas must be non-negative finite numbers');
    }
    if (
      this.#advancesCooldown &&
      this.#cooldown.advance(cooldownDeltaSeconds * COMBAT_FRAMES_PER_SECOND)
    ) {
      this.record('SkillCooldownReady');
    }
    if (this.#state !== 'casting') return;
    this.#passedFrames += timelineDeltaSeconds * COMBAT_FRAMES_PER_SECOND;
    this.#tick(timelineDeltaSeconds);
    // 时间轴动作全部执行完毕后技能自然结束，允许同技能再次释放。
    if (this.#timeline?.isComplete === true) this.end();
  }

  end(): void {
    if (this.#state !== 'casting') return;
    this.#timeline?.end(this.#passedFrames, this.#context);
    this.#finishAttachedBuffs();
    if (this.#cooldown.finishCast()) this.record('SkillCooldownRefunded');
    this.#state = 'ended';
    this.record('SkillEnded');
    this.#emitSkillEnd();
  }

  interrupt(reason: RuntimeSkillInterruptReason): void {
    if (this.#state !== 'casting') return;
    this.#timeline?.end(this.#passedFrames, this.#context);
    this.#finishAttachedBuffs();
    if (this.#cooldown.finishCast()) this.record('SkillCooldownRefunded');
    this.#state = 'ended';
    this.record('SkillInterrupted', { reason });
    this.#emitSkillEnd();
  }

  createSequence(sequence: ResolvedActionSequence): ActionSequence {
    return this.#sequenceRuntime.createSequence(sequence);
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
    return this.#sequenceRuntime.tryExecuteOnce(scopeKey, body, context);
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
        this.#resolvedCosts(),
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
        this.#dependencies.emitAfterSkillApplyCost?.(
          this.#skillEventPayload('afterSkillApplyCost'),
        );
      } else {
        this.record('SkillCostRejected');
      }
    }
    this.#timeline?.tick(this.#passedFrames, deltaTime, this.#context);
  }

  #resolvedCosts(): readonly CompiledSkillProgram['costs'][number][] {
    return this.#dependencies.resolveCosts?.(this.#program.costs) ?? this.#program.costs;
  }

  #requestTimelineJump(destinationFrame: number): void {
    const timeline = this.#timeline;
    if (timeline === null || this.#state !== 'casting') {
      throw new Error(`skill '${this.#program.skillId}' cannot jump outside an active cast`);
    }
    timeline.jumpTo(destinationFrame, this.#passedFrames, this.#context);
    this.#passedFrames = destinationFrame;
    this.record('SkillTimelineJumped', { destinationFrame });
  }

  #requestTimelineFinish(): void {
    const timeline = this.#timeline;
    if (timeline === null || this.#state !== 'casting') {
      throw new Error(`skill '${this.#program.skillId}' cannot finish outside an active cast`);
    }
    timeline.finish(this.#passedFrames, this.#context);
    this.record('SkillTimelineFinished');
  }

  #emitSkillEnd(): void {
    this.#dependencies.emitSkillEnd?.(this.#skillEventPayload('skillEnd'));
  }

  #finishAttachedBuffs(): void {
    // CastEnd 在 OnSkillEnd 之前正序 MarkFinish(Other)，不传入结束来源/施法信息。
    for (const buff of [...this.#attachedBuffs]) buff.finish('other');
    this.#attachedBuffs.clear();
  }

  #skillEventPayload(event: CombatAbilitySkillEvent['event']): CombatAbilitySkillEvent {
    return {
      kind: 'abilitySkill',
      event,
      sourceId: this.#program.operatorId,
      targetId: this.#program.operatorId,
      skillType: this.#program.skillType,
      skillId: this.#program.sourceSkillId ?? this.#program.skillId,
      skillCastId: this.#skillCastId,
    };
  }
}

function roundToEven(value: number): number {
  const lower = Math.floor(value);
  const fraction = value - lower;
  if (fraction < 0.5) return lower;
  if (fraction > 0.5) return lower + 1;
  return lower % 2 === 0 ? lower : lower + 1;
}
