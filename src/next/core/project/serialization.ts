import type { EndaxisProjectDocument, JsonObject } from './schema';
import { PROJECT_SCHEMA_VERSION } from './schema';
import type { LegacyProjectImporter } from './migration';
import { validateProjectDocument, type ValidationIssue } from './validation';

export type ProjectInputKind = 'current' | 'legacy' | 'unsupported';

export interface ProjectInspection {
  kind: ProjectInputKind;
  schemaVersion?: number;
}

export type ParseProjectResult =
  | { ok: true; value: EndaxisProjectDocument }
  | { ok: false; kind: 'invalid-json'; message: string }
  | { ok: false; kind: 'legacy'; message: string }
  | { ok: false; kind: 'migration-failed'; errors: string[] }
  | { ok: false; kind: 'unsupported-version'; schemaVersion: number }
  | { ok: false; kind: 'invalid-document'; issues: ValidationIssue[] };

export interface ParseProjectOptions {
  legacyImporter?: LegacyProjectImporter;
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
      const migratedValidation = validateProjectDocument(migration.value);
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

  const validation = validateProjectDocument(value);
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
