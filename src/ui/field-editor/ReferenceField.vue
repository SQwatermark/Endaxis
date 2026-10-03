<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { EaSelect, type EaSelectValue } from '@/design-system';
import type { FieldChoice } from '../definition-editor/fieldInputConfig';

/** 同一引用在查看、缺值与创建入口保持身份；候选缺失不能退为任意文本。 */
const props = defineProps<{
  value?: string;
  label: string;
  referenceKind: string;
  choices?: readonly FieldChoice[];
  disabled?: boolean;
  allowUnset?: boolean;
}>();
const emit = defineEmits<{ change: [value: string] }>();
const { t } = useI18n();
const selected = computed(() => props.choices?.find(choice => choice.value === props.value));
const state = computed(() => {
  if (!props.value) return 'unset';
  if (props.choices === undefined) return 'contextUnknown';
  return selected.value ? 'listed' : 'unresolved';
});
const catalogState = computed(() =>
  props.choices === undefined ? 'contextUnknown' : props.choices.length ? 'available' : 'empty',
);
const options = computed(() => [
  { value: '', label: t('fieldReference.unset'), disabled: !props.allowUnset },
  ...(props.value && !selected.value
    ? [{ value: props.value, label: props.value, disabled: true }]
    : []),
  ...(props.choices ?? []),
]);
function change(value: EaSelectValue | EaSelectValue[]) {
  if (props.disabled || typeof value !== 'string') return;
  if ((value === '' && props.allowUnset) || props.choices?.some(choice => choice.value === value))
    emit('change', value);
}
</script>

<template>
  <div
    class="reference-field"
    :data-reference-kind="referenceKind"
    :data-reference-state="state"
    :data-reference-catalog="catalogState"
  >
    <EaSelect
      :model-value="value ?? ''"
      :aria-label="label"
      :disabled="disabled"
      :options="options"
      :placeholder="t('fieldReference.unset')"
      @change="change"
    />
    <small v-if="value" class="reference-field__identity">{{ value }}</small>
    <small v-if="state === 'unresolved'">{{ t('fieldReference.unresolved') }}</small>
    <small v-if="catalogState !== 'available'">{{ t(`fieldReference.${catalogState}`) }}</small>
  </div>
</template>

<style scoped>
.reference-field {
  display: grid;
  min-width: 0;
  gap: 3px;
}
.reference-field :deep(.ea-select) {
  width: 100%;
}
.reference-field small {
  color: var(--ea-fg-muted);
  overflow-wrap: anywhere;
}
.reference-field__identity {
  font-family: monospace;
}
</style>
