/**
 * 场景模拟使用的随机策略。
 *
 * 期望模式让连续数值使用数学期望，并用均匀序列安排无法取平均的离散事件；随机模式则从
 * 可复现的伪随机流取样。两种模式向战斗运行时提供相同的样本接口，具体技能无需维护两套实现；
 * 直接伤害只在统一的伤害执行器中选择写入期望值或本次取样值。
 */
import type { CriticalSampleSource } from './criticalSampleSource';
import type { ProbabilitySampleSource } from './probabilitySampleSource';

export type SimulationRandomMode = 'expected' | 'sampled';

/** 一次随机取样的稳定归属；技能块种子只接管带有对应 castId 的取样。 */
export interface RandomSampleRequest {
  readonly castId?: string;
  /** 期望模式中独立安排离散结果的来源身份；避免无关来源互相挤占均匀序列。 */
  readonly expectedSequenceId?: string;
}

export interface SimulationRandomSettings {
  readonly mode: SimulationRandomMode;
  /** 32 位无符号整数。相同场景、种子和执行顺序得到相同结果。 */
  readonly globalSeed: number;
  /** 键为时间轴技能块 ID；存在时该技能及其派生行为使用独立随机流。 */
  readonly castSeeds?: ReadonlyMap<string, number>;
}

/** 同时服务暴击和普通概率条件，两个类别各自持有流，互不改变对方的结果。 */
export class SimulationRandomSource implements CriticalSampleSource, ProbabilitySampleSource {
  readonly #settings: SimulationRandomSettings;
  readonly #streams = new Map<string, () => number>();
  readonly #evenIndices = new Map<string, number>();

  constructor(settings: SimulationRandomSettings) {
    assertSeed(settings.globalSeed, 'globalSeed');
    for (const [castId, seed] of settings.castSeeds ?? []) {
      if (castId.length === 0) throw new RangeError('cast seed id must not be empty');
      assertSeed(seed, `cast seed '${castId}'`);
    }
    this.#settings = settings;
  }

  nextCriticalSample(request?: RandomSampleRequest): number {
    return this.#next('critical', request);
  }

  nextProbabilitySample(request?: RandomSampleRequest): number {
    return this.#next('probability', request);
  }

  #next(kind: 'critical' | 'probability', request: RandomSampleRequest | undefined): number {
    if (this.#settings.mode === 'expected') {
      const expectedScope =
        request?.expectedSequenceId === undefined
          ? 'global'
          : `source:${request.expectedSequenceId}`;
      return this.#nextEven(`${kind}:${expectedScope}`);
    }
    const castId = request?.castId;
    const castSeed = castId === undefined ? undefined : this.#settings.castSeeds?.get(castId);
    const scope = castSeed === undefined ? 'global' : `cast:${castId}`;
    const streamKey = `${kind}:${scope}`;

    let stream = this.#streams.get(streamKey);
    if (stream === undefined) {
      const baseSeed = castSeed ?? this.#settings.globalSeed;
      stream = mulberry32(mixSeed(baseSeed, streamKey));
      this.#streams.set(streamKey, stream);
    }
    return stream();
  }

  #nextEven(streamKey: string): number {
    const index = (this.#evenIndices.get(streamKey) ?? 0) + 1;
    this.#evenIndices.set(streamKey, index);
    let remaining = index;
    let sample = 0;
    let place = 0.5;
    while (remaining > 0) {
      sample += (remaining % 2) * place;
      remaining = Math.floor(remaining / 2);
      place *= 0.5;
    }
    return sample;
  }
}

function assertSeed(seed: number, label: string): void {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) {
    throw new RangeError(`${label} must be a 32-bit unsigned integer`);
  }
}

function mixSeed(seed: number, text: string): number {
  let value = seed >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    value ^= text.charCodeAt(index);
    value = Math.imul(value, 0x01000193) >>> 0;
  }
  return value;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
  };
}
