import type { GameplayTagRegistry } from '../source/nativeGameplayTags.ts';
import type { AbilityEntityDefinition } from '../../../../packages/game-data-contract/src/index.ts';
import type { NativeAbilityEntityTemplateSource } from '../source/abilityEntity.ts';
import { compileAbilityEntityChildSkillSource } from './abilityEntityChildSkill.ts';

/** 只接入现有零空间运行时可表示的模板寿命；子技能身份来自 Spawn 动作，不从模板名称推导。 */
export function compileAbilityEntityDefinitionSource(
  template: NativeAbilityEntityTemplateSource,
  skillId: string,
  loadSkill: (id: string) => unknown,
  visualOnlyIds: ReadonlySet<string> = new Set(),
  gameplayTagRegistry?: GameplayTagRegistry,
): AbilityEntityDefinition {
  if (
    template.durationBlackboard.blackboardKey !== null ||
    template.maxStackingCountBlackboard.blackboardKey !== null ||
    template.maxStackingCount < -1 ||
    template.maxDurationForServerSeconds !== 0 ||
    template.delayToRecycleSeconds !== 0 ||
    template.delayRecyclePerformSeconds !== 0 ||
    template.sendDieEvent
  )
    throw new Error(`${template.gameId}: unsupported AbilityEntity lifetime/stacking projection`);
  if (template.lifeTypeNativeValue !== 0 && template.lifeTypeNativeValue !== 1)
    throw new Error(`${template.gameId}: unsupported AbilityEntity life type`);
  const childSkill = skillId
    ? compileAbilityEntityChildSkillSource(
        loadSkill(skillId),
        `SkillData.${skillId}`,
        visualOnlyIds,
        gameplayTagRegistry,
      )
    : undefined;
  if (childSkill && childSkill.skillId !== skillId)
    throw new Error(`${template.gameId}: child skill identity mismatch`);
  return {
    lifetime:
      template.lifeTypeNativeValue === 0
        ? { kind: 'limited', durationSeconds: template.durationSeconds }
        : { kind: 'infinite' },
    ...(template.maxStackingCount > 0 ? { maxStackingCount: template.maxStackingCount } : {}),
    ...(childSkill ? { childSkill } : {}),
  };
}
