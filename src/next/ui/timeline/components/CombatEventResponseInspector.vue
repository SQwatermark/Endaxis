<script setup lang="ts">
import type {
  CombatEventResponseDefinition,
  CombatEventTrigger,
} from '../../../core/game-data/operatorDefinition';
import CombatEventTriggerEditor from './CombatEventTriggerEditor.vue';

const props = defineProps<{ response: CombatEventResponseDefinition }>();
const emit = defineEmits<{ update: [response: CombatEventResponseDefinition] }>();

function setKey(event: Event): void {
  emit('update', { ...props.response, key: (event.target as HTMLInputElement).value });
}

function setEvent(event: CombatEventTrigger): void {
  emit('update', { ...props.response, event });
}
</script>

<template>
  <section class="response-inspector">
    <header>
      <strong>事件响应</strong><span>{{ response.event.kind }}</span>
    </header>
    <label>
      <span>稳定 key</span>
      <input :value="response.key" @change="setKey" />
    </label>
    <CombatEventTriggerEditor :event="response.event" @update="setEvent" />
    <p>可选条件与响应序列在画布中作为子节点编辑。</p>
  </section>
</template>

<style scoped>
.response-inspector {
  min-width: 0;
  display: grid;
  gap: 12px;
}
header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}
header span,
label span,
p {
  color: var(--ea-fg-muted);
  font-size: 11px;
}
label {
  display: grid;
  gap: 6px;
}
input {
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
p {
  margin: 0;
}
</style>
