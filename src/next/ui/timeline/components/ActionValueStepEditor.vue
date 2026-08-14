<script setup lang="ts">
/**
 * 动作黑板运算步骤的专用参数编辑器。
 *
 * 只处理 modifyActionValue 与 calculateActionValue。每次更新都回传完整步骤对象，
 * 并保留 parameters 中未展示的字段；操作数交给 ActionValueOperandEditor 编辑。
 */
import { useI18n } from 'vue-i18n';
import {
  ACTION_VALUE_CALCULATION_OPERATIONS,
  ACTION_VALUE_OPERATIONS,
  type ActionValueOperand,
  type CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';
import EditorFieldLabel from './EditorFieldLabel.vue';

type ActionValueStep = Extract<
  CombatStepDefinition,
  { kind: 'modifyActionValue' | 'calculateActionValue' }
>;

const props = defineProps<{ step: ActionValueStep; skillLevel: number }>();
const emit = defineEmits<{ update: [step: ActionValueStep] }>();
const { t } = useI18n({ useScope: 'global' });

const operandLabels = () => ({
  constant: t('nextTimeline.skillEditing.operandConstant'),
  blackboard: t('nextTimeline.skillEditing.operandBlackboard'),
  blackboardKey: t('nextTimeline.skillEditing.operandBlackboardKey'),
  constantValue: t('nextTimeline.skillEditing.operandConstantValue'),
});

function setKey(event: Event): void {
  const key = (event.target as HTMLInputElement).value;
  if (props.step.kind === 'modifyActionValue') {
    emit('update', { ...props.step, parameters: { ...props.step.parameters, key } });
  } else {
    emit('update', { ...props.step, parameters: { ...props.step.parameters, key } });
  }
}

function setOperation(event: Event): void {
  if (props.step.kind === 'modifyActionValue') {
    const operation = (event.target as HTMLSelectElement)
      .value as (typeof ACTION_VALUE_OPERATIONS)[number];
    if (!ACTION_VALUE_OPERATIONS.includes(operation)) return;
    emit('update', { ...props.step, parameters: { ...props.step.parameters, operation } });
    return;
  }
  const operation = (event.target as HTMLSelectElement)
    .value as (typeof ACTION_VALUE_CALCULATION_OPERATIONS)[number];
  if (!ACTION_VALUE_CALCULATION_OPERATIONS.includes(operation)) return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, operation } });
}

function setValue(value: ActionValueOperand): void {
  if (props.step.kind !== 'modifyActionValue') return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, value } });
}

function setLeft(value: ActionValueOperand): void {
  if (props.step.kind !== 'calculateActionValue') return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, left: value } });
}

function setRight(value: ActionValueOperand): void {
  if (props.step.kind !== 'calculateActionValue') return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, right: value } });
}
</script>

<template>
  <template v-if="step.kind === 'modifyActionValue'">
    <div class="step-editor__grid">
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.blackboardKey')"
          :help="t('nextTimeline.skillEditing.fieldHelp.blackboardKey')"
        />
        <input type="text" :value="step.parameters.key" @input="setKey" />
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.operation')"
          :help="t('nextTimeline.skillEditing.fieldHelp.actionOperation')"
        />
        <select :value="step.parameters.operation" @change="setOperation">
          <option v-for="item in ACTION_VALUE_OPERATIONS" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </label>
    </div>
    <div class="step-editor__grid">
      <label class="step-editor__operand">
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.value')"
          :help="t('nextTimeline.skillEditing.fieldHelp.actionOperand')"
        />
        <ActionValueOperandEditor
          :value="step.parameters.value"
          :labels="operandLabels()"
          @update="setValue"
        />
      </label>
    </div>
  </template>

  <template v-else-if="step.kind === 'calculateActionValue'">
    <div class="step-editor__grid">
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.blackboardKey')"
          :help="t('nextTimeline.skillEditing.fieldHelp.blackboardKey')"
        />
        <input type="text" :value="step.parameters.key" @input="setKey" />
      </label>
      <label>
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.operation')"
          :help="t('nextTimeline.skillEditing.fieldHelp.calculationOperation')"
        />
        <select :value="step.parameters.operation" @change="setOperation">
          <option v-for="item in ACTION_VALUE_CALCULATION_OPERATIONS" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </label>
    </div>
    <div class="step-editor__grid">
      <label class="step-editor__operand">
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.operandLeft')"
          :help="t('nextTimeline.skillEditing.fieldHelp.calculationOperand')"
        />
        <ActionValueOperandEditor
          :value="step.parameters.left"
          :labels="operandLabels()"
          @update="setLeft"
        />
      </label>
      <label class="step-editor__operand">
        <EditorFieldLabel
          :label="t('nextTimeline.skillEditing.operandRight')"
          :help="t('nextTimeline.skillEditing.fieldHelp.calculationOperand')"
        />
        <ActionValueOperandEditor
          :value="step.parameters.right"
          :labels="operandLabels()"
          @update="setRight"
        />
      </label>
    </div>
  </template>
</template>
