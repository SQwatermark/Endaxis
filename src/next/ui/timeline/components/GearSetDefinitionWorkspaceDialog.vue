<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { GearSetDefinition } from '../../../core/game-data/equipmentDefinition';
import { validateGearSetDefinition } from '../../../core/game-data/equipmentDefinitionValidation';

const props = defineProps<{
  visible: boolean;
  baseDefinition: GearSetDefinition;
  customDefinition: GearSetDefinition;
}>();
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  save: [definition: GearSetDefinition];
  reset: [];
}>();
const draft = ref<GearSetDefinition>(structuredClone(props.customDefinition));
const issues = computed(() => validateGearSetDefinition(draft.value, '$.gearSet'));
const isDirty = computed(
  () => JSON.stringify(draft.value) !== JSON.stringify(props.customDefinition),
);

watch(
  () => props.visible,
  visible => {
    if (visible) draft.value = structuredClone(props.customDefinition);
  },
  { immediate: true },
);

function updateDisplayName(event: Event): void {
  draft.value = { ...draft.value, displayName: (event.target as HTMLInputElement).value };
}

function save(): void {
  if (issues.value.length > 0) return;
  emit('save', structuredClone(draft.value));
  emit('update:visible', false);
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    width="min(720px, calc(100vw - 48px))"
    append-to-body
    destroy-on-close
    class="gear-set-definition-dialog"
    @update:model-value="emit('update:visible', $event)"
  >
    <template #header>
      <div class="title">
        <strong>自定义套装</strong><span>{{ draft.displayName ?? draft.slug }}</span>
      </div>
    </template>
    <div class="set-inspector">
      <section>
        <header>
          <strong>套装模板</strong><span>来源 {{ baseDefinition.slug }}</span>
        </header>
        <div class="fields">
          <label>模板 ID<input :value="draft.slug" disabled /></label>
          <label
            >展示名称<input :value="draft.displayName ?? ''" @change="updateDisplayName"
          /></label>
        </div>
      </section>
      <section>
        <header><strong>三件套贡献</strong><span>行为保持完整</span></header>
        <div class="summary">
          <span>属性修正 {{ draft.modifiers?.length ?? 0 }}</span>
          <span>事件响应 {{ draft.eventHandlers?.length ?? 0 }}</span>
          <p>套装贡献稍后进入统一装备组件图；当前不会把事件序列展开为 JSON。</p>
        </div>
      </section>
    </div>
    <template #footer>
      <div class="footer">
        <details v-if="issues.length" class="issues">
          <summary>{{ issues.length }} 个结构问题</summary>
          <code v-for="issue in issues" :key="`${issue.path}:${issue.message}`"
            >{{ issue.path }} · {{ issue.message }}</code
          >
        </details>
        <span v-else class="valid">✓ 定义结构有效</span>
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('reset')">
          恢复游戏定义
        </button>
        <span class="spacer" />
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('update:visible', false)">
          取消
        </button>
        <button
          class="ea-btn ea-btn--sm ea-btn--glass-rect ea-btn--hover-gold-fill"
          :disabled="!isDirty || issues.length > 0"
          @click="save"
        >
          保存套装定义
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.title strong {
  font-size: 19px;
}
.title span {
  color: var(--ea-fg-muted);
}
.set-inspector {
  display: grid;
  gap: 14px;
}
section {
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
section header {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}
section header span {
  color: var(--ea-fg-muted);
  font-size: 10px;
}
.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  padding: 14px;
}
label {
  min-width: 0;
  display: grid;
  gap: 6px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}
input {
  width: 100%;
  min-width: 0;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
.summary {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px;
}
.summary > span {
  padding: 4px 7px;
  border: 1px solid var(--ea-border);
  color: var(--ea-fg-secondary);
}
.summary p {
  width: 100%;
  margin: 4px 0 0;
  color: var(--ea-fg-muted);
}
.footer {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.spacer {
  flex: 1;
}
.valid {
  color: #80bf93;
}
.issues {
  color: #e69a7a;
}
.issues code {
  display: block;
  max-width: 430px;
  padding: 4px;
  overflow-wrap: anywhere;
}
@media (max-width: 560px) {
  .fields {
    grid-template-columns: 1fr;
  }
}
</style>
