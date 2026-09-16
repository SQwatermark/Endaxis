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

/** 能稳定显示并聚合的一项伤害影响来源。 */
export interface DamageContributionSource {
  /** 提供增益或减益的干员；null 表示环境或尚无可证明的干员来源。 */
  readonly providerOperatorId: string | null;
  readonly sourceKind: DamageContributionSourceKind;
  /** Buff、装备或机制的稳定定义编号。 */
  readonly sourceId: string;
}

export interface DamageContributionEntry extends DamageContributionSource {
  /** 对最终伤害的贡献；减伤和负面效果可以为负数。 */
  readonly value: number;
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
  return `${source.providerOperatorId ?? ''}\u0000${source.sourceKind}\u0000${source.sourceId}`;
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
  if (
    !Number.isFinite(totalLogEffect) ||
    !Number.isFinite(expectedLogEffect) ||
    Math.abs(totalLogEffect) <= Number.EPSILON
  ) {
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
  const scale = expectedLogEffect / totalLogEffect;
  const external = merged.map(effect => ({
    providerOperatorId: effect.providerOperatorId,
    sourceKind: effect.sourceKind,
    sourceId: effect.sourceId,
    value: logMean * effect.logEffect * scale,
  }));
  const externalTotal = external.reduce((sum, entry) => sum + entry.value, 0);
  return {
    // 以自身项吸收最后的浮点余差，序列化后仍严格守恒。
    self: actualDamage - externalTotal,
    external,
    unallocated: 0,
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
