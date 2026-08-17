import type { CombatCondition } from '../../game-data/operatorDefinition';
import type { ResolvedCombatOperationStep } from '../../compiler/combatProgram';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import { gameplayTagId } from '../tags/gameplayTags';
import { resolveActionValueOperand } from './actionBlackboard';
import { compareCombatNumbers } from './numericComparison';
import type { LogicalAbilityEntityRuntime } from './logicalAbilityEntityRuntime';
import type { CombatOperationContext, CombatOperationExecutor } from './skillRuntime';
import { AbilityEntityChildSkillRuntime } from './abilityEntityChildSkillRuntime';
import type { CombatSemanticEventRuntime } from './combatSemanticEventRuntime';

type RuntimeOperation = ResolvedCombatOperationStep;

/** 将能力实体 DSL 步骤接到本场战斗唯一的逻辑实例目录。 */
export class AbilityEntityOperationExecutor implements CombatOperationExecutor {
  readonly #operatorId: string;
  readonly #entities: LogicalAbilityEntityRuntime;
  readonly #delegate: CombatOperationExecutor;
  readonly #childRuntimeDependencies?: {
    readonly resolveOperations: () => CombatOperationExecutor;
    readonly semanticEvents?: CombatSemanticEventRuntime;
  };

  constructor(
    operatorId: string,
    entities: LogicalAbilityEntityRuntime,
    delegate: CombatOperationExecutor,
    childRuntimeDependencies?: {
      readonly resolveOperations: () => CombatOperationExecutor;
      readonly semanticEvents?: CombatSemanticEventRuntime;
    },
  ) {
    this.#operatorId = operatorId;
    this.#entities = entities;
    this.#delegate = delegate;
    this.#childRuntimeDependencies = childRuntimeDependencies;
  }

  execute(step: RuntimeOperation, context?: CombatOperationContext): boolean {
    if (step.kind === 'findOwnerSpawnedAbilityEntities') {
      if (context?.targetContext === undefined) {
        throw new Error('AbilityEntity query requires a combat target context');
      }
      const targets = this.#entities.findOwnerSpawned({
        ownerId: this.#operatorId,
        ...(step.parameters.tagQuery === undefined
          ? {}
          : {
              tagQuery: {
                ...step.parameters.tagQuery,
                tagIds: step.parameters.tagQuery.tagIds.map(gameplayTagId),
              },
            }),
      });
      context.targetContext.set(step.parameters.saveToContextKey, targets);
      if (step.parameters.saveCountToBlackboardKey !== undefined) {
        context.blackboard.assignDynamic(step.parameters.saveCountToBlackboardKey, targets.length);
      }
      return true;
    }
    if (step.kind === 'readAbilityEntityRemainingDuration') {
      if (context?.currentTarget === undefined) {
        throw new Error('AbilityEntity duration read requires a current Context target');
      }
      const remaining = this.#entities.snapshot(context.currentTarget).remainingDurationSeconds;
      if (remaining === null) {
        throw new Error('infinite AbilityEntity does not have a finite remaining duration');
      }
      context.blackboard.assignDynamic(step.parameters.outputKey, remaining);
      return true;
    }
    if (step.kind === 'setAbilityEntityRemainingDuration') {
      if (context?.currentTarget === undefined) {
        throw new Error('AbilityEntity duration assignment requires a current Context target');
      }
      this.#entities.setRemainingDuration(
        context.currentTarget,
        resolveActionValueOperand(step.parameters.value, context.blackboard),
      );
      return true;
    }
    if (step.kind === 'finishCurrentAbilityEntity') {
      if (context?.currentTarget === undefined) {
        throw new Error('AbilityEntity finish requires a current Context target');
      }
      this.#entities.finish(context.currentTarget, 'explicit');
      return true;
    }
    if (step.kind === 'finishCurrentAbilityEntityWhenSourceDies') {
      if (context?.currentTarget === undefined) {
        throw new Error('AbilityEntity source-death finish requires a current Context target');
      }
      if (this.#entities.isSourceDead(context.currentTarget)) {
        this.#entities.finish(context.currentTarget, 'sourceDied');
      }
      return true;
    }
    if (step.kind !== 'spawnAbilityEntity') return this.#delegate.execute(step, context);
    if (context === undefined) {
      throw new Error('spawnAbilityEntity requires a combat operation context');
    }
    const parameters = step.parameters;
    const explicitAssignments = Object.fromEntries(
      Object.entries(parameters.blackboardAssignments ?? {}).map(([key, operand]) => [
        key,
        resolveActionValueOperand(operand, context.blackboard),
      ]),
    );
    const assignments = {
      ...(parameters.inheritActionBlackboard ? context.blackboard.snapshot() : {}),
      ...explicitAssignments,
    };
    const source: RuntimeTargetRef = { kind: 'operator', operatorId: this.#operatorId };
    if (parameters.childSkill !== undefined && this.#childRuntimeDependencies === undefined) {
      throw new Error('spawnAbilityEntity child skill runtime is not configured');
    }
    const target =
      parameters.target === undefined
        ? undefined
        : parameters.target === 'enemy'
          ? ({ kind: 'enemy' } as const)
          : source;
    const entity = this.#entities.spawn({
      templateId: parameters.templateId,
      ownerId: this.#operatorId,
      source,
      ...(target === undefined ? {} : { target }),
      ...(parameters.childSkillId === undefined ? {} : { childSkillId: parameters.childSkillId }),
      ...(parameters.overrideDurationSeconds === undefined
        ? {}
        : {
            overrideDurationSeconds: resolveActionValueOperand(
              parameters.overrideDurationSeconds,
              context.blackboard,
            ),
          }),
      dieWhenSourceDies: parameters.dieWhenSourceDies,
      ...(Object.keys(assignments).length === 0 ? {} : { blackboardAssignments: assignments }),
      ...(parameters.childSkill === undefined
        ? {}
        : {
            createChildRuntime: (entity, entityBlackboard) =>
              new AbilityEntityChildSkillRuntime(parameters.childSkill!, {
                entity,
                entityBlackboard,
                operations: this.#childRuntimeDependencies!.resolveOperations(),
                ownerOperatorId: this.#operatorId,
                ...(this.#childRuntimeDependencies!.semanticEvents === undefined
                  ? {}
                  : { semanticEvents: this.#childRuntimeDependencies!.semanticEvents }),
                ...(context.skillCastInfo === undefined
                  ? {}
                  : { inheritedSkillCastInfo: context.skillCastInfo }),
              }),
          }),
    });
    if (parameters.saveToContextKey !== undefined) {
      if (context.targetContext === undefined) {
        throw new Error('spawnAbilityEntity context output requires a target context');
      }
      context.targetContext.setSingle(parameters.saveToContextKey, entity);
    }
    return true;
  }

  end(step: RuntimeOperation, context?: CombatOperationContext): void {
    this.#delegate.end?.(step, context);
  }

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
    if (condition.kind === 'abilityEntityRemainingDurationCompare') {
      if (context?.currentTarget === undefined) {
        throw new Error('AbilityEntity duration comparison requires a current Context target');
      }
      const remaining = this.#entities.snapshot(context.currentTarget).remainingDurationSeconds;
      if (remaining === null) {
        throw new Error('infinite AbilityEntity does not have a finite remaining duration');
      }
      return compareCombatNumbers(
        remaining,
        resolveActionValueOperand(condition.value, context.blackboard),
        condition.operator,
      );
    }
    return this.#delegate.evaluate(condition, context);
  }
}
