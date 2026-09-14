/** 动作结束时要停止的膨胀实例，以及要恢复的实体忽略设置。键为程序动作槽位。 */
export interface TimeDilationActionState {
  readonly instanceIds: Map<number, readonly number[]>;
  readonly ignoredEntityIds: Map<number, readonly string[]>;
}

export function createTimeDilationActionState(): TimeDilationActionState {
  return { instanceIds: new Map(), ignoredEntityIds: new Map() };
}
