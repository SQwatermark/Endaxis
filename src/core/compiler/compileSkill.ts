import type { SkillDefinition } from '../../../packages/game-data-contract/src/skills.ts';
import type { SkillBuffDefinition } from '../../../packages/game-data-contract/src/buffs.ts';
import type {
  ActionGraphDefinitionRepository,
  ImportedAbilityEntityDefinitions,
} from './actionGraphDefinitionRepository';

import { compileSkillProgram } from './compileSkillProgram';
import { createProgramDefinitionCompiler } from './compileProgramDefinitions';
export { compileSkillCosts } from './compileSkillProgram';
import type { SkillType, OperatorAbilityEntityDefinitions } from '../game-data/operatorDefinition';
import type { ResolvedSkillBuffDefinition } from './combatProgram';
import type { StaticBuffDefinition } from '../../../packages/game-data-contract/src/buffs';

interface CompileSkillMetadata {
  readonly operatorId: string;
  readonly skillGroupKey: string;
  readonly skillType: SkillType;
  readonly skillLevel: number;
  readonly skill: SkillDefinition;
  readonly abilityEntityDefinitions?: OperatorAbilityEntityDefinitions;
}

export interface CompileSkillInput extends CompileSkillMetadata {
  readonly programs: ActionGraphDefinitionRepository;
  readonly importedAbilityEntityDefinitions?: ImportedAbilityEntityDefinitions;
}

/** 分别编译 Buff 的局部图；调用方用原生 Buff ID 组织这些独立结果。 */
export function compileIndependentBuffResource(
  definition: SkillBuffDefinition | StaticBuffDefinition,
  id: string,
  programs: ActionGraphDefinitionRepository,
  imports?: ImportedAbilityEntityDefinitions,
): ResolvedSkillBuffDefinition {
  const compiler = createProgramDefinitionCompiler(
    0,
    (_entry, path) => {
      throw new Error(`${path}: executable Buff requires its own action graph`);
    },
    graph => programs.compile(graph, 0, undefined, imports).compileEntry,
  );
  return compiler.buff(definition, `buffDefinitions.${JSON.stringify(id)}`);
}

export function compileSkill(input: CompileSkillInput) {
  const compilation = input.programs.compile(
    input.skill.actionGraph,
    input.skillLevel,
    input.abilityEntityDefinitions,
    input.importedAbilityEntityDefinitions,
  );
  const program = compileSkillProgram(
    input,
    (entry, path) => compilation.compileEntry(entry, `${input.skill.key}:${path}`),
    compilation.compileInputs,
  );
  return { ...program, abilityEntityDefinitions: compilation.program.abilityEntityDefinitions };
}
