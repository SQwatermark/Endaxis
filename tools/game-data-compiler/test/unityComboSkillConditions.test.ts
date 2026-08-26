import { describe, expect, it } from 'vitest';
import { unityComboConditionFixture } from './unityComboConditionFixture.ts';
import { parseUnityComboSkillConditionsSource } from '../src/source/unityComboSkillConditions.ts';
import { compilePendingComboConditionSource } from '../src/compiler/comboSkillConditions.ts';
import { parseObjectTypeMask } from '../src/source/objectType.ts';
const projection = {
  actionOwnerTarget: 'caster',
  actionSourceTarget: 'caster',
  actionTargetTarget: 'eventTarget',
} as const;
function parse(fixture = unityComboConditionFixture()) {
  return parseUnityComboSkillConditionsSource(
    fixture.conditions,
    fixture.references,
    'character.combo',
  );
}

describe('Unity RID 条件适配', () => {
  it('真实五条最小切片的 14 个叶子进入同一公共编译入口并保留来源', () => {
    const fixture = unityComboConditionFixture();
    const source = parse(fixture);
    expect(source.referenceSources).toHaveLength(14);
    expect(source.referenceSources[0]).toMatchObject({ rid: '2708501211437859822' });
    expect(source.referenceSources[0]!.source).toBe(fixture.references['2708501211437859822']);
    const compiled = source.conditions.map(c => compilePendingComboConditionSource(c, projection));
    expect(compiled.map(c => c.event)).toEqual(Array(5).fill('beforeTakeInfliction'));
    expect(compiled[1]!.sequence).toMatchObject({
      steps: [
        {
          parameters: {
            condition: {
              kind: 'contextTargetObjectTypeMatch',
              contextKey: 'trigger',
              objectTypeMask: 16,
            },
          },
        },
      ],
    });
    expect(compiled[4]!.sequence.steps).toHaveLength(1);
    // 原生 DebugPrint 的 Target 不被读取；纯查询之前的 Debug no-op 不阻塞条件。
    expect(compiled[4]!.sequence.steps[0]).toMatchObject({
      kind: 'conditional',
      parameters: {
        condition: { kind: 'actionValueCompare' },
      },
    });
  });
  it.each([
    'missing',
    'rid',
    'partial',
    'assembly',
    'type',
    'priority',
    'extra',
    'selector',
    'query',
  ] as const)('%s 来源损坏必须失败', fault => {
    const f = unityComboConditionFixture();
    const r = f.references['2708501211437859822']!;
    if (fault === 'missing') delete f.references[r.rid];
    if (fault === 'rid') r.rid = '1';
    if (fault === 'partial') r.decodeStatus = 'partial';
    if (fault === 'assembly') r.assembly = 'Other';
    if (fault === 'type') r.class = 'Unknown/Data';
    if (fault === 'priority') r.data.priorityLevel = 123;
    if (fault === 'extra') r.data.futureField = 1;
    if (fault === 'selector')
      (r.data.target as { selectorData: { finderData: string } }).selectorData.finderData = '123';
    if (fault === 'query') {
      const query = f.references['2708501211437859826']!.data.tagQuery as {
        queryType: { name: string };
      };
      query.queryType.name = 'HasAll';
    }
    expect(() => parse(f)).toThrow('character.combo');
  });
  it('关闭的对象 Target 不造成假阻塞，开启时仍拒绝未实现 InputTarget 查询', () => {
    const f = unityComboConditionFixture();
    const data = f.references['2708501211437859822']!.data;
    const target = data.target as { targetSource: number; targetGroupKey: string };
    target.targetSource = 0;
    target.targetGroupKey = '';
    expect(() => compilePendingComboConditionSource(parse(f).conditions[0]!, projection)).toThrow(
      'InputTarget',
    );
    data.isEnable = false;
    expect(() =>
      compilePendingComboConditionSource(parse(f).conditions[0]!, projection),
    ).not.toThrow();
  });
  it('BuffIdCount 保留来源但不错误降级成实例数或增强层数', () => {
    const f = unityComboConditionFixture();
    f.references['2708501211437859826']!.data.buffStackNumType = 1;
    expect(() => compilePendingComboConditionSource(parse(f).conditions[1]!, projection)).toThrow(
      'unsupported',
    );
  });
  it.each([
    [16, 16],
    ['Enemy', 16],
    ['Enemy, Character', 24],
    ['All', -1],
    ['0', 0],
    ['EnemyAll', 16400],
  ] as const)('ObjectType %s → %s', (value, mask) => {
    expect(parseObjectTypeMask(value, 'mask')).toBe(mask);
  });
  it.each([null, true, '', 'Unknown', 'Enemy,', 0.5, 2147483648, -2147483649])(
    '非法 ObjectType %j 拒绝',
    value => {
      expect(() => parseObjectTypeMask(value, 'mask')).toThrow('mask');
    },
  );
});
