import { describe, expect, it, vi } from 'vitest';
import { perlica } from '../../../data/operators/perlica';
import type { SkillDefinition } from '../../game-data/operatorDefinition';
import { compileSkill } from '../../compiler/compileSkill';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { CombatClock } from './combatClock';
import { CombatResources } from './combatResources';
import { CombatSimulation } from './combatSimulation';
import { SkillRuntime, type CombatOperationExecutor } from './skillRuntime';

function findPerlicaSkill(key: string): SkillDefinition {
  for (const group of perlica.skillGroups) {
    const skills = Array.isArray(group.skills) ? group.skills : [group.skills];
    const skill = skills.find(candidate => candidate.key === key);
    if (skill !== undefined) return skill;
  }
  throw new Error(`missing Perlica skill '${key}'`);
}

function createBattleSkillRuntime(initialSp: number) {
  const clock = new CombatClock();
  const resources = new CombatResources({
    sp: initialSp,
    maxSp: 300,
    returnedSp: 0,
    spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
    ultimateEnergySystemUnlocked: true,
    normalSkillUltimateEnergy: { selfGainPerSp: 0.1, otherGainPerSp: 0.2 },
    squad: [
      {
        operatorId: 'perlica',
        ultimateEnergy: 0,
        maxUltimateEnergy: 100,
        ultimateEnergyGainMultiplier: 1,
        canGainUntaggedUltimateEnergy: true,
      },
    ],
  });
  const receipt = new CombatReceiptCollector();
  const operations: CombatOperationExecutor = {
    execute: vi.fn(() => true),
    evaluate: vi.fn(() => true),
  };
  const compiledProgram = compileSkill({
    operatorId: 'perlica',
    skillGroupKey: 'battleSkill',
    skillType: 'battleSkill',
    skillLevel: 12,
    skill: findPerlicaSkill('battleSkill'),
  });
  const runtime = new SkillRuntime(compiledProgram, { clock, resources, receipt, operations });
  const simulation = new CombatSimulation(clock);
  simulation.add(runtime);
  return { clock, resources, receipt, operations, runtime, simulation };
}

describe('SkillRuntime', () => {
  it('applies frame-zero cost during the native initial tick', () => {
    const fixture = createBattleSkillRuntime(300);

    expect(fixture.runtime.tryStart()).toBe(true);

    expect(fixture.runtime.appliedCost).toBe(true);
    expect(fixture.resources.sp).toBe(200);
    expect(fixture.receipt.entries.map(entry => entry.event)).toEqual([
      'SkillStarted',
      'SkillCostApplied',
    ]);
  });

  it('executes Perlica hit steps in source order at relative frame 13', () => {
    const fixture = createBattleSkillRuntime(300);
    fixture.runtime.tryStart();

    fixture.simulation.advanceFrames(13);

    expect(fixture.operations.execute).toHaveBeenCalledTimes(3);
    expect(vi.mocked(fixture.operations.execute).mock.calls.map(([step]) => step.kind)).toEqual([
      'applyElementalInfliction',
      'dealDamage',
      'gainSquadUltimateEnergyFromSkillCost',
    ]);
    expect(
      fixture.receipt.entries
        .filter(entry => entry.event === 'CombatStepReached')
        .map(entry => entry.data?.kind),
    ).toEqual(['applyElementalInfliction', 'dealDamage', 'gainSquadUltimateEnergyFromSkillCost']);
    expect(fixture.receipt.entries.at(-1)).toMatchObject({
      frame: 13,
      time: 13 / 30,
      event: 'TimelineActionEnded',
    });
  });

  it('rejects the cast before creating runtime state when SP is insufficient', () => {
    const fixture = createBattleSkillRuntime(99);

    expect(fixture.runtime.tryStart()).toBe(false);

    expect(fixture.runtime.state).toBe('ready');
    expect(fixture.resources.sp).toBe(99);
    expect(fixture.receipt.entries).toHaveLength(1);
    expect(fixture.receipt.entries[0]?.event).toBe('SkillCastRejectedByCost');
  });

  it('continues the native timeline when shared resource is unavailable at the cost point', () => {
    const program = compileSkill({
      operatorId: 'perlica',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 12,
      skill: { ...findPerlicaSkill('battleSkill'), costFrame: 3 },
    });
    const clock = new CombatClock();
    const resources = new CombatResources({
      sp: 100,
      maxSp: 300,
      returnedSp: 0,
      spRecovery: { valuePerSecond: 10, pauseDuration: 1, pauseRemaining: 0 },
      ultimateEnergySystemUnlocked: true,
      normalSkillUltimateEnergy: { selfGainPerSp: 0.1, otherGainPerSp: 0.2 },
      squad: [],
    });
    const receipt = new CombatReceiptCollector();
    const operations: CombatOperationExecutor = {
      execute: vi.fn(() => true),
      evaluate: vi.fn(() => true),
    };
    const runtime = new SkillRuntime(program, {
      clock,
      resources,
      receipt,
      operations,
    });
    const simulation = new CombatSimulation(clock);
    simulation.add(runtime);
    expect(runtime.tryStart()).toBe(true);
    expect(resources.pay('other', [{ resource: 'sp', value: 100 }]).paid).toBe(true);

    simulation.advanceFrames(13);

    expect(runtime.appliedCost).toBe(false);
    expect(runtime.state).toBe('casting');
    expect(operations.execute).toHaveBeenCalledTimes(3);
    expect(receipt.entries.some(entry => entry.event === 'SkillCostRejected')).toBe(true);
    expect(receipt.entries.at(-1)?.event).toBe('TimelineActionEnded');
  });
});
