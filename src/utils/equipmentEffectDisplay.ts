type TranslateFn = (key: string, named?: Record<string, unknown>) => string;

/**
 * 装备/武器静态属性的 UI 语义图标。这里返回 null 而不是默认图，确保新增 modifier 不会被
 * “看起来能显示”掩盖；调用方应把 null 作为待补映射诊断或使用无图标表现。
 */
export const EQUIPMENT_MODIFIER_ICON_PATHS: Readonly<Record<string, string>> = Object.freeze({
  primary_ability: '/icons/icon_battle_primary_attribute_all_up.webp',
  secondary_ability: '/icons/icon_battle_primary_attribute_all_up.webp',
  strength: '/icons/icon_attribute_str.webp',
  agility: '/icons/icon_attribute_agi.webp',
  intellect: '/icons/icon_attribute_wisd.webp',
  will: '/icons/icon_attribute_will.webp',
  attack: '/icons/icon_battle_buff_atk_up.webp',
  hp: '/icons/icon_attribute_maxHp.webp',
  crit_rate: '/icons/icon_attribute_criticalRate.webp',
  crit_dmg: '/icons/icon_attribute_criticalDamageIncrease.webp',
  blaze_dmg: '/icons/icon_battle_fire_dmg_up.webp',
  emag_dmg: '/icons/icon_battle_pulse_dmg_up.webp',
  cold_dmg: '/icons/icon_battle_cryst_dmg_up.webp',
  nature_dmg: '/icons/icon_battle_natural_dmg_up.webp',
  physical_dmg: '/icons/icon_physical_damage_increase.webp',
  arts_dmg: '/icons/icon_battle_spell_up.webp',
  attack_dmg_bonus: '/icons/icon_normal_atk_efficiency.webp',
  skill_dmg_bonus: '/icons/icon_normal_skill_efficiency.webp',
  link_dmg_bonus: '/icons/icon_comboskill_cooldown_scalar.webp',
  ultimate_dmg_bonus: '/icons/icon_ultimate_skill_efficiency.webp',
  all_skill_dmg_bonus: '/icons/icon_battle_affix_enhance.webp',
  broken_dmg_bonus: '/icons/icon_attr_damage_to_broken_unit_increase.webp',
  healing_effect: '/icons/icon_heal_output_increase.webp',
  final_dmg_reduction: '/icons/icon_battle_affix_shelter.webp',
  originium_arts_power: '/icons/icon_originium_arts.webp',
  ult_charge_eff: '/icons/icon_ultimate_sp_gain_scalar.webp',
  link_cd_reduction: '/icons/icon_comboskill_cooldown_scalar.webp',
  susceptibility: '/icons/icon_battle_affix_vulnerable.webp',
  susceptibility_physical: '/icons/icon_battle_affix_physical_vulnerable.webp',
  susceptibility_heat: '/icons/icon_battle_affix_fire_vulnerable.webp',
  susceptibility_cryo: '/icons/icon_battle_affix_cryst_vulnerable.webp',
  susceptibility_electric: '/icons/icon_battle_affix_pulse_vulnerable.webp',
  susceptibility_nature: '/icons/icon_battle_affix_natural_vulnerable.webp',
});

export function getEquipmentModifierIconPath(modifierId: string): string | null {
  return EQUIPMENT_MODIFIER_ICON_PATHS[modifierId] ?? null;
}

export function normalizeEquipmentAttributeId(attribute: string): string {
  if (attribute === 'main') return 'primary_ability';
  if (attribute === 'sub' || attribute === 'secondary') return 'secondary_ability';
  if (['strength', 'agility', 'intellect', 'will'].includes(attribute)) return attribute;
  return '';
}

const ELEMENT_DMG_MODIFIER_IDS: Record<string, string> = {
  physical: 'physical_dmg',
  heat: 'blaze_dmg',
  cryo: 'cold_dmg',
  electric: 'emag_dmg',
  nature: 'nature_dmg',
};

const SKILL_TYPE_DMG_MODIFIER_IDS: Record<string, string> = {
  basicAttack: 'attack_dmg_bonus',
  battleSkill: 'skill_dmg_bonus',
  comboSkill: 'link_dmg_bonus',
  ultimate: 'ultimate_dmg_bonus',
};

/** 装备摘要保留一个分类：优先元素组合，再取首个元素，未限定元素时按技能类型分类。 */
export function getEquipmentDamageBonusModifierId(
  damageTypes: string | readonly string[],
  skills?: string | readonly string[],
): string {
  const elements = typeof damageTypes === 'string' ? [damageTypes] : damageTypes;
  if (elements.length > 0) {
    const set = new Set(elements);
    if (
      set.size === 4 &&
      set.has('heat') &&
      set.has('cryo') &&
      set.has('electric') &&
      set.has('nature')
    ) {
      return 'arts_dmg';
    }
    if (set.size === 2) {
      if (set.has('heat') && set.has('nature')) return 'heat_nature_dmg_bonus';
      if (set.has('cryo') && set.has('electric')) return 'cryo_electric_dmg_bonus';
    }
    for (const element of elements) {
      const modifierId = ELEMENT_DMG_MODIFIER_IDS[element];
      if (modifierId) return modifierId;
    }
    return 'all_skill_dmg_bonus';
  }
  const skillTypes = typeof skills === 'string' ? [skills] : (skills ?? []);
  return skillTypes.length === 1
    ? (SKILL_TYPE_DMG_MODIFIER_IDS[skillTypes[0]!] ?? 'all_skill_dmg_bonus')
    : 'all_skill_dmg_bonus';
}

function trOrFallback(t: TranslateFn | undefined, key: string, fallback: string): string {
  const out = typeof t === 'function' ? t(key) : key;
  return out === key ? fallback : out;
}

export function getEquipmentModifierLabel(modifierId: string, t: TranslateFn | undefined): string {
  const filterKey = `timelineGrid.equipmentDialog.affixFilters.${modifierId}`;
  const filterLabel = typeof t === 'function' ? t(filterKey) : filterKey;
  if (filterLabel !== filterKey) return filterLabel;
  return trOrFallback(t, `stats.${modifierId}`, modifierId);
}

export function formatEquipmentNumber(value: unknown): string {
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value ?? '');
  if (Math.abs(num - Math.round(num)) < 0.0001) return String(Math.round(num));
  return num.toFixed(1).replace(/\.0$/, '');
}
