/**
 * 单次充能技能的冷却账本，负责施放预占、逐帧恢复，以及确认帧已知时的提前返还。
 * 本层不猜缺失的确认帧；多充能和动态恢复倍率需要独立证据与定义字段后再扩展。
 */
import { PeriodicTimer } from './periodicTimer';

const READY_EPSILON = 0.00001;

/** 投影与合法性诊断可读取的冷却事实快照。 */
export interface SkillCooldownSnapshot {
  readonly configured: boolean;
  readonly ready: boolean;
  readonly remainingFrames: number;
  readonly progress: number;
}

/** 一项技能在一次战斗中的单次充能冷却状态。 */
export class SkillCooldown {
  readonly #timer?: PeriodicTimer;
  readonly #periodFrames: number;
  readonly #commitFrame?: number;
  #reservedByCurrentCast = false;

  constructor(periodFrames?: number, commitFrame?: number) {
    if (periodFrames === undefined) {
      this.#periodFrames = 0;
      return;
    }
    if (!Number.isFinite(periodFrames) || periodFrames <= 0) {
      throw new RangeError('skill cooldown period must be a positive finite frame count');
    }
    if (commitFrame !== undefined && (!Number.isInteger(commitFrame) || commitFrame < 0)) {
      throw new RangeError('skill cooldown commit frame must be a non-negative integer');
    }
    this.#periodFrames = periodFrames;
    this.#commitFrame = commitFrame;
    this.#timer = new PeriodicTimer();
    this.#timer.reset(periodFrames, false);
  }

  get snapshot(): SkillCooldownSnapshot {
    const timer = this.#timer;
    return {
      configured: timer !== undefined,
      ready: timer?.isReady ?? true,
      remainingFrames: timer === undefined ? 0 : Math.max(0, timer.remaining),
      progress: timer?.progress ?? 1,
    };
  }

  /**
   * 对一次实际可用的施放预占冷却。排轴中的非法施放仍可继续模拟，
   * 但不会重置尚未完成的旧冷却。
   */
  tryReserve(): boolean {
    const timer = this.#timer;
    if (timer === undefined) return true;
    if (!timer.isReady) {
      this.#reservedByCurrentCast = false;
      return false;
    }
    timer.reset(this.#periodFrames, true);
    this.#reservedByCurrentCast = true;
    return true;
  }

  /** 按已换算成配置帧的时间推进；返回本次是否刚到达可用边界。 */
  advance(deltaFrames = 1): boolean {
    if (!Number.isFinite(deltaFrames) || deltaFrames < 0) {
      throw new RangeError('cooldown delta frames must be a non-negative finite number');
    }
    const timer = this.#timer;
    return timer !== undefined && !timer.isReady && timer.update(deltaFrames);
  }

  /** 固定帧驱动兼容入口；精确时钟调用应使用 advance。 */
  advanceFrame(): boolean {
    return this.advance(1);
  }

  /** 原生 SetSkillCdAtOnce(Reduce, percentage) 从剩余值扣除基础周期乘比例。 */
  reduceByBaseDurationRatio(ratio: number): boolean {
    if (!Number.isFinite(ratio) || ratio < 0) {
      throw new RangeError('skill cooldown reduction ratio must be a non-negative finite number');
    }
    const timer = this.#timer;
    if (timer === undefined || timer.isReady) return false;
    timer.update(this.#periodFrames * ratio);
    return true;
  }

  /** 原生 SetSkillCdAtOnce(Reduce, absolute) 从当前剩余冷却扣除固定帧数。 */
  reduceByFrames(frames: number): boolean {
    if (!Number.isFinite(frames) || frames < 0) {
      throw new RangeError('skill cooldown reduction frames must be non-negative and finite');
    }
    const timer = this.#timer;
    if (timer === undefined || timer.isReady) return false;
    timer.update(frames);
    return true;
  }

  /** 把剩余冷却直接设置为基础周期的给定比例。 */
  setByBaseDurationRatio(ratio: number): boolean {
    if (!Number.isFinite(ratio) || ratio < 0) {
      throw new RangeError('skill cooldown ratio must be a non-negative finite number');
    }
    const timer = this.#timer;
    if (timer === undefined) return false;
    timer.setRemaining(this.#periodFrames * ratio);
    return true;
  }

  /** 原生 SetFirstTimerProgress：0 表示刚进入冷却，1 表示已经可用。 */
  setProgress(progress: number): boolean {
    if (!Number.isFinite(progress) || progress < 0 || progress > 1) {
      throw new RangeError('skill cooldown progress must be a finite number between 0 and 1');
    }
    return this.setByBaseDurationRatio(1 - progress);
  }

  /** 把剩余冷却直接设置为配置帧数。 */
  setRemainingFrames(frames: number): boolean {
    if (!Number.isFinite(frames) || frames < 0) {
      throw new RangeError('skill cooldown frames must be a non-negative finite number');
    }
    const timer = this.#timer;
    if (timer === undefined) return false;
    timer.setRemaining(frames);
    return true;
  }

  /**
   * 结束当前施放；确认帧存在且冷却尚未越过该帧时，返还本次预占。
   * 返回值只表示本次结束是否实际发生了返还。
   */
  finishCast(): boolean {
    const timer = this.#timer;
    if (!this.#reservedByCurrentCast || timer === undefined) return false;
    this.#reservedByCurrentCast = false;
    if (this.#commitFrame === undefined) return false;
    if (timer.passed >= this.#commitFrame - READY_EPSILON) return false;
    timer.reset(this.#periodFrames, false);
    return true;
  }
}
