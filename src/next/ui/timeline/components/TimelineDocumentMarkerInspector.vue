<script setup lang="ts">
/** 循环线、切入标记与模拟区间端点的实例级 Inspector。 */
import { useI18n } from 'vue-i18n';
import type { TrackIndex } from '../../../core/project/schema';

export type TimelineDocumentMarkerKind =
  'cycleBoundary' | 'controlSwitch' | 'simulationStart' | 'simulationEnd';

const props = defineProps<{
  kind: TimelineDocumentMarkerKind;
  id: string;
  frame: number;
  maximumFrame: number;
  trackIndex?: TrackIndex;
  trackOptions: readonly { trackIndex: TrackIndex; label: string }[];
}>();

const emit = defineEmits<{
  setFrame: [frame: number];
  setTrackIndex: [trackIndex: TrackIndex];
  remove: [];
}>();

const { t } = useI18n({ useScope: 'global' });

function commitFrame(event: Event): void {
  const frame = Number((event.target as HTMLInputElement).value);
  if (Number.isInteger(frame) && frame >= 0 && frame <= props.maximumFrame) {
    emit('setFrame', frame);
  }
}

function commitTrackIndex(event: Event): void {
  const trackIndex = Number((event.target as HTMLSelectElement).value);
  if (
    Number.isInteger(trackIndex) &&
    props.trackOptions.some(option => option.trackIndex === trackIndex)
  ) {
    emit('setTrackIndex', trackIndex as TrackIndex);
  }
}
</script>

<template>
  <section class="marker-inspector">
    <header class="panel-header">
      <div class="header-icon-bar"></div>
      <h3>{{ t('nextTimeline.documentMarkerInspector.title') }}</h3>
    </header>

    <div class="scrollable-content">
      <section class="section-container">
        <div class="panel-tag-mini">{{ t('nextTimeline.inspector.sections.basic') }}</div>
        <div class="attribute-grid">
          <div class="form-group attribute-grid__wide">
            <span>{{ t('nextTimeline.documentMarkerInspector.kind') }}</span>
            <div class="readonly-field">
              {{ t(`nextTimeline.markerLabels.${kind}`) }}
            </div>
          </div>
          <label class="form-group">
            <span>{{ t('nextTimeline.inspector.labels.startFrame') }}</span>
            <input
              type="number"
              min="0"
              :max="maximumFrame"
              step="1"
              :value="frame"
              @change="commitFrame"
            />
          </label>
          <div v-if="kind === 'cycleBoundary' || kind === 'controlSwitch'" class="form-group">
            <span>{{ t('nextTimeline.documentMarkerInspector.markerId') }}</span>
            <div class="readonly-field">{{ id }}</div>
          </div>
          <label v-if="kind === 'controlSwitch'" class="form-group attribute-grid__wide">
            <span>{{ t('nextTimeline.documentMarkerInspector.targetTrack') }}</span>
            <select :value="trackIndex" @change="commitTrackIndex">
              <option
                v-for="option in trackOptions"
                :key="option.trackIndex"
                :value="option.trackIndex"
              >
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>
        <small class="field-help">
          {{ t(`nextTimeline.documentMarkerInspector.hints.${kind}`) }}
        </small>
      </section>

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
