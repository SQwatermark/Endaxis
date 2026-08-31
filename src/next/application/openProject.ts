/**
 * 存档进入应用状态前的统一打开边界。
 * 这里负责组合格式解析、最新定义引用校验与游戏数据版本归一。
 */
import type { GameDataRepository } from '../core/game-data/gameDataRepository';
import type { LegacyProjectImporter } from '../core/project/migration';
import type { EndaxisProjectDocument } from '../core/project/schema';
import { parseProjectDocument, type ParseProjectResult } from '../core/project/serialization';
import { validateProjectWithGameData } from '../core/project/definitionValidation';
import type { ValidationIssue } from '../core/project/validation';

type ParseProjectFailure = Exclude<ParseProjectResult, { ok: true }>;

/** 项目打开入口所需的环境依赖。 */
export interface OpenProjectOptions {
  gameDataRepository: GameDataRepository;
  legacyImporter?: LegacyProjectImporter;
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
      /** 旧标记已归一为当前唯一数据版本，调用方应提示重新导出。 */
      gameDataRevisionUpdated: boolean;
    }
  | {
      ok: false;
      kind: 'parse-failed';
      cause: ParseProjectFailure;
    }
  | {
      ok: false;
      kind: 'definition-validation-failed';
      project: EndaxisProjectDocument;
      issues: readonly ValidationIssue[];
    };

/**
 * 打开不可信项目输入，并只用最新游戏数据校验全部定义引用。
 * 历史 revision 不对应历史数据仓库；引用仍有效时只归一版本标记。
 */
export function openProject(
  input: string | unknown,
  options: OpenProjectOptions,
): OpenProjectResult {
  const parsed = parseProjectDocument(input, { legacyImporter: options.legacyImporter });
  if (!parsed.ok) return { ok: false, kind: 'parse-failed', cause: parsed };

  const project = parsed.value;
  const definitionValidation = validateProjectWithGameData(project, options.gameDataRepository);
  const repositoryRevision = options.gameDataRepository.revision;
  if (!definitionValidation.ok) {
    return {
      ok: false,
      kind: 'definition-validation-failed',
      project,
      issues: definitionValidation.issues,
    };
  }

  const gameDataRevisionUpdated = project.gameDataRevision !== repositoryRevision;
  return {
    ok: true,
    kind: 'opened',
    project: gameDataRevisionUpdated
      ? { ...project, gameDataRevision: repositoryRevision }
      : project,
    gameDataRevision: repositoryRevision,
    gameDataRevisionUpdated,
  };
}
