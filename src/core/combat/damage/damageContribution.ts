/**
 * 单次伤害的贡献归因纯数据与守恒算法。
 *
 * 运行时修正器只登记自己实际改变的乘法因子；伤害结算完成后，本模块用
 * 对数平均分解把“有外部增益”和“只保留攻击者自身增益”的差额分给来源。
 * 结果最后以攻击者自身项吸收浮点余差，保证各项之和严格等于回执伤害。
 */

export const DAMAGE_CONTRIBUTION_SOURCE_KINDS = [
  'buff',
  'equipment',
  'status',
  'stagger',
  'mechanic',
] as const;

export type DamageContributionSourceKind = (typeof DAMAGE_CONTRIBUTION_SOURCE_KINDS)[number];
export type DamageContributionAttributionMode = 'applier' | 'consumedLayers';

/** 另一种显示归因中，一个提供者所占的非负权重。 */
export interface DamageContributionProviderShare {
  readonly providerOperatorId: string | null;
  readonly weight: number;
}

/** 清理、合并并稳定排序另一种显示归因的提供者权重。 */
export function normalizeDamageContributionProviderShares(
  shares: readonly DamageContributionProviderShare[],
): readonly DamageContributionProviderShare[] {
  const merged = new Map<string | null, number>();
  for (const share of shares) {
    if (!Number.isFinite(share.weight) || share.weight <= Number.EPSILON) continue;
    merged.set(
      share.providerOperatorId,
      (merged.get(share.providerOperatorId) ?? 0) + share.weight,
    );
  }
  return [...merged.entries()]
    .sort(([left], [right]) => (left ?? '').localeCompare(right ?? ''))
    .map(([providerOperatorId, weight]) => ({ providerOperatorId, weight }));
}

/** 能稳定显示并聚合的一项伤害影响来源。 */
export interface DamageContributionSource {
  /** 提供增益或减益的干员；null 表示环境或尚无可证明的干员来源。 */
  readonly providerOperatorId: string | null;
  readonly sourceKind: DamageContributionSourceKind;
  /** Buff、装备或机制的稳定定义编号。 */
  readonly sourceId: string;
  /** 复合状态创建时实际消费的附着层来源；仅供切换显示归因，不改变模拟结果。 */
  readonly consumedLayerProviderShares?: readonly DamageContributionProviderShare[];
}

/** 一个聚合修正中某个来源所占的非负权重。 */
export interface DamageContributionSourceShare extends DamageContributionSource {
  readonly weight: number;
}

export type DamageContributionAttribution =
  DamageContributionSource | readonly DamageContributionSourceShare[];

/** 兼容单一来源调用，并统一成可按权重分摊的来源列表。 */
export function resolveDamageContributionSourceShares(
  attribution: DamageContributionAttribution | undefined,
): readonly DamageContributionSourceShare[] {
  if (attribution === undefined) return [];
  return Array.isArray(attribution)
    ? normalizeDamageContributionSourceShares(
        attribution as readonly DamageContributionSourceShare[],
      )
    : [{ ...(attribution as DamageContributionSource), weight: 1 }];
}

/** 清理无效权重，并合并同一来源。 */
export function normalizeDamageContributionSourceShares(
  shares: readonly DamageContributionSourceShare[],
): readonly DamageContributionSourceShare[] {
  const merged = new Map<string, DamageContributionSourceShare>();
  for (const share of shares) {
    if (!Number.isFinite(share.weight) || share.weight <= Number.EPSILON) continue;
    const key = sourceKey(share);
    const previous = merged.get(key);
    merged.set(key, { ...share, weight: (previous?.weight ?? 0) + share.weight });
  }
  return [...merged.values()];
}

export interface DamageContributionEntry extends DamageContributionSource {
  /** 对最终伤害的贡献；减伤和负面效果可以为负数。 */
  readonly value: number;
}

/**
 * 将一项已结算贡献投影到所选提供者口径。
 * 这里只拆分既有数值，不读取战斗状态，也不重新计算伤害。
 */
export function projectDamageContributionEntry(
  entry: DamageContributionEntry,
  mode: DamageContributionAttributionMode,
): readonly DamageContributionEntry[] {
  if (mode !== 'consumedLayers' || entry.consumedLayerProviderShares === undefined) return [entry];
  const shares = normalizeDamageContributionProviderShares(entry.consumedLayerProviderShares);
  const totalWeight = shares.reduce((sum, share) => sum + share.weight, 0);
  if (totalWeight <= Number.EPSILON) return [entry];
  let assigned = 0;
  return shares.map((share, index) => {
    const value =
      index === shares.length - 1
        ? entry.value - assigned
        : entry.value * (share.weight / totalWeight);
    assigned += value;
    return { ...entry, providerOperatorId: share.providerOperatorId, value };
  });
}

/** 写入 DamageApplied 回执的冻结归因结果。 */
export interface DamageContributionResult {
  readonly self: number;
  readonly external: readonly DamageContributionEntry[];
  readonly unallocated: number;
  readonly diagnostics: readonly string[];
}

/** 一个来源对实际伤害与自身基线之间对数倍率的贡献。 */
export interface DamageContributionLogEffect extends DamageContributionSource {
  readonly logEffect: number;
}

function sourceKey(source: DamageContributionSource): string {
  const consumedLayers =
    source.consumedLayerProviderShares === undefined
      ? undefined
      : normalizeDamageContributionProviderShares(source.consumedLayerProviderShares)
          .map(share => `${share.providerOperatorId ?? ''}:${share.weight}`)
          .join(',');
  return `${source.providerOperatorId ?? ''}\u0000${source.sourceKind}\u0000${source.sourceId}\u0000${consumedLayers ?? ''}`;
}

/** 合并同一来源在多个处理器和乘区中的对数影响。 */
export function mergeDamageContributionLogEffects(
  effects: readonly DamageContributionLogEffect[],
): readonly DamageContributionLogEffect[] {
  const merged = new Map<string, DamageContributionLogEffect>();
  for (const effect of effects) {
    if (!Number.isFinite(effect.logEffect) || Math.abs(effect.logEffect) <= Number.EPSILON)
      continue;
    const key = sourceKey(effect);
    const previous = merged.get(key);
    merged.set(key, {
      providerOperatorId: effect.providerOperatorId,
      sourceKind: effect.sourceKind,
      sourceId: effect.sourceId,
      ...(effect.consumedLayerProviderShares === undefined
        ? {}
        : { consumedLayerProviderShares: effect.consumedLayerProviderShares }),
      logEffect: (previous?.logEffect ?? 0) + effect.logEffect,
    });
  }
  return [...merged.values()];
}

/**
 * 将已结算伤害分解为自身和外部来源。
 * `selfDamage` 必须由同一次命中的冻结数据得到，不能在展示层重新模拟。
 */
export function decomposeDamageContribution(
  actualDamage: number,
  selfDamage: number,
  effects: readonly DamageContributionLogEffect[],
): DamageContributionResult {
  const diagnostics: string[] = [];
  if (!Number.isFinite(actualDamage) || actualDamage < 0) {
    return {
      self: Number.isFinite(actualDamage) ? actualDamage : 0,
      external: [],
      unallocated: 0,
      diagnostics: ['actual damage is not a finite non-negative number'],
    };
  }
  const merged = mergeDamageContributionLogEffects(effects);
  if (actualDamage === 0 || merged.length === 0) {
    return { self: actualDamage, external: [], unallocated: 0, diagnostics };
  }
  if (!Number.isFinite(selfDamage) || selfDamage <= 0) {
    return {
      self: actualDamage,
      external: [],
      unallocated: 0,
      diagnostics: ['self damage baseline is not positive; contribution remains with attacker'],
    };
  }

  const totalLogEffect = merged.reduce((sum, effect) => sum + effect.logEffect, 0);
  const expectedLogEffect = Math.log(actualDamage / selfDamage);
  if (!Number.isFinite(totalLogEffect) || !Number.isFinite(expectedLogEffect)) {
    return {
      self: actualDamage,
      external: [],
      unallocated: 0,
      diagnostics: ['external multiplier cannot be decomposed; contribution remains with attacker'],
    };
  }
  if (Math.abs(totalLogEffect - expectedLogEffect) > 1e-8) {
    diagnostics.push('recorded source multipliers do not fully explain the self-damage difference');
  }

  // LMDI 的对数平均；actual === self 时取连续极限 self。
  const logMean =
    Math.abs(actualDamage - selfDamage) <= Number.EPSILON
      ? selfDamage
      : (actualDamage - selfDamage) / expectedLogEffect;
  const external = merged.map(effect => ({
    providerOperatorId: effect.providerOperatorId,
    sourceKind: effect.sourceKind,
    sourceId: effect.sourceId,
    ...(effect.consumedLayerProviderShares === undefined
      ? {}
      : { consumedLayerProviderShares: effect.consumedLayerProviderShares }),
    value: logMean * effect.logEffect,
  }));
  const externalTotal = external.reduce((sum, entry) => sum + entry.value, 0);
  // 已知来源只领取自身可证明的对数影响。公式中还有未登记的乘区时，
  // 将剩余差额显式留在未归因项，不能按比例放大已知来源来伪造完整解释。
  const unallocated = actualDamage - selfDamage - externalTotal;
  return {
    self: selfDamage,
    external,
    // 以未归因项吸收最后的浮点余差，序列化后仍严格守恒。
    unallocated,
    diagnostics,
  };
}

/** 护盾等结算末端改变伤害值后，按比例缩放并重新闭合归因。 */
export function scaleDamageContribution(
  contribution: DamageContributionResult,
  finalDamage: number,
): DamageContributionResult {
  const original =
    contribution.self +
    contribution.unallocated +
    contribution.external.reduce((sum, entry) => sum + entry.value, 0);
  if (finalDamage === original) return contribution;
  if (!Number.isFinite(finalDamage) || finalDamage <= 0 || original <= 0) {
    return {
      self: Math.max(0, Number.isFinite(finalDamage) ? finalDamage : 0),
      external: [],
      unallocated: 0,
      diagnostics: [...contribution.diagnostics, 'final damage removed the attributable damage'],
    };
  }
  const ratio = finalDamage / original;
  const external = contribution.external.map(entry => ({ ...entry, value: entry.value * ratio }));
  const unallocated = contribution.unallocated * ratio;
  const externalTotal = external.reduce((sum, entry) => sum + entry.value, 0);
  return {
    self: finalDamage - unallocated - externalTotal,
    external,
    unallocated,
    diagnostics: contribution.diagnostics,
  };
}
