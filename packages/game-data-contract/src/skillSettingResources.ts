/** Resource scalars exported from SkillSetting; no constructor-default fallback. */
export interface SkillSettingResources {
  readonly atbRecoverInterval: number;
  readonly atbGainEfficiency: number;
  readonly atbConsumedDefaultUspGainSelf: number;
  readonly atbConsumedDefaultUspGainOther: number;
}

export function parseSkillSettingResources(value: unknown): SkillSettingResources {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('SkillSetting.resources: expected object');
  const row = value as Record<string, unknown>;
  const keys = [
    'atbRecoverInterval',
    'atbGainEfficiency',
    'atbConsumedDefaultUspGainSelf',
    'atbConsumedDefaultUspGainOther',
  ] as const;
  if (Object.keys(row).some(key => !keys.includes(key as (typeof keys)[number])))
    throw new Error('SkillSetting.resources: unknown field');
  const read = (key: (typeof keys)[number]) => {
    const n = row[key];
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 0)
      throw new Error(`SkillSetting.resources.${key}: expected non-negative finite number`);
    return n;
  };
  return {
    atbRecoverInterval: read('atbRecoverInterval'),
    atbGainEfficiency: read('atbGainEfficiency'),
    atbConsumedDefaultUspGainSelf: read('atbConsumedDefaultUspGainSelf'),
    atbConsumedDefaultUspGainOther: read('atbConsumedDefaultUspGainOther'),
  };
}
