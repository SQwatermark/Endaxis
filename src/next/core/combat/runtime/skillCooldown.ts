/**
 * 单次充能技能的冷却账本，负责施放预占、逐帧恢复，以及确认帧已知时的提前返还。
 * 本层不猜缺失的确认帧；多充能和动态恢复倍率需要独立证据与目录字段后再扩展。
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
    if (!Number.isInteger(periodFrames) || periodFrames <= 0) {
      throw new RangeError('skill cooldown period must be a positive integer frame count');
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

  /** 每个 AbilitySystem 帧推进一次；返回本帧是否刚到达可用边界。 */
  advanceFrame(): boolean {
    const timer = this.#timer;
    return timer !== undefined && !timer.isReady && timer.update(1);
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
