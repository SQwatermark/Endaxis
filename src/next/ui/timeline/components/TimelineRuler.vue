<script setup lang="ts">
/**
 * Next 时间轴的双层标尺与准备区边界。
 * GAME 行显示项目逻辑帧，REAL 行显示实际战斗帧；点击位置会换算回逻辑帧。
 */
import { computed } from 'vue';
import { frameToTimelinePx, timelineTotalWidth } from '../timelineGeometry';
import type { TimelineDisplayTime } from '../timelineDisplayTime';

const props = defineProps<{
  prepFrames: number;
  durationFrames: number;
  cursorFrame: number;
  pxPerFrame: number;
  displayTime: TimelineDisplayTime;
}>();

const emit = defineEmits<{ seek: [frame: number] }>();
const totalWidth = computed(() =>
  timelineTotalWidth(props.prepFrames, props.displayTime.actualDurationFrames, props.pxPerFrame),
);
const prepWidth = computed(() => props.prepFrames * props.pxPerFrame);
const cursorLeft = computed(() =>
  frameToTimelinePx(
    props.displayTime.toActualFrame(props.cursorFrame),
    props.prepFrames,
    props.pxPerFrame,
  ),
);
interface RulerTick {
  readonly key: string;
  readonly left: number;
  readonly major: boolean;
  readonly label: string;
  readonly row: 'game' | 'real';
}

function createTicks(
  row: RulerTick['row'],
  durationFrames: number,
  projectFrame: (frame: number) => number,
): RulerTick[] {
  const interval = 30;
  const first = -Math.ceil(props.prepFrames / interval) * interval;
  const result: RulerTick[] = [];
  for (let frame = first; frame <= durationFrames; frame += interval) {
    if (frame < -props.prepFrames) continue;
    const major = frame % 150 === 0;
    const displayFrame = frame < 0 ? frame : projectFrame(frame);
    result.push({
      key: `${row}:${frame}`,
      left: frameToTimelinePx(displayFrame, props.prepFrames, props.pxPerFrame),
      major,
      label: major ? `${frame / 30}s` : '',
      row,
    });
  }
  return result;
}

const ticks = computed(() => {
  const gameTicks = createTicks('game', props.durationFrames, frame =>
    props.displayTime.toActualFrame(frame),
  );
  const realTicks = createTicks('real', props.displayTime.actualDurationFrames, frame => frame);
  return [...gameTicks, ...realTicks];
});

function seek(event: MouseEvent): void {
  const element = event.currentTarget as HTMLElement;
  const px = event.clientX - element.getBoundingClientRect().left;
  const actualFrame = Math.max(0, px / props.pxPerFrame - props.prepFrames);
  emit(
    'seek',
    Math.max(
      0,
      Math.min(props.durationFrames, Math.round(props.displayTime.toLogicalFrame(actualFrame))),
    ),
  );
}
</script>

<template>
  <div class="ruler-viewport">
    <div class="ruler-content" :style="{ width: `${totalWidth}px` }" @click="seek">
      <div class="prep-zone" :style="{ width: `${prepWidth}px` }"></div>
      <div class="key-row"></div>
      <div class="time-row time-row--game">
        <span class="row-label">GAME</span>
      </div>
      <div class="time-row time-row--real">
        <span class="row-label">REAL</span>
      </div>
      <span
        v-for="tick in ticks"
        :key="tick.key"
        class="tick"
        :class="[`tick--${tick.row}`, { 'tick--major': tick.major }]"
        :style="{ left: `${tick.left}px` }"
      >
        <span v-if="tick.label" class="tick-label">{{ tick.label }}</span>
      </span>
      <span class="battle-start" :style="{ left: `${prepWidth}px` }"></span>
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

.key-row {
  position: absolute;
  inset: 0 0 auto;
  height: 24px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.time-row {
  position: absolute;
  left: 0;
  right: 0;
  height: 25px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.time-row--game {
  top: 24px;
}

.time-row--real {
  top: 49px;
}

.row-label {
  position: sticky;
  left: 4px;
  color: var(--ea-fg-subtle);
  font:
    8px/24px Consolas,
    monospace;
}

.tick {
  position: absolute;
  height: 10px;
  width: 1px;
  background: var(--ea-mark);
  pointer-events: none;
}

.tick--game {
  top: 39px;
}

.tick--real {
  top: 64px;
}

.tick--major {
  height: 25px;
  background: var(--ea-mark-major);
}

.tick--game.tick--major {
  top: 24px;
}

.tick--real.tick--major {
  top: 49px;
}

.tick-label {
  position: absolute;
  left: 4px;
  top: 0;
  color: var(--ea-fg-secondary);
  font:
    11px/18px Consolas,
    monospace;
  white-space: nowrap;
}

.battle-start,
.cursor {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  pointer-events: none;
}

.battle-start {
  background: var(--ea-mark-strong);
}

.cursor {
  z-index: 2;
  background: var(--ea-fg);
  box-shadow: 0 0 4px rgb(255 255 255 / 35%);
}
</style>
