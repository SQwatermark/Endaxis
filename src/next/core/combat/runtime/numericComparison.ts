/**
 * 集中实现原生浮点比较的容差语义，供动作黑板与 Buff 查询等条件复用。
 * 调用方应传入已经解析到当前技能等级的有限数值。
 */
import type { ComparisonOperator } from '../../game-data/operatorDefinition';

export const COMBAT_FLOAT_COMPARISON_TOLERANCE = 1e-5;

export function compareCombatNumbers(
  left: number,
  right: number,
  operator: ComparisonOperator,
): boolean {
  switch (operator) {
    case 'less':
      return left < right - COMBAT_FLOAT_COMPARISON_TOLERANCE;
    case 'lessOrEqual':
      return left <= right + COMBAT_FLOAT_COMPARISON_TOLERANCE;
    case 'greater':
      return left > right + COMBAT_FLOAT_COMPARISON_TOLERANCE;
    case 'greaterOrEqual':
      return left >= right - COMBAT_FLOAT_COMPARISON_TOLERANCE;
    case 'equal':
      return Math.abs(left - right) <= COMBAT_FLOAT_COMPARISON_TOLERANCE;
    case 'notEqual':
      return Math.abs(left - right) > COMBAT_FLOAT_COMPARISON_TOLERANCE;
  }
}
