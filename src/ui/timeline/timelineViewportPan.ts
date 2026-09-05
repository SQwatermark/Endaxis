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
