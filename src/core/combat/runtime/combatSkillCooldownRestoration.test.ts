import { expect, it } from 'vitest';
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import type { CombatOperatorProgram } from './combatRuntimeAssembly';
import {
  bindRestoredCombatSkillCooldowns,
  resolveCombatSkillCooldownConfiguration,
} from './combatSkillCooldownRestoration';
import { SkillCooldown } from './skillCooldown';

function skill(overrides: Partial<CompiledSkillProgram> = {}): CompiledSkillProgram {
  return {
    operatorId: 'operator',
    skillGroupKey: 'battleSkill',
    skillId: 'skill',
    skillType: 'battleSkill',
    costs: [],
    initialBlackboard: {},
    timeline: [],
    cooldownFrames: 100,
    costFrame: 10,
    ...overrides,
  };
}

it('恢复共享冷却直接绑定保存账本，后续推进不修改原分支', () => {
  const program = skill();
  const operator: CombatOperatorProgram = { operatorId: 'operator', skills: [program] };
  const original = new SkillCooldown(100, 10);
  original.tryReserve();
  original.advance(25);
  const saved = structuredClone(new Map([['skill', original.runtimeState]]));

  const binding = bindRestoredCombatSkillCooldowns(operator, saved).get('skill')!;

  expect(binding.cooldown.runtimeState).toBe(saved.get('skill'));
  expect(binding.cooldown.snapshot.remainingFrames).toBe(original.snapshot.remainingFrames);
  binding.cooldown.advance(5);
  expect(binding.cooldown.snapshot.remainingFrames).toBe(original.snapshot.remainingFrames - 5);
  expect(original.snapshot.remainingFrames).toBe(75);
});

it('恢复后的连携冷却在实际预占时读取当前分支 Buff 倍率', () => {
  let multiplier = 2;
  const program = skill({ skillType: 'comboSkill', skillGroupKey: 'comboSkill' });
  const operator = {
    operatorId: 'operator',
    skills: [program],
    buffRuntime: { getAttributeValue: () => multiplier },
  } as CombatOperatorProgram;
  const saved = new Map([['skill', new SkillCooldown(100, 10).runtimeState]]);
  const cooldown = bindRestoredCombatSkillCooldowns(operator, saved).get('skill')!.cooldown;

  expect(cooldown.tryReserve()).toBe(true);
  expect(cooldown.snapshot.remainingFrames).toBe(200);
  cooldown.overrideByTimeline(true);
  multiplier = 0.5;
  expect(cooldown.tryReserve()).toBe(true);
  expect(cooldown.snapshot.remainingFrames).toBe(50);
});

it('固定面板修正只改变基础周期，错误的数据形状在绑定前失败', () => {
  const program = skill();
  const operator = {
    operatorId: 'operator',
    skills: [program],
    panel: {
      combatModifiers: [
        { kind: 'skillCooldownReduction', skillTypes: ['battleSkill'], value: 0.2 },
      ],
    },
  } as CombatOperatorProgram;

  expect(resolveCombatSkillCooldownConfiguration(operator, program)).toEqual({
    periodFrames: 80,
    commitFrame: 10,
  });
  expect(() =>
    bindRestoredCombatSkillCooldowns(
      operator,
      new Map([['skill', { reservedByCurrentCast: false }]]),
    ),
  ).toThrow("restored cooldown 'operator:skill' does not match its fixed configuration");
});
