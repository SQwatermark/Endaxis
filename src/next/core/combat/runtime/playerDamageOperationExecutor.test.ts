import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatVitals } from './combatVitals';
import { PlayerDamageOperationExecutor } from './playerDamageOperationExecutor';

const DAMAGE_STEP: Extract<ResolvedCombatStep, { kind: 'dealDamage' }> = {
  kind: 'dealDamage',
  parameters: {
    damageType: 'electric',
    attackScale: 4,
    tags: ['normalSkill'],
    stagger: 20,
  },
};

describe('PlayerDamageOperationExecutor', () => {
  it('applies standard health damage before the hit poise unit', () => {
    const targetVitals = new CombatVitals({
      health: 1000,
      maxPoise: 100,
      poise: 100,
      poiseRecoveryTime: 1,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const receipt = new CombatReceiptCollector();
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'perlica',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt,
      resolveSnapshots: () => ({
        attacker: {
          attack: 100,
          criticalRate: 0,
          criticalDamageIncrease: 0.5,
          weaknessDamageMultiplier: 1,
          igniteDamageMultiplier: 1,
          physicalInflictionDamageMultiplier: 1,
        },
        defender: {
          defense: 0,
          shelterDamageMultiplier: 0,
          resistances: {
            physical: { percent: 0, damageTakenMultiplier: 1 },
            heat: { percent: 0, damageTakenMultiplier: 1 },
            electric: { percent: 0, damageTakenMultiplier: 1 },
            cryo: { percent: 0, damageTakenMultiplier: 1 },
            nature: { percent: 0, damageTakenMultiplier: 1 },
            ether: { percent: 0, damageTakenMultiplier: 1 },
          },
        },
        runtime: {
          damageScaleMultiplier: 1,
          criticalSample: 1,
          runtimeExtensionMultiplier: 1,
          appliesIgniteDamageMultiplier: false,
          appliesPhysicalInflictionDamageMultiplier: false,
        },
      }),
      resolvePoiseMultipliers: () => ({ output: 1.5, taken: 2 }),
      emitHealthSourceEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    expect(executor.execute(DAMAGE_STEP)).toBe(true);
    expect(targetVitals.health).toBe(600);
    expect(targetVitals.poise).toBe(40);
    expect(receipt.entries.map(entry => entry.event)).toEqual(['DamageApplied', 'PoiseApplied']);
  });

  it('delegates operations outside the damage path', () => {
    const delegate = { execute: vi.fn(() => true), evaluate: vi.fn(() => false) };
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'perlica',
      targetId: 'enemy',
      targetVitals: new CombatVitals({
        health: 1,
        maxPoise: 0,
        poise: 0,
        poiseRecoveryTime: 0,
        poiseRecoveryTimeMultiplier: 1,
        poiseBrokenEndTime: 0,
        poiseImmune: false,
      }),
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      resolveSnapshots: vi.fn(),
      resolvePoiseMultipliers: vi.fn(),
      emitHealthSourceEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate,
    });
    const step: Exclude<ResolvedCombatStep, { kind: 'conditional' }> = {
      kind: 'applyElementalInfliction',
      parameters: { element: 'electric' },
    };

    expect(executor.execute(step)).toBe(true);
    expect(delegate.execute).toHaveBeenCalledWith(step);
  });
});
