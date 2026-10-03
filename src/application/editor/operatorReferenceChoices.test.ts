import { describe, expect, it } from 'vitest';
import type { OperatorDefinition } from '../../../packages/game-data-contract/src/operators';
import { skillFixture } from '../../test/skillFixture';
import { operatorReferenceChoices } from './operatorReferenceChoices';

const skill = (key: string) =>
  skillFixture({
    key,
    timelineBlockFrames: 30,
    scheduledSequences: [],
    actionGraph: { main: { nodes: {} }, macros: {} },
  });
const owner = {
  slug: 'owner',
  skillGroups: [
    {
      key: 'group',
      operationType: 'basicAttack',
      skills: [skill('base'), skill('base')],
      variants: [{ key: 'mode', skills: skill('variant') }],
      replacementSkills: [skill('replacement')],
      routedReplacementSkills: [{ skill: skill('routed') }],
    },
  ],
  dodgeSkill: skill('dodge'),
  skillSlots: [{ key: 'slot' }],
  buffDefinitions: { localBuff: {} },
  abilityEntityDefinitions: {
    localEntity: { childSkills: { child: { skillId: 'entity-child' } } },
  },
} as unknown as OperatorDefinition;

describe('operatorReferenceChoices', () => {
  it('uses exact owner keys, includes variants/replacements, and deduplicates values', () => {
    const result = operatorReferenceChoices(owner);
    expect(result.skill.map(choice => choice.value)).toEqual([
      'base',
      'variant',
      'replacement',
      'routed',
      'dodge',
    ]);
    expect(result.skillGroup).toEqual([{ value: 'group', label: 'group' }]);
    expect(result.skillSlot).toEqual([{ value: 'slot', label: 'slot' }]);
    expect(result.buff).toEqual([{ value: 'localBuff', label: 'localBuff' }]);
    expect(result.abilityEntity).toEqual([{ value: 'localEntity', label: 'localEntity' }]);
    expect(JSON.stringify(result)).not.toContain('entity-child');
  });

  it('includes explicit shared catalogs and keeps local IDs unique', () => {
    const result = operatorReferenceChoices(owner, [
      {
        id: 'common',
        buffDefinitions: { localBuff: {}, sharedBuff: {} },
        abilityEntityDefinitions: { sharedEntity: {} },
      } as unknown as import('../../core/game-data/gameDataRepository').CommonDefinitionSource,
    ]);
    expect(result.buff.map(choice => choice.value)).toEqual(['localBuff', 'sharedBuff']);
    expect(result.abilityEntity.map(choice => choice.value)).toEqual([
      'localEntity',
      'sharedEntity',
    ]);
  });

  it('never imports another owner or invents candidates for absent optional catalogs', () => {
    const other = { slug: 'other', skillGroups: [] } as unknown as OperatorDefinition;
    expect(operatorReferenceChoices(other)).toEqual({
      skillGroup: [],
      skillSlot: [],
      skill: [],
      buff: [],
      abilityEntity: [],
    });
    expect(operatorReferenceChoices(owner).buff[0]?.value).toBe('localBuff');
  });
});
