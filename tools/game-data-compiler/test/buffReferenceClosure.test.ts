import { describe, expect, it } from 'vitest';
import carriers from './fixtures/avywenna-vulnerable-buffs.json';
import children from './fixtures/avywenna-vulnerable-children.json';
import { collectBuffRuntimeClosure } from '../src/compiler/buffReferenceClosure.ts';
import { compileStandardStumpBuffClosure } from '../src/compiler/standardStumpBuffClosure.ts';

const root = 'buff_chr_0012_avywen_ultimate_skill_debuff';
const carrier = 'buff_common_affixes_vulnerable_pulse';
const child = 'buff_common_affixes_vulnerable_pulse_default_child';
const input = { ...carriers, ...children };

describe('有证据的关键词默认 child 依赖闭包', () => {
  it('自动发现原始四 Buff，输出保留动态键，VFX 单独归类省略', () => {
    const closure = compileStandardStumpBuffClosure([root], input);
    expect([...closure.sources.keys()].sort()).toEqual(Object.keys(input).sort());
    expect(Object.keys(closure.definitions).sort()).toEqual([root, carrier, child].sort());
    expect(closure.diagnostics.every(item => item.status === 'scenario-omitted')).toBe(true);
    expect(closure.definitions[carrier]!.lifecycleSequences?.enable?.steps[0]).toMatchObject({
      parameters: { buffId: { blackboardKey: 'child_buff_id' } },
    });
  });

  it('缺省/运行时可写声明、外部根和晚发现的普通创建来路不能冒充已证明的默认值', () => {
    expect(() => collectBuffRuntimeClosure([carrier], input)).toThrow(/dynamic Buff references/);
    const dynamic = structuredClone(input);
    dynamic[carrier].blackboard.find(item => item.key === 'child_buff_id')!.isDynamic = true;
    expect(() => collectBuffRuntimeClosure([root], dynamic)).toThrow(/dynamic Buff references/);
    const lateIncoming = structuredClone(input);
    lateIncoming[child].buffEventAction[0]!.actions[0]!.actionData[0]!.buffs[0]!.buffId = carrier;
    expect(() => collectBuffRuntimeClosure([root], lateIncoming)).toThrow(
      /dynamic Buff references/,
    );
  });

  it('按需读取同一依赖闭包，动态默认 child 不要求调用方预先全量加载', () => {
    const loaded: string[] = [];
    const data: Record<string, unknown> = input;
    const closure = collectBuffRuntimeClosure([root], id => {
      loaded.push(id);
      return data[id];
    });
    expect(loaded.sort()).toEqual(Object.keys(input).sort());
    expect(closure.size).toBe(4);
    expect(new Set(loaded).size).toBe(loaded.length);
  });

  it('只证明子依赖，不把关键词增强或 child 覆盖来源默认为空', () => {
    const override = structuredClone(input);
    override[root].buffEventAction[0]!.actions[0]!.actionData[0]!.overrideChildBuffId = true;
    expect(() => collectBuffRuntimeClosure([root], override)).toThrow(/dynamic Buff references/);
  });

  it('字面 child 覆盖形成显式依赖，动态覆盖仍失败关闭', () => {
    const override = structuredClone(input);
    const action = override[root].buffEventAction[0]!.actions[0]!.actionData[0]!;
    action.overrideChildBuffId = true;
    action.childBuffId = { useBlackboardKey: false, value: child, blackboardKey: '' };
    expect([...collectBuffRuntimeClosure([root], override).keys()]).toContain(child);

    action.childBuffId = { useBlackboardKey: true, value: child, blackboardKey: 'child' };
    expect(() => collectBuffRuntimeClosure([root], override)).toThrow(/dynamic Buff references/);
  });
});
