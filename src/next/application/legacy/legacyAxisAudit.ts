/**
 * 旧版排轴与 Next 运行回执之间的证据对照。
 *
 * 这里不把旧版派生 hit 当作规则真值，也不尝试计算“是否一致”。报告只把同一次用户输入的旧版
 * 参考快照和 Next 已发生事实并排放置，并只对输入未处理、未接受或未启动作确定性告警。
 */
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import type { EndaxisProjectDocument, SkillCastDocument } from '../../core/project/schema';

type UnknownRecord = Record<string, unknown>;

export interface LegacyAxisAuditRun {
  readonly frame: number;
  readonly receiptEntries: readonly CombatReceiptEntry[];
}

export interface LegacyAxisCastAudit {
  readonly castId: string;
  readonly trackIndex: number;
  readonly actionIndex: number;
  readonly operatorSlug: string | null;
  readonly placedFrame: number;
  readonly source: SkillCastDocument['source'];
  readonly legacy: {
    readonly name: string | null;
    readonly type: string | null;
    readonly startFrame: number | null;
    /** 旧编辑器保存的派生 hit 数，仅作异常线索。 */
    readonly declaredHitCount: number | null;
  };
  readonly next: {
    readonly executionStatus: 'notProcessed' | 'rejected' | 'notStarted' | 'started';
    readonly accepted: boolean | null;
    readonly actualSkillId: string | null;
    readonly startedFrame: number | null;
    /** 同一 cast identity 下发生的伤害，不等价于技能本体直击数。 */
    readonly causallyAttributedDamageCount: number;
    readonly reachedDamageStepCount: number;
    readonly appliedBuffCount: number;
    readonly elementalInflictionCount: number;
    readonly elementalReactionCount: number;
    readonly comboWindowUnavailable: boolean;
    readonly costUnavailable: boolean;
    readonly costRejected: boolean;
  };
  readonly findings: readonly (
    | 'legacyActionMissing'
    | 'inputNotProcessed'
    | 'inputRejected'
    | 'skillNotStarted'
  )[];
}

export interface LegacyAxisScenarioAudit {
  readonly scenarioId: string;
  readonly name: string;
  readonly simulatedFrame: number;
  readonly inputCount: number;
  readonly startedCount: number;
  readonly deterministicFindingCount: number;
  readonly casts: readonly LegacyAxisCastAudit[];
}

export interface LegacyAxisAuditReport {
  readonly scope: 'legacy-reference-comparison';
  readonly limitations: readonly string[];
  readonly migrationWarnings: readonly string[];
  readonly scenarios: readonly LegacyAxisScenarioAudit[];
}

function record(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function records(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.map(record).filter(value => value !== null) : [];
}

function text(value: unknown): string | null {
  return typeof value === 'string' ? value : null;
}

function number(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function legacyActionAt(
  input: unknown,
  scenarioId: string,
  trackIndex: number,
  actionIndex: number,
): UnknownRecord | null {
  const root = record(input);
  const wrapper = records(root?.scenarioList).find(candidate => candidate.id === scenarioId);
  const scenario = record(wrapper?.data);
  const track = records(scenario?.tracks)[trackIndex];
  return records(track?.actions)[actionIndex] ?? null;
}

function castCoordinates(castId: string): { trackIndex: number; actionIndex: number } | null {
  const match = /:track:(\d+):cast:(\d+)$/.exec(castId);
  if (match === null) return null;
  return { trackIndex: Number(match[1]), actionIndex: Number(match[2]) };
}

function receiptCastId(entry: CombatReceiptEntry): string | null {
  return text(entry.data?.castId);
}

function auditCast(input: {
  readonly legacyProject: unknown;
  readonly scenarioId: string;
  readonly trackIndex: number;
  readonly actionIndex: number;
  readonly operatorSlug: string | null;
  readonly cast: SkillCastDocument;
  readonly receipts: readonly CombatReceiptEntry[];
}): LegacyAxisCastAudit {
  const legacy = legacyActionAt(
    input.legacyProject,
    input.scenarioId,
    input.trackIndex,
    input.actionIndex,
  );
  const receipts = input.receipts.filter(entry => receiptCastId(entry) === input.cast.id);
  const processed = receipts.find(entry => entry.event === 'SkillInputProcessed');
  const started = receipts.find(entry => entry.event === 'SkillStarted');
  const accepted =
    processed === undefined || typeof processed.data?.accepted !== 'boolean'
      ? null
      : processed.data.accepted;
  const executionStatus =
    processed === undefined
      ? 'notProcessed'
      : accepted === false
        ? 'rejected'
        : started === undefined
          ? 'notStarted'
          : 'started';
  const findings: LegacyAxisCastAudit['findings'][number][] = [];
  if (legacy === null) findings.push('legacyActionMissing');
  if (executionStatus === 'notProcessed') findings.push('inputNotProcessed');
  if (executionStatus === 'rejected') findings.push('inputRejected');
  if (executionStatus === 'notStarted') findings.push('skillNotStarted');

  return {
    castId: input.cast.id,
    trackIndex: input.trackIndex,
    actionIndex: input.actionIndex,
    operatorSlug: input.operatorSlug,
    placedFrame: input.cast.placement.startFrame,
    source: input.cast.source,
    legacy: {
      name: text(legacy?.name),
      type: text(legacy?.type),
      startFrame: number(legacy?.startTime) ?? number(legacy?.logicalStartTime),
      declaredHitCount: Array.isArray(legacy?.hits) ? legacy.hits.length : null,
    },
    next: {
      executionStatus,
      accepted,
      actualSkillId: text(started?.data?.skillId),
      startedFrame: started?.frame ?? null,
      causallyAttributedDamageCount: receipts.filter(entry => entry.event === 'DamageApplied').length,
      reachedDamageStepCount: receipts.filter(
        entry => entry.event === 'CombatStepReached' && entry.data?.kind === 'dealDamage',
      ).length,
      appliedBuffCount: receipts.filter(entry => entry.event === 'BuffApplied').length,
      elementalInflictionCount: receipts.filter(
        entry => entry.event === 'ElementalInflictionApplied',
      ).length,
      elementalReactionCount: receipts.filter(entry => entry.event === 'ElementalReactionApplied')
        .length,
      comboWindowUnavailable: receipts.some(
        entry => entry.event === 'ComboWindowUnavailableAtStart',
      ),
      costUnavailable: receipts.some(entry => entry.event === 'SkillCostUnavailableAtStart'),
      costRejected: receipts.some(entry => entry.event === 'SkillCostRejected'),
    },
    findings,
  };
}

/** 生成只陈述证据、不自动裁决旧版或 Next 哪一侧正确的真实排轴报告。 */
export function auditLegacyAxisProject(input: {
  readonly legacyProject: unknown;
  readonly project: EndaxisProjectDocument;
  readonly runs: ReadonlyMap<string, LegacyAxisAuditRun>;
  readonly migrationWarnings?: readonly string[];
}): LegacyAxisAuditReport {
  const scenarios = input.project.scenarios.map(scenario => {
    const run = input.runs.get(scenario.id);
    if (run === undefined) throw new Error(`missing simulation run for scenario '${scenario.id}'`);
    const casts = scenario.tracks.flatMap((track, fallbackTrackIndex) => {
      if (track === null) return [];
      return track.skillCasts.map((cast, fallbackActionIndex) => {
        const coordinates = castCoordinates(cast.id) ?? {
          trackIndex: fallbackTrackIndex,
          actionIndex: fallbackActionIndex,
        };
        return auditCast({
          legacyProject: input.legacyProject,
          scenarioId: scenario.id,
          ...coordinates,
          operatorSlug: track.operator?.operatorSlug ?? null,
          cast,
          receipts: run.receiptEntries,
        });
      });
    });
    return {
      scenarioId: scenario.id,
      name: scenario.name,
      simulatedFrame: run.frame,
      inputCount: casts.length,
      startedCount: casts.filter(cast => cast.next.executionStatus === 'started').length,
      deterministicFindingCount: casts.reduce((sum, cast) => sum + cast.findings.length, 0),
      casts,
    } satisfies LegacyAxisScenarioAudit;
  });
  return {
    scope: 'legacy-reference-comparison',
    limitations: [
      '旧版 hit、Buff、面板和伤害是旧模拟器派生快照，只作异常线索，不作为规则真值。',
      'causallyAttributedDamageCount 包含继承同一 cast identity 的能力实体、Buff 与被动后代，不等价于技能本体直击数。',
      '资源与连携条件诊断不会自动判为执行失败；只有输入未处理、被拒绝或技能未启动才是确定性告警。',
    ],
    migrationWarnings: input.migrationWarnings ?? [],
    scenarios,
  };
}
