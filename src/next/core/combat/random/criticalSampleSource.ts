/**
 * 玩家主动伤害共享的暴击随机样本端口及已恢复的 56 项减法随机流。
 * 原生初始化算法尚未闭环，因此这里只接受完整状态或显式测试样本，不提供 seed 便捷构造。
 */
const BATTLE_RANDOM_STATE_LENGTH = 56;
const BATTLE_RANDOM_MAX_VALUE = 0x7fffffff;

/** 一场战斗持有的有状态暴击样本来源。 */
export interface CriticalSampleSource {
  nextCriticalSample(): number;
}

/** 可完整恢复后续随机序列的原生减法随机状态。 */
export interface BattleRandomState {
  readonly currentIndex: number;
  readonly pairedIndex: number;
  readonly values: readonly number[];
}

/** 精确复刻当前反编译版本单步推进规则的 56 项减法随机流。 */
export class SubtractiveBattleRandom implements CriticalSampleSource {
  readonly #values: number[];
  #currentIndex: number;
  #pairedIndex: number;

  constructor(state: BattleRandomState) {
    assertIndex(state.currentIndex, 'currentIndex');
    assertIndex(state.pairedIndex, 'pairedIndex');
    if (state.values.length !== BATTLE_RANDOM_STATE_LENGTH) {
      throw new RangeError(`battle random state must contain ${BATTLE_RANDOM_STATE_LENGTH} values`);
    }
    for (const value of state.values) {
      if (!Number.isInteger(value) || value < 0 || value >= BATTLE_RANDOM_MAX_VALUE) {
        throw new RangeError(
          `battle random state values must be integers in [0, ${BATTLE_RANDOM_MAX_VALUE})`,
        );
      }
    }
    this.#currentIndex = state.currentIndex;
    this.#pairedIndex = state.pairedIndex;
    this.#values = [...state.values];
  }

  nextCriticalSample(): number {
    const currentIndex = advanceIndex(this.#currentIndex);
    const pairedIndex = advanceIndex(this.#pairedIndex);
    let value = this.#values[currentIndex]! - this.#values[pairedIndex]!;
    if (value === BATTLE_RANDOM_MAX_VALUE) value -= 1;
    if (value < 0) value += BATTLE_RANDOM_MAX_VALUE;
    this.#values[currentIndex] = value;
    this.#currentIndex = currentIndex;
    this.#pairedIndex = pairedIndex;
    return Math.fround(value * (1 / BATTLE_RANDOM_MAX_VALUE));
  }

  captureState(): BattleRandomState {
    return {
      currentIndex: this.#currentIndex,
      pairedIndex: this.#pairedIndex,
      values: [...this.#values],
    };
  }
}

/** 用于精确测试或人工录像对照的有限样本流；耗尽后不会循环或回退到其他随机源。 */
export class ExplicitCriticalSampleSource implements CriticalSampleSource {
  readonly #samples: readonly number[];
  #index = 0;

  constructor(samples: readonly number[]) {
    for (const sample of samples) {
      if (!Number.isFinite(sample) || sample < 0 || sample > 1) {
        throw new RangeError('critical samples must be finite values in [0, 1]');
      }
    }
    this.#samples = [...samples];
  }

  nextCriticalSample(): number {
    const sample = this.#samples[this.#index];
    if (sample === undefined) throw new Error('critical sample source is exhausted');
    this.#index += 1;
    return sample;
  }
}

function advanceIndex(index: number): number {
  const next = index + 1;
  return next < BATTLE_RANDOM_STATE_LENGTH ? next : 1;
}

function assertIndex(index: number, name: string): void {
  if (!Number.isInteger(index) || index < 0 || index >= BATTLE_RANDOM_STATE_LENGTH) {
    throw new RangeError(`${name} must be an integer in [0, ${BATTLE_RANDOM_STATE_LENGTH})`);
  }
}
