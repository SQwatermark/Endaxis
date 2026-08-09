/**
 * 项目结构校验与版本化游戏目录校验的组合入口。
 * 纯结构校验保持无外部依赖；只有应用层已经装配目录仓储时才调用本模块。
 */
import { validateProjectBuildCatalogReferences } from '../game-data/buildCatalogValidation';
import { validateProjectEnemyCatalogReferences } from '../game-data/enemyCatalogValidation';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import { validateMechanicSelections } from '../game-data/mechanicValidation';
import { validateProjectDocument, type ValidationResult } from './validation';

/**
 * 先收窄不可信输入，再校验当前已建模的 build 与机制目录引用。
 * 结构失败时不会访问仓储，避免校验器读取尚未成立的领域对象。
 */
export function validateProjectWithGameData(
  value: unknown,
  repository: GameDataRepository,
): ValidationResult {
  const structuralResult = validateProjectDocument(value);
  if (!structuralResult.ok) return structuralResult;

  const project = structuralResult.value;
  const issues = validateProjectBuildCatalogReferences(project, repository);
  issues.push(...validateProjectEnemyCatalogReferences(project, repository));
  project.scenarios.forEach((scenario, scenarioIndex) => {
    issues.push(
      ...validateMechanicSelections(
        scenario.mechanics,
        repository,
        `$.scenarios[${scenarioIndex}].mechanics`,
      ),
    );
  });

  return issues.length === 0 ? structuralResult : { ok: false, issues };
}
