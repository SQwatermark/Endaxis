import type { CombatReceiptEntry } from '../../core/combat/receipt/combatReceipt';

export interface TimelineTimeDilationBand {
  readonly instanceId: number;
  readonly kind: 'global' | 'entity';
  readonly startFrame: number;
  readonly endFrame: number;
  readonly targetId?: string;
  readonly sourceCastId?: string;
}

export interface TimelineCastTimeDilationSegment {
  readonly offsetFrames: number;
  readonly durationFrames: number;
}

/**
 * 把来源于某次施法的实际时间膨胀区间裁剪到该技能块，并转换为相对块起点的实际帧。
 * 多个生命周期实例保持为多个区间，不能合并成从技能起点开始的定义时长预览。
 */
export function projectCastTimeDilationSegments(
  bands: readonly TimelineTimeDilationBand[],
  castId: string,
  castStartFrame: number,
  castDurationFrames: number,
): readonly TimelineCastTimeDilationSegment[] {
  if (castDurationFrames <= 0) return [];
  const castEndFrame = castStartFrame + castDurationFrames;
  return Object.freeze(
    bands.flatMap(band => {
      if (band.sourceCastId !== castId) return [];
      const startFrame = Math.max(castStartFrame, band.startFrame);
      const endFrame = Math.min(castEndFrame, band.endFrame);
      if (endFrame <= startFrame) return [];
      return [
        Object.freeze({
          offsetFrames: startFrame - castStartFrame,
          durationFrames: endFrame - startFrame,
        }),
      ];
    }),
  );
}

/** 技能实际开始帧以运行时回执为准；被拒绝的放置输入不会伪造开始事实。 */
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

/**
 * 把技能局部可操作边界配对为实际宽度。没有到达边界的释放不返回猜测值，
 * UI 继续使用定义宽度作为未完成模拟的保底展示。
 */
export function projectSkillCastActualDurationFrames(
  entries: readonly CombatReceiptEntry[],
): ReadonlyMap<string, number> {
  const starts = projectSkillCastActualStartFrames(entries);
  const result = new Map<string, number>();
  for (const entry of entries) {
    if (entry.event !== 'SkillOperableBoundaryReached') continue;
    const castId = entry.data?.castId;
    if (typeof castId !== 'string') {
      throw new Error(`skill operable boundary receipt ${entry.sequence} has invalid castId`);
    }
    if (result.has(castId)) {
      throw new Error(`skill cast '${castId}' reached its operable boundary more than once`);
    }
    const startFrame = starts.get(castId);
    if (startFrame === undefined) {
      throw new Error(`skill cast '${castId}' reached its operable boundary without starting`);
    }
    const durationFrames = entry.frame - startFrame;
    if (durationFrames <= 0) {
      throw new Error(`skill cast '${castId}' has a non-positive actual duration`);
    }
    result.set(castId, durationFrames);
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
