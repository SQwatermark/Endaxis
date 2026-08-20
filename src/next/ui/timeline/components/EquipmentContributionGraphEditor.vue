<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import type {
  EquipmentContributionDefinition,
  EquipmentEventHandlerDefinition,
  EquipmentModifierDefinition,
} from '../../../core/game-data/equipmentDefinition';
import type { CombatStepDefinition, LevelValues } from '../../../core/game-data/operatorDefinition';
import {
  buildEquipmentContributionMindMap,
  findSkillStructureNodeForPath,
} from '../skillStructureMindMapModel';
import {
  cloneStructureValue,
  appendCombatStepInStructure,
  insertStructureArrayItem,
  moveStructureArrayItem,
  removeStructureArrayItem,
  replaceStructureValueAtPath,
  resolveStructureValue,
} from '../skillStructureEditorCommands';
import {
  createSkillEditorStep,
  duplicateSkillEditorDetachedStep,
  type EditableCombatStepKind,
} from '../skillDefinitionEditorViewModel';
import SkillStructureMindMap from './SkillStructureMindMap.vue';
import CombatEventTriggerEditor from './CombatEventTriggerEditor.vue';
import CombatStepEditor from './CombatStepEditor.vue';
import StepTypePicker from './StepTypePicker.vue';
import EquipmentContributionTypePicker from './EquipmentContributionTypePicker.vue';

type ContributionPayloadKind =
  'scheduledSequence' | 'combatStep' | 'childSkill' | 'equipmentModifier' | 'equipmentHandler';
interface ContributionOperationNode {
  readonly id: string;
  readonly sourcePath: string;
  readonly payloadKind?: ContributionPayloadKind;
  readonly acceptsChildKind?: ContributionPayloadKind;
}

const props = defineProps<{
  contribution: EquipmentContributionDefinition;
  label: string;
  level: number;
}>();
const emit = defineEmits<{ update: [contribution: EquipmentContributionDefinition] }>();
const selectedPath = ref('');
const selectedId = ref('equipment:contribution');
const pendingAdd = ref<{
  readonly kind: 'step' | 'modifier' | 'handler';
  readonly targetPath: string;
  readonly anchor: { readonly x: number; readonly y: number };
} | null>(null);
const pickerKey = ref(0);
const undoStack = shallowRef<EquipmentContributionDefinition[]>([]);
const redoStack = shallowRef<EquipmentContributionDefinition[]>([]);
const clipboard = shallowRef<
  | { readonly kind: 'equipmentModifier'; readonly value: EquipmentModifierDefinition }
  | { readonly kind: 'equipmentHandler'; readonly value: EquipmentEventHandlerDefinition }
  | { readonly kind: 'combatStep'; readonly value: CombatStepDefinition }
>();
const structure = computed(() =>
  buildEquipmentContributionMindMap(props.contribution, props.label),
);
const selectedValue = computed(() => resolveStructureValue(props.contribution, selectedPath.value));
const selectedModifier = computed(() =>
  /^modifiers\[\d+\]$/.test(selectedPath.value)
    ? (selectedValue.value as EquipmentModifierDefinition)
    : null,
);
const selectedHandler = computed(() =>
  /^eventHandlers\[\d+\]$/.test(selectedPath.value)
    ? (selectedValue.value as EquipmentEventHandlerDefinition)
    : null,
);
const selectedStep = computed(() =>
  /\.steps\[\d+\]$/.test(selectedPath.value) ? (selectedValue.value as CombatStepDefinition) : null,
);

watch(
  () => props.label,
  () => {
    selectedPath.value = '';
    selectedId.value = 'equipment:contribution';
    undoStack.value = [];
    redoStack.value = [];
  },
);

function selectNode(node: { id: string; sourcePath: string }): void {
  selectedId.value = node.id;
  selectedPath.value = node.sourcePath;
}

function beginAdd(
  node: ContributionOperationNode & {
    readonly canAddChild?:
      'step' | 'equipmentModifier' | 'equipmentHandler' | 'sequence' | 'lifecycle' | 'childSkill';
  },
  anchor: { readonly x: number; readonly y: number },
): void {
  const kind =
    node.canAddChild === 'step'
      ? 'step'
      : node.canAddChild === 'equipmentModifier'
        ? 'modifier'
        : node.canAddChild === 'equipmentHandler'
          ? 'handler'
          : null;
  if (kind === null) return;
  selectNode(node);
  pendingAdd.value = { kind, targetPath: node.sourcePath, anchor };
  pickerKey.value += 1;
}

function commit(next: EquipmentContributionDefinition): void {
  undoStack.value = [...undoStack.value, cloneStructureValue(props.contribution)];
  redoStack.value = [];
  emit('update', next);
}

function replaceSelected(value: unknown): void {
  if (selectedPath.value === '') return;
  commit(replaceStructureValueAtPath(props.contribution, selectedPath.value, value));
}

async function restoreHistory(action: 'undo' | 'redo'): Promise<void> {
  const source = action === 'undo' ? undoStack : redoStack;
  const target = action === 'undo' ? redoStack : undoStack;
  const snapshot = source.value.at(-1);
  if (snapshot === undefined) return;
  source.value = source.value.slice(0, -1);
  target.value = [...target.value, cloneStructureValue(props.contribution)];
  emit('update', cloneStructureValue(snapshot));
  selectedPath.value = '';
  selectedId.value = 'equipment:contribution';
}

function childArrayPath(
  node: ContributionOperationNode,
  kind: ContributionPayloadKind,
): string | undefined {
  if (node.acceptsChildKind !== kind) return undefined;
  if (kind === 'combatStep') return `${node.sourcePath}.steps`;
  return node.sourcePath;
}

function insertionTarget(
  node: ContributionOperationNode,
  kind: ContributionPayloadKind,
  placement: 'inside' | 'before' | 'after',
): { readonly arrayPath: string; readonly index?: number } | undefined {
  if (placement === 'inside') {
    const arrayPath = childArrayPath(node, kind);
    return arrayPath === undefined ? undefined : { arrayPath };
  }
  const match = /^(.*)\[(\d+)\]$/.exec(node.sourcePath);
  if (match === null || node.payloadKind !== kind) return undefined;
  return { arrayPath: match[1]!, index: Number(match[2]) + (placement === 'after' ? 1 : 0) };
}

async function selectPath(path: string): Promise<void> {
  await nextTick();
  const node = findSkillStructureNodeForPath(structure.value, path);
  selectedPath.value = node.sourcePath;
  selectedId.value = node.id;
}

async function moveNode(operation: {
  readonly source: ContributionOperationNode;
  readonly target: ContributionOperationNode;
  readonly placement: 'inside' | 'before' | 'after';
}): Promise<void> {
  const kind = operation.source.payloadKind;
  if (kind === undefined || kind === 'scheduledSequence' || kind === 'childSkill') return;
  const target = insertionTarget(operation.target, kind, operation.placement);
  if (target === undefined) return;
  const result = moveStructureArrayItem(
    props.contribution,
    operation.source.sourcePath,
    target.arrayPath,
    target.index,
  );
  commit(result.root);
  await selectPath(result.itemPath);
}

function duplicateStep(step: CombatStepDefinition): CombatStepDefinition {
  return duplicateSkillEditorDetachedStep(editorSkillDraft(), step);
}

function editorSkillDraft() {
  return {
    key: 'equipment-contribution',
    timelineBlockFrames: 0,
    scheduledSequences: (props.contribution.eventHandlers ?? []).map(handler => ({
      startFrame: 0,
      sequence: handler.sequence,
    })),
  };
}

async function appendModifier(modifier: EquipmentModifierDefinition): Promise<void> {
  const pending = pendingAdd.value;
  if (pending?.kind !== 'modifier') return;
  const result = insertStructureArrayItem(props.contribution, pending.targetPath, modifier);
  pendingAdd.value = null;
  commit(result.root);
  await selectPath(result.itemPath);
}

async function appendHandler(handler: EquipmentEventHandlerDefinition): Promise<void> {
  const pending = pendingAdd.value;
  if (pending?.kind !== 'handler') return;
  const result = insertStructureArrayItem(props.contribution, pending.targetPath, handler);
  pendingAdd.value = null;
  commit(result.root);
  await selectPath(result.itemPath);
}

async function appendStep(kind: EditableCombatStepKind): Promise<void> {
  const pending = pendingAdd.value;
  if (pending?.kind !== 'step') return;
  const result = appendCombatStepInStructure(
    props.contribution,
    pending.targetPath,
    createSkillEditorStep(editorSkillDraft(), kind),
  );
  pendingAdd.value = null;
  commit(result.root);
  await selectPath(result.stepPath);
}

async function nodeAction(
  action: 'delete' | 'copy' | 'paste',
  node: ContributionOperationNode,
): Promise<void> {
  const kind = node.payloadKind;
  if (action === 'copy') {
    if (kind !== 'equipmentModifier' && kind !== 'equipmentHandler' && kind !== 'combatStep')
      return;
    clipboard.value = {
      kind,
      value: cloneStructureValue(resolveStructureValue(props.contribution, node.sourcePath)),
    } as typeof clipboard.value;
    return;
  }
  if (action === 'delete' && kind !== undefined) {
    commit(removeStructureArrayItem(props.contribution, node.sourcePath));
    await selectPath(node.sourcePath.replace(/\[[0-9]+\]$/, ''));
    return;
  }
  const copied = clipboard.value;
  if (action !== 'paste' || copied === undefined) return;
  const arrayPath = childArrayPath(node, copied.kind);
  if (arrayPath === undefined) return;
  const value =
    copied.kind === 'combatStep' ? duplicateStep(copied.value) : cloneStructureValue(copied.value);
  const result = insertStructureArrayItem(props.contribution, arrayPath, value);
  commit(result.root);
  await selectPath(result.itemPath);
}

function parseLevelValues(event: Event): void {
  const modifier = selectedModifier.value;
  if (modifier === null) return;
  const tokens = (event.target as HTMLInputElement).value.split(',').map(value => value.trim());
  const values = tokens.map(Number);
  if (
    tokens.some(value => value === '') ||
    values.length === 0 ||
    values.some(value => !Number.isFinite(value))
  )
    return;
  const levelValues: LevelValues = values.length === 1 ? values[0]! : values;
  replaceSelected({ ...modifier, value: levelValues });
}

function levelValuesText(value: LevelValues): string {
  return Array.isArray(value) ? value.join(', ') : String(value);
}
</script>

<template>
  <div class="contribution-editor">
    <SkillStructureMindMap
      class="contribution-map"
      :root="structure"
      :selected-id="selectedId"
      :show-reference-pins="false"
      :clipboard-kind="clipboard?.kind"
      :can-undo="undoStack.length > 0"
      :can-redo="redoStack.length > 0"
      @select="selectNode"
      @add-child="beginAdd"
      @move-node="moveNode"
      @node-action="nodeAction"
      @history-action="restoreHistory"
    />
    <StepTypePicker
      v-if="pendingAdd?.kind === 'step'"
      :key="`step:${pickerKey}`"
      hide-trigger
      open-on-mount
      :anchor="pendingAdd.anchor"
      @select="appendStep"
    />
    <EquipmentContributionTypePicker
      v-if="pendingAdd?.kind === 'modifier' || pendingAdd?.kind === 'handler'"
      :key="`equipment:${pickerKey}`"
      :mode="pendingAdd.kind"
      :anchor="pendingAdd.anchor"
      :level-count="level"
      :handler-keys="(contribution.eventHandlers ?? []).map(handler => handler.key)"
      @modifier="appendModifier"
      @handler="appendHandler"
      @close="pendingAdd = null"
    />
    <aside class="contribution-inspector">
      <template v-if="selectedModifier">
        <header>
          <strong>属性修正</strong><span>{{ selectedModifier.kind }}</span>
        </header>
        <label>
          <span>等级值</span>
          <input :value="levelValuesText(selectedModifier.value)" @change="parseLevelValues" />
          <small>单值或逗号分隔的逐级数值；当前预览等级 {{ level }}。</small>
        </label>
        <div class="readout" v-for="(value, key) in selectedModifier" :key="key">
          <span>{{ key }}</span
          ><code>{{ value }}</code>
        </div>
      </template>
      <template v-else-if="selectedHandler">
        <header>
          <strong>事件响应</strong><span>{{ selectedHandler.key }}</span>
        </header>
        <label>
          <span>稳定 key</span>
          <input
            :value="selectedHandler.key"
            @change="
              replaceSelected({
                ...selectedHandler,
                key: ($event.target as HTMLInputElement).value,
              })
            "
          />
        </label>
        <CombatEventTriggerEditor
          :event="selectedHandler.event"
          @update="replaceSelected({ ...selectedHandler, event: $event })"
        />
        <p class="hint">条件保持原定义；在条件节点接入导图前不会被扁平化或丢弃。</p>
      </template>
      <CombatStepEditor
        v-else-if="selectedStep"
        :step="selectedStep"
        :skill-level="level"
        :show-header="false"
        inspector-only
        @update="replaceSelected"
      />
      <template v-else>
        <header>
          <strong>{{ label }}</strong
          ><span>当前层</span>
        </header>
        <p class="hint">在画布中选择属性修正、事件响应或响应序列里的步骤进行编辑。</p>
      </template>
    </aside>
  </div>
</template>

<style scoped>
.contribution-editor {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 34%);
  min-height: 520px;
  border: 1px solid var(--ea-border-soft);
}
.contribution-map {
  min-width: 0;
  min-height: 520px;
}
.contribution-inspector {
  min-width: 0;
  padding: 14px;
  overflow: auto;
  border-left: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
  container-type: inline-size;
}
header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}
header span,
.hint,
label span,
label small {
  color: var(--ea-fg-muted);
}
label {
  display: grid;
  gap: 6px;
  margin-top: 14px;
  font-size: 11px;
}
input {
  width: 100%;
  min-width: 0;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
.readout {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  gap: 8px;
  margin-top: 10px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}
.readout code {
  min-width: 0;
  color: var(--ea-fg-secondary);
  overflow-wrap: anywhere;
}
.hint {
  line-height: 1.55;
}
@media (max-width: 820px) {
  .contribution-editor {
    grid-template-columns: 1fr;
  }
  .contribution-inspector {
    min-height: 260px;
    border-left: 0;
    border-top: 1px solid var(--ea-border-soft);
  }
}
</style>
