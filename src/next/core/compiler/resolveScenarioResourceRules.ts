/**
 * 从已经完成养成补丁的技能程序和同一构筑面板解析干员资源规则。
 * 该阶段消除应用层手工复制终结技能量上限与回能效率的需要；共享规则仍由游戏规则装配层显式提供。
 */
import type { CombatOperatorProgram } from '../combat/runtime/combatRuntimeAssembly';
import type { ResolvedOperatorResourceRules } from './compileScenarioResources';
import type { ResolvedOperatorPanel } from './resolveOperatorPanel';

function resolveMaxUltimateEnergy(operator: CombatOperatorProgram): number | undefined {
  const values = new Set<number>();
  for (const skill of operator.skills) {
    if (skill.skillType !== 'ultimate') continue;
    for (const cost of skill.costs) {
      if (cost.resource === 'ultimateEnergy') values.add(cost.value);
    }
  }
  if (values.size > 1) {
    throw new Error(
      `operator '${operator.operatorId}' has inconsistent ultimate energy costs: ${[...values].join(', ')}`,
    );
  }
  return values.values().next().value;
}

/**
 * 新场景从无恢复限制的资源状态开始；带继承边界的场景会在资源编译器更早处拒绝，不能借此入口丢失动态限制。
 */
export function resolveScenarioOperatorResourceRules(
  operators: readonly CombatOperatorProgram[],
  panels: readonly ResolvedOperatorPanel[],
): ReadonlyMap<string, ResolvedOperatorResourceRules> {
  const panelsByOperator = new Map(panels.map(panel => [panel.operatorId, panel]));
  const rules = new Map<string, ResolvedOperatorResourceRules>();
  for (const operator of operators) {
    const panel = panelsByOperator.get(operator.operatorId);
    if (panel === undefined) {
      throw new Error(`operator '${operator.operatorId}' has no resolved panel for resource rules`);
    }
    const maxUltimateEnergy = resolveMaxUltimateEnergy(operator);
    rules.set(operator.operatorId, {
      ...(maxUltimateEnergy === undefined ? {} : { maxUltimateEnergy }),
      ultimateEnergyGainMultiplier: panel.ultimateEnergyGainEfficiency,
      allowedUltimateEnergyRecoveryTagIds: null,
    });
  }
  return rules;
}
