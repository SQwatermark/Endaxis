<script setup lang="ts">
/**
 * 条件分支、单次作用域与逐 Tick 步骤的递归容器。
 *
 * 嵌套序列继续使用统一 CombatStepEditor，避免顶层和分支内步骤形成两套编辑语义。
 * 为解除组件循环依赖，递归编辑器按需异步加载；步骤默认值由顶层草稿工厂提供。
 */
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  CombatCondition,
  CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import type { EditableCombatStepKind } from '../skillDefinitionEditorViewModel';
import EditorFieldLabel from './EditorFieldLabel.vue';
import CombatConditionEditor from './CombatConditionEditor.vue';
import StepTypePicker from './StepTypePicker.vue';

const RecursiveStepEditor = defineAsyncComponent(() => import('./CombatStepEditor.vue'));
type BranchStep = Extract<
  CombatStepDefinition,
  { kind: 'conditional' | 'once' | 'repeatEachTick' }
>;
type BranchName = 'whenTrue' | 'whenFalse' | 'body';

const props = defineProps<{
  step: BranchStep;
  skillLevel: number;
  createStep?: (kind: EditableCombatStepKind) => CombatStepDefinition;
  duplicateStep?: (step: CombatStepDefinition) => CombatStepDefinition;
  selectedPath?: string;
  inspectorOnly?: boolean;
}>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const { t } = useI18n({ useScope: 'global' });
const selectedBranch = ref<BranchName>(props.step.kind === 'conditional' ? 'whenTrue' : 'body');
const selectedIndex = ref(0);

const steps = computed(() => {
  if (props.step.kind !== 'conditional') return props.step.body.steps;
  return selectedBranch.value === 'whenFalse'
    ? (props.step.whenFalse?.steps ?? [])
    : props.step.whenTrue.steps;
});
const selectedStep = computed(() => steps.value[selectedIndex.value]);
const nestedSelectedPath = computed(() => {
  const prefix = `${selectedBranch.value}.steps[${selectedIndex.value}]`;
  if (!props.selectedPath?.startsWith(prefix)) return '';
  return props.selectedPath.slice(prefix.length).replace(/^\./, '');
});

watch(
  () => props.selectedPath,
  path => {
    const match = path?.match(/^(whenTrue|whenFalse|body)\.steps\[(\d+)\]/);
    if (match === null || match === undefined) return;
    const branch = match[1] as BranchName;
    if (props.step.kind === 'conditional' && branch === 'body') return;
    if (props.step.kind !== 'conditional' && branch !== 'body') return;
    selectedBranch.value = branch;
    selectedIndex.value = Number(match[2]);
  },
  { immediate: true },
);

function setCondition(condition: CombatCondition): void {
  if (props.step.kind !== 'conditional') return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, condition } });
}

function setScopeKey(event: Event): void {
  if (props.step.kind !== 'once') return;
  emit('update', {
    ...props.step,
    parameters: { scopeKey: (event.target as HTMLInputElement).value },
  });
}

function setRepeatMode(event: Event): void {
  if (props.step.kind !== 'repeatEachTick') return;
  const mode = (event.target as HTMLSelectElement).value;
  emit('update', {
    ...props.step,
    parameters:
      mode === 'nativeChanneling'
        ? {
            nativeChanneling: {
              executeEachFrame: false,
              triggerIntervalSeconds: 1,
              maxCountPerTarget: -1,
              targetTriggerIntervalSeconds: 0,
            },
          }
        : mode === 'nativeTickInterval'
          ? { nativeTickInterval: { executeEachFrame: false, intervalSeconds: 1 } }
          : {},
  });
}

function setRepeatBoolean(owner: 'nativeChanneling' | 'nativeTickInterval', event: Event): void {
  if (props.step.kind !== 'repeatEachTick') return;
  const current = props.step.parameters[owner];
  if (current === undefined) return;
  emit('update', {
    ...props.step,
    parameters: {
      [owner]: {
        ...current,
        executeEachFrame: (event.target as HTMLInputElement).checked,
      },
    },
  });
}

function setRepeatNumber(
  owner: 'nativeChanneling' | 'nativeTickInterval',
  field:
    | 'triggerIntervalSeconds'
    | 'maxCountPerTarget'
    | 'targetTriggerIntervalSeconds'
    | 'intervalSeconds',
  event: Event,
): void {
  if (props.step.kind !== 'repeatEachTick') return;
  const current = props.step.parameters[owner];
  const value = Number((event.target as HTMLInputElement).value);
  if (current === undefined || !Number.isFinite(value)) return;
  emit('update', {
    ...props.step,
    parameters: { [owner]: { ...current, [field]: value } },
  });
}

function replaceBranchSteps(nextSteps: readonly CombatStepDefinition[]): void {
  if (props.step.kind !== 'conditional') {
    emit('update', { ...props.step, body: { steps: nextSteps } });
  } else if (selectedBranch.value === 'whenFalse') {
    emit('update', { ...props.step, whenFalse: { steps: nextSteps } });
  } else {
    emit('update', { ...props.step, whenTrue: { steps: nextSteps } });
  }
}

function appendStep(kind: EditableCombatStepKind): void {
  if (!props.createStep) return;
  replaceBranchSteps([...steps.value, props.createStep(kind)]);
  selectedIndex.value = steps.value.length;
}

function replaceStep(step: CombatStepDefinition): void {
  const next = [...steps.value];
  next[selectedIndex.value] = step;
  replaceBranchSteps(next);
}

function removeStep(index: number): void {
  replaceBranchSteps(steps.value.filter((_, itemIndex) => itemIndex !== index));
  selectedIndex.value = Math.max(0, Math.min(selectedIndex.value, steps.value.length - 2));
}
</script>

<template>
  <div class="branch-editor">
    <CombatConditionEditor
      v-if="step.kind === 'conditional' && !inspectorOnly"
      :condition="step.parameters.condition"
      @update="setCondition"
    />
    <label v-else-if="step.kind === 'once'" class="branch-editor__field">
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.scopeKey')"
        :help="t('nextTimeline.skillEditing.fieldHelp.scopeKey')"
      />
      <input type="text" :value="step.parameters.scopeKey" @input="setScopeKey" />
    </label>

    <div v-else-if="step.kind === 'repeatEachTick'" class="branch-editor__repeat-fields">
      <label class="branch-editor__field">
        <span>驱动语义</span>
        <select
          :value="
            step.parameters.nativeChanneling !== undefined
              ? 'nativeChanneling'
              : step.parameters.nativeTickInterval !== undefined
                ? 'nativeTickInterval'
                : 'hostTick'
          "
          @change="setRepeatMode"
        >
          <option value="hostTick">宿主每 Tick</option>
          <option value="nativeChanneling">原生引导扫描</option>
          <option value="nativeTickInterval">原生定时 Tick</option>
        </select>
      </label>
      <template v-if="step.parameters.nativeChanneling !== undefined">
        <label class="branch-editor__field">
          <span>扫描间隔（秒）</span>
          <input
            type="number"
            min="0"
            step="0.01"
            :value="step.parameters.nativeChanneling.triggerIntervalSeconds"
            @input="setRepeatNumber('nativeChanneling', 'triggerIntervalSeconds', $event)"
          />
        </label>
        <label class="branch-editor__field">
          <span>每目标最多次数</span>
          <input
            type="number"
            min="-1"
            step="1"
            :value="step.parameters.nativeChanneling.maxCountPerTarget"
            @input="setRepeatNumber('nativeChanneling', 'maxCountPerTarget', $event)"
          />
        </label>
        <label class="branch-editor__field">
          <span>同目标间隔（秒）</span>
          <input
            type="number"
            min="0"
            step="0.01"
            :value="step.parameters.nativeChanneling.targetTriggerIntervalSeconds"
            @input="setRepeatNumber('nativeChanneling', 'targetTriggerIntervalSeconds', $event)"
          />
        </label>
        <label class="branch-editor__repeat-check">
          <input
            type="checkbox"
            :checked="step.parameters.nativeChanneling.executeEachFrame"
            @change="setRepeatBoolean('nativeChanneling', $event)"
          />
          <span>每帧执行</span>
        </label>
      </template>
      <template v-else-if="step.parameters.nativeTickInterval !== undefined">
        <label class="branch-editor__field">
          <span>Tick 间隔（秒）</span>
          <input
            type="number"
            min="0"
            step="0.01"
            :value="step.parameters.nativeTickInterval.intervalSeconds"
            @input="setRepeatNumber('nativeTickInterval', 'intervalSeconds', $event)"
          />
        </label>
        <label class="branch-editor__repeat-check">
          <input
            type="checkbox"
            :checked="step.parameters.nativeTickInterval.executeEachFrame"
            @change="setRepeatBoolean('nativeTickInterval', $event)"
          />
          <span>每帧执行</span>
        </label>
      </template>
    </div>

    <div v-if="step.kind === 'conditional' && !inspectorOnly" class="branch-editor__tabs">
      <button
        type="button"
        :class="{ active: selectedBranch === 'whenTrue' }"
        @click="
          selectedBranch = 'whenTrue';
          selectedIndex = 0;
        "
      >
        {{ t('nextTimeline.skillEditing.whenTrue') }}
      </button>
      <button
        type="button"
        :class="{ active: selectedBranch === 'whenFalse' }"
        @click="
          selectedBranch = 'whenFalse';
          selectedIndex = 0;
        "
      >
        {{ t('nextTimeline.skillEditing.whenFalse') }}
      </button>
    </div>

    <div v-if="!inspectorOnly" class="branch-editor__body">
      <div class="branch-editor__list">
        <button
          v-for="(item, index) in steps"
          :key="`${item.kind}-${index}`"
          type="button"
          :class="{ active: selectedIndex === index }"
          @click="selectedIndex = index"
        >
          {{ index + 1 }}. {{ t(`nextTimeline.skillEditing.stepKinds.${item.kind}`) }}
          <span @click.stop="removeStep(index)">×</span>
        </button>
        <StepTypePicker :disabled="!createStep" @select="appendStep" />
      </div>
      <RecursiveStepEditor
        v-if="selectedStep"
        :step="selectedStep"
        :skill-level="skillLevel"
        :create-step="createStep"
        :duplicate-step="duplicateStep"
        :selected-path="nestedSelectedPath"
        @update="replaceStep"
      />
    </div>
  </div>
</template>

<style scoped>
.branch-editor {
  padding: 14px;
}
.branch-editor__field {
  display: grid;
  grid-template-columns: minmax(130px, 180px) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.branch-editor__repeat-fields {
  display: grid;
  gap: 10px;
}
.branch-editor__repeat-check {
  display: flex;
  align-items: center;
  gap: 8px;
}
.branch-editor__tabs {
  display: flex;
  margin-top: 14px;
}
.branch-editor__tabs button,
.branch-editor__list button {
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
.branch-editor button.active {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}
.branch-editor__body {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 12px;
  margin-top: 10px;
}
.branch-editor__list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.branch-editor__list > button {
  min-height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}
.branch-editor input,
.branch-editor select {
  min-width: 0;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
@container (max-width: 760px) {
  .branch-editor__body {
    grid-template-columns: 1fr;
  }
}
</style>
