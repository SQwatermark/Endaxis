<script setup lang="ts">
import type { CombatStepDefinition } from '../../../core/game-data/operatorDefinition';
import ActionValueOperandEditor from './ActionValueOperandEditor.vue';
type Step = Extract<
  CombatStepDefinition,
  {
    kind:
      | 'readAbilityEntityRemainingDuration'
      | 'setAbilityEntityRemainingDuration'
      | 'finishCurrentAbilityEntity'
      | 'finishActionOwnerAbilityEntity'
      | 'finishCurrentAbilityEntityWhenSourceDies'
      | 'startCurrentAbilityEntityChildSkillById';
  }
>;
const props = defineProps<{ step: Step }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();
const labels = {
  constant: '常量',
  blackboard: '动作黑板',
  blackboardKey: '黑板键',
  constantValue: '常量值',
};
</script>

<template>
  <label v-if="step.kind === 'readAbilityEntityRemainingDuration'" class="entity-lifecycle"
    ><span>写入动作黑板键</span
    ><input
      type="text"
      :value="step.parameters.outputKey"
      @input="
        emit('update', {
          ...step,
          parameters: { outputKey: ($event.target as HTMLInputElement).value },
        })
      "
  /></label>
  <label v-else-if="step.kind === 'setAbilityEntityRemainingDuration'" class="entity-lifecycle"
    ><span>新的剩余秒数</span
    ><ActionValueOperandEditor
      :value="step.parameters.value"
      :labels="labels"
      @update="emit('update', { ...step, parameters: { value: $event } })"
  /></label>
  <label
    v-else-if="step.kind === 'startCurrentAbilityEntityChildSkillById'"
    class="entity-lifecycle"
    ><span>模板子技能 ID</span
    ><input
      type="text"
      :value="step.parameters.childSkillId"
      @input="
        emit('update', {
          ...step,
          parameters: { childSkillId: ($event.target as HTMLInputElement).value },
        })
      "
  /></label>
  <p v-else class="entity-lifecycle__hint">
    此步骤没有参数；目标身份由当前动作 Owner 或外层 forEach 的 currentTarget 严格决定。
  </p>
</template>

<style scoped>
.entity-lifecycle {
  display: grid;
  grid-template-columns: minmax(150px, 190px) minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.entity-lifecycle input {
  min-width: 0;
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
.entity-lifecycle__hint {
  margin: 0;
  color: var(--ea-fg-muted);
}
</style>
