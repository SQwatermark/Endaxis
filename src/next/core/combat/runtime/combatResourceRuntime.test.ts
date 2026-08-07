import { describe, expect, it } from 'vitest';
import { CombatClock } from './combatClock';
import { CombatResourceRuntime } from './combatResourceRuntime';
import { CombatResources } from './combatResources';
import { CombatSimulation } from './combatSimulation';

describe('CombatResourceRuntime', () => {
  it('makes the frame recovery visible to later ability systems', () => {
    const resources = new CombatResources({
      sp: 99,
      maxSp: 300,
      returnedSp: 0,
      spRecovery: { valuePerSecond: 30, pauseDuration: 1, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
      squad: [],
    });
    const observedSp: number[] = [];
    const simulation = new CombatSimulation(new CombatClock());
    simulation.add(new CombatResourceRuntime(resources));
    simulation.add({ advanceFrame: () => observedSp.push(resources.sp) });

    simulation.advanceFrame();

    expect(observedSp).toEqual([100]);
  });
});
