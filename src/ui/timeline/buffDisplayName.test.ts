import { describe, expect, it } from 'vitest';
import { resolveBuffDisplayName } from './buffDisplayName';
import { compoundStatusFactories } from '../../data/buffs/compoundStatusFactories';

const messages: Readonly<Record<string, string>> = {
  'effects.name.susceptibility:physical': '物理脆弱',
  'effects.name.lift': '击飞',
  'effects.name.combustion': '燃烧',
  'effects.name.electrification': '导电',
  'effects.name.solidification': '冻结',
  'effects.name.corrosion': '腐蚀',
};
const i18n = {
  te: (key: string) => messages[key] !== undefined,
  t: (key: string) => messages[key] ?? key,
};

describe('Buff display name', () => {
  it('names every exported compound factory and its output by reaction direction', () => {
    const names = { heat: '燃烧', electric: '导电', cryo: '冻结', nature: '腐蚀' };
    expect(compoundStatusFactories.factories).toHaveLength(12);
    for (const factory of compoundStatusFactories.factories) {
      for (const id of [factory.id, factory.createdBuff.buffId]) {
        expect(resolveBuffDisplayName(id, i18n, undefined, '来源技能')).toBe(
          names[factory.incomingElement],
        );
      }
    }
    expect(resolveBuffDisplayName('buff_common_pulse_natural_triggered', i18n)).toBe('导电');
    expect(resolveBuffDisplayName('buff_common_pulse_unknown_triggered', i18n)).toBe(
      'buff_common_pulse_unknown_triggered',
    );
  });
  it('uses the active locale for compound names', () => {
    expect(
      resolveBuffDisplayName('buff_common_pulse_natural_triggered', {
        te: key => key === 'effects.name.electrification',
        t: () => 'Electrification',
      }),
    ).toBe('Electrification');
  });
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
