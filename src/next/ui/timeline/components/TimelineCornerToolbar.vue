<script setup lang="ts">
/**
 * 时间轴轨道头部上方的编辑工具区，复刻旧版控件的稳定顺序和尺寸。
 * 尚未接入 Next 命令层的工具保持禁用；接入时应由父组件传入状态与命令。
 */
defineProps<{
  snapLabel: string;
  zoomPercent: number;
  labels: {
    initialGauge: string;
    cursorGuide: string;
    boxSelect: string;
    snapPrecision: string;
    connectionTool: string;
    buffLayout: string;
    zoom: string;
  };
}>();

const emit = defineEmits<{
  toggleSnapPrecision: [];
  updateZoomPercent: [percent: number];
}>();
</script>

<template>
  <div class="corner-controls">
    <div class="corner-button-row">
      <button type="button" class="mini-tool-button" disabled :title="labels.initialGauge">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2 4 14h7l-1 8L20 9h-7V2Z" /></svg>
      </button>
      <button type="button" class="mini-tool-button" disabled :title="labels.cursorGuide">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v12M6 12h12" />
        </svg>
      </button>
      <button type="button" class="mini-tool-button" disabled :title="labels.boxSelect">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke-dasharray="4 3" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      </button>
      <button
        type="button"
        class="mini-tool-button mini-tool-button--text"
        :title="labels.snapPrecision"
        @click="$emit('toggleSnapPrecision')"
      >
        {{ snapLabel }}
      </button>
      <button type="button" class="mini-tool-button" disabled :title="labels.connectionTool">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 4h14c3 0 3 8 0 8H5c-3 0-3 8 0 8h14" />
          <circle cx="5" cy="4" r="2" />
          <circle cx="19" cy="20" r="2" />
        </svg>
      </button>
      <button type="button" class="mini-tool-button" disabled :title="labels.buffLayout">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 12h16M4 16h16" /></svg>
      </button>
    </div>

    <div class="zoom-row" :title="labels.zoom">
      <div class="zoom-info">
        <span>SCALE</span><strong>{{ zoomPercent }}%</strong>
      </div>
      <div class="zoom-slider-row">
        <button
          type="button"
          class="zoom-step"
          :disabled="zoomPercent <= 50"
          :aria-label="`${labels.zoom} -`"
          @click="emit('updateZoomPercent', zoomPercent - 10)"
        >
          −
        </button>
        <input
          :value="zoomPercent"
          type="range"
          min="50"
          max="200"
          step="1"
          @input="emit('updateZoomPercent', Number(($event.target as HTMLInputElement).value))"
        />
        <button
          type="button"
          class="zoom-step"
          :disabled="zoomPercent >= 200"
          :aria-label="`${labels.zoom} +`"
          @click="emit('updateZoomPercent', zoomPercent + 10)"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.corner-controls {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.corner-button-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
}

.mini-tool-button {
  min-width: 0;
  height: 20px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 1px solid var(--ea-border-strong);
  border-radius: 3px;
  background: var(--ea-fill-input);
  color: var(--ea-fg-muted);
}

.mini-tool-button:disabled {
  opacity: 0.52;
  cursor: not-allowed;
}

.mini-tool-button svg {
  width: 12px;
  height: 12px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.mini-tool-button svg circle:last-child,
.mini-tool-button svg circle:nth-last-child(2) {
  fill: currentColor;
}

.mini-tool-button--text {
  font:
    700 9px/1 'Roboto Mono',
    Consolas,
    monospace;
}

.zoom-row {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.zoom-info,
.zoom-slider-row {
  display: flex;
  align-items: center;
}

.zoom-step {
  width: 12px;
  height: 12px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

.zoom-step:disabled {
  opacity: 0.35;
  cursor: default;
}

.zoom-info {
  justify-content: space-between;
  padding: 0 2px;
  color: var(--ea-fg-subtle);
  font:
    700 8px/1 'Roboto Mono',
    Consolas,
    monospace;
}

.zoom-info strong {
  color: var(--ea-gold);
  font-size: 9px;
}

.zoom-slider-row {
  gap: 4px;
  color: var(--ea-fg-muted);
  font-size: 11px;
  line-height: 1;
}

.zoom-slider-row input {
  min-width: 0;
  height: 2px;
  flex: 1 1 auto;
  margin: 0;
  accent-color: var(--ea-gold);
}
</style>
