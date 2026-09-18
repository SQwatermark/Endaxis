interface HorizontalScrollTarget {
  scrollLeft: number;
}

/** 原生 scroll 事件异步派发；同步写入不能再次作为新的滚动输入回传。 */
export function createTimelineScrollSync() {
  const observed = new WeakMap<HorizontalScrollTarget, number>();
  return (source: HorizontalScrollTarget, target: HorizontalScrollTarget): void => {
    const left = source.scrollLeft;
    if (observed.get(source) === left) return;
    observed.set(source, left);
    if (Math.abs(target.scrollLeft - left) > 0.5) target.scrollLeft = left;
    // 保存实际值，兼容浏览器对范围和小数像素的限位。
    observed.set(target, target.scrollLeft);
  };
}
