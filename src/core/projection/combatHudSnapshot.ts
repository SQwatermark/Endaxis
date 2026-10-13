/**
 * 把已经完成的战斗投影采样为某一帧的 HUD 快照。
 *
 * 本模块不读取运行时对象，也不重算战斗结果。曲线提供数值，回执提供离散状态；
 * 同帧事实严格按 sequence 顺序处理。
 */
import type { CombatReceiptEntry, CombatReceiptValue } from '../combat/receipt/combatReceipt';
import type { EnemyHealthCurve } from './enemyHealthCurves';
import type { PoiseCurve } from './poiseCurves';
import type { CombatResourceCurves } from './resourceCurves';
import { sampleStepCurve } from './curveSampling';
export interface CombatHudGaugeSnapshot {
  readonly current: number | null;
  readonly maximum: number;
  readonly ratio: number | null;
}

export type EnemyPoiseHudState = 'normal' | 'recovering' | 'brokenEndWindow';

export interface EnemyCombatHudSnapshot {
  readonly health: CombatHudGaugeSnapshot;
  readonly poise: (CombatHudGaugeSnapshot & { readonly state: EnemyPoiseHudState }) | null;
}

export interface OperatorCombatHudSnapshot {
  readonly operatorId: string;
  readonly ultimateEnergy: CombatHudGaugeSnapshot;
}

export interface CombatHudSnapshot {
  readonly frame: number;
  readonly sp: CombatHudGaugeSnapshot;
  readonly enemy: EnemyCombatHudSnapshot;
  readonly operators: readonly OperatorCombatHudSnapshot[];
}

export interface CombatHudSnapshotInput {
  readonly frame: number;
  readonly endFrame: number;
  readonly enemyHealthCurve: EnemyHealthCurve;
  readonly poiseCurve: PoiseCurve;
  readonly resourceCurves: CombatResourceCurves;
  readonly receiptEntries: readonly CombatReceiptEntry[];
}

function gauge(
  points: Parameters<typeof sampleStepCurve>[0],
  maximum: number,
  frame: number,
): CombatHudGaugeSnapshot {
  const current = sampleStepCurve(points, frame).value;
  return {
    current,
    maximum,
    ratio: current === null || maximum <= 0 ? null : Math.min(1, Math.max(0, current / maximum)),
  };
}

function booleanData(
  data: Readonly<Record<string, CombatReceiptValue>> | undefined,
  key: string,
): boolean | undefined {
  const value = data?.[key];
  return typeof value === 'boolean' ? value : undefined;
}

function enemyPoiseState(
  entries: readonly CombatReceiptEntry[],
  frame: number,
): EnemyPoiseHudState {
  let recovering = false;
  let brokenTag = false;
  for (const entry of entries) {
    if (entry.frame > frame) break;
    if (entry.event === 'PoiseApplied') {
      if (booleanData(entry.data, 'brokePoise') === true) recovering = true;
      brokenTag = booleanData(entry.data, 'hasPoiseBrokenTag') ?? brokenTag;
      continue;
    }
    if (entry.event === 'PoiseRecovered') {
      recovering = false;
      brokenTag = booleanData(entry.data, 'hasPoiseBrokenTag') ?? brokenTag;
      continue;
    }
    if (entry.event === 'PoiseBrokenTagEnded') {
      brokenTag = booleanData(entry.data, 'hasPoiseBrokenTag') ?? false;
    }
  }
  return recovering ? 'recovering' : brokenTag ? 'brokenEndWindow' : 'normal';
}

/** 在现实时间轴帧上采样一次只读 HUD 快照。 */
export function projectCombatHudSnapshot(input: CombatHudSnapshotInput): CombatHudSnapshot {
  if (!Number.isInteger(input.frame)) {
    throw new RangeError('HUD snapshot frame must be an integer');
  }
  if (!Number.isInteger(input.endFrame) || input.endFrame < input.frame) {
    throw new RangeError('HUD snapshot endFrame must be an integer not before frame');
  }
  return {
    frame: input.frame,
    sp: gauge(input.resourceCurves.sp.points, input.resourceCurves.sp.maxValue, input.frame),
    enemy: {
      health: gauge(input.enemyHealthCurve.points, input.enemyHealthCurve.maxValue, input.frame),
      poise:
        input.poiseCurve.maxValue <= 0
          ? null
          : {
              ...gauge(input.poiseCurve.points, input.poiseCurve.maxValue, input.frame),
              state: enemyPoiseState(input.receiptEntries, input.frame),
            },
    },
    operators: input.resourceCurves.ultimateEnergy.map(curve => ({
      operatorId: curve.operatorId,
      ultimateEnergy: gauge(curve.points, curve.maxValue, input.frame),
    })),
  };
}
