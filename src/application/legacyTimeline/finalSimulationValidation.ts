import type { EndaxisProjectDocument } from '../../core/project/schema';
import { projectSkillAvailabilityDiagnostics } from '../../core/projection/skillAvailabilityDiagnostics';
import { projectSkillExecutionDiagnostics } from '../../core/projection/skillExecutionDiagnostics';
import { projectComboWindowDiagnostics } from '../../core/projection/comboWindowDiagnostics';
import { projectDodgeMarkerDiagnostics } from '../../core/projection/dodgeMarkerDiagnostics';
import type { LegacyRetimingSimulationRunner } from './heuristicRetiming';

/**
 * 只验收最终交付的轴，不修复位置、不复用重排候选。
 * 可用性/未知诊断沿用正式投影；验证失败仍保留可编辑项目，由转换报告明确提示。
 */
export function validateLegacyFinalSimulation(
  project: EndaxisProjectDocument,
  simulate: LegacyRetimingSimulationRunner,
) {
  return project.scenarios.map((scenario, scenarioIndex) => {
    const base = {
      scenarioId: scenario.id,
      path: `$.scenarios[${scenarioIndex}]`,
      endFrame: scenario.battle.durationFrames,
    };
    try {
      const { receiptEntries } = simulate(scenario, base.endFrame);
      const availability = projectSkillAvailabilityDiagnostics(receiptEntries);
      const execution = projectSkillExecutionDiagnostics(receiptEntries);
      const comboWindow = projectComboWindowDiagnostics(receiptEntries);
      const dodges = [...projectDodgeMarkerDiagnostics(receiptEntries)]
        .filter(([, diagnostic]) => diagnostic.status !== 'normal')
        .map(([id, diagnostic]) => ({ id, ...diagnostic }));
      const rejectedInputs = receiptEntries.filter(
        entry => entry.event === 'SkillInputProcessed' && entry.data?.accepted === false,
      );
      const hasIssues =
        availability.length +
          execution.length +
          comboWindow.length +
          dodges.length +
          rejectedInputs.length >
        0;
      return {
        ...base,
        status: hasIssues ? ('issues' as const) : ('passed' as const),
        availability,
        execution,
        comboWindow,
        dodges,
        rejectedInputs,
      };
    } catch (error) {
      return {
        ...base,
        status: 'failed' as const,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  });
}
