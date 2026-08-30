/**
 * 把编译后的同步动作序列绑定到操作执行器和动作黑板。
 * 技能、Buff 等状态所有者应各自持有实例，避免共享 once 作用域或运行时黑板。
 */
import { ActionSequence } from '../actions/actionSequence';
import { CombatStep, type CombatExecutionContext } from '../actions/combatStep';
import type {
  ResolvedActionSequence,
  ResolvedCombatOperationStep,
  ResolvedCombatStep,
} from '../../compiler/combatProgram';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type {
  CombatSemanticEventContext,
  CombatSemanticEventRuntime,
} from './combatSemanticEventRuntime';
import { ActionBlackboard, resolveActionValueOperand } from './actionBlackboard';
import { RuntimeTargetContext } from './runtimeTargetContext';

export interface CombatActionSequenceRuntimeHooks {
  readonly stepReached?: (step: ResolvedCombatStep) => void;
  readonly conditionEvaluated?: (
    condition: Extract<ResolvedCombatStep, { kind: 'conditional' }>['parameters']['condition'],
    passed: boolean,
  ) => void;
}

class OperationStep extends CombatStep {
  constructor(
    readonly step: ResolvedCombatOperationStep,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(): void {
    this.tryExecute();
  }

  override tryExecute(): boolean {
    this.runtime.hooks.stepReached?.(this.step);
    return this.runtime.operations.execute(this.step, this.operationContext);
  }

  override end(): void {
    this.runtime.operations.end?.(this.step, this.operationContext);
  }

  override reset(): void {
    this.runtime.operations.prepare?.(this.step, this.operationContext);
  }
}

class OnceStep extends CombatStep {
  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'once' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(context: CombatExecutionContext): void {
    this.tryExecute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    return this.runtime.tryExecuteOnce(
      this.step.parameters.scopeKey,
      this.step.body,
      context,
      this.operationContext,
    );
  }
}

class ActionBlackboardScopeStep extends CombatStep {
  #body?: ActionSequence;

  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'withActionBlackboardScope' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(context: CombatExecutionContext): void {
    this.#beginExecution();
    this.#getBody().execute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    this.#beginExecution();
    const result = this.#getBody().tryExecute(context);
    return this.step.parameters.alwaysNext === true || result;
  }

  override tick(deltaTime: number, context: CombatExecutionContext): void {
    this.#getBody().tick(deltaTime, context);
  }

  override end(context: CombatExecutionContext): void {
    this.#body?.end(context);
  }

  override reset(context: CombatExecutionContext): void {
    this.#body?.reset(context);
    this.#body = undefined;
  }

  #beginExecution(): void {
    if (this.step.parameters.lifetime === 'execution') this.#body = undefined;
  }

  #getBody(): ActionSequence {
    if (this.#body !== undefined) return this.#body;
    const blackboard = this.runtime.getActionBlackboardScope(
      this.step,
      this.operationContext.blackboard,
    );
    this.#body = this.runtime.createSequence(this.step.body, {
      ...this.operationContext,
      blackboard,
    });
    // 该层级按执行惰性创建，外层 reset 时它尚不存在；创建后必须立即准备内部
    // OperationStep，否则 takeAttackSnapshot 等原生 Reset 阶段状态会在首次命中时缺失。
    this.#body.reset({});
    return this.#body;
  }
}

class RepeatEachTickStep extends CombatStep {
  #skipInitialTick = false;
  #timerSeconds = 0;
  #scanCount = 0;
  #targetTriggerCount = 0;
  #lastTargetTriggerSeconds = 0;

  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'repeatEachTick' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(context: CombatExecutionContext): void {
    this.#skipInitialTick = true;
    this.#timerSeconds = 0;
    this.#scanCount = 0;
    this.#targetTriggerCount = 0;
    this.#lastTargetTriggerSeconds = 0;
    this.#scan(context);
  }

  override tick(deltaTime: number, context: CombatExecutionContext): void {
    if (this.#skipInitialTick) {
      this.#skipInitialTick = false;
      return;
    }
    const tickInterval = this.step.parameters.nativeTickInterval;
    if (tickInterval !== undefined) {
      this.#timerSeconds = Math.fround(this.#timerSeconds + Math.fround(deltaTime));
      const executeEachFrame =
        tickInterval.executeEachFrame ||
        Math.fround(tickInterval.intervalSeconds) < Math.fround(0.0329900011);
      if (
        executeEachFrame ||
        this.#timerSeconds >= Math.fround(this.#scanCount * tickInterval.intervalSeconds)
      ) {
        this.#scan(context);
      }
      return;
    }
    const channeling = this.step.parameters.nativeChanneling;
    if (channeling === undefined) {
      this.#executeBody(context);
      return;
    }
    this.#timerSeconds = Math.fround(this.#timerSeconds + Math.fround(deltaTime));
    if (
      channeling.executeEachFrame ||
      this.#timerSeconds >= Math.fround(this.#scanCount * channeling.triggerIntervalSeconds)
    ) {
      this.#scan(context);
    }
  }

  override reset(): void {
    this.#skipInitialTick = false;
    this.#timerSeconds = 0;
    this.#scanCount = 0;
    this.#targetTriggerCount = 0;
    this.#lastTargetTriggerSeconds = 0;
  }

  #scan(context: CombatExecutionContext): void {
    if (this.step.parameters.nativeTickInterval !== undefined) {
      this.#scanCount += 1;
      this.#executeBody(context);
      return;
    }
    const channeling = this.step.parameters.nativeChanneling;
    if (channeling === undefined) {
      this.#executeBody(context);
      return;
    }
    this.#scanCount += 1;
    if (
      channeling.maxCountPerTarget >= 0 &&
      this.#targetTriggerCount >= channeling.maxCountPerTarget
    )
      return;
    if (
      this.#targetTriggerCount > 0 &&
      !(
        Math.fround(this.#timerSeconds - this.#lastTargetTriggerSeconds) >
        channeling.targetTriggerIntervalSeconds
      )
    )
      return;
    this.#executeBody(context);
    this.#targetTriggerCount += 1;
    this.#lastTargetTriggerSeconds = this.#timerSeconds;
  }

  #executeBody(context: CombatExecutionContext): void {
    const sequence = this.runtime.createSequence(this.step.body, this.operationContext);
    sequence.reset(context);
    const result = sequence.executeInstant(context);
    if (
      !result &&
      this.step.parameters.nativeTickInterval === undefined &&
      this.step.parameters.nativeChanneling === undefined
    ) {
      throw new Error('repeatEachTick body returned false; repeated short-circuit is not modeled');
    }
  }
}

class ForEachContextTargetStep extends CombatStep {
  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'forEachContextTarget' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(context: CombatExecutionContext): void {
    this.tryExecute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    const parameters = this.step.parameters;
    const targets =
      parameters.target === 'enemy'
        ? ([{ kind: 'enemy' }] as const)
        : parameters.target === 'caster'
          ? ([{ kind: 'operator', operatorId: this.#ownerOperatorId() }] as const)
          : this.#contextTargets(parameters.contextKey!);
    for (const currentTarget of targets) {
      // Native ForEachAction ignores ExecuteInstant's result for each item.
      // A failed guard stops only this item's sequence, never the following targets.
      const sequence = this.runtime.createSequence(this.step.body, {
        ...this.operationContext,
        currentTarget,
      });
      sequence.reset(context);
      sequence.executeInstant(context);
    }
    return true;
  }

  #contextTargets(contextKey: string) {
    const targetContext = this.operationContext.targetContext;
    if (targetContext === undefined) {
      throw new Error('forEachContextTarget requires a combat target context');
    }
    return targetContext.get(contextKey);
  }

  #ownerOperatorId(): string {
    const operatorId = this.runtime.ownerOperatorId;
    if (operatorId === undefined) {
      throw new Error('caster forEach target requires an owner operator');
    }
    return operatorId;
  }
}

class RepeatByActionValueStep extends CombatStep {
  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'repeatByActionValue' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(context: CombatExecutionContext): void {
    this.tryExecute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    const count = resolveActionValueOperand(
      this.step.parameters.count,
      this.operationContext.blackboard,
    );
    if (!Number.isInteger(count) || count < 0) {
      throw new RangeError('repeatByActionValue count must be a non-negative integer');
    }
    for (let index = 0; index < count; index += 1) {
      // 每次重新构建步骤实例，确保 execution-lifetime 子黑板不在不同投射物间共享。
      const sequence = this.runtime.createSequence(this.step.body, this.operationContext);
      sequence.reset(context);
      sequence.executeInstant(context);
    }
    return true;
  }
}

class ProjectileFinishCallbackStep extends CombatStep {
  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'scheduleProjectileFinishCallback' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(): void {
    this.tryExecute();
  }

  override tryExecute(): boolean {
    const schedule = this.operationContext.scheduleProjectileFinishCallback;
    if (schedule === undefined) {
      throw new Error('projectile finish callback requires a detached runtime scheduler');
    }
    const parent = this.operationContext;
    const detachedContext: CombatOperationContext = {
      blackboard: parent.blackboard.detachedSnapshot(),
      damageCalculationSnapshots: new Map(),
      targetContext: new RuntimeTargetContext(),
      ...(parent.skillCastInfo === undefined
        ? {}
        : { skillCastInfo: Object.freeze({ ...parent.skillCastInfo }) }),
      ...(parent.actionOwnerId === undefined ? {} : { actionOwnerId: parent.actionOwnerId }),
      ...(parent.actionSourceId === undefined ? {} : { actionSourceId: parent.actionSourceId }),
      scheduleProjectileFinishCallback: schedule,
    };
    const body = this.step.body;
    const operations = this.runtime.operations;
    const semanticEvents = this.runtime.semanticEvents;
    const ownerOperatorId = this.runtime.ownerOperatorId;
    schedule(this.step.parameters.delaySeconds, () => {
      const detached = new CombatActionSequenceRuntime(
        operations,
        detachedContext,
        this.runtime.hooks,
        semanticEvents,
        ownerOperatorId,
      );
      const sequence = detached.createSequence(body);
      sequence.reset({});
      sequence.executeInstant({});
    });
    return true;
  }
}

/** 原生 Switch 的持久分支实例；选择、生命周期和浮点匹配不能复用普通 conditional。 */
class SwitchStep extends CombatStep {
  readonly #branches: readonly ActionSequence[];
  #activeBranch?: ActionSequence;

  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'switch' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
    this.#branches = step.options.map(option =>
      runtime.createSequence(option.sequence, operationContext),
    );
  }

  execute(context: CombatExecutionContext): void {
    this.tryExecute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    this.#activeBranch = undefined;
    const choice = Math.fround(
      resolveActionValueOperand(this.step.parameters.choice, this.operationContext.blackboard),
    );
    for (const [index, option] of this.step.options.entries()) {
      const value = Math.fround(
        resolveActionValueOperand(option.value, this.operationContext.blackboard),
      );
      // 减法本身也收窄；NaN 的比较为 false，不得写成“大于容差则跳过”。
      if (!(Math.abs(Math.fround(value - choice)) <= Math.fround(1e-5))) continue;
      this.#activeBranch = this.#branches[index]!;
      const result = this.#activeBranch.tryExecute(context);
      return this.step.parameters.alwaysNext || result;
    }
    return this.step.parameters.alwaysNext;
  }

  override tick(deltaTime: number, context: CombatExecutionContext): void {
    this.#activeBranch?.tick(deltaTime, context);
  }
  override end(context: CombatExecutionContext): void {
    this.#activeBranch?.end(context);
  }
  override reset(context: CombatExecutionContext): void {
    for (const branch of this.#branches) branch.reset(context);
  }
}

class ConditionalStep extends CombatStep {
  readonly #whenTrue: ActionSequence;
  readonly #whenFalse?: ActionSequence;
  #activeBranch?: ActionSequence;
  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'conditional' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
    this.#whenTrue = runtime.createSequence(step.whenTrue, operationContext);
    this.#whenFalse =
      step.whenFalse === undefined
        ? undefined
        : runtime.createSequence(step.whenFalse, operationContext);
  }

  execute(context: CombatExecutionContext): void {
    this.tryExecute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    const condition = this.step.parameters.condition;
    const passed = this.runtime.operations.evaluate(condition, this.operationContext);
    this.runtime.hooks.conditionEvaluated?.(condition, passed);
    this.#activeBranch = passed ? this.#whenTrue : this.#whenFalse;
    const result =
      this.#activeBranch === undefined ? passed : this.#activeBranch.tryExecute(context);
    return this.step.parameters.alwaysNext === true || result;
  }

  override tick(deltaTime: number, context: CombatExecutionContext): void {
    this.#activeBranch?.tick(deltaTime, context);
  }

  override end(context: CombatExecutionContext): void {
    this.#activeBranch?.end(context);
  }

  override reset(context: CombatExecutionContext): void {
    // combat-spec IfElseAction.Reset：两支都重置，保证未选分支的攻击快照也在准备阶段建立。
    this.#whenTrue.reset(context);
    this.#whenFalse?.reset(context);
    this.#activeBranch = undefined;
  }
}

class TimelineJumpStep extends CombatStep {
  #jumped = false;
  #skipInitialTick = false;

  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'jumpTimeline' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(): void {
    this.runtime.hooks.stepReached?.(this.step);
    this.#skipInitialTick = true;
    this.#tryJump();
  }

  override tick(): void {
    if (this.#skipInitialTick) {
      this.#skipInitialTick = false;
      return;
    }
    this.#tryJump();
  }

  override reset(): void {
    this.#jumped = false;
    this.#skipInitialTick = false;
  }

  #tryJump(): void {
    if (this.#jumped) return;
    const condition = this.step.parameters.condition;
    if (condition !== undefined) {
      const passed = this.runtime.operations.evaluate(condition, this.operationContext);
      this.runtime.hooks.conditionEvaluated?.(condition, passed);
      if (!passed) return;
    }
    const request = this.operationContext.requestTimelineJump;
    if (request === undefined) throw new Error('jumpTimeline requires a timeline host');
    this.#jumped = true;
    request(this.step.parameters.destinationFrame);
  }
}

class TimelineFinishStep extends CombatStep {
  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'finishTimeline' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(): void {
    this.runtime.hooks.stepReached?.(this.step);
    const request = this.operationContext.requestTimelineFinish;
    if (request === undefined) throw new Error('finishTimeline requires a timeline host');
    request();
  }
}

class CombatEventListenerStep extends CombatStep {
  readonly #registrations: AbilityEventRegistration[] = [];

  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'listenForCombatEvents' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(): void {
    if (this.#registrations.length > 0) return;
    const semanticEvents = this.runtime.semanticEvents;
    const ownerOperatorId = this.runtime.ownerOperatorId;
    if (semanticEvents === undefined || ownerOperatorId === undefined) {
      throw new Error('combat event listener requires a semantic event runtime and owner');
    }
    for (const response of this.step.parameters.responses) {
      const registration = {
        ownerOperatorId,
        trigger: response.event,
        ...(response.condition === undefined ? {} : { condition: response.condition }),
        createOperations: () => this.runtime.operations,
        createOperationContext: (eventContext: CombatSemanticEventContext) => ({
          ...this.operationContext,
          event: eventContext.event,
        }),
        handle: (eventContext: CombatSemanticEventContext) => {
          const sequence = this.runtime.createSequence(response.sequence, {
            ...this.runtime.context,
            event: eventContext.event,
          });
          sequence.reset({});
          sequence.executeInstant({});
        },
      };
      this.#registrations.push(
        semanticEvents.register(
          response.phase === 'dataAction'
            ? { ...registration, phase: 'dataAction', priority: response.priority }
            : { ...registration, phase: 'skill' },
        ),
      );
    }
  }

  override end(): void {
    this.#dispose();
  }

  override reset(): void {
    this.#dispose();
  }

  #dispose(): void {
    for (const registration of this.#registrations) registration.dispose();
    this.#registrations.length = 0;
  }
}

/** 一个状态所有者范围内的同步动作序列运行环境。 */
export class CombatActionSequenceRuntime {
  readonly #executedOnceScopes = new Set<string>();
  // 相同子技能 ID/静态路径在不同投射物中不能复用同一块 direct/entity 板。
  #actionBlackboardScopes = new WeakMap<ActionBlackboard, Map<string, ActionBlackboard>>();

  constructor(
    readonly operations: CombatOperationExecutor,
    readonly context: CombatOperationContext,
    readonly hooks: CombatActionSequenceRuntimeHooks = {},
    readonly semanticEvents?: CombatSemanticEventRuntime,
    readonly ownerOperatorId?: string,
  ) {}

  createSequence(
    sequence: ResolvedActionSequence,
    operationContext: CombatOperationContext = this.context,
  ): ActionSequence {
    return new ActionSequence(
      sequence.steps.map(step => {
        if (step.kind === 'conditional') return new ConditionalStep(step, this, operationContext);
        if (step.kind === 'switch') return new SwitchStep(step, this, operationContext);
        if (step.kind === 'jumpTimeline') {
          return new TimelineJumpStep(step, this, operationContext);
        }
        if (step.kind === 'finishTimeline') {
          return new TimelineFinishStep(step, this, operationContext);
        }
        if (step.kind === 'once') return new OnceStep(step, this, operationContext);
        if (step.kind === 'withActionBlackboardScope') {
          return new ActionBlackboardScopeStep(step, this, operationContext);
        }
        if (step.kind === 'repeatEachTick') {
          return new RepeatEachTickStep(step, this, operationContext);
        }
        if (step.kind === 'repeatByActionValue') {
          return new RepeatByActionValueStep(step, this, operationContext);
        }
        if (step.kind === 'scheduleProjectileFinishCallback') {
          return new ProjectileFinishCallbackStep(step, this, operationContext);
        }
        if (step.kind === 'forEachContextTarget') {
          return new ForEachContextTargetStep(step, this, operationContext);
        }
        if (step.kind === 'listenForCombatEvents') {
          return new CombatEventListenerStep(step, this, operationContext);
        }
        return new OperationStep(step, this, operationContext);
      }),
    );
  }

  reset(): void {
    this.#executedOnceScopes.clear();
    this.#actionBlackboardScopes = new WeakMap();
  }

  getActionBlackboardScope(
    step: Extract<ResolvedCombatStep, { kind: 'withActionBlackboardScope' }>,
    parent: ActionBlackboard,
  ): ActionBlackboard {
    let scopes = this.#actionBlackboardScopes.get(parent);
    const existing = scopes?.get(step.parameters.scopeKey);
    if (step.parameters.lifetime === 'execution') {
      return parent.createLocalScope(
        step.parameters.initialValues,
        step.parameters.inheritParent,
        step.parameters.entityInitialValues,
        step.parameters.entityAssignments,
      );
    }
    if (existing !== undefined) return existing;
    const created = parent.createLocalScope(
      step.parameters.initialValues,
      step.parameters.inheritParent,
      step.parameters.entityInitialValues,
      step.parameters.entityAssignments,
    );
    if (scopes === undefined) {
      scopes = new Map();
      this.#actionBlackboardScopes.set(parent, scopes);
    }
    scopes.set(step.parameters.scopeKey, created);
    return created;
  }

  tryExecuteOnce(
    scopeKey: string,
    body: ResolvedActionSequence,
    context: CombatExecutionContext,
    operationContext: CombatOperationContext = this.context,
  ): boolean {
    if (this.#executedOnceScopes.has(scopeKey)) return true;
    const sequence = this.createSequence(body, operationContext);
    sequence.reset(context);
    sequence.executeInstant(context);
    this.#executedOnceScopes.add(scopeKey);
    return true;
  }
}
