<script setup lang="ts">
/** 多分支选择的参数与候选顺序；分支内容继续使用公共序列编辑器。 */
import { computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  ActionSequenceDefinition,
  ActionValueOperand,
  CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import type { EditableCombatStepKind } from '../skillDefinitionEditorViewModel';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';

const SequenceEditor = defineAsyncComponent(() => import('./ActionSequenceEditor.vue'));
type SwitchStep = Extract<CombatStepDefinition, { kind: 'switch' }>;
const props = defineProps<{
  step: SwitchStep;
  skillLevel: number;
  createStep?: (kind: EditableCombatStepKind) => CombatStepDefinition;
  duplicateStep?: (step: CombatStepDefinition) => CombatStepDefinition;
  selectedPath?: string;
  inspectorOnly?: boolean;
}>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const { t } = useI18n({ useScope: 'global' });
const labels = computed(() => ({
  constant: t('nextTimeline.skillEditing.operandConstant'),
  blackboard: t('nextTimeline.skillEditing.operandBlackboard'),
  blackboardKey: t('nextTimeline.skillEditing.operandBlackboardKey'),
  constantValue: t('nextTimeline.skillEditing.operandConstantValue'),
}));
function setChoice(choice: ActionValueOperand): void {
  emit('update', { ...props.step, parameters: { ...props.step.parameters, choice } });
}
function setAlwaysNext(event: Event): void {
  emit('update', {
    ...props.step,
    parameters: {
      ...props.step.parameters,
      alwaysNext: (event.target as HTMLInputElement).checked,
    },
  });
}
function replaceOptions(options: SwitchStep['options']): void {
  emit('update', { ...props.step, options });
}
function setValue(index: number, value: ActionValueOperand): void {
  replaceOptions(
    props.step.options.map((option, at) => (at === index ? { ...option, value } : option)),
  );
}
function setSequence(index: number, sequence: ActionSequenceDefinition): void {
  replaceOptions(
    props.step.options.map((option, at) => (at === index ? { ...option, sequence } : option)),
  );
}
function move(index: number, offset: -1 | 1): void {
  const options = [...props.step.options];
  const target = index + offset;
  if (target < 0 || target >= options.length) return;
  [options[index], options[target]] = [options[target]!, options[index]!];
  replaceOptions(options);
}
function addOption(): void {
  replaceOptions([
    ...props.step.options,
    { value: { kind: 'constant', value: props.step.options.length }, sequence: { steps: [] } },
  ]);
}
function childPath(index: number): string {
  const prefix = `options[${index}].sequence.`;
  return props.selectedPath?.startsWith(prefix) ? props.selectedPath.slice(prefix.length) : '';
}
</script>

<template>
  <div class="switch-editor">
    <label class="switch-editor__choice">
      <span>{{ t('nextTimeline.skillEditing.switchChoice') }}</span>
      <ActionValueOperandEditor
        :value="step.parameters.choice"
        :labels="labels"
        @update="setChoice"
      />
    </label>
    <label class="switch-editor__continue">
      <input type="checkbox" :checked="step.parameters.alwaysNext" @change="setAlwaysNext" />
      {{ t('nextTimeline.skillEditing.switchAlwaysNext') }}
    </label>
    <p class="switch-editor__hint">{{ t('nextTimeline.skillEditing.switchOrderHint') }}</p>
    <section v-for="(option, index) in step.options" :key="index" class="switch-editor__option">
      <header>
        <strong>{{ t('nextTimeline.skillEditing.switchOption') }} {{ index + 1 }}</strong>
        <div class="switch-editor__tools">
          <button
            type="button"
            :disabled="index === 0"
            :aria-label="t('common.moveUp')"
            @click="move(index, -1)"
          >
            ↑
          </button>
          <button
            type="button"
            :disabled="index === step.options.length - 1"
            :aria-label="t('common.moveDown')"
            @click="move(index, 1)"
          >
            ↓
          </button>
          <button
            type="button"
            :aria-label="t('common.delete')"
            @click="replaceOptions(step.options.filter((_, at) => at !== index))"
          >
            ×
          </button>
        </div>
      </header>
      <ActionValueOperandEditor
        :value="option.value"
        :labels="labels"
        @update="setValue(index, $event)"
      />
      <details v-if="!inspectorOnly && createStep && duplicateStep" :open="!!childPath(index)">
        <summary>
          {{ t('nextTimeline.skillEditing.steps') }} ({{ option.sequence.steps.length }})
        </summary>
        <SequenceEditor
          :sequence="option.sequence"
          :skill-level="skillLevel"
          :create-step="createStep"
          :duplicate-step="duplicateStep"
          :selected-path="childPath(index)"
          @update="setSequence(index, $event)"
        />
      </details>
    </section>
    <button type="button" @click="addOption">
      ＋ {{ t('nextTimeline.skillEditing.switchAddOption') }}
    </button>
  </div>
</template>

<style scoped>
.switch-editor {
  display: grid;
  gap: 12px;
  min-width: 0;
  padding: 14px;
}
.switch-editor__choice,
.switch-editor__option {
  display: grid;
  gap: 8px;
  min-width: 0;
}
.switch-editor__option {
  border: 1px solid var(--ea-border);
  padding: 10px;
}
.switch-editor__option header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.switch-editor__tools {
  display: flex;
  gap: 4px;
}
.switch-editor__continue {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.switch-editor__hint {
  margin: 0;
  color: var(--ea-fg-muted);
  font-size: 12px;
}
.switch-editor button {
  min-height: 30px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  cursor: pointer;
}
.switch-editor button:disabled {
  opacity: 0.4;
  cursor: default;
}
.switch-editor summary {
  cursor: pointer;
  padding: 8px 0;
}
.switch-editor details {
  min-width: 0;
}
</style>
