<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
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
}>();
const emit = defineEmits<{
  'update:visible': [visible: boolean];
  save: [definitions: OperatorAbilityEntityDefinitions];
  'reveal-reference': [reference: OperatorDefinitionReference];
}>();
const { t } = useI18n({ useScope: 'global' });

const draft = ref<Record<string, AbilityEntityDefinition>>({});
const selectedId = ref('');
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
    draft.value = cloneProjectJson(props.customDefinitions ?? {});
    const ids = Object.keys({ ...props.baseDefinitions, ...draft.value }).sort();
    selectedId.value =
      props.initialSelectedId !== undefined && ids.includes(props.initialSelectedId)
        ? props.initialSelectedId
        : (ids[0] ?? '');
    newId.value = nextCustomId(ids);
    filterText.value = '';
  },
  { immediate: true },
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
  draft.value = {
    ...draft.value,
    [selectedId.value]: cloneProjectJson(step.parameters.definition),
  };
}

function addDefinition(): void {
  const id = newId.value.trim();
  if (id.length === 0 || allIds.value.includes(id)) return;
  draft.value = {
    ...draft.value,
    [id]: { lifetime: { kind: 'limited', durationSeconds: 10 } },
  };
  selectedId.value = id;
  newId.value = nextCustomId([...allIds.value, id]);
}

function duplicateDefinition(): void {
  const definition = selectedDefinition.value;
  if (definition === undefined) return;
  const id = nextCustomId();
  draft.value = { ...draft.value, [id]: cloneProjectJson(definition) };
  selectedId.value = id;
  newId.value = nextCustomId([...allIds.value, id]);
}

function removeOrResetDefinition(): void {
  const id = selectedId.value;
  if (draft.value[id] === undefined) return;
  if (props.baseDefinitions[id] === undefined && selectedReferences.value.length > 0) return;
  const next = { ...draft.value };
  delete next[id];
  draft.value = next;
  if (props.baseDefinitions[id] === undefined) selectedId.value = operatorIds.value[0] ?? '';
}

function revealReference(reference: OperatorDefinitionReference): void {
  if (reference.ownerKind === 'entity') {
    selectedId.value = reference.ownerId;
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
  <section v-if="visible" class="ability-entity-definitions-editor">
    <header class="entity-workspace__heading">
      <div>
        <strong>{{ t('nextTimeline.skillEditing.abilityEntityObjects') }}</strong>
        <span>选择定义只切换当前画布，不会打开新的面板。</span>
      </div>
      <button type="button" class="ea-btn ea-btn--sm" @click="emit('update:visible', false)">
        返回能力实体概览
      </button>
    </header>
    <div class="entity-workspace">
      <aside class="entity-workspace__sidebar">
        <div class="entity-workspace__create">
          <input v-model="newId" type="text" @keydown.enter.prevent="addDefinition" />
          <button
            type="button"
            class="ea-btn ea-btn--sm"
            :disabled="!canAdd"
            @click="addDefinition"
          >
            {{ t('nextTimeline.skillEditing.addAbilityEntityObject') }}
          </button>
        </div>
        <input
          v-model="filterText"
          class="entity-workspace__search"
          type="search"
          :placeholder="t('nextTimeline.skillEditing.abilityEntitySearchPlaceholder')"
        />
        <div class="entity-workspace__list">
          <div class="entity-workspace__group-heading">
            <span>{{ t('nextTimeline.skillEditing.abilityEntityOperatorGroup') }}</span>
            <span>{{ filteredOperatorIds.length }}</span>
          </div>
          <button
            v-for="id in filteredOperatorIds"
            :key="id"
            type="button"
            class="entity-workspace__item"
            :class="{ active: id === selectedId }"
            :title="id"
            @click="selectedId = id"
          >
            <span class="entity-workspace__item-id">{{ id }}</span>
            <span v-if="draft[id]" class="entity-workspace__badge">
              {{
                baseDefinitions[id]
                  ? t('nextTimeline.skillEditing.abilityEntityOverride')
                  : t('nextTimeline.skillEditing.abilityEntityCustom')
              }}
            </span>
          </button>
          <div v-if="commonIds.length" class="entity-workspace__common">
            {{
              t('nextTimeline.skillEditing.readonlyCommonAbilityEntity', {
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

      <main class="entity-workspace__editor">
        <template v-if="editingStep">
          <div class="entity-workspace__toolbar">
            <strong>{{ selectedId }}</strong>
            <span v-if="selectedIsBase && !selectedIsOverride" class="entity-workspace__source">
              {{ t('nextTimeline.skillEditing.abilityEntityGenerated') }}
            </span>
            <button type="button" class="ea-btn ea-btn--sm" @click="duplicateDefinition">
              {{ t('nextTimeline.skillEditing.duplicateAbilityEntityObject') }}
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
                  ? t('nextTimeline.skillEditing.resetAbilityEntityObject')
                  : t('nextTimeline.skillEditing.deleteAbilityEntityObject')
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
              :ability-entity-id="selectedId"
              :definition="selectedDefinition!"
              :skill-level="skillLevel"
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
          {{ t('nextTimeline.skillEditing.noAbilityEntityObjects') }}
        </p>
      </main>
    </div>

    <div class="entity-workspace__footer">
      <span v-if="validationIssues.length" class="entity-workspace__error">
        {{
          t('nextTimeline.skillEditing.validationIssueCount', { count: validationIssues.length })
        }}
      </span>
      <button type="button" class="ea-btn ea-btn--sm" @click="emit('update:visible', false)">
        {{ t('nextTimeline.skillEditing.cancel') }}
      </button>
      <button type="button" class="ea-btn ea-btn--sm" @click="save">
        {{ t('nextTimeline.skillEditing.saveAbilityEntityObjects') }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.ability-entity-definitions-editor {
  display: flex;
  min-height: 0;
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
  grid-template-columns: 320px minmax(0, 1fr);
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
  padding: 16px;
  overflow: auto;
  scrollbar-gutter: stable;
}
.entity-workspace__footer {
  justify-content: flex-end;
}
.entity-workspace__error {
  margin-right: auto;
  color: var(--el-color-danger);
}
.entity-reference-guard {
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
    grid-template-columns: 1fr;
  }
  .entity-workspace__sidebar {
    max-height: 220px;
    overflow: auto;
    border-right: 0;
    border-bottom: 1px solid var(--ea-border-soft);
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
