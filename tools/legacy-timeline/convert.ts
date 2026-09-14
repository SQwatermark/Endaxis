import { prepareLegacySource, type ConversionMappings } from './sourcePreparation';
import { createLegacyProjectImporter } from './projectConversion';
import { parseProjectDocument } from '../../src/core/project/serialization';
import type { GameDataRepository } from '../../src/core/game-data/gameDataRepository';
import { resolveScenarioBuilds } from '../../src/core/compiler/resolveScenarioBuilds';
import { resolveScenarioOperatorPanels } from '../../src/core/compiler/resolveOperatorPanel';
import { compileOperatorDefinitionSkills } from '../../src/core/compiler/compileScenarioTimeline';
import { resolveScenarioOperatorResourceRules } from '../../src/core/compiler/resolveScenarioResourceRules';
import type { EndaxisProjectDocument } from '../../src/core/project/schema';
import {
  retimeLegacyProjectBySimulation,
  type LegacyRuntimeReplacementResolver,
} from './heuristicRetiming';
import { ScenarioSimulationService } from '../../src/application/scenarioSimulationService';
import { CheckpointRetimingSession } from './checkpointRetiming';
import { skillSettings, skillSettingResources } from '../../src/data/combat/skillSettings';
import { elementalAttachments } from '../../src/data/buffs/elementalAttachments';
import { compoundStatusFactories } from '../../src/data/buffs/compoundStatusFactories';
import { MechanicAdapterRegistry } from '../../src/core/mechanics/mechanicCompiler';
import { contingencyContractMechanicAdapter } from '../../src/data/mechanics/contingencyContractAdapter';
import { expandLegacyRecursiveSkillSequences } from './recursiveSequenceExpansion';
import { listSkillGroupDefinitionBindings } from '../../src/core/game-data/operatorSkillDefinitions';
import type { OperatorDefinition } from '../../src/core/game-data/operatorDefinition';

export function resolveLegacyRuntimeReplacementSkillKey(
  operator: OperatorDefinition,
  skillGroupKey: string,
  expectedSkillKey: string,
  actualSkillKey: string,
): string | null {
  const group = operator.skillGroups.find(candidate => candidate.key === skillGroupKey);
  const slot = operator.skillSlots?.find(candidate => candidate.key === skillGroupKey);
  if (
    group === undefined ||
    slot === undefined ||
    expectedSkillKey !== slot.baseSkillKey ||
    !slot.replacementSkillKeys.includes(actualSkillKey)
  ) {
    return null;
  }
  return listSkillGroupDefinitionBindings(group).some(
    binding => binding.skill.key === actualSkillKey,
  )
    ? actualSkillKey
    : null;
}

function createLegacyRuntimeReplacementResolver(
  repository: GameDataRepository,
): LegacyRuntimeReplacementResolver {
  return ({ scenario, trackIndex, skillGroupKey, expectedSkillKey, actualSkillKey }) => {
    const build = resolveScenarioBuilds(scenario, repository).find(
      candidate => candidate.trackIndex === trackIndex,
    );
    return build === undefined
      ? null
      : resolveLegacyRuntimeReplacementSkillKey(
          build.operator,
          skillGroupKey,
          expectedSkillKey,
          actualSkillKey,
        );
  };
}

interface LegacyResourceAdjustment {
  readonly path: string;
  readonly resource: 'ultimateEnergy';
  readonly from: number;
  readonly to: number;
  readonly reason: 'clampedToCurrentNativeMaximum';
}

function normalizeInitialUltimateEnergy(
  project: EndaxisProjectDocument,
  repository: GameDataRepository,
) {
  const adjustments: LegacyResourceAdjustment[] = [];
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
      const maximum =
        track.initialState.maxUltimateEnergyOverride ?? rules.get(track.id)?.maxUltimateEnergy;
      if (maximum !== undefined && track.initialState.ultimateEnergy > maximum) {
        adjustments.push({
          path: `scenarioList[${scenarioIndex}].data.tracks[${trackIndex}].initialGauge`,
          resource: 'ultimateEnergy',
          from: track.initialState.ultimateEnergy,
          to: maximum,
          reason: 'clampedToCurrentNativeMaximum',
        });
        // 旧版运行时同样会在模拟开始时把存档初值钳到当时的槽上限。
        // 转换为当前原生上限并留下报告，不能让无效的存档原值阻塞整条轴。
        track.initialState.ultimateEnergy = maximum;
      }
    });
  }
  return adjustments;
}

/** 离线工具的唯一转换入口；有遗漏或目标校验失败时不返回可用项目。 */
export function convertLegacyTimeline(
  input: unknown,
  repository: GameDataRepository,
  mappings: ConversionMappings = {},
) {
  const prepared = prepareLegacySource(input, mappings);
  const result = createLegacyProjectImporter(repository).migrate(prepared.source);
  const mechanicAdapters = new MechanicAdapterRegistry([contingencyContractMechanicAdapter]);
  const simulation = new ScenarioSimulationService({
    index: repository,
    mechanicAdapters,
    elementalInflictionDocument: elementalAttachments,
    spellInflictionSettings: skillSettings,
    compoundStatusFactories,
    resources: {
      sharedSpGain: { baseGainEfficiency: skillSettingResources.atbGainEfficiency },
      spRecoveryPauseDuration: skillSettingResources.atbRecoverInterval,
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: {
        selfGainPerSp: skillSettingResources.atbConsumedDefaultUspGainSelf,
        otherGainPerSp: skillSettingResources.atbConsumedDefaultUspGainOther,
      },
    },
  });
  const runSimulation = (
    scenario: EndaxisProjectDocument['scenarios'][number],
    endFrame: number,
  ) => {
    const session = simulation.createCombatSession(scenario, endFrame);
    session.advanceToFrame(endFrame);
    return session.collectResult();
  };
  const issues = [...prepared.issues];
  let resourceAdjustments: LegacyResourceAdjustment[] = [];
  if (!result.ok) issues.push(...result.errors.map(message => ({ path: '', message })));
  else issues.push(...result.warnings.map(message => ({ path: '', message })));
  if (result.ok) {
    const checked = parseProjectDocument(result.value, { gameDataRepository: repository });
    if (!checked.ok) issues.push({ path: '', message: JSON.stringify(checked) });
    else resourceAdjustments = normalizeInitialUltimateEnergy(result.value, repository);
  }
  // 智能重排会启动正式模拟，必须先完成所有静态校验。否则初始资源等非法值会让
  // 转换器直接抛错，用户既拿不到项目，也拿不到说明具体字段的阻塞报告。
  const sequenceExpansion =
    result.ok && issues.length === 0
      ? expandLegacyRecursiveSkillSequences(
          result.value,
          prepared.source,
          repository,
          runSimulation,
        )
      : { expansions: [], issues: [] };
  issues.push(...sequenceExpansion.issues);
  const retiming =
    result.ok && issues.length === 0
      ? retimeLegacyProjectBySimulation(
          result.value,
          prepared.source,
          runSimulation,
          createLegacyRuntimeReplacementResolver(repository),
          {
            compileInputs: scenario => simulation.compileFixedInputs(scenario),
            createSession: (scenario, frame) =>
              new CheckpointRetimingSession(simulation.createInputCombatSession(scenario, frame)),
          },
        )
      : {
          timingAdjustments: [],
          skillFormAdjustments: [],
          controlSwitchAdjustments: [],
          inferredControlSwitches: [],
          simulationStats: {
            scenarioCount: 0,
            castCount: 0,
            candidateProbes: 0,
            simulationRuns: 0,
          },
        };
  if (result.ok && issues.length === 0) {
    const checked = parseProjectDocument(result.value, { gameDataRepository: repository });
    if (!checked.ok) issues.push({ path: '', message: JSON.stringify(checked) });
  }
  return {
    status: issues.length ? 'blocked' : 'converted',
    project: result.ok && !issues.length ? result.value : null,
    report: {
      issues,
      times: prepared.times,
      identityChanges: prepared.identityChanges,
      unresolvedSkills: prepared.unresolvedSkills,
      sequenceExpansions: sequenceExpansion.expansions,
      resourceAdjustments,
      timingAdjustments: retiming.timingAdjustments,
      skillFormAdjustments: retiming.skillFormAdjustments,
      controlSwitchAdjustments: retiming.controlSwitchAdjustments,
      inferredControlSwitches: retiming.inferredControlSwitches,
      retimingSimulationStats: retiming.simulationStats,
      sourceActionCounts: prepared.source.scenarioList.map((s: any) => ({
        id: s.id,
        count: s.data.tracks.reduce((n: number, t: any) => n + t.actions.length, 0),
      })),
      limitations: [
        '按旧版全局技能顺序，使用新版逐步模拟的开始、结束、允许接续窗口和终结技时间膨胀区间修正放置帧',
        '旧轴默认第1轨道为主控，并在其他干员的普攻、强化普攻、下落攻击或处决开始时补主控切换标记',
        '使用当前游戏定义重算；旧 hits、Buff、面板、伤害等快照不迁移',
        '连接只支持可唯一对应技能块的 action-to-action 端点；未实现旧自定义行为、派生端点、继承状态、合约及非中性全局修正',
      ],
    },
  };
}
