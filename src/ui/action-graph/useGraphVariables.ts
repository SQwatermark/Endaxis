import { computed } from 'vue';
import type { ActionGraphDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import {
  analyzeGraphBlackboard,
  type BlackboardVariable,
} from '../../application/editor/graphBlackboard';
import {
  createBlackboardFieldContext,
  resolveBlackboardKey,
} from '../../application/editor/blackboardFieldContext';
import { setGraphDataInput } from '../../application/editor/graphDataInputEditing';
import { actionTypedInputs, dataTypedInputs } from './typedGraphInputs';
import type { EditorSelectionState } from '../editor/editorSelection';

/** 所有资源图共用变量来源分析、可选变量及读写节点创建。 */
export function useGraphVariables(context: {
  graph: () => ActionGraphDefinition;
  roots: () => readonly string[];
  parameters: () => readonly string[];
  initial: () => Readonly<Record<string, unknown>>;
  label: () => string;
  selection: EditorSelectionState;
}) {
  const analysis = computed(() =>
    analyzeGraphBlackboard(
      context.graph(),
      context.roots(),
      context.parameters(),
      context.initial(),
      context.label(),
    ),
  );
  const selectedScopes = computed(() => {
    const { selectedId, selectedDataId } = context.selection;
    const scopes = selectedId.value
      ? analysis.value.contexts.get(selectedId.value)
      : selectedDataId.value
        ? analysis.value.dataContexts.get(selectedDataId.value)
        : undefined;
    return [...(scopes ?? [])].flatMap(id => {
      const scope = analysis.value.scopes.get(id);
      return scope ? [scope] : [];
    });
  });
  const blackboardContext = computed(() => {
    const { selectedId, selectedDataId } = context.selection;
    return createBlackboardFieldContext(
      analysis.value,
      selectedId.value
        ? analysis.value.contexts.get(selectedId.value)
        : selectedDataId.value
          ? analysis.value.dataContexts.get(selectedDataId.value)
          : undefined,
    );
  });
  const variableKeys = computed(() => {
    const id = context.selection.selectedDataId.value;
    const expression = id ? context.graph().dataNodes?.[id]?.expression : undefined;
    return resolveBlackboardKey(blackboardContext.value, undefined, {
      mode: expression?.kind === 'parameter' ? 'parameter' : 'read',
      valueType: 'number',
    })
      .candidates.filter(candidate => candidate.selectable)
      .map(candidate => candidate.key);
  });
  function resolve(identity: string) {
    return analysis.value.variables.find(
      variable => JSON.stringify([variable.scope, variable.layer, variable.key]) === identity,
    );
  }
  function createNode(
    graph: ActionGraphDefinition,
    variable: BlackboardVariable,
    write: boolean,
    target?: { owner: 'action' | 'data'; id: string; path: readonly string[] },
  ): { graph: ActionGraphDefinition; id: string } {
    if (write && variable.layer === 'parameter') throw new Error('宏输入参数只允许读取。');
    const sourceContext = createBlackboardFieldContext(analysis.value, new Set([variable.scope]));
    const source = resolveBlackboardKey(sourceContext, variable.key, {
      mode: variable.layer === 'parameter' ? 'parameter' : write ? 'write' : 'read',
      valueType: 'number',
    });
    if (source.state === 'typeMismatch') throw new Error('字符串黑板变量不能创建数值数据节点。');
    let index = 1;
    let id: string;
    const collection = write ? graph.nodes : (graph.dataNodes ?? {});
    do {
      id = `${write ? 'node' : 'data'}_${index++}`;
    } while (Object.hasOwn(collection, id));
    if (write)
      return {
        id,
        graph: {
          ...graph,
          nodes: {
            ...graph.nodes,
            [id]: {
              action: {
                kind: 'modifyActionValue',
                parameters: {
                  key: variable.key,
                  operation: 'assign',
                  value: { kind: 'constant', value: 0 },
                },
              },
              next: null,
            },
          },
        },
      };
    const next: ActionGraphDefinition = {
      ...graph,
      dataNodes: {
        ...graph.dataNodes,
        [id]: {
          type: 'number',
          expression:
            variable.layer === 'parameter'
              ? { kind: 'parameter', parameter: variable.key }
              : { kind: 'blackboard', key: variable.key },
        },
      },
    };
    if (!target) return { id, graph: next };
    const environments =
      target.owner === 'action'
        ? analysis.value.contexts.get(target.id)
        : analysis.value.dataContexts.get(target.id);
    const destination = resolveBlackboardKey(
      createBlackboardFieldContext(analysis.value, environments),
      variable.key,
      { mode: variable.layer === 'parameter' ? 'parameter' : 'read', valueType: 'number' },
    );
    if (!destination.valid || (!environments?.size && variable.scope !== 'current'))
      throw new Error('该变量来自另一局部调用环境，不能在这里自动创建同名读取。');
    const action = target.owner === 'action' ? graph.nodes[target.id]?.action : undefined;
    const data = target.owner === 'data' ? graph.dataNodes?.[target.id] : undefined;
    const input = (action ? actionTypedInputs(action) : data ? dataTypedInputs(data) : []).find(
      input =>
        input.path.length === target.path.length &&
        input.path.every((part, index) => part === target.path[index]),
    );
    if (!input || input.type !== 'number') throw new Error('变量读取只能连接正式数值输入。');
    return { id, graph: setGraphDataInput(next, target.owner, target.id, input, id) };
  }
  return { analysis, selectedScopes, variableKeys, blackboardContext, resolve, createNode };
}
