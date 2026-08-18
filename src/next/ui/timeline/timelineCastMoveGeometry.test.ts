import { describe, expect, it } from 'vitest';
import type { TimelineDisplayTime } from './timelineDisplayTime';
import { resolveTimelineCastMoveFrame } from './timelineCastMoveGeometry';

describe('timeline cast move geometry', () => {
  it('keeps the moving block at the pointer even when its frozen mapping contains a time stop', () => {
    const displayTime: TimelineDisplayTime = {
      logicalDurationFrames: 20,
      actualDurationFrames: 30,
      // 10..20 是被拖技能旧位置产生的停时区间。
      toLogicalFrame: actualFrame =>
        actualFrame <= 10 ? actualFrame : actualFrame <= 20 ? 10 : actualFrame - 10,
      toActualFrame: logicalFrame => (logicalFrame < 10 ? logicalFrame : logicalFrame + 10),
    };

    const frame = resolveTimelineCastMoveFrame({
      displayTime,
      pointerActualFrame: 18,
      pointerOffsetActualFrames: 2,
      anchorLogicalFrame: 10,
      anchorActualFrame: 10,
      snapFrames: 1,
      logicalMaximumFrame: 20,
    });

    expect(frame).toEqual({ actualFrame: 16, logicalFrame: 16 });
    // 旧映射会把 16 反算到停时平台的逻辑帧 10；因果锚点必须排除这个技能自身的影响。
    expect(displayTime.toLogicalFrame(frame.actualFrame)).toBe(10);
  });

  it('uses pointer delta instead of the published mapping in both directions', () => {
    const displayTime: TimelineDisplayTime = {
      logicalDurationFrames: 30,
      actualDurationFrames: 40,
      toLogicalFrame: actualFrame => actualFrame / 2,
      toActualFrame: logicalFrame => logicalFrame * 2,
    };

    expect(
      resolveTimelineCastMoveFrame({
        displayTime,
        pointerActualFrame: 8,
        pointerOffsetActualFrames: 0,
        anchorLogicalFrame: 20,
        anchorActualFrame: 20,
        snapFrames: 1,
        logicalMaximumFrame: 30,
      }),
    ).toEqual({ actualFrame: 8, logicalFrame: 8 });
  });
});
