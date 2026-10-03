<script setup lang="ts">
/** Local replacement drafts do not disconnect the active source until explicitly applied. */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import { EaButton, EaInput, EaSelect } from '@/design-system';
import type { DataInput } from '../../core/action-graph/actionGraphDataNodes';
const props = defineProps<{
  input: DataInput;
  label: string;
  readonly?: boolean;
  sourceLabel?: string;
}>();
const emit = defineEmits<{
  constant: [value: number | boolean];
  locate: [id: string];
}>();
const editing = ref(false);
const draft = ref('');
const literal = computed(() => {
  const value = props.input.value;
  return value &&
    typeof value === 'object' &&
    'kind' in value &&
    value.kind === 'constant' &&
    'value' in value
    ? value.value
    : undefined;
});
function reset() {
  editing.value = false;
  draft.value = '';
}
watch(() => [props.input.value, props.readonly], reset);
function start() {
  if (props.readonly) return;
  draft.value = literal.value === undefined ? '' : String(literal.value);
  editing.value = true;
}
const valid = computed(
  () =>
    draft.value.trim() !== '' &&
    (props.input.type === 'number'
      ? Number.isFinite(Number(draft.value))
      : draft.value === 'true' || draft.value === 'false'),
);
function apply() {
  if (!valid.value || props.readonly) return;
  emit('constant', props.input.type === 'number' ? Number(draft.value) : draft.value === 'true');
  // Only an accepted parent value resets the draft; rejected edits stay repairable.
}
const preview = computed(() => {
  if (props.input.value === undefined) return t('graphDataInput.unassigned');
  if (literal.value !== undefined) return String(literal.value);
  if (typeof props.input.value === 'number') return String(props.input.value);
  if (Array.isArray(props.input.value)) return t('graphDataInput.levelValues');
  return t('graphDataInput.expression');
});
</script>
<template>
  <span class="typed-data-input" @pointerdown.stop @keydown.esc.prevent.stop="reset">
    <template v-if="editing && !readonly">
      <EaInput
        v-if="input.type === 'number'"
        v-model="draft"
        size="sm"
        type="number"
        step="any"
        :aria-label="t('graphDataInput.literal', { label })"
        @keydown.enter.prevent.stop="apply"
      />
      <EaSelect
        v-else
        v-model="draft"
        size="sm"
        :aria-label="t('graphDataInput.condition', { label })"
        :options="[
          { value: 'true', label: t('graphDataInput.true') },
          { value: 'false', label: t('graphDataInput.false') },
        ]"
      />
      <EaButton
        size="sm"
        :disabled="!valid"
        :aria-label="t('graphDataInput.applyLabel', { label })"
        @click="apply"
        >{{ t('graphDataInput.apply') }}</EaButton
      >
      <EaButton size="sm" :aria-label="t('graphDataInput.cancelLabel', { label })" @click="reset">{{
        t('graphDataInput.cancel')
      }}</EaButton>
    </template>
    <template v-else>
      <EaButton
        v-if="input.source !== null"
        size="sm"
        :title="t('graphDataInput.source', { id: input.source })"
        @click="emit('locate', input.source)"
      >
        {{ sourceLabel ?? input.source }} ↗
      </EaButton>
      <span v-else class="typed-data-input__preview">{{ preview }}</span>
      <EaButton
        v-if="!readonly"
        size="sm"
        :aria-label="t('graphDataInput.editLabel', { label })"
        @click="start"
      >
        {{ t(input.source !== null ? 'graphDataInput.inline' : 'graphDataInput.edit') }}
      </EaButton>
    </template>
  </span>
</template>
<style scoped>
.typed-data-input {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
  max-width: 100%;
}
.typed-data-input :deep(input) {
  min-width: 45px;
}
.typed-data-input :deep(.ea-input),
.typed-data-input :deep(.ea-select) {
  min-width: 65px;
}
.typed-data-input__preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
