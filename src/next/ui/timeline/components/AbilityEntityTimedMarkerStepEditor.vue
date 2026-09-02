<script setup lang="ts">
import type {
  ActionStringOperand,
  ActionValueOperand,
  CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';

type MarkerStep = Extract<CombatStepDefinition, { kind: 'createAbilityEntityTimedMarker' }>;
const props = defineProps<{ step: MarkerStep }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();

const labels = {
  constant: '常量',
  blackboard: '动作黑板',
  blackboardKey: '黑板键',
  constantValue: '常量值',
};

function markerKind(): 'constant' | 'blackboard' {
  return typeof props.step.parameters.markerId === 'string' ? 'constant' : 'blackboard';
}

function setMarkerKind(event: Event): void {
  const kind = (event.target as HTMLSelectElement).value;
  const markerId: ActionStringOperand =
    kind === 'blackboard' ? { blackboardKey: '' } : 'custom-ability-marker';
  emit('update', { ...props.step, parameters: { ...props.step.parameters, markerId } });
}

function setMarkerValue(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  const markerId: ActionStringOperand =
    typeof props.step.parameters.markerId === 'string' ? value : { blackboardKey: value };
  emit('update', { ...props.step, parameters: { ...props.step.parameters, markerId } });
}

function setDuration(durationSeconds: ActionValueOperand): void {
  emit('update', { ...props.step, parameters: { ...props.step.parameters, durationSeconds } });
}

function setTimeDomain(event: Event): void {
  const timeDomain = (event.target as HTMLSelectElement).value as 'global' | 'self';
  emit('update', { ...props.step, parameters: { ...props.step.parameters, timeDomain } });
}

function setAutoFinish(event: Event): void {
  emit('update', {
    ...props.step,
    parameters: {
      ...props.step.parameters,
      autoFinishByAction: (event.target as HTMLInputElement).checked,
    },
  });
}
</script>

<template>
  <div class="step-editor__grid">
    <label>
      <span>标记身份来源</span>
      <select :value="markerKind()" @change="setMarkerKind">
        <option value="constant">固定文本</option>
        <option value="blackboard">动作黑板</option>
      </select>
    </label>
    <label>
      <span>{{ markerKind() === 'constant' ? '标记身份' : '标记身份黑板键' }}</span>
      <input
        :value="
          typeof step.parameters.markerId === 'string'
            ? step.parameters.markerId
            : step.parameters.markerId.blackboardKey
        "
        @input="setMarkerValue"
      />
    </label>
    <label>
      <span>计时时钟</span>
      <select :value="step.parameters.timeDomain" @change="setTimeDomain">
        <option value="self">能力实体自身时钟</option>
        <option value="global">共享战斗时钟</option>
      </select>
    </label>
    <label class="step-editor__check step-editor__check--field">
      <input
        type="checkbox"
        :checked="step.parameters.autoFinishByAction"
        @change="setAutoFinish"
      />
      <span>动作结束时自动移除</span>
    </label>
    <label class="step-editor__operand">
      <span>持续秒数</span>
      <ActionValueOperandEditor
        :value="step.parameters.durationSeconds"
        :labels="labels"
        @update="setDuration"
      />
    </label>
    <p class="ability-marker-editor__note">
      该标记附着于当前能力实体；self 会随实体自身时间膨胀推进，global 使用共享战斗时钟。
    </p>
  </div>
</template>

<style scoped>
.ability-marker-editor__note {
  grid-column: 1 / -1;
  margin: 0;
  padding: 10px 12px;
  border-left: 2px solid var(--ea-gold);
  background: color-mix(in srgb, var(--ea-gold) 7%, transparent);
  color: var(--ea-fg-muted);
  line-height: 1.6;
}
</style>
