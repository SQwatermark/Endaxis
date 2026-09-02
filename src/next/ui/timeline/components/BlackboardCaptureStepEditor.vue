<script setup lang="ts">
import type { CombatStepDefinition } from '../../../core/game-data/operatorDefinition';

type CaptureStep = Extract<
  CombatStepDefinition,
  { kind: 'storeCurrentTimelineFrame' | 'storeEventSpGainAmount' }
>;

const props = defineProps<{ step: CaptureStep }>();
const emit = defineEmits<{ update: [step: CombatStepDefinition] }>();

function setTimelineKey(event: Event): void {
  if (props.step.kind !== 'storeCurrentTimelineFrame') return;
  emit('update', {
    ...props.step,
    parameters: { outputKey: (event.target as HTMLInputElement).value },
  });
}

function setSpKey(field: 'outputKey' | 'realDeltaOutputKey', event: Event): void {
  if (props.step.kind !== 'storeEventSpGainAmount') return;
  const value = (event.target as HTMLInputElement).value.trim();
  const parameters = { ...props.step.parameters };
  if (value === '') delete parameters[field];
  else parameters[field] = value;
  emit('update', { ...props.step, parameters });
}
</script>

<template>
  <div class="step-editor__grid">
    <template v-if="step.kind === 'storeCurrentTimelineFrame'">
      <label>
        <span>写入动作黑板键</span>
        <input :value="step.parameters.outputKey" @input="setTimelineKey" />
      </label>
      <p class="blackboard-capture-editor__note">
        保存 Owner AbilitySystem 当前技能的局部整数执行帧，不是现实时间轴帧。
      </p>
    </template>
    <template v-else>
      <label>
        <span>效率结算后 Value 写入键</span>
        <input :value="step.parameters.outputKey ?? ''" @input="setSpKey('outputKey', $event)" />
      </label>
      <label>
        <span>共享技力实际变化 RealDelta 写入键</span>
        <input
          :value="step.parameters.realDeltaOutputKey ?? ''"
          @input="setSpKey('realDeltaOutputKey', $event)"
        />
      </label>
      <p class="blackboard-capture-editor__note">
        两个键至少保留一个；Value 位于效率结算后、共享技力上限截断前，RealDelta 是最终实际变化量。
      </p>
    </template>
  </div>
</template>

<style scoped>
.blackboard-capture-editor__note {
  grid-column: 1 / -1;
  margin: 0;
  padding: 10px 12px;
  border-left: 2px solid var(--ea-gold);
  background: color-mix(in srgb, var(--ea-gold) 7%, transparent);
  color: var(--ea-fg-muted);
  line-height: 1.6;
}
</style>
