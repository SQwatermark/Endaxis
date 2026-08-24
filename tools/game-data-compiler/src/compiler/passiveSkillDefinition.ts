import { parseDeclaredBlackboard } from '../source/blackboard.ts';
import {
  parseNativePassiveSkillSource,
  type NativePassiveSkillSource,
} from '../source/passiveSkill.ts';
import { requireNonNegativeInteger, requireRecord } from '../source/primitives.ts';
import type { SkillPatchSource } from '../source/skillPatch.ts';
import {
  resolveSkillBlackboardSource,
  type ResolvedSkillBlackboardSource,
} from './skillBlackboard.ts';

/** 供所有领域适配器消费的被动定义输入；尚未执行 Endaxis 场景投影。 */
export interface CompiledPassiveSkillSource {
  readonly skill: NativePassiveSkillSource;
  readonly blackboard: ResolvedSkillBlackboardSource;
}

/**
 * 公共被动定义的唯一入口。先解析声明并合并 SkillPatch，再用逐等级值读取动作、条件和 Buff 赋值；
 * 调用方只负责提供原生 SkillData 与其确切 Patch，不得按领域复制这段流程。
 */
export function compilePassiveSkillSource(
  value: unknown,
  sourcePath: string,
  patch: SkillPatchSource | null,
): CompiledPassiveSkillSource {
  const root = requireRecord(value, sourcePath);
  const level = requireNonNegativeInteger(root.level, `${sourcePath}.level`);
  const blackboard = resolveSkillBlackboardSource(
    parseDeclaredBlackboard(root, sourcePath),
    level,
    patch,
  );
  return {
    skill: parseNativePassiveSkillSource(value, sourcePath, blackboard.values),
    blackboard,
  };
}
