/**
 * 将共享战斗资源接入确定性逐帧循环。
 * 装配时应放在 AbilitySystem 之前，以保持原生 BattleManager Frame Tick 先于技能 PreLate Tick。
 */
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import type { CombatResources } from './combatResources';
import type { FrameRuntime } from './combatSimulation';

/** 每帧推进一次战斗内共享技力自然恢复。 */
export class CombatResourceRuntime implements FrameRuntime {
  constructor(readonly resources: CombatResources) {}

  advanceFrame(): void {
    this.resources.advanceInCombatSpRecovery(COMBAT_FRAME_INTERVAL);
  }
}
