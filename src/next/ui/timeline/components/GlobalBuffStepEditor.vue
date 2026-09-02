<script setup lang="ts">
import type {
  ActionValueOperand,
  BuffApplicationSource,
  CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import { BUFF_APPLICATION_SOURCES } from '../../../core/game-data/operatorDefinition';
import ActionValueAssignmentMapEditor from './ActionValueAssignmentMapEditor.vue';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';

type CreateStep = Extract<CombatStepDefinition, { kind: 'createGlobalBuff' }>;
type FinishStep = Extract<CombatStepDefinition, { kind: 'finishParentGlobalBuff' }>;
const props = defineProps<{ step: CreateStep | FinishStep }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const operandLabels = {
  constant: '常量',
  blackboard: '动作黑板',
  blackboardKey: '黑板键',
  constantValue: '常量值',
};
const sourceLabels: Readonly<Record<BuffApplicationSource, string>> = {
  caster: '施法者',
  enemy: '固定敌人',
  eventSource: '事件来源',
  buffOwner: 'Buff 持有者',
  buffSource: 'Buff 来源',
  currentAbilityEntity: '当前能力实体动作 Owner',
};

function updateCreate(parameters: CreateStep['parameters']): void {
  if (props.step.kind !== 'createGlobalBuff') return;
  emit('update', { ...props.step, parameters });
}

function setId(event: Event): void {
  if (props.step.kind !== 'createGlobalBuff') return;
  updateCreate({
    ...props.step.parameters,
    globalBuffId: (event.target as HTMLInputElement).value,
  });
}

function setCount(value: ActionValueOperand | undefined): void {
  if (props.step.kind !== 'createGlobalBuff') return;
  const parameters = { ...props.step.parameters };
  if (value === undefined) delete parameters.count;
  else parameters.count = value;
  updateCreate(parameters);
}

function setSource(event: Event): void {
  if (props.step.kind !== 'createGlobalBuff') return;
  const value = (event.target as HTMLSelectElement).value;
  const parameters = { ...props.step.parameters };
  if (value === '') delete parameters.source;
  else parameters.source = value as BuffApplicationSource;
  updateCreate(parameters);
}

function setAssignments(value: Readonly<Record<string, ActionValueOperand>>): void {
  if (props.step.kind !== 'createGlobalBuff') return;
  const parameters = { ...props.step.parameters };
  if (Object.keys(value).length === 0) delete parameters.blackboardAssignments;
  else parameters.blackboardAssignments = value;
  updateCreate(parameters);
}
</script>

<template>
  <div v-if="step.kind === 'createGlobalBuff'" class="global-buff-step">
    <label>
      <span>GlobalBuff ID</span>
      <input type="text" :value="step.parameters.globalBuffId" @input="setId" />
    </label>
    <label>
      <span>施加来源</span>
      <select :value="step.parameters.source ?? ''" @change="setSource">
        <option value="">当前上下文默认来源</option>
        <option v-for="source in BUFF_APPLICATION_SOURCES" :key="source" :value="source">
          {{ sourceLabels[source] }}
        </option>
      </select>
    </label>
    <label class="global-buff-step__toggle">
      <input
        type="checkbox"
        :checked="step.parameters.count !== undefined"
        @change="
          setCount(
            ($event.target as HTMLInputElement).checked
              ? { kind: 'constant', value: 1 }
              : undefined,
          )
        "
      />
      指定创建层数
    </label>
    <ActionValueOperandEditor
      v-if="step.parameters.count"
      :value="step.parameters.count"
      :labels="operandLabels"
      @update="setCount"
    />
    <label class="global-buff-step__toggle">
      <input
        type="checkbox"
        :checked="step.parameters.finishByAction === true"
        @change="
          updateCreate({
            ...step.parameters,
            finishByAction: ($event.target as HTMLInputElement).checked,
          })
        "
      />
      随当前动作结束
    </label>
    <ActionValueAssignmentMapEditor
      :assignments="step.parameters.blackboardAssignments ?? {}"
      title="创建实例时写入父黑板"
      @update="setAssignments"
    />
    <p class="global-buff-step__hint">父定义与子 Buff 在左侧导图中分层编辑。</p>
  </div>
  <label v-else class="global-buff-step__reason">
    <span>结束原因</span>
    <select
      :value="step.parameters.reason"
      @change="
        emit('update', {
          ...step,
          parameters: { reason: ($event.target as HTMLSelectElement).value as 'early' | 'other' },
        })
      "
    >
      <option value="early">提前结束</option>
      <option value="other">其他</option>
    </select>
  </label>
</template>

<style scoped>
.global-buff-step {
  display: grid;
  gap: 12px;
}
.global-buff-step > label,
.global-buff-step__reason {
  display: grid;
  grid-template-columns: minmax(120px, 160px) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.global-buff-step input[type='text'],
.global-buff-step select,
.global-buff-step__reason select {
  min-width: 0;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
.global-buff-step .global-buff-step__toggle {
  display: flex;
}
.global-buff-step__hint {
  margin: 0;
  color: var(--ea-fg-muted);
}
</style>
