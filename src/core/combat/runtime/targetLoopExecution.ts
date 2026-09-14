/**
 * 按目标快照创建子序列，维持它们到外层动作结束。
 * 子序列执行结果不影响遍历；End 不能提前到 Execute 后，否则会提前移除动作期间的 Buff。
 */
import type { RuntimeTargetGroup, RuntimeTargetRef } from '../../game-data/logicalAbilityEntity';
import type { TargetLoopState } from '../state/actionState';

/** start 按顺序完成创建、Reset、Execute，返回战斗数据中该子序列的编号。 */
export interface TargetLoopHost {
  start(target: RuntimeTargetRef): number;
  tick(id: number, delta: number): void;
  end(id: number): void;
}

export function executeTargetLoop(
  state: TargetLoopState,
  targets: RuntimeTargetGroup,
  host: TargetLoopHost,
): void {
  for (const target of targets) {
    const id = host.start(target);
    state.activeBodies.push(id);
  }
}

export function tickTargetLoop(state: TargetLoopState, delta: number, host: TargetLoopHost): void {
  for (const id of state.activeBodies) host.tick(id, delta);
}

export function endTargetLoop(state: TargetLoopState, host: TargetLoopHost): void {
  for (const id of state.activeBodies) host.end(id);
  state.activeBodies.length = 0;
  state.bodies.clear();
}

/** 沿用原动作 Reset：丢弃活动列表，不调用 End。恢复切面不能调用此操作替代换数据。 */
export function resetTargetLoop(state: TargetLoopState): void {
  state.activeBodies.length = 0;
  state.bodies.clear();
}
