import {
  parseSkillDefinitionReferenceSource,
  type DefinitionReferenceSource,
  type ReferenceAwareActionLeafSource,
} from './referenceGraph.ts';
import { requireNonEmptyString, requireRecord } from './primitives.ts';
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

export function parseNativeActiveSkillSource(
  value: unknown,
  sourcePath: string,
  inheritedBlackboard: BlackboardLevelValues,
): NativeActiveSkillSource {
  const root = requireRecord(value, sourcePath);
  const castType = requireNonEmptyString(root.castType, `${sourcePath}.castType`);
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
