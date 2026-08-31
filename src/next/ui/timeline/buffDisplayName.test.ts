import { describe, expect, it } from 'vitest';
import { resolveBuffDisplayName } from './buffDisplayName';

const messages: Readonly<Record<string, string>> = {
  'effects.name.atkPercent': '攻击力%',
  'operators.perlica.skills.talent1.name': '电磁增幅',
};
const i18n = {
  te: (key: string) => messages[key] !== undefined,
  t: (key: string) => messages[key] ?? key,
};

describe('Buff display name', () => {
  it('resolves a legacy short effect key through effects.name first', () => {
    expect(resolveBuffDisplayName('atkPercent', 'buff:test', i18n)).toBe('攻击力%');
  });

  it('accepts a complete i18n path for exclusive effects', () => {
    expect(resolveBuffDisplayName('operators.perlica.skills.talent1.name', 'buff:test', i18n)).toBe(
      '电磁增幅',
    );
  });

  it('keeps unresolved explicit keys and missing-name Buff IDs transparent', () => {
    expect(resolveBuffDisplayName('unmappedEffect', 'buff:test', i18n)).toBe('unmappedEffect');
    expect(resolveBuffDisplayName(undefined, 'buff:native-id', i18n)).toBe('buff:native-id');
  });
});
