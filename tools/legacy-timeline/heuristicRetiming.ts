/**
 * 按旧轴的全局技能顺序，逐个用新版模拟结果修正放置时间。
 *
 * 这里只负责可组合的启发式排程：调用方提供模拟器，本文件读取回执中的
 * 真实开始、技能块实际显示结束和终结技时间膨胀区间。后续规则应作为新的明确步骤加入，
 * 不要把它们隐藏在存档转换或技能定义中。
 */
import type { CombatReceiptEntry } from '../../src/core/combat/receipt/combatReceipt';
import type {
  EndaxisProjectDocument,
  ScenarioDocument,
  SkillCastDocument,
} from '../../src/core/project/schema';
import {
  projectSkillCastActualDurationFrames,
  projectSkillCastActualStartFrames,
} from '../../src/ui/timeline/timelineDisplayTime';
import {
  isLegacyControlledInputCast,
  legacyInferredControlSwitchId,
  synchronizeLegacyInferredControlSwitches,
} from './controlInference';

type UnknownRecord = Record<string, unknown>;

export interface LegacyTimingAdjustment {
  readonly scenarioId: string;
  readonly castId: string;
  readonly trackIndex: number;
  readonly actionIndex: number;
  readonly sourceStartFrame: number;
  readonly adjustedStartFrame: number;
  readonly sameTrackEndCandidate?: number;
  readonly globalOrderCandidate?: number;
  readonly pushedByUltimateTimeDilation: boolean;
  readonly ultimateTimeDilationEndFrame?: number;
  readonly inputWindowDelayFrames?: number;
  readonly inputWindowSearchExhausted?: boolean;
  /** 不同干员的两个主控动作原本落在同一帧时，为后一个动作增加的最小间隔。 */
  readonly controlInputSeparationFrames?: number;
}

export interface LegacySkillFormAdjustment {
  readonly scenarioId: string;
  readonly castId: string;
  readonly trackIndex: number;
  readonly actionIndex: number;
  /** 旧轴只记录基础操作时，转换前写入的基础技能。 */
  readonly sourceSkillKey: string;
  /** 模拟按当前原生技能槽解析出的实际替换形态。 */
  readonly resolvedSkillKey: string;
}

export interface LegacyControlSwitchAdjustment {
  readonly scenarioId: string;
  readonly switchId: string;
  readonly trackIndex: number;
  readonly sourceFrame: number;
  readonly adjustedFrame: number;
  readonly previousCastId?: string;
  readonly nextCastId?: string;
}

export interface LegacyInferredControlSwitch {
  readonly scenarioId: string;
  readonly switchId: string;
  readonly castId: string;
  readonly trackIndex: number;
  readonly sourceFrame: number;
  readonly inferredFrame: number;
}

export interface LegacyRetimingResult {
  readonly timingAdjustments: readonly LegacyTimingAdjustment[];
  readonly skillFormAdjustments: readonly LegacySkillFormAdjustment[];
  readonly controlSwitchAdjustments: readonly LegacyControlSwitchAdjustment[];
  readonly inferredControlSwitches: readonly LegacyInferredControlSwitch[];
}

export interface LegacyRetimingSimulationResult {
  readonly receiptEntries: readonly CombatReceiptEntry[];
}

export type LegacyRetimingSimulationRunner = (
  scenario: ScenarioDocument,
  endFrame: number,
) => LegacyRetimingSimulationResult;

export type LegacyRuntimeReplacementResolver = (input: {
  readonly scenario: ScenarioDocument;
  readonly trackIndex: number;
  readonly skillGroupKey: string;
  readonly expectedSkillKey: string;
  readonly actualSkillKey: string;
}) => string | null;

interface OrderedCast {
  readonly castId: string;
  readonly trackIndex: number;
  readonly actionIndex: number;
  readonly sourceStartFrame: number;
}

interface FrameInterval {
  readonly startFrame: number;
  readonly endFrame: number;
}

const PLANNING_LOOKAHEAD_FRAMES = 300;
const MAX_PLANNING_EXTENSIONS = 12;
const MAX_INPUT_WINDOW_DELAY_FRAMES = 300;

function record(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function records(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.map(record).filter(value => value !== null) : [];
}

function integer(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) ? value : null;
}

function ultimateTimeDilationIntervals(
  entries: readonly CombatReceiptEntry[],
  simulationEndFrame: number,
): readonly FrameInterval[] {
  const active = new Map<number, number>();
  const intervals: FrameInterval[] = [];
  for (const entry of entries) {
    if (entry.event === 'TimeDilationStarted') {
      if (entry.data?.kind !== 'global' || entry.data.slot !== 'ultimate') continue;
      const instanceId = entry.data.instanceId;
      if (!Number.isSafeInteger(instanceId)) continue;
      active.set(instanceId as number, entry.frame);
      continue;
    }
    if (entry.event !== 'TimeDilationEnded') continue;
    const instanceId = entry.data?.instanceId;
    if (!Number.isSafeInteger(instanceId)) continue;
    const startFrame = active.get(instanceId as number);
    if (startFrame === undefined) continue;
    active.delete(instanceId as number);
    if (entry.frame > startFrame) intervals.push({ startFrame, endFrame: entry.frame });
  }
  for (const startFrame of active.values()) {
    if (simulationEndFrame > startFrame)
      intervals.push({ startFrame, endFrame: simulationEndFrame });
  }
  return intervals.sort(
    (left, right) => left.startFrame - right.startFrame || left.endFrame - right.endFrame,
  );
}

function hasOpenUltimateTimeDilation(entries: readonly CombatReceiptEntry[]): boolean {
  const active = new Set<number>();
  for (const entry of entries) {
    const instanceId = entry.data?.instanceId;
    if (!Number.isSafeInteger(instanceId)) continue;
    if (
      entry.event === 'TimeDilationStarted' &&
      entry.data?.kind === 'global' &&
      entry.data.slot === 'ultimate'
    ) {
      active.add(instanceId as number);
    } else if (entry.event === 'TimeDilationEnded') {
      active.delete(instanceId as number);
    }
  }
  return active.size > 0;
}

function moveOutsideUltimateTimeDilation(
  frame: number,
  intervals: readonly FrameInterval[],
): { frame: number; intervalEnd?: number } {
  for (const interval of intervals) {
    if (frame < interval.startFrame) break;
    // TimeDilationEnded 与玩家输入在同一实际帧时，输入阶段仍可能先观察到演出状态。
    // “时间膨胀结束后”因此是结束回执的下一帧，不能把技能放在结束回执同帧。
    if (frame <= interval.endFrame)
      return { frame: interval.endFrame + 1, intervalEnd: interval.endFrame };
  }
  return { frame };
}

function projectDisplayedCastEndFrames(
  entries: readonly CombatReceiptEntry[],
  starts: ReadonlyMap<string, number>,
): ReadonlyMap<string, number> {
  const actualDurations = new Map(projectSkillCastActualDurationFrames(entries));
  const ends = new Map<string, number>();
  for (const [castId, duration] of actualDurations) {
    const startFrame = starts.get(castId);
    if (startFrame !== undefined) ends.set(castId, startFrame + duration);
  }
  for (const entry of entries) {
    if (entry.event !== 'SkillSwitchedToBuff') continue;
    const castId = entry.data?.castId;
    if (typeof castId === 'string') ends.set(castId, entry.frame + 1);
  }
  return ends;
}

/** 同步切换成 Buff 的输入没有技能生命周期，但它确实在该帧执行并占用一个输入边界。 */
function projectExecutedCastStartFrames(
  entries: readonly CombatReceiptEntry[],
): ReadonlyMap<string, number> {
  const starts = new Map(projectSkillCastActualStartFrames(entries));
  for (const entry of entries) {
    if (entry.event !== 'SkillSwitchedToBuff') continue;
    const castId = entry.data?.castId;
    if (typeof castId === 'string' && !starts.has(castId)) starts.set(castId, entry.frame);
  }
  return starts;
}

function setSimulationDisabled(cast: SkillCastDocument, disabled: boolean): void {
  if (disabled) {
    cast.presentation = { ...cast.presentation, disabled: true };
    return;
  }
  if (cast.presentation === undefined) return;
  const { disabled: _disabled, ...presentation } = cast.presentation;
  cast.presentation = Object.keys(presentation).length === 0 ? undefined : presentation;
}

function castCannotInterruptCurrentSkill(
  entries: readonly CombatReceiptEntry[],
  castId: string,
): boolean {
  return entries.some(
    entry =>
      entry.event === 'SkillInputCannotInterruptCurrentSkill' && entry.data?.castId === castId,
  );
}

function mismatchedActualSkillKey(
  entries: readonly CombatReceiptEntry[],
  castId: string,
): string | null {
  const mismatch = entries.find(
    entry => entry.event === 'SkillInputResolvedToDifferentSkill' && entry.data?.castId === castId,
  );
  return typeof mismatch?.data?.actualSkillId === 'string' ? mismatch.data.actualSkillId : null;
}

function retimeControlSwitches(
  scenario: ScenarioDocument,
  working: ScenarioDocument,
  sourceData: UnknownRecord,
  processed: readonly OrderedCast[],
): void {
  const sourceSwitches = records(sourceData.switchEvents);
  const targetSwitches = scenario.battle.controlSwitches ?? [];
  const workingSwitches = working.battle.controlSwitches ?? [];
  for (const [index, sourceSwitch] of sourceSwitches.entries()) {
    const sourceFrame = integer(sourceSwitch.time);
    if (sourceFrame === null) continue;
    const switchId =
      typeof sourceSwitch.id === 'string' ? sourceSwitch.id : `legacy-switch-${index}`;
    const target = targetSwitches.find(item => item.id === switchId);
    const simulationTarget = workingSwitches.find(item => item.id === switchId);
    if (target === undefined || simulationTarget === undefined) continue;

    const previous = processed.findLast(item => item.sourceStartFrame <= sourceFrame);
    const next = processed.find(item => item.sourceStartFrame >= sourceFrame);
    let frame = sourceFrame;
    if (previous !== undefined) {
      const previousStart = scenario.tracks[previous.trackIndex]?.skillCasts.find(
        cast => cast.id === previous.castId,
      )?.placement.startFrame;
      if (previousStart !== undefined)
        frame = previousStart + (sourceFrame - previous.sourceStartFrame);
    } else if (next !== undefined) {
      const nextStart = scenario.tracks[next.trackIndex]?.skillCasts.find(
        cast => cast.id === next.castId,
      )?.placement.startFrame;
      if (nextStart !== undefined) frame = nextStart - (next.sourceStartFrame - sourceFrame);
    }
    if (next !== undefined) {
      const nextStart = scenario.tracks[next.trackIndex]?.skillCasts.find(
        cast => cast.id === next.castId,
      )?.placement.startFrame;
      if (nextStart !== undefined) frame = Math.min(frame, nextStart);
    }
    target.frame = frame;
    simulationTarget.frame = frame;
  }
}

function moveAfterConflictingControlledInput(
  scenario: ScenarioDocument,
  current: OrderedCast,
  processed: readonly OrderedCast[],
  frame: number,
): number {
  const currentCast = scenario.tracks[current.trackIndex]?.skillCasts.find(
    cast => cast.id === current.castId,
  );
  if (currentCast === undefined || !isLegacyControlledInputCast(currentCast)) return frame;
  let candidate = frame;
  while (
    processed.some(item => {
      if (item.trackIndex === current.trackIndex) return false;
      const cast = scenario.tracks[item.trackIndex]?.skillCasts.find(
        candidateCast => candidateCast.id === item.castId,
      );
      return (
        cast !== undefined &&
        isLegacyControlledInputCast(cast) &&
        cast.placement.startFrame === candidate
      );
    })
  ) {
    candidate += 1;
  }
  return candidate;
}

/** 原地修正转换结果，返回不写入项目存档的审计记录。 */
export function retimeLegacyProjectBySimulation(
  project: EndaxisProjectDocument,
  preparedSource: unknown,
  runSimulation: LegacyRetimingSimulationRunner,
  resolveRuntimeReplacement?: LegacyRuntimeReplacementResolver,
): LegacyRetimingResult {
  const root = record(preparedSource);
  const sourceScenarios = records(root?.scenarioList);
  const timingAdjustments: LegacyTimingAdjustment[] = [];
  const skillFormAdjustments: LegacySkillFormAdjustment[] = [];
  const controlSwitchAdjustments: LegacyControlSwitchAdjustment[] = [];
  const inferredControlSwitches: LegacyInferredControlSwitch[] = [];

  for (const scenario of project.scenarios) {
    const sourceWrapper = sourceScenarios.find(wrapper => wrapper.id === scenario.id);
    const sourceData = record(sourceWrapper?.data);
    if (sourceData === null) continue;
    const sourceTracks = records(sourceData.tracks);
    const ordered: OrderedCast[] = [];

    scenario.tracks.forEach((track, trackIndex) => {
      if (track === null) return;
      const sourceActions = records(sourceTracks[trackIndex]?.actions);
      sourceActions.forEach((action, actionIndex) => {
        const baseId = `legacy:${scenario.id}:track:${trackIndex}:cast:${actionIndex}`;
        const actionStartFrame = integer(action.startTime) ?? integer(action.logicalStartTime);
        const casts = track.skillCasts.filter(
          candidate => candidate.id === baseId || candidate.id.startsWith(`${baseId}:sequence:`),
        );
        casts.forEach(cast => {
          if (cast.presentation?.disabled === true) return;
          const sourceStartFrame = cast.placement.startFrame ?? actionStartFrame ?? undefined;
          if (sourceStartFrame === undefined) return;
          cast.placement = { startFrame: sourceStartFrame };
          ordered.push({ castId: cast.id, trackIndex, actionIndex, sourceStartFrame });
        });
      });
    });
    ordered.sort(
      (left, right) =>
        left.sourceStartFrame - right.sourceStartFrame ||
        left.trackIndex - right.trackIndex ||
        left.actionIndex - right.actionIndex,
    );
    if (ordered.length === 0) continue;

    const working = structuredClone(scenario);
    const workingCasts = new Map(
      working.tracks.flatMap(track =>
        (track?.skillCasts ?? []).map(cast => [cast.id, cast] as const),
      ),
    );
    for (const item of ordered) setSimulationDisabled(workingCasts.get(item.castId)!, true);

    const previousByTrack = new Map<number, OrderedCast>();
    let previousGlobal: OrderedCast | undefined;
    let actualStarts = new Map<string, number>();
    let actualEnds = new Map<string, number>();
    let ultimateIntervals: readonly FrameInterval[] = [];
    let lastReceiptEntries: readonly CombatReceiptEntry[] = [];

    for (const [index, current] of ordered.entries()) {
      let candidate = current.sourceStartFrame;
      let sameTrackEndCandidate: number | undefined;
      let globalOrderCandidate: number | undefined;
      if (index > 0) {
        const previousTrack = previousByTrack.get(current.trackIndex);
        if (previousTrack !== undefined) {
          sameTrackEndCandidate = actualEnds.get(previousTrack.castId);
          if (sameTrackEndCandidate === undefined) {
            const lifecycle = lastReceiptEntries
              .filter(entry => entry.data?.castId === previousTrack.castId)
              .map(entry => `${entry.frame}:${entry.event}`)
              .join(', ');
            throw new Error(
              `cast '${previousTrack.castId}' has no simulated display end (${lifecycle || 'no receipts'})`,
            );
          }
          candidate = Math.max(candidate, sameTrackEndCandidate);
        }
        const previousStart = actualStarts.get(previousGlobal!.castId);
        if (previousStart === undefined) {
          throw new Error(`cast '${previousGlobal!.castId}' has no simulated start`);
        }
        globalOrderCandidate =
          previousStart + (current.sourceStartFrame - previousGlobal!.sourceStartFrame);
        candidate = Math.max(candidate, globalOrderCandidate);
      }
      const priorUltimateIntervals = ultimateIntervals;
      const outsideDilation = moveOutsideUltimateTimeDilation(candidate, priorUltimateIntervals);
      let adjustedStartFrame = outsideDilation.frame;
      let ultimateTimeDilationEndFrame = outsideDilation.intervalEnd;
      const separatedStartFrame = moveAfterConflictingControlledInput(
        scenario,
        current,
        ordered.slice(0, index),
        adjustedStartFrame,
      );
      const controlInputSeparationFrames = separatedStartFrame - adjustedStartFrame;
      if (controlInputSeparationFrames > 0) {
        const separatedOutsideDilation = moveOutsideUltimateTimeDilation(
          separatedStartFrame,
          priorUltimateIntervals,
        );
        adjustedStartFrame = separatedOutsideDilation.frame;
        if (separatedOutsideDilation.intervalEnd !== undefined)
          ultimateTimeDilationEndFrame = separatedOutsideDilation.intervalEnd;
      }
      const initialAdjustedStartFrame = adjustedStartFrame;
      let inputWindowDelayFrames = 0;
      let inputWindowSearchExhausted = false;
      let fallbackActualStarts: ReadonlyMap<string, number> | undefined;
      let fallbackActualEnds: ReadonlyMap<string, number> | undefined;
      let fallbackUltimateIntervals: readonly FrameInterval[] | undefined;
      let sourceSkillKey: string | undefined;
      let resolvedSkillKey: string | undefined;

      const targetCast = scenario.tracks[current.trackIndex]!.skillCasts.find(
        cast => cast.id === current.castId,
      )!;
      const workingCast = workingCasts.get(current.castId)!;
      setSimulationDisabled(workingCast, false);

      let settled = false;
      for (
        let inputWindowAttempt = 0;
        inputWindowAttempt <= MAX_INPUT_WINDOW_DELAY_FRAMES;
        inputWindowAttempt += 1
      ) {
        targetCast.placement = { startFrame: adjustedStartFrame };
        workingCast.placement = { startFrame: adjustedStartFrame };
        retimeControlSwitches(scenario, working, sourceData, ordered.slice(0, index + 1));
        synchronizeLegacyInferredControlSwitches(
          scenario,
          ordered.slice(0, index + 1).map((item, order) => ({ ...item, order })),
        );
        synchronizeLegacyInferredControlSwitches(
          working,
          ordered.slice(0, index + 1).map((item, order) => ({ ...item, order })),
        );
        let planningEndFrame = Math.max(0, adjustedStartFrame + PLANNING_LOOKAHEAD_FRAMES);
        for (let attempt = 0; attempt <= MAX_PLANNING_EXTENSIONS; attempt += 1) {
          working.battle.durationFrames = planningEndFrame;
          const run = runSimulation(working, planningEndFrame);
          lastReceiptEntries = run.receiptEntries;
          if (
            resolveRuntimeReplacement !== undefined &&
            workingCast.source.kind === 'operatorSkill'
          ) {
            const actualSkillKey = mismatchedActualSkillKey(run.receiptEntries, current.castId);
            if (actualSkillKey !== null) {
              const replacement = resolveRuntimeReplacement({
                scenario: working,
                trackIndex: current.trackIndex,
                skillGroupKey: workingCast.source.skillGroupKey,
                expectedSkillKey: workingCast.source.skillKey,
                actualSkillKey,
              });
              if (replacement !== null && replacement !== workingCast.source.skillKey) {
                sourceSkillKey ??= workingCast.source.skillKey;
                resolvedSkillKey = replacement;
                workingCast.source = { ...workingCast.source, skillKey: replacement };
                targetCast.source = { ...workingCast.source };
                continue;
              }
            }
          }
          actualStarts = new Map(projectExecutedCastStartFrames(run.receiptEntries));
          actualEnds = new Map(projectDisplayedCastEndFrames(run.receiptEntries, actualStarts));
          if (actualEnds.has(current.castId) && !hasOpenUltimateTimeDilation(run.receiptEntries)) {
            ultimateIntervals = ultimateTimeDilationIntervals(run.receiptEntries, planningEndFrame);
            settled = true;
            break;
          }
          planningEndFrame += PLANNING_LOOKAHEAD_FRAMES;
        }
        if (!settled || !castCannotInterruptCurrentSkill(lastReceiptEntries, current.castId)) break;
        if (inputWindowAttempt === 0) {
          fallbackActualStarts = actualStarts;
          fallbackActualEnds = actualEnds;
          fallbackUltimateIntervals = ultimateIntervals;
        }
        if (inputWindowAttempt === MAX_INPUT_WINDOW_DELAY_FRAMES) {
          adjustedStartFrame = initialAdjustedStartFrame;
          targetCast.placement = { startFrame: adjustedStartFrame };
          workingCast.placement = { startFrame: adjustedStartFrame };
          actualStarts = new Map(fallbackActualStarts!);
          actualEnds = new Map(fallbackActualEnds!);
          ultimateIntervals = fallbackUltimateIntervals!;
          inputWindowDelayFrames = 0;
          inputWindowSearchExhausted = true;
          break;
        }
        settled = false;
        const next = moveOutsideUltimateTimeDilation(
          adjustedStartFrame + 1,
          priorUltimateIntervals,
        );
        inputWindowDelayFrames += next.frame - adjustedStartFrame;
        adjustedStartFrame = next.frame;
        if (next.intervalEnd !== undefined) ultimateTimeDilationEndFrame = next.intervalEnd;
      }
      if (!settled) {
        const lifecycle = lastReceiptEntries
          .filter(entry => entry.data?.castId === current.castId)
          .map(entry => `${entry.frame}:${entry.event}`)
          .join(', ');
        throw new Error(
          `cast '${current.castId}' did not reach a stable display end (${lifecycle || 'no receipts'})`,
        );
      }
      const actualEndFrame = actualEnds.get(current.castId)!;
      scenario.battle.durationFrames = Math.max(scenario.battle.durationFrames, actualEndFrame);
      if (scenario.battle.simulationRange?.endFrame !== undefined) {
        scenario.battle.simulationRange.endFrame = Math.max(
          scenario.battle.simulationRange.endFrame,
          actualEndFrame,
        );
      }

      previousByTrack.set(current.trackIndex, current);
      previousGlobal = current;
      if (adjustedStartFrame !== current.sourceStartFrame || inputWindowSearchExhausted) {
        timingAdjustments.push({
          scenarioId: scenario.id,
          castId: current.castId,
          trackIndex: current.trackIndex,
          actionIndex: current.actionIndex,
          sourceStartFrame: current.sourceStartFrame,
          adjustedStartFrame,
          ...(sameTrackEndCandidate === undefined ? {} : { sameTrackEndCandidate }),
          ...(globalOrderCandidate === undefined ? {} : { globalOrderCandidate }),
          pushedByUltimateTimeDilation: ultimateTimeDilationEndFrame !== undefined,
          ...(ultimateTimeDilationEndFrame === undefined ? {} : { ultimateTimeDilationEndFrame }),
          ...(inputWindowDelayFrames === 0 ? {} : { inputWindowDelayFrames }),
          ...(controlInputSeparationFrames === 0 ? {} : { controlInputSeparationFrames }),
          ...(inputWindowSearchExhausted ? { inputWindowSearchExhausted: true } : {}),
        });
      }
      if (sourceSkillKey !== undefined && resolvedSkillKey !== undefined) {
        skillFormAdjustments.push({
          scenarioId: scenario.id,
          castId: current.castId,
          trackIndex: current.trackIndex,
          actionIndex: current.actionIndex,
          sourceSkillKey,
          resolvedSkillKey,
        });
      }
    }
    retimeControlSwitches(scenario, working, sourceData, ordered);
    const inferred = synchronizeLegacyInferredControlSwitches(
      scenario,
      ordered.map((item, order) => ({ ...item, order })),
    );
    records(sourceData.switchEvents).forEach((sourceSwitch, index) => {
      const sourceFrame = integer(sourceSwitch.time);
      if (sourceFrame === null) return;
      const switchId =
        typeof sourceSwitch.id === 'string' ? sourceSwitch.id : `legacy-switch-${index}`;
      const target = scenario.battle.controlSwitches.find(item => item.id === switchId);
      if (target === undefined || target.frame === sourceFrame) return;
      const previous = ordered.findLast(item => item.sourceStartFrame <= sourceFrame);
      const next = ordered.find(item => item.sourceStartFrame >= sourceFrame);
      controlSwitchAdjustments.push({
        scenarioId: scenario.id,
        switchId,
        trackIndex: target.trackIndex,
        sourceFrame,
        adjustedFrame: target.frame,
        ...(previous === undefined ? {} : { previousCastId: previous.castId }),
        ...(next === undefined ? {} : { nextCastId: next.castId }),
      });
    });
    for (const controlSwitch of inferred) {
      const cast = ordered.find(
        item => controlSwitch.id === legacyInferredControlSwitchId(item.castId),
      );
      if (cast === undefined) continue;
      inferredControlSwitches.push({
        scenarioId: scenario.id,
        switchId: controlSwitch.id,
        castId: cast.castId,
        trackIndex: controlSwitch.trackIndex,
        sourceFrame: cast.sourceStartFrame,
        inferredFrame: controlSwitch.frame,
      });
    }
  }
  return {
    timingAdjustments,
    skillFormAdjustments,
    controlSwitchAdjustments,
    inferredControlSwitches,
  };
}
