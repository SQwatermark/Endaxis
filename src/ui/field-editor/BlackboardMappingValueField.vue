<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { EaCheckbox, EaInput, EaSelect, type EaSelectValue } from '@/design-system';
import NodeLevelValues from '../action-graph/NodeLevelValues.vue';
import BlackboardKeyField from './BlackboardKeyField.vue';
import { useBlackboardFieldContext } from './blackboardFieldContext';
import { isLevelValues, isMappingRecord, type BlackboardMappingValue } from './blackboardMapping';

const props = defineProps<{
  value: unknown;
  mode: BlackboardMappingValue;
  label: string;
  allowsParameters?: boolean;
}>();
const emit = defineEmits<{ change: [value: unknown] }>();
const { t } = useI18n();
const context = useBlackboardFieldContext();
const operand = computed(() => (isMappingRecord(props.value) ? props.value : {}));
const branch = computed(() => {
  if (props.mode === 'string' || props.mode === 'copy') return props.mode;
  if (isLevelValues(props.value)) return 'levels';
  return typeof operand.value.kind === 'string' ? operand.value.kind : 'invalid';
});
const options = computed(() => [
  ...(props.mode === 'levels' || props.mode === 'levelsOrOperand'
    ? [{ value: 'levels', label: t('blackboardMapping.levels') }]
    : []),
  ...(props.mode === 'operand' || props.mode === 'levelsOrOperand'
    ? [
        { value: 'constant', label: t('blackboardMapping.constant') },
        { value: 'blackboard', label: t('blackboardMapping.readNumber') },
        ...((props.allowsParameters !== false && context.value.parameters.length) ||
        branch.value === 'parameter'
          ? [
              {
                value: 'parameter',
                label: t('blackboardMapping.parameter'),
                disabled: props.allowsParameters === false || !context.value.parameters.length,
              },
            ]
          : []),
      ]
    : []),
  ...(branch.value === 'valueNode'
    ? [{ value: 'valueNode', label: t('blackboardMapping.connection'), disabled: true }]
    : []),
  ...(branch.value === 'invalid'
    ? [
        {
          value: 'invalid',
          label: t(
            props.value === undefined
              ? 'blackboardMapping.chooseValue'
              : 'blackboardMapping.invalidValue',
          ),
          disabled: true,
        },
      ]
    : []),
]);
function switchBranch(value: EaSelectValue | EaSelectValue[]) {
  if (value === branch.value) return;
  if (value === 'levels' && (props.mode === 'levels' || props.mode === 'levelsOrOperand'))
    emit('change', 0);
  if (props.mode !== 'operand' && props.mode !== 'levelsOrOperand') return;
  if (value === 'constant') emit('change', { kind: 'constant', value: 0 });
  if (value === 'blackboard') emit('change', { kind: 'blackboard', key: '' });
  if (value === 'parameter' && props.allowsParameters !== false && context.value.parameters.length)
    emit('change', { kind: 'parameter', parameter: '' });
}
function updateOperand(key: string, value: unknown) {
  const next = { ...operand.value };
  if (value === undefined) delete next[key];
  else next[key] = value;
  emit('change', next);
}
function numeric(raw: string): number | string {
  return raw.trim() !== '' && Number.isFinite(Number(raw)) ? Number(raw) : raw;
}
</script>

<template>
  <div class="mapping-value" :data-mapping-value="mode">
    <template v-if="mode === 'string'">
      <small>{{ t('blackboardMapping.stringLiteral') }}</small>
      <EaInput
        :aria-label="label"
        :model-value="typeof value === 'string' ? value : ''"
        @input="emit('change', $event)"
      />
      <small v-if="typeof value !== 'string'" role="status"
        >{{ t('blackboardMapping.invalidValue') }}: {{ String(value) }}</small
      >
    </template>
    <template v-else-if="mode === 'copy'">
      <small>{{ t('blackboardMapping.copySource') }}</small>
      <BlackboardKeyField
        :value="typeof value === 'string' ? value : undefined"
        :label="label"
        mode="read"
        value-type="any"
        :editable="true"
        @change="emit('change', $event)"
        @draft-change="emit('change', $event)"
      />
    </template>
    <template v-else>
      <EaSelect
        :model-value="branch"
        :options="options"
        :aria-label="`${label} ${t('blackboardMapping.valueMode')}`"
        @change="switchBranch"
      />
      <NodeLevelValues
        v-if="branch === 'levels'"
        :text="JSON.stringify(value)"
        :required="true"
        :label="label"
        @change="emit('change', JSON.parse($event))"
      />
      <EaInput
        v-else-if="branch === 'constant'"
        :model-value="String(operand.value ?? '')"
        type="number"
        step="any"
        :aria-label="label"
        @input="updateOperand('value', numeric($event))"
      />
      <template v-else-if="branch === 'blackboard'">
        <BlackboardKeyField
          :value="typeof operand.key === 'string' ? operand.key : undefined"
          :label="label"
          mode="read"
          :fallback="
            typeof operand.fallback === 'number' && Number.isFinite(operand.fallback)
              ? operand.fallback
              : undefined
          "
          value-type="number"
          :editable="true"
          @change="updateOperand('key', $event)"
          @draft-change="updateOperand('key', $event)"
        />
        <EaCheckbox
          :model-value="Object.hasOwn(operand, 'fallback')"
          @change="updateOperand('fallback', $event ? 0 : undefined)"
          >{{ t('blackboardMapping.useFallback') }}</EaCheckbox
        >
        <EaInput
          v-if="Object.hasOwn(operand, 'fallback')"
          type="number"
          step="any"
          :aria-label="`${label} ${t('blackboardMapping.fallback')}`"
          :model-value="String(operand.fallback ?? '')"
          @input="updateOperand('fallback', numeric($event))"
        />
        <small v-if="Object.hasOwn(operand, 'fallback')">{{
          t('blackboardMapping.fallbackRead')
        }}</small>
        <small v-else>{{ t('blackboardMapping.strictRead') }}</small>
      </template>
      <BlackboardKeyField
        v-else-if="branch === 'parameter'"
        :value="typeof operand.parameter === 'string' ? operand.parameter : undefined"
        :label="label"
        mode="parameter"
        value-type="number"
        :editable="true"
        @change="updateOperand('parameter', $event)"
        @draft-change="updateOperand('parameter', $event)"
      />
      <small v-else-if="branch === 'valueNode'" role="status"
        >{{ t('blackboardMapping.keepConnection') }}: {{ operand.nodeId }}</small
      >
      <small v-else role="status"
        >{{ t('blackboardMapping.invalidValue') }}: {{ JSON.stringify(value) }}</small
      >
    </template>
  </div>
</template>

<style scoped>
.mapping-value {
  display: grid;
  gap: 5px;
  min-width: 0;
}
.mapping-value small {
  color: var(--ea-fg-muted);
  overflow-wrap: anywhere;
}
</style>
