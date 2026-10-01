/** 配对进程测量的顺序、暖态判定和统计；不接触生产状态。 */
import { createHash } from 'node:crypto';

export const DEFAULT_POLICY = Object.freeze({
  pairs: 6,
  repetitions: 5,
  minWarmups: 8,
  maxWarmups: 20,
  warmWindow: 4,
  warmConsecutive: 2,
  warmMedianTolerance: 0.03,
  warmMadTolerance: 0.05,
  accuracy: 0.03,
});

export function median(values) {
  if (!values.length || values.some(value => !Number.isFinite(value)))
    throw new Error('需要非空有限数样本');
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

/** 固定种子的 Mulberry32 仅用于测量顺序，不改变模拟的随机配置。 */
export function randomFromSeed(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(values, random) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const next = Math.floor(random() * (index + 1));
    [result[index], result[next]] = [result[next], result[index]];
  }
  return result;
}

/** 每轴、每种对照恰有一半 AB、一半 BA；组内始终紧邻运行两个新进程。 */
export function createSchedule(axisCount, pairs, seed, mode) {
  if (!Number.isInteger(pairs) || pairs < 2 || pairs % 2 !== 0)
    throw new Error('配对数必须是正偶数');
  const random = randomFromSeed(seed);
  const kinds = mode === 'calibration' ? ['AA'] : ['AA', 'AB'];
  const orders = Array.from({ length: axisCount }, () =>
    Object.fromEntries(
      kinds.map(kind => [
        kind,
        shuffled(
          Array.from({ length: pairs }, (_, index) => (index % 2 ? 'BA' : 'AB')),
          random,
        ),
      ]),
    ),
  );
  const schedule = [];
  for (let pair = 0; pair < pairs; pair++) {
    for (const axis of shuffled(
      Array.from({ length: axisCount }, (_, index) => index),
      random,
    )) {
      for (const kind of shuffled(kinds, random)) {
        const order = orders[axis][kind][pair];
        schedule.push({
          group: schedule.length,
          axis,
          pair,
          kind,
          order,
          arms: [...order].map(label => ({
            label,
            // A/A 的两个标签必须引用同一个构建，而不是重新构建两份相同源码。
            bundle: kind === 'AA' ? 'A' : label,
          })),
        });
      }
    }
  }
  return schedule;
}

/** 两个相邻窗口比较中位数与窗口内 MAD；连续通过才结束热身。 */
export function warmAssessment(samples, policy = DEFAULT_POLICY) {
  const count = samples.length;
  if (count < policy.minWarmups || count < 2 * policy.warmWindow)
    return { count, eligible: false, passes: false, metrics: {} };
  const recent = samples.slice(-2 * policy.warmWindow);
  const metrics = {};
  for (const metric of ['wallMs', 'cpuMs']) {
    const first = recent.slice(0, policy.warmWindow).map(sample => sample[metric]);
    const second = recent.slice(policy.warmWindow).map(sample => sample[metric]);
    if ([...first, ...second].some(value => !Number.isFinite(value) || value <= 0))
      throw new Error(`无效的暖态 ${metric} 样本`);
    const firstMedian = median(first);
    const secondMedian = median(second);
    const ratio = secondMedian / firstMedian;
    const firstRelativeMad =
      median(first.map(value => Math.abs(value - firstMedian))) / firstMedian;
    const secondRelativeMad =
      median(second.map(value => Math.abs(value - secondMedian))) / secondMedian;
    metrics[metric] = {
      firstMedian,
      secondMedian,
      ratio,
      firstRelativeMad,
      secondRelativeMad,
      passes:
        Math.abs(Math.log(ratio)) <= Math.log1p(policy.warmMedianTolerance) &&
        Math.max(firstRelativeMad, secondRelativeMad) <= policy.warmMadTolerance,
    };
  }
  return {
    count,
    eligible: true,
    passes: Object.values(metrics).every(value => value.passes),
    metrics,
  };
}

// 双侧 95% Student-t 临界值，df=1..29；CLI 将配对数量限制在 6..30。
const T_975 = [
  12.706204736, 4.30265273, 3.182446305, 2.776445105, 2.570581836, 2.446911851, 2.364624252,
  2.306004135, 2.262157163, 2.228138852, 2.20098516, 2.17881283, 2.160368656, 2.144786688,
  2.131449546, 2.119905299, 2.109815578, 2.10092204, 2.093024054, 2.085963447, 2.079613845,
  2.073873068, 2.06865761, 2.063898562, 2.059538553, 2.055529439, 2.051830516, 2.048407142,
  2.045229642,
];

/** 统计单位是一对独立进程的中位数；绝不把进程内重复计为独立样本。 */
export function pairedInference(pairs, metric, accuracy = DEFAULT_POLICY.accuracy) {
  if (pairs.length < 2 || pairs.length > 30) throw new Error('推断需要 2–30 对进程');
  const values = pairs.map(pair => {
    const a = median(pair.A.measuredSamples.map(sample => sample[metric]));
    const b = median(pair.B.measuredSamples.map(sample => sample[metric]));
    if (a <= 0 || b <= 0) throw new Error('配对进程中位数必须大于 0');
    return {
      group: pair.group,
      pair: pair.pair,
      order: pair.order,
      a,
      b,
      ratio: b / a,
      logRatio: Math.log(b / a),
    };
  });
  const n = values.length;
  const mean = values.reduce((sum, value) => sum + value.logRatio, 0) / n;
  const variance = values.reduce((sum, value) => sum + (value.logRatio - mean) ** 2, 0) / (n - 1);
  const standardError = Math.sqrt(variance / n);
  const critical = T_975[n - 2];
  const halfWidth = critical * standardError;
  const lower = Math.exp(mean - halfWidth);
  const upper = Math.exp(mean + halfWidth);
  return {
    method:
      'Approximate two-sided 95% Student-t interval of paired PROCESS-median log(B/A); assumes independent pair groups and roughly normal log ratios. Six pairs do not establish these assumptions.',
    pairCount: n,
    ratio: Math.exp(mean),
    percentChange: 100 * Math.expm1(mean),
    logRatioMean: mean,
    logRatioSampleSd: Math.sqrt(variance),
    logStandardError: standardError,
    tCritical: critical,
    interval: { lower, upper },
    multiplicativeHalfWidthPercent: 100 * Math.expm1(halfWidth),
    precisionPass: halfWidth <= Math.log1p(accuracy),
    // 校准还需不显示方向性偏移，并且整个区间落在预声明的误差范围内。
    calibrationPass:
      lower <= 1 && upper >= 1 && lower >= 1 / (1 + accuracy) && upper <= 1 + accuracy,
    values,
  };
}

/** 明确保留数值类型、-0、undefined、数组顺序/空洞与 Map/Set；拒绝不支持的数据。 */
export function exactDataSha256(value) {
  const hash = createHash('sha256');
  let pending = '';
  const ancestors = new Set();
  function emit(text) {
    pending += text;
    if (pending.length >= 65536) {
      hash.update(pending);
      pending = '';
    }
  }
  function visit(item) {
    if (item === null) return emit('null;');
    switch (typeof item) {
      case 'undefined':
        return emit('undefined;');
      case 'boolean':
        return emit(item ? 'true;' : 'false;');
      case 'number':
        return emit(`number:${Object.is(item, -0) ? '-0' : String(item)};`);
      case 'bigint':
        return emit(`bigint:${item};`);
      case 'string':
        return emit(`string:${JSON.stringify(item)};`);
      case 'object':
        break;
      default:
        throw new Error(`哈希不支持 ${typeof item}`);
    }
    if (ancestors.has(item)) throw new Error('哈希不支持循环数据');
    ancestors.add(item);
    if (Array.isArray(item)) {
      emit(`array:${item.length}[`);
      for (let index = 0; index < item.length; index++) {
        if (Object.hasOwn(item, index)) visit(item[index]);
        else emit('hole;');
      }
      emit(']');
    } else if (item instanceof Map) {
      emit(`map:${item.size}[`);
      for (const [key, entry] of item) {
        visit(key);
        visit(entry);
      }
      emit(']');
    } else if (item instanceof Set) {
      emit(`set:${item.size}[`);
      for (const entry of item) visit(entry);
      emit(']');
    } else if (item instanceof Date) {
      emit(`date:${item.getTime()};`);
    } else {
      const prototype = Object.getPrototypeOf(item);
      if (prototype !== Object.prototype && prototype !== null)
        throw new Error(`哈希不支持实例 ${item.constructor?.name}`);
      emit(prototype === null ? 'nullObject{' : 'object{');
      for (const key of Object.keys(item)) {
        visit(key);
        visit(item[key]);
      }
      emit('}');
    }
    ancestors.delete(item);
  }
  visit(value);
  hash.update(pending);
  return hash.digest('hex');
}
