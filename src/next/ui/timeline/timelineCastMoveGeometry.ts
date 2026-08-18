import type { TimelineDisplayTime } from './timelineDisplayTime';
import { snapTimelineFrame } from './timelineSnap';

export interface TimelineCastMoveFrame {
  readonly logicalFrame: number;
  readonly actualFrame: number;
}

/**
 * 拖动主块的实际帧直接来自鼠标；逻辑帧只用于写回场景。
 * 两者不能再互相回算，否则主块自身产生的时间膨胀会反向改变它的屏幕位置。
 */
export function resolveTimelineCastMoveFrame(input: {
  readonly displayTime: TimelineDisplayTime;
  readonly pointerActualFrame: number;
  readonly pointerOffsetActualFrames: number;
  /** 被拖技能在按下时的场景逻辑起点。 */
  readonly anchorLogicalFrame: number;
  /** 同一技能在已发布回执中的真实开始帧。 */
  readonly anchorActualFrame: number;
  readonly snapFrames: number;
  readonly logicalMaximumFrame: number;
}): TimelineCastMoveFrame {
  const actualFrame = snapTimelineFrame(
    Math.max(0, input.pointerActualFrame - input.pointerOffsetActualFrames),
    input.snapFrames,
    Math.floor(input.displayTime.actualDurationFrames),
  );
  // 与旧版一致，只把鼠标实际位移加到按下时的逻辑起点。旧映射无论在锚点前后
  // 都可能含有被拖技能或其他后续技能产生的冻屏，不能参与反算当前手势。
  const unsnappedLogicalFrame = input.anchorLogicalFrame + actualFrame - input.anchorActualFrame;
  return Object.freeze({
    actualFrame,
    logicalFrame: snapTimelineFrame(
      Math.max(0, Math.round(unsnappedLogicalFrame)),
      input.snapFrames,
      input.logicalMaximumFrame,
    ),
  });
}
