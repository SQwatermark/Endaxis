/** Static candidates for a graph whose exact operator owner is known by its host.
 * Never search other operators or flatten entity child skills into the operator namespace.
 */
import type { OperatorDefinition } from '../../../packages/game-data-contract/src/operators';
import type { CommonDefinitionSource } from '../../core/game-data/gameDataRepository';
import { listOperatorSkillDefinitionBindings } from '../../core/game-data/operatorSkillDefinitions';

export function operatorReferenceChoices(
  operator: OperatorDefinition,
  sharedSources: readonly CommonDefinitionSource[] = [],
) {
  const choices = (values: readonly string[]) =>
    [...new Set(values)].map(value => ({ value, label: value }));
  return {
    skillGroup: choices(operator.skillGroups.map(group => group.key)),
    skillSlot: choices((operator.skillSlots ?? []).map(slot => slot.key)),
    skill: choices([
      ...listOperatorSkillDefinitionBindings(operator).map(binding => binding.skill.key),
      ...(operator.dodgeSkill ? [operator.dodgeSkill.key] : []),
    ]),
    buff: choices([
      ...Object.keys(operator.buffDefinitions ?? {}),
      ...sharedSources.flatMap(source => Object.keys(source.buffDefinitions ?? {})),
    ]),
    abilityEntity: choices([
      ...Object.keys(operator.abilityEntityDefinitions ?? {}),
      ...sharedSources.flatMap(source => Object.keys(source.abilityEntityDefinitions ?? {})),
    ]),
  };
}
