/** 按正式装配的原生阶段顺序驱动一个已经完成对象关系提交的恢复候选。 */
import type { CombatStatusContainer } from '../status/combatStatuses';
import type { EnemyBuffRuntime } from './combatRuntimeAssembly';
import type { RestoredCombatAbilityEntityDirectory } from './combatRuntimeAbilityEntityRestoration';
import type { RestoredCombatRuntimeObjectGraph } from './combatRuntimeObjectGraphRestoration';
import type { RestoredCombatRuntimeFoundation } from './combatRuntimeRestoreFoundation';
import type { CombatRuntimeRestorePreparation } from './combatRuntimeRestorePreparation';
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import { CombatResourceRuntime } from './combatResourceRuntime';
import { CombatSimulation } from './combatSimulation';
import { CombatStatusRuntime } from './combatStatusRuntime';

export interface RestoreCombatRuntimeFrameOptions {
  readonly preparation: CombatRuntimeRestorePreparation;
  readonly foundation: RestoredCombatRuntimeFoundation;
  readonly entities: RestoredCombatAbilityEntityDirectory;
  readonly objects: RestoredCombatRuntimeObjectGraph;
  readonly enemyStatusContainer?: CombatStatusContainer;
}

export interface RestoredCombatRuntimeFrame {
  readonly simulation: CombatSimulation;
  readonly enemyStatuses?: CombatStatusRuntime;
  advanceFrame(): void;
  advanceFrames(count: number): void;
}

export function bindRestoredCombatRuntimeFrame(
  options: RestoreCombatRuntimeFrameOptions,
): RestoredCombatRuntimeFrame {
  const { shared } = options.foundation;
  const enemyBuffs = options.foundation.enemyBuffTarget as EnemyBuffRuntime;
  let enemyStatuses: CombatStatusRuntime | undefined;
  const enemyStatusState = options.preparation.graph.enemy.statuses;
  if (options.enemyStatusContainer === undefined) {
    if (enemyStatusState !== null) {
      throw new Error('restored enemy has status data without definitions');
    }
  } else {
    if (options.enemyStatusContainer.ownerId !== 'enemy') {
      throw new Error(
        `status owner '${options.enemyStatusContainer.ownerId}' does not match enemy`,
      );
    }
    if (enemyStatusState === null) {
      throw new Error('restored enemy has status definitions without data');
    }
    enemyStatuses = new CombatStatusRuntime(
      options.enemyStatusContainer.bindRuntimeState(enemyStatusState),
      shared.clock,
      shared.receipt,
    );
  }

  const simulation = new CombatSimulation(shared.clock);
  if (shared.timeDilation !== null) simulation.add(shared.timeDilation);
  const enemyControl = options.foundation.boundEnvironment.enemyControlRuntime;
  if (enemyControl !== undefined && enemyControl !== null) {
    simulation.add({
      advanceFrame: () =>
        enemyControl.advance(
          COMBAT_FRAME_INTERVAL * (shared.timeDilation?.getEntityScale('enemy') ?? 1),
        ),
    });
  }
  simulation.add(new CombatResourceRuntime(shared.resources, shared.clock, shared.receipt));
  simulation.add(options.objects.buffs.globalBuffs);
  simulation.add(options.entities.runtime);
  simulation.add(options.objects.projectiles);
  simulation.add({ advanceFrame: () => options.objects.projectiles.beginAbilityFrame() });
  simulation.add({
    advanceFrame: () => {
      if (shared.timeDilation === null || enemyBuffs.advanceWithDeltas === undefined) {
        enemyBuffs.advanceFrame();
      } else {
        enemyBuffs.advanceWithDeltas(
          shared.timeDilation.getAbilityTickDeltas('enemy', COMBAT_FRAME_INTERVAL),
        );
      }
    },
  });
  const enemyVitals = options.foundation.boundEnvironment.enemyVitalsRuntime;
  if (enemyVitals !== undefined && enemyVitals !== null) {
    simulation.add({
      advanceFrame: () => {
        if (shared.timeDilation === null || enemyVitals.advance === undefined) {
          enemyVitals.advanceFrame();
        } else {
          enemyVitals.advance(COMBAT_FRAME_INTERVAL * shared.timeDilation.currentGlobalScale);
        }
      },
    });
  }
  if (enemyStatuses !== undefined) simulation.add(enemyStatuses);
  simulation.add({ advanceFrame: () => enemyBuffs.recycleFinishedBuffs?.() });
  for (const core of options.objects.operators.cores.values()) {
    if (core.statuses !== undefined) simulation.add(core.statuses);
  }
  simulation.add(shared.comboWindows);
  for (const core of options.objects.operators.cores.values()) simulation.add(core.ability);
  simulation.add({ advanceFrame: () => options.objects.projectiles.advanceAbilityFrame() });

  return {
    simulation,
    enemyStatuses,
    advanceFrame: () => simulation.advanceFrame(),
    advanceFrames: count => simulation.advanceFrames(count),
  };
}
