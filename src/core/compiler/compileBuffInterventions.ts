/** 把来源限定的用户计划编译成固定排程；定义和实例参数仍由正式 Buff 路径解释。 */
import type { GameDataBrowser } from '../game-data/gameDataRepository';
import {
  buffInterventionReferenceKey,
  compileBuffInterventionResource,
  listBuffInterventionCatalog,
  type BuffInterventionCatalogRepository,
} from '../game-data/buffInterventionCatalog';
import type { ScenarioDocument } from '../project/schema';
import type { CombatOperatorProgram } from '../combat/runtime/combatRuntimeAssembly';
import type {
  BuffInterventionProgram,
  CompiledBuffIntervention,
} from '../combat/runtime/buffInterventionRuntime';
import { compileIndependentBuffResource } from './compileSkill';

export function compileScenarioBuffInterventions(
  scenario: ScenarioDocument,
  repository: BuffInterventionCatalogRepository,
  operators: readonly CombatOperatorProgram[],
): { program?: BuffInterventionProgram; operators: readonly CombatOperatorProgram[] } {
  const plans = scenario.buffInterventions ?? [];
  if (plans.length === 0) return { operators };
  if (
    !repository.getOperators ||
    !repository.getWeapons ||
    !repository.getGears ||
    !repository.getGearSets
  )
    throw new Error('Buff 干预需要完整来源目录，不能用当前已上场定义推断唯一身份。');
  const catalog = listBuffInterventionCatalog(
    repository as BuffInterventionCatalogRepository & GameDataBrowser,
  );
  const entries = new Map(catalog.map(entry => [entry.key, entry]));
  const ids = new Set(operators.map(operator => operator.operatorId));
  const definitions = new Map(
    operators.map(operator => [operator.operatorId, { ...operator.buffDefinitions }]),
  );
  const compiled: CompiledBuffIntervention[] = [];
  const applications = new Map(
    plans.filter(plan => plan.kind === 'apply').map(plan => [plan.id, plan]),
  );
  const uniqueIds = new Set<string>();
  for (const plan of plans) {
    if (uniqueIds.has(plan.id)) throw new Error(`重复的 Buff 干预 ID：${plan.id}`);
    uniqueIds.add(plan.id);
    if (plan.kind === 'finish') {
      const application = applications.get(plan.applicationId);
      if (
        !application ||
        plan.frame < application.frame ||
        (plan.frame === application.frame && plans.indexOf(application) >= plans.indexOf(plan))
      )
        throw new Error(`Buff 结束计划 ${plan.id} 必须引用已经施加的计划。`);
      const entry = entries.get(buffInterventionReferenceKey(application.buff));
      if (!entry?.support.finish) throw new Error(`Buff ${application.buff.buffId} 不支持结束。`);
      compiled.push(plan);
      continue;
    }
    const entry = entries.get(buffInterventionReferenceKey(plan.buff));
    if (!entry) throw new Error(`Buff 干预来源不存在：${buffInterventionReferenceKey(plan.buff)}`);
    if (plan.target.kind === 'operator' && !ids.has(plan.target.operatorId))
      throw new Error(`Buff 干预目标干员不存在：${plan.target.operatorId}`);
    if (plan.sourceOperatorId !== undefined && !ids.has(plan.sourceOperatorId))
      throw new Error(`Buff 干预来源干员不存在：${plan.sourceOperatorId}`);
    if (plan.kind === 'suppress') {
      if (!entry.support.suppress) throw new Error(entry.support.suppressionReasons.join(' '));
      compiled.push(plan);
      continue;
    }
    if (!entry.support.targets.includes(plan.target.kind))
      throw new Error(
        `Buff ${plan.buff.buffId} 不支持目标 ${plan.target.kind}：${entry.support.targetReasons[plan.target.kind]?.join(' ') ?? entry.support.reasons.join(' ')}`,
      );
    const definition = compileBuffInterventionResource(repository, plan.buff, plan.parameters);
    // 同 ID 已由目录证明全库唯一。基础定义供恢复查找，参数保存在实例黑板，不能覆盖其他计划。
    const owned = definitions.get(plan.sourceOperatorId)!;
    owned[plan.buff.buffId] ??= compileIndependentBuffResource(
      entry.definition!,
      plan.buff.buffId,
      repository.actionPrograms,
    );
    compiled.push({ ...plan, definition });
  }
  return {
    program: {
      plans: compiled,
      provenance: catalog
        .filter(entry => !entry.reference.resourceKind)
        .map(entry => ({
          reference: entry.reference,
          definitionOwnerIds: ['battle', ...ids],
        })),
    },
    operators: operators.map(operator => ({
      ...operator,
      buffDefinitions: definitions.get(operator.operatorId)!,
    })),
  };
}
