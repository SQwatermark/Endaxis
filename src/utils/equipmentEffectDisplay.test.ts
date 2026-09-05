import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  EQUIPMENT_MODIFIER_ICON_PATHS,
  getEquipmentModifierIconPath,
} from './equipmentEffectDisplay';

describe('equipment modifier presentation icons', () => {
  it.each([
    ['strength', '/icons/icon_attribute_str.webp'],
    ['intellect', '/icons/icon_attribute_wisd.webp'],
    ['attack', '/icons/icon_battle_buff_atk_up.webp'],
    ['crit_rate', '/icons/icon_attribute_criticalRate.webp'],
    ['originium_arts_power', '/icons/icon_originium_arts.webp'],
    ['skill_dmg_bonus', '/icons/icon_normal_skill_efficiency.webp'],
  ])('maps %s to its semantic game icon', (modifierId, expectedPath) => {
    expect(getEquipmentModifierIconPath(modifierId)).toBe(expectedPath);
    expect(existsSync(resolve('public', expectedPath.slice(1)))).toBe(true);
  });

  it('does not disguise an unknown modifier with the default icon', () => {
    expect(getEquipmentModifierIconPath('future_modifier')).toBeNull();
  });

  it('keeps the complete semantic icon catalog closed over exported webp files', () => {
    const missing = Object.entries(EQUIPMENT_MODIFIER_ICON_PATHS).flatMap(([modifierId, path]) =>
      existsSync(resolve('public', path.slice(1))) ? [] : [`${modifierId}: ${path}`],
    );
    expect(missing).toEqual([]);
  });
});
