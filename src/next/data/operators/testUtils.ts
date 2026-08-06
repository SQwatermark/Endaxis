import type {
  ActionSequenceDefinition,
  CombatStepDefinition,
  OperatorDefinition,
  SkillDefinition,
  SkillGroupDefinition,
} from '../../core/game-data/operatorDefinition';

export function getGroupSkills(group: SkillGroupDefinition): readonly SkillDefinition[] {
  return Array.isArray(group.skills) ? group.skills : [group.skills as SkillDefinition];
}

export function getSkill(operator: OperatorDefinition, key: string): SkillDefinition {
  const skill = operator.skillGroups
    .flatMap(getGroupSkills)
    .find(candidate => candidate.key === key);
  if (!skill) throw new Error(`missing skill: ${key}`);
  return skill;
}

export function collectSteps(sequence: ActionSequenceDefinition): CombatStepDefinition[] {
  return sequence.steps.flatMap(step => [
    step,
    ...(step.kind === 'conditional' ? collectSteps(step.whenTrue) : []),
    ...(step.kind === 'conditional' && step.whenFalse ? collectSteps(step.whenFalse) : []),
  ]);
}
