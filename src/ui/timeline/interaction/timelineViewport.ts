/**
 * 定义时间轴视图缩放的边界与换算规则。
 * 缩放属于编辑器会话状态，不进入存档；调用方只应把换算后的每帧像素传给几何函数。
 */
// UI 的 100% 表示 50px / 现实秒；当前模拟帧仍为 30Hz。
export const DEFAULT_TIMELINE_PX_PER_FRAME = 50 / 30;
export const MIN_TIMELINE_ZOOM_PERCENT = 30;
export const MAX_TIMELINE_ZOOM_PERCENT = 2400;

/** 缩放按钮每次增减当前秒宽的约 10%，最小变化 1px / 秒。 */
export function stepTimelineZoomPercent(percent: number, direction: -1 | 1): number {
  return normalizeTimelineZoomPercent(
    percent + direction * Math.max(1, Math.round(percent / 20)) * 2,
  );
}

/** 滚轮按秒宽的 15% 取整到像素，再换回百分比。 */
export function wheelTimelineZoomPercent(percent: number, direction: -1 | 1): number {
  return normalizeTimelineZoomPercent(percent + Math.round((percent / 2) * 0.15 * direction) * 2);
}

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

export type TimelineWheelIntent =
  | { readonly kind: 'zoom'; readonly direction: -1 | 1 }
  | { readonly kind: 'horizontalPan'; readonly deltaPx: number }
  | { readonly kind: 'nativeVerticalScroll' };

/**
 * 复刻旧版时间轴的滚轮修饰键：Ctrl 围绕指针缩放，Shift 横向平移，无修饰键交给原生纵向滚动。
 */
export function resolveTimelineWheelIntent(input: {
  readonly ctrlKey: boolean;
  readonly shiftKey: boolean;
  readonly deltaX: number;
  readonly deltaY: number;
}): TimelineWheelIntent {
  if (input.ctrlKey) {
    return { kind: 'zoom', direction: input.deltaY < 0 ? 1 : -1 };
  }
  if (input.shiftKey) {
    return {
      kind: 'horizontalPan',
      deltaPx: input.deltaY === 0 ? input.deltaX : input.deltaY,
    };
  }
  return { kind: 'nativeVerticalScroll' };
}

/** 计算中键拖拽平移后的滚动位置，独立于 DOM 事件以便验证方向和边界。 */
export interface TimelineViewportPanOrigin {
  readonly pointerX: number;
  readonly pointerY: number;
  readonly scrollLeft: number;
  readonly scrollTop: number;
}

export interface TimelineViewportScrollPosition {
  readonly left: number;
  readonly top: number;
}

export function resolveTimelineViewportPan(
  origin: TimelineViewportPanOrigin,
  pointerX: number,
  pointerY: number,
): TimelineViewportScrollPosition {
  return {
    left: Math.max(0, origin.scrollLeft - (pointerX - origin.pointerX)),
    top: Math.max(0, origin.scrollTop - (pointerY - origin.pointerY)),
  };
}
