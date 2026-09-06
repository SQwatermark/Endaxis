export type MonitorSectionKey = 'affliction' | 'poise' | 'sp';

export const MONITOR_SECTION_TOPBAR_HEIGHT = 14;

/** 状态区由实际图标行数决定高度；CSS 和分隔线拖动必须使用同一下限。 */
export function monitorSectionBodyMinimums(afflictionHeight = 60) {
  return {
    affliction: Math.max(46, afflictionHeight - MONITOR_SECTION_TOPBAR_HEIGHT),
    poise: 26,
    sp: 52,
  } satisfies Record<MonitorSectionKey, number>;
}
