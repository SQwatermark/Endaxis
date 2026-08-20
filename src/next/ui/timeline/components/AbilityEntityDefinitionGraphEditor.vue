<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue';
import { ArrowDown, ArrowUp, CopyDocument, Delete } from '@element-plus/icons-vue';
import type {
  AbilityEntityDefinition,
  CombatStepDefinition,
  ScheduledSequenceDefinition,
  SkillDefinition,
} from '../../../core/game-data/operatorDefinition';
import {
  createSkillEditorStep,
  duplicateSkillEditorDetachedStep,
  type EditableCombatStepKind,
} from '../skillDefinitionEditorViewModel';
import {
  buildAbilityEntityStructureMindMap,
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
  removeStructureArrayItem,
  replaceStructureValueAtPath,
  resolveStructureValue,
} from '../skillStructureEditorCommands';
import CombatStepEditor from './CombatStepEditor.vue';
import SkillBlackboardEditor from './SkillBlackboardEditor.vue';
import SkillStructureMindMap from './SkillStructureMindMap.vue';
import StepTypePicker from './StepTypePicker.vue';

type StructureOperationNode = {
  readonly id: string;
  readonly sourcePath: string;
  readonly payloadKind?:
    'scheduledSequence' | 'combatStep' | 'childSkill' | 'equipmentModifier' | 'equipmentHandler';
  readonly acceptsChildKind?:
    'scheduledSequence' | 'combatStep' | 'childSkill' | 'equipmentModifier' | 'equipmentHandler';
};

const props = defineProps<{
  abilityEntityId: string;
  definition: AbilityEntityDefinition;
  skillLevel: number;
}>();
const emit = defineEmits<{ update: [definition: AbilityEntityDefinition] }>();
const selectedId = ref('entity');
const selectedPath = ref('');
const pendingStep = ref(false);
const pickerKey = ref(0);
const insertAnchor = ref({ x: 0, y: 0 });
const structureClipboard = shallowRef<
  | { readonly kind: 'combatStep'; readonly value: CombatStepDefinition }
  | { readonly kind: 'scheduledSequence'; readonly value: ScheduledSequenceDefinition }
>();
const structureUndoStack = shallowRef<AbilityEntityDefinition[]>([]);
const structureRedoStack = shallowRef<AbilityEntityDefinition[]>([]);
const canUndoStructure = computed(() => structureUndoStack.value.length > 0);
const canRedoStructure = computed(() => structureRedoStack.value.length > 0);
const map = ref<{
  revealNode: (id: string) => Promise<void>;
  transferCollapsedState: (fromId: string, toId: string) => void;
} | null>(null);
const root = computed(() =>
  buildAbilityEntityStructureMindMap(props.abilityEntityId, props.definition),
);
const nodeIndex = computed(() => indexSkillStructureNodes(root.value));
const selectedNode = computed(() => nodeIndex.value.get(selectedId.value));
const selectedStep = computed(() =>
  selectedNode.value?.kind === '战斗步骤'
    ? (resolveStructureValue(props.definition, selectedPath.value) as CombatStepDefinition)
    : undefined,
);
const selectedSequenceIndex = computed(() => {
  const match = /^entity:sequence:(\d+)$/.exec(selectedId.value);
  return match === null ? undefined : Number(match[1]);
});
const selectedSequence = computed(() =>
  selectedSequenceIndex.value === undefined
    ? undefined
    : props.definition.childSkill?.scheduledSequences[selectedSequenceIndex.value],
);
watch(
  () => props.abilityEntityId,
  () => {
    selectedId.value = 'entity';
    selectedPath.value = '';
    pendingStep.value = false;
    structureUndoStack.value = [];
    structureRedoStack.value = [];
  },
);

function context(): SkillDefinition {
  return {
    key: `ability-entity:${props.abilityEntityId}`,
    timelineBlockFrames: 0,
    scheduledSequences: props.definition.childSkill?.scheduledSequences ?? [],
  };
}
function createStep(kind: EditableCombatStepKind): CombatStepDefinition {
  return createSkillEditorStep(context(), kind);
}
function duplicateStep(step: CombatStepDefinition): CombatStepDefinition {
  return duplicateSkillEditorDetachedStep(context(), step);
}
function emitStructureUpdate(definition: AbilityEntityDefinition): void {
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
  pendingStep.value = false;
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
  if (node.canAddChild === 'childSkill') {
    emitStructureUpdate(
      replaceStructureValueAtPath(props.definition, 'childSkill', {
        skillId: 'custom-ability-entity-child',
        scheduledSequences: [],
      }),
    );
    await selectPath('childSkill');
  } else if (node.canAddChild === 'sequence') {
    appendSequence();
  } else if (node.canAddChild === 'step') {
    pendingStep.value = true;
    pickerKey.value += 1;
  }
}
async function appendSequence(): Promise<void> {
  const childSkill = props.definition.childSkill;
  if (childSkill === undefined) return;
  const index = childSkill.scheduledSequences.length;
  emitStructureUpdate(
    replaceStructureValueAtPath(props.definition, 'childSkill.scheduledSequences', [
      ...childSkill.scheduledSequences,
      { startFrame: 0, sequence: { steps: [] } },
    ]),
  );
  await selectPath(`childSkill.scheduledSequences[${index}]`);
}
async function appendStep(kind: EditableCombatStepKind): Promise<void> {
  const sequencePath =
    selectedSequenceIndex.value === undefined
      ? selectedPath.value
      : `${selectedPath.value}.sequence`;
  const result = appendCombatStepInStructure(props.definition, sequencePath, createStep(kind));
  emitStructureUpdate(result.root);
  pendingStep.value = false;
  await selectPath(result.stepPath);
}
function setLifetimeKind(event: Event): void {
  const kind = (event.target as HTMLSelectElement).value;
  emit(
    'update',
    replaceStructureValueAtPath(
      props.definition,
      'lifetime',
      kind === 'limited'
        ? {
            kind: 'limited',
            durationSeconds:
              props.definition.lifetime.kind === 'limited'
                ? props.definition.lifetime.durationSeconds
                : 1,
          }
        : { kind: 'infinite' },
    ),
  );
}
function setLifetimeDuration(event: Event): void {
  if (props.definition.lifetime.kind !== 'limited') return;
  const durationSeconds = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(durationSeconds) || durationSeconds < 0) return;
  emit(
    'update',
    replaceStructureValueAtPath(props.definition, 'lifetime', {
      kind: 'limited',
      durationSeconds,
    }),
  );
}
function updateChildSkillId(event: Event): void {
  const childSkill = props.definition.childSkill;
  if (childSkill === undefined) return;
  emit(
    'update',
    replaceStructureValueAtPath(props.definition, 'childSkill', {
      ...childSkill,
      skillId: (event.target as HTMLInputElement).value,
    }),
  );
}
function updateChildBlackboard(blackboard: NonNullable<SkillDefinition['blackboard']>): void {
  const childSkill = props.definition.childSkill;
  if (childSkill === undefined) return;
  const next = { ...childSkill };
  if (Object.keys(blackboard).length === 0) delete next.blackboard;
  else next.blackboard = blackboard;
  emit('update', replaceStructureValueAtPath(props.definition, 'childSkill', next));
}
function updateSequenceFrame(field: 'startFrame' | 'endFrame', event: Event): void {
  if (selectedSequence.value === undefined || selectedSequenceIndex.value === undefined) return;
  const raw = (event.target as HTMLInputElement).value;
  const next: ScheduledSequenceDefinition = { ...selectedSequence.value };
  if (field === 'endFrame' && raw === '') delete next.endFrame;
  else {
    const value = Math.round(Number(raw));
    if (!Number.isFinite(value) || value < 0) return;
    next[field] = value;
  }
  emit(
    'update',
    replaceStructureValueAtPath(
      props.definition,
      `childSkill.scheduledSequences[${selectedSequenceIndex.value}]`,
      next,
    ),
  );
}
function updateStep(step: CombatStepDefinition): void {
  emit('update', replaceStructureValueAtPath(props.definition, selectedPath.value, step));
}
async function moveSequence(offset: -1 | 1): Promise<void> {
  const childSkill = props.definition.childSkill;
  const index = selectedSequenceIndex.value;
  if (childSkill === undefined || index === undefined) return;
  const target = index + offset;
  if (target < 0 || target >= childSkill.scheduledSequences.length) return;
  const sequences = [...childSkill.scheduledSequences];
  [sequences[index], sequences[target]] = [sequences[target]!, sequences[index]!];
  emitStructureUpdate(
    replaceStructureValueAtPath(props.definition, 'childSkill.scheduledSequences', sequences),
  );
  await selectPath(`childSkill.scheduledSequences[${target}]`);
}
async function copySequence(): Promise<void> {
  const childSkill = props.definition.childSkill;
  const index = selectedSequenceIndex.value;
  const sequence = index === undefined ? undefined : childSkill?.scheduledSequences[index];
  if (childSkill === undefined || index === undefined || sequence === undefined) return;
  const copy: ScheduledSequenceDefinition = {
    ...sequence,
    sequence: { steps: sequence.sequence.steps.map(duplicateStep) },
  };
  const sequences = [...childSkill.scheduledSequences];
  sequences.splice(index + 1, 0, copy);
  emitStructureUpdate(
    replaceStructureValueAtPath(props.definition, 'childSkill.scheduledSequences', sequences),
  );
  await selectPath(`childSkill.scheduledSequences[${index + 1}]`);
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
function childArrayPath(
  node: StructureOperationNode,
  kind: 'combatStep' | 'scheduledSequence',
): string | undefined {
  if (kind === 'scheduledSequence') {
    return node.acceptsChildKind === kind ? `${node.sourcePath}.scheduledSequences` : undefined;
  }
  if (node.acceptsChildKind !== kind) return undefined;
  return node.payloadKind === 'scheduledSequence'
    ? `${node.sourcePath}.sequence.steps`
    : `${node.sourcePath}.steps`;
}
async function moveStructureNode(operation: {
  readonly source: StructureOperationNode;
  readonly target: StructureOperationNode;
  readonly placement: 'inside' | 'before' | 'after';
}): Promise<void> {
  const kind = operation.source.payloadKind;
  if (kind !== 'combatStep' && kind !== 'scheduledSequence') return;
  let arrayPath: string;
  let index: number | undefined;
  if (operation.placement === 'inside') {
    const path = childArrayPath(operation.target, kind);
    if (path === undefined) return;
    arrayPath = path;
  } else {
    const match = /^(.*)\[(\d+)\]$/.exec(operation.target.sourcePath);
    if (match === null || operation.target.payloadKind !== kind) return;
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
  if (action === 'copy') {
    if (node.payloadKind === 'combatStep') {
      structureClipboard.value = {
        kind: 'combatStep',
        value: cloneStructureValue(
          resolveStructureValue(props.definition, node.sourcePath) as CombatStepDefinition,
        ),
      };
    } else if (node.payloadKind === 'scheduledSequence') {
      structureClipboard.value = {
        kind: 'scheduledSequence',
        value: cloneStructureValue(
          resolveStructureValue(props.definition, node.sourcePath) as ScheduledSequenceDefinition,
        ),
      };
    }
    return;
  }
  if (
    action === 'delete' &&
    (node.payloadKind === 'combatStep' || node.payloadKind === 'scheduledSequence')
  ) {
    const parentPath = node.sourcePath.replace(
      /\.steps\[\d+\]$|childSkill\.scheduledSequences\[\d+\]$/,
      '',
    );
    emitStructureUpdate(removeStructureArrayItem(props.definition, node.sourcePath));
    await selectPath(parentPath);
    return;
  }
  const clipboard = structureClipboard.value;
  if (action !== 'paste' || clipboard === undefined) return;
  const arrayPath = childArrayPath(node, clipboard.kind);
  if (arrayPath === undefined) return;
  const value =
    clipboard.kind === 'combatStep'
      ? duplicateStep(clipboard.value)
      : {
          ...clipboard.value,
          sequence: { steps: clipboard.value.sequence.steps.map(duplicateStep) },
        };
  const result = insertStructureArrayItem(props.definition, arrayPath, value);
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
  if (selectedSequenceIndex.value !== undefined && props.definition.childSkill !== undefined) {
    const sequences = props.definition.childSkill.scheduledSequences.filter(
      (_, index) => index !== selectedSequenceIndex.value,
    );
    emitStructureUpdate(
      replaceStructureValueAtPath(props.definition, 'childSkill.scheduledSequences', sequences),
    );
    await selectPath('childSkill');
  } else if (selectedId.value === 'entity:child-skill') {
    const next = { ...props.definition };
    delete next.childSkill;
    emitStructureUpdate(next);
    await selectPath('');
  }
}
</script>

<template>
  <div class="definition-graph-editor">
    <SkillStructureMindMap
      ref="map"
      :root="root"
      :selected-id="selectedId"
      :show-reference-pins="false"
      :clipboard-kind="structureClipboard?.kind"
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
        v-if="pendingStep"
        :key="pickerKey"
        class="floating-picker"
        :anchor="insertAnchor"
        hide-trigger
        open-on-mount
        @select="appendStep"
      />
      <section v-if="selectedId === 'entity'" class="node-card">
        <header>
          <div>
            <small>能力实体</small><strong>{{ abilityEntityId }}</strong>
          </div>
        </header>
        <p>{{ selectedNode?.summary }}</p>
        <p>生命周期与子技能分别作为导图子节点编辑。</p>
      </section>
      <section v-else-if="selectedId === 'entity:lifetime'" class="node-card">
        <header>
          <div><small>实体设置</small><strong>生命周期</strong></div>
        </header>
        <label class="field-row">
          <span>类型</span>
          <select :value="definition.lifetime.kind" @change="setLifetimeKind">
            <option value="limited">有限</option>
            <option value="infinite">无限</option>
          </select>
        </label>
        <label v-if="definition.lifetime.kind === 'limited'" class="field-row">
          <span>持续秒数</span>
          <input
            type="number"
            min="0"
            step="0.01"
            :value="definition.lifetime.durationSeconds"
            @input="setLifetimeDuration"
          />
        </label>
      </section>
      <section v-else-if="selectedId === 'entity:child-skill'" class="node-card">
        <header>
          <div>
            <small>实体子技能</small><strong>{{ definition.childSkill?.skillId }}</strong>
          </div>
          <button @click="deleteCurrent">
            <el-icon><Delete /></el-icon>
          </button>
        </header>
        <label class="field-row">
          <span>子技能 ID</span>
          <input :value="definition.childSkill?.skillId" @input="updateChildSkillId" />
        </label>
        <SkillBlackboardEditor
          :blackboard="definition.childSkill?.blackboard ?? {}"
          :skill-level="skillLevel"
          @update="updateChildBlackboard"
        />
        <p>调度序列从导图节点的＋添加。</p>
      </section>
      <section v-else-if="selectedSequence" class="node-card">
        <header>
          <div>
            <small>子技能调度序列</small><strong>序列 {{ selectedSequenceIndex! + 1 }}</strong>
          </div>
          <div class="node-actions">
            <button :disabled="selectedSequenceIndex === 0" @click="moveSequence(-1)">
              <el-icon><ArrowUp /></el-icon>
            </button>
            <button
              :disabled="
                selectedSequenceIndex === definition.childSkill!.scheduledSequences.length - 1
              "
              @click="moveSequence(1)"
            >
              <el-icon><ArrowDown /></el-icon>
            </button>
            <button @click="copySequence">
              <el-icon><CopyDocument /></el-icon>
            </button>
            <button @click="deleteCurrent">
              <el-icon><Delete /></el-icon>
            </button>
          </div>
        </header>
        <label class="field-row">
          <span>开始帧</span>
          <input
            type="number"
            :value="selectedSequence.startFrame"
            @input="updateSequenceFrame('startFrame', $event)"
          />
        </label>
        <label class="field-row">
          <span>结束帧</span>
          <input
            type="number"
            :value="selectedSequence.endFrame ?? ''"
            @input="updateSequenceFrame('endFrame', $event)"
          />
        </label>
        <p>子步骤从导图节点的＋添加。</p>
      </section>
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
        </header>
        <p>此节点只承载子节点，请在导图中添加和选择下一层。</p>
      </section>
    </main>
  </div>
</template>

<style scoped>
.definition-graph-editor {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(360px, 1.2fr) minmax(300px, 0.8fr);
  height: 650px;
  border: 1px solid var(--ea-border-soft);
}
.definition-inspector {
  position: relative;
  min-width: 0;
  padding: 14px;
  overflow: auto;
  container-type: inline-size;
  border-left: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
}
.floating-picker {
  position: absolute;
  width: 0;
  height: 0;
}
.node-card header,
.node-actions {
  display: flex;
  align-items: center;
  gap: 6px;
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
.node-card p,
.field-row span {
  color: var(--ea-fg-muted);
}
.node-card p {
  padding: 12px;
}
.field-row {
  display: grid;
  grid-template-columns: minmax(88px, 120px) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}
input,
select {
  min-width: 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  height: 30px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
button {
  min-width: 28px;
  min-height: 28px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
@container (max-width: 420px) {
  .field-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .node-card header {
    align-items: flex-start;
    flex-direction: column;
    padding-block: 8px;
  }
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
