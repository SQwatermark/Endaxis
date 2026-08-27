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
      compileBuffRuntimeDefinitionSource(parseBuffRuntimeSource(fixture[rootId], 'buff')),
    ).toMatchObject({ lifecycleSequences: { enable: { steps: [{
      kind: 'applyBuff', parameters: { buffId: carrierId, target: 'buffOwner', asChildBuff: true },
    }] } } });
  });

  it.each([{ overrideChildBuffId: true }, { enhancingList: [
    { buffIds: ['trigger'], operationType: 'Add', value: scalarFixture(1) },
  ] }])('尚未闭合的覆盖或增强不会退化成普通施加', change => {
    const changed = structuredClone(fixture[rootId]);
    Object.assign(changed.buffEventAction[0]!.actions[0]!.actionData[0]!, change);
    expect(() => compileBuffRuntimeDefinitionSource(parseBuffRuntimeSource(changed, 'buff')))
      .toThrow(/enhancements or child overrides/);
  });
});
