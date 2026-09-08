import type { CombatReceiptEntry } from '../../src/core/combat/receipt/combatReceipt';
import type { ScenarioDocument } from '../../src/core/project/schema';

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
  });
  return {
    scenarioId: scenario.id,
    name: scenario.name,
    skillCastCount: scenario.tracks.reduce(
      (sum, track) => sum + (track?.skillCasts.length ?? 0),
      0,
    ),
    configured: summarize(configuredEndFrame, configuredDamage),
    fullDuration: summarize(fullEndFrame, fullDamage),
    // 包括没有 castId 的公共伤害，不用施法身份作为计入总账的门槛。
    damageAfterConfiguredEnd: fullDamage.filter(entry => entry.frame > configuredEndFrame),
  };
}
