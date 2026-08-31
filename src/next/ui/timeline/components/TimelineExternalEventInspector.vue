<script setup lang="ts">
/** 外部事实标记的实例级 Inspector；只编辑已有 schema 字段，不扩张外部事件种类。 */
import { useI18n } from 'vue-i18n';
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
  targetLabel: string;
}>();

const emit = defineEmits<{
  setFrame: [frame: number];
  setEvent: [event: ExternalCombatEventDocument];
  remove: [];
}>();

const { t } = useI18n({ useScope: 'global' });

function commitFrame(event: Event): void {
  const frame = Number((event.target as HTMLInputElement).value);
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

function setDamageType(event: Event): void {
  const value = (event.target as HTMLSelectElement).value;
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
      <h3>{{ t('nextTimeline.markerInspector.title') }}</h3>
    </header>

    <div class="scrollable-content">
      <section class="section-container">
        <div class="panel-tag-mini">{{ t('nextTimeline.inspector.sections.basic') }}</div>
        <div class="attribute-grid">
          <div class="form-group attribute-grid__wide">
            <span>{{ t('nextTimeline.markerInspector.event') }}</span>
            <div class="readonly-field">
              {{ t(`nextTimeline.markerInspector.eventKinds.${marker.event.kind}`) }}
            </div>
          </div>
          <div class="form-group attribute-grid__wide">
            <span>{{ t('nextTimeline.markerInspector.target') }}</span>
            <div class="readonly-field">{{ targetLabel }}</div>
          </div>
          <label class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.startFrame') }}</span>
            <input
              type="number"
              min="0"
              :max="maximumFrame"
              step="1"
              :value="marker.frame"
              @change="commitFrame"
            />
          </label>
          <div class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.actionId') }}</span>
            <div class="readonly-field">{{ marker.id }}</div>
          </div>
        </div>
        <small class="field-help">{{ t('nextTimeline.markerInspector.boundaryHint') }}</small>
      </section>

      <template v-if="marker.event.kind === 'operatorHit'">
        <section class="section-container">
          <div class="panel-tag-mini">{{ t('nextTimeline.markerInspector.hitContext') }}</div>
          <label class="form-group">
            <span>{{ t('nextTimeline.skillEditing.damageType') }}</span>
            <select :value="marker.event.damageType ?? ''" @change="setDamageType">
              <option value="">{{ t('nextTimeline.markerInspector.unknownDamageType') }}</option>
              <option v-for="item in DAMAGE_TYPES" :key="item" :value="item">
                {{ t(`nextTimeline.skillEditing.damageTypes.${item}`) }}
              </option>
            </select>
          </label>
        </section>

        <section class="section-container">
          <div class="panel-tag-mini">{{ t('nextTimeline.skillEditing.damageTags') }}</div>
          <div class="option-grid">
            <label v-for="tag in DAMAGE_TAGS" :key="tag" class="check-field">
              <input
                type="checkbox"
                :checked="marker.event.tags.includes(tag)"
                @change="toggleTag(tag)"
              />
              <span>{{ t(`nextTimeline.skillEditing.damageTagNames.${tag}`) }}</span>
            </label>
          </div>
        </section>

        <section class="section-container">
          <div class="panel-tag-mini">{{ t('nextTimeline.skillEditing.damageFeatures') }}</div>
          <div class="option-grid">
            <label v-for="feature in DAMAGE_FEATURES" :key="feature" class="check-field">
              <input
                type="checkbox"
                :checked="marker.event.features.includes(feature)"
                @change="toggleFeature(feature)"
              />
              <span>{{ t(`nextTimeline.skillEditing.damageFeatureNames.${feature}`) }}</span>
            </label>
          </div>
        </section>
      </template>

      <section class="section-container danger-section">
        <button type="button" class="delete-button" @click="$emit('remove')">
          {{ t('nextTimeline.markerContext.deleteMarker') }}
        </button>
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

.form-group input,
.form-group select {
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--ea-border, #3a4047);
  border-radius: 3px;
  padding: 6px 8px;
  background: var(--ea-input-bg, #111316);
  color: inherit;
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

.check-field input {
  flex: 0 0 auto;
  margin-top: 2px;
}

.check-field span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.danger-section {
  border-bottom: 0;
}

.delete-button {
  width: 100%;
  border: 1px solid #8f3838;
  border-radius: 3px;
  padding: 7px 10px;
  background: rgb(143 56 56 / 16%);
  color: #ff9a9a;
}
</style>
