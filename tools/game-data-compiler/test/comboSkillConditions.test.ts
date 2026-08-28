import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { describe, expect, it } from 'vitest';
import { parseComboSkillConditionsSource } from '../src/source/comboSkillConditions.ts';
import {
  compilePendingComboConditionSource,
  compileComboSkillConditionDefinitionSource,
} from '../src/compiler/comboSkillConditions.ts';
import { compileAbilitySystemBlackboardsSource } from '../src/compiler/abilitySystemBlackboards.ts';
import { parseAbilitySystemBlackboardsSource } from '../src/source/abilitySystemBlackboards.ts';
import { targetFixture } from './sourceFixtures.ts';

const context = {
  gameplayTagRegistry: fixtureGameplayTagRegistry,
  actionOwnerTarget: 'caster',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'eventTarget',
} as const;
function record(event = 121) {
  return {
    comboSkillEvent: event,
    comboSkillConditionImmediately: false,
    comboSkillCheckAction: {
      onlyExecuteWhenSourceIsMainChar: false,
      onlyExecuteWhenSourceIsGuard: false,
      actionData: [] as unknown[],
    },
  };
}
function parse(value: unknown) {
  return parseComboSkillConditionsSource(value, 'bundle.comboSkillConditions', {});
}

describe('公共连携条件来源与 Pending 编译', () => {
  it.each([true, false])('定义投影从已审计初值安装局部板（启用=%s），来源单独保留', enabled => {
    const pair = (key: string, valueDouble: number) => ({
      key,
      valueDouble,
      valueStr: '',
      isDynamic: true,
    });
    const blackboards = compileAbilitySystemBlackboardsSource(
      parseAbilitySystemBlackboardsSource(
        {
          entityBlackboard: [pair('EntityBB_value', 7)],
          skillDataBundle: {
            enableComboSkillBlackboard: enabled,
            comboSkillBlackboard: [pair('local', 3)],
          },
        },
        'character',
      ),
    );
    const source = parse([record()])[0]!;
    const result = compileComboSkillConditionDefinitionSource(
      source,
      blackboards,
      { key: 'check', skillGroupKey: 'combo' },
      context,
    );
    expect(result.definition).toEqual({
      key: 'check',
      skillGroupKey: 'combo',
      event: 'beforeTakeInfliction',
      initialValues: enabled ? { local: 3 } : null,
      sequence: { steps: [] },
    });
    expect(result.source.condition).toBe(source);
    expect(result.source.blackboards).toBe(blackboards.source);
    expect(result.definition).not.toHaveProperty('source');
    if (enabled)
      expect(result.definition.initialValues).not.toBe(blackboards.comboConditionInitialValues);
  });
  it('绑定必须明确提供身份，不能从游戏 ID 拼写猜技能组', () => {
    const blackboards = compileAbilitySystemBlackboardsSource(
      parseAbilitySystemBlackboardsSource(
        {
          entityBlackboard: [],
          skillDataBundle: { enableComboSkillBlackboard: true, comboSkillBlackboard: [] },
        },
        'character',
      ),
    );
    for (const binding of [
      { key: '', skillGroupKey: 'combo' },
      { key: 'check', skillGroupKey: '' },
    ])
      expect(() =>
        compileComboSkillConditionDefinitionSource(
          parse([record()])[0]!,
          blackboards,
          binding,
          context,
        ),
      ).toThrow('binding');
    expect(() =>
      compileComboSkillConditionDefinitionSource(
        parse([{ ...record(), comboSkillConditionImmediately: true }])[0]!,
        blackboards,
        { key: 'check', skillGroupKey: 'combo' },
        context,
      ),
    ).toThrow('immediate');
  });
  it('依赖 InputTarget 的条件不能被公共 Buff 投影误编译为敌人的 eventTarget', () => {
    const value = record();
    value.comboSkillCheckAction.actionData = [
      {
        $type: 'Beyond.Gameplay.Core.Conditions.CheckObjectTypeMatch+Data, Gameplay.Beyond',
        isEnable: true,
        priorityLevel: 'Default',
        priorityOffset: 0,
        serverActionIndex: 1,
        target: targetFixture('Target'),
        objectTypeMask: 16,
      },
    ];
    const source = parse([value])[0]!;
    expect(() => compilePendingComboConditionSource(source, context)).toThrow(
      'InputTarget projection is not installed',
    );
  });
  it.each([
    [126, 'beforeOutputInfliction'],
    [121, 'beforeTakeInfliction'],
    [129, 'afterOutputInfliction'],
    [130, 'afterTakeInfliction'],
  ] as const)('原生事件 %s → %s', (id, event) => {
    const source = parse([record(id)])[0]!;
    const result = compilePendingComboConditionSource(source, context);
    expect(result).toEqual({ source, event, sequence: { steps: [] } });
    expect(result.source.sourcePath).toBe('bundle.comboSkillConditions[0]');
  });
  it('按来源保留多条注册，不合并相同事件或空序列', () => {
    const source = parse([record(), record()]);
    expect(source).toHaveLength(2);
    expect(source[0]).not.toBe(source[1]);
    expect(parse([])).toEqual([]);
  });
  it.each([0, 125, 999])('未审计事件 %s 不能冒充支持', id => {
    expect(() => compilePendingComboConditionSource(parse([record(id)])[0]!, context)).toThrow(
      `unaudited combo event ${id}`,
    );
  });
  it('来源保留立即施法字段，但 Pending 编译拒绝偷换成开窗口', () => {
    const value = record();
    value.comboSkillConditionImmediately = true;
    const source = parse([value])[0]!;
    expect(source.immediately).toBe(true);
    expect(() => compilePendingComboConditionSource(source, context)).toThrow('immediate');
  });
  it.each(['onlyExecuteWhenSourceIsMainChar', 'onlyExecuteWhenSourceIsGuard'] as const)(
    '尚未接通 %s 时严格失败',
    flag => {
      const value = record();
      value.comboSkillCheckAction[flag] = true;
      expect(() => compilePendingComboConditionSource(parse([value])[0]!, context)).toThrow();
    },
  );
  it.each([
    null,
    {},
    [null],
    [{ ...record(), extraField: 1 }],
    [{ ...record(), comboSkillEvent: '121' }],
  ])('严格拒绝损坏形状 %j', value => {
    expect(() => parse(value)).toThrow('bundle.comboSkillConditions');
  });
  it('未展开 RID 不能当作空/无条件序列', () => {
    const value = record();
    value.comboSkillCheckAction.actionData = ['2708501211437859835'];
    expect(() => parse([value])).toThrow('comboSkillCheckAction');
  });
});
