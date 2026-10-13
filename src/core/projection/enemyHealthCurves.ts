/**
 * 把敌人生命日志整理成曲线：初始生命 + 伤害与治疗 = 一条折线。
 * 只按日志记录来；日志和曲线对不上就报错，绝不自己补数。
 */
import type { CombatReceiptEntry } from '../combat/receipt/combatReceipt';
import { projectEnemyHealthChangePoints } from './enemyHealthChangePoints';
import type { ResourceCurvePoint } from './resourceCurves';

/** 单场战斗中敌人的生命曲线。 */
export interface EnemyHealthCurve {
  readonly resource: 'enemyHealth';
  readonly maxValue: number;
  readonly points: readonly ResourceCurvePoint[];
}

/** 曲线初始生命；调用方必须传和这次模拟完全一致的敌人数值。 */
export interface EnemyHealthCurveInitial {
  readonly health: number;
  readonly maxHealth: number;
}

/** 从战斗回执按原始顺序生成敌人生命曲线。 */
export function projectEnemyHealthCurveFromReceipt(
  initial: EnemyHealthCurveInitial,
  entries: readonly CombatReceiptEntry[],
  initialFrame = 0,
): EnemyHealthCurve {
  const points: ResourceCurvePoint[] = [
    { frame: initialFrame, time: initialFrame / 30, sequence: null, value: initial.health },
  ];
  let currentValue = initial.health;
  for (const change of projectEnemyHealthChangePoints(entries)) {
    if (change.remainingHealth !== currentValue + change.healthChange) {
      throw new Error(
        `enemy health curve is discontinuous at receipt ${change.sequence}: expected ${currentValue + change.healthChange}, received ${change.remainingHealth}`,
      );
    }
    points.push({
      frame: change.frame,
      time: change.time,
      sequence: change.sequence,
      value: change.remainingHealth,
    });
    currentValue = change.remainingHealth;
  }
  return {
    resource: 'enemyHealth',
    maxValue: initial.maxHealth,
    points,
  };
}
