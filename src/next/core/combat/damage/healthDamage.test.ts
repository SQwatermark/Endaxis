import { describe, expect, it } from 'vitest';
import type { CombatReceiptSink } from '../receipt/combatReceipt';
import { CombatClock } from '../runtime/combatClock';
import { CombatVitals } from '../runtime/combatVitals';
import type { PlayerActiveDamageResult } from './playerActiveDamage';
import { executeHealthDamage } from './healthDamage';

function createDamageResult(value: number): PlayerActiveDamageResult {
  return {
    value,
    isCritical: true,
    criticalMultiplier: 1.5,
    defenseMultiplier: 0.8,
    resistanceMultiplier: 0.9,
    weaknessShelterMultiplier: 1,
    runtimeExtensionMultiplier: 1,
    igniteMultiplier: 1,
    physicalInflictionMultiplier: 1,
  };
}

describe('executeHealthDamage', () => {
  it('records mutation between the recovered before and after events', () => {
    const order: string[] = [];
    const receipt: CombatReceiptSink = {
      record: entry => order.push(`receipt:${entry.event}`),
    };
    const target = new CombatVitals({
      health: 100,
      maxHealth: 100,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });

    const result = executeHealthDamage({
      sourceId: 'operator',
      targetId: 'enemy',
      damageType: 'electric',
      result: createDamageResult(120),
      target,
      clock: new CombatClock(),
      receipt,
      emitSourceEvent: event => order.push(`source:${event}`),
      emitTargetEvent: event => order.push(`target:${event}`),
    });

    expect(result).toEqual({
      requestedDamage: 120,
      actualDamage: 100,
      previousHealth: 100,
      currentHealth: 0,
    });
    expect(order).toEqual([
      'target:beforeTakeDamage',
      'source:beforeOutputDamage',
      'receipt:DamageApplied',
      'target:takeDamage',
      'source:outputDamage',
    ]);
  });
});
