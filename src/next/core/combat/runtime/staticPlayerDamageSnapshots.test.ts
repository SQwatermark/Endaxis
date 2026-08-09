import { describe, expect, it } from 'vitest';
import type { ResolvedCombatStep } from '../../compiler/combatProgram';
import type { ResolvedOperatorPanel } from '../../compiler/resolveOperatorPanel';
import { CombatClock } from './combatClock';
import { CombatResources } from './combatResources';
import type { CombatEnemyProgram, CombatOperationExecutorContext } from './combatRuntimeAssembly';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatVitals } from './combatVitals';
import { PlayerDamageOperationExecutor } from './playerDamageOperationExecutor';
import type { CombatOperationExecutor } from './skillRuntime';
import { resolveStaticPlayerDamageSnapshots } from './staticPlayerDamageSnapshots';

const enemy: CombatEnemyProgram = {
  source: { kind: 'custom', level: 90 },
  health: 100000,
  superArmor: 0,
  defenderAttributes: {
    defense: 200,
    shelterDamageMultiplier: 0,
    breakingAttackDamageTakenMultiplier: 1.5,
    resistances: {
      physical: { percent: 0, damageTakenMultiplier: 1 },
      heat: { percent: 0, damageTakenMultiplier: 1 },
      electric: { percent: 20, damageTakenMultiplier: 1 },
      cryo: { percent: 0, damageTakenMultiplier: 1 },
      nature: { percent: 0, damageTakenMultiplier: 1 },
      ether: { percent: 0, damageTakenMultiplier: 1 },
    },
  },
  stagger: {
    maximum: 300,
    nodeCount: 1,
    nodeDurationFrames: 60,
    brokenDurationFrames: 300,
    finisherRecovery: 100,
  },
};

const panel: ResolvedOperatorPanel = {
  operatorId: 'operator',
  attributes: { strength: 0, agility: 0, intellect: 0, will: 0 },
  attack: 700,
  health: 5000,
  defense: 0,
  criticalRate: 0.15,
  criticalDamage: 0.6,
  artsIntensity: 0,
  ultimateEnergyGainEfficiency: 1,
  skillCooldownReduction: 0,
  staggerDamagePercent: 0,
  combatModifiers: [
    { kind: 'damageBonus', damageTypes: 'electric', skillTypes: 'battleSkill', value: 0.2 },
    { kind: 'damageBonus', damageTypes: 'heat', value: 0.5 },
  ],
  receipt: [],
};

function createContext(overrides: Partial<CombatOperationExecutorContext> = {}) {
  return {
    program: {
      operatorId: 'operator',
      skillGroupKey: 'battleSkill',
      skillId: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 1,
      initialBlackboard: {},
      timelineBlockFrames: 1,
      costFrame: 0,
      costs: [],
      timelineActions: [],
    },
    enemy,
    panel,
    equipmentContributions: [],
    clock: new CombatClock(),
    resources: new CombatResources({
      sp: 0,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: false,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [],
    }),
    receipt: new CombatReceiptCollector(),
    ...overrides,
  } satisfies CombatOperationExecutorContext;
}

const electricDamage: Extract<ResolvedCombatStep, { kind: 'dealDamage' }> = {
  kind: 'dealDamage',
  parameters: { damageType: 'electric', attackScale: 1, tags: ['normalSkill'] },
};

describe('resolveStaticPlayerDamageSnapshots', () => {
  it('从同一构筑面板和敌人程序冻结基础攻防属性', () => {
    const snapshots = resolveStaticPlayerDamageSnapshots(createContext(), electricDamage);

    expect(snapshots.attacker).toMatchObject({
      attack: 700,
      criticalRate: 0.15,
      criticalDamageIncrease: 0.6,
      electricDamageIncrease: 0.2,
    });
    expect(snapshots.defender).toMatchObject({
      defense: 200,
      breakingAttackDamageTakenMultiplier: 1.5,
      resistances: { electric: { percent: 20, damageTakenMultiplier: 1 } },
    });
  });

  it('按伤害类型和技能类型筛选静态伤害加成', () => {
    const snapshots = resolveStaticPlayerDamageSnapshots(
      createContext({
        program: { ...createContext().program, skillType: 'comboSkill' },
      }),
      electricDamage,
    );

    expect(snapshots.attacker.electricDamageIncrease).toBe(0);
    expect(snapshots.attacker.heatDamageIncrease).toBe(0);
  });

  it('按原生属性身份冻结潜能的技能分类与伤害类型增伤', () => {
    const snapshots = resolveStaticPlayerDamageSnapshots(
      createContext({
        panel: {
          ...panel,
          combatModifiers: [
            { kind: 'staticDamageIncrease', target: 'normalAttack', value: 0.15 },
            { kind: 'staticDamageIncrease', target: 'battleSkill', value: 0.16 },
            { kind: 'staticDamageIncrease', target: 'physical', value: 0.08 },
            { kind: 'staticDamageIncrease', target: 'electric', value: 0.09 },
            { kind: 'staticDamageIncrease', target: 'cryo', value: 0.1 },
          ],
        },
      }),
      electricDamage,
    );

    expect(snapshots.attacker).toMatchObject({
      normalAttackDamageIncrease: 0.15,
      normalSkillDamageIncrease: 0.16,
      physicalDamageIncrease: 0.08,
      electricDamageIncrease: 0.09,
      cryoDamageIncrease: 0.1,
    });
  });

  it('缺少已解析面板时明确失败', () => {
    expect(() =>
      resolveStaticPlayerDamageSnapshots(createContext({ panel: undefined }), electricDamage),
    ).toThrow("operator 'operator' has no resolved panel");
  });

  it('可直接为标准伤害执行器提供同源静态快照', () => {
    const context = createContext();
    const targetVitals = new CombatVitals({
      health: 10000,
      maxHealth: 10000,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    });
    const delegate: CombatOperationExecutor = {
      execute: () => false,
      evaluate: () => false,
    };
    const executor = new PlayerDamageOperationExecutor({
      sourceOperatorId: context.program.operatorId,
      targetId: 'enemy',
      targetVitals,
      clock: context.clock,
      receipt: context.receipt,
      captureAttributeSnapshots: step => resolveStaticPlayerDamageSnapshots(context, step),
      criticalSamples: { nextCriticalSample: () => 1 },
      resolveNonRandomRuntimeSnapshot: () => ({
        runtimeExtensionMultiplier: 1,
        appliesIgniteDamageMultiplier: false,
        appliesPhysicalInflictionDamageMultiplier: false,
      }),
      applyDamageModifiers: () => undefined,
      clearInstantAttributeModifiers: () => undefined,
      addInstantAttributeModifier: () => undefined,
      emitPreparationEvent: () => undefined,
      resolvePoiseMultipliers: () => ({ output: 1, taken: 1 }),
      emitHealthSourceEvent: () => undefined,
      emitHealthTargetEvent: () => undefined,
      emitPoiseSourceEvent: () => undefined,
      emitPoiseTargetEvent: () => undefined,
      delegate,
    });

    expect(executor.execute(electricDamage)).toBe(true);
    expect(targetVitals.health).toBe(9776);
    expect((context.receipt as CombatReceiptCollector).entries.at(-1)).toMatchObject({
      event: 'DamageApplied',
      data: {
        value: 224,
        defenseMultiplier: 1 / 3,
        resistanceMultiplier: 0.8,
      },
    });
  });
});
