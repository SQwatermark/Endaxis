import type { SkillType } from '../../../../../packages/game-data-contract/src/primitives.ts';
import type { SkillGroupDefinition } from '../../../../../packages/game-data-contract/src/skills.ts';
export type { SkillType as OperatorActiveSkillTypeSource } from '../../../../../packages/game-data-contract/src/primitives.ts';

import {
  compileActiveSkillRequestBatch,
  type CompiledActiveSkillDefinitionSource,
} from '../../compiler/activeSkillBatch.ts';
import {
  requireArray,
  requireExactFields,
  requireNonEmptyString,
  requireRecord,
  type SourceRecord,
} from '../../source/primitives.ts';

const ENTRY_REQUIRED_FIELDS = new Set(['key', 'skillType', 'source']);
const ENTRY_FIELDS = new Set([...ENTRY_REQUIRED_FIELDS, 'compile']);

/** 兼容旧入口的支持列表和遍历顺序；类型身份归契约，不能把排序差异误当成新枚举。 */
export const OPERATOR_ACTIVE_SKILL_TYPES = [
  'basicAttack',
  'finisher',
  'plungingAttack',
  'battleSkill',
  'comboSkill',
  'ultimate',
] as const satisfies readonly SkillType[];

/** operators.json 中的领域身份；compile 暂时只保留，不由新主干解释旧 Python 策略。 */
export type OperatorActiveSkillEntrySource = Readonly<
  Pick<SkillGroupDefinition, 'key' | 'skillType'>
> & {
  readonly sourcePath: string;
  readonly sourceFile: string;
  readonly projectionConfig: SourceRecord | null;
};

export interface CompiledOperatorActiveSkillEntrySource extends OperatorActiveSkillEntrySource {
  readonly skillId: string;
  readonly definition: CompiledActiveSkillDefinitionSource;
}

export interface OperatorActiveSkillCompilationSource {
  readonly entries: readonly CompiledOperatorActiveSkillEntrySource[];
  readonly definitions: readonly CompiledActiveSkillDefinitionSource[];
}

export function parseOperatorActiveSkillEntries(
  value: unknown,
  sourcePath: string,
): OperatorActiveSkillEntrySource[] {
  const entries = requireArray(value, sourcePath).map((raw, index) => {
    const path = `${sourcePath}[${index}]`;
    const row = requireRecord(raw, path);
    requireExactFields(row, row.compile === undefined ? ENTRY_REQUIRED_FIELDS : ENTRY_FIELDS, path);
    const sourceFile = requireNonEmptyString(row.source, `${path}.source`);
    if (!/^[A-Za-z0-9._-]+\.json$/.test(sourceFile)) {
      throw new Error(`${path}.source: expected a safe JSON file name`);
    }
    const skillTypeName = requireNonEmptyString(row.skillType, `${path}.skillType`);
    const skillType = OPERATOR_ACTIVE_SKILL_TYPES.find(type => type === skillTypeName);
    if (skillType === undefined) {
      throw new Error(
        `${path}.skillType: unsupported operator skill type ${JSON.stringify(skillTypeName)}`,
      );
    }
    return {
      sourcePath: path,
      key: requireNonEmptyString(row.key, `${path}.key`),
      skillType,
      sourceFile,
      projectionConfig:
        row.compile === undefined ? null : requireRecord(row.compile, `${path}.compile`),
    };
  });
  requireUnique(entries, entry => entry.key, `${sourcePath}.key`);
  requireUnique(entries, entry => entry.sourceFile, `${sourcePath}.source`);
  return entries;
}

/**
 * 将 Operator 的编辑器技能身份绑定到文件内原生 skillId，再进入公共主动 SkillData 批量入口。
 */
export function compileOperatorActiveSkills(
  manifestValue: unknown,
  skillDataBySourceFileValue: unknown,
  skillPatchTableValue: unknown,
  sourcePath: string,
): OperatorActiveSkillCompilationSource {
  const entries = parseOperatorActiveSkillEntries(manifestValue, sourcePath);
  const files = requireRecord(skillDataBySourceFileValue, 'SkillDataFiles');
  const skillDataById: Record<string, unknown> = {};
  const requests = entries.map(entry => {
    if (!(entry.sourceFile in files)) {
      throw new Error(`${entry.sourcePath}.source: missing SkillData file ${entry.sourceFile}`);
    }
    const raw = files[entry.sourceFile];
    const root = requireRecord(raw, entry.sourceFile);
    const skillId = requireNonEmptyString(root.skillId, `${entry.sourceFile}.skillId`);
    if (skillId in skillDataById) {
      throw new Error(
        `${entry.sourcePath}.source: duplicate native skillId ${JSON.stringify(skillId)}`,
      );
    }
    skillDataById[skillId] = raw;
    return { sourcePath: `${entry.sourcePath}.source`, skillId };
  });
  const batch = compileActiveSkillRequestBatch(requests, skillDataById, skillPatchTableValue);
  const definitionById = new Map(batch.definitions.map(item => [item.skillId, item]));
  return {
    entries: entries.map((entry, index) => {
      const skillId = requests[index]!.skillId;
      return { ...entry, skillId, definition: definitionById.get(skillId)! };
    }),
    definitions: batch.definitions,
  };
}

function requireUnique<T>(values: readonly T[], keyOf: (value: T) => string, path: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    const key = keyOf(value);
    if (seen.has(key)) throw new Error(`${path}: duplicate value ${JSON.stringify(key)}`);
    seen.add(key);
  }
}
