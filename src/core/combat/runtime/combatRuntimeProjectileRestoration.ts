/**
 * 建立投射物纯数据目录，并在回调宿主和对象 reset 处理函数齐备后提交关系。
 *
 * 数据阶段只核对固定回调程序编号，不创建回调技能。关系阶段用回调状态保存的定义干员选择当前
 * 操作链；命中前的回调仍保持未创建，命中后的回调宿主从保存技能帧继续。
 */
import type { BuffReference } from '../buffs/buffReference';
import type { BuffApplicationHandle } from '../buffs/combatBuffs';
import type { CallbackSkillHostFactory } from './callbackSkillHost';
import type { RestoredCombatAbilityEntityDirectory } from './combatRuntimeAbilityEntityRestoration';
import type { CombatRuntimeRestorePreparation } from './combatRuntimeRestorePreparation';
import type { RestoredCombatRuntimeFoundation } from './combatRuntimeRestoreFoundation';
import type { ProjectileCallbackPrograms } from './projectileCallbackPrograms';
import type { ProjectileCallbackState } from './projectileCallbackState';
import {
  bindProjectileCallbackLifecycle,
  restoreProjectileCallback,
} from './projectileCallbackRuntime';
import { ProjectileLifecycleRuntime } from './projectileLifecycleRuntime';
import type { CombatOperationExecutor, ProjectileRuntimeDependencies } from './skillRuntime';
import { COMBAT_FRAME_INTERVAL } from './combatClock';

export interface ProjectileCallbackRestoreBindings {
  readonly operations: CombatOperationExecutor;
  readonly createCallbackSkillHost: CallbackSkillHostFactory;
  readonly scheduleProjectileFinishCallback: ProjectileRuntimeDependencies['scheduleProjectileFinishCallback'];
}

export function createRestoredCombatProjectileDirectory(options: {
  readonly preparation: CombatRuntimeRestorePreparation;
  readonly foundation: RestoredCombatRuntimeFoundation;
  readonly callbackPrograms: ProjectileCallbackPrograms;
}): ProjectileLifecycleRuntime {
  for (const [instanceId, state] of options.preparation.graph.instances.projectiles.instances) {
    const callback = state.callback;
    if (callback !== null && !options.preparation.programs.has(callback.definitionOperatorId)) {
      throw new Error(
        `restored projectile '${instanceId}' definition operator '${callback.definitionOperatorId}' does not exist`,
      );
    }
  }
  return new ProjectileLifecycleRuntime(
    () => options.foundation.shared.abilityEntityInstanceIds.allocate(),
    {
      state: options.preparation.graph.instances.projectiles,
      callbackPrograms: options.callbackPrograms,
    },
  );
}

export function bindRestoredCombatProjectileRelations(options: {
  readonly projectiles: ProjectileLifecycleRuntime;
  readonly foundation: RestoredCombatRuntimeFoundation;
  readonly entities: RestoredCombatAbilityEntityDirectory;
  readonly createCallbackBindings: (input: {
    readonly instanceId: number;
    readonly definitionOperatorId: string;
    readonly state: ProjectileCallbackState;
  }) => ProjectileCallbackRestoreBindings;
}): void {
  const resolveAttachedBuff = (reference: BuffReference): BuffApplicationHandle | undefined =>
    options.entities.targets.get(reference.ownerId)?.resolveHandle?.(reference);
  const resolveTickDeltaSeconds = () =>
    COMBAT_FRAME_INTERVAL * (options.foundation.shared.timeDilation?.currentGlobalScale ?? 1);

  options.projectiles.bindRestoredRelations({
    resolveHost: instanceId => {
      const state = options.projectiles.runtimeState.instances.get(instanceId)?.callback;
      if (state === undefined || state === null) {
        throw new Error(`restored projectile '${instanceId}' has no callback host data`);
      }
      const bindings = options.createCallbackBindings({
        instanceId,
        definitionOperatorId: state.definitionOperatorId,
        state,
      });
      return bindProjectileCallbackLifecycle(
        restoreProjectileCallback(
          state,
          instanceId,
          options.projectiles.callbackPrograms,
          bindings.operations,
          {
            createCallbackSkillHost: bindings.createCallbackSkillHost,
            scheduleProjectileFinishCallback: bindings.scheduleProjectileFinishCallback,
          },
          resolveAttachedBuff,
        ),
        resolveTickDeltaSeconds,
      );
    },
  });
}
