import type { PassiveSkillCompileRequestSource } from '../domains/passiveDiscovery.ts';
import { requireRecord } from '../source/primitives.ts';
import { parseSkillPatchSource } from '../source/skillPatch.ts';
import {
  compilePassiveSkillSource,
  type CompiledPassiveSkillSource,
} from './passiveSkillDefinition.ts';

export interface CompiledPassiveSkillDefinitionSource {
  readonly skillId: string;
  readonly sourcePath: string;
  readonly definition: CompiledPassiveSkillSource;
}

export interface PassiveSkillCompilationBatchSource {
  /** 原始领域请求保持顺序和重复项；装备槽位与多个养成来源不能被定义去重吞掉。 */
  readonly requests: readonly PassiveSkillCompileRequestSource[];
  /** 相同 SkillData 只编译一次，首次请求的顺序决定稳定输出顺序。 */
  readonly definitions: readonly CompiledPassiveSkillDefinitionSource[];
}

/**
 * 把所有领域发现结果批量汇入公共被动编译器。
 * 等级来源和运行时输入仍属于请求；共享定义保留完整 SkillPatch，不在这里替领域选择等级。
 */
export function compilePassiveSkillRequestBatch(
  requests: readonly PassiveSkillCompileRequestSource[],
  skillDataValue: unknown,
  skillPatchValue: unknown,
  skillDataSourceName = 'SkillData',
): PassiveSkillCompilationBatchSource {
  const skillDataTable = requireRecord(skillDataValue, skillDataSourceName);
  const skillPatchTable = requireRecord(skillPatchValue, 'SkillPatchTable');
  const definitions: CompiledPassiveSkillDefinitionSource[] = [];
  const compiledIds = new Set<string>();

  for (const request of requests) {
    if (compiledIds.has(request.skillId)) continue;
    const sourcePath = `${skillDataSourceName}.${request.skillId}`;
    if (!(request.skillId in skillDataTable)) {
      throw new Error(`${sourcePath}: missing definition requested by ${request.sourcePath}`);
    }
    const patch =
      request.skillId in skillPatchTable
        ? parseSkillPatchSource(skillPatchTable[request.skillId], request.skillId)
        : null;
    const definition = compilePassiveSkillSource(
      skillDataTable[request.skillId],
      sourcePath,
      patch,
    );
    if (definition.skill.skillId !== request.skillId) {
      throw new Error(
        `${sourcePath}.skillId: expected ${JSON.stringify(request.skillId)}, found ${JSON.stringify(definition.skill.skillId)}`,
      );
    }
    compiledIds.add(request.skillId);
    definitions.push({ skillId: request.skillId, sourcePath, definition });
  }

  return { requests: [...requests], definitions };
}
