import { describe, expect, it } from 'vitest';
import { parseGameplayTagReference, requireGameplayTag } from './gameplayTagCatalog';

describe('可读 GameplayTag 目录', () => {
  it('编辑器支持可读自定义路径，拒绝数字串和占位符', () => {
    expect(requireGameplayTag('Status/Immobilized/Frozen')).toBe('Status/Immobilized/Frozen');
    expect(parseGameplayTagReference('TimeDilation/Layer/Entity/HitStop')).toBe(
      'TimeDilation/Layer/Entity/HitStop',
    );
    expect(parseGameplayTagReference('Custom/MyBuff')).toBe('Custom/MyBuff');
    for (const invalid of ['-123', '2147483648', 'unknown:123'])
      expect(parseGameplayTagReference(invalid)).toBeUndefined();
  });
});
