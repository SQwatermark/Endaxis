<script setup lang="ts">
/**
 * Next 时间轴的实际战斗时间标尺与准备区边界。
 */
import { computed, onScopeDispose, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { PROJECT_FPS } from '../../../core/project/schema';
import { frameToTimelinePx, timelineTotalWidth } from '../timelineGeometry';
import {
  projectTimelineOperationMarkers,
  type TimelineOperationMarkerInput,
} from '../timelineOperationMarkers';
import { projectTimelineRulerTicks } from '../timelineRulerTicks';

const MIN_BATTLE_DURATION_FRAMES = PROJECT_FPS * 30;
const MAX_BATTLE_DURATION_FRAMES = PROJECT_FPS * 600;

const props = defineProps<{
  prepFrames: number;
  durationFrames: number;
  cursorFrame: number;
  pxPerFrame: number;
  snapFrames: number;
  operations: readonly TimelineOperationMarkerInput[];
  visibleLeftPx: number;
  visibleWidthPx: number;
}>();

const emit = defineEmits<{
  seek: [frame: number];
  setPrepFrames: [frames: number];
  setDurationFrames: [frames: number];
}>();
const { t } = useI18n({ useScope: 'global' });
const prepPreview = ref<number | null>(null);
const durationPreview = ref<number | null>(null);
const prepEditorOpen = ref(false);
const durationEditorOpen = ref(false);
const prepDraft = ref('');
const durationDraftSeconds = ref('');
let stopResize: (() => void) | null = null;
const activePrepFrames = computed(() => prepPreview.value ?? props.prepFrames);
const activeDurationFrames = computed(() => durationPreview.value ?? props.durationFrames);
const totalWidth = computed(() =>
  timelineTotalWidth(activePrepFrames.value, activeDurationFrames.value, props.pxPerFrame),
);
const prepWidth = computed(() => activePrepFrames.value * props.pxPerFrame);
const cursorLeft = computed(() =>
  frameToTimelinePx(props.cursorFrame, activePrepFrames.value, props.pxPerFrame),
);
const ticks = computed(() =>
  projectTimelineRulerTicks({
    prepFrames: activePrepFrames.value,
    durationFrames: activeDurationFrames.value,
    pxPerFrame: props.pxPerFrame,
    visibleLeftPx: props.visibleLeftPx,
    visibleWidthPx: props.visibleWidthPx,
  }),
);
const operationMarkers = computed(() =>
  projectTimelineOperationMarkers(props.operations, activePrepFrames.value, props.pxPerFrame),
);

function snapFrame(frame: number): number {
  const step = Math.max(1, props.snapFrames);
  return Math.round(frame / step) * step;
}

function beginResize(kind: 'prep' | 'duration', event: PointerEvent): void {
  if (event.button !== 0) return;
  event.preventDefault();
  event.stopPropagation();
  stopResize?.();
  const ruler = (event.currentTarget as HTMLElement).closest('.ruler-content') as HTMLElement;
  const move = (moveEvent: PointerEvent) => {
    const localPx = moveEvent.clientX - ruler.getBoundingClientRect().left;
    if (kind === 'prep') {
      prepPreview.value = Math.max(0, snapFrame(localPx / props.pxPerFrame));
    } else {
      durationPreview.value = Math.max(
        MIN_BATTLE_DURATION_FRAMES,
        Math.min(
          MAX_BATTLE_DURATION_FRAMES,
          snapFrame(localPx / props.pxPerFrame - activePrepFrames.value),
        ),
      );
    }
  };
  const finish = () => {
    const prep = prepPreview.value;
    const duration = durationPreview.value;
    prepPreview.value = null;
    durationPreview.value = null;
    window.removeEventListener('pointermove', move);
    window.removeEventListener('pointerup', finish);
    window.removeEventListener('pointercancel', finish);
    stopResize = null;
    if (kind === 'prep' && prep !== null) emit('setPrepFrames', prep);
    if (kind === 'duration' && duration !== null) emit('setDurationFrames', duration);
  };
  stopResize = finish;
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', finish);
  window.addEventListener('pointercancel', finish);
}

function openPrepEditor(): void {
  prepDraft.value = String(props.prepFrames);
  prepEditorOpen.value = true;
  durationEditorOpen.value = false;
}

function applyPrepDraft(): void {
  const frames = Number(prepDraft.value);
  prepEditorOpen.value = false;
  if (Number.isInteger(frames) && frames >= 0) emit('setPrepFrames', frames);
}

function openDurationEditor(): void {
  durationDraftSeconds.value = String(props.durationFrames / PROJECT_FPS);
  durationEditorOpen.value = true;
  prepEditorOpen.value = false;
}

function applyDurationDraft(): void {
  const seconds = Number(durationDraftSeconds.value);
  durationEditorOpen.value = false;
  const frames = Math.round(seconds * PROJECT_FPS);
  if (Number.isFinite(seconds) && frames > 0) emit('setDurationFrames', frames);
}

onScopeDispose(() => stopResize?.());

function seek(event: MouseEvent): void {
  const element = event.currentTarget as HTMLElement;
  const px = event.clientX - element.getBoundingClientRect().left;
  const actualFrame = Math.max(0, px / props.pxPerFrame - props.prepFrames);
  emit('seek', Math.max(0, Math.min(props.durationFrames, Math.round(actualFrame))));
}
</script>

<template>
  <div class="ruler-viewport">
    <div class="ruler-content" :style="{ width: `${totalWidth}px` }" @click="seek">
      <div class="prep-zone" :style="{ width: `${prepWidth}px` }"></div>
      <div class="operation-layer">
        <span
          v-for="operation in operationMarkers"
          :key="operation.id"
          class="key-cap"
          :class="[
            `key-cap--${operation.kind}`,
            { 'is-hold': operation.hold, 'is-perfect': operation.perfect },
          ]"
          :style="{
            left: `${operation.left}px`,
            top: `${operation.top}px`,
            width: operation.width === null ? 'auto' : `${operation.width}px`,
            height: `${operation.height}px`,
            fontSize: `${operation.fontSize}px`,
          }"
        >
          <span class="key-text">{{ operation.label }}</span>
        </span>
      </div>
      <div class="time-ruler-track" :title="t('timelineGrid.ruler.realTimeTitle')"></div>
      <span
        v-for="tick in ticks"
        :key="tick.key"
        class="tick"
        :class="`tick--${tick.type}`"
        :style="{ left: `${tick.left}px` }"
      >
        <span v-if="tick.label" class="tick-label">{{ tick.label }}</span>
      </span>
      <span
        class="axis-boundary axis-boundary--prep"
        :style="{ left: `${prepWidth}px` }"
        @pointerdown="beginResize('prep', $event)"
        @click.stop
      >
        <button
          type="button"
          :title="t('timelineGrid.prep.setDurationTitle')"
          @pointerdown.stop
          @click.stop="openPrepEditor"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v6l4 2"></path>
          </svg>
        </button>
      </span>
      <span
        class="axis-boundary axis-boundary--end"
        :style="{ left: `${totalWidth}px` }"
        @pointerdown="beginResize('duration', $event)"
        @click.stop
      >
        <button
          type="button"
          :title="t('timelineGrid.battle.setDurationTitle')"
          @pointerdown.stop
          @click.stop="openDurationEditor"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9"></circle>
            <path d="M12 7v6l4 2"></path>
          </svg>
        </button>
        <b>{{ Math.round(activeDurationFrames / PROJECT_FPS) }}s</b>
      </span>
      <form
        v-if="prepEditorOpen"
        class="axis-editor"
        :style="{ left: `${prepWidth + 8}px` }"
        @submit.prevent="applyPrepDraft"
        @pointerdown.stop
      >
        <input v-model="prepDraft" type="number" min="0" step="1" @blur="applyPrepDraft" />
        <span>f</span>
      </form>
      <form
        v-if="durationEditorOpen"
        class="axis-editor axis-editor--end"
        :style="{ left: `${Math.max(8, totalWidth - 88)}px` }"
        @submit.prevent="applyDurationDraft"
        @pointerdown.stop
      >
        <input
          v-model="durationDraftSeconds"
          type="number"
          min="30"
          max="600"
          step="1"
          @blur="applyDurationDraft"
        />
        <span>s</span>
      </form>
      <span class="cursor" :style="{ left: `${cursorLeft}px` }"></span>
    </div>
  </div>
</template>

<style scoped>
.ruler-viewport {
  width: 100%;
  height: 76px;
  overflow: hidden;
  border-bottom: 1px solid var(--ea-border);
  background: var(--ea-workbench-header);
}

.ruler-content {
  position: relative;
  height: 100%;
  min-width: 100%;
  cursor: default;
}

.prep-zone {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--ea-prep-fill);
}

.operation-layer {
  position: absolute;
  z-index: 10;
  top: 4px;
  left: 0;
  width: 100%;
  height: 50px;
  pointer-events: none;
}

.key-cap {
  position: absolute;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid var(--ea-keycap-border, #666);
  border-radius: 2px;
  background: var(--ea-keycap-bg, #444);
  color: var(--ea-fg, #fff);
  box-shadow: 0 1px 1px var(--ea-shadow, rgb(0 0 0 / 50%));
  font-family: Consolas, Monaco, monospace;
  font-weight: 700;
  white-space: nowrap;
  opacity: 0.95;
  pointer-events: none;
  transition:
    top 0.2s,
    height 0.2s;
}

.key-cap--skill {
  border-color: var(--ea-keycap-skill-border, #888);
  background: var(--ea-keycap-skill-bg, #3a3a3a);
  width: 20px !important;
}

.key-cap--combo {
  z-index: 2;
  border-color: var(--ea-gold);
  background: color-mix(in srgb, var(--ea-gold) 20%, transparent);
  color: var(--ea-gold);
  width: 20px !important;
}

.key-cap--combo.is-perfect {
  border-color: #fff2a8;
  background: rgb(255 236 122 / 36%);
  color: #fff7cf;
  box-shadow:
    0 0 0 1px rgb(255 242 168 / 85%),
    0 0 12px color-mix(in srgb, var(--ea-gold) 85%, transparent);
  animation: perfect-operation-pulse 1.15s ease-in-out infinite;
}

.key-cap--switch {
  border-color: #d3adff;
  background: rgb(211 173 255 / 20%);
  color: #d3adff;
  width: 28px !important;
}

.key-cap.is-hold {
  justify-content: center;
  width: auto;
  padding: 0 4px;
  border-color: var(--ea-keycap-skill-border, #888);
  background: var(--ea-keycap-skill-bg, #3a3a3a);
}

.key-cap.is-hold .key-text {
  margin: 0;
  padding: 0;
  background: transparent;
  color: var(--ea-fg, #fff);
  font-size: 9px;
}

@keyframes perfect-operation-pulse {
  50% {
    filter: brightness(1.35);
  }
}

@media (prefers-reduced-motion: reduce) {
  .key-cap--combo.is-perfect {
    animation: none;
  }
}

.time-ruler-track {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 20px;
}

.tick {
  position: absolute;
  bottom: 0;
  height: 10px;
  width: 1px;
  background: var(--ea-mark);
  transform: translateX(-0.5px);
  pointer-events: none;
}

.tick--major,
.tick--majorDim {
  height: 17px;
  background: var(--ea-mark-strong);
}

.tick--majorDim {
  opacity: 0.55;
}

.tick--minor {
  height: 10px;
  background: var(--ea-mark-major);
}

.tick--frame {
  height: 5px;
  opacity: 0.65;
}

.tick-label {
  position: absolute;
  left: 3px;
  bottom: 1px;
  color: var(--ea-fg-muted, #888);
  font:
    10px/1 'Roboto Mono',
    Consolas,
    monospace;
  white-space: nowrap;
}

.tick--major .tick-label {
  color: var(--ea-fg, #e0e0e0);
  font-size: 11px;
  font-weight: 700;
}

.tick--majorDim .tick-label {
  display: none;
}

.tick--minor .tick-label,
.tick--frame .tick-label {
  color: var(--ea-fg-faint, #666);
  font-size: 8px;
  font-style: italic;
}

.cursor {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  pointer-events: none;
}

.axis-boundary {
  position: absolute;
  z-index: 5;
  top: 0;
  bottom: 0;
  width: 14px;
  margin-left: -7px;
  cursor: ew-resize;
}

.axis-boundary::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 6px;
  width: 2px;
  background: var(--ea-mark-strong);
}

.axis-boundary button {
  position: absolute;
  top: 3px;
  left: 11px;
  width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  padding: 0;
  background: var(--ea-workbench-panel);
  color: var(--ea-fg-secondary);
  cursor: pointer;
}

.axis-boundary--end button {
  left: -21px;
}

.axis-boundary b {
  position: absolute;
  top: 6px;
  left: -52px;
  color: var(--ea-fg-secondary);
  font:
    10px/16px Consolas,
    monospace;
  white-space: nowrap;
}

.axis-editor {
  position: absolute;
  z-index: 8;
  top: 28px;
  display: flex;
  align-items: center;
  border: 1px solid var(--ea-gold);
  background: var(--ea-workbench-panel);
  box-shadow: 0 3px 10px var(--ea-shadow);
}

.axis-editor input {
  width: 64px;
  border: 0;
  padding: 4px 5px;
  background: transparent;
  color: var(--ea-fg);
  outline: 0;
}

.axis-editor span {
  padding-right: 5px;
  color: var(--ea-fg-muted);
  font:
    10px Consolas,
    monospace;
}

.cursor {
  z-index: 2;
  background: var(--ea-fg);
  box-shadow: 0 0 4px rgb(255 255 255 / 35%);
}
</style>
