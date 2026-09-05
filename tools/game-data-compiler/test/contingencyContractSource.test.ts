import { describe, expect, it } from 'vitest';
import {
  collectContingencyContractGlobalBuffIds,
  parseContingencyContractCatalogSource,
} from '../src/domains/mechanics/contingencyContractSource.ts';

function tag(tagId: number, termType: number, buffId: string) {
  return {
    desc: { id: 1, text: '' },
    icon: `icon_${tagId}`,
    name: { id: 2, text: '' },
    romanNumSuffix: '',
    score: 1,
    tagId,
    tagTerms: [{ blackboard: [{ key: 'value', value: 0.5, valueStr: '' }], buffId, termType }],
  };
}

function entry(tagId: number) {
  return {
    canPreview: false,
    conflictId: '',
    groupId: 10,
    keyId: '',
    lockIds: [],
    tagId,
    unlockActivityStage: '',
    unlockScore: 0,
  };
}

describe('Contingency Contract native source', () => {
  it('keeps native column order and recovers the three explicit term identities', () => {
    const result = parseContingencyContractCatalogSource(
      {
        100201: tag(100201, 1, 'buff_enemy'),
        100003: tag(100003, 2, 'global_buff_party'),
        102101: tag(102101, 3, 'global_buff_level_countdown_reduce'),
      },
      {
        indie_contract001: {
          activityId: 'activity_contingency_contract_0',
          contractGroupMap: {
            10: { contractMap: { 1: entry(102101) } },
            2: { contractMap: { 1: entry(100201), 2: entry(100003) } },
          },
        },
      },
    );

    expect(result.contracts[0]?.columns.map(column => column.id)).toEqual(['2', '10']);
    expect(result.tags.map(item => item.terms[0]?.kind)).toEqual([
      'selfGlobalBuff',
      'enemyBuff',
      'reduceChallengeTime',
    ]);
    expect(collectContingencyContractGlobalBuffIds(result)).toEqual(['global_buff_party']);
  });

  it('rejects unknown term enums instead of inferring their target from the Buff ID', () => {
    expect(() =>
      parseContingencyContractCatalogSource(
        { 100201: tag(100201, 4, 'buff_unknown') },
        {
          indie_contract001: {
            activityId: 'activity',
            contractGroupMap: { 1: { contractMap: { 1: entry(100201) } } },
          },
        },
      ),
    ).toThrow('unknown native enum 4');
  });

  it('requires every tag to belong to the contract layout', () => {
    expect(() =>
      parseContingencyContractCatalogSource(
        { 100201: tag(100201, 1, 'buff_enemy'), 100202: tag(100202, 1, 'buff_enemy') },
        {
          indie_contract001: {
            activityId: 'activity',
            contractGroupMap: { 1: { contractMap: { 1: entry(100201) } } },
          },
        },
      ),
    ).toThrow('tags are not present');
  });
});
