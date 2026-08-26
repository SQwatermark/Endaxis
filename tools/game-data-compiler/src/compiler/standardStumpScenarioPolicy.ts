/**
 * 固定木桩场景允许省略的 Buff 事件。
 * 这里只描述场景中可证明不会发生的事实；公共 Buff 解析和投影仍保持严格，不全局吞掉事件。
 */
const OMITTED_BUFF_ABILITY_EVENT_REASONS: Readonly<Record<string, string>> = {
  OnTakeDamage: 'player damage taken cannot occur without enemy active behavior',
  OnTrulyExitFight: 'fixed timeline does not leave combat before the simulation ends',
};

export function standardStumpBuffAbilityEventOmissionReason(event: string | number): string | null {
  return typeof event === 'string' ? (OMITTED_BUFF_ABILITY_EVENT_REASONS[event] ?? null) : null;
}

/** 固定木桩初始满血时严格求值原生生命比例比较。 */
export function evaluateStandardStumpFullHealthComparison(
  comparison: string,
  value: number,
): boolean {
  switch (comparison) {
    case 'GE':
      return 1 >= value;
    case 'GT':
      return 1 > value;
    case 'LE':
      return 1 <= value;
    case 'LT':
      return 1 < value;
    case 'EQ':
      return 1 === value;
    case 'NE':
      return 1 !== value;
    default:
      throw new Error(`unsupported current HP ratio comparison ${JSON.stringify(comparison)}`);
  }
}
