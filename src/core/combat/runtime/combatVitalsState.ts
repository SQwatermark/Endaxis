/** 实体生命、失衡与两个恢复计时器的数据；生命下限句柄也随同保存。 */
import type { CombatVitalsSnapshot } from './combatVitals';
import { createPeriodicTimerState, type PeriodicTimerState } from './periodicTimerState';

export interface CombatVitalsState {
  health: number;
  poise: number;
  poiseImmune: boolean;
  stopPoiseRecovery: boolean;
  hasPoiseBrokenTag: boolean;
  readonly maxHealth: number;
  readonly maxPoise: number;
  readonly poiseRecoveryTime: number;
  readonly poiseRecoveryTimeMultiplier: number;
  readonly poiseBrokenEndTime: number;
  readonly poiseRecoveryTimer: PeriodicTimerState;
  readonly poiseBrokenEndTimer: PeriodicTimerState;
  readonly healthFloors: Map<number, number>;
  nextHealthFloorId: number;
}

export function createCombatVitalsState(snapshot: CombatVitalsSnapshot): CombatVitalsState {
  for (const [name, value] of Object.entries(snapshot)) {
    if (typeof value === 'number' && (!Number.isFinite(value) || value < 0)) {
      throw new RangeError(`${name} must be a non-negative finite number`);
    }
  }
  if (snapshot.poise > snapshot.maxPoise + 0.00001) throw new RangeError('poise exceeds maxPoise');
  if (snapshot.maxHealth <= 0) throw new RangeError('maxHealth must be positive');
  if (snapshot.health > snapshot.maxHealth) throw new RangeError('health exceeds maxHealth');
  return {
    health: snapshot.health,
    poise: snapshot.poise,
    poiseImmune: snapshot.poiseImmune,
    maxHealth: snapshot.maxHealth,
    maxPoise: snapshot.maxPoise,
    poiseRecoveryTime: snapshot.poiseRecoveryTime,
    poiseRecoveryTimeMultiplier: snapshot.poiseRecoveryTimeMultiplier,
    poiseBrokenEndTime: snapshot.poiseBrokenEndTime,
    stopPoiseRecovery: false,
    hasPoiseBrokenTag: false,
    poiseRecoveryTimer: createPeriodicTimerState(),
    poiseBrokenEndTimer: createPeriodicTimerState(),
    healthFloors: new Map(),
    nextHealthFloorId: 1,
  };
}
