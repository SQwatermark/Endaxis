/**
 * 由场景装配层创建本次模拟唯一的敌人生命账本。
 * 编译后的敌人静态程序是唯一输入；标准伤害环境、条件求值与结果收集都必须引用这里返回的同一实例，
 * 不得各自再造一份生命或失衡状态。
 */
import { COMBAT_FRAME_INTERVAL } from './combatClock';
import type { CombatEnemyProgram } from './combatRuntimeAssembly';
import { CombatVitals } from './combatVitals';

/** 从场景编译出的敌人静态程序创建敌人生命与失衡账本。 */
export function createEnemyCombatVitals(enemy: CombatEnemyProgram): CombatVitals {
  const singleNodeStagger = enemy.stagger.nodeCount === 1;
  return new CombatVitals({
    health: enemy.health,
    maxHealth: enemy.health,
    // 单节点失衡映射到 CombatVitals 账本，起始满值并随失衡伤害消耗；
    // 多节点失衡尚未接入单节点账本，保持无账本状态而不做近似塞入。
    maxPoise: singleNodeStagger ? enemy.stagger.maximum : 0,
    poise: singleNodeStagger ? enemy.stagger.maximum : 0,
    poiseRecoveryTime: enemy.stagger.brokenDurationFrames * COMBAT_FRAME_INTERVAL,
    poiseRecoveryTimeMultiplier: 1,
    poiseBrokenEndTime: 0,
    poiseImmune: false,
  });
}
