import type { SkillTargetSelectionHeaderSource } from '../source/skillTargetSelection.ts';

/** 固定木桩/普通选敌设置投影。来源头完整保留；不假装已经实现其他评分策略。 */
export function compileComboSmartTargetSource(source: SkillTargetSelectionHeaderSource) {
  let comboSmartTarget: 'input' | 'trigger' | undefined;
  if (source.selectStrategy === 'SelectSmartObject') {
    switch (source.smartTargetSelectStrategy) {
      case 'SelectComboSkillTarget':
        comboSmartTarget = 'input';
        break;
      case 'SelectComboSkillTrigger':
        comboSmartTarget = 'trigger';
        break;
      default:
        throw new Error(
          `${source.sourcePath}.smartTargetSelectStrategy: scoring projection is not audited`,
        );
    }
  }
  return {
    source,
    definition: comboSmartTarget === undefined ? {} : { comboSmartTarget },
    projection: 'fixed-dummy-normal-targeting' as const,
  };
}
