import {
  projectPrimaryAttributeKey,
  type CompiledAttributeModifierSource,
  type ProjectedPrimaryAttributeSource,
} from '../../compiler/attributeModifier.ts';
import type { AttributeTypeSource } from '../../compiler/attributeModifier.ts';

export type ProjectedEquipmentAttribute = ProjectedPrimaryAttributeSource | 'main' | 'secondary';

export type ProjectedEquipmentPanelStat =
  | 'baseDefense'
  | 'attackFlat'
  | 'attackPercent'
  | 'healthFlat'
  | 'healthPercent'
  | 'criticalRate'
  | 'artsIntensity'
  | 'ultimateEnergyGainEfficiency'
  | 'staggerDamagePercent';

export type ProjectedEquipmentDamageScale =
  | 'normalAttack'
  | 'battleSkill'
  | 'comboSkill'
  | 'ultimate'
  | 'physical'
  | 'heat'
  | 'electric'
  | 'cryo'
  | 'nature'
  | 'ether'
  | 'staggeredEnemy';

export type ProjectedEquipmentModifierSource =
  | {
      readonly kind: 'attribute';
      readonly attribute: ProjectedEquipmentAttribute;
      readonly operation: 'flat' | 'percent';
      readonly value: number;
    }
  | {
      readonly kind: 'panelStat';
      readonly stat: ProjectedEquipmentPanelStat;
      readonly value: number;
    }
  | {
      readonly kind: 'damageScale';
      readonly target: ProjectedEquipmentDamageScale;
      readonly value: number;
    }
  | {
      readonly kind: 'staticHealingIncrease';
      readonly target: 'output';
      readonly value: number;
    }
  | {
      readonly kind: 'skillCooldownMultiplier';
      readonly skillTypes: 'comboSkill';
      readonly value: number;
    };

export type EquipmentAttributeModifierProjectionSource =
  | {
      readonly status: 'supported';
      readonly source: CompiledAttributeModifierSource;
      readonly modifier: ProjectedEquipmentModifierSource;
    }
  | {
      readonly status: 'scenario-omitted';
      readonly source: CompiledAttributeModifierSource;
      readonly reason: 'playerDamageTakenRequiresEnemyActiveDamage';
    }
  | {
      readonly status: 'blocked';
      readonly source: CompiledAttributeModifierSource;
      readonly reason: string;
    };

const DAMAGE_SCALE_ATTRIBUTES: Readonly<
  Partial<Record<AttributeTypeSource, ProjectedEquipmentDamageScale>>
> = {
  NormalAttackDamageIncrease: 'normalAttack',
  NormalSkillDamageIncrease: 'battleSkill',
  ComboSkillDamageIncrease: 'comboSkill',
  UltimateSkillDamageIncrease: 'ultimate',
  PhysicalDamageIncrease: 'physical',
  FireDamageIncrease: 'heat',
  PulseDamageIncrease: 'electric',
  CrystDamageIncrease: 'cryo',
  NaturalDamageIncrease: 'nature',
  EtherDamageIncrease: 'ether',
  DamageToBrokenUnitIncrease: 'staggeredEnemy',
};

const PLAYER_DAMAGE_TAKEN_ATTRIBUTES = new Set([
  'PhysicalDamageTakenScalar',
  'FireDamageTakenScalar',
  'PulseDamageTakenScalar',
  'CrystDamageTakenScalar',
  'NaturalDamageTakenScalar',
  'EtherDamageTakenScalar',
]);

/**
 * 把真实单件装备的静态属性程序投影为 Next 构筑语义。
 * 每个分支同时校验原生目标和公式槽；同名属性若换槽，必须重新取证而不能沿用映射。
 */
export function projectEquipmentAttributeModifier(
  source: CompiledAttributeModifierSource,
): EquipmentAttributeModifierProjectionSource {
  if (PLAYER_DAMAGE_TAKEN_ATTRIBUTES.has(source.declaredAttributeType)) {
    if (source.target === 'specific' && source.slot === 'baseFinalMultiplier') {
      return {
        status: 'scenario-omitted',
        source,
        reason: 'playerDamageTakenRequiresEnemyActiveDamage',
      };
    }
    return blocked(source, 'player damage-taken attribute uses an unverified target or slot');
  }

  const primaryAttribute = projectPrimaryAttributeKey(source.declaredAttributeType);
  if (primaryAttribute !== null) {
    if (source.target !== 'specific' || source.slot !== 'baseAddition') {
      return blocked(source, 'specific primary attribute requires BaseAddition');
    }
    return supported(source, {
      kind: 'attribute',
      attribute: primaryAttribute,
      operation: 'flat',
      value: source.value,
    });
  }

  if (
    source.declaredAttributeType === 'Level' &&
    (source.slot === 'baseAddition' || source.slot === 'baseMultiplier')
  ) {
    if (source.target !== 'main' && source.target !== 'sub') {
      return blocked(source, 'Level target resolution requires Main or Sub target');
    }
    return supported(source, {
      kind: 'attribute',
      attribute: source.target === 'main' ? 'main' : 'secondary',
      operation: source.slot === 'baseAddition' ? 'flat' : 'percent',
      value: source.value,
    });
  }

  const panel = projectPanelStat(source);
  if (panel !== null) return supported(source, panel);

  const damageScale = DAMAGE_SCALE_ATTRIBUTES[source.declaredAttributeType];
  if (damageScale !== undefined) {
    if (source.target !== 'specific' || source.slot !== 'baseAddition') {
      return blocked(source, 'damage-increase attribute requires Specific/BaseAddition');
    }
    return supported(source, { kind: 'damageScale', target: damageScale, value: source.value });
  }

  if (source.declaredAttributeType === 'HealOutputIncrease') {
    if (source.target !== 'specific' || source.slot !== 'baseAddition') {
      return blocked(source, 'HealOutputIncrease requires Specific/BaseAddition');
    }
    return supported(source, {
      kind: 'staticHealingIncrease',
      target: 'output',
      value: source.value,
    });
  }

  if (source.declaredAttributeType === 'ComboSkillCooldownScalar') {
    if (source.target !== 'specific' || source.slot !== 'baseFinalMultiplier') {
      return blocked(source, 'ComboSkillCooldownScalar requires Specific/BaseFinalMultiplier');
    }
    return supported(source, {
      kind: 'skillCooldownMultiplier',
      skillTypes: 'comboSkill',
      value: source.value,
    });
  }

  return blocked(
    source,
    `unsupported equipment attribute shape ${source.target}/${source.declaredAttributeType}/${source.slot}`,
  );
}

function projectPanelStat(
  source: CompiledAttributeModifierSource,
): Extract<ProjectedEquipmentModifierSource, { kind: 'panelStat' }> | null {
  if (source.target !== 'specific') return null;
  const key = `${source.declaredAttributeType}/${source.slot}`;
  const stat = {
    'Def/baseAddition': 'baseDefense',
    'Atk/baseMultiplier': 'attackPercent',
    'Atk/baseFinalAddition': 'attackFlat',
    'MaxHp/baseMultiplier': 'healthPercent',
    'MaxHp/baseFinalAddition': 'healthFlat',
    'CriticalRate/baseAddition': 'criticalRate',
    'PhysicalAndSpellInflictionEnhance/baseAddition': 'artsIntensity',
    'UltimateSpGainScalar/baseAddition': 'ultimateEnergyGainEfficiency',
    'PoiseDamageOutputScalar/baseAddition': 'staggerDamagePercent',
  }[key] as ProjectedEquipmentPanelStat | undefined;
  return stat === undefined ? null : { kind: 'panelStat', stat, value: source.value };
}

function supported(
  source: CompiledAttributeModifierSource,
  modifier: ProjectedEquipmentModifierSource,
): EquipmentAttributeModifierProjectionSource {
  return { status: 'supported', source, modifier };
}

function blocked(
  source: CompiledAttributeModifierSource,
  reason: string,
): EquipmentAttributeModifierProjectionSource {
  return { status: 'blocked', source, reason };
}
