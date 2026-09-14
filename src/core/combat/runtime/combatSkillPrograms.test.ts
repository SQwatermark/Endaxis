import { expect, it } from 'vitest';
import type { CompiledSkillProgram } from '../../compiler/combatProgram';
import { CombatSkillPrograms, combatSkillProgramKey } from './combatSkillPrograms';

function skill(overrides: Partial<CompiledSkillProgram> = {}): CompiledSkillProgram {
  return {
    operatorId: 'operator',
    skillGroupKey: 'battleSkill',
    skillId: 'skill',
    skillType: 'battleSkill',
    costs: [],
    initialBlackboard: {},
    timeline: [],
    ...overrides,
  };
}

it('普通技能程序在同一切面树中复用伤害快照槽位映射', () => {
  const programs = new CombatSkillPrograms();
  const program = skill({ castId: 'cast' });
  const first = programs.register(program);
  const second = programs.register(program);

  expect(second).toBe(first);
  expect(second.damageSnapshots).toBe(first.damageSnapshots);
  expect(programs.resolve(combatSkillProgramKey(program))).toBe(first);
});

it('相同技能身份不能在同一目录绑定另一个程序对象', () => {
  const programs = new CombatSkillPrograms();
  programs.register(skill({ castId: 'cast' }));

  expect(() => programs.register(skill({ castId: 'cast' }))).toThrow(
    'is already bound to another definition',
  );
});
