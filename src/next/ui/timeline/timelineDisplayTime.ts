/**
 * 把项目逻辑帧投影为时间轴上的实际战斗帧。
 *
 * 存档和编辑命令始终使用逻辑帧；本模块只在模拟结果有效时改变显示坐标，
 * 避免时间膨胀规则渗入文档模型和各个 Vue 组件。
 */
import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';
import type { TimelineTimeMapping } from '../../core/projection/timelineTimeMapping';

export interface TimelineDisplayTime {
  readonly logicalDurationFrames: number;
  readonly actualDurationFrames: number;
  readonly toActualFrame: (logicalFrame: number) => number;
  readonly toLogicalFrame: (actualFrame: number) => number;
}

export interface TimelineTimeDilationBand {
  readonly instanceId: number;
  readonly kind: 'global' | 'entity';
  readonly startFrame: number;
  readonly endFrame: number;
  readonly targetId?: string;
  readonly sourceCastId?: string;
}

/** 没有可用模拟结果时使用恒等映射，编辑器仍可独立工作。 */
export function createTimelineDisplayTime(
  logicalDurationFrames: number,
  mapping: TimelineTimeMapping | null,
): TimelineDisplayTime {
  if (!Number.isFinite(logicalDurationFrames) || logicalDurationFrames < 0) {
    throw new RangeError('logical duration must be a non-negative finite number');
  }
  if (mapping === null) {
    return {
      logicalDurationFrames,
      actualDurationFrames: logicalDurationFrames,
      toActualFrame: logicalFrame => logicalFrame,
      toLogicalFrame: actualFrame => actualFrame,
    };
  }
  const actualDurationFrames = mapping.points.at(-1)?.actualFrame ?? logicalDurationFrames;
  return {
    logicalDurationFrames,
    actualDurationFrames,
    toActualFrame: logicalFrame =>
      mapping.actualFrameAt(clamp(logicalFrame, 0, logicalDurationFrames)),
    toLogicalFrame: actualFrame =>
      mapping.logicalFrameAt(clamp(actualFrame, 0, actualDurationFrames)),
  };
}

/**
 * 技能实际开始帧以运行时回执为准。全局停时会让多个实际帧对应同一个逻辑帧，
 * 仅靠双向时间映射无法判断输入真正在哪一帧获准执行。
 */
export function projectSkillCastActualStartFrames(
  entries: readonly CombatReceiptEntry[],
): ReadonlyMap<string, number> {
  const result = new Map<string, number>();
  for (const entry of entries) {
    if (entry.event !== 'SkillStarted') continue;
    const castId = entry.data?.castId;
    if (typeof castId !== 'string' || result.has(castId)) continue;
    result.set(castId, entry.frame);
  }
  return result;
}

/** 把时间实例生命周期回执配对为实际帧区间，不解释倍率和槽位竞争。 */
export function projectTimelineTimeDilationBands(
  entries: readonly CombatReceiptEntry[],
  simulationEndFrame: number,
): readonly TimelineTimeDilationBand[] {
  if (!Number.isFinite(simulationEndFrame) || simulationEndFrame < 0) {
    throw new RangeError('simulation end frame must be a non-negative finite number');
  }
  const active = new Map<number, Omit<TimelineTimeDilationBand, 'endFrame'>>();
  const bands: TimelineTimeDilationBand[] = [];
  for (const entry of entries) {
    if (entry.event === 'TimeDilationStarted') {
      const instance = readTimeDilationInstance(entry);
      if (active.has(instance.instanceId)) {
        throw new Error(`time dilation instance ${instance.instanceId} started more than once`);
      }
      active.set(instance.instanceId, {
        ...instance,
        startFrame: entry.frame,
        ...(entry.targetId === undefined ? {} : { targetId: entry.targetId }),
      });
      continue;
    }
    if (entry.event !== 'TimeDilationEnded') continue;
    const instanceId = requireInstanceId(entry);
    const started = active.get(instanceId);
    if (started === undefined) {
      throw new Error(`time dilation instance ${instanceId} ended without a start receipt`);
    }
    active.delete(instanceId);
    if (entry.frame > started.startFrame) bands.push({ ...started, endFrame: entry.frame });
  }
  for (const started of active.values()) {
    if (simulationEndFrame > started.startFrame) {
      bands.push({ ...started, endFrame: simulationEndFrame });
    }
  }
  return Object.freeze(
    bands
      .sort(
        (left, right) => left.startFrame - right.startFrame || left.instanceId - right.instanceId,
      )
      .map(band => Object.freeze(band)),
  );
}

function readTimeDilationInstance(
  entry: CombatReceiptEntry,
): Pick<TimelineTimeDilationBand, 'instanceId' | 'kind' | 'sourceCastId'> {
  const instanceId = requireInstanceId(entry);
  const kind = entry.data?.kind;
  if (kind !== 'global' && kind !== 'entity') {
    throw new Error(`time dilation receipt ${entry.sequence} has invalid kind`);
  }
  const sourceCastId = entry.data?.sourceCastId;
  if (sourceCastId !== undefined && typeof sourceCastId !== 'string') {
    throw new Error(`time dilation receipt ${entry.sequence} has invalid sourceCastId`);
  }
  return {
    instanceId,
    kind,
    ...(sourceCastId === undefined ? {} : { sourceCastId }),
  };
}

function requireInstanceId(entry: CombatReceiptEntry): number {
  const instanceId = entry.data?.instanceId;
  if (!Number.isSafeInteger(instanceId) || (instanceId as number) <= 0) {
    throw new Error(`time dilation receipt ${entry.sequence} has invalid instanceId`);
  }
  return instanceId as number;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
