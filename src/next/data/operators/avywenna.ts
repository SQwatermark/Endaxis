/** Avywenna 的正式 Next 定义由可审计生成器产出；此文件提供稳定导出路径。 */
import { installCompiledSkillDefinition } from '../../core/game-data/installCompiledSkillDefinition';
import avywennaBasicAttack1Runtime from './generated-active-skills/avywenna/avywenna.basicAttack1.runtime.generated';
import avywennaBasicAttack2Runtime from './generated-active-skills/avywenna/avywenna.basicAttack2.runtime.generated';
import avywennaBasicAttack3Runtime from './generated-active-skills/avywenna/avywenna.basicAttack3.runtime.generated';
import avywennaBasicAttack4Runtime from './generated-active-skills/avywenna/avywenna.basicAttack4.runtime.generated';
import avywennaBasicAttack5Runtime from './generated-active-skills/avywenna/avywenna.basicAttack5.runtime.generated';
import avywennaBattleSkillRuntime, {
  supplementalBuffDefinitions as battleSkillSupplementalBuffDefinitions,
} from './generated-active-skills/avywenna/avywenna.battleSkill.runtime.generated';
import avywennaComboSkillRuntime, {
  supplementalBuffDefinitions as comboSkillSupplementalBuffDefinitions,
} from './generated-active-skills/avywenna/avywenna.comboSkill.runtime.generated';
import avywennaUltimateRuntime, {
  supplementalBuffDefinitions as ultimateSupplementalBuffDefinitions,
} from './generated-active-skills/avywenna/avywenna.ultimate.runtime.generated';
import avywennaPlungingAttackRuntime from './generated-active-skills/avywenna/avywenna.plungingAttack.runtime.generated';
import { avywennaGeneratedOperator } from './generated/avywenna.operator.generated';

const avywennaWithGeneratedCommonAttacks = [
  avywennaBasicAttack1Runtime,
  avywennaBasicAttack2Runtime,
  avywennaBasicAttack3Runtime,
  avywennaBasicAttack4Runtime,
  avywennaBasicAttack5Runtime,
  avywennaPlungingAttackRuntime,
].reduce(
  (operator, skill) => installCompiledSkillDefinition(operator, skill),
  avywennaGeneratedOperator,
);

export const avywenna = installCompiledSkillDefinition(
  installCompiledSkillDefinition(
    installCompiledSkillDefinition(
      avywennaWithGeneratedCommonAttacks,
      avywennaComboSkillRuntime,
      comboSkillSupplementalBuffDefinitions,
    ),
    avywennaBattleSkillRuntime,
    battleSkillSupplementalBuffDefinitions,
  ),
  avywennaUltimateRuntime,
  ultimateSupplementalBuffDefinitions,
);
