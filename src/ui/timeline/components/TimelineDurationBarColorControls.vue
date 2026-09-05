<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useDurationBarColor } from '../durationBarColorContext';
import { DURATION_COLOR_SOURCES, DURATION_COLOR_SURFACES } from '../durationBarColor';

const { t } = useI18n({ useScope: 'global' });
const prefs = useDurationBarColor();
function tune(field: 'saturation' | 'lightness', event: Event) {
  const value = Number((event.target as HTMLInputElement).value);
  if (Number.isFinite(value)) prefs.value[field] = Math.max(0, Math.min(100, value));
}
</script>

<template>
  <section class="duration-color-section">
    <h4>{{ t('timeline.header.sectionDurationBarColor') }}</h4>
    <button
      type="button"
      class="color-check"
      :aria-pressed="prefs.enabled"
      @click="prefs.enabled = !prefs.enabled"
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="1" y="1" width="14" height="14" rx="2" />
        <polyline v-if="prefs.enabled" points="3,8 6.5,11.5 13,4.5" />
      </svg>
      <span>{{ t('timeline.header.coloredDurationBarsEnable') }}</span>
    </button>
    <div v-if="prefs.enabled" class="color-controls">
      <label v-for="field in ['saturation', 'lightness'] as const" :key="field" class="tune-row">
        <span
          >{{
            t(
              field === 'saturation'
                ? 'timeline.header.durationBarSaturation'
                : 'timeline.header.durationBarLightness',
            )
          }}<em>{{ prefs[field] }}%</em></span
        >
        <div class="ea-range-row">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            class="ea-range"
            :value="prefs[field]"
            @input="tune(field, $event)"
          />
        </div>
      </label>
      <h4>{{ t('timeline.header.durationBarColorSources') }}</h4>
      <div class="color-grid">
        <button
          v-for="source in DURATION_COLOR_SOURCES"
          :key="source"
          type="button"
          class="color-check"
          :aria-pressed="prefs.sources[source]"
          @click="prefs.sources[source] = !prefs.sources[source]"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1" y="1" width="14" height="14" rx="2" />
            <polyline v-if="prefs.sources[source]" points="3,8 6.5,11.5 13,4.5" />
          </svg>
          <span>{{ t(`timeline.header.durationBarColorSource.${source}`) }}</span>
        </button>
      </div>
      <h4>{{ t('timeline.header.durationBarColorSurfaces') }}</h4>
      <div class="color-grid">
        <button
          v-for="surface in DURATION_COLOR_SURFACES"
          :key="surface"
          type="button"
          class="color-check"
          :aria-pressed="prefs.surfaces[surface]"
          @click="prefs.surfaces[surface] = !prefs.surfaces[surface]"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1" y="1" width="14" height="14" rx="2" />
            <polyline v-if="prefs.surfaces[surface]" points="3,8 6.5,11.5 13,4.5" />
          </svg>
          <span>{{ t(`timeline.header.durationBarColorSurface.${surface}`) }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.duration-color-section,
.color-controls {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.duration-color-section {
  border-top: 1px solid var(--ea-border-soft);
  padding-top: 10px;
}
h4 {
  margin: 0;
  color: var(--ea-fg-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}
.color-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  border: 1px solid var(--ea-border-soft);
  border-radius: 4px;
  background: var(--ea-fill-soft);
  overflow: hidden;
}
.duration-color-section .color-check {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 7px;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--ea-fg-secondary);
  text-align: left;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
}
.color-grid .color-check {
  border-bottom: 1px solid var(--ea-border-soft);
}
.color-grid .color-check:nth-child(odd) {
  border-right: 1px solid var(--ea-border-soft);
}
.color-check:hover {
  background: var(--ea-hover-fill);
}
.color-check svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  fill: none;
  stroke: color-mix(in srgb, var(--ea-gold) 85%, transparent);
  stroke-width: 1.5;
}
.color-check polyline {
  stroke-width: 2;
}
.tune-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 6px;
}
.tune-row > span {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--ea-fg-secondary);
}
.tune-row em {
  font-style: normal;
  color: var(--ea-fg-muted);
  font-variant-numeric: tabular-nums;
}
</style>
