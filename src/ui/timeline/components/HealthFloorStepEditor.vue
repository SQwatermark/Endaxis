<script setup lang="ts">
import type {
  ActionValueOperand,
  CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';

type HealthFloorStep = Extract<CombatStepDefinition, { kind: 'setHealthFloor' }>;
const props = defineProps<{ step: HealthFloorStep }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();

function setMode(event: Event): void {
  const mode = (event.target as HTMLSelectElement).value as 'absolute' | 'maxHealthRatio';
  emit('update', { ...props.step, parameters: { ...props.step.parameters, mode } });
}

function setValue(value: ActionValueOperand): void {
  emit('update', { ...props.step, parameters: { ...props.step.parameters, value } });
}
</script>

<template>
  <div class="step-editor__grid">
    <label>
      <span>生命下限形式</span>
      <select :value="step.parameters.mode" @change="setMode">
        <option value="absolute">绝对生命值</option>
        <option value="maxHealthRatio">最大生命比例</option>
      </select>
    </label>
    <label class="step-editor__operand">
      <span>{{ step.parameters.mode === 'maxHealthRatio' ? '下限比例' : '生命下限' }}</span>
      <ActionValueOperandEditor
        :value="step.parameters.value"
        :labels="{
          constant: '常量',
          blackboard: '动作黑板',
          blackboardKey: '黑板键',
          constantValue: '常量值',
        }"
        @update="setValue"
      />
    </label>
    <p class="source-value-editor__note">
      此下限只在当前动作寿命内有效；多个下限同时存在时取最高值。
    </p>
  </div>
</template>
