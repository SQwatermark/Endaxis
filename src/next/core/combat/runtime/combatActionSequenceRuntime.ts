/**
 * 把编译后的同步动作序列绑定到操作执行器和动作黑板。
 * 技能、Buff 等状态所有者应各自持有实例，避免共享 once 作用域或运行时黑板。
 */
import { ActionSequence } from '../actions/actionSequence';
import { CombatStep, type CombatExecutionContext } from '../actions/combatStep';
import type { ResolvedActionSequence, ResolvedCombatStep } from '../../compiler/combatProgram';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import type { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';

export interface CombatActionSequenceRuntimeHooks {
  readonly stepReached?: (step: ResolvedCombatStep) => void;
  readonly conditionEvaluated?: (
    condition: Extract<ResolvedCombatStep, { kind: 'conditional' }>['parameters']['condition'],
    passed: boolean,
  ) => void;
}

class OperationStep extends CombatStep {
  constructor(
    readonly step: Exclude<ResolvedCombatStep, { kind: 'conditional' | 'once' }>,
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

class ConditionalStep extends CombatStep {
  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'conditional' }>,
    readonly runtime: CombatActionSequenceRuntime,
    readonly operationContext: CombatOperationContext,
  ) {
    super();
  }

  execute(context: CombatExecutionContext): void {
    this.tryExecute(context);
  }

  override tryExecute(context: CombatExecutionContext): boolean {
    const condition = this.step.parameters.condition;
    const passed = this.runtime.operations.evaluate(condition, this.operationContext);
    this.runtime.hooks.conditionEvaluated?.(condition, passed);
    const branch = passed ? this.step.whenTrue : this.step.whenFalse;
    if (branch === undefined) return passed;
    return this.runtime.createSequence(branch, this.operationContext).executeInstant(context);
  }
}

class CombatEventListenerStep extends CombatStep {
  readonly #registrations: AbilityEventRegistration[] = [];

  constructor(
    readonly step: Extract<ResolvedCombatStep, { kind: 'listenForCombatEvents' }>,
    readonly runtime: CombatActionSequenceRuntime,
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
      this.#registrations.push(
        semanticEvents.register({
          ownerOperatorId,
          trigger: response.event,
          phase: 'skill',
          ...(response.condition === undefined ? {} : { condition: response.condition }),
          createOperations: () => this.runtime.operations,
          createOperationContext: eventContext => ({
            ...this.runtime.context,
            event: eventContext.event,
          }),
          handle: eventContext => {
            this.runtime
              .createSequence(response.sequence, {
                ...this.runtime.context,
                event: eventContext.event,
              })
              .executeInstant({});
          },
        }),
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
        if (step.kind === 'once') return new OnceStep(step, this, operationContext);
        if (step.kind === 'listenForCombatEvents') return new CombatEventListenerStep(step, this);
        return new OperationStep(step, this, operationContext);
      }),
    );
  }

  reset(): void {
    this.#executedOnceScopes.clear();
  }

  tryExecuteOnce(
    scopeKey: string,
    body: ResolvedActionSequence,
    context: CombatExecutionContext,
    operationContext: CombatOperationContext = this.context,
  ): boolean {
    if (this.#executedOnceScopes.has(scopeKey)) return true;
    this.createSequence(body, operationContext).executeInstant(context);
    this.#executedOnceScopes.add(scopeKey);
    return true;
  }
}
