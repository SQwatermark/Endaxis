import { parseConditionLeafSource, type NativeConditionSource } from './condition.ts';
import {
  requireArray,
  requireExactFields,
  requireInteger,
  requireNonEmptyString,
  requireRecord,
} from './primitives.ts';
import {
  parseSkillDefinitionReferenceSource,
  type DefinitionReferenceSource,
  type ReferenceAwareActionLeafSource,
} from './referenceGraph.ts';
import type { BlackboardLevelValues } from './scalar.ts';
import { parseSkillBuffInstallSources, type SkillBuffInstallSource } from './skillBuffInstall.ts';
import type { SkillActionGraphSource } from './skillActionGraph.ts';
import {
  parseCardAttributeModifierSource,
  type CardAttributeModifierSource,
} from './attributeModifiers.ts';

export interface PassiveSkillToggleBuffSource {
  readonly conditions: readonly NativeConditionSource[];
  readonly buffs: readonly SkillBuffInstallSource[];
}

/**
 * 领域无关的原生被动 SkillData。它不说明被动属于干员天赋、潜能、武器或装备，
 * 也不在来源层把 AddBuff/ToggleBuff 投影成 Endaxis 安装策略。
 */
export interface NativePassiveSkillSource {
  readonly skillId: string;
  readonly level: number;
  readonly passiveType: string;
  readonly skillSpecification: string | number;
  readonly skillTagIds: readonly number[];
  readonly cardAttributeModifiers: CardAttributeModifierSource;
  readonly startupBuffs: readonly SkillBuffInstallSource[];
  readonly toggleBuffs: readonly PassiveSkillToggleBuffSource[];
  readonly actionGraph: SkillActionGraphSource<ReferenceAwareActionLeafSource>;
  readonly references: readonly DefinitionReferenceSource[];
}

export function parseNativePassiveSkillSource(
  value: unknown,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativePassiveSkillSource {
  const root = requireRecord(value, sourcePath);
  if (root.castType !== 'Passive') {
    throw new Error(`${sourcePath}.castType: expected "Passive"`);
  }
  const definition = parseSkillDefinitionReferenceSource(value, sourcePath, inheritedBlackboard);
  return {
    skillId: definition.actionGraph.skillId,
    level: definition.actionGraph.level,
    passiveType: requireNonEmptyString(root.passiveSkillType, `${sourcePath}.passiveSkillType`),
    skillSpecification: parseSkillSpecification(
      root.skillSpecification,
      `${sourcePath}.skillSpecification`,
    ),
    skillTagIds: parseSkillTagIds(root.skillTags, `${sourcePath}.skillTags`),
    cardAttributeModifiers: parseCardAttributeModifierSource(
      root.cardAttributeModifier,
      `${sourcePath}.cardAttributeModifier`,
      inheritedBlackboard,
    ),
    startupBuffs: parseSkillBuffInstallSources(root.buffs, `${sourcePath}.buffs`),
    toggleBuffs: parseToggleBuffs(
      root.toggleBuffs,
      `${sourcePath}.toggleBuffs`,
      inheritedBlackboard,
    ),
    actionGraph: definition.actionGraph,
    references: definition.references,
  };
}

function parseToggleBuffs(
  value: unknown,
  path: string,
  inheritedBlackboard: BlackboardLevelValues,
): PassiveSkillToggleBuffSource[] {
  return requireArray(value, path).map((rawGroup, groupIndex) => {
    const groupPath = `${path}[${groupIndex}]`;
    const group = requireRecord(rawGroup, groupPath);
    requireExactFields(group, new Set(['conditions', 'buffs']), groupPath);
    return {
      conditions: requireArray(group.conditions, `${groupPath}.conditions`).map(
        (condition, conditionIndex) =>
          parseConditionLeafSource(
            condition,
            `${groupPath}.conditions[${conditionIndex}]`,
            inheritedBlackboard,
          ),
      ),
      buffs: parseSkillBuffInstallSources(group.buffs, `${groupPath}.buffs`),
    };
  });
}

function parseSkillSpecification(value: unknown, path: string): string | number {
  if (typeof value === 'string' && value.length > 0) return value;
  if (typeof value === 'number') return requireInteger(value, path);
  throw new Error(`${path}: expected enum name or integer`);
}

function parseSkillTagIds(value: unknown, path: string): number[] {
  const group = requireRecord(value, path);
  requireExactFields(group, new Set(['predefinedTag']), path);
  return requireArray(group.predefinedTag, `${path}.predefinedTag`).map((rawTag, tagIndex) => {
    const tagPath = `${path}.predefinedTag[${tagIndex}]`;
    const tag = requireRecord(rawTag, tagPath);
    requireExactFields(tag, new Set(['tagId']), tagPath);
    return requireInteger(tag.tagId, `${tagPath}.tagId`);
  });
}
