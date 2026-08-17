/**
 * 技能块“可操作边界”的最小运行时事实跟踪器。
 *
 * 它在数据流中的位置：调用方（技能运行时）每个实际帧把施法者 self-scaled 后的
 * 逻辑帧增量交给本模块累计；当某次释放累计到 `timelineBlockDurationFrames` 时，
 * 本模块返回一次不可变事实，供上层归约为该 castId 的实际结束帧。
 *
 * 本模块不读取 CombatClock，也不自行推导帧序。调用方必须显式传入已经算好的
 * `frameEndExclusive`（end-exclusive 实际帧），并保证它和当前实际帧的语义一致；
 * 序列是否自然结束、技能是否仍处于 casting，都与本模块无关。
 */

/** 一次释放到达可操作边界后返回给调用方的不可变事实。 */
export interface SkillOperableBoundaryFact {
  readonly castId: string;
  /** end-exclusive 实际帧；由调用方按当前帧序约定显式给出。 */
  readonly actualEndFrame: number;
}

interface PendingSkillOperableBoundary {
  readonly castId: string;
  readonly durationFrames: number;
  accumulatedFrames: number;
}

/** 浮点帧增量累计到整数边界时允许的误差；避免 0.2 × 150 这类情况晚一帧。 */
const BOUNDARY_EPSILON_FRAMES = 0.00001;

/**
 * 同时跟踪多个技能释放的可操作边界。
 * castId 在一次场景内是稳定释放身份，因此 pending 和已完成的 castId 都不允许再次登记。
 */
export class SkillOperableBoundaryRuntime {
  readonly #pendingByCastId = new Map<string, PendingSkillOperableBoundary>();
  readonly #registeredCastIds = new Set<string>();

  /**
   * 登记一次成功释放的可操作边界。
   * `durationFrames` 必须为正有限数；稳定 castId 一旦登记过，无论 pending 或已完成都不能再次登记。
   */
  begin(castId: string, durationFrames: number): void {
    if (typeof castId !== 'string' || castId.length === 0) {
      throw new TypeError('castId must be a non-empty string');
    }
    if (!Number.isFinite(durationFrames) || durationFrames <= 0) {
      throw new RangeError('durationFrames must be a positive finite number');
    }
    if (this.#registeredCastIds.has(castId)) {
      throw new Error(`duplicate skill operable boundary registration for cast '${castId}'`);
    }
    this.#registeredCastIds.add(castId);
    this.#pendingByCastId.set(castId, {
      castId,
      durationFrames,
      accumulatedFrames: 0,
    });
  }

  /**
   * 用本帧施法者 self-scaled 的逻辑帧增量推进全部 pending 项。
   * `deltaFrames` 为 0 时不推进任何项；`frameEndExclusive` 仍会被校验。
   * 返回按 begin 登记顺序排列的本帧到达事实；每个 pending 项最多返回一次。
   */
  advance(deltaFrames: number, frameEndExclusive: number): readonly SkillOperableBoundaryFact[] {
    if (!Number.isFinite(deltaFrames) || deltaFrames < 0) {
      throw new RangeError('deltaFrames must be a non-negative finite number');
    }
    if (!Number.isInteger(frameEndExclusive) || frameEndExclusive < 0) {
      throw new RangeError('frameEndExclusive must be a non-negative integer');
    }
    if (deltaFrames === 0) return [];

    const reached: SkillOperableBoundaryFact[] = [];
    for (const [castId, pending] of this.#pendingByCastId) {
      pending.accumulatedFrames += deltaFrames;
      if (pending.accumulatedFrames + BOUNDARY_EPSILON_FRAMES < pending.durationFrames) continue;
      reached.push(Object.freeze({ castId, actualEndFrame: frameEndExclusive }));
      this.#pendingByCastId.delete(castId);
    }
    return reached;
  }
}
