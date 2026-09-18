/**
 * 从已发布命中的直接修正分配贡献。只读来源查询和冻结乘区，不执行技能或重算战斗。
 * 首批支持 damageScale；属性槽和其他未完整记录的修正保留在自身项。
 */
import { CombatObjectOrigins, type CombatObjectNode } from './combatObjectOrigins';
import type { CombatObjectRef } from '../combat/receipt/combatReceipt';

export interface HitDamageContribution {
  readonly self: number;
  readonly external: readonly {
    readonly modifier: CombatObjectRef;
    readonly providerOperatorId: string;
    readonly value: number;
  }[];
  /** 仅供开发诊断，不作为用户界面的未归因扇区。 */
  readonly diagnostics: readonly string[];
}

export function projectHitDamageContribution(
  origins: CombatObjectOrigins,
  hit: CombatObjectNode,
  attackerOperatorId: string,
): HitDamageContribution {
  const direct = origins.directModifiers(hit);
  const value = hit.fact?.data?.value;
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0)
    return { self: 0, external: [], diagnostics: [] };
  const diagnostics = new Set<string>();
  const groups = new Map<
    string,
    {
      actual: number;
      items: {
        modifier: CombatObjectRef;
        providerOperatorId: string;
        addition: number;
      }[];
    }
  >();
  const weights: { modifier: CombatObjectRef; providerOperatorId: string; logarithm: number }[] =
    [];
  const fallback = (reason: string): HitDamageContribution => ({
    self: value,
    external: [],
    diagnostics: [...diagnostics, reason],
  });
  // 护盾是减法或条件处理，不能把吸收后的数值当作同一乘法公式分配。
  const beforeAbsorption = hit.fact?.data?.damageBeforeAbsorption;
  if (typeof beforeAbsorption === 'number' && beforeAbsorption !== value)
    return fallback('damage-absorbed');
  for (const item of direct) {
    const provider = origins.providerOperator(item.provider, hit.fact!.sequence);
    if (provider === attackerOperatorId) continue;
    if (provider === undefined) {
      diagnostics.add('unknown-provider');
      continue;
    }
    const modifier = item.modifier;
    // 注入乘区的属性副本不是第二笔加成；在属性槽完整还原前两者都不分配。
    if (modifier.kind !== 'damageScale') {
      diagnostics.add('unsupported-modifier');
      continue;
    }
    if (!Number.isFinite(modifier.addition)) return fallback('non-finite-modifier');
    const identity = { modifier: item.node.ref, providerOperatorId: provider };
    if (modifier.zone === 'product') {
      if (1 + modifier.addition <= 0) return fallback('non-positive-factor');
      weights.push({ ...identity, logarithm: Math.log1p(modifier.addition) });
    } else {
      const key = `damageScale:${modifier.zone}:${modifier.side}`;
      const actual = hit.fact?.data?.[key];
      if (typeof actual !== 'number' || !Number.isFinite(actual) || actual <= 0)
        return fallback('missing-or-clamped-factor');
      let group = groups.get(key);
      if (group === undefined) {
        group = { actual, items: [] };
        groups.set(key, group);
      }
      group.items.push({ ...identity, addition: modifier.addition });
    }
  }
  for (const group of groups.values()) {
    const delta = group.items.reduce((sum, item) => sum + item.addition, 0);
    const selfFactor = group.actual - delta;
    if (!(selfFactor > 0) || !Number.isFinite(selfFactor))
      return fallback('non-positive-self-factor');
    // 带符号的同量纲分配。正负修正抵消时取连续极限，不能除以零或按绝对值分摊。
    const slope = delta === 0 ? 1 / selfFactor : Math.log1p(delta / selfFactor) / delta;
    for (const item of group.items)
      weights.push({
        modifier: item.modifier,
        providerOperatorId: item.providerOperatorId,
        logarithm: item.addition * slope,
      });
  }
  const logarithm = weights.reduce((sum, item) => sum + item.logarithm, 0);
  const mean = value * (logarithm === 0 ? 1 : -Math.expm1(-logarithm) / logarithm);
  const external = weights.map(item => ({
    modifier: item.modifier,
    providerOperatorId: item.providerOperatorId,
    value: mean * item.logarithm,
  }));
  const self = value - external.reduce((sum, item) => sum + item.value, 0);
  if (!Number.isFinite(self) || external.some(item => !Number.isFinite(item.value)))
    return fallback('unstable-decomposition');
  return { self, external, diagnostics: [...diagnostics] };
}
