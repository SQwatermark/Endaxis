<script setup lang="ts">
import type {
  CombatEventHandlerDefinition,
  CombatEventTrigger,
} from '../../../core/game-data/operatorDefinition';
import CombatEventTriggerEditor from './CombatEventTriggerEditor.vue';

const props = defineProps<{ handler: CombatEventHandlerDefinition }>();
const emit = defineEmits<{ update: [handler: CombatEventHandlerDefinition] }>();

function setKey(event: Event): void {
  emit('update', { ...props.handler, key: (event.target as HTMLInputElement).value });
}

function setEvent(event: CombatEventTrigger): void {
  emit('update', { ...props.handler, event });
}
</script>

<template>
  <section class="handler-inspector">
    <header>
      <strong>技能事件响应</strong><span>{{ handler.event.kind }}</span>
    </header>
    <label><span>稳定 key</span><input :value="handler.key" @change="setKey" /></label>
    <CombatEventTriggerEditor :event="handler.event" @update="setEvent" />
    <p>可选条件与调度序列在画布中作为子节点编辑。</p>
  </section>
</template>

<style scoped>
.handler-inspector {
  min-width: 0;
  display: grid;
  gap: 12px;
}
header {
  display: flex;
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
