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
import { deriveHitId } from '../timeline/deriveHitId';

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
      castId: 'cast:buff-source',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt,
      captureAttributeSnapshots: () => createAttributeSnapshots(),
      criticalSamples: { nextCriticalSample },
      attackDetail: {
        panelAttack: 100,
        operatorBaseAttack: 80,
        weaponBaseAttack: 20,
        attackPercent: 0,
        flatAttack: 0,
        mainAttribute: 'intellect',
        secondaryAttribute: 'will',
        attributes: { strength: 10, agility: 20, intellect: 30, will: 40 },
        coefficients: { strength: 0, agility: 0, intellect: 0.001, will: 0.0005 },
      },
      isCriticalForced: step => step.key === 'forced',
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

    const keyedDamageStep = { ...DAMAGE_STEP, key: 'buff-child-hit' };
    expect(executor.execute(keyedDamageStep)).toBe(true);
    expect(targetVitals.health).toBe(600);
    expect(targetVitals.poise).toBe(40);
    expect(healthEvents).toEqual([
      'target:beforeTakeDamage',
      'source:beforeOutputDamage',
      'target:takeDamage',
      'source:outputDamage',
    ]);
    expect(receipt.entries.map(entry => entry.event)).toEqual(['DamageApplied', 'PoiseApplied']);
    expect(receipt.entries[0]?.data).toMatchObject({
      castId: 'cast:buff-source',
      stepKey: 'buff-child-hit',
      hitId: deriveHitId('cast:buff-source', 'buff-child-hit'),
      attack: 100,
      attackDetailOperatorBase: 80,
      attackDetailWeaponBase: 20,
      attackDetailAttackPercent: 0,
      attackDetailFlatAttack: 0,
      attackDetailMainAttribute: 'intellect',
      attackDetailSecondaryAttribute: 'will',
      attackDetailIntellect: 30,
      attackDetailWill: 40,
      attackDetailIntellectCoefficient: 0.001,
      attackDetailWillCoefficient: 0.0005,
      baseDamage: 400,
      finalAttackValue: 400,
      standardCalculation: true,
      skillMultiplierPercent: 400,
      calculationMultiplier: 1,
      damageScaleMultiplier: 1,
      criticalRate: 0,
      criticalDamageIncrease: 0.5,
      nonCriticalDamage: 400,
      criticalDamage: 600,
      expectedDamage: 400,
      enemyDefense: 0,
      enemyResistancePercent: 0,
      damageTakenMultiplier: 1,
      weaknessDamageMultiplier: 1,
      shelterDamageMultiplier: 0,
    });

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

    executor.execute({
      ...DAMAGE_STEP,
      key: 'forced',
      parameters: { ...DAMAGE_STEP.parameters, attackScale: 1, stagger: undefined },
    });
    expect(targetVitals.health).toBe(350);
    expect(receipt.entries.at(-1)?.data).toMatchObject({
      value: 150,
      isCritical: true,
      expectedDamage: 100,
      criticalDamage: 150,
      nonCriticalDamage: 100,
    });
    expect(nextCriticalSample).not.toHaveBeenCalled();
  });

  it('does not publish a stale panel attack tree after runtime attack changes', () => {
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
    const receipt = new CombatReceiptCollector();
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'perlica',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt,
      captureAttributeSnapshots: () => createAttributeSnapshots(120),
      criticalSamples: { nextCriticalSample: () => 1 },
      attackDetail: {
        panelAttack: 100,
        operatorBaseAttack: 80,
        weaponBaseAttack: 20,
        attackPercent: 0,
        flatAttack: 0,
        mainAttribute: 'intellect',
        secondaryAttribute: 'will',
        attributes: { strength: 0, agility: 0, intellect: 0, will: 0 },
        coefficients: { strength: 0, agility: 0, intellect: 0.001, will: 0.0005 },
      },
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
      ...DAMAGE_STEP,
      parameters: { ...DAMAGE_STEP.parameters, attackScale: 1, stagger: undefined },
    });

    expect(receipt.entries[0]?.data?.attack).toBe(120);
    expect(receipt.entries[0]?.data?.attackDetailOperatorBase).toBeUndefined();
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

  it('uses a frozen source attribute for MultiplyAttributeCalculation damage', () => {
    const targetVitals = new CombatVitals({
      health: 5000,
      maxHealth: 5000,
      maxPoise: 100,
      poise: 100,
      poiseRecoveryTime: 1,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const snapshots = createAttributeSnapshots();
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'catcher',
      targetId: 'enemy',
      targetVitals,
      clock: new CombatClock(),
      receipt: new CombatReceiptCollector(),
      captureAttributeSnapshots: () => ({
        ...snapshots,
        attacker: { ...snapshots.attacker, calculationAttributeValue: 200 },
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
        calculation: 'attribute',
        calculationAttribute: 'Def',
        attackScale: 5,
        calculationAddition: 300,
        tags: [],
      },
    });

    expect(targetVitals.health).toBe(3700);
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
