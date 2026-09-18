<script setup lang="ts">
/** 外部事实标记的实例级 Inspector；只编辑已有 schema 字段，不扩张外部事件种类。 */
import { useI18n } from 'vue-i18n';
import {
  EaButton,
  EaCheckbox,
  EaNumberInput,
  EaSelect,
  type EaSelectValue,
} from '../../../design-system/index';
import {
  DAMAGE_FEATURES,
  DAMAGE_TAGS,
  DAMAGE_TYPES,
  type DamageFeature,
  type DamageTag,
  type DamageType,
} from '../../../core/game-data/operatorDefinition';
import type {
  ExternalCombatEventDocument,
  ExternalEventMarkerDocument,
} from '../../../core/project/schema';

const props = defineProps<{
  marker: ExternalEventMarkerDocument;
  maximumFrame: number;
  readOnly?: boolean;
  targetLabel: string;
}>();

const emit = defineEmits<{
  setFrame: [frame: number];
  setEvent: [event: ExternalCombatEventDocument];
  remove: [];
}>();

const { t } = useI18n({ useScope: 'global' });

function commitFrame(value: number | undefined): void {
  const frame = Number(value);
  if (Number.isInteger(frame) && frame >= 0 && frame <= props.maximumFrame) {
    emit('setFrame', frame);
  }
}

function updateHit(
  patch: Partial<Extract<ExternalCombatEventDocument, { kind: 'operatorHit' }>>,
): void {
  if (props.marker.event.kind !== 'operatorHit') return;
  emit('setEvent', { ...props.marker.event, ...patch });
}

function setDamageType(selected: EaSelectValue | EaSelectValue[]): void {
  const value = String(selected);
  if (value === '') {
    const hit = props.marker.event;
    if (hit.kind !== 'operatorHit') return;
    const { damageType: _damageType, ...withoutDamageType } = hit;
    emit('setEvent', withoutDamageType);
    return;
  }
  const damageType = value as DamageType;
  if (DAMAGE_TYPES.includes(damageType)) updateHit({ damageType });
}

function toggleTag(tag: DamageTag): void {
  if (props.marker.event.kind !== 'operatorHit') return;
  updateHit({
    tags: props.marker.event.tags.includes(tag)
      ? props.marker.event.tags.filter(item => item !== tag)
      : [...props.marker.event.tags, tag],
  });
}

function toggleFeature(feature: DamageFeature): void {
  if (props.marker.event.kind !== 'operatorHit') return;
  updateHit({
    features: props.marker.event.features.includes(feature)
      ? props.marker.event.features.filter(item => item !== feature)
      : [...props.marker.event.features, feature],
  });
}
</script>

<template>
  <section class="marker-inspector">
    <header class="panel-header">
      <div class="header-icon-bar"></div>
      <h3>{{ t('timeline.markerInspector.title') }}</h3>
    </header>

    <div class="scrollable-content">
      <section class="section-container">
        <div class="panel-tag-mini">{{ t('timeline.inspector.sections.basic') }}</div>
        <div class="attribute-grid">
          <div class="form-group attribute-grid__wide">
            <span>{{ t('timeline.markerInspector.event') }}</span>
            <div class="readonly-field">
              {{
                marker.event.kind === 'comboCooldownControl'
                  ? t(`comboControl.${marker.event.mode}`)
                  : t(`timeline.markerInspector.eventKinds.${marker.event.kind}`)
              }}
            </div>
          </div>
          <div class="form-group attribute-grid__wide">
            <span>{{ t('timeline.markerInspector.target') }}</span>
            <div class="readonly-field">{{ targetLabel }}</div>
          </div>
          <label class="form-group">
            <span>{{ t('timeline.inspector.labels.startFrame') }}</span>
            <EaNumberInput
              size="sm"
              controls-position="right"
              :min="0"
              :max="maximumFrame"
              :step="1"
              :model-value="marker.frame"
              @change="commitFrame"
              :disabled="readOnly"
            />
          </label>
          <div class="form-group">
            <span>{{ t('timeline.inspector.labels.actionId') }}</span>
            <div class="readonly-field">{{ marker.id }}</div>
          </div>
        </div>
        <small class="field-help">{{
          t(
            marker.event.kind === 'comboCooldownControl'
              ? 'comboControl.hint'
              : 'timeline.markerInspector.boundaryHint',
          )
        }}</small>
      </section>

      <template v-if="marker.event.kind === 'operatorHit'">
        <section class="section-container">
          <div class="panel-tag-mini">{{ t('timeline.markerInspector.hitContext') }}</div>
          <label class="form-group">
            <span>{{ t('timeline.skillEditing.damageType') }}</span>
            <EaSelect
              size="sm"
              :model-value="marker.event.damageType ?? ''"
              :options="[
                { value: '', label: t('timeline.markerInspector.unknownDamageType') },
                ...DAMAGE_TYPES.map(item => ({
                  value: item,
                  label: t(`timeline.skillEditing.damageTypes.${item}`),
                })),
              ]"
              @change="setDamageType"
              :disabled="readOnly"
            />
          </label>
        </section>

        <section class="section-container">
          <div class="panel-tag-mini">{{ t('timeline.skillEditing.damageTags') }}</div>
          <div class="option-grid">
            <EaCheckbox
              v-for="tag in DAMAGE_TAGS"
              :key="tag"
              class="check-field"
              :model-value="marker.event.tags.includes(tag)"
              @change="toggleTag(tag)"
              :disabled="readOnly"
              >{{ t(`timeline.skillEditing.damageTagNames.${tag}`) }}</EaCheckbox
            >
          </div>
        </section>

        <section class="section-container">
          <div class="panel-tag-mini">{{ t('timeline.skillEditing.damageFeatures') }}</div>
          <div class="option-grid">
            <EaCheckbox
              v-for="feature in DAMAGE_FEATURES"
              :key="feature"
              class="check-field"
              :model-value="marker.event.features.includes(feature)"
              @change="toggleFeature(feature)"
              :disabled="readOnly"
              >{{ t(`timeline.skillEditing.damageFeatureNames.${feature}`) }}</EaCheckbox
            >
          </div>
        </section>
      </template>

      <section class="section-container danger-section">
        <EaButton
          variant="danger"
          size="sm"
          type="button"
          class="delete-button"
          @click="$emit('remove')"
          :disabled="readOnly"
        >
          {{ t('timeline.markerContext.deleteMarker') }}
        </EaButton>
      </section>
    </div>
  </section>
</template>

<style scoped>
.marker-inspector {
  height: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--ea-panel-bg, #17191c);
  color: var(--ea-text, #e8e8e8);
}

.panel-header {
  position: relative;
  min-height: 44px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--ea-border, #353a40);
}

.header-icon-bar {
  width: 4px;
  align-self: stretch;
  background: #cfb73a;
}

.panel-header h3 {
  min-width: 0;
  margin: 0;
  padding: 0 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.scrollable-content {
  min-height: 0;
  overflow: auto;
  padding-bottom: 12px;
}

.section-container {
  min-width: 0;
  padding: 12px;
  border-bottom: 1px solid var(--ea-border, #353a40);
}

.panel-tag-mini {
  margin-bottom: 10px;
  color: var(--ea-text-secondary, #aeb4bb);
  font-size: 12px;
  font-weight: 700;
}

.attribute-grid {
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.attribute-grid__wide {
  grid-column: 1 / -1;
}

.form-group {
  min-width: 0;
  display: grid;
  gap: 5px;
  color: var(--ea-text-secondary, #aeb4bb);
  font-size: 12px;
}

.readonly-field {
  min-width: 0;
  overflow-wrap: anywhere;
  border-radius: 3px;
  padding: 7px 8px;
  background: rgb(255 255 255 / 4%);
  color: var(--ea-text, #e8e8e8);
}

.field-help {
  display: block;
  margin-top: 9px;
  color: var(--ea-text-muted, #7f8790);
  line-height: 1.45;
}

.option-grid {
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(116px, 1fr));
  gap: 6px;
}

.check-field {
  min-width: 0;
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 5px 6px;
  border-radius: 3px;
  background: rgb(255 255 255 / 3%);
  font-size: 12px;
  line-height: 1.35;
}

.danger-section {
  border-bottom: 0;
}

.delete-button {
  width: 100%;
}
</style>
