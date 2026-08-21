<script setup lang="ts">
/** Inspector for the evidence-locked physical infliction entry generated from FractureAction. */
import type { CombatStepDefinition } from '../../../core/game-data/operatorDefinition';

type PhysicalInflictionStep = Extract<CombatStepDefinition, { kind: 'applyPhysicalInfliction' }>;

const props = defineProps<{ step: PhysicalInflictionStep }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();

function setIsExtra(event: Event): void {
  emit('update', {
    ...props.step,
    parameters: {
      ...props.step.parameters,
      isExtra: (event.target as HTMLInputElement).checked,
    },
  });
}
</script>

<template>
  <div class="step-editor__grid physical-infliction-inspector">
    <label>
      <span>物理异常类型</span>
      <input :value="step.parameters.type" readonly />
    </label>
    <label>
      <span>目标</span>
      <input :value="step.parameters.target" readonly />
    </label>
    <label>
      <span>破防层 Buff</span>
      <input :value="step.parameters.noGuardBuffId" readonly />
    </label>
    <label>
      <span>碎甲 Buff</span>
      <input :value="step.parameters.fractureBuffId" readonly />
    </label>
    <label class="step-editor__check step-editor__check--field">
      <input type="checkbox" :checked="step.parameters.isExtra" @change="setIsExtra" />
      <span>额外物理异常</span>
    </label>
    <p class="physical-infliction-inspector__note">
      类型、目标和公共 Buff 身份来自原生 FractureAction 证据，不能在此改写。两份 Buff
      定义已经内联在当前步骤下，请在左侧导图展开对应端口查看完整结构。
    </p>
  </div>
</template>

<style scoped>
.physical-infliction-inspector__note {
  grid-column: 1 / -1;
  margin: 0;
  padding: 10px 12px;
  border-left: 2px solid var(--ea-gold);
  background: color-mix(in srgb, var(--ea-gold) 7%, transparent);
  color: var(--ea-fg-muted);
  line-height: 1.6;
}

input[readonly] {
  color: var(--ea-fg-muted);
  cursor: default;
}
</style>
