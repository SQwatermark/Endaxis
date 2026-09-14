/** 时间轴跳转动作的进度；恢复时必须同时恢复一次性标记和首次 Tick 标记。 */
export interface TimelineJumpState {
  jumped: boolean;
  skipInitialTick: boolean;
}

export function createTimelineJumpState(): TimelineJumpState {
  return { jumped: false, skipInitialTick: false };
}
