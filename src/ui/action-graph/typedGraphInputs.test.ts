import { expect, it } from 'vitest';
import { actionTypedInputs, dataTypedInputs } from './typedGraphInputs';
import { listDataInputs } from '../../core/action-graph/actionGraphDataNodes';

it('projects optional and mixed numeric operands from their schema without inventing a value', () => {
  const action = { kind: 'dealStagger' as const, parameters: { value: [1, 2] } };
  expect(actionTypedInputs(action)).toEqual([
    { path: ['parameters', 'value'], type: 'number', source: null, value: [1, 2] },
    { path: ['parameters', 'valueMultiplier'], type: 'number', source: null, value: undefined },
  ]);
  expect(action).toEqual({ kind: 'dealStagger', parameters: { value: [1, 2] } });
});
it('projects boolean conditions and existing record values but never string pins or phantom keys', () => {
  expect(
    actionTypedInputs({
      kind: 'conditional',
      parameters: { condition: { kind: 'constant', value: false } },
      whenTrue: { $sequence: null },
      whenFalse: { $sequence: null },
    }),
  ).toEqual([
    {
      path: ['parameters', 'condition'],
      type: 'boolean',
      source: null,
      value: { kind: 'constant', value: false },
    },
  ]);
  const inputs = actionTypedInputs({
    kind: 'applyBuff',
    parameters: {
      target: 'caster',
      buffId: { blackboardKey: 'buff' },
      blackboardAssignments: { power: [2, 3] },
      stringBlackboardAssignments: { name: 'label' },
    },
  });
  expect(inputs.map(input => input.path.join('.'))).toEqual([
    'parameters.count',
    'parameters.blackboardAssignments.power',
  ]);
  expect(inputs.every(input => input.type === 'number')).toBe(true);
});
it('keeps one input for a declared condition, rather than exposing its implementation twice', () => {
  const inputs = actionTypedInputs({
    kind: 'conditional',
    parameters: {
      condition: {
        kind: 'actionValueCompare',
        left: { kind: 'constant', value: 1 },
        operator: 'equal',
        right: { kind: 'blackboard', key: 'n' },
      },
    },
    whenTrue: { $sequence: null },
    whenFalse: { $sequence: null },
  });
  expect(inputs).toHaveLength(1);
  expect(inputs[0]?.type).toBe('boolean');
  expect(
    dataTypedInputs({
      type: 'boolean',
      expression: {
        kind: 'actionValueCompare',
        left: { kind: 'constant', value: 1 },
        operator: 'equal',
        right: { kind: 'valueNode', nodeId: 'read' },
      },
    }).map(input => [input.path, input.type, input.source]),
  ).toEqual([
    [['left'], 'number', null],
    [['right'], 'number', 'read'],
  ]);
});
it('explicit non-connectable declarations suppress expression-shaped lookalikes', () => {
  const lookalike = { kind: 'constant', value: true };
  expect(
    listDataInputs(
      {
        number: lookalike,
        string: lookalike,
        build: lookalike,
        copies: { destination: lookalike },
        strings: { destination: lookalike },
      },
      [
        { path: ['number'], semantics: { type: 'number' } },
        { path: ['string'], semantics: { aliases: ['ActionStringOperand'] } },
        { path: ['build'], semantics: { aliases: ['BuildCondition'] } },
        { path: ['copies'], semantics: { recordValue: { type: 'string' } } },
        { path: ['strings'], semantics: { recordValue: { type: 'string' } } },
      ],
    ),
  ).toEqual([]);
});
it('preserves existing operands inside unmodeled container objects and explicit depth boundaries', () => {
  const expression = { kind: 'constant', value: 3 };
  const result = listDataInputs(
    {
      items: [{ value: expression }],
      record: { key: expression },
      shallow: { value: expression },
      deep: { value: expression },
    },
    [
      { path: ['items'], semantics: { arrayElement: { type: '{ value: ActionValueOperand }' } } },
      { path: ['record'], semantics: { recordValue: { aliases: ['ActionValueOperand'] } } },
      { path: ['deep'], fallback: { reason: 'depth-limit' } },
    ],
  );
  expect(result.map(input => input.path.join('.')).sort()).toEqual([
    'deep.value',
    'items.0.value',
    'record.key',
    'shallow.value',
  ]);
});

it('projects reordered condition-list items at their new indexed paths without duplicating nested inputs', () => {
  const shared = { kind: 'conditionNode' as const, nodeId: 'shared' };
  const inline = { kind: 'not' as const, condition: { kind: 'constant' as const, value: false } };
  const conditions = [shared, inline, shared];
  for (const kind of ['all', 'any'] as const) {
    expect(dataTypedInputs({ type: 'boolean', expression: { kind, conditions: [] } })).toEqual([]);
    const inputs = dataTypedInputs({
      type: 'boolean',
      expression: { kind, conditions: [inline, shared, shared] },
    });
    expect(inputs.map(input => [input.path, input.type, input.source])).toEqual([
      [['conditions', '0'], 'boolean', null],
      [['conditions', '1'], 'boolean', 'shared'],
      [['conditions', '2'], 'boolean', 'shared'],
    ]);
    expect(inputs[0]?.value).toBe(inline);
    expect(conditions).toEqual([shared, inline, shared]);
  }
});
