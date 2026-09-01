import type { CompiledComboSkillConditionProgram } from './combatProgram';
import type { OperatorDefinition } from '../game-data/operatorDefinition';
import type { OperatorInstanceDocument } from '../project/schema';
import { validateComboSkillConditions } from '../game-data/validateComboSkillConditions';
import { compileActionSequence } from './compileSkill';

/** 正式定义进入编译程序；引用在这里严格解析，不依赖是否存在技能块。 */
export function compileOperatorComboSkillConditions(
  operator: OperatorDefinition,
  build: OperatorInstanceDocument,
): readonly CompiledComboSkillConditionProgram[] {
  const path = `operator '${operator.slug}'.comboSkillConditions`;
  const issues = validateComboSkillConditions(operator.comboSkillConditions, path);
  if (issues.length > 0)
    throw new Error(issues.map(issue => `${issue.path}: ${issue.message}`).join('\n'));
  return (operator.comboSkillConditions ?? []).map((condition, index) => {
    const p = `${path}[${index}]`;
    const groups = operator.skillGroups.filter(group => group.key === condition.skillGroupKey);
    if (groups.length !== 1 || groups[0]!.skillType !== 'comboSkill')
      throw new Error(`${p}.skillGroupKey must resolve to exactly one combo skill group`);
    const level = build.skillLevels[groups[0]!.levelSource];
    if (level === undefined || !Number.isInteger(level) || level <= 0)
      throw new Error(`${p} requires a positive integer level for '${groups[0]!.levelSource}'`);
    return {
      key: condition.key,
      skillGroupKey: condition.skillGroupKey,
      event: condition.event,
      immediately: condition.immediately,
      initialValues:
        condition.initialValues === null ? null : Object.freeze({ ...condition.initialValues }),
      sequence: compileActionSequence(condition.sequence, level, `${p}.sequence`),
    };
  });
}
