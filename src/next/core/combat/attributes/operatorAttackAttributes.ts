/**
 * 将构筑期四维和运行时攻击派生系数接入同一属性集。
 * Buff 必须修改这里的原生系数属性；伤害快照再从同一实例读取动态攻击。
 */
import type { OperatorAttribute } from '../../game-data/operatorDefinition';
import {
  HEAL_OUTPUT_INCREASE_PER_WILL,
  HEAL_TAKEN_INCREASE_PER_WILL,
  MAIN_ATTRIBUTE_ATTACK_FACTOR,
  SECONDARY_ATTRIBUTE_ATTACK_FACTOR,
} from '../../game-data/battleConstants';
import { CombatAttributeSet } from './combatAttributes';
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeKey,
} from '../damage/damageScaleAttributes';

export const ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE = {
  strength: 'AtkIncreaseFactorFromStr',
  agility: 'AtkIncreaseFactorFromAgi',
  intellect: 'AtkIncreaseFactorFromWisd',
  will: 'AtkIncreaseFactorFromWill',
} as const satisfies Readonly<Record<OperatorAttribute, string>>;

export type AttackFactorAttribute =
  (typeof ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE)[OperatorAttribute];
export type OperatorRuntimeAttribute =
  | OperatorAttribute
  | AttackFactorAttribute
  | DamageScaleAttributeKey
  | 'Atk'
  | 'PhysicalAndSpellInflictionEnhance'
  | 'AtbCostAddition'
  | 'ComboSkillCooldownRecoveryScalar'
  | 'criticalRate'
  | 'criticalDamageIncrease'
  | 'healOutputIncrease'
  | 'healTakenIncrease';

export interface OperatorAttackDerivationInput {
  readonly attributes: Readonly<Record<OperatorAttribute, number>>;
  readonly attackBeforeAttributeScalar: number;
  /** 面板术法强度就是原生 PhysicalAndSpellInflictionEnhance(87) 的构筑期值。 */
  readonly artsIntensity?: number;
  readonly mainAttribute: OperatorAttribute;
  readonly secondaryAttribute: OperatorAttribute;
  readonly combatModifiers?: readonly {
    readonly kind: string;
    readonly target?: string;
    readonly value?: number;
  }[];
}

/** 按原生属性元数据和主副属性规则创建一场战斗独占的属性集。 */
export function createOperatorAttackAttributes(
  input: OperatorAttackDerivationInput,
): CombatAttributeSet<OperatorRuntimeAttribute> {
  const result = new CombatAttributeSet<OperatorRuntimeAttribute>();
  // 原生 Atk/BaseMultiplier Buff（例如佩丽卡潜能 3）修正的是属性换算前攻击基数。
  result.define('Atk', input.attackBeforeAttributeScalar, { minimum: 0, maximum: 1000000 });
  result.define('PhysicalAndSpellInflictionEnhance', input.artsIntensity ?? 0, {
    minimum: 0,
  });
  for (const attribute of Object.keys(
    ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE,
  ) as OperatorAttribute[]) {
    result.define(attribute, input.attributes[attribute], { minimum: 0, maximum: 100000 });
    const factorAttribute = ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE[attribute];
    let baseFactor = 0;
    if (input.mainAttribute === attribute) baseFactor += MAIN_ATTRIBUTE_ATTACK_FACTOR;
    if (input.secondaryAttribute === attribute) baseFactor += SECONDARY_ATTRIBUTE_ATTACK_FACTOR;
    result.define(factorAttribute, 0, { otherAttributeBaseAddition: baseFactor });
  }
  for (const attribute of DAMAGE_SCALE_ATTRIBUTE_KEYS) {
    result.define(attribute, 0, {});
  }
  const staticHealing = (input.combatModifiers ?? []).reduce(
    (total, modifier) => {
      if (
        modifier.kind === 'staticHealingIncrease' &&
        (modifier.target === 'output' || modifier.target === 'taken') &&
        typeof modifier.value === 'number'
      ) {
        total[modifier.target] += modifier.value;
      }
      return total;
    },
    { output: 0, taken: 0 },
  );
  result.define('healOutputIncrease', staticHealing.output, {
    otherAttributeBaseAddition: Math.floor(input.attributes.will) * HEAL_OUTPUT_INCREASE_PER_WILL,
  });
  result.define('healTakenIncrease', staticHealing.taken, {
    otherAttributeBaseAddition: Math.floor(input.attributes.will) * HEAL_TAKEN_INCREASE_PER_WILL,
  });
  // 面板值仍由构筑层持有；这里保存战斗中 Buff 产生的即时增量。
  result.define('criticalRate', 0, {});
  result.define('criticalDamageIncrease', 0, {});
  // AttributeMetaTable[45]: default 0, no min/max.
  result.define('AtbCostAddition', 0, {});
  // AttributeMetaTable[93]: default 1, minimum 0, no maximum.
  result.define('ComboSkillCooldownRecoveryScalar', 1, { minimum: 0 });
  return result;
}

/** 在命中时读取当前系数；返回值继续保持现有面板与伤害输入使用的整数攻击。 */
export function resolveOperatorAttack(
  input: OperatorAttackDerivationInput,
  attributes: CombatAttributeSet<string>,
): number {
  let scalar = 1;
  for (const attribute of Object.keys(
    ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE,
  ) as OperatorAttribute[]) {
    scalar +=
      Math.floor(attributes.get(attribute)) *
      attributes.get(ATTACK_FACTOR_ATTRIBUTE_BY_OPERATOR_ATTRIBUTE[attribute]);
  }
  const attackBase = attributes.has('Atk')
    ? attributes.get('Atk')
    : input.attackBeforeAttributeScalar;
  return Math.floor(attackBase * scalar);
}
