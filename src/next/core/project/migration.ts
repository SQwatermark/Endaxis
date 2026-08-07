import type { EndaxisProjectDocument } from './schema';

export type LegacyMigrationResult =
  { ok: true; value: EndaxisProjectDocument; warnings: string[] } | { ok: false; errors: string[] };

/**
 * 将现有的无版本项目封装转换为当前文档。
 * 实现必须保持纯函数性质，不得读取或修改编辑器 Store。
 */
export interface LegacyProjectImporter {
  migrate(input: unknown): LegacyMigrationResult;
}
