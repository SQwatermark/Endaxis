<script setup lang="ts">
/**
 * 编辑一条不带时间偏移的同步动作序列。
 * 技能调度、事件监听和 Buff 生命周期共用这里的步骤增删、排序、复制与参数编辑。
 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ArrowDown,
  ArrowUp,
  CaretBottom,
  CaretRight,
  CopyDocument,
  Delete,
} from '@element-plus/icons-vue';
import type {
  ActionSequenceDefinition,
  CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import type { EditableCombatStepKind } from '../skillDefinitionEditorViewModel';
import CombatStepEditor from './CombatStepEditor.vue';
import StepTypePicker from './StepTypePicker.vue';

const props = defineProps<{
  sequence: ActionSequenceDefinition;
  skillLevel: number;
  createStep: (kind: EditableCombatStepKind) => CombatStepDefinition;
  duplicateStep: (step: CombatStepDefinition) => CombatStepDefinition;
  selectedPath?: string;
}>();
const emit = defineEmits<{ update: [sequence: ActionSequenceDefinition] }>();
const { t } = useI18n({ useScope: 'global' });
const selectedStepIndex = ref(0);
const detailCollapsed = ref(false);
const nestedSelectedPath = computed(() => {
  const match = props.selectedPath?.match(/^steps\[(\d+)\](?:\.(.*))?$/);
  if (match === null || match === undefined || Number(match[1]) !== selectedStepIndex.value) {
    return '';
  }
  return match[2] ?? '';
});

watch(
  () => props.sequence,
  sequence => {
    selectedStepIndex.value = Math.max(
      0,
      Math.min(selectedStepIndex.value, sequence.steps.length - 1),
    );
  },
);

watch(
  () => props.selectedPath,
  path => {
    const match = path?.match(/^steps\[(\d+)\]/);
    if (match === null || match === undefined) return;
    const index = Number(match[1]);
    if (index < 0 || index >= props.sequence.steps.length) return;
    selectedStepIndex.value = index;
    detailCollapsed.value = false;
  },
  { immediate: true },
);

function replaceSteps(steps: readonly CombatStepDefinition[]): void {
  emit('update', { ...props.sequence, steps });
}

function replaceStep(step: CombatStepDefinition): void {
  const steps = [...props.sequence.steps];
  if (steps[selectedStepIndex.value] === undefined) return;
  steps[selectedStepIndex.value] = step;
  replaceSteps(steps);
}

function moveStep(offset: -1 | 1): void {
  const target = selectedStepIndex.value + offset;
  const steps = [...props.sequence.steps];
  if (target < 0 || target >= steps.length) return;
  [steps[selectedStepIndex.value], steps[target]] = [
    steps[target]!,
    steps[selectedStepIndex.value]!,
  ];
  selectedStepIndex.value = target;
  replaceSteps(steps);
}

function duplicateSelectedStep(): void {
  const source = props.sequence.steps[selectedStepIndex.value];
  if (source === undefined) return;
  const steps = [...props.sequence.steps];
  steps.splice(selectedStepIndex.value + 1, 0, props.duplicateStep(source));
  selectedStepIndex.value += 1;
  replaceSteps(steps);
}

function removeSelectedStep(): void {
  const steps = props.sequence.steps.filter((_, index) => index !== selectedStepIndex.value);
  selectedStepIndex.value = Math.max(0, Math.min(selectedStepIndex.value, steps.length - 1));
  replaceSteps(steps);
}

function appendStep(kind: EditableCombatStepKind): void {
  const steps = [...props.sequence.steps, props.createStep(kind)];
  selectedStepIndex.value = steps.length - 1;
  detailCollapsed.value = false;
  replaceSteps(steps);
}
</script>

<template>
  <div class="action-sequence-editor">
    <div class="action-sequence-editor__steps">
      <div class="action-sequence-editor__list-heading">
        <strong>{{ t('nextTimeline.skillEditing.steps') }}</strong>
        <span>{{ sequence.steps.length }}</span>
      </div>
      <button
        v-for="(step, stepIndex) in sequence.steps"
        :key="`${step.kind}-${step.key ?? ''}-${stepIndex}`"
        type="button"
        :class="{ 'is-active': selectedStepIndex === stepIndex }"
        @click="selectedStepIndex = stepIndex"
      >
        <span>{{ stepIndex + 1 }}</span>
        <strong>{{ t(`nextTimeline.skillEditing.stepKinds.${step.kind}`) }}</strong>
      </button>
      <StepTypePicker @select="appendStep" />
    </div>
    <div v-if="sequence.steps[selectedStepIndex]" class="action-sequence-editor__detail">
      <div class="action-sequence-editor__detail-heading">
        <div>
          <span>{{ t('nextTimeline.skillEditing.stepParameters') }}</span>
          <strong>{{
            t(`nextTimeline.skillEditing.stepKinds.${sequence.steps[selectedStepIndex]!.kind}`)
          }}</strong>
        </div>
        <div class="action-sequence-editor__toolbar">
          <button
            type="button"
            :aria-expanded="!detailCollapsed"
            :title="
              t(
                detailCollapsed
                  ? 'nextTimeline.skillEditing.expandStep'
                  : 'nextTimeline.skillEditing.collapseStep',
              )
            "
            @click="detailCollapsed = !detailCollapsed"
          >
            <el-icon><CaretRight v-if="detailCollapsed" /><CaretBottom v-else /></el-icon>
          </button>
          <button
            type="button"
            :disabled="selectedStepIndex === 0"
            :title="t('nextTimeline.skillEditing.moveStepUp')"
            @click="moveStep(-1)"
          >
            <el-icon><ArrowUp /></el-icon>
          </button>
          <button
            type="button"
            :disabled="selectedStepIndex === sequence.steps.length - 1"
            :title="t('nextTimeline.skillEditing.moveStepDown')"
            @click="moveStep(1)"
          >
            <el-icon><ArrowDown /></el-icon>
          </button>
          <button
            type="button"
            :title="t('nextTimeline.skillEditing.duplicateStep')"
            @click="duplicateSelectedStep"
          >
            <el-icon><CopyDocument /></el-icon>
          </button>
          <button
            type="button"
            class="is-danger"
            :title="t('nextTimeline.skillEditing.deleteStep')"
            @click="removeSelectedStep"
          >
            <el-icon><Delete /></el-icon>
          </button>
        </div>
      </div>
      <CombatStepEditor
        v-show="!detailCollapsed"
        :key="`${selectedStepIndex}:${sequence.steps[selectedStepIndex]!.kind}`"
        :step="sequence.steps[selectedStepIndex]!"
        :skill-level="skillLevel"
        :show-header="false"
        :create-step="createStep"
        :duplicate-step="duplicateStep"
        :selected-path="nestedSelectedPath"
        @update="replaceStep"
      />
    </div>
  </div>
</template>

<style scoped>
.action-sequence-editor {
  display: grid;
  grid-template-columns: minmax(230px, 280px) minmax(420px, 1fr);
  gap: 16px;
  min-width: 0;
}
.action-sequence-editor__steps,
.action-sequence-editor__detail {
  min-width: 0;
}
.action-sequence-editor__list-heading,
.action-sequence-editor__detail-heading {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 10px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
.action-sequence-editor__list-heading strong {
  font-size: 11px;
}
.action-sequence-editor__list-heading span {
  min-width: 22px;
  padding: 2px 5px;
  background: var(--ea-active-fill);
  color: var(--ea-fg-muted);
  text-align: center;
}
.action-sequence-editor__steps > button {
  width: 100%;
  min-height: 48px;
  display: grid;
  grid-template-columns: 28px 1fr;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--ea-border-soft);
  border-top: none;
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
  text-align: left;
  cursor: pointer;
}
.action-sequence-editor__steps > button.is-active {
  border-color: var(--ea-border);
  background: var(--ea-active-fill);
  box-shadow: inset 3px 0 0 var(--ea-gold);
}
.action-sequence-editor__steps > button span {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  background: var(--ea-active-fill);
  color: var(--ea-gold);
  font-weight: 700;
}
.action-sequence-editor__steps > :deep(.step-type-picker) {
  margin-top: 8px;
}
.action-sequence-editor__detail {
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
.action-sequence-editor__detail-heading {
  padding: 0 8px 0 12px;
  border: 0;
  border-bottom: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
}
.action-sequence-editor__detail-heading > div:first-child {
  display: grid;
  gap: 2px;
}
.action-sequence-editor__detail-heading span {
  color: var(--ea-fg-muted);
  font-size: 9px;
  text-transform: uppercase;
}
.action-sequence-editor__detail-heading strong {
  font-size: 12px;
}
.action-sequence-editor__toolbar {
  min-height: 34px;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}
.action-sequence-editor input,
.action-sequence-editor select {
  width: 100%;
  height: 30px;
  min-width: 0;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  padding: 0 6px;
}
.action-sequence-editor button {
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  cursor: pointer;
}
.action-sequence-editor button:disabled {
  opacity: 0.35;
  cursor: default;
}
.action-sequence-editor__toolbar button {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
}
.action-sequence-editor button:hover:not(:disabled) {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}
.action-sequence-editor button.is-danger:hover {
  border-color: #ff4d4f;
  color: #ff4d4f;
}
@container (max-width: 760px) {
  .action-sequence-editor {
    grid-template-columns: 1fr;
  }
}
</style>
