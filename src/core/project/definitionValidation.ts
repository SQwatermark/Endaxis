/**
 * 项目结构校验与版本化游戏数据校验的组合入口。
 * 纯结构校验保持无外部依赖；只有应用层已经装配数据仓库时才调用本模块。
 */
import { validateProjectBuildDefinitionReferences } from '../game-data/buildDefinitionValidation';
import { validateProjectEnemyDefinitionReferences } from '../game-data/enemyDefinitionValidation';
import type { GameDataRepository } from '../game-data/gameDataRepository';
import { validateMechanicSelections } from '../game-data/mechanicValidation';
import {
  assertBuffInterventionParameters,
  resolveBuffInterventionEntry,
} from '../game-data/buffInterventionCatalog';
import { validateProjectDocument, type ValidationResult } from './validation';
import {
  createProjectGameDataIndex,
  getProjectDefinitionLibrary,
} from './projectDefinitionLibrary';

/**
 * 先对不可信输入做结构校验，再校验当前已建模的 build 与机制定义引用。
 * 结构失败时不会访问仓储，避免校验器读取尚未成立的领域对象。
 */
export function validateProjectWithGameData(
  value: unknown,
  repository: GameDataRepository,
): ValidationResult {
  const structuralResult = validateProjectDocument(value);
  if (!structuralResult.ok) return structuralResult;

  const project = structuralResult.value;
  const projectRepository = createProjectGameDataIndex(
    repository,
    getProjectDefinitionLibrary(project),
  );
  const issues = validateProjectBuildDefinitionReferences(project, projectRepository);
  issues.push(...validateProjectEnemyDefinitionReferences(project, projectRepository));
  project.scenarios.forEach((scenario, scenarioIndex) => {
    scenario.buffInterventions?.forEach((plan, planIndex) => {
      if (plan.kind !== 'apply') return;
      const path = `$.scenarios[${scenarioIndex}].buffInterventions[${planIndex}]`;
      const entry = resolveBuffInterventionEntry(projectRepository, plan.buff);
      if (!entry?.definition) {
        issues.push({ path: `${path}.buff`, message: 'unknown ordinary Buff definition' });
        return;
      }
      try {
        assertBuffInterventionParameters(entry, plan.parameters);
      } catch (error) {
        issues.push({
          path: `${path}.parameters`,
          message: error instanceof Error ? error.message : String(error),
        });
      }
    });
    issues.push(
      ...validateMechanicSelections(
        scenario.mechanics,
        projectRepository,
        `$.scenarios[${scenarioIndex}].mechanics`,
      ),
    );
  });

  return issues.length === 0 ? structuralResult : { ok: false, issues };
}
