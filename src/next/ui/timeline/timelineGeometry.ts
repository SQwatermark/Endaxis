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
