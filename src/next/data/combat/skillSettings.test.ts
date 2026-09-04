import { describe, expect, it } from 'vitest';
import { skillSettings } from './skillSettings';

describe('skillSettings', () => {
  it('preserves the complete native 1.4.4 infliction catalog', () => {
    expect(skillSettings.revision).toBe('1.5.3@9885010-4');
    expect(skillSettings.data).toHaveLength(22);
    expect(skillSettings.enhanceFormulas).toHaveLength(3);
    expect(skillSettings.data.find(item => item.key === '法术爆发伤害倍率')).toEqual({
      key: '法术爆发伤害倍率',
      values: [1.6, 1.6, 1.6, 1.6],
      enhanceFormulaKey: 'Damage',
    });
    expect(skillSettings.data.find(item => item.key === '连击增伤')?.values).toEqual([
      0.2, 0.1, 0.1, 0.1,
    ]);
  });
});
