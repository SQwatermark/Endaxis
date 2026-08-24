import {
  requireArray,
  requireBoolean,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import { parseScalarSource, type BlackboardLevelValues, type ScalarSource } from './scalar.ts';

export interface NativeAttributeModifierSource {
  readonly modifyAttributeType: string;
  readonly attributeType: string;
  readonly formulaItem: string;
  readonly parameter: ScalarSource;
}

export interface CardAttributeModifierSource {
  /** 原生容器标记；当前样本均为 false，但不能据此删除字段。 */
  readonly isConvertedAttribute: boolean;
  readonly modifiers: readonly NativeAttributeModifierSource[];
}

/**
 * 读取 CardSkill 与战斗被动 SkillData 共用的属性修正结构。
 * 参数继续保持直接值、黑板引用与逐等级来源，不在读取层计算角色主副属性映射。
 */
export function parseCardAttributeModifierSource(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): CardAttributeModifierSource {
  const container = requireRecord(value, path);
  requireExactFields(container, new Set(['attributeModifiers', 'isConvertedAttribute']), path);
  return {
    isConvertedAttribute: requireBoolean(
      container.isConvertedAttribute,
      `${path}.isConvertedAttribute`,
    ),
    modifiers: requireArray(container.attributeModifiers, `${path}.attributeModifiers`).map(
      (rawModifier, index) => {
        const modifierPath = `${path}.attributeModifiers[${index}]`;
        const modifier = requireRecord(rawModifier, modifierPath);
        requireExactFields(
          modifier,
          new Set(['modifyAttributeType', 'attributeType', 'formulaItem', 'param']),
          modifierPath,
        );
        return {
          modifyAttributeType: requireNonEmptyString(
            modifier.modifyAttributeType,
            `${modifierPath}.modifyAttributeType`,
          ),
          attributeType: requireNonEmptyString(
            modifier.attributeType,
            `${modifierPath}.attributeType`,
          ),
          formulaItem: requireNonEmptyString(modifier.formulaItem, `${modifierPath}.formulaItem`),
          parameter: parseScalarSource(
            modifier.param,
            `${modifierPath}.param`,
            inheritedBlackboard,
          ),
        };
      },
    ),
  };
}
