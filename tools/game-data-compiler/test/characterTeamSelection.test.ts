import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { parseCharacterTeamSelection } from '../src/source/selectorFacts.ts';
import { parseTargetGroupActionSource } from '../src/source/targetGroup.ts';
import { requireRecord } from '../src/source/primitives.ts';
import { parseNativeSequenceSource } from '../src/source/controlFlow.ts';
import { parseKnownNativeActionLeafSource } from '../src/source/actionLeaf.ts';
import { compileCombatActionSequenceSource } from '../src/compiler/buffRuntimeProjection.ts';
import { targetFixture } from './sourceFixtures.ts';

function queries(): { selectorData: { postProcessorData: Record<string, unknown>[] } }[] {
  return JSON.parse(
    readFileSync(new URL('./fixtures/ember-combo-target-queries.json', import.meta.url), 'utf8'),
  );
}

function compileQueries(raw: unknown[] = queries()) {
  const source = parseNativeSequenceSource(
    {
      actionData: raw,
      onlyExecuteWhenSourceIsMainChar: false,
      onlyExecuteWhenSourceIsGuard: false,
    },
    'ember.combo',
    {},
    (value, path) => parseKnownNativeActionLeafSource(value, path, {}),
  );
  return compileCombatActionSequenceSource(source, {
    actionOwnerTarget: 'caster',
    actionSourceTarget: 'caster',
    actionTargetTarget: 'enemy',
  });
}

describe('CharacterTeamFinder 来源事实', () => {
  it('把真实余烬双查询投影为有序的队伍身份快照步骤', () => {
    expect(compileQueries()).toEqual({
      steps: [
        {
          kind: 'findCharacterTeamTargets',
          parameters: {
            saveToContextKey: 'Main',
            selection: { kind: 'controlledOperator' },
          },
        },
        {
          kind: 'findCharacterTeamTargets',
          parameters: {
            saveToContextKey: 'CureTarget',
            selection: {
              kind: 'lowestHealthRatioOperator',
              excludedContextKey: 'Main',
            },
          },
        },
      ],
    });
  });

  it('能力实体 ActionOwner 不改变 CharacterTeamFinder 的全局队伍候选', () => {
    const source = parseNativeSequenceSource(
      {
        actionData: queries(),
        onlyExecuteWhenSourceIsMainChar: false,
        onlyExecuteWhenSourceIsGuard: false,
      },
      'abilityEntity.teamQueries',
      {},
      (value, path) => parseKnownNativeActionLeafSource(value, path, {}),
    );
    const result = compileCombatActionSequenceSource(source, {
      actionOwnerTarget: 'currentAbilityEntity',
      actionSourceTarget: 'caster',
      actionTargetTarget: 'currentOperator',
    });

    expect(result.steps[1]).toEqual({
      kind: 'findCharacterTeamTargets',
      parameters: {
        saveToContextKey: 'CureTarget',
        selection: {
          kind: 'lowestHealthRatioOperator',
          excludedContextKey: 'Main',
        },
      },
    });
  });

  it('排除引用携带未经审计的空间设置时拒绝投影', () => {
    const raw = queries();
    const excluded = requireRecord(
      raw[1]!.selectorData.postProcessorData[0]!.excludedTargetSettings,
      'excludedTargetSettings',
    );
    excluded.centerToGround = true;
    expect(() => compileQueries(raw)).toThrow('unaudited single-enemy action target group');
  });

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

  it('仅在动作 Owner 已证明为施术者时，排除 Owner 后选择最低血量队友', () => {
    const raw = queries();
    raw[1]!.selectorData.postProcessorData[0]!.excludedTargetSettings = targetFixture('Owner');
    expect(compileQueries(raw).steps[1]).toEqual({
      kind: 'findCharacterTeamTargets',
      parameters: {
        saveToContextKey: 'CureTarget',
        selection: { kind: 'lowestHealthRatioOperator', excludeCaster: true },
      },
    });

    const source = parseNativeSequenceSource(
      {
        actionData: raw,
        onlyExecuteWhenSourceIsMainChar: false,
        onlyExecuteWhenSourceIsGuard: false,
      },
      'ember.combo',
      {},
      (value, path) => parseKnownNativeActionLeafSource(value, path, {}),
    );
    expect(() =>
      compileCombatActionSequenceSource(source, {
        actionOwnerTarget: 'unavailable',
        actionSourceTarget: 'caster',
        actionTargetTarget: 'enemy',
      }),
    ).toThrow('unaudited single-enemy action target group');
  });

  it('把最低血量队友与已证明的施术者合并为稳定双目标组', () => {
    const raw = queries();
    raw[1]!.selectorData.postProcessorData[0]!.excludedTargetSettings = targetFixture('Owner');
    const actions: unknown[] = [
      ...raw,
      {
        $type: 'Beyond.Gameplay.Core.MergeTargetAction+Data, Gameplay.Beyond',
        isEnable: true,
        priorityLevel: 'Default',
        priorityOffset: 0,
        serverActionIndex: 35,
        targets: [
          { ...targetFixture('Context'), targetGroupKey: 'CureTarget' },
          targetFixture('Owner'),
        ],
        targetGroupKey: 'ShieldTargets',
      },
    ];

    expect(compileQueries(actions).steps.slice(-2)).toEqual([
      {
        kind: 'findCharacterTeamTargets',
        parameters: {
          saveToContextKey: 'CureTarget',
          selection: { kind: 'lowestHealthRatioOperator', excludeCaster: true },
        },
      },
      {
        kind: 'mergeContextTargets',
        parameters: {
          saveToContextKey: 'ShieldTargets',
          sources: [
            { kind: 'context', contextKey: 'CureTarget' },
            { kind: 'target', target: 'caster' },
          ],
        },
      },
    ]);
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
