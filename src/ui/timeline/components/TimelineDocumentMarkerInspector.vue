<script setup lang="ts">
/** 循环线、切入标记与模拟区间端点的实例级 Inspector。 */
import { useI18n } from 'vue-i18n';
import { EaButton, EaNumberInput, EaSelect, type EaSelectValue } from '@/design-system';
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

function commitFrame(value: number | undefined): void {
  const frame = Number(value);
  if (Number.isInteger(frame) && frame >= 0 && frame <= props.maximumFrame) {
    emit('setFrame', frame);
  }
}

function commitTrackIndex(value: EaSelectValue | EaSelectValue[]): void {
  const trackIndex = Number(value);
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
      <h3>{{ t('timeline.documentMarkerInspector.title') }}</h3>
    </header>

    <div class="scrollable-content">
      <section class="section-container">
        <div class="panel-tag-mini">{{ t('timeline.inspector.sections.basic') }}</div>
        <div class="attribute-grid">
          <div class="form-group attribute-grid__wide">
            <span>{{ t('timeline.documentMarkerInspector.kind') }}</span>
            <div class="readonly-field">
              {{ t(`timeline.markerLabels.${kind}`) }}
            </div>
          </div>
          <label class="form-group">
            <span>{{ t('timeline.inspector.labels.startFrame') }}</span>
            <EaNumberInput
              size="sm"
              controls-position="right"
              :min="0"
              :max="maximumFrame"
              :step="1"
              :model-value="frame"
              @change="commitFrame"
            />
          </label>
          <div v-if="kind === 'cycleBoundary' || kind === 'controlSwitch'" class="form-group">
            <span>{{ t('timeline.documentMarkerInspector.markerId') }}</span>
            <div class="readonly-field">{{ id }}</div>
          </div>
          <label v-if="kind === 'controlSwitch'" class="form-group attribute-grid__wide">
            <span>{{ t('timeline.documentMarkerInspector.targetTrack') }}</span>
            <EaSelect
              size="sm"
              :model-value="trackIndex"
              :options="
                trackOptions.map(option => ({ label: option.label, value: option.trackIndex }))
              "
              @change="commitTrackIndex"
            />
          </label>
        </div>
        <small class="field-help">
          {{ t(`timeline.documentMarkerInspector.hints.${kind}`) }}
        </small>
      </section>

      <section class="section-container danger-section">
        <EaButton
          variant="danger"
          size="sm"
          type="button"
          class="delete-button"
          @click="$emit('remove')"
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

.danger-section {
  border-bottom: 0;
}

.delete-button {
  width: 100%;
}
</style>
