import { commonBuffPresentationNameKeys } from '../../data/buffs/generated/commonBuffPresentationNames.generated';

export interface BuffDisplayI18n {
  readonly te: (key: string) => boolean;
  readonly t: (key: string) => string;
}

export interface SimpleBuffModifierDisplayFact {
  readonly attribute?: string;
  readonly slot?: string;
  readonly value?: number;
}

interface SimpleModifierPresentation {
  readonly nameKey: string;
  readonly format: 'percent' | 'flat';
}

const SIMPLE_MODIFIER_PRESENTATIONS: Readonly<Record<string, SimpleModifierPresentation>> = {
  'Atk\u0000baseMultiplier': { nameKey: 'atkPercent', format: 'percent' },
  'Atk\u0000baseAddition': { nameKey: 'flatAtk', format: 'flat' },
  'criticalRate\u0000baseAddition': { nameKey: 'critRate', format: 'percent' },
  'criticalDamageIncrease\u0000baseAddition': { nameKey: 'critDmg', format: 'percent' },
  'physicalDamageIncrease\u0000baseAddition': {
    nameKey: 'dmgBonus:physical',
    format: 'percent',
  },
  'heatDamageIncrease\u0000baseAddition': { nameKey: 'dmgBonus:heat', format: 'percent' },
  'electricDamageIncrease\u0000baseAddition': {
    nameKey: 'dmgBonus:electric',
    format: 'percent',
  },
  'cryoDamageIncrease\u0000baseAddition': { nameKey: 'dmgBonus:cryo', format: 'percent' },
  'natureDamageIncrease\u0000baseAddition': { nameKey: 'dmgBonus:nature', format: 'percent' },
  'physicalVulnerabilityIncrease\u0000baseAddition': {
    nameKey: 'susceptibility:physical',
    format: 'percent',
  },
  'heatVulnerabilityIncrease\u0000baseAddition': {
    nameKey: 'susceptibility:heat',
    format: 'percent',
  },
  'electricVulnerabilityIncrease\u0000baseAddition': {
    nameKey: 'susceptibility:electric',
    format: 'percent',
  },
  'cryoVulnerabilityIncrease\u0000baseAddition': {
    nameKey: 'susceptibility:cryo',
    format: 'percent',
  },
  'natureVulnerabilityIncrease\u0000baseAddition': {
    nameKey: 'susceptibility:nature',
    format: 'percent',
  },
};

function formatSigned(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `${rounded >= 0 ? '+' : ''}${rounded}`;
}

/** 仅格式化运行时已证明为单属性、单槽位的 Buff；未知组合返回 undefined。 */
export function resolveSimpleBuffModifierDisplayName(
  fact: SimpleBuffModifierDisplayFact | undefined,
  i18n: BuffDisplayI18n,
): string | undefined {
  if (
    fact?.attribute === undefined ||
    fact.slot === undefined ||
    fact.value === undefined ||
    !Number.isFinite(fact.value)
  ) {
    return undefined;
  }
  const presentation = SIMPLE_MODIFIER_PRESENTATIONS[`${fact.attribute}\u0000${fact.slot}`];
  if (presentation === undefined) return undefined;
  const effectKey = `effects.name.${presentation.nameKey}`;
  if (!i18n.te(effectKey)) return undefined;
  const rawValue =
    fact.slot === 'finalMultiplier' || fact.slot === 'baseFinalMultiplier'
      ? fact.value - 1
      : fact.value;
  const displayValue = presentation.format === 'percent' ? rawValue * 100 : rawValue;
  return `${i18n.t(effectKey)}${formatSigned(displayValue)}${presentation.format === 'percent' ? '%' : ''}`;
}

/**
 * 展示配置只在应用层按 Buff ID 查询，不随定义穿过编译、运行时和回执。
 * 未配置的 Buff 使用来源名和可证明的单属性摘要，Buff ID 是透明的最后回退。
 */
export function resolveBuffDisplayName(
  buffId: string,
  i18n: BuffDisplayI18n,
  simpleModifier?: SimpleBuffModifierDisplayFact,
  sourceName?: string,
): string {
  // 公共 Buff 的产品配置是展示名的权威入口；运行时和投影只需提供稳定 Buff ID。
  const configuredNameKey =
    commonBuffPresentationNameKeys[buffId as keyof typeof commonBuffPresentationNameKeys];
  const key = configuredNameKey?.trim();
  if (key) {
    const effectKey = `effects.name.${key}`;
    if (i18n.te(effectKey)) return i18n.t(effectKey);
    if (i18n.te(key)) return i18n.t(key);
    return key;
  }
  const modifierSummary = resolveSimpleBuffModifierDisplayName(simpleModifier, i18n);
  const source = sourceName?.trim();
  if (source) return modifierSummary === undefined ? source : `${source} · ${modifierSummary}`;
  return modifierSummary ?? buffId;
}
