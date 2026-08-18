<script setup lang="ts">
/** 编辑普通治疗公式；目标选择仍由场景中的控制时间线与干员生命账本解析。 */
import { useI18n } from 'vue-i18n';
import {
  HEAL_TARGETS,
  OPERATOR_ATTRIBUTES,
  type ActionValueOperand,
  type CombatStepDefinition,
  type HealTarget,
  type OperatorAttribute,
} from '../../../core/game-data/operatorDefinition';
import {
  replaceLevelValueForEditor,
  resolveLevelValueForEditor,
} from '../skillDefinitionEditorViewModel';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';
import EditorFieldLabel from './EditorFieldLabel.vue';

type HealStep = Extract<CombatStepDefinition, { kind: 'heal' }>;
type FormulaField = 'multiplier' | 'addition';

const props = defineProps<{ step: HealStep; skillLevel: number }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const { t } = useI18n({ useScope: 'global' });

function isOperand(value: unknown): value is ActionValueOperand {
  return typeof value === 'object' && value !== null && 'kind' in value;
}

function update(parameters: HealStep['parameters']): void {
  emit('update', { ...props.step, parameters });
}

function setTarget(event: Event): void {
  const target = (event.target as HTMLSelectElement).value as HealTarget;
  if (HEAL_TARGETS.includes(target)) update({ ...props.step.parameters, target });
}

function setAttribute(event: Event): void {
  const attribute = (event.target as HTMLSelectElement).value as OperatorAttribute;
  if (OPERATOR_ATTRIBUTES.includes(attribute)) update({ ...props.step.parameters, attribute });
}

function setFormulaValue(field: FormulaField, event: Event): void {
  const current = props.step.parameters[field];
  if (isOperand(current)) return;
  const value = Number((event.target as HTMLInputElement).value);
  if (!Number.isFinite(value)) return;
  update({
    ...props.step.parameters,
    [field]: replaceLevelValueForEditor(current, props.skillLevel, value),
  });
}

function setFormulaOperand(field: FormulaField, value: ActionValueOperand): void {
  update({ ...props.step.parameters, [field]: value });
}

function setFormulaKind(field: FormulaField, event: Event): void {
  const kind = (event.target as HTMLSelectElement).value;
  const current = props.step.parameters[field];
  if (kind === 'blackboard') {
    update({
      ...props.step.parameters,
      [field]:
        isOperand(current) && current.kind === 'blackboard'
          ? current
          : { kind: 'blackboard', key: '' },
    });
    return;
  }
  if (kind !== 'constant') return;
  const value = isOperand(current)
    ? current.kind === 'constant'
      ? current.value
      : field === 'multiplier'
        ? 1
        : 0
    : (resolveLevelValueForEditor(current, props.skillLevel) ?? 0);
  update({ ...props.step.parameters, [field]: value });
}

function formulaValue(field: FormulaField): number | undefined {
  const value = props.step.parameters[field];
  return isOperand(value) ? undefined : resolveLevelValueForEditor(value, props.skillLevel);
}

function setTagIds(event: Event): void {
  const raw = (event.target as HTMLTextAreaElement).value.trim();
  if (raw === '') {
    update({ ...props.step.parameters, tagIds: [] });
    return;
  }
  const tokens = raw.split(/[\s,]+/);
  const tagIds = tokens.map(Number);
  if (tagIds.some(value => !Number.isInteger(value))) return;
  update({ ...props.step.parameters, tagIds });
}

const operandLabels = () => ({
  constant: t('nextTimeline.skillEditing.operandConstant'),
  blackboard: t('nextTimeline.skillEditing.operandBlackboard'),
  blackboardKey: t('nextTimeline.skillEditing.operandBlackboardKey'),
  constantValue: t('nextTimeline.skillEditing.operandConstantValue'),
});
</script>

<template>
  <div class="step-editor__grid">
    <label>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.target')"
        :help="t('nextTimeline.skillEditing.fieldHelp.healTarget')"
      />
      <select :value="step.parameters.target" @change="setTarget">
        <option v-for="target in HEAL_TARGETS" :key="target" :value="target">
          {{ t(`nextTimeline.skillEditing.healTargets.${target}`) }}
        </option>
      </select>
    </label>
    <label>
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.attribute')"
        :help="t('nextTimeline.skillEditing.fieldHelp.healAttribute')"
      />
      <select :value="step.parameters.attribute" @change="setAttribute">
        <option v-for="attribute in OPERATOR_ATTRIBUTES" :key="attribute" :value="attribute">
          {{ t(`nextTimeline.skillEditing.attributes.${attribute}`) }}
        </option>
      </select>
    </label>

    <label
      v-for="field in ['multiplier', 'addition'] as const"
      :key="field"
      class="step-editor__operand"
    >
      <EditorFieldLabel
        :label="
          t(`nextTimeline.skillEditing.heal${field === 'multiplier' ? 'Multiplier' : 'Addition'}`)
        "
        :help="
          t(
            `nextTimeline.skillEditing.fieldHelp.heal${field === 'multiplier' ? 'Multiplier' : 'Addition'}`,
          )
        "
      />
      <div class="heal-formula-editor">
        <select
          :value="
            isOperand(step.parameters[field]) && step.parameters[field].kind === 'blackboard'
              ? 'blackboard'
              : 'constant'
          "
          @change="setFormulaKind(field, $event)"
        >
          <option value="constant">{{ t('nextTimeline.skillEditing.operandConstant') }}</option>
          <option value="blackboard">{{ t('nextTimeline.skillEditing.operandBlackboard') }}</option>
        </select>
        <ActionValueOperandEditor
          v-if="isOperand(step.parameters[field])"
          :value="step.parameters[field] as ActionValueOperand"
          :labels="operandLabels()"
          @update="setFormulaOperand(field, $event)"
        />
        <input
          v-else
          type="number"
          step="0.01"
          :value="formulaValue(field)"
          @input="setFormulaValue(field, $event)"
        />
      </div>
    </label>

    <label class="step-editor__operand">
      <EditorFieldLabel
        :label="t('nextTimeline.skillEditing.healTagIds')"
        :help="t('nextTimeline.skillEditing.fieldHelp.healTagIds')"
      />
      <textarea :value="step.parameters.tagIds.join(', ')" rows="2" @change="setTagIds" />
    </label>
  </div>
</template>

<style scoped>
.heal-formula-editor {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(88px, 112px) minmax(0, 1fr);
  gap: 8px;
}

.heal-formula-editor :deep(.operand-editor) {
  grid-template-columns: minmax(0, 1fr);
}

textarea {
  min-width: 0;
  resize: vertical;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
</style>
