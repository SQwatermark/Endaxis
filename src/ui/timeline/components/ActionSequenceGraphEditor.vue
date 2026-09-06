<script setup lang="ts">
import { computed, nextTick, ref, shallowRef } from 'vue';
import type {
  ActionSequenceDefinition,
  CombatCondition,
  CombatStepDefinition,
  CombatEventResponseDefinition,
  CombatEventHandlerDefinition,
  SkillGlobalBuffDefinition,
  SkillGlobalBuffChildDefinition,
  AbilityEntityChildSkillDefinition,
  SkillBuffDefinition,
  SkillBuffAbilityEventResponse,
  SkillBuffIgniteEventResponse,
  ScheduledSequenceDefinition,
} from '../../../core/game-data/operatorDefinition';
import {
  buildActionSequenceMindMap,
  indexSkillStructureNodes,
  findSkillStructureNodeForPath,
  type SkillStructureNode,
} from '../skillStructureMindMapModel';
import {
  appendCombatStepInStructure,
  cloneStructureValue,
  deleteStructureValueAtPath,
  insertStructureArrayItem,
  moveStructureArrayItem,
  removeStructureArrayItem,
  replaceStructureValueAtPath,
  resolveStructureValue,
} from '../skillStructureEditorCommands';
import {
  createCombatEventResponseDraft,
  createBuffAbilityEventResponseDraft,
  createBuffIgniteEventResponseDraft,
  type EditableCombatStepKind,
} from '../skillDefinitionEditorViewModel';
import {
  useDefinitionDraftHistory,
  type DefinitionDraftHistory,
} from '../useDefinitionDraftHistory';
import { useEditorHistoryShortcuts } from '../../keyboard/useEditorHistoryShortcuts';
import SkillStructureMindMap from './SkillStructureMindMap.vue';
import CombatStepEditor from './CombatStepEditor.vue';
import CombatConditionEditor from './CombatConditionEditor.vue';
import StepTypePicker from './StepTypePicker.vue';
import CombatConditionTypePicker from './CombatConditionTypePicker.vue';
import CombatEventResponseInspector from './CombatEventResponseInspector.vue';
import SkillEventHandlerInspector from './SkillEventHandlerInspector.vue';
import GlobalBuffDefinitionInspector from './GlobalBuffDefinitionInspector.vue';
import GlobalBuffChildInspector from './GlobalBuffChildInspector.vue';
import InlineAbilityEntityChildSkillInspector from './InlineAbilityEntityChildSkillInspector.vue';
import BuffStepEditor from './BuffStepEditor.vue';
import BuffEventResponseInspector from './BuffEventResponseInspector.vue';
import ScheduledSequenceEditor from './ScheduledSequenceEditor.vue';

const props = defineProps<{
  sequence: ActionSequenceDefinition;
  skillLevel: number;
  createStep: (kind: EditableCombatStepKind) => CombatStepDefinition;
  duplicateStep: (step: CombatStepDefinition) => CombatStepDefinition;
  sharedHistory?: DefinitionDraftHistory<ActionSequenceDefinition>;
}>();
const emit = defineEmits<{
  update: [sequence: ActionSequenceDefinition];
  details: [path: string];
}>();
const shell = ref<HTMLElement | null>(null);
const history =
  props.sharedHistory ??
  useDefinitionDraftHistory(
    () => props.sequence,
    value => emit('update', value),
  );
useEditorHistoryShortcuts(shell, history.restore);
const root = computed(() => buildActionSequenceMindMap(props.sequence));
const nodes = computed(() => indexSkillStructureNodes(root.value));
const selectedId = ref('action-sequence');
const selected = computed(() => nodes.value.get(selectedId.value) ?? root.value);
const value = computed(() => resolveStructureValue(props.sequence, selected.value.sourcePath));
const step = computed(() =>
  selected.value.payloadKind === 'combatStep' ? (value.value as CombatStepDefinition) : undefined,
);
const condition = computed(() =>
  selected.value.payloadKind === 'combatCondition' ? (value.value as CombatCondition) : undefined,
);
const inlineBuff = computed<Extract<CombatStepDefinition, { kind: 'applyBuff' }> | undefined>(() =>
  selected.value.kind === '内联 Buff 定义'
    ? {
        kind: 'applyBuff',
        parameters: {
          buffId: String(selected.value.details.BuffID ?? ''),
          target: 'caster',
          definition: value.value as SkillBuffDefinition,
        },
      }
    : undefined,
);
function updateInlineBuff(step: CombatStepDefinition): void {
  if (step.kind === 'applyBuff' && step.parameters.definition !== undefined)
    updateValue(step.parameters.definition);
}
const pending = ref<{
  node: SkillStructureNode;
  anchor: { x: number; y: number };
  kind: 'step' | 'condition';
}>();
const clipboard = shallowRef<{
  kind: NonNullable<SkillStructureNode['payloadKind']>;
  value: unknown;
}>();
const map = ref<{
  revealNode: (id: string) => Promise<void>;
  transferCollapsedState: (from: string, to: string) => void;
} | null>(null);

function selectNode(node: { id: string }): void {
  selectedId.value = node.id;
  pending.value = undefined;
}
async function reveal(path: string): Promise<void> {
  await nextTick();
  selectedId.value = findSkillStructureNodeForPath(root.value, path).id;
  await map.value?.revealNode(selectedId.value);
}
function updateValue(next: unknown): void {
  if (selected.value.sourcePath === '') return;
  history.commit(replaceStructureValueAtPath(props.sequence, selected.value.sourcePath, next));
}
function beginAdd(source: { id: string }, anchor: { x: number; y: number }): void {
  const node = nodes.value.get(source.id);
  if (!node) return;
  selectNode(node);
  if (node.canAddChild === 'step' || node.canAddChild === 'combatCondition')
    pending.value = { node, anchor, kind: node.canAddChild === 'step' ? 'step' : 'condition' };
  else {
    let payload: unknown;
    let kind: SkillStructureNode['payloadKind'];
    if (node.canAddChild === 'eventResponse') {
      kind = 'eventResponse';
      const existing = resolveStructureValue(
        props.sequence,
        `${node.sourcePath}.parameters.responses`,
      ) as readonly CombatEventResponseDefinition[];
      payload = createCombatEventResponseDraft(existing.map(item => item.key));
    } else if (node.canAddChild === 'sequence') {
      kind = 'scheduledSequence';
      payload = { startFrame: 0, sequence: { steps: [] } };
    } else if (node.canAddChild === 'globalBuffChild') {
      kind = 'globalBuffChild';
      payload = { buffId: '', blackboardAssignments: {} };
    } else if (node.canAddChild === 'buffAbilityResponse') {
      kind = 'buffAbilityResponse';
      payload = createBuffAbilityEventResponseDraft();
    } else if (node.canAddChild === 'buffIgniteResponse') {
      kind = 'buffIgniteResponse';
      payload = createBuffIgniteEventResponseDraft();
    }
    const path = kind ? childArray(node, kind) : undefined;
    if (path === undefined) {
      emit('details', node.sourcePath);
      return;
    }
    const added = insertStructureArrayItem(props.sequence, path, payload);
    history.commit(added.root);
    void reveal(added.itemPath);
  }
}
function appendStep(kind: EditableCombatStepKind): void {
  if (!pending.value) return;
  const node = pending.value.node;
  const result = appendCombatStepInStructure(
    props.sequence,
    node.payloadKind === 'scheduledSequence' ? `${node.sourcePath}.sequence` : node.sourcePath,
    props.createStep(kind),
  );
  pending.value = undefined;
  history.commit(result.root);
  void reveal(result.stepPath);
}
function appendCondition(condition: CombatCondition): void {
  if (!pending.value) return;
  const node = pending.value.node;
  pending.value = undefined;
  if (node.acceptsChildKind === 'combatCondition') {
    const added = insertStructureArrayItem(
      props.sequence,
      `${node.sourcePath}.conditions`,
      condition,
    );
    history.commit(added.root);
    void reveal(added.itemPath);
  } else {
    history.commit(replaceStructureValueAtPath(props.sequence, node.sourcePath, condition));
    void reveal(node.sourcePath);
  }
}
function childArray(
  node: SkillStructureNode,
  kind: SkillStructureNode['payloadKind'],
): string | undefined {
  if (node.acceptsChildKind !== kind) return;
  const prefix = node.sourcePath ? `${node.sourcePath}.` : '';
  if (kind === 'combatStep')
    return `${prefix}${node.payloadKind === 'scheduledSequence' ? 'sequence.' : ''}steps`;
  if (kind === 'combatCondition') return `${prefix}conditions`;
  if (kind === 'eventResponse') return `${prefix}parameters.responses`;
  if (kind === 'globalBuffChild') return `${prefix}children`;
  if (kind === 'scheduledSequence')
    return node.payloadKind === 'childSkill' ? `${prefix}scheduledSequences` : node.sourcePath;
  if (kind === 'buffAbilityResponse' || kind === 'buffIgniteResponse') return node.sourcePath;
}
function nodeAction(action: 'copy' | 'paste' | 'delete', source: { id: string }): void {
  const node = nodes.value.get(source.id);
  if (!node) return;
  if (action === 'copy' && node.payloadKind && node.canCopy !== false) {
    clipboard.value = {
      kind: node.payloadKind,
      value: cloneStructureValue(resolveStructureValue(props.sequence, node.sourcePath)),
    };
  } else if (action === 'delete' && node.canDelete !== false && node.sourcePath) {
    history.commit(
      /\[\d+\]$/.test(node.sourcePath)
        ? removeStructureArrayItem(props.sequence, node.sourcePath)
        : deleteStructureValueAtPath(props.sequence, node.sourcePath),
    );
    void reveal('');
  } else if (action === 'paste' && clipboard.value) {
    let path = childArray(node, clipboard.value.kind);
    let index: number | undefined;
    if (path === undefined && node.payloadKind === clipboard.value.kind) {
      const sibling = /^(.*)\[(\d+)\]$/.exec(node.sourcePath);
      if (sibling) {
        path = sibling[1];
        index = Number(sibling[2]) + 1;
      }
    }
    if (path === undefined) {
      emit('details', node.sourcePath);
      return;
    }
    const payload =
      clipboard.value.kind === 'combatStep'
        ? props.duplicateStep(clipboard.value.value as CombatStepDefinition)
        : cloneStructureValue(clipboard.value.value);
    const added = insertStructureArrayItem(props.sequence, path, payload, index);
    history.commit(added.root);
    void reveal(added.itemPath);
  }
}

async function moveNode(operation: {
  source: { id: string };
  target: { id: string };
  placement: 'inside' | 'before' | 'after';
}): Promise<void> {
  const source = nodes.value.get(operation.source.id);
  const target = nodes.value.get(operation.target.id);
  if (!source || !target || source.canMove === false || !source.payloadKind) return;
  let arrayPath: string | undefined;
  let index: number | undefined;
  if (operation.placement === 'inside') arrayPath = childArray(target, source.payloadKind);
  else if (target.payloadKind === source.payloadKind) {
    const match = /^(.*)\[(\d+)\]$/.exec(target.sourcePath);
    if (match) {
      arrayPath = match[1];
      index = Number(match[2]) + (operation.placement === 'after' ? 1 : 0);
    }
  }
  if (
    arrayPath === undefined ||
    !/\[\d+\]$/.test(source.sourcePath) ||
    arrayPath.startsWith(`${source.sourcePath}.`)
  )
    return;
  const result = moveStructureArrayItem(props.sequence, source.sourcePath, arrayPath, index);
  history.commit(result.root);
  await nextTick();
  const moved = findSkillStructureNodeForPath(root.value, result.itemPath);
  map.value?.transferCollapsedState(source.id, moved.id);
  await reveal(result.itemPath);
}
</script>

<template>
  <div ref="shell" class="sequence-graph">
    <SkillStructureMindMap
      ref="map"
      :root="root"
      :selected-id="selectedId"
      :show-reference-pins="false"
      :can-undo="history.canUndo.value"
      :can-redo="history.canRedo.value"
      :clipboard-kind="clipboard?.kind"
      @select="selectNode"
      @add-child="beginAdd"
      @node-action="nodeAction"
      @history-action="history.restore"
      @move-node="moveNode"
    />
    <main class="sequence-inspector">
      <header>
        <strong>{{ selected.label }}</strong
        ><button type="button" @click="emit('details', selected.sourcePath)">完整表单</button>
      </header>
      <StepTypePicker
        v-if="pending?.kind === 'step'"
        :anchor="pending.anchor"
        hide-trigger
        open-on-mount
        @select="appendStep"
        @close="pending = undefined"
      />
      <CombatConditionTypePicker
        v-if="pending?.kind === 'condition'"
        :anchor="pending.anchor"
        @select="appendCondition"
        @close="pending = undefined"
      />
      <CombatStepEditor
        inline-buff-in-graph
        v-if="step"
        :key="selected.sourcePath"
        :step="step"
        :skill-level="skillLevel"
        :show-header="false"
        inspector-only
        :create-step="createStep"
        :duplicate-step="duplicateStep"
        @update="updateValue"
      />
      <CombatConditionEditor
        v-else-if="condition"
        :condition="condition"
        :skill-level="skillLevel"
        layer-only
        @update="updateValue"
      />
      <CombatEventResponseInspector
        v-else-if="selected.payloadKind === 'eventResponse'"
        :key="selected.sourcePath"
        :response="value as CombatEventResponseDefinition"
        @update="updateValue"
      />
      <SkillEventHandlerInspector
        v-else-if="selected.payloadKind === 'skillEventHandler'"
        :key="selected.sourcePath"
        :handler="value as CombatEventHandlerDefinition"
        @update="updateValue"
      />
      <GlobalBuffDefinitionInspector
        v-else-if="selected.payloadKind === 'globalBuffDefinition'"
        :key="selected.sourcePath"
        :definition="value as SkillGlobalBuffDefinition"
        @update="updateValue"
      />
      <GlobalBuffChildInspector
        v-else-if="selected.payloadKind === 'globalBuffChild'"
        :key="selected.sourcePath"
        :child="value as SkillGlobalBuffChildDefinition"
        @update="updateValue"
      />
      <InlineAbilityEntityChildSkillInspector
        v-else-if="selected.payloadKind === 'childSkill'"
        :key="selected.sourcePath"
        :child-skill="value as AbilityEntityChildSkillDefinition"
        :skill-level="skillLevel"
        @update="updateValue"
      />
      <BuffStepEditor
        v-else-if="inlineBuff"
        :key="selected.sourcePath"
        :step="inlineBuff"
        :skill-level="skillLevel"
        definition-only
        inspector-only
        @update="updateInlineBuff"
      />
      <BuffEventResponseInspector
        v-else-if="selected.payloadKind === 'buffAbilityResponse'"
        :key="selected.sourcePath"
        kind="ability"
        :response="value as SkillBuffAbilityEventResponse"
        @update="updateValue"
      />
      <BuffEventResponseInspector
        v-else-if="selected.payloadKind === 'buffIgniteResponse'"
        :key="selected.sourcePath"
        kind="ignite"
        :response="value as SkillBuffIgniteEventResponse"
        @update="updateValue"
      />
      <ScheduledSequenceEditor
        v-else-if="selected.payloadKind === 'scheduledSequence'"
        :key="selected.sourcePath"
        :sequence="value as ScheduledSequenceDefinition"
        :title="selected.label"
        :skill-level="skillLevel"
        :create-step="createStep"
        :duplicate-step="duplicateStep"
        inspector-only
        @update="updateValue"
      />
      <p v-else-if="selected.kind === '动作序列'">
        此节点承载有序步骤。在图上点击＋添加，点击子节点编辑其本层字段。
      </p>
      <p v-else>此类节点的专用 Inspector 尚未接入；请使用“完整表单”继续编辑，原有字段不会丢失。</p>
    </main>
  </div>
</template>

<style scoped>
.sequence-graph {
  height: 480px;
  min-height: 320px;
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 42%);
  border: 1px solid var(--ea-border-soft);
}
.sequence-graph > :first-child {
  min-width: 0;
  min-height: 0;
  height: auto;
  grid-template-rows: auto minmax(0, 1fr);
}
.sequence-inspector {
  min-width: 0;
  overflow: auto;
  padding: 10px;
  container-type: inline-size;
  border-left: 1px solid var(--ea-border-soft);
}
.sequence-inspector > header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.sequence-inspector > p {
  color: var(--ea-fg-muted);
}
.sequence-inspector > header button {
  border: 1px solid var(--ea-border);
  color: var(--ea-fg);
  background: var(--ea-fill-input);
  padding: 4px 8px;
}
.sequence-graph :deep(.map-toolbar) {
  flex-wrap: wrap;
  min-height: 38px;
  height: auto;
}
.sequence-graph :deep(.map-gesture-hint) {
  display: none;
}
</style>
