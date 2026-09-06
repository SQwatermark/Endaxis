import type { HealthDamageReceiptDetail } from './healthDamage';
import type { OperatorAttribute } from '../../game-data/operatorDefinition';

export interface AttackReceiptSnapshot {
  readonly panelAttack: number;
  readonly operatorBaseAttack: number;
  readonly weaponBaseAttack: number;
  readonly attackPercent: number;
  readonly flatAttack: number;
  readonly mainAttribute: OperatorAttribute;
  readonly secondaryAttribute: OperatorAttribute;
  readonly attributes: Readonly<Record<OperatorAttribute, number>>;
  readonly coefficients: Readonly<Record<OperatorAttribute, number>>;
}

/** 仅当明细与本次实际攻击完全对应时冻结，不能拿静态构筑冒充动态属性。 */
export function freezeAttackReceiptDetail(
  attack: number,
  detail: AttackReceiptSnapshot | undefined,
): HealthDamageReceiptDetail {
  if (detail === undefined || Math.abs(detail.panelAttack - attack) > Number.EPSILON) return {};
  return {
    attackDetailOperatorBase: detail.operatorBaseAttack,
    attackDetailWeaponBase: detail.weaponBaseAttack,
    attackDetailAttackPercent: detail.attackPercent,
    attackDetailFlatAttack: detail.flatAttack,
    attackDetailMainAttribute: detail.mainAttribute,
    attackDetailSecondaryAttribute: detail.secondaryAttribute,
    attackDetailStrength: detail.attributes.strength,
    attackDetailAgility: detail.attributes.agility,
    attackDetailIntellect: detail.attributes.intellect,
    attackDetailWill: detail.attributes.will,
    attackDetailStrengthCoefficient: detail.coefficients.strength,
    attackDetailAgilityCoefficient: detail.coefficients.agility,
    attackDetailIntellectCoefficient: detail.coefficients.intellect,
    attackDetailWillCoefficient: detail.coefficients.will,
  };
}
