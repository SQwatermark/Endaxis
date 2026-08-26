/** Avywenna 的正式 Next 定义由可审计生成器产出；此文件提供稳定导出路径。 */
import { installCompiledSkillDefinition } from '../../core/game-data/installCompiledSkillDefinition';
import avywennaBattleSkillRuntime, {
  supplementalBuffDefinitions as battleSkillSupplementalBuffDefinitions,
} from './generated-active-skills/avywenna/avywenna.battleSkill.runtime.generated';
import avywennaUltimateRuntime, {
  supplementalBuffDefinitions as ultimateSupplementalBuffDefinitions,
} from './generated-active-skills/avywenna/avywenna.ultimate.runtime.generated';
import { avywennaGeneratedOperator } from './generated/avywenna.operator.generated';

export const avywenna = installCompiledSkillDefinition(
  installCompiledSkillDefinition(
    avywennaGeneratedOperator,
    avywennaBattleSkillRuntime,
    battleSkillSupplementalBuffDefinitions,
  ),
  avywennaUltimateRuntime,
  ultimateSupplementalBuffDefinitions,
);
