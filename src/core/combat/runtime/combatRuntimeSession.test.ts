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
  squad: [
    {
      operatorId: 'operator',
      ultimateEnergy: 0,
      maxUltimateEnergy: 0,
      ultimateEnergyGainMultiplier: 1,
      allowedUltimateEnergyRecoveryTags: null,
    },
  ],
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
  const skillProgramsInput = [
    {
      operatorId: 'operator',
      skillGroupKey: 'battleSkill',
      skillId: 'skill',
      castId: 'cast:a',
      skillType: 'battleSkill' as const,
      skillLevel: 1,
      initialBlackboard: {},
      timelineBlockFrames: 0,
      costFrame: undefined,
      costs: [],
      timelineActions: [],
    },
    {
      operatorId: 'operator',
      skillGroupKey: 'battleSkill',
      skillId: 'skill',
      castId: 'cast:b',
      skillType: 'battleSkill' as const,
      skillLevel: 1,
      initialBlackboard: {},
      timelineBlockFrames: 0,
      costFrame: undefined,
      costs: [],
      timelineActions: [],
    },
  ];
  const operators = [{ operatorId: 'operator', skills: skillProgramsInput }];
  const inputs = [
    { frame: 0, operatorId: 'operator', skillId: 'skill', castId: 'cast:a' },
    { frame: 4, operatorId: 'operator', skillId: 'skill', castId: 'cast:b' },
  ];
  const externalEvents = [
    {
      frame: 0,
      targetOperatorIds: ['operator'],
      event: { kind: 'enemyWeaknessSet' as const },
    },
    {
      frame: 4,
      targetOperatorIds: ['operator'],
      event: { kind: 'enemyWeaknessSet' as const },
    },
  ];
  const original = new CombatRuntimeAssembly({
    ...environment.runtimeOptions,
    resources,
    enemy,
    operators,
    inputs,
    abilityEntityChildSkillPrograms: childPrograms,
    combatOperationPrograms: operationPrograms,
    combatSkillPrograms: skillPrograms,
    externalEvents,
  });
  const createRestore =
    (candidateInputs = inputs, candidateExternalEvents = externalEvents) =>
    (graph: typeof original.stateGraph) =>
      CombatRuntimeAssembly.restore({
        graph,
        resources,
        enemy,
        operators,
        inputs: candidateInputs,
        environment: environmentInput(),
        abilityEntityChildSkillPrograms: childPrograms,
        combatOperationPrograms: operationPrograms,
        combatSkillPrograms: skillPrograms,
        projectileCallbackPrograms: callbackPrograms,
        externalEvents: candidateExternalEvents,
      });
  const restore = vi.fn(createRestore());
  return {
    session: new CombatRuntimeSession(original, restore),
    restore,
    createRestore,
    inputs,
    externalEvents,
  };
}

it('从同一完整帧按 A、B、A 回退，失败候选不替换当前装配', () => {
  const { session, restore, createRestore, inputs, externalEvents } = createFixture();
  session.advanceFrames(3);
  const checkpoint = session.save();

  session.advanceFrames(2);
  const branchA = session.readState();
  expect(branchA.inputs.externalEvents.nextEventIndex).toBe(2);
  expect(branchA.inputs.skills.nextInputIndex).toBe(2);
  expect(
    branchA.shared.receipts.entries.filter(
      entry => entry.event === 'ExternalEnemyWeaknessSetProcessed',
    ),
  ).toHaveLength(2);
  expect(
    branchA.shared.receipts.entries.filter(entry => entry.event === 'SkillInputProcessed'),
  ).toHaveLength(2);
  expect(() =>
    session.restore(
      checkpoint,
      createRestore([{ ...inputs[0]!, castId: 'cast:b' }, inputs[1]!], externalEvents),
    ),
  ).toThrow('fixed input prefix does not match program');
  expect(session.readState()).toEqual(branchA);
  session.restore(checkpoint, createRestore(inputs.slice(0, 1), externalEvents.slice(0, 1)));
  session.advanceFrames(2);
  const branchB = session.readState();
  expect(branchB.shared.clock.frame).toBe(5);
  expect(branchB.inputs.skills.nextInputIndex).toBe(1);
  expect(branchB.inputs.externalEvents.nextEventIndex).toBe(1);
  expect(branchB).not.toEqual(branchA);

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

it('试探分支独立推进，显式丢弃检查点后不再保留历史入口', () => {
  const { session, createRestore, inputs, externalEvents } = createFixture();
  session.advanceFrames(3);
  const checkpoint = session.save();
  const parent = session.readState();

  const trial = session.fork(
    checkpoint,
    createRestore(inputs.slice(0, 1), externalEvents.slice(0, 1)),
  );
  trial.advanceFrames(2);
  expect(trial.frame).toBe(5);
  expect(trial.readState().inputs.skills.nextInputIndex).toBe(1);
  expect(session.readState()).toEqual(parent);
  expect(session.frame).toBe(3);

  session.discardCheckpoint(checkpoint);
  expect(() => session.restore(checkpoint)).toThrow('does not belong');
  expect(() => session.fork(checkpoint)).toThrow('does not belong');
});
