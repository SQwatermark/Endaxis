import type { CombatReceiptEntry } from '../../src/core/combat/receipt/combatReceipt';
import type { ScenarioDocument } from '../../src/core/project/schema';
import { projectSkillAvailabilityDiagnostics } from '../../src/core/projection/skillAvailabilityDiagnostics';
import { projectComboWindowDiagnostics } from '../../src/core/projection/comboWindowDiagnostics';
import { projectSkillExecutionDiagnostics } from '../../src/core/projection/skillExecutionDiagnostics';

interface SimulationReader {
  simulate(
    scenario: ScenarioDocument,
    endFrame: number,
  ): Promise<{
    readonly receiptEntries: readonly CombatReceiptEntry[];
  }>;
}

function damageEntries(entries: readonly CombatReceiptEntry[]) {
  return entries
    .filter(entry => entry.event === 'DamageApplied')
    .map(entry => {
      const expectedDamage = entry.data?.expectedDamage;
      if (typeof expectedDamage !== 'number' || !Number.isFinite(expectedDamage)) {
        throw new Error(`DamageApplied ${entry.sequence} has no finite expectedDamage`);
      }
      return {
        frame: entry.frame,
        sourceId: entry.sourceId,
        castId: entry.data?.castId,
        sourceActionId: entry.data?.sourceActionId,
        stepKey: entry.data?.stepKey,
        expectedDamage,
      };
    });
}

/** 与正式技能块使用相同投影；保留关联回执，不在审计器另造判定规则。 */
function summarizeDiagnostics(entries: readonly CombatReceiptEntry[]) {
  const availability = projectSkillAvailabilityDiagnostics(entries);
  const comboWindow = projectComboWindowDiagnostics(entries);
  const execution = projectSkillExecutionDiagnostics(entries);
  const sequences = new Set(
    [...availability, ...comboWindow, ...execution].flatMap(d => d.receiptSequences),
  );
  return {
    availability,
    comboWindow,
    execution,
    evidence: entries.filter(entry => sequences.has(entry.sequence)),
  };
}

/** 按回执原始来源拆账；不截取 ID，不把能力实体或无来源伤害猜成某位干员。 */
function summarizeSources(entries: ReturnType<typeof damageEntries>) {
  const sources = new Map<
    string | null,
    {
      sourceId: string | null;
      damageRecordCount: number;
      expectedDamage: number;
      lastDamageFrame: number;
    }
  >();
  for (const entry of entries) {
    const sourceId = entry.sourceId ?? null;
    let summary = sources.get(sourceId);
    if (summary === undefined) {
      summary = { sourceId, damageRecordCount: 0, expectedDamage: 0, lastDamageFrame: entry.frame };
      sources.set(sourceId, summary);
    }
    summary.damageRecordCount++;
    summary.expectedDamage += entry.expectedDamage;
    summary.lastDamageFrame = Math.max(summary.lastDamageFrame, entry.frame);
  }
  return [...sources.values()];
}

/** 两种截止帧分别重算，不移动技能，不将完整轴尾部伤害算进存档结束线。 */
export async function auditScenarioSimulation(
  service: SimulationReader,
  scenario: ScenarioDocument,
) {
  const configuredEndFrame =
    scenario.battle.simulationRange?.endFrame ?? scenario.battle.durationFrames;
  const fullEndFrame = scenario.battle.durationFrames;
  const configuredRun = await service.simulate(scenario, configuredEndFrame);
  const fullRun =
    configuredEndFrame === fullEndFrame
      ? configuredRun
      : await service.simulate(scenario, fullEndFrame);
  const configuredDamage = damageEntries(configuredRun.receiptEntries);
  const fullDamage = damageEntries(fullRun.receiptEntries);
  const summarize = (endFrame: number, entries: ReturnType<typeof damageEntries>) => ({
    endFrame,
    damageRecordCount: entries.length,
    expectedDamage: entries.reduce((sum, entry) => sum + entry.expectedDamage, 0),
    lastDamageFrame: entries.at(-1)?.frame ?? null,
    sources: summarizeSources(entries),
  });
  return {
    scenarioId: scenario.id,
    name: scenario.name,
    skillCastCount: scenario.tracks.reduce(
      (sum, track) => sum + (track?.skillCasts.length ?? 0),
      0,
    ),
    configured: {
      ...summarize(configuredEndFrame, configuredDamage),
      diagnostics: summarizeDiagnostics(configuredRun.receiptEntries),
    },
    fullDuration: {
      ...summarize(fullEndFrame, fullDamage),
      diagnostics: summarizeDiagnostics(fullRun.receiptEntries),
    },
    // 包括没有 castId 的公共伤害，不用施法身份作为计入总账的门槛。
    damageAfterConfiguredEnd: fullDamage.filter(entry => entry.frame > configuredEndFrame),
  };
}
