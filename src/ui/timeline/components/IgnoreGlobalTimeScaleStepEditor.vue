<script setup lang="ts">
import type {
  AbilityEntityTargetQuery,
  CombatStepDefinition,
} from '../../../core/game-data/operatorDefinition';
import AbilityEntityTargetQueryEditor from './AbilityEntityTargetQueryEditor.vue';

type IgnoreStep = Extract<CombatStepDefinition, { kind: 'setIgnoreGlobalTimeScale' }>;
const props = defineProps<{ step: IgnoreStep }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();

function setTargets(abilityEntityTargets: readonly AbilityEntityTargetQuery[]): void {
  emit('update', { ...props.step, parameters: { ...props.step.parameters, abilityEntityTargets } });
}

function setBoolean(field: 'ignore' | 'revertOnEnd', event: Event): void {
  emit('update', {
    ...props.step,
    parameters: {
      ...props.step.parameters,
      [field]: (event.target as HTMLInputElement).checked,
    },
  });
}
</script>

<template>
  <div class="ignore-time-scale-editor">
    <div class="step-editor__grid">
      <label class="step-editor__check step-editor__check--field">
        <input
          type="checkbox"
          :checked="step.parameters.ignore"
          @change="setBoolean('ignore', $event)"
        />
        <span>忽略全局时间倍率</span>
      </label>
      <label class="step-editor__check step-editor__check--field">
        <input
          type="checkbox"
          :checked="step.parameters.revertOnEnd"
          @change="setBoolean('revertOnEnd', $event)"
        />
        <span>动作区间结束时还原</span>
      </label>
    </div>
    <AbilityEntityTargetQueryEditor
      :queries="step.parameters.abilityEntityTargets"
      @update="setTargets"
    />
    <p>该步骤只改变匹配能力实体的时钟来源，不改变全局倍率本身；查询为空时不会猜测全部实体。</p>
  </div>
</template>

<style scoped>
.ignore-time-scale-editor {
  display: grid;
  gap: 10px;
  padding-bottom: 14px;
}
.ignore-time-scale-editor :deep(.ability-entity-query-editor) {
  margin: 0 14px;
}
.ignore-time-scale-editor > p {
  margin: 0 14px;
  padding: 10px 12px;
  border-left: 2px solid var(--ea-gold);
  background: color-mix(in srgb, var(--ea-gold) 7%, transparent);
  color: var(--ea-fg-muted);
  line-height: 1.6;
}
</style>
