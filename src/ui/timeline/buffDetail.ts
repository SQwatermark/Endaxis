/**
 * Buff 详情面板只消费已经投影出的展示事实，不回查运行时，也不承担游戏规则解释。
 * 时间轴状态段、敌人状态段和光标 HUD 共用这一份稳定的 UI 数据契约。
 */
export interface BuffDetailTarget {
  readonly title: string;
  readonly buffId: string;
  readonly targetId: string;
  readonly sourceName?: string;
  readonly startFrame: number;
  readonly endFrame: number;
  readonly layers: number;
  readonly icon?: string | null;
  readonly modifierSummary?: string;
}
