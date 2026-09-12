/**
 * 删除装备贡献中没有运行时宿主的黑板初值。
 *
 * 静态属性已由来源编译器写入 modifiers。没有启用、初始化或事件入口的贡献，
 * EquipmentEventRuntime 不会创建动作黑板；该贡献保存的 Buff 蓝图使用各自的实例黑板。
 * 有运行入口时暂时保留整块板，不按词条位置、名称或武器身份推断哪些键无用。
 */
import type { EquipmentContributionDefinition } from '../../../../packages/game-data-contract/src/equipment.ts';
import type { DefinitionOptimizationMode } from './definitionOptimization.ts';

/** 每项装备贡献的黑板裁剪结果，与技能黑板的优化报告分开记录。 */
export interface EquipmentValueOptimizationReport {
  /** 词条或套装所属的定义身份。 */
  readonly definitionId: string;
  /** 贡献在完整定义中的路径。 */
  readonly path: string;
  /** 候选中删除的初值键；关闭优化时为空。 */
  readonly removedInitialKeys: readonly string[];
  /** 有运行入口时尚不裁剪；关闭模式则明确保留全部输入。 */
  readonly retainedReason?: 'runtime-entry-present' | 'optimization-disabled';
}

/** 这里只删除确定不会创建宿主的整块板，保留所有行为入口和 Buff 蓝图。 */
export function pruneUnusedEquipmentContributionBlackboard(
  value: EquipmentContributionDefinition,
  options: {
    readonly mode: DefinitionOptimizationMode;
    readonly definitionId: string;
    readonly path: string;
  },
): {
  readonly contribution: EquipmentContributionDefinition;
  readonly report: EquipmentValueOptimizationReport;
} {
  const report = { definitionId: options.definitionId, path: options.path };
  if (options.mode === 'off') {
    return {
      contribution: value,
      report: { ...report, removedInitialKeys: [], retainedReason: 'optimization-disabled' },
    };
  }
  if (
    value.enableSequence !== undefined ||
    value.initializationSequence !== undefined ||
    (value.eventHandlers?.length ?? 0) > 0
  ) {
    return {
      contribution: value,
      report: { ...report, removedInitialKeys: [], retainedReason: 'runtime-entry-present' },
    };
  }
  const { blackboard, ...contribution } = value;
  return {
    contribution: blackboard === undefined ? value : contribution,
    report: { ...report, removedInitialKeys: Object.keys(blackboard ?? {}) },
  };
}
