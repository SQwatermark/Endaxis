import data from './ability-entity-templates.generated.json';
import type { AbilityEntityDefinition } from '../../core/game-data/operatorDefinition';
import type { GameplayTag } from '../../../../packages/game-data-contract/src/gameplayTags';

export interface LogicalAbilityEntityTemplateEvidenceProjection extends AbilityEntityDefinition {
  readonly id: string;
  /** 来源出生标签仅用于展示/模板筛选，不在这里增加新的运行时安装行为。 */
  readonly bornTags: readonly GameplayTag[];
  readonly maxStackingCount: number;
}

/** 生成阶段已解析原生标签和寿命枚举，运行时不再导入原始证据容器。 */
export const logicalAbilityEntityTemplates = Object.freeze(data.templates) as readonly LogicalAbilityEntityTemplateEvidenceProjection[];
export const unresolvedAbilityEntityTemplateReferences = Object.freeze(data.unresolvedReferences);
