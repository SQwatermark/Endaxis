<script setup lang="ts">
import { EaButton, EaDialog, EaDialogActions, EaNumberInput } from '@/design-system';
/**
 * 编辑存档中由用户维护的全局技力基线。组件只收发数值，不持有项目副本，也不推导尚未接入的
 * 原生运行时规则；撤销、校验和持久化均由外层命令与会话负责。
 */
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  BattleDocument,
  GlobalOperatorStatModifier,
  GlobalOperatorStatModifierDocument,
} from '../../../core/project/schema';
import type { EditableBattleResourceRule } from '../interaction/timelineDocumentCommands';
import InputRegionBoundary from '../../keyboard/InputRegionBoundary.vue';

const props = defineProps<{
  mode?: 'full' | 'modifiers';
  rules: BattleDocument['resourceRules'];
  modifiers: readonly GlobalOperatorStatModifierDocument[];
  labels: {
    title: string;
    maximum: string;
    initial: string;
    recovery: string;
  };
}>();

const emit = defineEmits<{
  update: [field: EditableBattleResourceRule, value: number];
  setModifiers: [modifiers: readonly GlobalOperatorStatModifierDocument[]];
}>();

const { t } = useI18n({ useScope: 'global' });
const editorVisible = ref(false);

interface ModifierChoice {
  readonly modifier: GlobalOperatorStatModifier;
  readonly percentage: boolean;
  readonly skillType?: 'comboSkill';
}

const choices: readonly ModifierChoice[] = [
  { modifier: 'skillCooldownReduction', percentage: true, skillType: 'comboSkill' },
  { modifier: 'ultimateEnergyGainEfficiency', percentage: true },
  { modifier: 'artsIntensity', percentage: false },
  { modifier: 'attackPercent', percentage: true },
  { modifier: 'criticalRate', percentage: true },
  { modifier: 'criticalDamage', percentage: true },
];

const summary = computed(() =>
  props.modifiers.length === 0
    ? t('timeline.globalModifiers.empty')
    : props.modifiers
        .map(modifier => `${choiceLabel(modifier)} ${formatValue(modifier)}`)
        .join(' · '),
);

function choiceFor(modifier: GlobalOperatorStatModifierDocument): ModifierChoice {
  return choices.find(choice => choice.modifier === modifier.modifier) ?? choices[0]!;
}

function choiceLabel(modifier: Pick<GlobalOperatorStatModifierDocument, 'modifier'>): string {
  return t(`timeline.globalModifiers.types.${modifier.modifier}`);
}

function formatValue(modifier: GlobalOperatorStatModifierDocument): string {
  const choice = choiceFor(modifier);
  const value = choice.percentage ? modifier.value * 100 : modifier.value;
  return `${value > 0 ? '+' : ''}${Number(value.toFixed(3))}${choice.percentage ? '%' : ''}`;
}

function allocateModifierId(): string {
  const ids = new Set(props.modifiers.map(modifier => modifier.id));
  let index = 1;
  while (ids.has(`global:modifier:${index}`)) index += 1;
  return `global:modifier:${index}`;
}

function addModifier(choice: ModifierChoice): void {
  emit('setModifiers', [
    ...props.modifiers,
    {
      id: allocateModifierId(),
      kind: 'operatorStat',
      modifier: choice.modifier,
      value: 0,
      ...(choice.skillType === undefined ? {} : { skillType: choice.skillType }),
    },
  ]);
}

function updateModifierValue(modifierId: string, displayValue: number | undefined): void {
  const modifier = props.modifiers.find(candidate => candidate.id === modifierId);
  if (modifier === undefined || displayValue === undefined || !Number.isFinite(displayValue))
    return;
  const choice = choiceFor(modifier);
  const value = choice.percentage ? displayValue / 100 : displayValue;
  if (modifier.modifier === 'skillCooldownReduction' && value >= 1) return;
  emit(
    'setModifiers',
    props.modifiers.map(candidate =>
      candidate.id === modifierId ? { ...candidate, value } : candidate,
    ),
  );
}

function removeModifier(modifierId: string): void {
  emit(
    'setModifiers',
    props.modifiers.filter(modifier => modifier.id !== modifierId),
  );
}

function emitNumber(field: EditableBattleResourceRule, value: number | undefined): void {
  if (value !== undefined && Number.isFinite(value)) emit('update', field, value);
}
</script>

<template>
  <section
    class="global-resource-panel"
    :class="{ 'global-resource-panel--modifiers': props.mode === 'modifiers' }"
  >
    <header>{{ labels.title }}</header>
    <div v-if="props.mode !== 'modifiers'" class="resource-fields">
      <label>
        <span>{{ labels.maximum }}</span>
        <EaNumberInput
          size="sm"
          controls-position="right"
          :min="0"
          :step="1"
          :model-value="rules.maxSp"
          @change="emitNumber('maxSp', $event)"
        />
      </label>
      <label>
        <span>{{ labels.initial }}</span>
        <EaNumberInput
          size="sm"
          controls-position="right"
          :min="0"
          :max="rules.maxSp"
          :step="1"
          :model-value="rules.initialSp"
          @change="emitNumber('initialSp', $event)"
        />
      </label>
      <label>
        <span>{{ labels.recovery }}</span>
        <EaNumberInput
          size="sm"
          controls-position="right"
          :min="0"
          :step="0.1"
          :model-value="rules.spRecoveryPerSecond"
          @change="emitNumber('spRecoveryPerSecond', $event)"
        />
      </label>
    </div>
    <section class="modifier-summary">
      <div>
        <strong>{{ t('timeline.globalModifiers.title') }}</strong>
        <span>{{ summary }}</span>
      </div>
      <EaButton size="sm" type="button" @click="editorVisible = true">
        {{ t('timeline.globalModifiers.edit') }}
      </EaButton>
    </section>
    <InputRegionBoundary label="global-modifiers" :active="editorVisible" modal>
      <EaDialog
        v-model="editorVisible"
        append-to-body
        width="520px"
        class="global-modifier-dialog"
        :title="t('timeline.globalModifiers.title')"
      >
        <div class="modifier-editor">
          <section v-for="choice in choices" :key="choice.modifier" class="modifier-group">
            <header>
              <span>{{ choiceLabel(choice) }}</span>
              <small v-if="choice.skillType === 'comboSkill'">
                {{ t('timeline.globalModifiers.comboOnly') }}
              </small>
              <EaButton
                variant="ghost"
                size="sm"
                icon-only
                type="button"
                @click="addModifier(choice)"
                >＋</EaButton
              >
            </header>
            <div
              v-for="modifier in modifiers.filter(item => item.modifier === choice.modifier)"
              :key="modifier.id"
              class="modifier-entry"
            >
              <EaNumberInput
                class="modifier-value"
                size="sm"
                controls-position="right"
                :max="choice.modifier === 'skillCooldownReduction' ? 99.999 : undefined"
                :step="choice.percentage ? 0.1 : 1"
                :model-value="choice.percentage ? modifier.value * 100 : modifier.value"
                @change="updateModifierValue(modifier.id, $event)"
              />
              <span>{{ choice.percentage ? '%' : '' }}</span>
              <EaButton
                variant="danger"
                size="sm"
                type="button"
                @click="removeModifier(modifier.id)"
              >
                {{ t('common.delete') }}
              </EaButton>
            </div>
          </section>
        </div>
        <template #footer>
          <EaDialogActions>
            <EaButton size="sm" type="button" @click="editorVisible = false">{{
              t('common.close')
            }}</EaButton>
          </EaDialogActions>
        </template>
      </EaDialog>
    </InputRegionBoundary>
  </section>
</template>

<style scoped>
.global-resource-panel {
  height: 100%;
  padding: 14px 18px;
  box-sizing: border-box;
  color: var(--ea-text-primary, rgb(255 255 255 / 88%));
  background: var(--ea-surface, #17191c);
}

.global-resource-panel--modifiers {
  padding: 12px 12px 16px;
  overflow: auto;
}

.global-resource-panel--modifiers .modifier-summary {
  align-items: stretch;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  padding-top: 0;
  border-top: 0;
}

.global-resource-panel--modifiers .modifier-summary span {
  white-space: normal;
}

.global-resource-panel--modifiers .modifier-summary .ea-button {
  min-height: 28px;
}

header {
  padding-bottom: 9px;
  border-bottom: 1px solid var(--ea-border, rgb(255 255 255 / 10%));
  font-size: 13px;
  font-weight: 700;
}

.resource-fields {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 180px));
  gap: 12px;
  padding-top: 14px;
}

.modifier-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--ea-border, rgb(255 255 255 / 10%));
}

.modifier-summary > div {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.modifier-summary span {
  overflow: hidden;
  color: var(--ea-text-secondary, rgb(255 255 255 / 62%));
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.modifier-editor {
  display: grid;
  gap: 8px;
}

.modifier-group {
  padding: 8px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}

.modifier-group header,
.modifier-entry {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modifier-group header > span {
  flex: 1;
}

.modifier-group small {
  color: var(--ea-fg-muted);
}

.modifier-entry {
  margin-top: 7px;
}

.modifier-entry .modifier-value {
  max-width: 180px;
}

.modifier-entry .ea-button {
  margin-left: auto;
}

label {
  display: grid;
  gap: 6px;
  color: var(--ea-text-secondary, rgb(255 255 255 / 62%));
  font-size: 11px;
}
</style>
