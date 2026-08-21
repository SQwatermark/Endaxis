import type { CombatCondition } from '../../game-data/operatorDefinition';
import type {
  CompiledAbilityEntityChildSkillProgram,
  ResolvedAbilityEntityDefinition,
  ResolvedCombatOperationStep,
} from '../../compiler/combatProgram';
import type { RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import { ActionBlackboard, resolveActionValueOperand } from './actionBlackboard';
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
  readonly #resolveDefinition?: (
    abilityEntityId: string,
  ) => ResolvedAbilityEntityDefinition | undefined;

  constructor(
    operatorId: string,
    entities: LogicalAbilityEntityRuntime,
    delegate: CombatOperationExecutor,
    childRuntimeDependencies?: {
      readonly resolveOperations: () => CombatOperationExecutor;
      readonly semanticEvents?: CombatSemanticEventRuntime;
    },
    resolveDefinition?: (abilityEntityId: string) => ResolvedAbilityEntityDefinition | undefined,
  ) {
    this.#operatorId = operatorId;
    this.#entities = entities;
    this.#delegate = delegate;
    this.#childRuntimeDependencies = childRuntimeDependencies;
    this.#resolveDefinition = resolveDefinition;
  }

  execute(step: RuntimeOperation, context?: CombatOperationContext): boolean {
    if (step.kind === 'findOwnerSpawnedAbilityEntities') {
      if (context?.targetContext === undefined) {
        throw new Error('AbilityEntity query requires a combat target context');
      }
      const targets = this.#entities.findOwnerSpawned({
        ownerId: this.#operatorId,
        ...(step.parameters.abilityEntityIds === undefined
          ? {}
          : { abilityEntityIds: step.parameters.abilityEntityIds }),
        ...(step.parameters.sameSourceSkillCast
          ? {
              sourceSkillCastId:
                context.skillCastInfo?.skillCastId ??
                (() => {
                  throw new Error(
                    'AbilityEntity same-cast query requires inherited skill-cast info',
                  );
                })(),
            }
          : {}),
      });
      context.targetContext.set(step.parameters.saveToContextKey, targets);
      if (step.parameters.saveCountToBlackboardKey !== undefined) {
        context.blackboard.assignDynamic(step.parameters.saveCountToBlackboardKey, targets.length);
      }
      return true;
    }
    if (step.kind === 'pickContextTarget') {
      if (context?.targetContext === undefined) {
        throw new Error('Context target selection requires a combat target context');
      }
      const index = resolveActionValueOperand(step.parameters.index, context.blackboard);
      if (!Number.isInteger(index) || index < 0) {
        throw new RangeError('Context target index must be a non-negative integer');
      }
      const target = context.targetContext.get(step.parameters.sourceContextKey)[index];
      if (target === undefined) return false;
      context.targetContext.setSingle(step.parameters.saveToContextKey, target);
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
    if (step.kind === 'startCurrentAbilityEntityChildSkill') {
      if (context?.currentTarget === undefined) {
        throw new Error('AbilityEntity child skill start requires a current Context target');
      }
      if (this.#childRuntimeDependencies === undefined) {
        throw new Error('AbilityEntity child skill runtime is not configured');
      }
      const childSkill = step.parameters.childSkill;
      this.#entities.startChildSkill(
        context.currentTarget,
        childSkill.skillId,
        (entity, entityBlackboard) =>
          this.#createChildRuntime(childSkill, entity, entityBlackboard, context),
      );
      return true;
    }
    if (step.kind !== 'spawnAbilityEntity') return this.#delegate.execute(step, context);
    if (context === undefined) {
      throw new Error('spawnAbilityEntity requires a combat operation context');
    }
    const parameters = step.parameters;
    const definition =
      parameters.definition ?? this.#resolveDefinition?.(parameters.abilityEntityId);
    if (definition === undefined) {
      throw new Error(`AbilityEntity definition '${parameters.abilityEntityId}' does not exist`);
    }
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
    if (definition.childSkill !== undefined && this.#childRuntimeDependencies === undefined) {
      throw new Error('spawnAbilityEntity child skill runtime is not configured');
    }
    const target =
      parameters.target === undefined
        ? undefined
        : parameters.target === 'enemy'
          ? ({ kind: 'enemy' } as const)
          : source;
    const entity = this.#entities.spawn({
      abilityEntityId: parameters.abilityEntityId,
      definition,
      ownerId: this.#operatorId,
      source,
      ...(context.skillCastInfo === undefined
        ? {}
        : { sourceSkillCastId: context.skillCastInfo.skillCastId }),
      ...(target === undefined ? {} : { target }),
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
      ...(definition.childSkill === undefined
        ? {}
        : {
            createChildRuntime: (entity, entityBlackboard) =>
              this.#createChildRuntime(definition.childSkill!, entity, entityBlackboard, context),
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
    if (condition.kind === 'contextTargetCountCompare') {
      if (context?.targetContext === undefined) {
        throw new Error('Context target count comparison requires a combat target context');
      }
      return compareCombatNumbers(
        context.targetContext.get(condition.contextKey).length,
        condition.value,
        condition.operator,
      );
    }
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

  #createChildRuntime(
    program: CompiledAbilityEntityChildSkillProgram,
    entity: RuntimeTargetRef,
    entityBlackboard: ActionBlackboard,
    context: CombatOperationContext,
  ): AbilityEntityChildSkillRuntime {
    if (this.#childRuntimeDependencies === undefined) {
      throw new Error('AbilityEntity child skill runtime is not configured');
    }
    // 蓝图由同一技能程序共享；每个实体实例必须获得独立步骤对象，否则按步骤身份保存的
    // finishByAction、时间动作等运行态会在递归生成同一实体时彼此冲突。
    const instanceProgram = structuredClone(program);
    return new AbilityEntityChildSkillRuntime(instanceProgram, {
      entity,
      entityBlackboard,
      operations: this.#childRuntimeDependencies.resolveOperations(),
      ownerOperatorId: this.#operatorId,
      ...(this.#childRuntimeDependencies.semanticEvents === undefined
        ? {}
        : { semanticEvents: this.#childRuntimeDependencies.semanticEvents }),
      ...(context.skillCastInfo === undefined
        ? {}
        : { inheritedSkillCastInfo: context.skillCastInfo }),
    });
  }
}
