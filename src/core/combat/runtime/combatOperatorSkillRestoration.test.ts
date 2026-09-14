import { expect, it } from 'vitest';
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import { CombatReceiptCollector } from '../receipt/combatReceipt';
import { AbilitySystemRuntime } from './abilitySystemRuntime';
import { ActionBlackboard } from './actionBlackboard';
import { CombatClock } from './combatClock';
import { createCombatOperationHostState } from './combatOperationHostState';
import { CombatOperationPrograms } from './combatOperationPrograms';
import { bindRestoredCombatOperatorSkills } from './combatOperatorSkillRestoration';
import { bindRestoredCombatSkillCooldowns } from './combatSkillCooldownRestoration';
import { CombatSkillPrograms } from './combatSkillPrograms';
import { SkillCooldown } from './skillCooldown';
import { SkillRuntime, type CombatOperationExecutor } from './skillRuntime';

const program: CompiledSkillProgram = {
  operatorId: 'operator',
  skillGroupKey: 'battleSkill',
  skillId: 'skill',
  skillType: 'battleSkill',
  costs: [],
  initialBlackboard: { counter: 1 },
  naturalDurationFrames: 4,
  timeline: [],
  timelineActions: [],
  cooldownFrames: 30,
  costFrame: 0,
};

function operations(state: ReturnType<typeof createCombatOperationHostState>) {
  const executor: CombatOperationExecutor = {
    operationHost: { state, programs: new CombatOperationPrograms() },
    execute: () => true,
    evaluate: () => true,
  };
  return executor;
}

it('预检后的技能宿主从原局部帧继续，不重新施放或修改原分支', () => {
  const fixedPrograms = new CombatSkillPrograms();
  const fixed = fixedPrograms.register(program);
  const originalClock = new CombatClock();
  const originalReceipt = new CombatReceiptCollector();
  const originalBlackboard = new ActionBlackboard({ shared: 7 });
  const originalCooldown = new SkillCooldown(30, 0);
  const originalOperationState = createCombatOperationHostState();
  const original = new SkillRuntime(program, {
    clock: originalClock,
    receipt: originalReceipt,
    operations: operations(originalOperationState),
    resources: null,
    allocateSkillCastId: () => 1,
    entityBlackboard: originalBlackboard,
    cooldown: originalCooldown,
    advancesCooldown: false,
    damageSnapshotProgram: fixed.damageSnapshots,
    operationState: originalOperationState,
  });
  const originalAbility = new AbilitySystemRuntime({ skills: [original] });
  expect(originalAbility.tryStartSkill('skill')).toBe(true);
  originalClock.advanceFrame();
  originalAbility.advanceFrame();
  const saved = structuredClone({
    clock: originalClock.runtimeState,
    blackboard: originalBlackboard.runtimeState,
    cooldowns: new Map([['skill', originalCooldown.runtimeState]]),
    skill: original.runtimeState,
    ability: originalAbility.runtimeState,
  });
  const restoredClock = new CombatClock(saved.clock);
  const restoredReceipt = new CombatReceiptCollector(originalReceipt.history.snapshot());
  const restoredBlackboard = ActionBlackboard.bindRuntimeState(saved.blackboard);
  const cooldowns = bindRestoredCombatSkillCooldowns(
    { operatorId: 'operator', skills: [program] },
    saved.cooldowns,
  );
  const allocate = () => {
    throw new Error('restoration must not allocate a cast id');
  };
  const restored = bindRestoredCombatOperatorSkills({
    operatorId: 'operator',
    skills: [{ program, fixed, state: saved.skill }],
    cooldowns,
    createDependencies: binding => ({
      clock: restoredClock,
      receipt: restoredReceipt,
      operations: operations(binding.state.operations),
      resources: null,
      allocateSkillCastId: allocate,
      entityBlackboard: restoredBlackboard,
    }),
    resolveAttachedBuff: () => undefined,
  }).get('skill\u0000')!;
  const restoredAbility = new AbilitySystemRuntime({ skills: [restored] }, saved.ability);

  expect(restored.runtimeState).toBe(saved.skill);
  expect(restored.runtimeState.cooldown).toBe(saved.cooldowns.get('skill'));
  expect(restored.runtimeState.blackboard.entity).toBe(saved.blackboard);
  for (let frame = 2; frame <= 4; frame += 1) {
    originalClock.advanceFrame();
    originalAbility.advanceFrame();
    restoredClock.advanceFrame();
    restoredAbility.advanceFrame();
    expect(restored.runtimeState).toEqual(original.runtimeState);
    expect(restoredAbility.runtimeState).toEqual(originalAbility.runtimeState);
    expect(restoredReceipt.entries).toEqual(originalReceipt.entries);
  }
  expect(restored.state).toBe('ended');
});

it('技能宿主拒绝未绑定保存动作状态的当前执行链', () => {
  const fixed = new CombatSkillPrograms().register(program);
  const cooldownState = new SkillCooldown(30, 0).runtimeState;
  const state = new SkillRuntime(program, {
    clock: new CombatClock(),
    receipt: new CombatReceiptCollector(),
    operations: operations(createCombatOperationHostState()),
    resources: null,
    allocateSkillCastId: () => 1,
    cooldown: new SkillCooldown(30, 0, undefined, cooldownState),
    advancesCooldown: false,
  }).runtimeState;
  const cooldowns = bindRestoredCombatSkillCooldowns(
    { operatorId: 'operator', skills: [program] },
    new Map([['skill', state.cooldown]]),
  );

  expect(() =>
    bindRestoredCombatOperatorSkills({
      operatorId: 'operator',
      skills: [{ program, fixed, state }],
      cooldowns,
      createDependencies: () => ({
        clock: new CombatClock(),
        receipt: new CombatReceiptCollector(),
        operations: operations(createCombatOperationHostState()),
        resources: null,
        allocateSkillCastId: () => 1,
      }),
      resolveAttachedBuff: () => undefined,
    }),
  ).toThrow('has no matching operation host');
});
