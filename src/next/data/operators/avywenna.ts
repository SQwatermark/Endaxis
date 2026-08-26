/** Avywenna 的正式 Next 定义由可审计生成器产出；此文件提供稳定导出路径。 */
import { installCompiledSkillDefinition } from '../../core/game-data/installCompiledSkillDefinition';
import avywennaBattleSkillRuntime, {
  supplementalBuffDefinitions as battleSkillSupplementalBuffDefinitions,
} from './generated-active-skills/avywenna/avywenna.battleSkill.runtime.generated';
import avywennaComboSkillRuntime, {
  supplementalBuffDefinitions as comboSkillSupplementalBuffDefinitions,
} from './generated-active-skills/avywenna/avywenna.comboSkill.runtime.generated';
import avywennaUltimateRuntime, {
  supplementalBuffDefinitions as ultimateSupplementalBuffDefinitions,
} from './generated-active-skills/avywenna/avywenna.ultimate.runtime.generated';
import { avywennaGeneratedOperator } from './generated/avywenna.operator.generated';

export const avywenna = installCompiledSkillDefinition(
  installCompiledSkillDefinition(
    installCompiledSkillDefinition(
      avywennaGeneratedOperator,
      avywennaComboSkillRuntime,
      comboSkillSupplementalBuffDefinitions,
    ),
    avywennaBattleSkillRuntime,
    battleSkillSupplementalBuffDefinitions,
  ),
  avywennaUltimateRuntime,
  ultimateSupplementalBuffDefinitions,
);
