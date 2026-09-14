/**
 * 恢复能力实体持有的被动、子技能和直属子 Buff。
 *
 * 实体目录只保存实例数据。这里按实体所属干员的当前编译结果解析实体定义，并从切面树共享的
 * 子技能程序目录取回固定程序。全部子 Buff 归属和子技能身份通过检查后，才一次性提交对象关系；
 * 过程中不会重新启用被动、启动子技能或发布实体生成事件。
 */
import type {
  CompiledOperatorPassiveProgram,
  ResolvedAbilityEntityDefinition,
} from '../../compiler/combatProgram';
import {
  logicalAbilityEntityRuntimeId,
  type AbilityEntityTargetRef,
} from '../../game-data/logicalAbilityEntity';
import { buffReferenceKey, type BuffReference } from '../buffs/buffReference';
import type { BuffApplicationHandle } from '../buffs/combatBuffs';
import type { ActionBlackboard } from './actionBlackboard';
import { AbilityEntityChildSkillRuntime } from './abilityEntityChildSkillRuntime';
import type { AbilityEntityChildSkillPrograms } from './abilityEntityChildSkillPrograms';
import type { AbilityEntityChildSkillState } from './abilityEntityChildSkillState';
import {
  bindRestoredCombatAbilityEntityPassives,
  type RestoredCombatAbilityEntityPassives,
} from './combatAbilityEntityPassiveRestoration';
import type { RestoredCombatAbilityEntityDirectory } from './combatRuntimeAbilityEntityRestoration';
import type { RestoredCombatRuntimeOperators } from './combatRuntimeOperatorRestoration';
import type { RestoredCombatRuntimeFoundation } from './combatRuntimeRestoreFoundation';
import type { CallbackSkillHostFactory } from './callbackSkillHost';
import type { PassiveAbilityEventState } from './passiveAbilityEventState';
import type { RegisterPassiveAbilityEventAction } from './passiveAbilityEventRuntime';
import type { CombatOperationExecutor, ScheduleProjectileFinishCallback } from './skillRuntime';

export interface AbilityEntityChildSkillRestoreBindings {
  readonly operations: CombatOperationExecutor;
  readonly scheduleProjectileFinishCallback?: ScheduleProjectileFinishCallback;
  readonly createCallbackSkillHost?: CallbackSkillHostFactory;
}

export interface RestoreCombatRuntimeAbilityEntityRelationsOptions {
  readonly foundation: RestoredCombatRuntimeFoundation;
  readonly preparation?: import('./combatRuntimeRestorePreparation').CombatRuntimeRestorePreparation;
  readonly entities: RestoredCombatAbilityEntityDirectory;
  readonly operators: RestoredCombatRuntimeOperators;
  readonly childSkillPrograms: AbilityEntityChildSkillPrograms;
  readonly createPassiveOperations: (input: {
    readonly ownerId: string;
    readonly entity: AbilityEntityTargetRef;
    readonly program: CompiledOperatorPassiveProgram;
    readonly state: PassiveAbilityEventState;
  }) => CombatOperationExecutor;
  readonly registerPassive: (
    entityId: string,
    ...args: Parameters<RegisterPassiveAbilityEventAction>
  ) => ReturnType<RegisterPassiveAbilityEventAction>;
  readonly createChildSkillBindings: (input: {
    readonly ownerId: string;
    readonly entity: AbilityEntityTargetRef;
    readonly entityBlackboard: ActionBlackboard;
    readonly state: AbilityEntityChildSkillState;
  }) => AbilityEntityChildSkillRestoreBindings;
}

export interface RestoredCombatRuntimeAbilityEntityRelations {
  readonly passives: ReadonlyMap<number, RestoredCombatAbilityEntityPassives>;
  disposePassives(): void;
}

export function bindRestoredCombatRuntimeAbilityEntityRelations(
  options: RestoreCombatRuntimeAbilityEntityRelationsOptions,
): RestoredCombatRuntimeAbilityEntityRelations {
  const definitions = new Map<number, ResolvedAbilityEntityDefinition>();
  const passiveHosts = new Map<number, RestoredCombatAbilityEntityPassives>();
  const childBuffs = resolveEntityChildBuffs(options.entities, options.preparation);

  try {
    for (const [instanceId, state] of options.entities.runtime.runtimeState.instances) {
      const entity = { kind: 'abilityEntity' as const, instanceId };
      const definition = options.operators.programs.get(state.ownerId)?.abilityEntityDefinitions?.[
        state.abilityEntityId
      ];
      if (definition === undefined) {
        throw new Error(
          `restored AbilityEntity '${instanceId}' definition '${state.abilityEntityId}' does not exist for '${state.ownerId}'`,
        );
      }
      definitions.set(instanceId, definition);
      passiveHosts.set(
        instanceId,
        bindRestoredCombatAbilityEntityPassives({
          entity,
          definition,
          states: state.passiveAbilities,
          entityBlackboard: options.entities.runtime.entityBlackboard(entity),
          skillCastInfo: state.skillCastInfo,
          semanticEvents: options.foundation.semanticEvents,
          createOperations: (program, passiveState) =>
            options.createPassiveOperations({
              ownerId: state.ownerId,
              entity,
              program,
              state: passiveState,
            }),
          register: (...args) =>
            options.registerPassive(logicalAbilityEntityRuntimeId(instanceId), ...args),
        }),
      );
    }

    options.entities.runtime.bindRestoredRelations({
      createChildRuntime: (target, entityBlackboard, state) => {
        if (target.kind !== 'abilityEntity') {
          throw new Error('restored AbilityEntity child skill has a non-entity owner');
        }
        const owner = options.entities.runtime.runtimeState.instances.get(target.instanceId);
        const definition = definitions.get(target.instanceId);
        if (owner === undefined || definition === undefined) {
          throw new Error(`restored AbilityEntity '${target.instanceId}' is missing`);
        }
        const binding = options.childSkillPrograms.resolve(state.programId);
        if (!definitionContainsChildSkill(definition, state.skillId)) {
          throw new Error(
            `restored AbilityEntity '${target.instanceId}' child skill '${state.skillId}' is not in its definition`,
          );
        }
        if (binding.program.skillId !== state.skillId) {
          throw new Error(
            `restored AbilityEntity child program '${state.programId}' belongs to '${binding.program.skillId}', expected '${state.skillId}'`,
          );
        }
        const runtimeBindings = options.createChildSkillBindings({
          ownerId: owner.ownerId,
          entity: target,
          entityBlackboard,
          state,
        });
        return new AbilityEntityChildSkillRuntime(
          binding.program,
          {
            entity: target,
            entityBlackboard,
            operations: runtimeBindings.operations,
            ownerOperatorId: owner.ownerId,
            semanticEvents: options.foundation.semanticEvents,
            ...(owner.skillCastInfo == null ? {} : { inheritedSkillCastInfo: owner.skillCastInfo }),
            addAbilityChildBuff: child => options.entities.runtime.addChildBuff(target, child),
            programId: binding.id,
            damageSnapshotProgram: binding.damageSnapshots,
            operationState: state.operations,
            ...(runtimeBindings.scheduleProjectileFinishCallback === undefined
              ? {}
              : {
                  scheduleProjectileFinishCallback:
                    runtimeBindings.scheduleProjectileFinishCallback,
                }),
            ...(runtimeBindings.createCallbackSkillHost === undefined
              ? {}
              : { createCallbackSkillHost: runtimeBindings.createCallbackSkillHost }),
          },
          { state },
        );
      },
      resolveChildBuff: reference => {
        const child = childBuffs.get(buffReferenceKey(reference));
        if (child === undefined) {
          throw new Error(
            `restored AbilityEntity child Buff '${buffReferenceKey(reference)}' is missing`,
          );
        }
        return child;
      },
    });
    for (const host of passiveHosts.values()) {
      host.bindRestoredChildren(reference => childBuffs.get(buffReferenceKey(reference)));
    }
  } catch (error) {
    for (const host of [...passiveHosts.values()].reverse()) host.dispose();
    throw error;
  }

  return {
    passives: passiveHosts,
    disposePassives() {
      for (const host of [...passiveHosts.values()].reverse()) host.dispose();
    },
  };
}

function definitionContainsChildSkill(
  definition: ResolvedAbilityEntityDefinition,
  skillId: string,
): boolean {
  return (
    definition.childSkill?.skillId === skillId ||
    Object.values(definition.childSkills ?? {}).some(skill => skill.skillId === skillId)
  );
}

function resolveEntityChildBuffs(
  entities: RestoredCombatAbilityEntityDirectory,
  preparation?: import('./combatRuntimeRestorePreparation').CombatRuntimeRestorePreparation,
): ReadonlyMap<string, BuffApplicationHandle> {
  const unique = preparation?.buffs.abilityEntityChildren ?? collectEntityChildBuffs(entities);
  const children = new Map<string, BuffApplicationHandle>();
  for (const [key, reference] of unique) {
    const child = entities.targets.get(reference.ownerId)?.resolveHandle?.(reference);
    if (child === undefined) {
      throw new Error(`restored AbilityEntity child Buff '${key}' is missing`);
    }
    children.set(key, child);
  }
  return children;
}

function collectEntityChildBuffs(
  entities: RestoredCombatAbilityEntityDirectory,
): ReadonlyMap<string, BuffReference> {
  const unique = new Map<string, BuffReference>();
  for (const state of entities.runtime.runtimeState.instances.values()) {
    for (const reference of [
      ...state.childBuffs,
      ...[...state.passiveAbilities.values()].flatMap(passive => passive.host.childBuffs),
    ]) {
      const key = buffReferenceKey(reference);
      if (unique.has(key)) {
        throw new Error(`restored AbilityEntity child Buff '${key}' has multiple owners`);
      }
      unique.set(key, reference);
    }
  }
  return unique;
}
