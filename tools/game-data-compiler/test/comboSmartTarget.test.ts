import { describe, expect, it } from 'vitest';
import { parseSkillTargetSelectionHeaderSource } from '../src/source/skillTargetSelection.ts';
import { compileComboSmartTargetSource } from '../src/compiler/comboSmartTarget.ts';

const source = (selectStrategy = 4, smartTargetSelectStrategy = 1) =>
  parseSkillTargetSelectionHeaderSource(
    {
      selectStrategy,
      smartTargetSelectStrategy,
      canDummyCast: true,
      dummyPositionOffset: { x: 0, y: 0, z: 6 },
    },
    'skill',
  );

describe('木桩连携智能目标投影', () => {
  it.each([
    [0, 'input'],
    [1, 'trigger'],
  ] as const)('原生策略 %s 投影为 %s，保留原始几何来源', (strategy, expected) => {
    const input = source(4, strategy);
    const result = compileComboSmartTargetSource(input);
    expect(result.definition).toEqual({ comboSmartTarget: expected });
    expect(result.source).toBe(input);
    expect(result.projection).toBe('fixed-dummy-normal-targeting');
  });
  it.each([0, 1, 2, 3])('非智能主策略 %s 不执行 StoreSmartTarget', strategy => {
    expect(compileComboSmartTargetSource(source(strategy, 4)).definition).toEqual({});
  });
  it.each([2, 3, 4])('尚未审计的评分 %s 不以唯一木桩为由假通过', strategy => {
    expect(() => compileComboSmartTargetSource(source(4, strategy))).toThrow(
      'skill.smartTargetSelectStrategy',
    );
  });
});
