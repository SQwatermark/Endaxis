import { expect, it } from 'vitest';
import {
  contributionBlackboardFields,
  handlerInspectorFields,
} from './contributionInspectorSchema';
import { createDefinitionEditContext, projectDefinitionProperty } from './definitionEditContext';
import type {
  EquipmentContributionDefinition,
  EquipmentEventHandlerDefinition,
} from '../../core/game-data/equipmentDefinition';

it('事件元数据使用契约枚举，不暴露另一事件族或图结构；优先级支持省略', () => {
  const value: EquipmentEventHandlerDefinition = {
    key: 'a',
    abilityEvent: 'enterFight',
    sequence: { steps: [] },
  };
  const fields = handlerInspectorFields(value);
  expect(fields.map(field => field.key)).toEqual(['key', 'priority', 'abilityEvent', 'blackboard']);
  expect(fields[2]!.options).toContain('outputBuff');
  expect(fields[2]!.optional).toBe(false);
  const priority = fields[1]!;
  const updated = priority.write(value, 12);
  expect(updated).toEqual({ ...value, priority: 12 });
  expect(priority.toggle(updated, false)).toEqual(value);
  expect(
    handlerInspectorFields({
      key: 'b',
      event: { kind: 'operatorHit' },
      sequence: value.sequence,
    }).map(field => field.key),
  ).toEqual(['key', 'priority', 'blackboard']);
});

it('两处黑板保留等级数组，空值显示可新增字典，最后一项删除省略字段', () => {
  const handler: EquipmentEventHandlerDefinition = {
    key: 'a',
    abilityEvent: 'enterFight',
    sequence: { steps: [] },
  };
  const field = handlerInspectorFields(handler).find(field => field.key === 'blackboard')!;
  expect(field.editor).toBe('dictionary');
  expect(field.element).toEqual({ type: 'levelValues' });
  expect(field.read(handler)).toEqual({});
  const updated = field.write(handler, { rate: [1, 2, 3] });
  expect(updated.blackboard).toEqual({ rate: [1, 2, 3] });
  expect(field.write(updated, {})).toEqual(handler);
  expect(field.write(handler, { rate: 'invalid' })).toBe(handler);
});

it('黑板子句柄沿父字段清理规则提交，读取最新根并保留完整字面键路径', () => {
  let draft: EquipmentContributionDefinition = {};
  const focuses: unknown[] = [];
  const context = createDefinitionEditContext({
    read: () => draft,
    commit: (next, focus) => {
      draft = next;
      focuses.push(focus);
    },
  });
  const field = contributionBlackboardFields[0]!;
  const dictionary = projectDefinitionProperty(
    context.root,
    ['initializationBlackboard'],
    value => field.read(value as EquipmentContributionDefinition),
    (value, input) => field.write(value as EquipmentContributionDefinition, input),
  );
  dictionary.update(() => ({ 'a.b': [1, 2] }));
  dictionary.child('a.b').update(() => [3, 4]);
  expect(draft.initializationBlackboard).toEqual({ 'a.b': [3, 4] });
  expect(focuses[1]).toEqual(['initializationBlackboard', 'a.b']);
  dictionary.update(() => ({}));
  expect(draft).not.toHaveProperty('initializationBlackboard');
  dictionary.update(() => ({ next: 5 }));
  expect(draft.initializationBlackboard).toEqual({ next: 5 });
  expect(focuses).toHaveLength(4);
});
