import { describe, expect, it, vi } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeSnapshot,
} from '../damage/damageScaleAttributes';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatVitals } from './combatVitals';
import { ActionBlackboard } from './actionBlackboard';
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

function createAttributeSnapshots(attack = 100, defense = 0, criticalRate = 0) {
  return {
    attacker: {
      ...scaleAttributes,
      attack,
      criticalRate,
      criticalDamageIncrease: 0.5,
      weaknessDamageMultiplier: 1,
      igniteDamageMultiplier: 1,
      physicalInflictionDamageMultiplier: 1,
    },
    defender: {
      ...scaleAttributes,
      defense,
      shelterDamageMultiplier: 0,
      breakingAttackDamageTakenMultiplier: 1,
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
      maxHealth: 1000,
      maxPoise: 100,
      poise: 100,
      poiseRecoveryTime: 1,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const receipt = new CombatReceiptCollector();
    const nextCriticalSample = vi.fn(() => 1);
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'perlica',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt,
      captureAttributeSnapshots: () => createAttributeSnapshots(),
      criticalSamples: { nextCriticalSample },
      resolveNonRandomRuntimeSnapshot: () => ({
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

    executor.execute(
      {
        ...DAMAGE_STEP,
        parameters: {
          ...DAMAGE_STEP.parameters,
          attackScale: { kind: 'blackboard', key: 'attackScale' },
          stagger: undefined,
        },
      },
      { blackboard: new ActionBlackboard({ attackScale: 1 }) },
    );
    expect(targetVitals.health).toBe(500);
    expect(nextCriticalSample).not.toHaveBeenCalled();
  });

  it('applies the physical infliction multiplier when the generated damage feature requires it', () => {
    const targetVitals = new CombatVitals({
      health: 1000,
      maxHealth: 1000,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const snapshots = createAttributeSnapshots(100);
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'antal',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      captureAttributeSnapshots: () => ({
        ...snapshots,
        attacker: {
          ...snapshots.attacker,
          physicalInflictionDamageMultiplier: 2,
        },
      }),
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      applyDamageModifiers: () => undefined,
      addInstantAttributeModifier: () => undefined,
      clearInstantAttributeModifiers: () => undefined,
      emitPreparationEvent: () => undefined,
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: () => undefined,
      emitHealthTargetEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    executor.execute({
      kind: 'dealDamage',
      parameters: {
        damageType: 'physical',
        attackScale: 1,
        tags: ['normalSkill'],
        features: ['physicalInfliction'],
      },
    });

    expect(targetVitals.health).toBe(800);
  });

  it('uses fixed damage as the calculation result while preserving the damage formula', () => {
    const targetVitals = new CombatVitals({
      health: 1000,
      maxHealth: 1000,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'rossi',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      captureAttributeSnapshots: () => createAttributeSnapshots(9999, 100),
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      applyDamageModifiers: (timing, side, context) => {
        if (timing === 'afterCalculation' && side === 'attacker') {
          context.multiplyCalculationValue(2);
        }
      },
      addInstantAttributeModifier: () => undefined,
      clearInstantAttributeModifiers: () => undefined,
      emitPreparationEvent: () => undefined,
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: () => undefined,
      emitHealthTargetEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    executor.execute({
      kind: 'dealFixedDamage',
      parameters: { damageType: 'physical', value: 100, tags: ['ultimateSkill'] },
    });

    expect(targetVitals.health).toBe(900);
  });

  it('executes a standalone stagger step without entering the health damage path', () => {
    const targetVitals = new CombatVitals({
      health: 1000,
      maxHealth: 1000,
      maxPoise: 100,
      poise: 100,
      poiseRecoveryTime: 1,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const receipt = new CombatReceiptCollector();
    const captureAttributeSnapshots = vi.fn();
    const emitPreparationEvent = vi.fn();
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'mifu',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt,
      captureAttributeSnapshots,
      criticalSamples: { nextCriticalSample: vi.fn() },
      resolveNonRandomRuntimeSnapshot: vi.fn(),
      applyDamageModifiers: vi.fn(),
      addInstantAttributeModifier: vi.fn(),
      clearInstantAttributeModifiers: vi.fn(),
      emitPreparationEvent,
      resolvePoiseMultipliers: () => ({ output: 1.5, taken: 2 }),
      emitHealthSourceEvent: vi.fn(),
      emitHealthTargetEvent: vi.fn(),
      emitPoiseSourceEvent: vi.fn(),
      emitPoiseTargetEvent: vi.fn(),
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    expect(executor.execute({ kind: 'dealStagger', parameters: { value: 20 } })).toBe(true);
    expect(targetVitals.health).toBe(1000);
    expect(targetVitals.poise).toBe(40);
    expect(captureAttributeSnapshots).not.toHaveBeenCalled();
    expect(emitPreparationEvent).not.toHaveBeenCalled();
    expect(receipt.entries.map(entry => entry.event)).toEqual(['PoiseApplied']);
  });

  it('resolves dynamic stagger from the current action blackboard', () => {
    const targetVitals = new CombatVitals({
      health: 1000,
      maxHealth: 1000,
      maxPoise: 100,
      poise: 100,
      poiseRecoveryTime: 1,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'mifu',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      captureAttributeSnapshots: vi.fn(),
      criticalSamples: { nextCriticalSample: vi.fn() },
      resolveNonRandomRuntimeSnapshot: vi.fn(),
      applyDamageModifiers: vi.fn(),
      addInstantAttributeModifier: vi.fn(),
      clearInstantAttributeModifiers: vi.fn(),
      emitPreparationEvent: vi.fn(),
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: vi.fn(),
      emitHealthTargetEvent: vi.fn(),
      emitPoiseSourceEvent: vi.fn(),
      emitPoiseTargetEvent: vi.fn(),
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    executor.execute(
      {
        kind: 'dealStagger',
        parameters: { value: { kind: 'blackboard', key: 'poise' } },
      },
      { blackboard: new ActionBlackboard({ poise: 25 }) },
    );

    expect(targetVitals.poise).toBe(75);
  });

  it('drives preparation events and both modifier stages before the formula', () => {
    const order: string[] = [];
    let attack = 100;
    let defense = 0;
    const targetVitals = new CombatVitals({
      health: 2000,
      maxHealth: 2000,
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
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
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

  it('uses the enemy and per-hit multipliers for breaking-attack base damage', () => {
    const targetVitals = new CombatVitals({
      health: 2000,
      maxHealth: 2000,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const snapshots = createAttributeSnapshots();
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'zhuang-fangyi',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      captureAttributeSnapshots: () => ({
        ...snapshots,
        defender: {
          ...snapshots.defender,
          breakingAttackDamageTakenMultiplier: 1.5,
        },
      }),
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      applyDamageModifiers: () => undefined,
      addInstantAttributeModifier: () => undefined,
      clearInstantAttributeModifiers: () => undefined,
      emitPreparationEvent: () => undefined,
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: () => undefined,
      emitHealthTargetEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    executor.execute({
      kind: 'dealDamage',
      parameters: {
        damageType: 'physical',
        attackScale: 4,
        calculation: 'breakingAttack',
        calculationMultiplier: 0.1,
        tags: ['normalAttack', 'powerAttack'],
      },
    });

    expect(targetVitals.health).toBeCloseTo(1940);
  });

  it('consumes one critical sample per HP unit only after the final critical-rate snapshot', () => {
    let criticalRate = 0;
    const nextCriticalSample = vi.fn(() => 0.5);
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'perlica',
      targetId: 'enemy',
      targetVitals: new CombatVitals({
        health: 10000,
        maxHealth: 10000,
        maxPoise: 100,
        poise: 100,
        poiseRecoveryTime: 1,
        poiseRecoveryTimeMultiplier: 1,
        poiseBrokenEndTime: 0,
        poiseImmune: false,
      }),
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      captureAttributeSnapshots: () => createAttributeSnapshots(100, 0, criticalRate),
      criticalSamples: { nextCriticalSample },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      applyDamageModifiers: timing => {
        if (timing === 'afterCalculation') criticalRate = 1;
      },
      addInstantAttributeModifier: () => undefined,
      clearInstantAttributeModifiers: () => undefined,
      emitPreparationEvent: () => undefined,
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: () => undefined,
      emitHealthTargetEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate: { execute: vi.fn(() => true), evaluate: vi.fn(() => false) },
    });

    executor.execute(DAMAGE_STEP);
    expect(nextCriticalSample).toHaveBeenCalledTimes(1);

    criticalRate = 0;
    executor.execute({
      ...DAMAGE_STEP,
      parameters: { ...DAMAGE_STEP.parameters, stagger: undefined },
    });
    expect(nextCriticalSample).toHaveBeenCalledTimes(2);
  });

  it('delegates operations outside the damage path', () => {
    const delegate = { execute: vi.fn(() => true), evaluate: vi.fn(() => false) };
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'perlica',
      targetId: 'enemy',
      targetVitals: new CombatVitals({
        health: 1,
        maxHealth: 1,
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
      criticalSamples: { nextCriticalSample: vi.fn() },
      resolveNonRandomRuntimeSnapshot: vi.fn(),
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
