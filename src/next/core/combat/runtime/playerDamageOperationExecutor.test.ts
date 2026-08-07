import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeSnapshot,
} from '../damage/damageScaleAttributes';
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

const scaleAttributes = Object.fromEntries(
  DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [key, 0]),
) as unknown as DamageScaleAttributeSnapshot;

function createAttributeSnapshots(attack = 100, defense = 0) {
  return {
    attacker: {
      ...scaleAttributes,
      attack,
      criticalRate: 0,
      criticalDamageIncrease: 0.5,
      weaknessDamageMultiplier: 1,
      igniteDamageMultiplier: 1,
      physicalInflictionDamageMultiplier: 1,
    },
    defender: {
      ...scaleAttributes,
      defense,
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
  } as const;
}

describe('PlayerDamageOperationExecutor', () => {
  it('applies standard health damage before the hit poise unit', () => {
    const healthEvents: string[] = [];
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
      captureAttributeSnapshots: () => createAttributeSnapshots(),
      resolveRuntimeSnapshot: () => ({
        criticalSample: 1,
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      applyDamageModifiers: () => undefined,
      addInstantAttributeModifier: () => undefined,
      clearInstantAttributeModifiers: () => undefined,
      emitPreparationEvent: () => undefined,
      resolvePoiseMultipliers: () => ({ output: 1.5, taken: 2 }),
      emitHealthSourceEvent: event => healthEvents.push(`source:${event}`),
      emitHealthTargetEvent: event => healthEvents.push(`target:${event}`),
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    expect(executor.execute(DAMAGE_STEP)).toBe(true);
    expect(targetVitals.health).toBe(600);
    expect(targetVitals.poise).toBe(40);
    expect(healthEvents).toEqual([
      'target:beforeTakeDamage',
      'source:beforeOutputDamage',
      'target:takeDamage',
      'source:outputDamage',
    ]);
    expect(receipt.entries.map(entry => entry.event)).toEqual(['DamageApplied', 'PoiseApplied']);
  });

  it('drives preparation events and both modifier stages before the formula', () => {
    const order: string[] = [];
    let attack = 100;
    let defense = 0;
    const targetVitals = new CombatVitals({
      health: 2000,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'perlica',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      captureAttributeSnapshots: () => {
        order.push('capture');
        return createAttributeSnapshots(attack, defense);
      },
      resolveRuntimeSnapshot: () => ({
        criticalSample: 1,
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      applyDamageModifiers: (timing, side, context) => {
        order.push(`${timing}:${side}`);
        if (timing === 'beforeCalculation' && side === 'attacker') {
          attack = 120;
          context.multiplyCalculationValue(1.5);
        }
        if (timing === 'afterCalculation' && side === 'attacker') {
          context.multiplyCalculationValue(2);
          context.damageScales.modify('attacker', 'product', 0.25);
        }
        if (timing === 'afterCalculation' && side === 'defender') defense = 100;
      },
      addInstantAttributeModifier: () => undefined,
      clearInstantAttributeModifiers: side => order.push(`clear:${side}`),
      emitPreparationEvent: event => order.push(event),
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: () => undefined,
      emitHealthTargetEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    executor.execute({
      ...DAMAGE_STEP,
      parameters: { ...DAMAGE_STEP.parameters, stagger: undefined },
    });

    // 先计算 120 * 4 * 1.5 * 2 * 1.25，再由 100 点防御将结果减半。
    expect(targetVitals.health).toBe(1100);
    expect(order).toEqual([
      'capture',
      'beforeDamageAction',
      'beforeCalculateDamage',
      'beforeCalculation:attacker',
      'beforeCalculation:defender',
      'capture',
      'clear:attacker',
      'clear:defender',
      'afterCalculation:attacker',
      'afterCalculation:defender',
      'capture',
      'clear:attacker',
      'clear:defender',
    ]);
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
      captureAttributeSnapshots: vi.fn(),
      resolveRuntimeSnapshot: vi.fn(),
      applyDamageModifiers: vi.fn(),
      addInstantAttributeModifier: vi.fn(),
      clearInstantAttributeModifiers: vi.fn(),
      emitPreparationEvent: vi.fn(),
      resolvePoiseMultipliers: vi.fn(),
      emitHealthSourceEvent: () => undefined,
      emitHealthTargetEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate,
    });
    const step: Exclude<ResolvedCombatStep, { kind: 'conditional' }> = {
      kind: 'applyElementalInfliction',
      parameters: { element: 'electric', isExtra: false },
    };

    expect(executor.execute(step)).toBe(true);
    expect(delegate.execute).toHaveBeenCalledWith(step);
  });
});
