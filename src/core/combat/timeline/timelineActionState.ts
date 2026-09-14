/**
 * 时间轴调度进度。活动项与进入中的项只保存程序数组下标，不保存动作对象。
 * starting 相关字段用于同步跳转和中断；它们不允许作为帧中保存入口。
 */
export interface TimelineActionState {
  readonly active: number[];
  nextPendingIndex: number;
  starting: number | null;
  startingCrossedByJump: boolean;
  startingJumpDestination: number | null;
  ended: boolean;
}

export function createTimelineActionState(): TimelineActionState {
  return {
    active: [],
    nextPendingIndex: 0,
    starting: null,
    startingCrossedByJump: false,
    startingJumpDestination: null,
    ended: false,
  };
}
