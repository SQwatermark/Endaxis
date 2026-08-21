<script setup lang="ts">
import { useId } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  GAMEPLAY_TAG_DEFINITIONS,
  gameplayTagPath,
  parseGameplayTagReference,
} from '../../../data/combat/gameplayTagCatalog';

const props = withDefaults(
  defineProps<{
    ids: readonly number[];
    minimum?: number;
    maximum?: number;
  }>(),
  { minimum: 1, maximum: Number.POSITIVE_INFINITY },
);
const emit = defineEmits<{ update: [ids: readonly number[]] }>();
const { t } = useI18n({ useScope: 'global' });
const datalistId = `gameplay-tags-${useId().replaceAll(':', '-')}`;

function displayedValue(id: number): string {
  return gameplayTagPath(id) ?? String(id);
}

function replace(index: number, event: Event): void {
  const input = event.target as HTMLInputElement;
  const id = parseGameplayTagReference(input.value);
  if (id === undefined) {
    input.value = displayedValue(props.ids[index]!);
    return;
  }
  const ids = [...props.ids];
  ids[index] = id;
  emit('update', ids);
}

function append(event: Event): void {
  const input = event.target as HTMLInputElement;
  const id = parseGameplayTagReference(input.value);
  if (id === undefined || props.ids.length >= props.maximum) return;
  emit('update', [...props.ids, id]);
  input.value = '';
}

function remove(index: number): void {
  if (props.ids.length <= props.minimum) return;
  emit(
    'update',
    props.ids.filter((_, itemIndex) => itemIndex !== index),
  );
}
</script>

<template>
  <div class="gameplay-tag-editor">
    <div v-for="(id, index) in ids" :key="index" class="gameplay-tag-editor__row">
      <input
        type="text"
        :list="datalistId"
        :value="displayedValue(id)"
        :aria-label="t('nextTimeline.skillEditing.gameplayTagPath')"
        @change="replace(index, $event)"
      />
      <code>{{ id }}</code>
      <button
        type="button"
        :disabled="ids.length <= minimum"
        :title="t('nextTimeline.skillEditing.deleteGameplayTag')"
        @click="remove(index)"
      >
        ×
      </button>
      <small v-if="gameplayTagPath(id) === undefined">
        {{
          id === 0
            ? t('nextTimeline.skillEditing.invalidGameplayTag')
            : t('nextTimeline.skillEditing.unknownGameplayTag')
        }}
      </small>
    </div>
    <input
      v-if="ids.length < maximum"
      class="gameplay-tag-editor__add"
      type="text"
      :list="datalistId"
      :placeholder="t('nextTimeline.skillEditing.addGameplayTag')"
      :aria-label="t('nextTimeline.skillEditing.addGameplayTag')"
      @change="append"
    />
    <datalist :id="datalistId">
      <option
        v-for="definition in GAMEPLAY_TAG_DEFINITIONS"
        :key="definition.id"
        :value="definition.path"
      >
        {{ definition.id }}
      </option>
    </datalist>
  </div>
</template>

<style scoped>
.gameplay-tag-editor {
  min-width: 0;
  display: grid;
  gap: 6px;
}

.gameplay-tag-editor__row {
  min-width: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto 28px;
  gap: 6px;
  align-items: center;
}

.gameplay-tag-editor input {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
}

.gameplay-tag-editor code {
  max-width: 100px;
  overflow: hidden;
  color: var(--ea-text-muted);
  font-size: 10px;
  text-overflow: ellipsis;
}

.gameplay-tag-editor button {
  width: 28px;
  height: 28px;
  padding: 0;
}

.gameplay-tag-editor small {
  grid-column: 1 / -1;
  color: var(--ea-warning, #d6a45f);
}
</style>
