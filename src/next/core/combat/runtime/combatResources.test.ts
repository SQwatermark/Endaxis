import { describe, expect, it } from 'vitest';
import { CombatResources } from './combatResources';
import { SharedSpGainModifier } from '../resources/sharedSpGainModifiers';

function createResources() {
  return new CombatResources({
    sp: 100,
    maxSp: 300,
    returnedSp: 10,
    sharedSpGain: { baseGainEfficiency: 1 },
    spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
    ultimateEnergySystemUnlocked: true,
    normalSkillUltimateEnergy: { selfGainPerSp: 0.1, otherGainPerSp: 0.2 },
    squad: [
      {
        operatorId: 'source',
        ultimateEnergy: 0,
        maxUltimateEnergy: 100,
        ultimateEnergyGainMultiplier: 1.5,
        canGainUntaggedUltimateEnergy: true,
      },
      {
        operatorId: 'other',
        ultimateEnergy: 0,
        maxUltimateEnergy: 100,
        ultimateEnergyGainMultiplier: 0.5,
        canGainUntaggedUltimateEnergy: true,
      },
    ],
  });
}

describe('CombatResources', () => {
  it('持有一次战斗唯一的共享 SP 效率注册表', () => {
    const resources = createResources();
    const modifier = new SharedSpGainModifier('powerAttackEfficiency', 'addition', 0.5, false);

    resources.sharedSpGainModifiers.add(modifier);

    expect(resources.sharedSpGainModifiers.resolve('powerAttack', 'gain').totalEfficiency).toBe(
      1.5,
    );
    expect(resources.sharedSpGainModifiers.remove(modifier)).toBe(true);
  });

  it('tracks only the applied part of a capped refund as returned SP', () => {
    const resources = createResources();

    expect(resources.gainSp(250, 'refund')).toEqual({
      baseValue: 250,
      requestedValue: 250,
      actualValue: 200,
      previousValue: 100,
      currentValue: 300,
      gainKind: 'refund',
    });
    expect(resources.returnedSp).toBe(210);

    expect(resources.pay('source', [{ resource: 'sp', value: 220 }])).toEqual({
      paid: true,
      nonReturnedSpCost: 10,
      changes: [
        {
          resource: 'sp',
          baseValue: -220,
          requestedValue: -220,
          actualValue: -220,
          previousValue: 300,
          currentValue: 80,
        },
      ],
    });
    expect(resources.returnedSp).toBe(0);
  });

  it('applies the registered shared SP efficiency before the shared cap', () => {
    const resources = createResources();
    resources.sharedSpGainModifiers.add(
      new SharedSpGainModifier('gainEfficiency', 'addition', 0.5, false),
    );
    resources.sharedSpGainModifiers.add(
      new SharedSpGainModifier('powerAttackEfficiency', 'multiplier', 0.5, false),
    );

    expect(resources.gainSp(20, 'gain', 'powerAttack')).toEqual({
      baseValue: 20,
      requestedValue: 45,
      actualValue: 45,
      previousValue: 100,
      currentValue: 145,
      gainKind: 'gain',
    });
  });

  it('tracks the native non-returned SP portion while paying the full cost', () => {
    const resources = createResources();

    expect(resources.pay('source', [{ resource: 'sp', value: 40 }])).toEqual({
      paid: true,
      nonReturnedSpCost: 30,
      changes: [
        {
          resource: 'sp',
          baseValue: -40,
          requestedValue: -40,
          actualValue: -40,
          previousValue: 100,
          currentValue: 60,
        },
      ],
    });
    expect(resources.sp).toBe(60);
    expect(resources.returnedSp).toBe(0);
  });

  it('pauses combat recovery for whole frames after paying SP', () => {
    const resources = createResources();

    expect(resources.pay('source', [{ resource: 'sp', value: 40 }]).paid).toBe(true);
    expect(resources.spRecoveryPauseRemaining).toBe(1);

    expect(resources.advanceInCombatSpRecovery(0.6).actualValue).toBe(0);
    expect(resources.advanceInCombatSpRecovery(0.5).actualValue).toBe(0);
    expect(resources.sp).toBe(60);
    expect(resources.spRecoveryPauseRemaining).toBeCloseTo(-0.1);

    expect(resources.advanceInCombatSpRecovery(0.5).actualValue).toBe(5);
    expect(resources.sp).toBe(65);
  });

  it('removes capped natural recovery overflow from the returned SP bucket', () => {
    const resources = createResources();
    resources.gainSp(200, 'refund');

    expect(resources.sp).toBe(300);
    expect(resources.returnedSp).toBe(210);
    expect(resources.advanceInCombatSpRecovery(0.5)).toMatchObject({
      requestedValue: 5,
      actualValue: 0,
      previousValue: 300,
      currentValue: 300,
    });
    expect(resources.returnedSp).toBe(205);
  });

  it('does not start the recovery pause when SP payment is rejected', () => {
    const resources = createResources();

    expect(resources.pay('source', [{ resource: 'sp', value: 200 }]).paid).toBe(false);
    expect(resources.spRecoveryPauseRemaining).toBe(0);
  });

  it('uses squad order, self/other settings, and each target gain multiplier', () => {
    const resources = createResources();
    const payment = resources.pay('source', [{ resource: 'sp', value: 40 }]);

    const changes = resources.gainSquadUltimateEnergyFromSkillCost(
      'source',
      payment.nonReturnedSpCost,
      1,
    );

    expect(changes.map(change => change.currentValue)).toEqual([4.5, 3]);
    expect(resources.getUltimateEnergy('source')).toBe(4.5);
    expect(resources.getUltimateEnergy('other')).toBe(3);
  });

  it('passes non-positive gains through without applying the gain multiplier', () => {
    const resources = createResources();

    const changes = resources.gainSquadUltimateEnergyFromSkillCost('source', 10, -0.5);

    expect(changes.map(change => change.requestedValue)).toEqual([-0.5, -1]);
    expect(changes.map(change => change.currentValue)).toEqual([0, 0]);
  });

  it('applies the unlock, gain-permission, maximum, and epsilon gates', () => {
    const resources = new CombatResources({
      sp: 100,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 1, otherGainPerSp: 1 },
      squad: [
        {
          operatorId: 'source',
          ultimateEnergy: 99,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          canGainUntaggedUltimateEnergy: true,
        },
        {
          operatorId: 'blocked',
          ultimateEnergy: 20,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          canGainUntaggedUltimateEnergy: false,
        },
      ],
    });

    const changes = resources.gainSquadUltimateEnergyFromSkillCost('source', 10, 1);

    expect(changes[0]).toMatchObject({ applied: true, actualValue: 1, currentValue: 100 });
    expect(changes[1]).toMatchObject({ applied: false, actualValue: 0, currentValue: 20 });
  });

  it('marks ultimate-energy cost as paid when the locked setter rejects the write', () => {
    const resources = new CombatResources({
      sp: 0,
      maxSp: 300,
      returnedSp: 0,
      sharedSpGain: { baseGainEfficiency: 1 },
      spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: false,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [
        {
          operatorId: 'source',
          ultimateEnergy: 80,
          maxUltimateEnergy: 100,
          ultimateEnergyGainMultiplier: 1,
          canGainUntaggedUltimateEnergy: true,
        },
      ],
    });

    expect(resources.pay('source', [{ resource: 'ultimateEnergy', value: 80 }])).toEqual({
      paid: true,
      nonReturnedSpCost: 0,
      changes: [
        {
          resource: 'ultimateEnergy',
          operatorId: 'source',
          baseValue: -80,
          requestedValue: -80,
          applied: false,
          actualValue: 0,
          previousValue: 80,
          currentValue: 80,
        },
      ],
    });
    expect(resources.getUltimateEnergy('source')).toBe(80);
  });
});
