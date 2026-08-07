/**
 * 旧格式进入当前 schema 前的迁移边界。迁移函数必须纯粹、逐版本且可测试，
 * 不得读取编辑器 Store、游戏目录当前默认值或一次模拟的状态。
 */
import type { EndaxisProjectDocument } from './schema';

/** 一次旧格式迁移的成功文档及警告，或不可恢复错误。 */
export type LegacyMigrationResult =
  { ok: true; value: EndaxisProjectDocument; warnings: string[] } | { ok: false; errors: string[] };

/**
 * 将现有的无版本项目封装转换为当前文档。
 * 实现必须保持纯函数性质，不得读取或修改编辑器 Store。
 */
export interface LegacyProjectImporter {
  migrate(input: unknown): LegacyMigrationResult;
}
