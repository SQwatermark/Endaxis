<script setup lang="ts">
import InputRegionBoundary from '../../keyboard/InputRegionBoundary.vue';
import { editorDefinitionsEqual } from '../../editorDefinitionsEqual';
import { replaceEquipmentContribution } from '../replaceEquipmentContribution';
import { computed, ref, watch } from 'vue';
import { cloneEditorDefinition } from '../../cloneEditorDefinition';
import type {
  EquipmentContributionDefinition,
  GearSetDefinition,
} from '../../../core/game-data/equipmentDefinition';
import { validateGearSetDefinition } from '../../../core/game-data/equipmentDefinitionValidation';
import EquipmentContributionGraphEditor from './EquipmentContributionGraphEditor.vue';

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
const draft = ref<GearSetDefinition>(cloneEditorDefinition(props.customDefinition));
const issues = computed(() => validateGearSetDefinition(draft.value, '$.gearSet'));
const isDirty = computed(() => !editorDefinitionsEqual(draft.value, props.customDefinition));

watch(
  () => props.visible,
  visible => {
    if (visible) draft.value = cloneEditorDefinition(props.customDefinition);
  },
  { immediate: true },
);

function updateDisplayName(event: Event): void {
  draft.value = { ...draft.value, displayName: (event.target as HTMLInputElement).value };
}

function updateContribution(contribution: EquipmentContributionDefinition): void {
  draft.value = replaceEquipmentContribution(draft.value, contribution);
}

function save(): void {
  if (issues.value.length > 0) return;
  emit('save', cloneEditorDefinition(draft.value));
  emit('update:visible', false);
}
</script>

<template>
  <InputRegionBoundary label="gear-set-definition-workspace" :active="visible" modal>
    <el-dialog
      :model-value="visible"
      width="min(1280px, calc(100vw - 48px))"
      top="24px"
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
        <section class="set-identity">
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
        <section class="set-contribution">
          <header>
            <strong>三件套贡献</strong><span>保存后影响项目内所有引用此套装的实例</span>
          </header>
          <EquipmentContributionGraphEditor
            :key="draft.slug"
            fill-available
            :contribution="draft"
            :label="draft.displayName ?? draft.slug"
            :level="1"
            @update="updateContribution"
          />
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
          <button
            class="ea-btn ea-btn--sm ea-btn--glass-rect"
            @click="emit('update:visible', false)"
          >
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
  </InputRegionBoundary>
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
  grid-template-rows: auto minmax(0, 1fr);
  gap: 10px;
  height: 100%;
  min-height: 0;
}
.set-contribution {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  min-height: 0;
  min-width: 0;
}
section {
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
section header {
  min-height: 32px;
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
  padding: 8px 12px;
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
  max-height: 90px;
  overflow: auto;
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

<style>
/* Dialog owns viewport space; content must not push its save/cancel footer off screen. */
.gear-set-definition-dialog {
  height: calc(100dvh - 48px);
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.gear-set-definition-dialog > .el-dialog__header,
.gear-set-definition-dialog > .el-dialog__footer {
  flex: none;
}
.gear-set-definition-dialog > .el-dialog__body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
