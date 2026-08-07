import type { DamageTag, DamageType } from '../../game-data/operatorDefinition';
import { DamageScaleAccumulator } from './damageScale';

export const DAMAGE_SCALE_CLASSIFICATIONS = [
  'normalAttack',
  'normalSkill',
  'comboSkill',
  'ultimateSkill',
  'fireBurst',
  'electricBurst',
  'cryoBurst',
  'natureBurst',
  'fireAbnormal',
  'electricAbnormal',
  'cryoAbnormal',
  'natureAbnormal',
] as const;
export type DamageScaleClassification = (typeof DAMAGE_SCALE_CLASSIFICATIONS)[number];

export const DAMAGE_SCALE_ATTRIBUTE_KEYS = [
  'physicalDamageIncrease',
  'heatDamageIncrease',
  'electricDamageIncrease',
  'cryoDamageIncrease',
  'natureDamageIncrease',
  'etherDamageIncrease',
  'normalAttackDamageIncrease',
  'normalSkillDamageIncrease',
  'comboSkillDamageIncrease',
  'ultimateSkillDamageIncrease',
  'damageToStaggeredEnemyIncrease',
  'fireBurstDamageIncrease',
  'electricBurstDamageIncrease',
  'cryoBurstDamageIncrease',
  'natureBurstDamageIncrease',
  'fireAbnormalDamageIncrease',
  'electricAbnormalDamageIncrease',
  'cryoAbnormalDamageIncrease',
  'natureAbnormalDamageIncrease',
  'physicalEnhancedDamageIncrease',
  'heatEnhancedDamageIncrease',
  'electricEnhancedDamageIncrease',
  'cryoEnhancedDamageIncrease',
  'natureEnhancedDamageIncrease',
  'etherEnhancedDamageIncrease',
  'physicalVulnerabilityIncrease',
  'heatVulnerabilityIncrease',
  'electricVulnerabilityIncrease',
  'cryoVulnerabilityIncrease',
  'natureVulnerabilityIncrease',
  'etherVulnerabilityIncrease',
] as const;
export type DamageScaleAttributeKey = (typeof DAMAGE_SCALE_ATTRIBUTE_KEYS)[number];
export type DamageScaleAttributeSnapshot = Readonly<Record<DamageScaleAttributeKey, number>>;

export interface InjectDamageScaleAttributesInput {
  readonly damageType: DamageType;
  readonly classifications: readonly DamageScaleClassification[];
  readonly attacker: DamageScaleAttributeSnapshot;
  readonly defender: DamageScaleAttributeSnapshot;
  readonly defenderStaggered: boolean;
}

const SKILL_CLASSIFICATION_ATTRIBUTES: Partial<
  Record<DamageScaleClassification, DamageScaleAttributeKey>
> = {
  normalAttack: 'normalAttackDamageIncrease',
  normalSkill: 'normalSkillDamageIncrease',
  comboSkill: 'comboSkillDamageIncrease',
  ultimateSkill: 'ultimateSkillDamageIncrease',
};

const ABNORMAL_CLASSIFICATION_ATTRIBUTES: Partial<
  Record<DamageScaleClassification, DamageScaleAttributeKey>
> = {
  fireBurst: 'fireBurstDamageIncrease',
  electricBurst: 'electricBurstDamageIncrease',
  cryoBurst: 'cryoBurstDamageIncrease',
  natureBurst: 'natureBurstDamageIncrease',
  fireAbnormal: 'fireAbnormalDamageIncrease',
  electricAbnormal: 'electricAbnormalDamageIncrease',
  cryoAbnormal: 'cryoAbnormalDamageIncrease',
  natureAbnormal: 'natureAbnormalDamageIncrease',
};

const TYPED_ATTRIBUTES: Partial<
  Record<
    DamageType,
    {
      readonly damageIncrease: DamageScaleAttributeKey;
      readonly enhanced: DamageScaleAttributeKey;
      readonly vulnerability: DamageScaleAttributeKey;
    }
  >
> = {
  physical: {
    damageIncrease: 'physicalDamageIncrease',
    enhanced: 'physicalEnhancedDamageIncrease',
    vulnerability: 'physicalVulnerabilityIncrease',
  },
  heat: {
    damageIncrease: 'heatDamageIncrease',
    enhanced: 'heatEnhancedDamageIncrease',
    vulnerability: 'heatVulnerabilityIncrease',
  },
  electric: {
    damageIncrease: 'electricDamageIncrease',
    enhanced: 'electricEnhancedDamageIncrease',
    vulnerability: 'electricVulnerabilityIncrease',
  },
  cryo: {
    damageIncrease: 'cryoDamageIncrease',
    enhanced: 'cryoEnhancedDamageIncrease',
    vulnerability: 'cryoVulnerabilityIncrease',
  },
  nature: {
    damageIncrease: 'natureDamageIncrease',
    enhanced: 'natureEnhancedDamageIncrease',
    vulnerability: 'natureVulnerabilityIncrease',
  },
  ether: {
    damageIncrease: 'etherDamageIncrease',
    enhanced: 'etherEnhancedDamageIncrease',
    vulnerability: 'etherVulnerabilityIncrease',
  },
};

/** 将已还原的属性到区间映射应用到现有累加器。 */
export function injectDamageScaleAttributes(
  accumulator: DamageScaleAccumulator,
  input: InjectDamageScaleAttributesInput,
): void {
  const typed = getTypedAttributes(input.damageType);
  if (typed !== undefined) {
    accumulator.modify('attacker', 'normal', input.attacker[typed.damageIncrease]);
  }

  for (const classification of input.classifications) {
    const skillAttribute = SKILL_CLASSIFICATION_ATTRIBUTES[classification];
    if (skillAttribute !== undefined) {
      accumulator.modify('attacker', 'normal', input.attacker[skillAttribute]);
    }
    const abnormalAttribute = ABNORMAL_CLASSIFICATION_ATTRIBUTES[classification];
    if (abnormalAttribute !== undefined) {
      accumulator.modify('attacker', 'abnormalAndBurst', input.attacker[abnormalAttribute]);
    }
  }

  if (input.defenderStaggered) {
    accumulator.modify('attacker', 'normal', input.attacker.damageToStaggeredEnemyIncrease);
  }
  if (typed !== undefined) {
    accumulator.modify('attacker', 'enhanced', input.attacker[typed.enhanced]);
    accumulator.modify('defender', 'vulnerable', input.defender[typed.vulnerability]);
  }
}

/** 转换新版干员 DSL 表达的主动技能分类。 */
export function classifyDamageTags(
  tags: readonly DamageTag[],
): readonly DamageScaleClassification[] {
  const classifications: DamageScaleClassification[] = [];
  if (
    tags.some(tag =>
      [
        'normalAttack',
        'normalAttackLastCombo',
        'powerAttack',
        'plungingAttack',
        'dashAttack',
      ].includes(tag),
    )
  ) {
    classifications.push('normalAttack');
  }
  if (tags.includes('normalSkill')) classifications.push('normalSkill');
  if (tags.includes('comboSkill')) classifications.push('comboSkill');
  if (tags.includes('ultimateSkill')) classifications.push('ultimateSkill');
  return classifications;
}

function getTypedAttributes(damageType: DamageType):
  | {
      readonly damageIncrease: DamageScaleAttributeKey;
      readonly enhanced: DamageScaleAttributeKey;
      readonly vulnerability: DamageScaleAttributeKey;
    }
  | undefined {
  return TYPED_ATTRIBUTES[damageType];
}
