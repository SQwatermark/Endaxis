<script setup lang="ts">
import type { ActionGraphDefinition } from '../../../packages/game-data-contract/src/actionGraph';
import type { BlackboardFieldContext } from '@/application/editor/blackboardFieldContext';
import GraphDataInputs from './GraphDataInputs.vue';
import { actionTypedInputs } from './typedGraphInputs';
import { resolveBlackboardMapping } from '../field-editor/blackboardMapping';
import type { ReferenceChoices } from '../definition-editor/fieldInputConfig';
/** 从契约生成的字段描述构建表单；特殊资源与控制流通过独立入口编辑。 */
import { computed, ref } from 'vue';
import { EaButton } from '@/design-system';
import type { ActionGraphNode } from '../../../packages/game-data-contract/src/actionGraph';
import { actionNodeSchemas } from './actionNodeSchemas.generated';
import { actionNodeTitle } from './nodePresentation';
import { nodeHelp, fieldName } from './editorNodeText';
import EditorHelp from '../editor/EditorHelp.vue';
import NodeInspector from './NodeInspector.vue';
import type { BlackboardScope } from '../../application/editor/graphBlackboard';
import NodeInspectorFields from './NodeInspectorFields.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { listDataInputs } from '../../core/action-graph/actionGraphDataNodes';
import { containsActionGraph, containsGraphReference, readNodeField } from './nodeFieldValues';

const props = defineProps<{
  referenceChoices?: ReferenceChoices;
  blackboardContext?: BlackboardFieldContext;
  graph?: ActionGraphDefinition;
  readonly?: boolean;
  nodeId: string;
  scopes?: readonly BlackboardScope[];
  scopeWarnings?: readonly string[];
  node: ActionGraphNode;
  applyAction: (action: unknown) => boolean;
}>();
const emit = defineEmits<{
  pending: [value: boolean];
  changeData: [path: readonly string[], source: string | null, constant?: number | boolean];
  locateData: [id: string];
  openMacro: [macroId: string];
}>();
const schema = computed(() => actionNodeSchemas[props.node.action.kind]);
function hasInlineLevelValue(field: (typeof schema.value.fields)[number]) {
  const value = readNodeField(props.node.action, field.path);
  return (
    field.control === 'levelValues' &&
    (value === undefined ||
      typeof value === 'number' ||
      Array.isArray(value) ||
      (value !== null && typeof value === 'object' && 'kind' in value && value.kind === 'constant'))
  );
}
const fields = computed(() =>
  schema.value.fields.filter(
    field =>
      field.control !== 'sequence' &&
      (hasInlineLevelValue(field) ||
        !actionTypedInputs(props.node.action).some(
          input => input.path.join('.') === field.path.join('.'),
        )) &&
      (hasInlineLevelValue(field) ||
        resolveBlackboardMapping(field) ||
        !listDataInputs(readNodeField(props.node.action, field.path)).length) &&
      field.control !== 'resource' &&
      !containsActionGraph(readNodeField(props.node.action, field.path)) &&
      !containsGraphReference(readNodeField(props.node.action, field.path)),
  ),
);
const resourceFields = computed(() =>
  schema.value.fields.filter(
    field =>
      field.control === 'resource' ||
      containsActionGraph(readNodeField(props.node.action, field.path)),
  ),
);
const branchFields = computed(() =>
  schema.value.fields.filter(
    field =>
      field.control !== 'sequence' &&
      field.control !== 'resource' &&
      !containsActionGraph(readNodeField(props.node.action, field.path)) &&
      containsGraphReference(readNodeField(props.node.action, field.path)),
  ),
);
const form = ref<InstanceType<typeof NodeInspectorFields>>();
defineExpose({ apply: () => form.value?.apply() ?? true });
</script>

<template>
  <NodeInspector
    :scopes="scopes"
    :scope-warnings="scopeWarnings"
    :title="actionNodeTitle(node.action.kind)"
    :node-id="nodeId"
    :help="nodeHelp(node.action.kind)"
  >
    <EaButton
      v-if="node.action.kind === 'callMacro'"
      size="sm"
      @click="emit('openMacro', node.action.macroId)"
      >{{ t('actionGraphEditor.openMacro') }} {{ node.action.macroId }}</EaButton
    >
    <EditorHelp v-if="resourceFields.length" :text="t('actionGraphEditor.resourceHelp')" />
    <GraphDataInputs
      v-if="graph"
      :graph="graph"
      owner="action"
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
      :value="node.action"
      :kind="node.action.kind"
      :fields="fields"
      :apply-value="applyAction"
      @pending="emit('pending', $event)"
    />
    <details v-for="field in branchFields" :key="field.path.join('.')">
      <summary>
        {{ fieldName(field.path) }} · {{ t('actionGraphEditor.branchReadonly')
        }}<EditorHelp :text="t('actionGraphEditor.branchHelp')" />
      </summary>
      <pre class="branch-preview">{{
        JSON.stringify(readNodeField(node.action, field.path), null, 2)
      }}</pre>
    </details>
  </NodeInspector>
</template>
