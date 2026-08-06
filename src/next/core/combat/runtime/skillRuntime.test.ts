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
  const resources = new CombatResources({ sp: initialSp, ultimateEnergy: { perlica: 0 } });
  const receipt = new CombatReceiptCollector();
  const operations: CombatOperationExecutor = {
    execute: vi.fn(() => true),
    evaluate: vi.fn(() => true),
  };
  const runtime = new SkillRuntime(
    compileSkill({
      operatorId: 'perlica',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 12,
      skill: findPerlicaSkill('battleSkill'),
    }),
    { clock, resources, receipt, operations },
  );
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
      'gainUltimateEnergyFromSkillCost',
    ]);
    expect(
      fixture.receipt.entries
        .filter(entry => entry.event === 'CombatStepReached')
        .map(entry => entry.data?.kind),
    ).toEqual(['applyElementalInfliction', 'dealDamage', 'gainUltimateEnergyFromSkillCost']);
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

  it('checks the shared resource again at a delayed cost point', () => {
    const program = compileSkill({
      operatorId: 'perlica',
      skillGroupKey: 'battleSkill',
      skillType: 'battleSkill',
      skillLevel: 12,
      skill: { ...findPerlicaSkill('battleSkill'), costFrame: 3 },
    });
    const clock = new CombatClock();
    const resources = new CombatResources({ sp: 100, ultimateEnergy: {} });
    const receipt = new CombatReceiptCollector();
    const runtime = new SkillRuntime(program, {
      clock,
      resources,
      receipt,
      operations: { execute: () => true, evaluate: () => true },
    });
    const simulation = new CombatSimulation(clock);
    simulation.add(runtime);
    expect(runtime.tryStart()).toBe(true);
    expect(resources.pay('other', [{ resource: 'sp', value: 100 }])).toBe(true);

    simulation.advanceFrames(3);

    expect(runtime.appliedCost).toBe(false);
    expect(receipt.entries.at(-1)?.event).toBe('SkillCostRejected');
  });
});
