/** 已编译干员养成事件在一场战斗中的注册与执行生命周期。 */
import type { CompiledOperatorUpgradeEventProgram } from '../../compiler/combatProgram';
import type { AbilityEventRegistration } from '../events/abilityEventDispatcher';
import { ActionBlackboard } from './actionBlackboard';
import { CombatActionSequenceRuntime } from './combatActionSequenceRuntime';
import type {
  CombatSemanticEventContext,
  CombatSemanticEventRuntime,
} from './combatSemanticEventRuntime';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';

export interface OperatorUpgradeEventExecutionContext {
  readonly operatorId: string;
  readonly programKey: string;
  readonly event: CombatSemanticEventContext['event'];
}

export type CreateOperatorUpgradeEventExecutor = (
  context: OperatorUpgradeEventExecutionContext,
) => CombatOperationExecutor;

export class OperatorUpgradeEventRuntime {
  readonly #registrations: AbilityEventRegistration[] = [];

  constructor(
    semanticEvents: CombatSemanticEventRuntime,
    operatorId: string,
    programs: readonly CompiledOperatorUpgradeEventProgram[],
    createExecutor: CreateOperatorUpgradeEventExecutor,
  ) {
    for (const program of programs) {
      this.#registrations.push(
        semanticEvents.register({
          ownerOperatorId: operatorId,
          trigger: program.event,
          phase: 'dataAction',
          createOperations: context =>
            createExecutor({ operatorId, programKey: program.key, event: context.event }),
          handle: (context, getOperations) =>
            this.#execute(program, getOperations(), context.event),
        }),
      );
    }
  }

  dispose(): void {
    for (const registration of this.#registrations.splice(0)) registration.dispose();
  }

  #execute(
    program: CompiledOperatorUpgradeEventProgram,
    operations: CombatOperationExecutor,
    event: CombatSemanticEventContext['event'],
  ): void {
    const operationContext: CombatOperationContext = {
      blackboard: new ActionBlackboard(),
      event,
    };
    new CombatActionSequenceRuntime(operations, operationContext)
      .createSequence(program.sequence)
      .executeInstant({});
  }
}
