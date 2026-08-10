/**
 * 存档进入应用状态前的统一打开边界。
 * 这里负责组合格式解析、目录引用校验与游戏目录版本判定，但不会自动执行目录迁移，
 * 调用方必须根据可辨识结果明确决定直接打开、提示迁移或拒绝继续。
 */
import type { GameDataRepository } from '../core/game-data/gameDataRepository';
import type { LegacyProjectImporter } from '../core/project/migration';
import type { EndaxisProjectDocument } from '../core/project/schema';
import { parseProjectDocument, type ParseProjectResult } from '../core/project/serialization';
import { validateProjectWithGameData } from '../core/project/catalogValidation';
import type { ValidationIssue } from '../core/project/validation';

/** 目录迁移执行后的结果；迁移实现必须由调用方显式提供，打开入口不会自行构造。 */
export type GameDataRevisionMigrationResult =
  | { ok: true; value: EndaxisProjectDocument; warnings: readonly string[] }
  | { ok: false; errors: readonly string[] };

/**
 * 一条精确的游戏目录迁移边。
 * 它只允许处理声明的源版本和目标版本，不能把“尽力兼容”伪装成确定迁移。
 */
export interface GameDataRevisionMigrator {
  readonly fromRevision: string;
  readonly toRevision: string;
  migrate(project: EndaxisProjectDocument): GameDataRevisionMigrationResult;
}

/** 应用装配层按源版本和目标版本查找显式迁移器的端口。 */
export interface GameDataRevisionMigrationResolver {
  findMigration(fromRevision: string, toRevision: string): GameDataRevisionMigrator | null;
}

type ParseProjectFailure = Exclude<ParseProjectResult, { ok: true }>;

/** 项目打开入口所需的环境依赖。 */
export interface OpenProjectOptions {
  gameDataRepository: GameDataRepository;
  legacyImporter?: LegacyProjectImporter;
  gameDataMigrationResolver?: GameDataRevisionMigrationResolver;
}

interface RevisionMismatchResultBase {
  ok: false;
  project: EndaxisProjectDocument;
  projectRevision: string;
  repositoryRevision: string;
  /**
   * 使用目标目录校验得到的引用问题，仅用于帮助迁移实现判断影响面。
   * revision 不匹配时这些问题不能单独证明项目损坏。
   */
  catalogIssues: readonly ValidationIssue[];
}

/**
 * 项目打开的完整结果。
 * 只有 `opened` 可以直接进入编辑会话；其余结果都要求应用层显式处理。
 */
export type OpenProjectResult =
  | {
      ok: true;
      kind: 'opened';
      project: EndaxisProjectDocument;
      gameDataRevision: string;
    }
  | {
      ok: false;
      kind: 'parse-failed';
      cause: ParseProjectFailure;
    }
  | {
      ok: false;
      kind: 'catalog-validation-failed';
      project: EndaxisProjectDocument;
      issues: readonly ValidationIssue[];
    }
  | (RevisionMismatchResultBase & {
      kind: 'game-data-revision-mismatch';
    })
  | (RevisionMismatchResultBase & {
      kind: 'game-data-migration-available';
      migrator: GameDataRevisionMigrator;
    })
  | (RevisionMismatchResultBase & {
      kind: 'game-data-migrator-invalid';
      migrator: GameDataRevisionMigrator;
    });

/**
 * 打开不可信项目输入，并判定它能否安全使用当前游戏目录。
 * 目录引用校验会先执行；版本不匹配时其问题只作为诊断返回，不会掩盖版本边界。
 */
export function openProject(
  input: string | unknown,
  options: OpenProjectOptions,
): OpenProjectResult {
  const parsed = parseProjectDocument(input, { legacyImporter: options.legacyImporter });
  if (!parsed.ok) return { ok: false, kind: 'parse-failed', cause: parsed };

  const project = parsed.value;
  const catalogValidation = validateProjectWithGameData(project, options.gameDataRepository);
  const catalogIssues = catalogValidation.ok ? [] : catalogValidation.issues;
  const repositoryRevision = options.gameDataRepository.revision;

  if (project.gameDataRevision === repositoryRevision) {
    if (catalogIssues.length > 0) {
      return {
        ok: false,
        kind: 'catalog-validation-failed',
        project,
        issues: catalogIssues,
      };
    }
    return {
      ok: true,
      kind: 'opened',
      project,
      gameDataRevision: repositoryRevision,
    };
  }

  const mismatch = {
    ok: false as const,
    project,
    projectRevision: project.gameDataRevision,
    repositoryRevision,
    catalogIssues,
  };
  const migrator = options.gameDataMigrationResolver?.findMigration(
    project.gameDataRevision,
    repositoryRevision,
  );
  if (migrator === undefined || migrator === null) {
    return { ...mismatch, kind: 'game-data-revision-mismatch' };
  }

  if (
    migrator.fromRevision !== project.gameDataRevision ||
    migrator.toRevision !== repositoryRevision
  ) {
    return { ...mismatch, kind: 'game-data-migrator-invalid', migrator };
  }
  return { ...mismatch, kind: 'game-data-migration-available', migrator };
}
