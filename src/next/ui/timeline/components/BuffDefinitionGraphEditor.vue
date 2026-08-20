<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type CSSProperties,
} from 'vue';
import { ArrowDown, ArrowUp, CopyDocument, Delete } from '@element-plus/icons-vue';
import type {
  CombatStepDefinition,
  SkillBuffDefinition,
  SkillDefinition,
} from '../../../core/game-data/operatorDefinition';
import {
  createSkillEditorStep,
  duplicateSkillEditorDetachedStep,
  type EditableCombatStepKind,
} from '../skillDefinitionEditorViewModel';
import {
  buildBuffStructureMindMap,
  findSkillStructureNodeForPath,
  indexSkillStructureNodes,
} from '../skillStructureMindMapModel';
import {
  appendCombatStepInStructure,
  cloneStructureValue,
  duplicateCombatStepInStructure,
  insertStructureArrayItem,
  moveStructureArrayItem,
  moveCombatStepInStructure,
  removeCombatStepInStructure,
  replaceStructureValueAtPath,
  resolveStructureValue,
} from '../skillStructureEditorCommands';
import BuffStepEditor from './BuffStepEditor.vue';
import CombatStepEditor from './CombatStepEditor.vue';
import SkillStructureMindMap from './SkillStructureMindMap.vue';
import StepTypePicker from './StepTypePicker.vue';

const LIFECYCLE_KEYS = [
  'start',
  'enable',
  'disable',
  'beforeEnhance',
  'enhanceChanged',
  'afterEnhance',
  'trigger',
  'finish',
] as const;
type StructureOperationNode = {
  readonly id: string;
  readonly sourcePath: string;
  readonly payloadKind?: 'scheduledSequence' | 'combatStep' | 'childSkill';
  readonly acceptsChildKind?: 'scheduledSequence' | 'combatStep' | 'childSkill';
};

const props = defineProps<{
  buffId: string;
  definition: SkillBuffDefinition;
  skillLevel: number;
}>();
const emit = defineEmits<{ update: [definition: SkillBuffDefinition] }>();
const selectedId = ref('buff');
const selectedPath = ref('');
const pendingMode = ref<'step' | 'lifecycle' | ''>('');
const pickerKey = ref(0);
const insertAnchor = ref({ x: 0, y: 0 });
const structureClipboard = shallowRef<CombatStepDefinition>();
const structureUndoStack = shallowRef<SkillBuffDefinition[]>([]);
const structureRedoStack = shallowRef<SkillBuffDefinition[]>([]);
const canUndoStructure = computed(() => structureUndoStack.value.length > 0);
const canRedoStructure = computed(() => structureRedoStack.value.length > 0);
const lifecyclePicker = ref<HTMLElement>();
const map = ref<{
  revealNode: (id: string) => Promise<void>;
  transferCollapsedState: (fromId: string, toId: string) => void;
} | null>(null);
const root = computed(() => buildBuffStructureMindMap(props.buffId, props.definition));
const nodeIndex = computed(() => indexSkillStructureNodes(root.value));
const selectedNode = computed(() => nodeIndex.value.get(selectedId.value));
const selectedStep = computed(() =>
  selectedNode.value?.kind === '战斗步骤'
    ? (resolveStructureValue(props.definition, selectedPath.value) as CombatStepDefinition)
    : undefined,
);
const editingStep = computed<Extract<CombatStepDefinition, { kind: 'applyBuff' }>>(() => ({
  kind: 'applyBuff',
  parameters: {
    buffId: props.buffId,
    target: 'caster',
    definition: props.definition,
  },
}));
const missingLifecycleKeys = computed(() =>
  LIFECYCLE_KEYS.filter(key => props.definition.lifecycleSequences?.[key] === undefined),
);
const lifecyclePickerStyle = computed<CSSProperties>(() => {
  const viewportWidth = typeof window === 'undefined' ? 1280 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 720 : window.innerHeight;
  const width = Math.min(260, viewportWidth - 24);
  const estimatedHeight = Math.min(360, 48 + missingLifecycleKeys.value.length * 35);
  const left = Math.max(12, Math.min(insertAnchor.value.x, viewportWidth - width - 12));
  const openBelow =
    viewportHeight - insertAnchor.value.y >= estimatedHeight + 18 ||
    viewportHeight - insertAnchor.value.y >= insertAnchor.value.y;
  return {
    left: `${left}px`,
    width: `${width}px`,
    top: openBelow ? `${insertAnchor.value.y + 6}px` : undefined,
    bottom: openBelow ? undefined : `${viewportHeight - insertAnchor.value.y + 6}px`,
    maxHeight: `${Math.max(120, viewportHeight - 24)}px`,
  };
});

watch(
  () => props.buffId,
  () => {
    selectedId.value = 'buff';
    selectedPath.value = '';
    pendingMode.value = '';
    structureUndoStack.value = [];
    structureRedoStack.value = [];
  },
);

function context(): SkillDefinition {
  return { key: `buff:${props.buffId}`, timelineBlockFrames: 0, scheduledSequences: [] };
}
function createStep(kind: EditableCombatStepKind): CombatStepDefinition {
  return createSkillEditorStep(context(), kind);
}
function duplicateStep(step: CombatStepDefinition): CombatStepDefinition {
  return duplicateSkillEditorDetachedStep(context(), step);
}
function emitStructureUpdate(definition: SkillBuffDefinition): void {
  structureUndoStack.value = [...structureUndoStack.value, cloneStructureValue(props.definition)];
  structureRedoStack.value = [];
  emit('update', definition);
}
async function restoreStructureHistory(action: 'undo' | 'redo'): Promise<void> {
  const source = action === 'undo' ? structureUndoStack : structureRedoStack;
  const target = action === 'undo' ? structureRedoStack : structureUndoStack;
  const snapshot = source.value.at(-1);
  if (snapshot === undefined) return;
  source.value = source.value.slice(0, -1);
  target.value = [...target.value, cloneStructureValue(props.definition)];
  emit('update', cloneStructureValue(snapshot));
  await selectPath('');
}
function selectNode(node: { readonly id: string }): void {
  const target = nodeIndex.value.get(node.id);
  if (target === undefined) return;
  selectedId.value = target.id;
  selectedPath.value = target.sourcePath;
  pendingMode.value = '';
}
async function selectPath(path: string): Promise<void> {
  await nextTick();
  const target = findSkillStructureNodeForPath(root.value, path);
  selectNode(target);
  await nextTick();
  await map.value?.revealNode(target.id);
}
async function beginAdd(
  node: {
    readonly id: string;
    readonly sourcePath: string;
    readonly canAddChild?: string;
  },
  anchor: { readonly x: number; readonly y: number },
): Promise<void> {
  selectNode(node);
  insertAnchor.value = { ...anchor };
  if (node.canAddChild === 'lifecycle') {
    pendingMode.value = 'lifecycle';
    await nextTick();
    lifecyclePicker.value?.querySelector<HTMLButtonElement>('button')?.focus();
  } else if (node.canAddChild === 'step') {
    pendingMode.value = 'step';
    pickerKey.value += 1;
  }
}
function closeLifecycleFromOutside(event: PointerEvent): void {
  if (pendingMode.value === 'lifecycle' && !lifecyclePicker.value?.contains(event.target as Node)) {
    pendingMode.value = '';
  }
}
onMounted(() => document.addEventListener('pointerdown', closeLifecycleFromOutside));
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeLifecycleFromOutside));
async function appendStep(kind: EditableCombatStepKind): Promise<void> {
  const result = appendCombatStepInStructure(
    props.definition,
    selectedPath.value,
    createStep(kind),
  );
  emitStructureUpdate(result.root);
  pendingMode.value = '';
  await selectPath(result.stepPath);
}
async function addLifecycle(key: (typeof LIFECYCLE_KEYS)[number]): Promise<void> {
  emitStructureUpdate(
    replaceStructureValueAtPath(props.definition, `lifecycleSequences.${key}`, { steps: [] }),
  );
  pendingMode.value = '';
  await selectPath(`lifecycleSequences.${key}`);
}
function updateRootStep(step: CombatStepDefinition): void {
  if (step.kind === 'applyBuff' && step.parameters.definition !== undefined) {
    emit('update', step.parameters.definition);
  }
}
function updateStep(step: CombatStepDefinition): void {
  emit('update', replaceStructureValueAtPath(props.definition, selectedPath.value, step));
}
async function moveStep(offset: -1 | 1): Promise<void> {
  const result = moveCombatStepInStructure(props.definition, selectedPath.value, offset);
  emitStructureUpdate(result.root);
  await selectPath(result.stepPath);
}
async function copyStep(): Promise<void> {
  const result = duplicateCombatStepInStructure(
    props.definition,
    selectedPath.value,
    duplicateStep,
  );
  emitStructureUpdate(result.root);
  await selectPath(result.stepPath);
}
async function moveStructureNode(operation: {
  readonly source: StructureOperationNode;
  readonly target: StructureOperationNode;
  readonly placement: 'inside' | 'before' | 'after';
}): Promise<void> {
  if (operation.source.payloadKind !== 'combatStep') return;
  let arrayPath: string;
  let index: number | undefined;
  if (operation.placement === 'inside') {
    if (operation.target.acceptsChildKind !== 'combatStep') return;
    arrayPath = `${operation.target.sourcePath}.steps`;
  } else {
    const match = /^(.*)\[(\d+)\]$/.exec(operation.target.sourcePath);
    if (match === null || operation.target.payloadKind !== 'combatStep') return;
    arrayPath = match[1]!;
    index = Number(match[2]) + (operation.placement === 'after' ? 1 : 0);
  }
  const result = moveStructureArrayItem(
    props.definition,
    operation.source.sourcePath,
    arrayPath,
    index,
  );
  emitStructureUpdate(result.root);
  await nextTick();
  const movedNode = findSkillStructureNodeForPath(root.value, result.itemPath);
  map.value?.transferCollapsedState(operation.source.id, movedNode.id);
  await selectPath(result.itemPath);
}
async function runStructureNodeAction(
  action: 'delete' | 'copy' | 'paste',
  node: StructureOperationNode,
): Promise<void> {
  if (action === 'copy' && node.payloadKind === 'combatStep') {
    structureClipboard.value = cloneStructureValue(
      resolveStructureValue(props.definition, node.sourcePath) as CombatStepDefinition,
    );
    return;
  }
  if (action === 'delete' && node.payloadKind === 'combatStep') {
    const parentPath = node.sourcePath.replace(/\.steps\[\d+\]$/, '');
    emitStructureUpdate(removeCombatStepInStructure(props.definition, node.sourcePath));
    await selectPath(parentPath);
    return;
  }
  if (
    action !== 'paste' ||
    structureClipboard.value === undefined ||
    node.acceptsChildKind !== 'combatStep'
  ) {
    return;
  }
  const result = insertStructureArrayItem(
    props.definition,
    `${node.sourcePath}.steps`,
    duplicateStep(structureClipboard.value),
  );
  emitStructureUpdate(result.root);
  await selectPath(result.itemPath);
}
async function deleteCurrent(): Promise<void> {
  if (selectedStep.value !== undefined) {
    const parentPath = selectedPath.value.replace(/\.steps\[\d+\]$/, '');
    emitStructureUpdate(removeCombatStepInStructure(props.definition, selectedPath.value));
    await selectPath(parentPath);
    return;
  }
  const lifecycle = /^lifecycleSequences\.([^.]+)$/.exec(selectedPath.value);
  if (lifecycle === null) return;
  const next: SkillBuffDefinition = {
    ...props.definition,
    lifecycleSequences: { ...props.definition.lifecycleSequences },
  };
  delete (next.lifecycleSequences as Record<string, unknown>)[lifecycle[1]!];
  if (Object.keys(next.lifecycleSequences!).length === 0) delete next.lifecycleSequences;
  emitStructureUpdate(next);
  await selectPath('');
}
</script>

<template>
  <div class="definition-graph-editor">
    <SkillStructureMindMap
      ref="map"
      :root="root"
      :selected-id="selectedId"
      :show-reference-pins="false"
      :clipboard-kind="structureClipboard === undefined ? undefined : 'combatStep'"
      :can-undo="canUndoStructure"
      :can-redo="canRedoStructure"
      @select="selectNode"
      @add-child="beginAdd"
      @move-node="moveStructureNode"
      @node-action="runStructureNodeAction"
      @history-action="restoreStructureHistory"
    />
    <main class="definition-inspector">
      <StepTypePicker
        v-if="pendingMode === 'step'"
        :key="pickerKey"
        class="floating-picker"
        :anchor="insertAnchor"
        hide-trigger
        open-on-mount
        @select="appendStep"
      />
      <Teleport to="body">
        <div
          v-if="pendingMode === 'lifecycle'"
          ref="lifecyclePicker"
          class="lifecycle-picker"
          :style="lifecyclePickerStyle"
          @keydown.esc.stop="pendingMode = ''"
          @pointerdown.stop
        >
          <strong>添加生命周期</strong>
          <button v-for="key in missingLifecycleKeys" :key="key" @click="addLifecycle(key)">
            {{ key }}
          </button>
        </div>
      </Teleport>

      <BuffStepEditor
        v-if="selectedId === 'buff'"
        :step="editingStep"
        :skill-level="skillLevel"
        :create-step="createStep"
        :duplicate-step="duplicateStep"
        definition-only
        inspector-only
        @update="updateRootStep"
      />

      <section v-else-if="selectedStep" class="node-card">
        <header>
          <div>
            <small>战斗步骤</small><strong>{{ selectedStep.kind }}</strong>
          </div>
          <div class="node-actions">
            <button @click="moveStep(-1)">
              <el-icon><ArrowUp /></el-icon>
            </button>
            <button @click="moveStep(1)">
              <el-icon><ArrowDown /></el-icon>
            </button>
            <button @click="copyStep">
              <el-icon><CopyDocument /></el-icon>
            </button>
            <button @click="deleteCurrent">
              <el-icon><Delete /></el-icon>
            </button>
          </div>
        </header>
        <CombatStepEditor
          :step="selectedStep"
          :skill-level="skillLevel"
          :create-step="createStep"
          :duplicate-step="duplicateStep"
          :show-header="false"
          inspector-only
          @update="updateStep"
        />
      </section>

      <section v-else class="node-card">
        <header>
          <div>
            <small>{{ selectedNode?.kind }}</small
            ><strong>{{ selectedNode?.label }}</strong>
          </div>
          <button v-if="selectedPath.startsWith('lifecycleSequences.')" @click="deleteCurrent">
            <el-icon><Delete /></el-icon>
          </button>
        </header>
        <p>此节点只承载有序子步骤，请在导图节点上添加和选择下一层。</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.definition-graph-editor {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(360px, 1.2fr) minmax(300px, 0.8fr);
  height: 560px;
  border: 1px solid var(--ea-border-soft);
}
.definition-inspector {
  position: relative;
  min-width: 0;
  padding: 14px;
  overflow: auto;
  border-left: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
}
.node-card header,
.node-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.floating-picker {
  position: absolute;
  width: 0;
  height: 0;
}
.node-card {
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--ea-border-soft);
}
.node-card header {
  min-height: 44px;
  justify-content: space-between;
  padding: 0 10px;
  border-bottom: 1px solid var(--ea-border-soft);
}
.node-card header > div:first-child {
  min-width: 0;
  display: grid;
}
.node-card strong {
  min-width: 0;
  overflow-wrap: anywhere;
}
.node-actions {
  min-width: 0;
  flex: 0 1 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.node-card small,
.node-card p {
  color: var(--ea-fg-muted);
}
.node-card p {
  padding: 12px;
}
button {
  min-width: 28px;
  min-height: 28px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
@media (max-width: 980px) {
  .definition-graph-editor {
    grid-template-columns: 1fr;
    height: auto;
  }
  .definition-graph-editor > :first-child {
    height: 420px;
  }
}
</style>

<style>
.lifecycle-picker {
  position: fixed;
  z-index: 4000;
  width: 260px;
  display: grid;
  gap: 5px;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid var(--ea-gold);
  background: var(--ea-workbench-panel);
  box-shadow: 0 12px 32px rgb(0 0 0 / 45%);
}
.lifecycle-picker button {
  min-height: 30px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
  text-align: left;
}
</style>
