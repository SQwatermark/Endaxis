/**
 * 把失衡日志整理成曲线：敌人初始失衡值 + 每次失衡变化 = 一条折线。
 * 曲线只能来自日志记录的事实；日志和曲线对不上就报错。
 */
import type { CombatReceiptEntry, CombatReceiptValue } from '../combat/receipt/combatReceipt';
import { projectPoiseChangePoints, type PoiseChangePoint } from './poiseChangePoints';
import type { ResourceCurvePoint } from './resourceCurves';

/** 单场战斗中敌人的失衡曲线。 */
export interface PoiseCurve {
  readonly resource: 'poise';
  readonly maxValue: number;
  readonly points: readonly ResourceCurvePoint[];
}

/** 曲线初始失衡；调用方必须传和这次模拟完全一致的敌人数值。 */
export interface PoiseCurveInitial {
  readonly poise: number;
  readonly maxPoise: number;
}

/** 失衡恢复完成后，运行时记下的一条"失衡回到多少"的记录。 */
export interface PoiseRecoveredPoint {
  readonly frame: number;
  readonly time: number;
  readonly sequence: number;
  readonly poise: number;
}

/** 曲线消费的两种失衡事实；按回执顺序交错出现。 */
export type PoiseCurveChange = PoiseChangePoint | PoiseRecoveredPoint;

function appendAppliedPoint(points: ResourceCurvePoint[], change: PoiseChangePoint): void {
  if (change.currentPoise !== change.previousPoise + change.actualDelta) {
    throw new Error(
      `poise curve is discontinuous at receipt ${change.sequence}: expected ${change.previousPoise + change.actualDelta}, received ${change.currentPoise}`,
    );
  }
  points.push({
    frame: change.frame,
    time: change.time,
    sequence: change.sequence,
    value: change.currentPoise,
  });
}

function appendRecoveredPoint(
  points: ResourceCurvePoint[],
  change: PoiseRecoveredPoint,
  maxPoise: number,
): void {
  // 运行时恢复完成时始终把失衡重置为最大值，因此恢复事实必须与最大值一致。
  if (change.poise !== maxPoise) {
    throw new Error(
      `poise recovery at receipt ${change.sequence} restored to ${change.poise}, expected ${maxPoise}`,
    );
  }
  points.push({
    frame: change.frame,
    time: change.time,
    sequence: change.sequence,
    value: change.poise,
  });
}

/** 从初始失衡按事实顺序投影失衡曲线；被取消或免疫拦截的结算仍保留其事实点。 */
export function projectPoiseCurve(
  initial: PoiseCurveInitial,
  changes: readonly PoiseChangePoint[],
): PoiseCurve {
  return projectPoiseCurvePoints(initial, changes);
}

/** 从回执直接投影失衡曲线，并在应用结算与恢复之间保持严格连续。 */
export function projectPoiseCurveFromReceipt(
  initial: PoiseCurveInitial,
  entries: readonly CombatReceiptEntry[],
): PoiseCurve {
  const changes: PoiseCurveChange[] = [
    ...projectPoiseChangePoints(entries),
    ...projectPoiseRecoveredPoints(entries),
  ];
  changes.sort((left, right) => left.sequence - right.sequence);
  return projectPoiseCurvePoints(initial, changes);
}

function projectPoiseCurvePoints(
  initial: PoiseCurveInitial,
  changes: readonly PoiseCurveChange[],
): PoiseCurve {
  const points: ResourceCurvePoint[] = [
    { frame: 0, time: 0, sequence: null, value: initial.poise },
  ];
  let currentValue = initial.poise;
  for (const change of changes) {
    if ('actualDelta' in change) {
      if (change.previousPoise !== currentValue) {
        throw new Error(
          `poise curve is discontinuous at receipt ${change.sequence}: expected previousPoise ${currentValue}, received ${change.previousPoise}`,
        );
      }
      appendAppliedPoint(points, change);
      currentValue = change.currentPoise;
      continue;
    }
    appendRecoveredPoint(points, change, initial.maxPoise);
    currentValue = change.poise;
  }
  return {
    resource: 'poise',
    maxValue: initial.maxPoise,
    points,
  };
}

function requireNumber(
  entry: CombatReceiptEntry,
  data: Readonly<Record<string, CombatReceiptValue>>,
  key: string,
): number {
  const value = data[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`receipt ${entry.sequence} '${entry.event}' has no finite ${key}`);
  }
  return value;
}

/** 提取 `PoiseRecovered` 恢复事实；运行时在恢复完成时写入当前失衡值。 */
export function projectPoiseRecoveredPoints(
  entries: readonly CombatReceiptEntry[],
): readonly PoiseRecoveredPoint[] {
  const points: PoiseRecoveredPoint[] = [];
  for (const entry of entries) {
    if (entry.event !== 'PoiseRecovered') continue;
    if (entry.data === undefined) {
      throw new Error(`receipt ${entry.sequence} 'PoiseRecovered' has no data`);
    }
    points.push({
      frame: entry.frame,
      time: entry.time,
      sequence: entry.sequence,
      poise: requireNumber(entry, entry.data, 'poise'),
    });
  }
  return points;
}
