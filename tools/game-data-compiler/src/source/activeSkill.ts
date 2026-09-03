import {
  parseSkillDefinitionReferenceSource,
  type DefinitionReferenceSource,
  type ReferenceAwareActionLeafSource,
} from './referenceGraph.ts';
import {
  requireNativeEnum,
  requireNonEmptyString,
  requireNonNegativeInteger,
  requireRecord,
} from './primitives.ts';
import type { BlackboardLevelValues } from './scalar.ts';
import type { SkillActionGraphSource } from './skillActionGraph.ts';
import {
  parseSkillTargetSelectionHeaderSource,
  type SkillTargetSelectionHeaderSource,
} from './skillTargetSelection.ts';

/** Skill.Create 对 Passive 以外的 castType 都建立普通 Skill；原生身份继续保留。 */
export interface NativeActiveSkillSource {
  readonly skillId: string;
  readonly castType: string;
  readonly targetSelection: SkillTargetSelectionHeaderSource;
  readonly actionGraph: SkillActionGraphSource<ReferenceAwareActionLeafSource>;
  readonly references: readonly DefinitionReferenceSource[];
}

const SKILL_CAST_TYPES = ['Active', 'Passive'] as const;

/** 已证实的施法元数据切片，不冒充完整 SkillData/动作图读取。 */
export function parseSkillCastMetadataSource(value: unknown, sourcePath: string) {
  const root = requireRecord(value, sourcePath);
  const castData = requireRecord(root.castData, `${sourcePath}.castData`);
  return {
    sourcePath,
    skillId: requireNonEmptyString(root.skillId, `${sourcePath}.skillId`),
    startCdFrame: requireNonNegativeInteger(
      castData.startCdFrame,
      `${sourcePath}.castData.startCdFrame`,
    ),
    targetSelection: parseSkillTargetSelectionHeaderSource(value, sourcePath),
  };
}

export function parseNativeActiveSkillSource(
  value: unknown,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeActiveSkillSource {
  const root = requireRecord(value, sourcePath);
  const castType = requireNativeEnum(root.castType, SKILL_CAST_TYPES, `${sourcePath}.castType`);
  if (castType === 'Passive') {
    throw new Error(`${sourcePath}.castType: passive SkillData must use the passive compiler`);
  }
  const definition = parseSkillDefinitionReferenceSource(value, sourcePath, inheritedBlackboard);
  return {
    skillId: definition.actionGraph.skillId,
    castType,
    targetSelection: parseSkillTargetSelectionHeaderSource(value, sourcePath),
    actionGraph: definition.actionGraph,
    references: definition.references,
  };
}
