import type { CombatStepParameters } from '../../../../packages/game-data-contract/src/actions';
import type { RuntimeTargetRef, RuntimeTargetGroup } from '../../game-data/logicalAbilityEntity';
import type { ChannelingActionState } from '../state/actionState';

type Parameters = NonNullable<CombatStepParameters['repeatEachTick']['nativeChanneling']>;

export function endChanneling(state: ChannelingActionState): void {
  state.timerSeconds = 0;
  state.scanCount = 0;
  state.inputTarget = null;
  state.targets.clear();
}

export function tickChanneling(
  state: ChannelingActionState,
  parameters: Parameters,
  frame: number,
  delta: number,
  query: () => RuntimeTargetGroup,
  execute: (target: RuntimeTargetRef) => void,
): void {
  state.timerSeconds = Math.fround(state.timerSeconds + Math.fround(delta));
  const previousFrame = state.checkFrame;
  state.checkFrame = frame;
  if (
    !(parameters.executeEachFrame && previousFrame !== frame) &&
    state.timerSeconds <
      Math.fround(Math.fround(state.scanCount) * Math.fround(parameters.triggerIntervalSeconds))
  )
    return;
  state.scanCount++;
  for (const target of query()) {
    // 空间点没有原生 AbilitySystem 或 IHittableObject 身份。
    if (target.kind === 'spatialPoint') continue;
    const key =
      target.kind === 'operator'
        ? `operator:${target.operatorId}`
        : target.kind === 'abilityEntity'
          ? `abilityEntity:${target.instanceId}`
          : 'enemy';
    const record = state.targets.get(key) ?? { count: 0, lastTriggerTime: 0 };
    if (parameters.maxCountPerTarget >= 0 && record.count >= parameters.maxCountPerTarget) continue;
    if (
      record.count > 0 &&
      !(
        Math.fround(state.timerSeconds - record.lastTriggerTime) >
        Math.fround(parameters.targetTriggerIntervalSeconds)
      )
    )
      continue;
    execute(target);
    state.targets.set(key, { count: record.count + 1, lastTriggerTime: state.timerSeconds });
  }
}
