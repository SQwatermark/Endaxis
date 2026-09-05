<script setup lang="ts">
/** 当前 Buff 环境和剩余时长操作；这些步骤必须在 Buff 生命周期/事件上下文中执行。 */
import {
  BUFF_SINGLE_TARGETS,
  type ActionValueOperand,
  type BuffSingleTarget,
  type CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';

type BuffRuntimeStateStep = Extract<
  CombatStepDefinition,
  {
    kind:
      | 'readEventBuffBlackboard'
      | 'readCurrentBuffRemainingDuration'
      | 'readBuffRemainingDuration'
      | 'setCurrentBuffRemainingDuration'
      | 'refreshCurrentBuffAttributeModifiers'
      | 'finishCurrentBuff'
      | 'setCurrentBuffTimePaused';
  }
>;

const props = defineProps<{ step: BuffRuntimeStateStep }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();

const operandLabels = {
  constant: '常量',
  blackboard: '动作黑板',
  blackboardKey: '黑板键',
  constantValue: '常量值',
};

function parseIds(value: string): readonly string[] {
  return value
    .split(/[,\n]/)
    .map(item => item.trim())
    .filter(Boolean);
}

function setText(field: 'desiredKey' | 'outputKey', event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  if (props.step.kind === 'readEventBuffBlackboard') {
    emit('update', { ...props.step, parameters: { ...props.step.parameters, [field]: value } });
  } else if (field === 'outputKey' && props.step.kind === 'readCurrentBuffRemainingDuration') {
    emit('update', { ...props.step, parameters: { outputKey: value } });
  } else if (field === 'outputKey' && props.step.kind === 'readBuffRemainingDuration') {
    emit('update', { ...props.step, parameters: { ...props.step.parameters, outputKey: value } });
  }
}

function setTarget(event: Event): void {
  if (props.step.kind !== 'readBuffRemainingDuration') return;
  const target = (event.target as HTMLSelectElement).value as BuffSingleTarget;
  if (!BUFF_SINGLE_TARGETS.includes(target)) return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, target } });
}

function setBuffIds(event: Event): void {
  if (props.step.kind !== 'readBuffRemainingDuration') return;
  emit('update', {
    ...props.step,
    parameters: {
      ...props.step.parameters,
      buffIds: parseIds((event.target as HTMLTextAreaElement).value),
    },
  });
}

function setDurationOperation(event: Event): void {
  if (props.step.kind !== 'setCurrentBuffRemainingDuration') return;
  const operation = (event.target as HTMLSelectElement).value as 'assign' | 'add' | 'multiply';
  emit('update', { ...props.step, parameters: { ...props.step.parameters, operation } });
}

function setDurationValue(value: ActionValueOperand): void {
  if (props.step.kind !== 'setCurrentBuffRemainingDuration') return;
  emit('update', { ...props.step, parameters: { ...props.step.parameters, value } });
}

function setFinishReason(event: Event): void {
  if (props.step.kind !== 'finishCurrentBuff') return;
  const reason = (event.target as HTMLSelectElement).value as 'early' | 'absorbed' | 'other';
  emit('update', { ...props.step, parameters: { reason } });
}

function setPaused(event: Event): void {
  if (props.step.kind !== 'setCurrentBuffTimePaused') return;
  emit('update', {
    ...props.step,
    parameters: { paused: (event.target as HTMLInputElement).checked },
  });
}
</script>

<template>
  <div class="step-editor__grid">
    <template v-if="step.kind === 'readEventBuffBlackboard'">
      <label>
        <span>事件 Buff 黑板键</span>
        <input :value="step.parameters.desiredKey" @input="setText('desiredKey', $event)" />
      </label>
      <label>
        <span>写入动作黑板键</span>
        <input :value="step.parameters.outputKey" @input="setText('outputKey', $event)" />
      </label>
    </template>

    <template v-else-if="step.kind === 'readCurrentBuffRemainingDuration'">
      <label>
        <span>写入动作黑板键</span>
        <input :value="step.parameters.outputKey" @input="setText('outputKey', $event)" />
      </label>
    </template>

    <template v-else-if="step.kind === 'readBuffRemainingDuration'">
      <label>
        <span>Buff 宿主目标</span>
        <select :value="step.parameters.target" @change="setTarget">
          <option v-for="target in BUFF_SINGLE_TARGETS" :key="target" :value="target">
            {{ target }}
          </option>
        </select>
      </label>
      <label>
        <span>写入动作黑板键</span>
        <input :value="step.parameters.outputKey" @input="setText('outputKey', $event)" />
      </label>
      <label class="step-editor__operand">
        <span>Buff 身份列表</span>
        <textarea :value="step.parameters.buffIds.join(', ')" @change="setBuffIds" />
      </label>
    </template>

    <template v-else-if="step.kind === 'setCurrentBuffRemainingDuration'">
      <label>
        <span>修改方式</span>
        <select :value="step.parameters.operation" @change="setDurationOperation">
          <option value="assign">直接设置</option>
          <option value="add">增加</option>
          <option value="multiply">乘算</option>
        </select>
      </label>
      <label class="step-editor__operand">
        <span>剩余时长操作数</span>
        <ActionValueOperandEditor
          :value="step.parameters.value"
          :labels="operandLabels"
          @update="setDurationValue"
        />
      </label>
    </template>

    <template v-else-if="step.kind === 'finishCurrentBuff'">
      <label>
        <span>结束原因</span>
        <select :value="step.parameters.reason" @change="setFinishReason">
          <option value="early">提前结束</option>
          <option value="absorbed">被吸收</option>
          <option value="other">其他</option>
        </select>
      </label>
    </template>

    <template v-else-if="step.kind === 'setCurrentBuffTimePaused'">
      <label class="step-editor__check step-editor__check--field">
        <input type="checkbox" :checked="step.parameters.paused" @change="setPaused" />
        <span>暂停当前 Buff 计时</span>
      </label>
    </template>

    <p v-else class="buff-runtime-state-editor__empty">
      当前 Buff 属性修正会立即按其黑板重新求值；该步骤没有额外参数。
    </p>

    <p class="buff-runtime-state-editor__note">
      “当前 Buff”与“事件
      Buff”来自正在执行的生命周期或事件环境；缺少该环境时模拟会原地报错，不会猜测任意 Buff。
    </p>
  </div>
</template>

<style scoped>
.buff-runtime-state-editor__empty,
.buff-runtime-state-editor__note {
  grid-column: 1 / -1;
  margin: 0;
  padding: 10px 12px;
  color: var(--ea-fg-muted);
  line-height: 1.6;
}

.buff-runtime-state-editor__note {
  border-left: 2px solid var(--ea-gold);
  background: color-mix(in srgb, var(--ea-gold) 7%, transparent);
}

textarea {
  min-height: 54px;
  resize: vertical;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  padding: 6px;
}
</style>
