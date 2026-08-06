import type { EndaxisProjectDocument } from './schema';

export type LegacyMigrationResult =
  { ok: true; value: EndaxisProjectDocument; warnings: string[] } | { ok: false; errors: string[] };

/**
 * Converts the existing unversioned project envelope into the current document.
 * Implementations must be pure and must not read or mutate editor stores.
 */
export interface LegacyProjectImporter {
  migrate(input: unknown): LegacyMigrationResult;
}
