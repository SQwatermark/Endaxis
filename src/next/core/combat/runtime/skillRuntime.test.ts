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

function createBattleSkillRuntime(initialSp: number, costFrame?: number) {
  const clock = new CombatClock();
  const resources = new CombatResources({
    sp: initialSp,
    maxSp: 300,
    returnedSp: 0,
    sharedSpGain: { baseGainEfficiency: 1 },
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
    skill:
      costFrame === undefined
        ? findPerlicaSkill('battleSkill')
        : { ...findPerlicaSkill('battleSkill'), costFrame },
  });
  let nextSkillCastId = 1;
  const runtime = new SkillRuntime(compiledProgram, {
    clock,
    resources,
    receipt,
    operations,
    allocateSkillCastId: () => nextSkillCastId++,
  });
  const simulation = new CombatSimulation(clock);
  simulation.add(runtime);
  return { clock, resources, receipt, operations, runtime, simulation };
}

describe('SkillRuntime', () => {
  it('为每个运行实例隔离动作黑板并在再次释放时重置', () => {
    const first = createBattleSkillRuntime(300);
    const second = createBattleSkillRuntime(300);

    first.runtime.operationContext.blackboard.assignDynamic('count', 2);
    expect(second.runtime.operationContext.blackboard.getNumber('count')).toBeUndefined();

    first.runtime.tryStart();
    expect(first.runtime.skillCastInfo).toEqual({
      skillCastId: 1,
      originSkillId: 'battleSkill',
      nonReturnedSpCost: 100,
    });
    first.runtime.operationContext.blackboard.assignDynamic('count', 3);
    first.runtime.end();
    first.runtime.tryStart();

    expect(first.runtime.operationContext.blackboard.getNumber('count')).toBeUndefined();
    expect(first.runtime.skillCastInfo.skillCastId).toBe(2);
  });

  it('applies frame-zero cost during the native initial tick', () => {
    const fixture = createBattleSkillRuntime(300);

    expect(fixture.runtime.tryStart()).toBe(true);
    expect(fixture.runtime.skillCastInfo.nonReturnedSpCost).toBe(100);

    expect(fixture.runtime.appliedCost).toBe(true);
    expect(fixture.resources.sp).toBe(200);
    expect(fixture.receipt.entries.map(entry => entry.event)).toEqual([
      'SkillStarted',
      'SkillCostApplied',
    ]);
  });

  it('updates the current skill-cast info only when delayed cost is actually paid', () => {
    const fixture = createBattleSkillRuntime(300, 3);

    fixture.runtime.tryStart();
    expect(fixture.runtime.skillCastInfo.nonReturnedSpCost).toBe(0);
    expect(fixture.resources.sp).toBe(300);

    fixture.simulation.advanceFrames(3);
    expect(fixture.runtime.skillCastInfo.nonReturnedSpCost).toBe(100);
    expect(fixture.resources.sp).toBe(200);
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

  it('reports insufficient SP without preventing the scheduled skill simulation', () => {
    const fixture = createBattleSkillRuntime(99);

    expect(fixture.runtime.tryStart()).toBe(true);

    expect(fixture.runtime.state).toBe('casting');
    expect(fixture.resources.sp).toBe(99);
    expect(fixture.receipt.entries.map(entry => entry.event)).toEqual([
      'SkillCostUnavailableAtStart',
      'SkillStarted',
      'SkillCostRejected',
    ]);

    fixture.simulation.advanceFrames(13);
    expect(fixture.operations.execute).toHaveBeenCalledTimes(3);
    expect(
      fixture.receipt.entries.filter(entry => entry.event === 'SkillCostRejected'),
    ).toHaveLength(1);
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
      sharedSpGain: { baseGainEfficiency: 1 },
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
      allocateSkillCastId: () => 1,
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
