/**
 * 定义时间轴视图缩放的边界与换算规则。
 * 缩放属于编辑器会话状态，不进入存档；调用方只应把换算后的每帧像素传给几何函数。
 */
export const DEFAULT_TIMELINE_PX_PER_FRAME = 2;
export const MIN_TIMELINE_ZOOM_PERCENT = 50;
export const MAX_TIMELINE_ZOOM_PERCENT = 200;

export function normalizeTimelineZoomPercent(percent: number): number {
  if (!Number.isFinite(percent)) return 100;
  return Math.min(
    MAX_TIMELINE_ZOOM_PERCENT,
    Math.max(MIN_TIMELINE_ZOOM_PERCENT, Math.round(percent)),
  );
}

export function timelinePxPerFrame(percent: number): number {
  return (DEFAULT_TIMELINE_PX_PER_FRAME * normalizeTimelineZoomPercent(percent)) / 100;
}
