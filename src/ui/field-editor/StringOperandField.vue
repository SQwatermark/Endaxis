<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { EaButton, EaInput, EaSelect, type EaSelectValue } from '@/design-system';
import { type ReferenceChoices } from '@/application/editor/referenceResolver';
import type { BlackboardFieldContext } from '@/application/editor/blackboardFieldContext';
import { validStringOperandDraft } from './stringOperandDraft';
import { useBlackboardFieldContext } from './blackboardFieldContext';
import BlackboardKeyField from './BlackboardKeyField.vue';
import ReferenceField from './ReferenceField.vue';

const props = defineProps<{
  value: unknown;
  label: string;
  editable?: boolean;
  required?: boolean;
  referenceKind?: string;
  referenceChoices?: ReferenceChoices;
  blackboardContext?: BlackboardFieldContext;
}>();
const emit = defineEmits<{ change: [value: unknown]; discard: [] }>();
const { t } = useI18n();
const inheritedContext = useBlackboardFieldContext();
const context = computed(() => props.blackboardContext ?? inheritedContext.value);
const mode = ref<'literal' | 'blackboard'>('literal');
const literal = ref('');
const key = ref('');
const dirty = ref(false);
const original = computed(() =>
  typeof props.value === 'string' ? props.value : JSON.stringify(props.value),
);
function reset() {
  mode.value =
    typeof props.value === 'object' && props.value !== null && 'blackboardKey' in props.value
      ? 'blackboard'
      : 'literal';
  literal.value = typeof props.value === 'string' ? props.value : '';
  key.value =
    mode.value === 'blackboard'
      ? String((props.value as { blackboardKey: unknown }).blackboardKey)
      : '';
  dirty.value = false;
}
function discard() {
  reset();
  emit('discard');
}
watch(() => props.value, reset, { immediate: true });
function chooseMode(next: EaSelectValue | EaSelectValue[]) {
  if (!props.editable || (next !== 'literal' && next !== 'blackboard')) return;
  mode.value = next;
  dirty.value = true;
}
function changeLiteral(value: string | undefined) {
  if (!props.editable) return;
  literal.value = value ?? '';
  dirty.value = true;
}
function changeKey(value: string) {
  if (!props.editable) return;
  key.value = value;
  dirty.value = true;
}
const draft = computed(() =>
  mode.value === 'literal' ? literal.value : { blackboardKey: key.value },
);
const valid = computed(() =>
  validStringOperandDraft(draft.value, props.referenceKind, props.referenceChoices, context.value),
);
function apply() {
  // Re-evaluate at commit: catalogs/scopes may have changed with a draft open.
  if (
    props.editable &&
    dirty.value &&
    validStringOperandDraft(draft.value, props.referenceKind, props.referenceChoices, context.value)
  )
    emit('change', draft.value);
}
function unset() {
  if (props.editable && !props.required) emit('change', undefined);
}
</script>

<template>
  <section
    @keydown.esc.prevent.stop="discard"
    class="string-operand"
    :data-string-operand-mode="mode"
  >
    <EaSelect
      :aria-label="`${label} · ${t('stringOperand.mode')}`"
      :model-value="mode"
      :disabled="!editable"
      :options="[
        { value: 'literal', label: t('stringOperand.literal') },
        { value: 'blackboard', label: t('stringOperand.blackboard') },
      ]"
      @change="chooseMode"
    />
    <ReferenceField
      v-if="mode === 'literal' && referenceKind"
      :value="literal"
      :label="label"
      :reference-kind="referenceKind"
      :choices="referenceChoices?.[referenceKind]"
      :disabled="!editable"
      @change="changeLiteral"
    />
    <EaInput
      v-else-if="mode === 'literal'"
      :aria-label="label"
      :model-value="literal"
      :disabled="!editable"
      @input="changeLiteral"
    />
    <BlackboardKeyField
      v-else
      :value="key"
      :label="label"
      :editable="editable"
      :context="context"
      mode="read"
      value-type="string"
      @draft-change="changeKey"
      @change="changeKey"
    />
    <small>{{ t('stringOperand.current') }}: {{ original ?? t('actionGraphEditor.unset') }}</small>
    <small v-if="mode === 'blackboard'">{{ t('stringOperand.readHelp') }}</small>
    <div v-if="editable" class="string-operand__actions">
      <EaButton v-if="dirty" :disabled="!valid" size="sm" @click="apply">{{
        t('actionGraphEditor.apply')
      }}</EaButton>
      <EaButton v-if="dirty" size="sm" @click="discard">{{
        t('actionGraphEditor.discard')
      }}</EaButton>
      <EaButton v-if="!required && value !== undefined" size="sm" @click="unset">{{
        t('actionGraphEditor.unset')
      }}</EaButton>
    </div>
  </section>
</template>
<style scoped>
.string-operand {
  display: grid;
  gap: 6px;
  min-width: 0;
}
.string-operand__actions {
  display: flex;
  gap: 6px;
}
.string-operand small {
  overflow-wrap: anywhere;
}
</style>
