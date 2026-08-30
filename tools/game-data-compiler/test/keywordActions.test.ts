import { fixtureGameplayTagRegistry } from './gameplayTagFixtures.ts';
import { describe, expect, it } from 'vitest';
import fixture from './fixtures/avywenna-vulnerable-buffs.json';
import { parseKnownNativeActionLeafSource } from '../src/source/actionLeaf.ts';
import {
  parseReferenceAwareBuffActionGraphSource,
  collectBuffActionReferences,
} from '../src/source/buffActionGraph.ts';
import { parseBuffRuntimeSource } from '../src/source/buffRuntime.ts';
import {
  compileBuffRuntimeDefinitionSource,
  collectBuffRuntimeClosure,
} from '../src/compiler/buffRuntimeProjection.ts';
import { scalarFixture } from './sourceFixtures.ts';
import { collectCompiledBuffIdentityReadIds } from '../src/compiler/compiledBuffReferences.ts';

const rootId = 'buff_chr_0012_avywen_ultimate_skill_debuff';
const carrierId = 'buff_common_affixes_vulnerable_pulse';
const rawAction = fixture[rootId].buffEventAction[0]!.actions[0]!.actionData[0]!;

describe('原生关键词 Buff 来源与引用边界', () => {
  it('原始易伤动作保留 Source/Target、动态倍率及独立的父子/动作寿命开关', () => {
    expect(parseKnownNativeActionLeafSource(rawAction, 'action', {})).toMatchObject({
      family: 'keywordBuff',
      action: {
        keyword: 'Vulnerable',
        subType: 'Pulse',
        carrierBuffId: carrierId,
        source: { targetSource: 'Source' },
        target: { targetSource: 'Target' },
        duration: { blackboardKey: 'pulse_vul_duration' },
        rate: { blackboardKey: 'pulse_vul_rate' },
        overrideChildBuffId: false,
        childBuffId: { value: '', blackboardKey: null },
        asChildBuff: true,
        autoFinishByAction: false,
        enhancements: [],
      },
    });
    const graph = parseReferenceAwareBuffActionGraphSource(fixture[rootId], 'buff', {});
    expect(collectBuffActionReferences(graph)).toEqual([
      expect.objectContaining({
        kind: 'buff',
        usage: 'keywordCarrier',
        id: carrierId,
        state: 'active',
      }),
    ]);
  });

  it.each([
    ['All', 'all'],
    ['Spell', 'spell'],
    ['Physical', 'physical'],
    ['Natural', 'natural'],
    ['Fire', 'fire'],
    ['Crystal', 'crystal'],
    ['Pulse', 'pulse'],
  ])('按原生表识别 %s 的载体', (subType, suffix) => {
    expect(parseKnownNativeActionLeafSource({ ...rawAction, subType }, 'action', {})).toMatchObject(
      { action: { carrierBuffId: `buff_common_affixes_vulnerable_${suffix}` } },
    );
  });

  it('EnhancedAction 使用已取证增幅载体并保留字面 child 覆盖', () => {
    const action = {
      ...rawAction,
      $type: 'Beyond.Gameplay.Core.EnhancedAction+Data, Gameplay.Beyond',
      subType: 'Crystal',
      overrideChildBuffId: true,
      childBuffId: {
        useBlackboardKey: false,
        value: 'buff_chr_0011_seraph_ultimate_effect',
        blackboardKey: '',
      },
    };
    expect(parseKnownNativeActionLeafSource(action, 'action', {})).toMatchObject({
      family: 'keywordBuff',
      action: {
        keyword: 'Enhanced',
        carrierBuffId: 'buff_common_affixes_enhance_crystal',
      },
    });
    const changed = structuredClone(fixture[rootId]);
    changed.buffEventAction[0]!.actions[0]!.actionData[0] = action;
    expect(
      compileBuffRuntimeDefinitionSource(
        parseBuffRuntimeSource(changed, 'buff'),
        undefined,
        undefined,
        undefined,
        undefined,
        { gameplayTagRegistry: fixtureGameplayTagRegistry, ...{} },
      ),
    ).toMatchObject({
      lifecycleSequences: {
        enable: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: {
                buffId: 'buff_common_affixes_enhance_crystal',
                stringBlackboardAssignments: {
                  child_buff_id: 'buff_chr_0011_seraph_ultimate_effect',
                },
              },
            },
          ],
        },
      },
    });
  });

  it('SlowAction 使用原生无子类型载体并保留动态倍率', () => {
    const action = {
      ...rawAction,
      $type: 'Beyond.Gameplay.Core.SlowAction+Data, Gameplay.Beyond',
      rate: scalarFixture(0, 'move_speed_scalar'),
    };
    delete (action as Record<string, unknown>).subType;
    expect(parseKnownNativeActionLeafSource(action, 'action', {})).toMatchObject({
      family: 'keywordBuff',
      action: {
        keyword: 'Slow',
        subType: null,
        carrierBuffId: 'buff_common_affixes_slow',
        rate: { blackboardKey: 'move_speed_scalar' },
      },
    });
  });

  it('WeakAction 使用已取证的固定弱点倍率载体', () => {
    const action = {
      ...rawAction,
      $type: 'Beyond.Gameplay.Core.WeakAction+Data, Gameplay.Beyond',
      rate: scalarFixture(0, 'weak_scale'),
    };
    delete (action as Record<string, unknown>).subType;
    expect(parseKnownNativeActionLeafSource(action, 'action', {})).toMatchObject({
      family: 'keywordBuff',
      action: {
        keyword: 'Weak',
        subType: null,
        carrierBuffId: 'buff_common_affixes_weak',
        rate: { blackboardKey: 'weak_scale' },
      },
    });
  });

  it('SpeedupAction 使用固定载体并保留表现 child 覆盖', () => {
    const action = {
      ...rawAction,
      $type: 'Beyond.Gameplay.Core.SpeedupAction+Data, Gameplay.Beyond',
      rate: scalarFixture(0, 'ratio_speed'),
      overrideChildBuffId: true,
      childBuffId: {
        useBlackboardKey: false,
        value: 'buff_chr_0027_tangtang_water_icon',
        blackboardKey: '',
      },
    };
    delete (action as Record<string, unknown>).subType;
    expect(parseKnownNativeActionLeafSource(action, 'action', {})).toMatchObject({
      family: 'keywordBuff',
      action: {
        keyword: 'Speedup',
        subType: null,
        carrierBuffId: 'buff_common_affixes_speedup',
        rate: { blackboardKey: 'ratio_speed' },
        childBuffId: { value: 'buff_chr_0027_tangtang_water_icon' },
      },
    });
  });

  it('覆盖关闭时不追踪残留 child 字段，开启后保留动态引用', () => {
    const changed = structuredClone(fixture[rootId]);
    const action = changed.buffEventAction[0]!.actions[0]!.actionData[0]!;
    action.childBuffId = {
      useBlackboardKey: true,
      value: 'ignored-default',
      blackboardKey: 'child',
    };
    const references = () =>
      collectBuffActionReferences(parseReferenceAwareBuffActionGraphSource(changed, 'buff', {}));
    expect(references()).toHaveLength(1);
    action.overrideChildBuffId = true;
    expect(references()).toContainEqual(
      expect.objectContaining({
        usage: 'keywordChildOverride',
        state: 'dynamic',
        id: 'ignored-default',
        blackboardKey: 'child',
      }),
    );
    action.isEnable = false;
    expect(references().every(item => item.state === 'inactive')).toBe(true);
  });

  it('动态引用附带非空字面残留时也不能按该 ID 追踪', () => {
    const changed = structuredClone(fixture);
    const action = changed[rootId].buffEventAction[0]!.actions[0]!.actionData[0]!;
    action.overrideChildBuffId = true;
    action.childBuffId = { useBlackboardKey: true, value: 'stale-id', blackboardKey: 'child' };
    expect(() => collectBuffRuntimeClosure([rootId], changed)).toThrow(
      /childBuffId: dynamic Buff references/,
    );
  });

  it.each(['Assign', 'Add', 'Multiply'])('保留 %s 增强的匹配 ID 和运行时值', operationType => {
    const action = {
      ...rawAction,
      enhancingList: [{ buffIds: ['trigger'], operationType, value: scalarFixture(0, 'extra') }],
    };
    expect(parseKnownNativeActionLeafSource(action, 'action', {})).toMatchObject({
      action: {
        enhancements: [
          { buffIds: ['trigger'], operation: operationType, value: { blackboardKey: 'extra' } },
        ],
      },
    });
  });

  it.each([
    { subType: 'Ether' },
    { newField: true },
    { enhancingList: [{ buffIds: ['trigger'], operationType: 'Divide', value: scalarFixture(1) }] },
  ])('未知子类型、运算或字段不能静默吞掉', changes => {
    expect(() =>
      parseKnownNativeActionLeafSource({ ...rawAction, ...changes }, 'action', {}),
    ).toThrow(/action/);
  });

  it('无覆盖关键词会发现默认 child；缺少数据仍然失败', () => {
    expect(() => collectBuffRuntimeClosure([rootId], fixture)).toThrow(
      /missing Buff definition.*default_child/,
    );
    expect(
      compileBuffRuntimeDefinitionSource(
        parseBuffRuntimeSource(fixture[rootId], 'buff'),
        undefined,
        undefined,
        undefined,
        undefined,
        { gameplayTagRegistry: fixtureGameplayTagRegistry, ...{} },
      ),
    ).toMatchObject({
      lifecycleSequences: {
        enable: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: { buffId: carrierId, target: 'buffOwner', asChildBuff: true },
            },
          ],
        },
      },
    });
  });

  it('动态 child 覆盖不会退化成普通施加', () => {
    const changed = structuredClone(fixture[rootId]);
    Object.assign(changed.buffEventAction[0]!.actions[0]!.actionData[0]!, {
      overrideChildBuffId: true,
      childBuffId: { useBlackboardKey: true, value: '', blackboardKey: 'child' },
    });
    expect(() =>
      compileBuffRuntimeDefinitionSource(
        parseBuffRuntimeSource(changed, 'buff'),
        undefined,
        undefined,
        undefined,
        undefined,
        { gameplayTagRegistry: fixtureGameplayTagRegistry, ...{} },
      ),
    ).toThrow(/dynamic or empty keyword child override/);
  });

  it('增强名单保留为本次关键词载体实例的加入边沿规则', () => {
    const changed = structuredClone(fixture[rootId]);
    Object.assign(changed.buffEventAction[0]!.actions[0]!.actionData[0]!, {
      enhancingList: [
        { buffIds: ['trigger'], operationType: 'Add', value: scalarFixture(0, 'extra') },
      ],
    });
    const definition = compileBuffRuntimeDefinitionSource(
      parseBuffRuntimeSource(changed, 'buff'),
      undefined,
      undefined,
      undefined,
      undefined,
      { gameplayTagRegistry: fixtureGameplayTagRegistry, ...{} },
    );
    expect(definition).toMatchObject({
      lifecycleSequences: {
        enable: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: {
                keywordEnhancements: [
                  {
                    triggerBuffIds: ['trigger'],
                    operation: 'add',
                    value: { kind: 'blackboard', key: 'extra' },
                  },
                ],
              },
            },
          ],
        },
      },
    });
    expect(collectCompiledBuffIdentityReadIds(definition)).toContain('trigger');
  });

  it('用已证明的 Buff 来源身份解析 Source 到干员自身', () => {
    const changed = structuredClone(fixture[rootId]);
    const action = changed.buffEventAction[0]!.actions[0]!.actionData[0]!;
    action.target = structuredClone(action.source);
    expect(
      compileBuffRuntimeDefinitionSource(
        parseBuffRuntimeSource(changed, 'buff'),
        undefined,
        undefined,
        undefined,
        undefined,
        {
          gameplayTagRegistry: fixtureGameplayTagRegistry,
          fixedBuffOwnerTarget: 'caster',
          fixedBuffSourceTarget: 'caster',
        },
      ),
    ).toMatchObject({
      lifecycleSequences: {
        enable: {
          steps: [
            {
              kind: 'applyBuff',
              parameters: { target: 'caster' },
            },
          ],
        },
      },
    });
  });
});
