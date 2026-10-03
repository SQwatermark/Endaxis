<script setup lang="ts">
import type { ActionGraphDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import type { BlackboardFieldContext } from '@/application/editor/blackboardFieldContext';
import GraphDataInputs from './GraphDataInputs.vue';
import { dataTypedInputs } from './typedGraphInputs';
import type { ReferenceChoices } from '../definition-editor/fieldInputConfig';
/** 数据节点参数编辑；数据来源只能通过图上的数据引脚替换。 */
import { computed, ref } from 'vue';
import type { ActionGraphDataNode } from '../../../packages/game-data-contract/src/actionGraph';
import { dataNodeSchemas } from './actionNodeSchemas.generated';
import { listDataInputs } from '../../core/action-graph/actionGraphDataNodes';
import { readNodeField } from './nodeFieldValues';
import { nodeName, nodeHelp } from './editorNodeText';
import NodeInspector from './NodeInspector.vue';
import type { BlackboardScope } from '../../application/editor/graphBlackboard';
import NodeInspectorFields from './NodeInspectorFields.vue';
const props = defineProps<{
  referenceChoices?: ReferenceChoices;
  blackboardContext?: BlackboardFieldContext;
  graph?: ActionGraphDefinition;
  readonly?: boolean;
  node: ActionGraphDataNode;
  nodeId: string;
  scopes?: readonly BlackboardScope[];
  scopeWarnings?: readonly string[];
  variableKeys?: readonly string[];
  apply: (expression: unknown) => boolean;
}>();
const emit = defineEmits<{
  pending: [value: boolean];
  changeData: [path: readonly string[], source: string | null, constant?: number | boolean];
  locateData: [id: string];
}>();
const schema = computed(() => dataNodeSchemas[`${props.node.type}:${props.node.expression.kind}`]);
const fields = computed(
  () =>
    schema.value?.fields.filter(
      field =>
        !dataTypedInputs(props.node).some(input => input.path.join('.') === field.path.join('.')) &&
        !listDataInputs(readNodeField(props.node.expression, field.path)).length,
    ) ?? [],
);
const choices = computed((): Readonly<Record<string, readonly string[]>> => {
  if (props.node.expression.kind === 'blackboard') return { key: props.variableKeys ?? [] };
  if (props.node.expression.kind === 'parameter') return { parameter: props.variableKeys ?? [] };
  return {};
});
const form = ref<InstanceType<typeof NodeInspectorFields>>();
defineExpose({ apply: () => form.value?.apply() ?? true });
</script>
<template>
  <NodeInspector
    :scopes="scopes"
    :scope-warnings="scopeWarnings"
    :title="nodeName(node.expression.kind)"
    :node-id="nodeId"
    :help="nodeHelp(node.expression.kind)"
  >
    <GraphDataInputs
      v-if="graph"
      :graph="graph"
      owner="data"
      :node-id="nodeId"
      :readonly="readonly"
      @change="(path, source, constant) => emit('changeData', path, source, constant)"
      @locate="emit('locateData', $event)"
    />
    <NodeInspectorFields
      :reference-choices="referenceChoices"
      :blackboard-context="blackboardContext"
      :readonly="readonly"
      ref="form"
      :value="node.expression"
      :kind="node.expression.kind"
      :fields="fields"
      :choices="choices"
      :apply-value="apply"
      @pending="emit('pending', $event)"
    />
  </NodeInspector>
</template>
