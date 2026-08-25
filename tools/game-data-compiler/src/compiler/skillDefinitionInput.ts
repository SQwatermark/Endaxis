import { parseDeclaredBlackboard } from '../source/blackboard.ts';
import {
  requireNonNegativeInteger,
  requireRecord,
  type SourceRecord,
} from '../source/primitives.ts';
import type { SkillPatchSource } from '../source/skillPatch.ts';
import {
  resolveSkillBlackboardSource,
  type ResolvedSkillBlackboardSource,
} from './skillBlackboard.ts';

/** SkillData 各运行形态共用的严格输入；领域层不得重复实现 Patch 与声明黑板合并。 */
export interface PreparedSkillDefinitionInputSource {
  readonly root: SourceRecord;
  readonly blackboard: ResolvedSkillBlackboardSource;
}

export function prepareSkillDefinitionInputSource(
  value: unknown,
  sourcePath: string,
  patch: SkillPatchSource | null,
): PreparedSkillDefinitionInputSource {
  const root = requireRecord(value, sourcePath);
  const level = requireNonNegativeInteger(root.level, `${sourcePath}.level`);
  return {
    root,
    blackboard: resolveSkillBlackboardSource(
      parseDeclaredBlackboard(root, sourcePath),
      level,
      patch,
    ),
  };
}
