import { describe, expect, it } from 'vitest';
import { perlica } from '../../../data/operators/perlica';
import { compileSkill } from '../../compiler/compileSkill';
import type { SkillDefinition } from '../../game-data/operatorDefinition';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { ActionBlackboard } from './actionBlackboard';
import { CombatClock } from './combatClock';
import { CombatResources } from './combatResources';
import { CombatSimulation } from './combatSimulation';
import { SkillResourceOperationExecutor } from './skillResourceOperationExecutor';
import { SkillRuntime, type CombatOperationExecutor } from './skillRuntime';

function findSkill(key: string): SkillDefinition {
  for (const group of perlica.skillGroups) {
    const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
    const skill = skills.find(candidate => candidate.key === key);
    if (skill !== undefined) return skill;
  }
  throw new Error(`missing Perlica skill '${key}'`);
}

describe('SkillResourceOperationExecutor', () => {
  it('applies caster ultimate-energy gain through the native gain multiplier and cap', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const resources = new CombatResources({
      sp: 0,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [
        {
          operatorId: 'perlica',
          ultimateEnergy: 90,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1.5,
          canGainUntaggedUltimateEnergy: true,
        },
      ],
    });
    const delegate: CombatOperationExecutor = {
      execute: () => false,
      evaluate: () => false,
    };
    const operations = new SkillResourceOperationExecutor({
      sourceOperatorId: 'perlica',
      skillId: 'comboSkill',
      clock,
      resources,
      receipt,
      getNonReturnedSpCost: () => 0,
      delegate,
    });

    expect(
      operations.execute({
        kind: 'changeResource',
        parameters: {
          resource: 'ultimateEnergy',
          amount: 10,
          recipient: 'caster',
        },
      }),
    ).toBe(true);

    expect(resources.getUltimateEnergy('perlica')).toBe(100);
    expect(receipt.entries).toHaveLength(1);
    expect(receipt.entries[0]).toMatchObject({
      frame: 0,
      time: 0,
      event: 'UltimateEnergyChanged',
      sourceId: 'perlica',
      targetId: 'perlica',
      data: {
        skillId: 'comboSkill',
        baseValue: 10,
        requestedValue: 15,
        applied: true,
        actualValue: 10,
        previousValue: 90,
        currentValue: 100,
      },
    });
  });

  it('records blocked caster ultimate-energy gain without changing the ledger', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const resources = new CombatResources({
      sp: 0,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [
        {
          operatorId: 'arcane',
          ultimateEnergy: 40,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 2,
          canGainUntaggedUltimateEnergy: false,
        },
      ],
    });
    const operations = new SkillResourceOperationExecutor({
      sourceOperatorId: 'arcane',
      skillId: 'comboSkill',
      clock,
      resources,
      receipt,
      getNonReturnedSpCost: () => 0,
      delegate: { execute: () => false, evaluate: () => false },
    });

    operations.execute({
      kind: 'changeResource',
      parameters: {
        resource: 'ultimateEnergy',
        amount: 10,
        recipient: 'caster',
      },
    });

    expect(resources.getUltimateEnergy('arcane')).toBe(40);
    expect(receipt.entries[0]).toMatchObject({
      event: 'UltimateEnergyChanged',
      targetId: 'arcane',
      data: {
        baseValue: 10,
        requestedValue: 20,
        applied: false,
        actualValue: 0,
        previousValue: 40,
        currentValue: 40,
      },
    });
  });

  it('records refunded team SP in the returned-SP bucket', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const resources = new CombatResources({
      sp: 280,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [
        {
          operatorId: 'arcane',
          ultimateEnergy: 0,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          canGainUntaggedUltimateEnergy: true,
        },
      ],
    });
    const delegatedKinds: string[] = [];
    const operations = new SkillResourceOperationExecutor({
      sourceOperatorId: 'arcane',
      skillId: 'comboSkill',
      clock,
      resources,
      receipt,
      getNonReturnedSpCost: () => 0,
      delegate: {
        execute: step => {
          delegatedKinds.push(step.kind);
          return true;
        },
        evaluate: () => true,
      },
    });

    expect(
      operations.execute({
        kind: 'changeResource',
        parameters: {
          resource: 'sp',
          amount: 30,
          recipient: 'team',
          spGainKind: 'refund',
        },
      }),
    ).toBe(true);

    expect(resources.sp).toBe(300);
    expect(resources.returnedSp).toBe(20);
    expect(delegatedKinds).toEqual([]);
    expect(receipt.entries[0]).toMatchObject({
      event: 'SpChanged',
      sourceId: 'arcane',
      data: {
        skillId: 'comboSkill',
        requestedValue: 30,
        actualValue: 20,
        previousValue: 280,
        currentValue: 300,
        gainKind: 'refund',
      },
    });
  });

  it('resolves a dynamic resource amount from the current action blackboard', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const resources = new CombatResources({
      sp: 250,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 0, pauseDuration: 0, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [
        {
          operatorId: 'zhuang-fangyi',
          ultimateEnergy: 0,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          canGainUntaggedUltimateEnergy: true,
        },
      ],
    });
    const operations = new SkillResourceOperationExecutor({
      sourceOperatorId: 'zhuang-fangyi',
      skillId: 'battleSkill',
      clock,
      resources,
      receipt,
      getNonReturnedSpCost: () => 0,
      delegate: { execute: () => false, evaluate: () => false },
    });

    expect(
      operations.execute(
        {
          kind: 'changeResourceByActionValue',
          parameters: {
            resource: 'sp',
            amount: { kind: 'blackboard', key: 'atbReturn' },
            coefficient: 0.5,
            recipient: 'team',
            spGainKind: 'refund',
            spGainSource: 'default',
          },
        },
        { blackboard: new ActionBlackboard({ atbReturn: 30 }) },
      ),
    ).toBe(true);

    expect(resources.sp).toBe(265);
    expect(resources.returnedSp).toBe(15);
    expect(receipt.entries[0]).toMatchObject({
      event: 'SpChanged',
      data: { baseValue: 15, gainKind: 'refund' },
    });
  });

  it('carries a Perlica cast cost into ordered squad ultimate-energy changes', () => {
    const clock = new CombatClock();
    const receipt = new CombatReceiptCollector();
    const resources = new CombatResources({
      sp: 100,
      maxSp: 300,
      returnedSp: 10,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.1, otherGainPerSp: 0.2 },
      squad: [
        {
          operatorId: 'perlica',
          ultimateEnergy: 0,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1.5,
          canGainUntaggedUltimateEnergy: true,
        },
        {
          operatorId: 'ally',
          ultimateEnergy: 0,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 0.5,
          canGainUntaggedUltimateEnergy: true,
        },
      ],
    });
    const delegatedKinds: string[] = [];
    const delegate: CombatOperationExecutor = {
      execute: step => {
        delegatedKinds.push(step.kind);
        return true;
      },
      evaluate: () => true,
    };
    let runtime: SkillRuntime;
    const operations = new SkillResourceOperationExecutor({
      sourceOperatorId: 'perlica',
      skillId: 'battleSkill',
      clock,
      resources,
      receipt,
      getNonReturnedSpCost: () => runtime.nonReturnedSpCost,
      delegate,
    });
    runtime = new SkillRuntime(
      compileSkill({
        operatorId: 'perlica',
        skillGroupKey: 'battleSkill',
        skillType: 'battleSkill',
        skillLevel: 12,
        skill: findSkill('battleSkill'),
      }),
      { clock, resources, receipt, operations, allocateSkillCastId: () => 1 },
    );
    const simulation = new CombatSimulation(clock);
    simulation.add(runtime);

    expect(runtime.tryStart()).toBe(true);
    simulation.advanceFrames(13);

    expect(runtime.nonReturnedSpCost).toBe(90);
    expect(delegatedKinds).toEqual(['applyElementalInfliction', 'dealDamage']);
    expect(resources.getUltimateEnergy('perlica')).toBe(13.5);
    expect(resources.getUltimateEnergy('ally')).toBe(9);
    expect(
      receipt.entries
        .filter(entry => entry.event === 'UltimateEnergyChanged')
        .map(entry => ({ targetId: entry.targetId, data: entry.data })),
    ).toEqual([
      {
        targetId: 'perlica',
        data: {
          skillId: 'battleSkill',
          recipient: 'operator',
          baseValue: 9,
          requestedValue: 13.5,
          applied: true,
          actualValue: 13.5,
          previousValue: 0,
          currentValue: 13.5,
        },
      },
      {
        targetId: 'ally',
        data: {
          skillId: 'battleSkill',
          recipient: 'operator',
          baseValue: 18,
          requestedValue: 9,
          applied: true,
          actualValue: 9,
          previousValue: 0,
          currentValue: 9,
        },
      },
    ]);
  });
});
