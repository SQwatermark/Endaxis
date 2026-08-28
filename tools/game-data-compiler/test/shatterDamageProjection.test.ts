import { describe, expect, it, vi } from 'vitest';
import fixture from './fixtures/avywenna-return-damage.json';
import { scalarFixture, targetFixture } from './sourceFixtures.ts';
import { parseDamageActionSource } from '../src/source/damageActions.ts';
import { compileEventTargetSimpleDamageOperationSource } from '../src/compiler/simpleDamageOperation.ts';
import { compileActionSequence } from '../../../src/next/core/compiler/compileSkill';
import { CombatActionSequenceRuntime } from '../../../src/next/core/combat/runtime/combatActionSequenceRuntime';
import { PlayerDamageOperationExecutor } from '../../../src/next/core/combat/runtime/playerDamageOperationExecutor';
import { CombatClock } from '../../../src/next/core/combat/runtime/combatClock';
import { CombatVitals } from '../../../src/next/core/combat/runtime/combatVitals';
import { CombatReceiptCollector } from '../../../src/next/core/combat/receipt/combatReceipt';
import { ActionBlackboard } from '../../../src/next/core/combat/runtime/actionBlackboard';
import {
  DAMAGE_SCALE_ATTRIBUTE_KEYS,
  type DamageScaleAttributeSnapshot,
} from '../../../src/next/core/combat/damage/damageScaleAttributes';

function project(mask = 134217728) {
  const raw = structuredClone(fixture[0]!.branch.failActions.actionData[0]!);
  // 复用已核对的原生 DamageAction 形状，改变被测语义字段；不是另一份生产 Shatter 定义。
  const source = parseDamageActionSource(
    {
      ...raw,
      attacker: 'ActionSource',
      targetSettings: targetFixture('Owner'),
      effectSource: targetFixture('Owner'),
      damageUnits: [
        {
          ...raw.damageUnits[0]!,
          damageType: 'Physical',
          damageDecorateMask: mask,
          simpleCalculation: false,
          takeAtkSnapshot: false,
          atkCalculation: {
            $type: 'Beyond.Gameplay.Core.AtkScaleCalculation, Gameplay.Beyond',
            atkScale: scalarFixture(0, 'atk_scale'),
          },
          damageProcessors: [],
        },
      ],
    },
    'shatter.damage',
    {},
  );
  return compileEventTargetSimpleDamageOperationSource(source, 'shatter.damage', {
    actionOwnerTarget: 'buffOwner',
    actionSourceTarget: 'caster',
    fixedBuffOwnerTarget: 'enemy',
  });
}

describe('Shatter 公共生成到伤害执行', () => {
  it('保留物理类型、运行时倍率、结晶异常分类和独立特征', () => {
    expect(project()).toEqual({
      kind: 'dealDamage',
      parameters: {
        damageType: 'physical',
        attackScale: { kind: 'blackboard', key: 'atk_scale' },
        tags: ['cryoAbnormal'],
        features: ['shatter'],
      },
    });
  });

  it('与击倒独立组合，不把 Shatter 本身误归入 PhysicalInfliction', () => {
    expect(project(134217728 + 65536).parameters.features).toEqual([
      'knockDown',
      'physicalInfliction',
      'shatter',
    ]);
    expect(project().parameters.features).not.toContain('physicalInfliction');
  });

  it.each([134217728 + 2, 134217728 + 2 ** 40])('仍拒绝未知位 %s', mask => {
    expect(() => project(mask)).toThrow('unsupported event damage decorate mask');
  });

  it.each([false, true])('实际执行：普通暴击=%s，物理与结晶属性各取正确乘区', critical => {
    const scales = Object.fromEntries(
      DAMAGE_SCALE_ATTRIBUTE_KEYS.map(key => [key, 0]),
    ) as DamageScaleAttributeSnapshot;
    const vitals = new CombatVitals({
      health: 10000,
      maxHealth: 10000,
      poise: 0,
      maxPoise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const receipt = new CombatReceiptCollector();
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: 'caster',
      targetId: 'enemy',
      targetVitals: vitals,
      clock: new CombatClock(),
      receipt,
      captureAttributeSnapshots: () => ({
        attacker: {
          ...scales,
          attack: 100,
          criticalRate: critical ? 1 : 0,
          criticalDamageIncrease: 0.5,
          weaknessDamageMultiplier: 1,
          igniteDamageMultiplier: 2,
          physicalInflictionDamageMultiplier: 7,
          physicalDamageIncrease: 0.2,
          cryoDamageIncrease: 9,
          cryoAbnormalDamageIncrease: 0.5,
          physicalEnhancedDamageIncrease: 0.25,
          cryoEnhancedDamageIncrease: 9,
        },
        defender: {
          ...scales,
          defense: 0,
          shelterDamageMultiplier: 0,
          breakingAttackDamageTakenMultiplier: 1,
          physicalVulnerabilityIncrease: 0.4,
          cryoVulnerabilityIncrease: 9,
          resistances: {
            physical: { percent: 0, damageTakenMultiplier: 1 },
            heat: { percent: 0, damageTakenMultiplier: 1 },
            electric: { percent: 0, damageTakenMultiplier: 1 },
            cryo: { percent: 90, damageTakenMultiplier: 1 },
            nature: { percent: 0, damageTakenMultiplier: 1 },
            ether: { percent: 0, damageTakenMultiplier: 1 },
          },
        },
      }),
      criticalSamples: { nextCriticalSample: () => 0 },
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
    const blackboard = new ActionBlackboard({ atk_scale: 1 });
    const runtime = new CombatActionSequenceRuntime(executor, { blackboard });
    const sequence = runtime.createSequence(compileActionSequence({ steps: [project()] }, 1));
    sequence.executeInstant({});
    // 100 * 1 * 物理普通1.2 * 晶异常1.5 * 物理增幅1.25 * 物理脆弱1.4 * Ignite2。
    const expected = 630 * (critical ? 1.5 : 1);
    expect(10000 - vitals.health).toBeCloseTo(expected);
    expect(receipt.entries.find(entry => entry.event === 'DamageApplied')?.data).toMatchObject({
      igniteMultiplier: 2,
      physicalInflictionMultiplier: 1,
    });
    blackboard.assignDynamic('atk_scale', 2);
    sequence.executeInstant({});
    expect(10000 - vitals.health).toBeCloseTo(expected * 3);
  });
});
