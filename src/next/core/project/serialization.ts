/**
 * 存档与文本/对象输入之间的稳定 I/O 边界。
 * 解析前先识别版本并校验，序列化只接受合法项目，不能在这里补算派生数据。
 */
import type { EndaxisProjectDocument, JsonObject } from './schema';
import { PROJECT_SCHEMA_VERSION } from './schema';
import type { LegacyProjectImporter } from './migration';
import { validateProjectDocument, type ValidationIssue, type ValidationResult } from './validation';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import { validateProjectWithGameData } from './catalogValidation';

/** 只做结构识别的输入类别，不代表文档已经通过完整校验。 */
export type ProjectInputKind = 'current' | 'legacy' | 'unsupported';

/** 项目输入的轻量检查结果，供加载流程选择校验或迁移路径。 */
export interface ProjectInspection {
  kind: ProjectInputKind;
  schemaVersion?: number;
}

/** 项目解析的完整可辨识结果；调用方必须处理每一种失败类型。 */
export type ParseProjectResult =
  | { ok: true; value: EndaxisProjectDocument }
  | { ok: false; kind: 'invalid-json'; message: string }
  | { ok: false; kind: 'legacy'; message: string }
  | { ok: false; kind: 'migration-failed'; errors: string[] }
  | { ok: false; kind: 'unsupported-version'; schemaVersion: number }
  | { ok: false; kind: 'invalid-document'; issues: ValidationIssue[] };

/** 解析项目时可选注入的旧格式迁移器。 */
export interface ParseProjectOptions {
  legacyImporter?: LegacyProjectImporter;
  /** 提供后，加载流程还会校验 build 与机制的版本化目录引用。 */
  gameDataRepository?: GameDataRepository;
}

function validateLoadedProject(value: unknown, options: ParseProjectOptions): ValidationResult {
  return options.gameDataRepository === undefined
    ? validateProjectDocument(value)
    : validateProjectWithGameData(value, options.gameDataRepository);
}

function isObject(value: unknown): value is JsonObject {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function inspectProjectInput(value: unknown): ProjectInspection {
  if (!isObject(value)) return { kind: 'unsupported' };
  if (typeof value.schemaVersion === 'number') {
    return {
      kind: value.schemaVersion === PROJECT_SCHEMA_VERSION ? 'current' : 'unsupported',
      schemaVersion: value.schemaVersion,
    };
  }
  if (Array.isArray(value.scenarioList) || value.version === '1.0.0') return { kind: 'legacy' };
  return { kind: 'unsupported' };
}

export function parseProjectDocument(
  input: string | unknown,
  options: ParseProjectOptions = {},
): ParseProjectResult {
  let value: unknown = input;
  if (typeof input === 'string') {
    try {
      value = JSON.parse(input);
    } catch (error) {
      return {
        ok: false,
        kind: 'invalid-json',
        message: error instanceof Error ? error.message : 'invalid JSON',
      };
    }
  }

  const inspection = inspectProjectInput(value);
  if (inspection.kind === 'legacy') {
    if (options.legacyImporter) {
      const migration = options.legacyImporter.migrate(value);
      if (!migration.ok) return { ok: false, kind: 'migration-failed', errors: migration.errors };
      const migratedValidation = validateLoadedProject(migration.value, options);
      if (!migratedValidation.ok) {
        return { ok: false, kind: 'invalid-document', issues: migratedValidation.issues };
      }
      return migratedValidation;
    }
    return {
      ok: false,
      kind: 'legacy',
      message: 'legacy project detected; migrate it before loading the V2 document',
    };
  }
  if (inspection.kind === 'unsupported' && inspection.schemaVersion !== undefined) {
    return {
      ok: false,
      kind: 'unsupported-version',
      schemaVersion: inspection.schemaVersion,
    };
  }

  const validation = validateLoadedProject(value, options);
  if (!validation.ok) return { ok: false, kind: 'invalid-document', issues: validation.issues };
  return validation;
}

export function serializeProjectDocument(project: EndaxisProjectDocument, pretty = false): string {
  const validation = validateProjectDocument(project);
  if (!validation.ok) {
    const summary = validation.issues.map(issue => `${issue.path}: ${issue.message}`).join('\n');
    throw new Error(`cannot serialize invalid project document:\n${summary}`);
  }
  return JSON.stringify(project, null, pretty ? 2 : undefined);
}
