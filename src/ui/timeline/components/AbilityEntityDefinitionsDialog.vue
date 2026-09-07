<script setup lang="ts">
import { computed, markRaw, provide, ref, watch } from 'vue';
import { useEditorHistoryShortcuts } from '../../keyboard/useEditorHistoryShortcuts';
import { useI18n } from 'vue-i18n';
import type {
  AbilityEntityDefinition,
  CombatStepDefinition,
  OperatorAbilityEntityDefinitions,
  OperatorDefinition,
} from '../../../core/game-data/operatorDefinition';
import { validateAbilityEntityDefinition } from '../../../core/game-data/validateSkillDefinition';
import { ABILITY_ENTITY_IDS_KEY } from '../abilityEntityEditorContext';
import {
  collectOperatorDefinitionReferences,
  referencesToDefinition,
  type OperatorDefinitionReference,
} from '../operatorDefinitionReferences';
import AbilityEntityDefinitionGraphEditor from './AbilityEntityDefinitionGraphEditor.vue';
import {
  useDefinitionDraftHistory,
  type DefinitionDraftHistory,
} from '../useDefinitionDraftHistory';

type SpawnAbilityEntityStep = Extract<
  CombatStepDefinition,
  { readonly kind: 'spawnAbilityEntity' }
>;

const props = defineProps<{
  visible: boolean;
  baseDefinitions: OperatorAbilityEntityDefinitions;
  customDefinitions?: OperatorAbilityEntityDefinitions;
  commonDefinitions?: OperatorAbilityEntityDefinitions;
  skillLevel: number;
  initialSelectedId?: string;
  operatorDefinition?: OperatorDefinition;
  sharedHistory?: DefinitionDraftHistory<OperatorAbilityEntityDefinitions>;
  paged?: boolean;
}>();
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  save: [definitions: OperatorAbilityEntityDefinitions];
  'reveal-reference': [reference: OperatorDefinitionReference];
  'detail-change': [open: boolean];
}>();
const { t } = useI18n({ useScope: 'global' });

const localDraft = ref<Record<string, AbilityEntityDefinition>>({});
// 嵌入根工作区时直接读取根草稿；独立入口才拥有本地草稿和保存操作。
const draft = computed({
  get: () => (props.sharedHistory ? (props.customDefinitions ?? {}) : localDraft.value),
  set: value => {
    if (!props.sharedHistory) localDraft.value = value;
  },
});
const editorRoot = ref<HTMLElement | null>(null);
const selectedId = ref('');
const detailOpen = ref(false);
watch(detailOpen, open => emit('detail-change', open));
function openDefinition(id: string): void {
  selectedId.value = id;
  detailOpen.value = mergedDefinitions.value[id] !== undefined;
}
const newId = ref('');
const filterText = ref('');
const mergedDefinitions = computed<Record<string, AbilityEntityDefinition>>(() => ({
  ...props.baseDefinitions,
  ...draft.value,
}));
const operatorIds = computed(() => Object.keys(mergedDefinitions.value).sort());
const commonIds = computed(() => Object.keys(props.commonDefinitions ?? {}).sort());
const allIds = computed(() => [...new Set([...operatorIds.value, ...commonIds.value])].sort());
const normalizedFilter = computed(() => filterText.value.trim().toLocaleLowerCase());
const filteredOperatorIds = computed(() =>
  operatorIds.value.filter(id => id.toLocaleLowerCase().includes(normalizedFilter.value)),
);
const filteredCommonIds = computed(() =>
  commonIds.value.filter(id => id.toLocaleLowerCase().includes(normalizedFilter.value)),
);
const canAdd = computed(() => {
  const id = newId.value.trim();
  return id.length > 0 && !allIds.value.includes(id);
});
provide(ABILITY_ENTITY_IDS_KEY, allIds);
const history = markRaw(
  props.sharedHistory ??
    useDefinitionDraftHistory(
      () => draft.value,
      value => {
        draft.value = value;
      },
    ),
);
const selectedDefinitionHistory = markRaw<DefinitionDraftHistory<AbilityEntityDefinition>>({
  commit(value, location) {
    if (selectedId.value === '') return;
    history.commit(
      { ...draft.value, [selectedId.value]: cloneProjectJson(value) },
      { ...location, path: location?.path ?? '', objectId: selectedId.value },
    );
  },
  restore: history.restore,
  canUndo: history.canUndo,
  canRedo: history.canRedo,
  restoredLocation: history.restoredLocation,
});
watch(
  () => history.restoredLocation?.value,
  location => {
    if (props.sharedHistory && location?.section !== 'entities') return;
    if (location?.objectId && mergedDefinitions.value[location.objectId]) {
      selectedId.value = location.objectId;
      filterText.value = '';
      detailOpen.value = true;
    } else if (props.paged) {
      detailOpen.value = false;
    }
  },
  // 根草稿通过 props 下传，恢复选择必须等待本次根数据更新完成。
  { flush: 'post' },
);
useEditorHistoryShortcuts(editorRoot, history.restore);

const selectedDefinition = computed(() => mergedDefinitions.value[selectedId.value]);
const selectedIsOverride = computed(() => draft.value[selectedId.value] !== undefined);
const selectedIsBase = computed(() => props.baseDefinitions[selectedId.value] !== undefined);
const editingStep = computed<SpawnAbilityEntityStep | null>(() => {
  const definition = selectedDefinition.value;
  if (definition === undefined) return null;
  return {
    kind: 'spawnAbilityEntity',
    parameters: {
      abilityEntityId: selectedId.value,
      definition,
      dieWhenSourceDies: false,
    },
  };
});
const validationIssues = computed(() =>
  Object.entries(draft.value).flatMap(([id, definition]) =>
    validateAbilityEntityDefinition(definition, `abilityEntityDefinitions['${id}']`),
  ),
);
const definitionReferences = computed(() =>
  props.operatorDefinition === undefined
    ? []
    : collectOperatorDefinitionReferences({
        ...props.operatorDefinition,
        abilityEntityDefinitions: mergedDefinitions.value,
      }),
);
const selectedReferences = computed(() =>
  referencesToDefinition(definitionReferences.value, 'entity', selectedId.value),
);

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    if (!props.sharedHistory) draft.value = cloneProjectJson(props.customDefinitions ?? {});
    const ids = Object.keys({ ...props.baseDefinitions, ...draft.value }).sort();
    selectedId.value =
      props.initialSelectedId !== undefined && ids.includes(props.initialSelectedId)
        ? props.initialSelectedId
        : (ids[0] ?? '');
    newId.value = nextCustomId(ids);
    filterText.value = '';
    detailOpen.value = Boolean(props.initialSelectedId && ids.includes(props.initialSelectedId));
  },
  { immediate: true },
);

watch(
  () => props.initialSelectedId,
  id => {
    if (id && mergedDefinitions.value[id]) {
      selectedId.value = id;
      filterText.value = '';
      detailOpen.value = true;
    } else if (props.paged) {
      detailOpen.value = false;
    }
  },
);

function nextCustomId(existing = allIds.value): string {
  const used = new Set(existing);
  for (let suffix = 1; ; suffix += 1) {
    const candidate = `custom-ability-entity-${suffix}`;
    if (!used.has(candidate)) return candidate;
  }
}

/**
 * Ability-entity definitions cross the Vue editor/project-data boundary here.
 * JSON serialization deliberately unwraps nested reactive proxies, which
 * structuredClone cannot clone.
 */
function cloneProjectJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function updateDefinition(step: CombatStepDefinition): void {
  if (step.kind !== 'spawnAbilityEntity' || step.parameters.definition === undefined) return;
  selectedDefinitionHistory.commit(step.parameters.definition);
}

function addDefinition(): void {
  const id = newId.value.trim();
  if (id.length === 0 || allIds.value.includes(id)) return;
  history.commit(
    {
      ...draft.value,
      [id]: { lifetime: { kind: 'limited', durationSeconds: 10 } },
    },
    { path: '', objectId: id },
  );
  selectedId.value = id;
  detailOpen.value = true;
  newId.value = nextCustomId([...allIds.value, id]);
}

function duplicateDefinition(): void {
  const definition = selectedDefinition.value;
  if (definition === undefined) return;
  const id = nextCustomId();
  history.commit(
    { ...draft.value, [id]: cloneProjectJson(definition) },
    { path: '', objectId: id },
  );
  selectedId.value = id;
  detailOpen.value = true;
  newId.value = nextCustomId([...allIds.value, id]);
}

function removeOrResetDefinition(): void {
  const id = selectedId.value;
  if (draft.value[id] === undefined) return;
  if (props.baseDefinitions[id] === undefined && selectedReferences.value.length > 0) return;
  const next = { ...draft.value };
  delete next[id];
  history.commit(next, { path: '', objectId: id });
  if (props.baseDefinitions[id] === undefined)
    selectedId.value = Object.keys({ ...props.baseDefinitions, ...next }).sort()[0] ?? '';
  if (props.baseDefinitions[id] === undefined) detailOpen.value = false;
}

function revealReference(reference: OperatorDefinitionReference): void {
  if (reference.ownerKind === 'entity') {
    selectedId.value = reference.ownerId;
    detailOpen.value = true;
    filterText.value = '';
    return;
  }
  emit('reveal-reference', reference);
}

function save(): void {
  if (validationIssues.value.length > 0) return;
  emit('save', cloneProjectJson(draft.value));
}
</script>

<template>
  <section v-if="visible" ref="editorRoot" class="ability-entity-definitions-editor">
    <header v-if="!sharedHistory" class="definition-focused-header entity-workspace__heading">
      <div>
        <strong>{{ t('timeline.skillEditing.abilityEntityObjects') }}</strong>
        <span>选择定义只切换当前画布，不会打开新的面板。</span>
      </div>
      <button
        type="button"
        class="definition-focused-back ea-btn ea-btn--sm"
        @click="emit('update:visible', false)"
      >
        ← 返回能力实体概览
      </button>
    </header>
    <div class="entity-workspace" :class="{ 'entity-workspace--paged': paged }">
      <aside v-if="!paged || !detailOpen" class="entity-workspace__sidebar">
        <div class="entity-workspace__create">
          <input v-model="newId" type="text" @keydown.enter.prevent="addDefinition" />
          <button
            type="button"
            class="ea-btn ea-btn--sm"
            :disabled="!canAdd"
            @click="addDefinition"
          >
            {{ t('timeline.skillEditing.addAbilityEntityObject') }}
          </button>
        </div>
        <input
          v-model="filterText"
          class="entity-workspace__search"
          type="search"
          :placeholder="t('timeline.skillEditing.abilityEntitySearchPlaceholder')"
        />
        <div class="entity-workspace__list">
          <div class="entity-workspace__group-heading">
            <span>{{ t('timeline.skillEditing.abilityEntityOperatorGroup') }}</span>
            <span>{{ filteredOperatorIds.length }}</span>
          </div>
          <button
            v-for="id in filteredOperatorIds"
            :key="id"
            type="button"
            class="entity-workspace__item"
            :class="{ active: id === selectedId }"
            :title="id"
            @click="openDefinition(id)"
          >
            <span class="entity-workspace__item-id">{{ id }}</span>
            <span v-if="draft[id]" class="entity-workspace__badge">
              {{
                baseDefinitions[id]
                  ? t('timeline.skillEditing.abilityEntityOverride')
                  : t('timeline.skillEditing.abilityEntityCustom')
              }}
            </span>
          </button>
          <div v-if="commonIds.length" class="entity-workspace__common">
            {{
              t('timeline.skillEditing.readonlyCommonAbilityEntity', {
                count: commonIds.length,
              })
            }}
            <div
              v-for="id in filteredCommonIds"
              :key="id"
              class="entity-workspace__common-id"
              :title="id"
            >
              {{ id }}
            </div>
          </div>
        </div>
      </aside>

      <main v-if="!paged || detailOpen" class="entity-workspace__editor">
        <template v-if="editingStep">
          <div class="entity-workspace__toolbar">
            <button
              v-if="paged"
              type="button"
              class="ea-btn ea-btn--sm"
              @click="detailOpen = false"
            >
              ← 返回能力实体列表
            </button>
            <strong>{{ selectedId }}</strong>
            <span v-if="selectedIsBase && !selectedIsOverride" class="entity-workspace__source">
              {{ t('timeline.skillEditing.abilityEntityGenerated') }}
            </span>
            <button type="button" class="ea-btn ea-btn--sm" @click="duplicateDefinition">
              {{ t('timeline.skillEditing.duplicateAbilityEntityObject') }}
            </button>
            <button
              v-if="selectedIsOverride"
              type="button"
              class="ea-btn ea-btn--sm"
              :disabled="!selectedIsBase && selectedReferences.length > 0"
              :title="
                !selectedIsBase && selectedReferences.length > 0
                  ? `仍有 ${selectedReferences.length} 处引用，不能删除`
                  : undefined
              "
              @click="removeOrResetDefinition"
            >
              {{
                selectedIsBase
                  ? t('timeline.skillEditing.resetAbilityEntityObject')
                  : t('timeline.skillEditing.deleteAbilityEntityObject')
              }}
            </button>
          </div>
          <div v-if="!selectedIsBase && selectedReferences.length" class="entity-reference-guard">
            <strong>仍有 {{ selectedReferences.length }} 处引用</strong>
            <span>先修改这些使用点，能力实体定义才可以删除。</span>
            <button
              v-for="reference in selectedReferences"
              :key="reference.path"
              type="button"
              @click="revealReference(reference)"
            >
              <b>{{ reference.ownerKind }} · {{ reference.ownerId }}</b>
              <code>{{ reference.path }}</code>
            </button>
          </div>
          <div class="entity-workspace__scroll">
            <AbilityEntityDefinitionGraphEditor
              fill-available
              :ability-entity-id="selectedId"
              :definition="selectedDefinition!"
              :skill-level="skillLevel"
              :shared-history="selectedDefinitionHistory"
              @update="
                updateDefinition({
                  kind: 'spawnAbilityEntity',
                  parameters: {
                    abilityEntityId: selectedId,
                    definition: $event,
                    dieWhenSourceDies: false,
                  },
                })
              "
            />
          </div>
        </template>
        <p v-else class="entity-workspace__empty">
          {{ t('timeline.skillEditing.noAbilityEntityObjects') }}
        </p>
      </main>
    </div>

    <div v-if="!sharedHistory" class="entity-workspace__footer">
      <span v-if="validationIssues.length" class="entity-workspace__error">
        {{ t('timeline.skillEditing.validationIssueCount', { count: validationIssues.length }) }}
      </span>
      <button
        type="button"
        class="ea-btn ea-btn--sm"
        :disabled="!history.canUndo.value"
        @click="history.restore('undo')"
      >
        撤销
      </button>
      <button
        type="button"
        class="ea-btn ea-btn--sm"
        :disabled="!history.canRedo.value"
        @click="history.restore('redo')"
      >
        重做
      </button>
      <span class="entity-workspace__footer-spacer" />
      <button type="button" class="ea-btn ea-btn--sm" @click="emit('update:visible', false)">
        {{ t('timeline.skillEditing.cancel') }}
      </button>
      <button type="button" class="ea-btn ea-btn--sm" @click="save">
        {{ t('timeline.skillEditing.saveAbilityEntityObjects') }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.ability-entity-definitions-editor {
  display: flex;
  min-height: 0;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 10px;
}
.entity-workspace__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.entity-workspace__heading div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}
.entity-workspace__heading span {
  color: var(--ea-fg-muted);
  font-size: 12px;
}
.entity-workspace {
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: var(--definition-outliner-width, clamp(180px, 15vw, 240px)) minmax(0, 1fr);
  gap: 0;
  overflow: hidden;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-workbench-panel);
}
.entity-workspace__sidebar {
  display: flex;
  min-width: 0;
  flex-direction: column;
  padding: 14px;
  overflow: hidden;
  border-right: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
.entity-workspace.entity-workspace--paged {
  grid-template-columns: minmax(0, 1fr);
}
.entity-workspace--paged .entity-workspace__sidebar {
  border-right: 0;
}
.entity-workspace--paged .entity-workspace__create {
  max-width: 560px;
}
.entity-workspace__create {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px;
  margin-bottom: 8px;
}
.entity-workspace__create input {
  min-width: 0;
}
.entity-workspace__search {
  width: 100%;
  height: 34px;
  box-sizing: border-box;
  margin-bottom: 12px;
  padding: 0 10px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
}
.entity-workspace__list {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  scrollbar-gutter: stable;
}
.entity-workspace__group-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 8px;
  color: var(--ea-fg-muted);
  font-size: 11px;
  text-transform: uppercase;
}
.entity-workspace__item {
  display: flex;
  width: 100%;
  min-height: 34px;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--ea-fg-secondary);
  text-align: left;
  cursor: pointer;
}
.entity-workspace__item-id {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.entity-workspace__item.active {
  border-color: var(--ea-gold);
  color: var(--ea-fg);
  background: var(--ea-fill-soft);
}
.entity-workspace__badge,
.entity-workspace__source {
  flex: none;
  color: var(--ea-gold);
  font-size: 11px;
}
.entity-workspace__common,
.entity-workspace__empty {
  color: var(--ea-fg-muted);
  font-size: 12px;
}
.entity-workspace__common {
  margin-top: 10px;
  padding: 10px 4px;
  border-top: 1px solid var(--ea-border-soft);
}
.entity-workspace__common-id {
  margin-top: 6px;
  overflow: hidden;
  color: var(--ea-fg-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.entity-workspace__editor {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
}
.entity-workspace__toolbar,
.entity-workspace__footer {
  display: flex;
  align-items: center;
  gap: 8px;
}
.entity-workspace__toolbar {
  min-height: 52px;
  flex: none;
  padding: 0 16px;
  border-bottom: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
.entity-workspace__toolbar strong {
  min-width: 0;
  margin-right: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.entity-workspace__scroll {
  min-height: 0;
  flex: 1;
  padding: 6px;
  overflow: hidden;
}
.entity-workspace__footer {
  justify-content: flex-end;
}
.entity-workspace__footer-spacer {
  flex: 1;
}
.entity-workspace__error {
  margin-right: auto;
  color: var(--el-color-danger);
}
.entity-reference-guard {
  max-height: 64px;
  flex: none;
  overflow: auto;
  box-sizing: border-box;
  display: grid;
  gap: 5px;
  min-width: 0;
  padding: 9px 12px;
  border-bottom: 1px solid color-mix(in srgb, #e5a43b 50%, var(--ea-border-soft));
  background: color-mix(in srgb, #e5a43b 8%, var(--ea-workbench-panel));
}
.entity-reference-guard strong {
  color: #e5b96d;
  font-size: 12px;
}
.entity-reference-guard span,
.entity-reference-guard code {
  min-width: 0;
  overflow-wrap: anywhere;
  color: var(--ea-fg-muted);
  font-size: 10px;
}
.entity-reference-guard button {
  display: grid;
  grid-template-columns: minmax(120px, 0.35fr) minmax(0, 1fr);
  gap: 8px;
  min-width: 0;
  padding: 6px 8px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-input, #16161a);
  color: var(--ea-fg);
  text-align: left;
  cursor: pointer;
}
@media (max-width: 760px) {
  .entity-workspace {
    grid-template-columns: 150px minmax(0, 1fr);
  }
  .entity-reference-guard {
    max-height: 48px;
    box-sizing: border-box;
    overflow: auto;
    flex: none;
  }
  .entity-workspace__toolbar {
    min-height: 36px;
    padding: 0 8px;
  }
  .entity-workspace__heading span {
    display: none;
  }
}
:global(.ability-entity-definitions-dialog) {
  max-width: calc(100vw - 48px);
  margin-top: 4vh;
}
:global(.ability-entity-definitions-dialog .el-dialog__body) {
  padding: 0 16px;
  overflow: hidden;
}
</style>
