<script setup lang="ts">
/**
 * Next 时间轴的只读干员目录选择器。它只返回稳定 slug，不创建或修改项目 Build。
 * 搜索名称在渲染层按当前语言解析，避免把翻译文本写进项目文档。
 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getOperatorGameName } from '@/data/gameText';
import type { OperatorDefinition } from '../../../core/game-data/operatorDefinition';

const props = defineProps<{
  visible: boolean;
  operators: readonly OperatorDefinition[];
  selectedSlug: string | null;
}>();

const emit = defineEmits<{
  close: [];
  select: [slug: string];
  clear: [];
}>();

const { t, locale } = useI18n({ useScope: 'global' });
const query = ref('');

watch(
  () => props.visible,
  visible => {
    if (visible) query.value = '';
  },
);

function normalize(value: string): string {
  return value.toLocaleLowerCase().replace(/[\s_-]+/g, '');
}

const filteredOperators = computed(() => {
  const needle = normalize(query.value);
  if (needle.length === 0) return props.operators;
  return props.operators.filter(operator =>
    [operator.slug, operator.gameId, getOperatorGameName(operator.slug, locale.value)]
      .map(normalize)
      .some(value => value.includes(needle)),
  );
});
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-backdrop" @mousedown.self="emit('close')">
      <section class="operator-dialog" role="dialog" aria-modal="true">
        <header>
          <strong>{{ t('timelineGrid.operatorDialog.title') }}</strong>
          <button type="button" :title="t('common.close')" @click="emit('close')">×</button>
        </header>
        <div class="dialog-tools">
          <input
            v-model="query"
            :placeholder="t('timelineGrid.operatorDialog.searchPlaceholder')"
          />
          <button type="button" class="clear-button" @click="emit('clear')">
            {{ t('common.unequip') }}
          </button>
        </div>
        <div class="operator-grid">
          <button
            v-for="operator in filteredOperators"
            :key="operator.slug"
            type="button"
            class="operator-card"
            :class="{ selected: operator.slug === selectedSlug }"
            @click="emit('select', operator.slug)"
          >
            <img :src="`/operators/${operator.slug}/avatar.webp`" alt="" />
            <span>{{ getOperatorGameName(operator.slug, locale) }}</span>
          </button>
          <p v-if="filteredOperators.length === 0" class="empty-result">
            {{ t('timelineGrid.operatorDialog.empty') }}
          </p>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--ea-bg) 70%, transparent);
}

.operator-dialog {
  width: min(600px, calc(100vw - 32px));
  max-height: min(680px, calc(100vh - 32px));
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ea-border-strong);
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
  box-shadow: 0 18px 52px var(--ea-shadow-strong);
}

header,
.dialog-tools {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--ea-border);
}

header {
  justify-content: space-between;
}

button,
input {
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-soft);
  color: inherit;
  font: inherit;
}

button {
  cursor: pointer;
}

header button {
  width: 30px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 20px;
}

input {
  width: 220px;
  padding: 0 9px;
  outline: none;
}

input:focus,
button:hover {
  border-color: var(--ea-gold);
}

.clear-button {
  padding: 0 12px;
  color: var(--el-color-danger);
}

.operator-grid {
  min-height: 180px;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  align-content: start;
  gap: 10px;
  padding: 14px;
}

.operator-card {
  height: 112px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
}

.operator-card.selected {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}

.operator-card img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.operator-card span {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.empty-result {
  grid-column: 1 / -1;
  color: var(--ea-fg-muted);
  text-align: center;
}
</style>
