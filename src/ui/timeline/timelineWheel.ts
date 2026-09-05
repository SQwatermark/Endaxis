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
