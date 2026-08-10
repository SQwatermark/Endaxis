<script setup lang="ts">
/**
 * 编辑存档中由用户维护的全局技力基线。组件只收发数值，不持有项目副本，也不推导尚未接入的
 * 原生运行时规则；撤销、校验和持久化均由外层命令与会话负责。
 */
import type { BattleDocument } from '../../../core/project/schema';
import type { EditableBattleResourceRule } from '../timelineDocumentCommands';

defineProps<{
  rules: BattleDocument['resourceRules'];
  labels: {
    title: string;
    maximum: string;
    initial: string;
    recovery: string;
  };
}>();

const emit = defineEmits<{
  update: [field: EditableBattleResourceRule, value: number];
}>();

function emitNumber(field: EditableBattleResourceRule, event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);
  if (Number.isFinite(value)) emit('update', field, value);
}
</script>

<template>
  <section class="global-resource-panel">
    <header>{{ labels.title }}</header>
    <div class="resource-fields">
      <label>
        <span>{{ labels.maximum }}</span>
        <input
          type="number"
          min="0"
          step="1"
          :value="rules.maxSp"
          @change="emitNumber('maxSp', $event)"
          @blur="emitNumber('maxSp', $event)"
        />
      </label>
      <label>
        <span>{{ labels.initial }}</span>
        <input
          type="number"
          min="0"
          :max="rules.maxSp"
          step="1"
          :value="rules.initialSp"
          @change="emitNumber('initialSp', $event)"
          @blur="emitNumber('initialSp', $event)"
        />
      </label>
      <label>
        <span>{{ labels.recovery }}</span>
        <input
          type="number"
          min="0"
          step="0.1"
          :value="rules.spRecoveryPerSecond"
          @change="emitNumber('spRecoveryPerSecond', $event)"
          @blur="emitNumber('spRecoveryPerSecond', $event)"
        />
      </label>
    </div>
  </section>
</template>

<style scoped>
.global-resource-panel {
  height: 100%;
  padding: 14px 18px;
  box-sizing: border-box;
  color: var(--ea-text-primary, rgb(255 255 255 / 88%));
  background: var(--ea-surface, #17191c);
}

header {
  padding-bottom: 9px;
  border-bottom: 1px solid var(--ea-border, rgb(255 255 255 / 10%));
  font-size: 13px;
  font-weight: 700;
}

.resource-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 180px));
  gap: 12px;
  padding-top: 14px;
}

label {
  display: grid;
  gap: 6px;
  color: var(--ea-text-secondary, rgb(255 255 255 / 62%));
  font-size: 11px;
}

input {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border, rgb(255 255 255 / 14%));
  border-radius: 2px;
  color: var(--ea-text-primary, rgb(255 255 255 / 88%));
  background: var(--ea-input-background, #222428);
  font:
    12px/1 Consolas,
    monospace;
}

input:focus {
  border-color: var(--ea-accent, #f0d400);
  outline: none;
}
</style>
