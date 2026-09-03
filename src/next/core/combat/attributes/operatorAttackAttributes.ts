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
import {
  ATTRIBUTE_MODIFIER_SOURCES,
  CombatAttributeModifier,
  CombatAttributeSet,
  attributeModifierValues,
} from './combatAttributes';
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
  | 'Def'
  | 'PhysicalAndSpellInflictionEnhance'
  | 'NormalAttackRange'
  | 'AtbCostAddition'
  | 'ComboSkillCooldownRecoveryScalar'
  | 'KeywordSpeedUpScalar'
  | 'SlowActionSpeedScalar'
  | 'UltimateSpGainScalar'
  | 'KnockDownTimeAddition'
  | 'criticalRate'
  | 'weaknessDamageMultiplier'
  | 'shelterDamageMultiplier'
  | 'criticalDamageIncrease'
  | 'healOutputIncrease'
  | 'healTakenIncrease';

export interface OperatorAttackDerivationInput {
  readonly attributes: Readonly<Record<OperatorAttribute, number>>;
  readonly attackBeforeAttributeScalar: number;
  /** 构筑完成后的面板防御；原生 MultiplyAttributeCalculation 使用 Def 键读取。 */
  readonly defense?: number;
  /** 面板术法强度就是原生 PhysicalAndSpellInflictionEnhance(87) 的构筑期值。 */
  readonly artsIntensity?: number;
  readonly ultimateEnergyGainEfficiency?: number;
  readonly criticalRate?: number;
  readonly criticalDamage?: number;
  readonly mainAttribute: OperatorAttribute;
  readonly secondaryAttribute: OperatorAttribute;
  readonly combatModifiers?: readonly {
    readonly kind: string;
    readonly target?: string;
    readonly slot?: string;
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
  result.define('Def', input.defense ?? 0, { minimum: 0, maximum: 1000000 });
  result.define('PhysicalAndSpellInflictionEnhance', input.artsIntensity ?? 0, {
    minimum: 0,
  });
  // VFS AttributeMetaTable[12]：默认 1，且没有原生上下限。固定零距离模型不消费
  // 射程，但仍必须承载技能 Buff 对该属性的修改，不能因“距离恒为 0”丢失原始状态。
  result.define('NormalAttackRange', 1, {});
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
  for (const modifier of input.combatModifiers ?? []) {
    if (
      modifier.kind !== 'damageScale' ||
      typeof modifier.target !== 'string' ||
      typeof modifier.value !== 'number'
    ) {
      continue;
    }
    const attribute = EQUIPMENT_DAMAGE_SCALE_ATTRIBUTES[modifier.target];
    if (attribute === undefined) continue;
    const slot = modifier.slot === 'addition' ? 'addition' : 'baseAddition';
    result.addModifier(
      new CombatAttributeModifier(
        attribute,
        attributeModifierValues(slot, modifier.value),
        ATTRIBUTE_MODIFIER_SOURCES.equipment,
        'deck',
      ),
    );
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
  // 完整面板必须进入同一属性公式；只保存增量会使最终乘法绕过静态暴击率/暴伤。
  result.define('criticalRate', input.criticalRate ?? 0, {});
  result.define('criticalDamageIncrease', input.criticalDamage ?? 0, {});
  // AttributeType.WeaknessDmgScalar 是玩家伤害公式的攻击方独立乘区，原生基值为 1。
  result.define('weaknessDamageMultiplier', 1, {});
  // AttributeMetaTable[45]: default 0, no min/max.
  result.define('AtbCostAddition', 0, {});
  // AttributeMetaTable[34]：倒地请求读取来源的时长加成，默认 0、下限 0、无上限。
  result.define('KnockDownTimeAddition', 0, { minimum: 0 });
  // AttributeMetaTable[63]：默认 0、无上下限；保存关键词属性不表示模拟干员受击。
  result.define('shelterDamageMultiplier', 0, {});
  // AttributeMetaTable[93]: default 1, minimum 0, no maximum.
  result.define('ComboSkillCooldownRecoveryScalar', 1, { minimum: 0 });
  // AttributeMetaTable[92]：关键词“加速”的原生倍率，默认 1，范围 [0.1, 1.3]。
  // 固定站桩模型未必消费其动作速度，但汤汤等 Buff 仍会按原生槽位修改它。
  result.define('KeywordSpeedUpScalar', 1, { minimum: 0.1, maximum: 1.3 });
  // combat-spec derived-attributes：该原生属性默认 0，只派生移动速度；固定零距离模型仍须承载 Buff。
  result.define('SlowActionSpeedScalar', 0, {});
  // AttributeMetaTable[44]: 正向终结技能量回复在每次结算时读取该动态属性。
  result.define('UltimateSpGainScalar', input.ultimateEnergyGainEfficiency ?? 1, {
    minimum: 0,
  });
  return result;
}

const EQUIPMENT_DAMAGE_SCALE_ATTRIBUTES: Readonly<Record<string, DamageScaleAttributeKey>> = {
  normalAttack: 'normalAttackDamageIncrease',
  battleSkill: 'normalSkillDamageIncrease',
  comboSkill: 'comboSkillDamageIncrease',
  ultimate: 'ultimateSkillDamageIncrease',
  physical: 'physicalDamageIncrease',
  heat: 'heatDamageIncrease',
  electric: 'electricDamageIncrease',
  cryo: 'cryoDamageIncrease',
  nature: 'natureDamageIncrease',
  ether: 'etherDamageIncrease',
  staggeredEnemy: 'damageToStaggeredEnemyIncrease',
};

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
