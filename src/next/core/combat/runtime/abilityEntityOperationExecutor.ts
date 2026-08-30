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
  readonly #actionDurationEntities = new WeakMap<RuntimeOperation, RuntimeTargetRef[]>();

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
      const ownerId =
        step.parameters.ownerContextKey === undefined
          ? this.#operatorId
          : this.#requireSingleOperatorTarget(
              context.targetContext.get(step.parameters.ownerContextKey),
              step.parameters.ownerContextKey,
            );
      let targets = this.#entities.findOwnerSpawned({
        ownerId,
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
      const circularOrder = step.parameters.circularOrder;
      if (circularOrder !== undefined) {
        if (targets.length !== circularOrder.desiredCount) {
          targets = [];
        } else {
          const indexed = new Array<RuntimeTargetRef | undefined>(targets.length);
          let valid = true;
          for (const target of targets) {
            const index = this.#entities
              .entityBlackboard(target)
              .getNumber(circularOrder.indexBlackboardKey);
            if (
              index === undefined ||
              !Number.isInteger(index) ||
              index < 0 ||
              index >= targets.length ||
              indexed[index] !== undefined
            ) {
              valid = false;
              break;
            }
            indexed[index] = target;
          }
          if (valid) {
            // 所有实例在零空间模型中共点；原生最近槽位回退的首个稳定起点为索引 0。
            const direction = circularOrder.reverseFlag < 0 ? 1 : -1;
            targets = indexed.map((_, offset) => {
              const index = (direction * offset + indexed.length) % indexed.length;
              return indexed[index]!;
            });
          }
        }
      }
      if (step.parameters.maxTargets !== undefined) {
        targets = targets.slice(0, step.parameters.maxTargets);
      }
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
      this.#entities.kill(context.currentTarget, 'explicit');
      return true;
    }
    if (step.kind === 'finishActionOwnerAbilityEntity') {
      if (context?.actionOwnerAbilityEntity === undefined) {
        throw new Error('AbilityEntity ActionOwner finish requires an entity child-skill context');
      }
      this.#entities.kill(context.actionOwnerAbilityEntity, 'explicit');
      return true;
    }
    if (step.kind === 'finishCurrentAbilityEntityWhenSourceDies') {
      if (context?.currentTarget === undefined) {
        throw new Error('AbilityEntity source-death finish requires a current Context target');
      }
      if (this.#entities.isSourceDead(context.currentTarget)) {
        this.#entities.kill(context.currentTarget, 'sourceDied');
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
    if (step.kind === 'startCurrentAbilityEntityChildSkillById') {
      if (context?.currentTarget === undefined) {
        throw new Error('AbilityEntity child skill start requires a current Context target');
      }
      if (this.#childRuntimeDependencies === undefined || this.#resolveDefinition === undefined) {
        throw new Error(
          'AbilityEntity child skill runtime or definition resolver is not configured',
        );
      }
      const snapshot = this.#entities.snapshot(context.currentTarget);
      const definition = this.#resolveDefinition(snapshot.abilityEntityId);
      if (definition === undefined) {
        throw new Error(`AbilityEntity definition '${snapshot.abilityEntityId}' does not exist`);
      }
      const childSkill = this.#resolveSpawnChildSkill(definition, step.parameters.childSkillId);
      if (childSkill === undefined) {
        throw new Error(
          `AbilityEntity child skill '${step.parameters.childSkillId}' does not exist`,
        );
      }
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
    const stringAssignments = parameters.stringBlackboardAssignments ?? {};
    const assignments = {
      ...(parameters.inheritActionBlackboard ? context.blackboard.snapshot() : {}),
      ...explicitAssignments,
      ...stringAssignments,
    };
    const resolveDefinitionNumber = (
      value: number | { readonly blackboardKey: string; readonly fallback: number },
    ): number => {
      if (typeof value === 'number') return value;
      const assigned = assignments[value.blackboardKey];
      return typeof assigned === 'number' ? assigned : value.fallback;
    };
    const source: RuntimeTargetRef = { kind: 'operator', operatorId: this.#operatorId };
    const childSkill = this.#resolveSpawnChildSkill(definition, parameters.childSkillId);
    if (childSkill !== undefined && this.#childRuntimeDependencies === undefined) {
      throw new Error('spawnAbilityEntity child skill runtime is not configured');
    }
    const target =
      parameters.target === undefined
        ? undefined
        : parameters.target === 'enemy'
          ? ({ kind: 'enemy' } as const)
          : parameters.target === 'currentAbilityEntity'
            ? context.currentTarget
            : source;
    if (parameters.target === 'currentAbilityEntity' && target === undefined) {
      throw new Error('spawnAbilityEntity currentAbilityEntity target requires a current target');
    }
    const entity = this.#entities.spawn({
      abilityEntityId: parameters.abilityEntityId,
      definition: {
        lifetime:
          definition.lifetime.kind === 'infinite'
            ? definition.lifetime
            : {
                kind: 'limited',
                durationSeconds: resolveDefinitionNumber(definition.lifetime.durationSeconds),
              },
        ...(definition.deathReleaseDelaySeconds === undefined
          ? {}
          : { deathReleaseDelaySeconds: definition.deathReleaseDelaySeconds }),
        ...(definition.maxStackingCount === undefined
          ? {}
          : { maxStackingCount: resolveDefinitionNumber(definition.maxStackingCount) }),
        ...(childSkill === undefined ? {} : { childSkill: { skillId: childSkill.skillId } }),
      },
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
      ...(childSkill === undefined
        ? {}
        : {
            createChildRuntime: (entity, entityBlackboard) =>
              this.#createChildRuntime(childSkill, entity, entityBlackboard, context),
          }),
    });
    if (parameters.saveToContextKey !== undefined) {
      if (context.targetContext === undefined) {
        throw new Error('spawnAbilityEntity context output requires a target context');
      }
      context.targetContext.setSingle(parameters.saveToContextKey, entity);
    }
    if (parameters.finishByAction) {
      this.#actionDurationEntities.set(step, [
        ...(this.#actionDurationEntities.get(step) ?? []),
        entity,
      ]);
    }
    return true;
  }

  #resolveSpawnChildSkill(
    definition: ResolvedAbilityEntityDefinition,
    requestedSkillId: string | undefined,
  ): CompiledAbilityEntityChildSkillProgram | undefined {
    if (requestedSkillId !== undefined) {
      if (definition.childSkill?.skillId === requestedSkillId) return definition.childSkill;
      const selected = definition.childSkills?.[requestedSkillId];
      if (selected !== undefined) return selected;
      throw new Error(`AbilityEntity child skill '${requestedSkillId}' does not exist`);
    }
    if (definition.childSkill !== undefined) return definition.childSkill;
    const children = Object.values(definition.childSkills ?? {});
    if (children.length <= 1) return children[0];
    throw new Error('AbilityEntity definition has multiple child skills but Spawn selected none');
  }

  #requireSingleOperatorTarget(targets: readonly RuntimeTargetRef[], contextKey: string): string {
    if (targets.length !== 1 || targets[0]?.kind !== 'operator') {
      throw new Error(
        `AbilityEntity query owner Context '${contextKey}' requires exactly one operator`,
      );
    }
    return targets[0].operatorId;
  }

  end(step: RuntimeOperation, context?: CombatOperationContext): void {
    if (step.kind === 'spawnAbilityEntity') {
      for (const entity of this.#actionDurationEntities.get(step) ?? []) {
        if (this.#entities.isActive(entity)) this.#entities.finish(entity, 'ownerFinished');
      }
      this.#actionDurationEntities.delete(step);
      return;
    }
    this.#delegate.end?.(step, context);
  }

  evaluate(condition: CombatCondition, context?: CombatOperationContext): boolean {
    if (condition.kind === 'ownerSpawnedAbilityEntityPresent') {
      const sourceSkillCastId = condition.sameSourceSkillCast
        ? context?.skillCastInfo?.skillCastId
        : undefined;
      if (condition.sameSourceSkillCast && sourceSkillCastId === undefined) {
        throw new Error('AbilityEntity same-cast presence check requires SkillCastInfo');
      }
      return (
        this.#entities.findOwnerSpawned({
          ownerId: this.#operatorId,
          ...(condition.abilityEntityIds === undefined
            ? {}
            : { abilityEntityIds: condition.abilityEntityIds }),
          ...(sourceSkillCastId === undefined ? {} : { sourceSkillCastId }),
        }).length > 0
      );
    }
    if (condition.kind === 'contextTargetCountCompare') {
      if (context?.targetContext === undefined) {
        throw new Error('Context target count comparison requires a combat target context');
      }
      const count = context.targetContext.get(condition.contextKey).length;
      if (condition.outputKey !== undefined) {
        context.blackboard.assignDynamic(condition.outputKey, count);
      }
      return compareCombatNumbers(count, condition.value, condition.operator);
    }
    if (condition.kind === 'abilityEntityRemainingDurationCompare') {
      if (context?.currentTarget === undefined) {
        throw new Error('AbilityEntity duration comparison requires a current Context target');
      }
      const remaining = this.#entities.snapshot(context.currentTarget).remainingDurationSeconds;
      if (remaining === null) {
        throw new Error('infinite AbilityEntity does not have a finite remaining duration');
      }
      if (condition.outputKey !== undefined) {
        context.blackboard.assignDynamic(condition.outputKey, remaining);
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
    if (entity.kind !== 'abilityEntity') {
      throw new Error('AbilityEntity child skill requires an ability-entity runtime target');
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
      addAbilityChildBuff: child => this.#entities.addChildBuff(entity, child),
    });
  }
}
