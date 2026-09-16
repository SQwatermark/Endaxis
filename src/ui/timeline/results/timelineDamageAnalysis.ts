import type { CombatReceiptEntry } from '../../../core/combat/receipt/combatReceipt';
import type { DamageContributionSourceKind } from '../../../core/combat/damage/damageContribution';
import type { DamageType } from '../../../core/game-data/operatorDefinition';
import type { ScenarioDocument, TrackIndex } from '../../../core/project/schema';
import type { PublishedScenarioSimulation } from '../useScenarioSimulation';

/** 分析的归属、统计区间和回执必须来自同一次发布，不能混入正在编辑的场景。 */
export function projectPublishedTimelineDamageAnalysis(
  published: PublishedScenarioSimulation | null,
  operatorLabel: (slug: string | null) => string,
  damageTypeLabel: (damageType: DamageType) => string,
  operatorColor?: (slug: string | null) => string,
  damageTypeColor?: (damageType: DamageType) => string,
): TimelineDamageAnalysis {
  if (published === null)
    return {
      totalDamage: 0,
      rotationSeconds: 0,
      dps: 0,
      byOperator: [],
      byContributor: [],
      byContributionSource: [],
      byDamageType: [],
      unattributedDamage: 0,
      unattributedContribution: 0,
    };
  return projectTimelineDamageAnalysis(
    published.run.receiptHistory.entries(),
    published.scenario,
    index => operatorLabel(published.scenario.tracks[index]?.operator?.operatorSlug ?? null),
    damageTypeLabel,
    index => operatorColor?.(published.scenario.tracks[index]?.operator?.operatorSlug ?? null),
    damageTypeColor,
    operatorLabel(null),
  );
}

export interface TimelineDamageAnalysisEntry {
  readonly key: string;
  readonly label: string;
  readonly value: number;
  readonly ratio: number;
  readonly color?: string;
}

export interface TimelineDamageContributionEntry extends TimelineDamageAnalysisEntry {
  /** 该干员自己造成的伤害中归到自身的部分。 */
  readonly directValue: number;
  /** 该干员为其他干员伤害提供的增减量。 */
  readonly supportValue: number;
}

/** 跨 Hit 汇总的一项外部伤害贡献来源。 */
export interface TimelineDamageContributionSourceEntry {
  readonly providerOperatorId: string | null;
  readonly sourceKind: DamageContributionSourceKind;
  readonly sourceId: string;
  readonly value: number;
  readonly ratio: number;
}

export interface TimelineDamageAnalysis {
  readonly totalDamage: number;
  readonly rotationSeconds: number;
  readonly dps: number;
  readonly byOperator: readonly TimelineDamageAnalysisEntry[];
  readonly byContributor: readonly TimelineDamageContributionEntry[];
  readonly byContributionSource: readonly TimelineDamageContributionSourceEntry[];
  readonly byDamageType: readonly TimelineDamageAnalysisEntry[];
  readonly unattributedDamage: number;
  readonly unattributedContribution: number;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * 伤害分析只汇总模拟已经结算并写入回执的 value，不在 UI 重算伤害公式。
 * `actualDamage` 会被木桩剩余生命截断，不能代表本次攻击本应造成的伤害。
 */
export function projectTimelineDamageAnalysis(
  receipts: Iterable<CombatReceiptEntry>,
  scenario: ScenarioDocument,
  operatorLabel: (trackIndex: TrackIndex) => string,
  damageTypeLabel: (damageType: DamageType) => string,
  operatorColor?: (trackIndex: TrackIndex) => string | undefined,
  damageTypeColor?: (damageType: DamageType) => string | undefined,
  environmentContributionLabel = 'Environment',
): TimelineDamageAnalysis {
  const castToTrack = new Map<string, TrackIndex>();
  const sourceToTrack = new Map<string, TrackIndex>();
  scenario.tracks.forEach((track, index) => {
    if (track === null) return;
    const trackIndex = index as TrackIndex;
    sourceToTrack.set(track.id, trackIndex);
    for (const cast of track.skillCasts) castToTrack.set(cast.id, trackIndex);
  });

  // 新版时间轴以 0 帧作为正式战斗起点，准备阶段使用负帧。`prepFrames` 只是
  // 可向前编辑的长度，不能当成统计起点，否则默认会漏掉 0 到 prepFrames 之间的伤害。
  const startFrame = scenario.battle.simulationRange?.startFrame ?? 0;
  const operatorTotals = new Map<TrackIndex, number>();
  const typeTotals = new Map<DamageType, number>();
  const contributionTotals = new Map<
    TrackIndex | 'environment',
    { directValue: number; supportValue: number }
  >();
  const contributionSourceTotals = new Map<
    string,
    Omit<TimelineDamageContributionSourceEntry, 'value' | 'ratio'> & { value: number }
  >();
  let totalDamage = 0;
  let unattributedDamage = 0;
  let unattributedContribution = 0;
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

    const contribution = readDamageContribution(receipt.data?.contribution);
    if (contribution === null) {
      if (trackIndex !== undefined) {
        const current = contributionTotals.get(trackIndex) ?? { directValue: 0, supportValue: 0 };
        current.directValue += value;
        contributionTotals.set(trackIndex, current);
      }
      continue;
    }
    unattributedContribution += contribution.unallocated;
    if (trackIndex === undefined) unattributedContribution += contribution.self;
    else {
      const current = contributionTotals.get(trackIndex) ?? { directValue: 0, supportValue: 0 };
      current.directValue += contribution.self;
      contributionTotals.set(trackIndex, current);
    }
    for (const external of contribution.external) {
      const sourceKey = JSON.stringify([
        external.providerOperatorId,
        external.sourceKind,
        external.sourceId,
      ]);
      const sourceTotal = contributionSourceTotals.get(sourceKey);
      if (sourceTotal === undefined) {
        contributionSourceTotals.set(sourceKey, { ...external });
      } else {
        sourceTotal.value += external.value;
      }
      if (external.providerOperatorId === null) {
        const current = contributionTotals.get('environment') ?? {
          directValue: 0,
          supportValue: 0,
        };
        current.supportValue += external.value;
        contributionTotals.set('environment', current);
        continue;
      }
      const providerTrack = sourceToTrack.get(external.providerOperatorId);
      if (providerTrack === undefined) {
        unattributedContribution += external.value;
        continue;
      }
      const current = contributionTotals.get(providerTrack) ?? {
        directValue: 0,
        supportValue: 0,
      };
      current.supportValue += external.value;
      contributionTotals.set(providerTrack, current);
    }
  }

  const entries = <K extends string | number>(
    totals: ReadonlyMap<K, number>,
    label: (key: K) => string,
    color?: (key: K) => string | undefined,
  ): TimelineDamageAnalysisEntry[] =>
    [...totals.entries()]
      .map(([key, value]) => {
        const entryColor = color?.(key);
        return {
          key: String(key),
          label: label(key),
          value,
          ratio: totalDamage <= 0 ? 0 : value / totalDamage,
          ...(entryColor === undefined ? {} : { color: entryColor }),
        };
      })
      .sort((left, right) => right.value - left.value);
  const rotationSeconds = Math.max(0, lastDamageFrame - startFrame) / 30;
  const byContributor = [...contributionTotals.entries()]
    .map(([key, parts]): TimelineDamageContributionEntry => {
      const value = parts.directValue + parts.supportValue;
      const entryColor = key === 'environment' ? undefined : operatorColor?.(key);
      return {
        key: String(key),
        label: key === 'environment' ? environmentContributionLabel : operatorLabel(key),
        value,
        ratio: totalDamage <= 0 ? 0 : value / totalDamage,
        directValue: parts.directValue,
        supportValue: parts.supportValue,
        ...(entryColor === undefined ? {} : { color: entryColor }),
      };
    })
    .sort((left, right) => right.value - left.value);
  const byContributionSource = [...contributionSourceTotals.values()]
    .map(entry => ({
      ...entry,
      ratio: totalDamage <= 0 ? 0 : entry.value / totalDamage,
    }))
    .sort((left, right) => Math.abs(right.value) - Math.abs(left.value));
  return {
    totalDamage,
    rotationSeconds,
    dps: rotationSeconds <= 0 ? 0 : totalDamage / rotationSeconds,
    byOperator: entries(operatorTotals, operatorLabel, operatorColor),
    byContributor,
    byContributionSource,
    byDamageType: entries(typeTotals, damageTypeLabel, damageTypeColor),
    unattributedDamage,
    unattributedContribution,
  };
}

interface ReadDamageContribution {
  readonly self: number;
  readonly unallocated: number;
  readonly external: readonly {
    readonly providerOperatorId: string | null;
    readonly sourceKind: DamageContributionSourceKind;
    readonly sourceId: string;
    readonly value: number;
  }[];
}

function readDamageContribution(value: unknown): ReadDamageContribution | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const self = finiteNumber(record.self);
  const unallocated = finiteNumber(record.unallocated);
  if (self === null || unallocated === null || !Array.isArray(record.external)) return null;
  const external = record.external.flatMap(item => {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) return [];
    const entry = item as Record<string, unknown>;
    const amount = finiteNumber(entry.value);
    const providerOperatorId = entry.providerOperatorId;
    const sourceKind = entry.sourceKind;
    const sourceId = entry.sourceId;
    if (
      amount === null ||
      (providerOperatorId !== null && typeof providerOperatorId !== 'string') ||
      (sourceKind !== 'buff' &&
        sourceKind !== 'equipment' &&
        sourceKind !== 'status' &&
        sourceKind !== 'stagger' &&
        sourceKind !== 'mechanic') ||
      typeof sourceId !== 'string'
    )
      return [];
    return [
      {
        providerOperatorId,
        sourceKind: sourceKind as DamageContributionSourceKind,
        sourceId,
        value: amount,
      },
    ];
  });
  return { self, unallocated, external };
}
