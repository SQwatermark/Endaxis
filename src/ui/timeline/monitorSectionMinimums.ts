export type MonitorSectionKey = 'affliction' | 'poise' | 'sp';

export const MONITOR_SECTION_TOPBAR_HEIGHT = 14;

/** 从实际显示高度开始拖动，不能复用已被 min-height 约束改变比例的旧权重。 */
export function resizeMonitorSectionBodies(
  bodies: Partial<Record<MonitorSectionKey, number>>,
  upper: MonitorSectionKey,
  lower: MonitorSectionKey,
  delta: number,
  minimums: Record<MonitorSectionKey, number>,
) {
  const upperBody = bodies[upper] ?? 0;
  const total = upperBody + (bodies[lower] ?? 0);
  const scale = Math.min(1, total / Math.max(1, minimums[upper] + minimums[lower]));
  const nextUpper = Math.min(
    total - minimums[lower] * scale,
    Math.max(minimums[upper] * scale, upperBody + delta),
  );
  return { ...bodies, [upper]: nextUpper, [lower]: total - nextUpper };
}

/** 状态区由实际图标行数决定高度；CSS 和分隔线拖动必须使用同一下限。 */
export function monitorSectionBodyMinimums(afflictionHeight = 60) {
  return {
    affliction: Math.max(46, afflictionHeight - MONITOR_SECTION_TOPBAR_HEIGHT),
    poise: 26,
    sp: 52,
  } satisfies Record<MonitorSectionKey, number>;
}
