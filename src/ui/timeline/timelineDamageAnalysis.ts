import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import type { DamageType } from '../../core/game-data/operatorDefinition';
import type { ScenarioDocument, TrackIndex } from '../../core/project/schema';

export interface TimelineDamageAnalysisEntry {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly ratio: number;
}

export interface TimelineDamageAnalysis {
  readonly totalDamage: number;
  readonly rotationSeconds: number;
  readonly dps: number;
  readonly byOperator: readonly TimelineDamageAnalysisEntry[];
  readonly byDamageType: readonly TimelineDamageAnalysisEntry[];
  readonly unattributedDamage: number;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * 伤害分析只汇总模拟已经结算并写入回执的 value，不在 UI 重算伤害公式。
 * `actualDamage` 会被木桩剩余生命截断，不能代表本次攻击本应造成的伤害。
 */
export function projectTimelineDamageAnalysis(
  receipts: readonly CombatReceiptEntry[],
  scenario: ScenarioDocument,
  operatorLabel: (trackIndex: TrackIndex) => string,
  damageTypeLabel: (damageType: DamageType) => string,
): TimelineDamageAnalysis {
  const castToTrack = new Map<string, TrackIndex>();
  const sourceToTrack = new Map<string, TrackIndex>();
  scenario.tracks.forEach((track, index) => {
    if (track === null) return;
    const trackIndex = index as TrackIndex;
    sourceToTrack.set(track.id, trackIndex);
    for (const cast of track.skillCasts) castToTrack.set(cast.id, trackIndex);
  });

  const startFrame = scenario.battle.simulationRange?.startFrame ?? scenario.battle.prepFrames;
  const operatorTotals = new Map<TrackIndex, number>();
  const typeTotals = new Map<DamageType, number>();
  let totalDamage = 0;
  let unattributedDamage = 0;
  let lastDamageFrame = startFrame;

  for (const receipt of receipts) {
    if (receipt.event !== 'DamageApplied' || receipt.targetId !== 'enemy') continue;
    if (receipt.frame < startFrame) continue;
    const value = finiteNumber(receipt.data?.value);
    const damageType = receipt.data?.damageType;
    if (value === null || value <= 0 || typeof damageType !== 'string') continue;
    totalDamage += value;
    lastDamageFrame = Math.max(lastDamageFrame, receipt.frame);
    typeTotals.set(
      damageType as DamageType,
      (typeTotals.get(damageType as DamageType) ?? 0) + value,
    );
    const castId = typeof receipt.data?.castId === 'string' ? receipt.data.castId : null;
    const trackIndex =
      (castId === null ? undefined : castToTrack.get(castId)) ??
      (receipt.sourceId === undefined ? undefined : sourceToTrack.get(receipt.sourceId));
    if (trackIndex === undefined) unattributedDamage += value;
    else operatorTotals.set(trackIndex, (operatorTotals.get(trackIndex) ?? 0) + value);
  }

  const entries = <K extends string | number>(
    totals: ReadonlyMap<K, number>,
    label: (key: K) => string,
  ): TimelineDamageAnalysisEntry[] =>
    [...totals.entries()]
      .map(([key, value]) => ({
        key: String(key),
        label: label(key),
        value,
        ratio: totalDamage <= 0 ? 0 : value / totalDamage,
      }))
      .sort((left, right) => right.value - left.value);
  const rotationSeconds = Math.max(0, lastDamageFrame - startFrame) / 30;
  return {
    totalDamage,
    rotationSeconds,
    dps: rotationSeconds <= 0 ? 0 : totalDamage / rotationSeconds,
    byOperator: entries(operatorTotals, operatorLabel),
    byDamageType: entries(typeTotals, damageTypeLabel),
    unattributedDamage,
  };
}
