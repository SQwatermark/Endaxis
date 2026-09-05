import { describe, expect, it } from 'vitest';
import { resolveBuffDisplayName } from './buffDisplayName';

const messages: Readonly<Record<string, string>> = {
  'effects.name.susceptibility:physical': '物理脆弱',
  'effects.name.lift': '击飞',
};
const i18n = {
  te: (key: string) => messages[key] !== undefined,
  t: (key: string) => messages[key] ?? key,
};

describe('Buff display name', () => {
  it('keeps missing-name Buff IDs transparent', () => {
    expect(resolveBuffDisplayName('buff:native-id', i18n)).toBe('buff:native-id');
  });

  it('appends a strict single attribute summary after the source name', () => {
    expect(
      resolveBuffDisplayName(
        'buff:test',
        i18n,
        { attribute: 'physicalVulnerabilityIncrease', slot: 'baseAddition', value: 0.1 },
        '触发技能',
      ),
    ).toBe('触发技能 · 物理脆弱+10%');
  });

  it('uses the triggering definition name when no explicit or safe automatic name exists', () => {
    expect(
      resolveBuffDisplayName(
        'buff:test',
        i18n,
        { attribute: 'unknown', slot: 'baseAddition', value: 1 },
        '触发天赋',
      ),
    ).toBe('触发天赋');
  });

  it('uses a configured common Buff name instead of the source name', () => {
    expect(resolveBuffDisplayName('buff_physical_airborne', i18n, undefined, '某个技能名称')).toBe(
      '击飞',
    );
  });

  it('uses the attribute summary alone when the triggering source has no display name', () => {
    expect(
      resolveBuffDisplayName('buff:test', i18n, {
        attribute: 'physicalVulnerabilityIncrease',
        slot: 'baseAddition',
        value: 0.1,
      }),
    ).toBe('物理脆弱+10%');
  });
});
