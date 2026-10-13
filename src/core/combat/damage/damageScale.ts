// 纯数据契约由独立包唯一声明；此路径保留兼容导出。
export {
  DAMAGE_SCALE_ZONES,
  type DamageScaleZone,
  DAMAGE_SCALE_SIDES,
  type DamageScaleSide,
} from '../../../../packages/game-data-contract/src/modifiers.ts';
import {
  DAMAGE_SCALE_ZONES,
  type DamageScaleSide,
  type DamageScaleZone,
} from '../../../../packages/game-data-contract/src/modifiers.ts';
export type { AppliedDamageModifier, DamageModifierResult } from '../state/foundationState';
function createInitialValues(): Record<DamageScaleZone, number> {
  return Object.fromEntries(DAMAGE_SCALE_ZONES.map(zone => [zone, 1])) as Record<
    DamageScaleZone,
    number
  >;
}

/** 最终伤害公式前使用的、已还原的七区间累加器。 */
export class DamageScaleAccumulator {
  readonly #attacker = createInitialValues();
  readonly #defender = createInitialValues();

  modify(side: DamageScaleSide, zone: DamageScaleZone, addition: number): void {
    const values = side === 'attacker' ? this.#attacker : this.#defender;
    values[zone] = zone === 'product' ? values[zone] * (1 + addition) : values[zone] + addition;
  }

  getSideValue(side: DamageScaleSide, zone: DamageScaleZone): number {
    return (side === 'attacker' ? this.#attacker : this.#defender)[zone];
  }

  getZoneValue(zone: DamageScaleZone): number {
    // 同侧仅独立乘区连乘，其余乘区加算；攻防双方在所有乘区中均相乘。
    const value = this.#attacker[zone] * this.#defender[zone];
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }

  getFinalValue(): number {
    let value = 1;
    for (const zone of DAMAGE_SCALE_ZONES) value *= this.getZoneValue(zone);
    return value;
  }
}
