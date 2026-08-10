/**
 * Next 时间轴 UI 共用的整数帧几何换算。
 * 准备阶段显示在战斗第 0 帧左侧，但项目和模拟中的帧身份保持不变。
 */
export function frameToTimelinePx(frame: number, prepFrames: number, pxPerFrame: number): number {
  return (frame + prepFrames) * pxPerFrame;
}

export function timelinePxToFrame(px: number, prepFrames: number, pxPerFrame: number): number {
  if (!(pxPerFrame > 0)) throw new RangeError('pxPerFrame must be positive');
  return Math.round(px / pxPerFrame - prepFrames);
}

export function timelineTotalWidth(
  prepFrames: number,
  durationFrames: number,
  pxPerFrame: number,
): number {
  return (prepFrames + durationFrames) * pxPerFrame;
}

export interface TimelineCursorGuidePosition {
  /** 辅助线在时间轴内容区内的真实像素位置。 */
  readonly leftPx: number;
  /** 该位置对应的可采样战斗帧；准备区统一采样第 0 帧。 */
  readonly sampleFrame: number;
}

/**
 * 将鼠标位置解析为悬停辅助线位置和模拟采样帧。
 *
 * 辅助线必须紧跟鼠标，不能吸附到编辑光标；采样帧则必须限制在有效战斗区间。
 */
export function resolveTimelineCursorGuidePosition(
  pointerPx: number,
  prepFrames: number,
  durationFrames: number,
  pxPerFrame: number,
): TimelineCursorGuidePosition {
  const width = timelineTotalWidth(prepFrames, durationFrames, pxPerFrame);
  const leftPx = Math.max(0, Math.min(width, pointerPx));
  const sampleFrame = Math.max(
    0,
    Math.min(durationFrames, timelinePxToFrame(leftPx, prepFrames, pxPerFrame)),
  );
  return { leftPx, sampleFrame };
}
