import { expect, it } from 'vitest';
import { writeFieldValue } from '../../core/editor/writeFieldValue';
import { actionNodeSchemas } from './actionNodeSchemas.generated';
import { containsActionGraph, parseNodeField, readNodeField } from './nodeFieldValues';

it('替换短路条件的第一个数据输入时保留数组与后续条件', () => {
  const value = {
    conditions: [
      { kind: 'constant', value: false },
      { kind: 'constant', value: true },
    ],
  };
  const changed = writeFieldValue(value, ['conditions', '0'], {
    kind: 'conditionNode',
    nodeId: 'check',
  });
  expect(changed).toEqual({
    conditions: [{ kind: 'conditionNode', nodeId: 'check' }, value.conditions[1]],
  });
  expect(value.conditions[0]!.value).toBe(false);
  expect(writeFieldValue(value, ['conditions', 0], value.conditions[1])).toEqual({
    conditions: [value.conditions[1], value.conditions[1]],
  });
  expect(() => writeFieldValue(value, ['conditions', 2], {})).toThrow('数组输入位置不存在');
  expect(() => writeFieldValue(value, ['__proto__', 'polluted'], true)).toThrow('原型字段');
});

it('枚举列表保留空选择与未设置的区别，并拒绝未知选项', () => {
  const field = actionNodeSchemas.dealDamage.fields.find(field => field.path.at(-1) === 'tags')!;
  expect(parseNodeField('[]', field)).toEqual([]);
  expect(() => parseNodeField('', field)).toThrow();
  expect(
    parseNodeField('', { ...field, valueSchema: { ...field.valueSchema, optional: true } }),
  ).toBeUndefined();
  expect(parseNodeField('["plungingAttack"]', field)).toEqual(['plungingAttack']);
  expect(() => parseNodeField('["unknown"]', field)).toThrow();
  expect(() => parseNodeField('"plungingAttack"', field)).toThrow();
});

it('字段更新保留兄弟参数与执行出口，不修改输入定义', () => {
  const action = {
    kind: 'dealStagger',
    parameters: { value: 2, targets: ['enemy'] },
    key: 'stable',
  };
  const changed = writeFieldValue(action, ['parameters', 'value'], 0);
  expect(changed).toEqual({ ...action, parameters: { ...action.parameters, value: 0 } });
  expect(action.parameters.value).toBe(2);
  expect(readNodeField(changed, ['parameters', 'targets'])).toBe(action.parameters.targets);
});

it('可选字段清空会删除字段，数值零仍保留', () => {
  const field = actionNodeSchemas.dealStagger.fields.find(
    field => field.path.join('.') === 'parameters.value',
  )!;
  expect(parseNodeField('0', field)).toBe(0);
  const key = actionNodeSchemas.dealStagger.fields.find(field => field.path[0] === 'key')!;
  expect(parseNodeField('', key)).toBeUndefined();
  expect(writeFieldValue({ key: 'old' }, key.path, undefined)).toEqual({});
});

it('识别藏在实体模板和回调数组中的独立图，不把普通控制引用当成资源', () => {
  expect(
    containsActionGraph({ childSkills: [{ actionGraph: { main: { nodes: {} }, macros: {} } }] }),
  ).toBe(true);
  expect(containsActionGraph({ body: { $sequence: 'a' } })).toBe(false);
});

it('error labels come from the path or the caller, never copied schema text', () => {
  const field = {
    path: ['parameters', 'amount'],
    description: '',
    control: 'number' as const,
    valueSchema: { kind: 'number' as const },
  };
  expect(() => parseNodeField('true', field)).toThrow('amount 必须是有限数值');
  expect(() => parseNodeField('true', field, 'Amount')).toThrow('Amount 必须是有限数值');
  expect(() => parseNodeField('', field)).toThrow();
  expect(
    parseNodeField('', { ...field, valueSchema: { ...field.valueSchema, optional: true } }),
  ).toBeUndefined();
});
