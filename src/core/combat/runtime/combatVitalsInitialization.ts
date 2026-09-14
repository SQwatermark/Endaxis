/** 从敌我配置快照校验并建立生命与失衡数据。 */
import type { CombatVitalsSnapshot } from './combatVitals';
import { createPeriodicTimerState, type CombatVitalsState } from '../state/environmentState';

export function createCombatVitalsState(snapshot: CombatVitalsSnapshot): CombatVitalsState {
  for (const [name, value] of Object.entries(snapshot)) {
    if (typeof value === 'number' && (!Number.isFinite(value) || value < 0))
      throw new RangeError(`${name} must be a non-negative finite number`);
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
