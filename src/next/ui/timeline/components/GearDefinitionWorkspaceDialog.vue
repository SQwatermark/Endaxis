<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { GEAR_SLOT_TYPES, type GearDefinition } from '../../../core/game-data/equipmentDefinition';
import { validateGearDefinition } from '../../../core/game-data/equipmentDefinitionValidation';

const props = defineProps<{
  visible: boolean;
  baseDefinition: GearDefinition;
  customDefinition: GearDefinition;
  gearSetIds: readonly string[];
}>();
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  save: [definition: GearDefinition];
  reset: [];
}>();

const draft = ref<GearDefinition>(clone(props.customDefinition));
const selectedSection = ref<'base' | number>('base');
const issues = computed(() => validateGearDefinition(draft.value, '$.gear'));
const isDirty = computed(
  () => JSON.stringify(draft.value) !== JSON.stringify(props.customDefinition),
);
const selectedTraitIndex = computed(() =>
  typeof selectedSection.value === 'number' ? selectedSection.value : null,
);
const selectedTrait = computed(() =>
  selectedTraitIndex.value === null ? undefined : draft.value.traits[selectedTraitIndex.value],
);

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    draft.value = clone(props.customDefinition);
    selectedSection.value = 'base';
  },
  { immediate: true },
);

function clone<T>(value: T): T {
  return structuredClone(value);
}

function updateBase(
  field: 'displayName' | 'slotType' | 'levelRequirement' | 'baseDefense' | 'gearSetSlug',
  event: Event,
): void {
  const raw = (event.target as HTMLInputElement | HTMLSelectElement).value;
  const value =
    field === 'levelRequirement' || field === 'baseDefense'
      ? Number(raw)
      : field === 'gearSetSlug' && raw === ''
        ? undefined
        : raw;
  const next = { ...draft.value, [field]: value };
  if (field === 'gearSetSlug' && value === undefined) delete next.gearSetSlug;
  draft.value = next;
}

function updateTrait(field: 'key' | 'levelCount', event: Event): void {
  const index = selectedTraitIndex.value;
  const trait = selectedTrait.value;
  if (index === null || trait === undefined) return;
  const raw = (event.target as HTMLInputElement).value;
  const traits = [...draft.value.traits];
  traits[index] = { ...trait, [field]: field === 'levelCount' ? Number(raw) : raw };
  draft.value = { ...draft.value, traits };
}

function save(): void {
  if (issues.value.length > 0) return;
  emit('save', clone(draft.value));
  emit('update:visible', false);
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    width="min(900px, calc(100vw - 48px))"
    append-to-body
    destroy-on-close
    class="gear-definition-dialog"
    @update:model-value="emit('update:visible', $event)"
  >
    <template #header>
      <div class="workspace-title">
        <div>
          <strong>自定义装备</strong><span>{{ draft.displayName ?? draft.slug }}</span>
        </div>
        <small>完整项目模板；当前只编辑所选层，词条行为保持原定义。</small>
      </div>
    </template>

    <div class="gear-workspace">
      <aside class="gear-outliner">
        <button :class="{ active: selectedSection === 'base' }" @click="selectedSection = 'base'">
          <strong>基础定义</strong><small>{{ baseDefinition.slug }}</small>
        </button>
        <div class="outliner-caption">词条</div>
        <button
          v-for="(trait, index) in draft.traits"
          :key="`${trait.key}:${index}`"
          :class="{ active: selectedSection === index }"
          @click="selectedSection = index"
        >
          <strong>{{ trait.key }}</strong
          ><small>{{ trait.levelCount }} 档</small>
        </button>
      </aside>

      <main class="gear-inspector">
        <section v-if="selectedSection === 'base'" class="definition-card">
          <header><strong>装备模板</strong><span>物化定义</span></header>
          <div class="field-grid">
            <label>模板 ID<input :value="draft.slug" disabled /></label>
            <label
              >展示名称<input
                :value="draft.displayName ?? ''"
                @change="updateBase('displayName', $event)"
            /></label>
            <label
              >槽位<select :value="draft.slotType" @change="updateBase('slotType', $event)">
                <option v-for="slotType in GEAR_SLOT_TYPES" :key="slotType" :value="slotType">
                  {{ slotType }}
                </option>
              </select></label
            >
            <label
              >等级需求<input
                type="number"
                min="0"
                step="1"
                :value="draft.levelRequirement"
                @change="updateBase('levelRequirement', $event)"
            /></label>
            <label
              >基础防御<input
                type="number"
                min="0"
                step="1"
                :value="draft.baseDefense"
                @change="updateBase('baseDefense', $event)"
            /></label>
            <label
              >套装<select
                :value="draft.gearSetSlug ?? ''"
                @change="updateBase('gearSetSlug', $event)"
              >
                <option value="">无套装</option>
                <option v-for="id in gearSetIds" :key="id" :value="id">{{ id }}</option>
              </select></label
            >
          </div>
        </section>

        <section v-if="selectedTrait" class="definition-card">
          <header>
            <strong>当前词条</strong><span>第 {{ (selectedTraitIndex ?? 0) + 1 }} 条</span>
          </header>
          <div class="field-grid">
            <label
              >稳定 key<input :value="selectedTrait.key" @change="updateTrait('key', $event)"
            /></label>
            <label
              >档位数量<input
                type="number"
                min="1"
                step="1"
                :value="selectedTrait.levelCount"
                @change="updateTrait('levelCount', $event)"
            /></label>
          </div>
          <div class="contribution-summary">
            <span>属性修正 {{ selectedTrait.modifiers?.length ?? 0 }}</span>
            <span>事件响应 {{ selectedTrait.eventHandlers?.length ?? 0 }}</span>
            <p>行为节点将在装备组件图中编辑；这里不提供原始 JSON 入口。</p>
          </div>
        </section>
      </main>
    </div>

    <template #footer>
      <div class="workspace-footer">
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
          保存装备定义
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.workspace-title {
  display: grid;
  gap: 4px;
}
.workspace-title div {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.workspace-title strong {
  font-size: 19px;
}
.workspace-title span,
.workspace-title small {
  color: var(--ea-fg-muted);
}
.gear-workspace {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  min-height: 480px;
  height: min(620px, calc(100vh - 210px));
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
}
.gear-outliner {
  min-width: 0;
  padding: 12px;
  overflow: auto;
  border-right: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
.gear-outliner button {
  width: 100%;
  display: grid;
  gap: 3px;
  padding: 10px;
  border: 0;
  border-left: 3px solid transparent;
  background: transparent;
  color: var(--ea-fg-secondary);
  text-align: left;
  cursor: pointer;
}
.gear-outliner button.active {
  border-left-color: var(--ea-gold);
  background: var(--ea-active-fill);
  color: var(--ea-fg);
}
.gear-outliner small,
.outliner-caption {
  color: var(--ea-fg-muted);
  font-size: 10px;
  overflow-wrap: anywhere;
}
.outliner-caption {
  margin: 18px 10px 7px;
  font-weight: 700;
  text-transform: uppercase;
}
.gear-inspector {
  min-width: 0;
  padding: 18px;
  overflow: auto;
  container-type: inline-size;
}
.definition-card {
  min-width: 0;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
.definition-card header {
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}
.definition-card header span {
  color: var(--ea-fg-muted);
  font-size: 10px;
}
.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 16px;
  padding: 14px;
}
label {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(80px, 1fr) minmax(100px, 160px);
  align-items: center;
  gap: 10px;
  color: var(--ea-fg-muted);
  font-size: 11px;
}
input,
select {
  width: 100%;
  min-width: 0;
  height: 32px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
}
.contribution-summary {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px;
}
.contribution-summary > span {
  padding: 4px 7px;
  border: 1px solid var(--ea-border);
  color: var(--ea-fg-secondary);
}
.contribution-summary p {
  width: 100%;
  margin: 4px 0 0;
  color: var(--ea-fg-muted);
  line-height: 1.5;
}
.workspace-footer {
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
  max-width: 500px;
  padding: 4px;
  overflow-wrap: anywhere;
}
@container (max-width: 520px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
@container (max-width: 340px) {
  label {
    grid-template-columns: 1fr;
    gap: 5px;
  }
}
@media (max-width: 700px) {
  .gear-workspace {
    grid-template-columns: 1fr;
    height: auto;
  }
  .gear-outliner {
    max-height: 180px;
    border-right: 0;
    border-bottom: 1px solid var(--ea-border-soft);
  }
  .gear-inspector {
    max-height: 500px;
  }
}
</style>
