/**
 * 属性、Buff 和技能分类汇入最终伤害公式前的统一倍率容器。
 * 调用方必须保留来源方/目标方与区间身份，不能先行压缩为一个总乘区。
 */
export const DAMAGE_SCALE_ZONES = [
  'product',
  'normal',
  'abnormalAndBurst',
  'enhanced',
  'combo',
  'vulnerable',
  'race',
] as const;
/** 七区间伤害倍率中的稳定区间身份。 */
export type DamageScaleZone = (typeof DAMAGE_SCALE_ZONES)[number];

export const DAMAGE_SCALE_SIDES = ['attacker', 'defender'] as const;
/** 区分来源方增伤和目标方易伤/减伤的倍率所有者。 */
export type DamageScaleSide = (typeof DAMAGE_SCALE_SIDES)[number];

interface DamageScaleZoneDefinition {
  readonly multiplyWithinSide: boolean;
  readonly mergeSidesAdditively: boolean;
}

const ZONE_DEFINITIONS: Readonly<Record<DamageScaleZone, DamageScaleZoneDefinition>> = {
  product: { multiplyWithinSide: true, mergeSidesAdditively: false },
  normal: { multiplyWithinSide: false, mergeSidesAdditively: false },
  abnormalAndBurst: { multiplyWithinSide: false, mergeSidesAdditively: false },
  enhanced: { multiplyWithinSide: false, mergeSidesAdditively: false },
  combo: { multiplyWithinSide: false, mergeSidesAdditively: false },
  vulnerable: { multiplyWithinSide: false, mergeSidesAdditively: false },
  race: { multiplyWithinSide: false, mergeSidesAdditively: false },
};

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
    const definition = ZONE_DEFINITIONS[zone];
    values[zone] = definition.multiplyWithinSide
      ? values[zone] * (1 + addition)
      : values[zone] + addition;
  }

  getZoneValue(zone: DamageScaleZone): number {
    const definition = ZONE_DEFINITIONS[zone];
    const attacker = this.#attacker[zone];
    const defender = this.#defender[zone];
    const value =
      !definition.multiplyWithinSide && definition.mergeSidesAdditively
        ? attacker + defender - 1
        : attacker * defender;
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }

  getFinalValue(): number {
    let value = 1;
    for (const zone of DAMAGE_SCALE_ZONES) value *= this.getZoneValue(zone);
    return value;
  }
}
