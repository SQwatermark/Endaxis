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
import {
  resolveDamageContributionSourceShares,
  type DamageContributionAttribution,
  type DamageContributionLogEffect,
  type DamageContributionSource,
} from './damageContribution';
interface DamageScaleZoneDefinition {
  readonly multiplyWithinSide: boolean;
  readonly mergeSidesAdditively: boolean;
}

interface DamageScaleOperation {
  readonly side: DamageScaleSide;
  readonly zone: DamageScaleZone;
  readonly addition: number;
  readonly source?: DamageContributionSource;
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
  readonly #operations: DamageScaleOperation[] = [];

  modify(
    side: DamageScaleSide,
    zone: DamageScaleZone,
    addition: number,
    sources?: DamageContributionAttribution,
  ): void {
    const values = side === 'attacker' ? this.#attacker : this.#defender;
    const definition = ZONE_DEFINITIONS[zone];
    values[zone] = definition.multiplyWithinSide
      ? values[zone] * (1 + addition)
      : values[zone] + addition;
    const normalized = resolveDamageContributionSourceShares(sources);
    if (normalized.length === 0) {
      this.#operations.push({ side, zone, addition });
      return;
    }
    // 非正乘数无法做对数分解；保留实际值并留在自身项，不制造错误来源。
    if (definition.multiplyWithinSide && 1 + addition <= 0) {
      this.#operations.push({ side, zone, addition });
      return;
    }
    const totalWeight = normalized.reduce((sum, share) => sum + share.weight, 0);
    for (const share of normalized) {
      const ratio = share.weight / totalWeight;
      const splitAddition = definition.multiplyWithinSide
        ? (1 + addition) ** ratio - 1
        : addition * ratio;
      this.#operations.push({ side, zone, addition: splitAddition, source: share });
    }
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

  /** 只移除其他干员提供的已登记修正，得到本次攻击的自身乘区倍率。 */
  getSelfValue(attackerId: string): number {
    return this.#getFinalValue(
      operation =>
        operation.source?.providerOperatorId === null ||
        operation.source?.providerOperatorId === undefined ||
        operation.source.providerOperatorId === attackerId,
    );
  }

  /** 返回各外部来源对七乘区总倍率的对数影响；各项之和等于实际/自身倍率的对数。 */
  getContributionLogEffects(attackerId: string): readonly DamageContributionLogEffect[] {
    const effects: DamageContributionLogEffect[] = [];
    for (const zone of DAMAGE_SCALE_ZONES) {
      const actual = this.getZoneValue(zone);
      const self = this.#getZoneValue(
        zone,
        operation =>
          operation.source?.providerOperatorId === null ||
          operation.source?.providerOperatorId === undefined ||
          operation.source.providerOperatorId === attackerId,
      );
      if (actual <= 0 || self <= 0 || Math.abs(actual - self) <= Number.EPSILON) continue;
      const external = this.#operations.filter(
        operation =>
          operation.zone === zone &&
          operation.source?.providerOperatorId !== null &&
          operation.source?.providerOperatorId !== undefined &&
          operation.source.providerOperatorId !== attackerId,
      );
      if (external.length === 0) continue;
      const zoneLogEffect = Math.log(actual / self);
      const totalWeight = external.reduce(
        (sum, operation) =>
          sum +
          (ZONE_DEFINITIONS[zone].multiplyWithinSide
            ? Math.abs(Math.log(1 + operation.addition))
            : Math.abs(operation.addition)),
        0,
      );
      if (totalWeight <= Number.EPSILON) continue;
      for (const operation of external) {
        const weight = ZONE_DEFINITIONS[zone].multiplyWithinSide
          ? Math.abs(Math.log(1 + operation.addition))
          : Math.abs(operation.addition);
        effects.push({
          ...operation.source!,
          logEffect: zoneLogEffect * (weight / totalWeight),
        });
      }
    }
    return effects;
  }

  #getFinalValue(include: (operation: DamageScaleOperation) => boolean): number {
    let value = 1;
    for (const zone of DAMAGE_SCALE_ZONES) value *= this.#getZoneValue(zone, include);
    return value;
  }

  #getZoneValue(
    zone: DamageScaleZone,
    include: (operation: DamageScaleOperation) => boolean,
  ): number {
    let attacker = 1;
    let defender = 1;
    const definition = ZONE_DEFINITIONS[zone];
    for (const operation of this.#operations) {
      if (operation.zone !== zone || !include(operation)) continue;
      if (operation.side === 'attacker') {
        attacker = definition.multiplyWithinSide
          ? attacker * (1 + operation.addition)
          : attacker + operation.addition;
      } else {
        defender = definition.multiplyWithinSide
          ? defender * (1 + operation.addition)
          : defender + operation.addition;
      }
    }
    const value =
      !definition.multiplyWithinSide && definition.mergeSidesAdditively
        ? attacker + defender - 1
        : attacker * defender;
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }
}
