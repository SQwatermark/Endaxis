import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { parseCharacterTeamSelection } from '../src/source/selectorFacts.ts';
import { parseTargetGroupActionSource } from '../src/source/targetGroup.ts';
import { requireRecord } from '../src/source/primitives.ts';
import { targetFixture } from './sourceFixtures.ts';

function queries(): { selectorData: { postProcessorData: Record<string, unknown>[] } }[] {
  return JSON.parse(
    readFileSync(new URL('./fixtures/ember-combo-target-queries.json', import.meta.url), 'utf8'),
  );
}

describe('CharacterTeamFinder 来源事实', () => {
  it('从真实余烬查询读取主控验证器和最低血量筛选，保留排除引用', () => {
    const [main, cure] = queries();
    expect(parseTargetGroupActionSource(main, 'Main')?.characterTeamSelection).toEqual({
      kind: 'controlledOperator',
    });
    expect(parseTargetGroupActionSource(cure, 'CureTarget')?.characterTeamSelection).toMatchObject({
      kind: 'lowestHealthRatioOperator',
      excludedTarget: { targetSource: 'Context', targetGroupKey: 'Main' },
    });
  });

  it.each(['Main', 'saved-controller', 'arbitrary-group'])(
    '不从组名 %s 推断排除对象的身份',
    key => {
      const selector = queries()[1]!.selectorData;
      requireRecord(
        selector.postProcessorData[0]!.excludedTargetSettings,
        'excludedTargetSettings',
      ).targetGroupKey = key;
      expect(parseCharacterTeamSelection(selector, 'selector')).toMatchObject({
        kind: 'lowestHealthRatioOperator',
        excludedTarget: { targetSource: 'Context', targetGroupKey: key },
      });
    },
  );

  it('Owner 是来源事实，不能在来源层直接认成施法干员', () => {
    const selector = queries()[1]!.selectorData;
    selector.postProcessorData[0]!.excludedTargetSettings = targetFixture('Owner');
    expect(parseCharacterTeamSelection(selector, 'selector')).toMatchObject({
      kind: 'lowestHealthRatioOperator',
      excludedTarget: { targetSource: 'Owner', targetGroupKey: '' },
    });
  });

  it('没有排除处理器时显式保留 null，不隐含排除主控或自己', () => {
    const selector = queries()[1]!.selectorData;
    selector.postProcessorData.shift();
    expect(parseCharacterTeamSelection(selector, 'selector')).toEqual({
      kind: 'lowestHealthRatioOperator',
      excludedTarget: null,
    });
  });

  it.each([{ filterType: 'CurHpAsc' }, { maxNum: 2 }, { onlyReserveMaxPriorityTargets: true }])(
    '不把未经审计的 PriorityFilter 当成最低血量单目标查询：%j',
    change => {
      const selector = queries()[1]!.selectorData;
      Object.assign(selector.postProcessorData[1]!, change);
      expect(parseCharacterTeamSelection(selector, 'selector')).toBeNull();
    },
  );

  it('保留后处理器顺序，不把先选一个再排除改成先排除再选', () => {
    const selector = queries()[1]!.selectorData;
    selector.postProcessorData.reverse();
    expect(parseCharacterTeamSelection(selector, 'selector')).toBeNull();
  });
});
