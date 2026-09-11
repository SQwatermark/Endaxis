import { prepareLegacySource, type ConversionMappings } from './sourcePreparation';
import { createLegacyProjectImporter } from './projectConversion';
import { parseProjectDocument } from '../../src/core/project/serialization';
import type { GameDataRepository } from '../../src/core/game-data/gameDataRepository';
import { resolveScenarioBuilds } from '../../src/core/compiler/resolveScenarioBuilds';
import { resolveScenarioOperatorPanels } from '../../src/core/compiler/resolveOperatorPanel';
import { compileOperatorDefinitionSkills } from '../../src/core/compiler/compileScenarioTimeline';
import { resolveScenarioOperatorResourceRules } from '../../src/core/compiler/resolveScenarioResourceRules';
import type { EndaxisProjectDocument } from '../../src/core/project/schema';

function validateInitialUltimateEnergy(
  project: EndaxisProjectDocument,
  repository: GameDataRepository,
) {
  const issues: { path: string; message: string }[] = [];
  for (const [scenarioIndex, scenario] of project.scenarios.entries()) {
    const builds = resolveScenarioBuilds(scenario, repository);
    const panels = resolveScenarioOperatorPanels(builds, scenario.globalConfig);
    const programs = builds.map(build => ({
      operatorId: build.track.id,
      skills: compileOperatorDefinitionSkills(
        build.track.id,
        build.operatorInstance,
        build.operator,
        repository.getCommonAbilityEntityDefinitions?.(),
        panels.find(panel => panel.operatorId === build.track.id)?.attributes,
      ),
    }));
    const rules = resolveScenarioOperatorResourceRules(programs, panels);
    scenario.tracks.forEach((track, trackIndex) => {
      if (track === null) return;
      const maximum = rules.get(track.id)?.maxUltimateEnergy;
      if (maximum !== undefined && track.initialState.ultimateEnergy > maximum) {
        issues.push({
          path: `scenarioList[${scenarioIndex}].data.tracks[${trackIndex}].initialGauge`,
          message: `初始终结技能量 ${track.initialState.ultimateEnergy} 超过当前原生上限 ${maximum}`,
        });
      }
    });
  }
  return issues;
}

/** 离线工具的唯一转换入口；有遗漏或目标校验失败时不返回可用项目。 */
export function convertLegacyTimeline(
  input: unknown,
  repository: GameDataRepository,
  mappings: ConversionMappings = {},
) {
  const prepared = prepareLegacySource(input, mappings);
  const result = createLegacyProjectImporter(repository).migrate(prepared.source);
  const issues = [...prepared.issues];
  if (!result.ok) issues.push(...result.errors.map(message => ({ path: '', message })));
  else issues.push(...result.warnings.map(message => ({ path: '', message })));
  if (result.ok) {
    const checked = parseProjectDocument(result.value, { gameDataRepository: repository });
    if (!checked.ok) issues.push({ path: '', message: JSON.stringify(checked) });
    else issues.push(...validateInitialUltimateEnergy(checked.value, repository));
  }
  return {
    status: issues.length ? 'blocked' : 'converted',
    project: result.ok && !issues.length ? result.value : null,
    report: {
      issues,
      times: prepared.times,
      identityChanges: prepared.identityChanges,
      unresolvedSkills: prepared.unresolvedSkills,
      sourceActionCounts: prepared.source.scenarioList.map((s: any) => ({
        id: s.id,
        count: s.data.tracks.reduce((n: number, t: any) => n + t.actions.length, 0),
      })),
      limitations: [
        '只转换保存的输入坐标，不等于已还原旧版加载后时间编译或屏幕位置',
        '使用当前游戏定义重算；旧 hits、Buff、面板、伤害等快照不迁移',
        '未实现旧自定义行为、连接、继承状态、合约及非中性全局修正',
      ],
    },
  };
}
