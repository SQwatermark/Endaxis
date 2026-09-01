import type { GameplayTagRegistry } from '../source/nativeGameplayTags.ts';
import type { AbilityEntityDefinition } from '../../../../packages/game-data-contract/src/index.ts';
import type { NativeAbilityEntityTemplateSource } from '../source/abilityEntity.ts';
import { compileAbilityEntityChildSkillSource } from './abilityEntityChildSkill.ts';
import type { CombatActionProjectionExtensionsSource } from './combatProjectionCommon.ts';
import type { CombatActionProjectionContextSource } from './combatProjectionCommon.ts';
import { projectGameplayTags } from './combatProjectionCommon.ts';

/** 只接入现有零空间运行时可表示的模板寿命；子技能身份来自 Spawn 动作，不从模板名称推导。 */
export function compileAbilityEntityDefinitionSource(
  template: NativeAbilityEntityTemplateSource,
  skillIds: string | readonly string[],
  loadSkill: (id: string) => unknown,
  visualOnlyIds: ReadonlySet<string> = new Set(),
  gameplayTagRegistry?: GameplayTagRegistry,
  extensions?:
    | CombatActionProjectionExtensionsSource
    | ((skillId: string) => CombatActionProjectionExtensionsSource),
  abilityEntityQueries?: CombatActionProjectionContextSource['abilityEntityQueries'],
  nativeMissingBlackboardZeroKeys?: (skillId: string) => ReadonlySet<string>,
): AbilityEntityDefinition {
  if (
    template.maxStackingCount < -1 ||
    template.delayToRecycleSeconds >= 300 ||
    template.delayRecyclePerformSeconds !== 0 ||
    template.sendDieEvent
  )
    throw new Error(
      `${template.gameId}: unsupported AbilityEntity lifetime/stacking projection ` +
        JSON.stringify({
          durationBlackboardKey: template.durationBlackboard.blackboardKey,
          maxStackingCountBlackboardKey: template.maxStackingCountBlackboard.blackboardKey,
          maxStackingCount: template.maxStackingCount,
          maxDurationForServerSeconds: template.maxDurationForServerSeconds,
          delayToRecycleSeconds: template.delayToRecycleSeconds,
          delayRecyclePerformSeconds: template.delayRecyclePerformSeconds,
          sendDieEvent: template.sendDieEvent,
        }),
    );
  if (template.lifeTypeNativeValue !== 0 && template.lifeTypeNativeValue !== 1)
    throw new Error(`${template.gameId}: unsupported AbilityEntity life type`);
  const ids =
    typeof skillIds === 'string'
      ? skillIds
        ? [skillIds]
        : []
      : [...skillIds].filter(skillId => skillId.length > 0);
  const childSkills = ids.map(skillId => {
    const childExtensions = typeof extensions === 'function' ? extensions(skillId) : extensions;
    const childSkill = compileAbilityEntityChildSkillSource(
      loadSkill(skillId),
      `SkillData.${skillId}`,
      visualOnlyIds,
      gameplayTagRegistry,
      childExtensions,
      abilityEntityQueries,
      nativeMissingBlackboardZeroKeys?.(skillId),
    );
    if (childSkill.skillId !== skillId)
      throw new Error(`${template.gameId}: child skill identity mismatch`);
    return childSkill;
  });
  return {
    ...(template.bornTagIds.length === 0
      ? {}
      : {
          bornTags: projectGameplayTags(
            template.bornTagIds,
            { gameplayTagRegistry, abilityEntityQueries },
            `${template.gameId}.bornTagIds`,
          ),
        }),
    lifetime:
      template.lifeTypeNativeValue === 0
        ? {
            kind: 'limited',
            durationSeconds:
              template.durationBlackboard.blackboardKey === null
                ? template.durationSeconds
                : {
                    blackboardKey: template.durationBlackboard.blackboardKey,
                    fallback: template.durationSeconds,
                  },
          }
        : { kind: 'infinite' },
    ...(template.delayToRecycleSeconds === 0
      ? {}
      : { deathReleaseDelaySeconds: template.delayToRecycleSeconds }),
    ...(template.maxStackingCount > 0
      ? {
          maxStackingCount:
            template.maxStackingCountBlackboard.blackboardKey === null
              ? template.maxStackingCount
              : {
                  blackboardKey: template.maxStackingCountBlackboard.blackboardKey,
                  fallback: template.maxStackingCount,
                },
        }
      : {}),
    ...(childSkills.length === 1
      ? { childSkill: childSkills[0]! }
      : childSkills.length === 0
        ? {}
        : { childSkills: Object.fromEntries(childSkills.map(skill => [skill.skillId, skill])) }),
  };
}
