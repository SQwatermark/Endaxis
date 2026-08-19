import { snapTimelineFrame } from './timelineSnap';

export interface TimelineCastMoveFrame {
  readonly placementFrame: number;
  readonly actualFrame: number;
}

/**
 * 技能块位置就是实际战斗帧。时间膨胀映射不参与写回，因而前置或自身
 * 时间膨胀都不能反向改变玩家已经选择的现实落点。
 */
export function resolveTimelineCastMoveFrame(input: {
  readonly pointerActualFrame: number;
  readonly pointerOffsetActualFrames: number;
  readonly snapFrames: number;
  readonly actualMaximumFrame: number;
}): TimelineCastMoveFrame {
  const actualFrame = snapTimelineFrame(
    Math.max(0, input.pointerActualFrame - input.pointerOffsetActualFrames),
    input.snapFrames,
    input.actualMaximumFrame,
  );
  return Object.freeze({ actualFrame, placementFrame: actualFrame });
}
