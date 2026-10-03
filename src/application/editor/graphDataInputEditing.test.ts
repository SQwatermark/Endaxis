import { expect, it } from 'vitest';
import type { ActionGraphDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import { actionTypedInputs, dataTypedInputs } from '../../ui/action-graph/typedGraphInputs';
import { setGraphDataInput } from './graphDataInputEditing';
import { updateResourceGraph } from './actionGraphResourceEditing';
import { DefinitionDraftSession } from './definitionDraftSession';

function fixture(): ActionGraphDefinition {
  return {
    nodes: {
      first: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'out',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'read' },
          },
        },
        next: 'second',
      },
      second: {
        action: {
          kind: 'modifyActionValue',
          parameters: {
            key: 'out',
            operation: 'assign',
            value: { kind: 'valueNode', nodeId: 'read' },
          },
        },
        next: null,
      },
      branch: {
        action: {
          kind: 'conditional',
          parameters: { condition: { kind: 'conditionNode', nodeId: 'test' } },
          whenTrue: { $sequence: null },
          whenFalse: { $sequence: null },
        },
        next: null,
      },
      optional: { action: { kind: 'dealStagger', parameters: { value: 2 } }, next: null },
    },
    dataNodes: {
      read: { type: 'number', expression: { kind: 'blackboard', key: 'count' } },
      test: {
        type: 'boolean',
        expression: {
          kind: 'actionValueCompare',
          left: { kind: 'valueNode', nodeId: 'read' },
          operator: 'equal',
          right: { kind: 'constant', value: 1 },
        },
      },
    },
  };
}
function input(graph: ActionGraphDefinition, id = 'first', path = 'parameters.value') {
  return actionTypedInputs(graph.nodes[id]!.action).find(input => input.path.join('.') === path)!;
}
it('requires an explicit correctly typed finite inline value; rejected disconnect keeps the old graph', () => {
  const graph = fixture();
  for (const value of [undefined, NaN, Infinity, true])
    expect(() => setGraphDataInput(graph, 'action', 'first', input(graph), null, value)).toThrow(
      '合法',
    );
  expect(() => setGraphDataInput(graph, 'action', 'first', input(graph), 'test')).toThrow('类型');
  expect(input(graph).source).toBe('read');
  expect(
    setGraphDataInput(graph, 'action', 'first', input(graph), null, 0).nodes.first!.action,
  ).toHaveProperty('parameters.value', { kind: 'constant', value: 0 });
});
it('swaps a single consumer atomically, preserving shared reads, undo/redo and saved data', () => {
  const source = { actionGraph: { main: fixture(), macros: {} } };
  const history = new DefinitionDraftSession(source, true);
  history.update(owner =>
    updateResourceGraph(owner, { kind: 'main' }, graph =>
      setGraphDataInput(graph, 'action', 'first', input(graph), null, 7),
    ),
  );
  const changed = history.current.actionGraph.main;
  expect(input(changed).value).toEqual({ kind: 'constant', value: 7 });
  expect(input(changed, 'second').source).toBe('read');
  expect(changed.dataNodes?.read).toEqual(source.actionGraph.main.dataNodes?.read);
  expect(history.undo()).toBe(true);
  expect(input(history.current.actionGraph.main).source).toBe('read');
  expect(history.canUndo).toBe(false);
  expect(history.redo()).toBe(true);
  expect(JSON.parse(JSON.stringify(history.exportDefinition()))).toEqual(history.current);
  history.update(owner =>
    updateResourceGraph(owner, { kind: 'main' }, graph =>
      setGraphDataInput(graph, 'action', 'first', input(graph), 'read'),
    ),
  );
  expect(input(history.current.actionGraph.main).source).toBe('read');
});
it('connects an unassigned schema input without creating a fabricated constant or variable', () => {
  const graph = fixture();
  const slot = input(graph, 'optional', 'parameters.valueMultiplier');
  expect(slot.value).toBeUndefined();
  const connected = setGraphDataInput(graph, 'action', 'optional', slot, 'read');
  expect(input(connected, 'optional', 'parameters.valueMultiplier').source).toBe('read');
  expect(connected.dataNodes).toBe(graph.dataNodes);
  expect(input(graph, 'optional', 'parameters.valueMultiplier').value).toBeUndefined();
});
it('boolean replacement and data-node input replacement share the same transaction boundary', () => {
  const graph = fixture();
  const bool = input(graph, 'branch', 'parameters.condition');
  expect(() => setGraphDataInput(graph, 'action', 'branch', bool, null, 0)).toThrow('合法');
  const changed = setGraphDataInput(graph, 'action', 'branch', bool, null, false);
  expect(input(changed, 'branch', 'parameters.condition').value).toEqual({
    kind: 'constant',
    value: false,
  });
  const left = dataTypedInputs(graph.dataNodes!.test!)[0]!;
  expect(
    setGraphDataInput(graph, 'data', 'test', left, null, 3).dataNodes?.test?.expression,
  ).toHaveProperty('left', { kind: 'constant', value: 3 });
});
it('cycles and illegal macro parameter use are rejected without adding undo history', () => {
  const original = fixture();
  const graph: ActionGraphDefinition = {
    ...original,
    dataNodes: {
      ...original.dataNodes,
      all: {
        type: 'boolean',
        expression: { kind: 'all', conditions: [{ kind: 'constant', value: true }] },
      },
      parameter: { type: 'number', expression: { kind: 'parameter', parameter: 'arg' } },
    },
  };
  const history = new DefinitionDraftSession({ actionGraph: { main: graph, macros: {} } }, true);
  expect(() =>
    history.update(owner =>
      updateResourceGraph(owner, { kind: 'main' }, current =>
        setGraphDataInput(current, 'action', 'first', input(current), 'parameter'),
      ),
    ),
  ).toThrow('parameter');
  expect(history.canUndo).toBe(false);
  expect(() =>
    history.update(owner =>
      updateResourceGraph(owner, { kind: 'main' }, current =>
        setGraphDataInput(
          current,
          'data',
          'all',
          dataTypedInputs(current.dataNodes!.all!)[0]!,
          'all',
        ),
      ),
    ),
  ).toThrow('recursive');
  expect(history.canUndo).toBe(false);
});
