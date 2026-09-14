import { expect, it, vi } from 'vitest';
import { CombatRuntimeAssembly } from './combatRuntimeAssembly';
import { CombatRuntimeSession } from './combatRuntimeSession';
import { StandardPlayerDamageEnvironment } from './standardPlayerDamageEnvironment';
import { CombatVitals } from './combatVitals';
import { AbilityEntityChildSkillPrograms } from './abilityEntityChildSkillPrograms';
import { CombatOperationPrograms } from './combatOperationPrograms';
import { CombatSkillPrograms } from './combatSkillPrograms';
import { ProjectileCallbackPrograms } from './projectileCallbackPrograms';

const enemy = {
  source: { kind: 'custom' as const, level: 1 },
  rank: 'mob' as const,
  health: 100,
  superArmor: 0,
  defenderAttributes: {
    defense: 0,
    shelterDamageMultiplier: 0,
    breakingAttackDamageTakenMultiplier: 1,
    resistances: Object.fromEntries(
      ['physical', 'heat', 'electric', 'cryo', 'nature', 'ether'].map(element => [
        element,
        { percent: 0, damageTakenMultiplier: 1 },
      ]),
    ) as Record<
      'physical' | 'heat' | 'electric' | 'cryo' | 'nature' | 'ether',
      { percent: number; damageTakenMultiplier: number }
    >,
  },
  stagger: {
    maximum: 100,
    knotThresholds: [],
    knotBreakDurationFrames: 0,
    brokenDurationFrames: 0,
    finisherSpRecovery: 0,
  },
};

const resources = {
  sp: 0,
  maxSp: 300,
  returnedSp: 0,
  sharedSpGain: { baseGainEfficiency: 1 },
  spRecovery: { valuePerSecond: 3, pauseDuration: 0, pauseRemaining: 0 },
  ultimateEnergySystemUnlocked: false,
  normalSkillUltimateEnergy: { selfGainPerSp: 0, otherGainPerSp: 0 },
  squad: [],
};

function environmentInput() {
  return {
    criticalSamples: { nextCriticalSample: () => 1 },
    resolveNonRandomRuntimeSnapshot: () => ({
      runtimeExtensionMultiplier: 1,
      appliesIgniteDamageMultiplier: false,
      appliesPhysicalInflictionDamageMultiplier: false,
    }),
  };
}

function createFixture() {
  const environment = new StandardPlayerDamageEnvironment({
    ...environmentInput(),
    enemyVitals: new CombatVitals({
      health: 100,
      maxHealth: 100,
      maxPoise: 0,
      poise: 0,
      poiseRecoveryTime: 0,
      poiseRecoveryTimeMultiplier: 1,
      poiseBrokenEndTime: 0,
      poiseImmune: false,
    }),
  });
  const childPrograms = new AbilityEntityChildSkillPrograms();
  const operationPrograms = new CombatOperationPrograms();
  const skillPrograms = new CombatSkillPrograms();
  const callbackPrograms = new ProjectileCallbackPrograms();
  const original = new CombatRuntimeAssembly({
    ...environment.runtimeOptions,
    resources,
    enemy,
    operators: [],
    abilityEntityChildSkillPrograms: childPrograms,
    combatOperationPrograms: operationPrograms,
    combatSkillPrograms: skillPrograms,
  });
  const restore = vi.fn((graph: typeof original.stateGraph) =>
    CombatRuntimeAssembly.restore({
      graph,
      resources,
      enemy,
      operators: [],
      environment: environmentInput(),
      abilityEntityChildSkillPrograms: childPrograms,
      combatOperationPrograms: operationPrograms,
      combatSkillPrograms: skillPrograms,
      projectileCallbackPrograms: callbackPrograms,
    }),
  );
  return { session: new CombatRuntimeSession(original, restore), restore };
}

it('从同一完整帧按 A、B、A 回退，失败候选不替换当前装配', () => {
  const { session, restore } = createFixture();
  session.advanceFrames(3);
  const checkpoint = session.save();

  session.advanceFrames(2);
  const branchA = session.readState();
  session.restore(checkpoint);
  session.advanceFrames(5);
  const branchB = session.readState();
  expect(branchB.shared.clock.frame).toBe(8);
  expect(branchB.shared.resources.sp).toBeGreaterThan(branchA.shared.resources.sp);

  session.restore(checkpoint);
  session.advanceFrames(2);
  expect(session.readState()).toEqual(branchA);
  expect(session.generation).toBe(2);

  restore.mockImplementationOnce(() => {
    throw new Error('rejected candidate');
  });
  expect(() => session.restore(checkpoint)).toThrow('rejected candidate');
  expect(session.readState()).toEqual(branchA);
  expect(session.generation).toBe(2);
});

it('拒绝其他会话的检查点和非法推进数量', () => {
  const first = createFixture().session;
  const second = createFixture().session;
  expect(() => second.restore(first.save())).toThrow('does not belong');
  expect(() => first.advanceFrames(-1)).toThrow('non-negative safe integer');
});
