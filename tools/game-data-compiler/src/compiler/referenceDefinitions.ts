import {
  collectBuffActionReferences,
  type BuffActionGraphSource,
} from '../source/buffActionGraph.ts';
import {
  type ReferenceAwareActionLeafSource,
  type SkillDefinitionReferenceSource,
} from '../source/referenceGraph.ts';
import type { DefinitionReferenceNodeSource } from './referenceClosure.ts';

/**
 * 把已经严格读取的 SkillData 接到公共定义图。根 Buff 引用已经包含在 references 中，
 * 这里不能只从动作图重新收集，否则会静默丢掉附属、条件切换和换技 Buff。
 */
export function createSkillDefinitionReferenceNode(
  source: SkillDefinitionReferenceSource,
  sourcePath: string,
): DefinitionReferenceNodeSource {
  return {
    kind: 'skill',
    id: source.actionGraph.skillId,
    sourcePath,
    references: source.references,
  };
}

/** BuffData 与 SkillData 共用同一动作叶子和引用边模型，只保留定义容器自身的差异。 */
export function createBuffDefinitionReferenceNode(
  source: BuffActionGraphSource<ReferenceAwareActionLeafSource>,
  sourcePath: string,
): DefinitionReferenceNodeSource {
  return {
    kind: 'buff',
    id: source.buffId,
    sourcePath,
    references: collectBuffActionReferences(source),
  };
}
