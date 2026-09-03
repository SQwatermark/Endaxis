import { describe, expect, it } from 'vitest';
import { isTyphoeaSelectedSingleEnemyTargetGroup } from '../src/compiler/combatProjectionCommon.ts';
import { gameplayTagIdFromPath } from '../src/source/nativeGameplayTags.ts';
import type { TargetGroupActionSource } from '../src/source/targetGroup.ts';

function typhoeaSelectedTarget(filterType: string): TargetGroupActionSource {
  return {
    producerType: 'FindTargetAction',
    finderType: 'TyphoeaArcherySelectedFinder',
    validatorTypes: ['TagValidator'],
    validatorTagQueries: [
      ['HasAny', [gameplayTagIdFromPath('Skill/Character/chr_0034_typhoea/Locked')]],
    ],
    postProcessorTypes: ['PriorityFilter'],
    priorityFilters: [
      {
        filterType,
        processTargetType: 0,
        onlyReserveMaxPriorityTargets: false,
        limitMaxNum: false,
        maxNum: 0,
        buffFilter: {
          checkType: 'Id',
          buffIds: [],
          tagQuery: { queryType: 'hasAny', tagIds: [] },
          stackCountType: 'BuffCount',
        },
      },
    ],
    shuffleTargets: [],
    distanceValidators: [],
    center: 'ActionSource',
    centerContextKey: '',
    selectorOwner: 'ActionOwner',
    selectorOwnerContextKey: '',
  } as unknown as TargetGroupActionSource;
}

describe('combatProjectionCommon', () => {
  it.each(['ScreenPosLeftToRight', 'ScreenPosRightToLeft', 'ScreenPosClosestToCenter'])(
    'keeps the proven Typhoeus selected enemy identity for %s',
    filterType => {
      expect(isTyphoeaSelectedSingleEnemyTargetGroup(typhoeaSelectedTarget(filterType))).toBe(true);
    },
  );

  it('does not accept an unrelated priority rule as the Typhoeus selected target proof', () => {
    expect(isTyphoeaSelectedSingleEnemyTargetGroup(typhoeaSelectedTarget('Random'))).toBe(false);
  });
});
