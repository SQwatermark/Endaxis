/**
 * 恢复整场候选的能力实体目录，并收齐敌人、干员和能力实体的全部 Buff 目标外壳。
 *
 * 本阶段只绑定实体身份、寿命、黑板、定时标记和可选 Buff 容器，不启动子技能、不发布生成事件，
 * 也不恢复 Buff 实例。返回的完整目标表供后续整场 Buff 协调器统一建立实例与关系。
 */
import { collectRestoredCombatBuffTargets } from './combatBuffRestoration';
import type { CombatRuntimeRestorePreparation } from './combatRuntimeRestorePreparation';
import type { RestoredCombatRuntimeFoundation } from './combatRuntimeRestoreFoundation';
import {
  LogicalAbilityEntityRuntime,
  type LogicalAbilityEntityRuntimeHooks,
} from './logicalAbilityEntityRuntime';
import { logicalAbilityEntityRuntimeId } from '../../game-data/logicalAbilityEntity';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import type { BuffOperationTarget } from './buffOperationExecutor';

export interface RestoreCombatAbilityEntityDirectoryOptions {
  readonly preparation: CombatRuntimeRestorePreparation;
  readonly foundation: RestoredCombatRuntimeFoundation;
  readonly hooks?: LogicalAbilityEntityRuntimeHooks;
}

export interface RestoredCombatAbilityEntityDirectory {
  readonly runtime: LogicalAbilityEntityRuntime;
  readonly targets: ReadonlyMap<string, BuffOperationTarget>;
}

export function bindRestoredCombatAbilityEntityDirectory(
  options: RestoreCombatAbilityEntityDirectoryOptions,
): RestoredCombatAbilityEntityDirectory {
  const shared = options.foundation.shared;
  const runtime = new LogicalAbilityEntityRuntime({
    restoredState: options.preparation.graph.instances.abilityEntities,
    allocateInstanceId: () => shared.abilityEntityInstanceIds.allocate(),
    resolveDeltaSeconds: entity =>
      COMBAT_FRAME_INTERVAL *
      (shared.timeDilation?.getEntityScale(logicalAbilityEntityRuntimeId(entity.instanceId)) ?? 1),
    hooks: options.hooks,
  });
  const createAbilityEntityTarget =
    options.foundation.environment.runtimeOptions.createAbilityEntityBuffRuntime;
  if (createAbilityEntityTarget === undefined) {
    throw new Error('standard environment cannot create AbilityEntity Buff targets');
  }
  const operatorStates = new Map(
    [...options.preparation.graph.operators].map(([operatorId, state]) => [
      operatorId,
      state.buffs,
    ]),
  );
  const targets = collectRestoredCombatBuffTargets({
    enemyState: options.preparation.graph.enemy.buffs,
    enemyTarget: options.foundation.enemyBuffTarget,
    operatorStates,
    operatorTargets: options.foundation.operatorBuffTargets,
    abilityEntities: runtime,
    createAbilityEntityTarget,
  });
  return { runtime, targets };
}
