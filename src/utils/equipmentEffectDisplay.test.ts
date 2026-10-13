import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  EQUIPMENT_MODIFIER_ICON_PATHS,
  getEquipmentModifierIconPath,
} from './equipmentEffectDisplay';

describe('equipment modifier presentation icons', () => {
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
