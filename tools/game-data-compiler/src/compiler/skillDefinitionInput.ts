import { parseDeclaredBlackboard } from '../source/blackboard.ts';
import {
  requireArray,
  requireNonNegativeInteger,
  requireRecord,
  type SourceRecord,
} from '../source/primitives.ts';
import { collectSkillRootBuffReferences } from '../source/referenceGraph.ts';
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

/** 时间轴投影尚无根附加效果端口；必须显式拒绝，不能把动作图成功当成完整技能成功。 */
export function assertNoUnprojectedSkillRootEffects(value: unknown, sourcePath: string): void {
  if (
    collectSkillRootBuffReferences(value, sourcePath).some(
      reference => reference.state !== 'inactive',
    )
  )
    throw new Error(`${sourcePath}: skill root Buff installation is not yet supported`);
  const root = requireRecord(value, sourcePath);
  const modifier = requireRecord(root.cardAttributeModifier, `${sourcePath}.cardAttributeModifier`);
  if (
    modifier.isConvertedAttribute !== false ||
    requireArray(
      modifier.attributeModifiers,
      `${sourcePath}.cardAttributeModifier.attributeModifiers`,
    ).length
  )
    throw new Error(`${sourcePath}: skill root attribute modifiers are not yet supported`);
}
