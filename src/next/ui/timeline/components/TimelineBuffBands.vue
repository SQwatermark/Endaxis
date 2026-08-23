<script setup lang="ts">
/** 旧版 TimelineBuffLayer 的 Next 只读版本：18px 图标、层数角标和条纹持续条。 */
import { computed } from 'vue';
import type { PositionedBuffTimelineSegment } from '../../../core/projection/buffTimelineViz';

const props = defineProps<{
  segments: readonly PositionedBuffTimelineSegment[];
  prepFrames: number;
  pxPerFrame: number;
  placement?: 'upper' | 'lower';
}>();

const ICON_SIZE = 18;
const BAR_GAP = 2;
const LANE_PITCH = 22;
const LOWER_EDGE = 110;
const UPPER_EDGE = 31;

const items = computed(() =>
  props.segments.map(segment => {
    const left = (segment.startFrame + props.prepFrames) * props.pxPerFrame;
    const right = (segment.endFrame + props.prepFrames) * props.pxPerFrame;
    return {
      ...segment,
      key: `${segment.targetId}:${segment.buffId}:${segment.instanceId}:${segment.startFrame}`,
      left,
      top:
        props.placement === 'upper'
          ? UPPER_EDGE - segment.lane * LANE_PITCH
          : LOWER_EDGE + segment.lane * LANE_PITCH,
      width: Math.max(0, right - left - ICON_SIZE - BAR_GAP * 2),
      icon: segment.iconPath ?? (segment.iconId ? `/icons/${segment.iconId}.webp` : null),
    };
  }),
);
</script>

<template>
  <div v-if="items.length > 0" class="timeline-buff-bands" aria-label="Buff timeline">
    <div
      v-for="item in items"
      :key="item.key"
      class="timeline-buff-item"
      :style="{ left: `${item.left}px`, top: `${item.top}px` }"
    >
      <span class="timeline-buff-icon-box" :title="item.buffId">
        <img v-if="item.icon" :src="item.icon" class="timeline-buff-icon" alt="" />
        <span v-else class="timeline-buff-fallback">+</span>
        <span v-if="item.layers > 1" class="timeline-buff-stacks">{{ item.layers }}</span>
      </span>
      <span
        v-if="item.width > 0"
        class="timeline-buff-duration-bar"
        :style="{ width: `${item.width}px` }"
        :title="item.buffId"
      >
        <span class="timeline-buff-striped-bg"></span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.timeline-buff-bands {
  position: absolute;
  inset: 0;
  z-index: 8;
  overflow: hidden;
  pointer-events: none;
}

.timeline-buff-item {
  position: absolute;
  display: flex;
  align-items: center;
  white-space: nowrap;
  pointer-events: none;
}

.timeline-buff-icon-box {
  position: relative;
  z-index: 2;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  background-color: var(--ea-keycap-skill-bg, #333);
  border: 1px solid var(--ea-keycap-skill-border, #999);
  pointer-events: auto;
  transition:
    transform 0.12s ease,
    filter 0.12s ease,
    border-color 0.12s ease,
    box-shadow 0.12s ease;
}

.timeline-buff-icon-box:hover {
  z-index: 12;
  transform: scale(1.18);
  filter: brightness(1.18);
  border-color: rgb(255 255 255 / 95%);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 22%),
    0 4px 12px rgb(0 0 0 / 46%);
}

.timeline-buff-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.timeline-buff-fallback {
  color: #eef6ff;
  font-size: 10px;
  font-weight: 700;
}

.timeline-buff-stacks {
  position: absolute;
  right: -2px;
  bottom: -2px;
  padding: 0 2px;
  border-radius: 2px;
  background: rgb(0 0 0 / 80%);
  color: var(--ea-gold);
  font-size: 8px;
  line-height: 1;
}

.timeline-buff-duration-bar {
  position: relative;
  z-index: 1;
  height: 16px;
  margin-left: 2px;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 2px;
  background: var(--ea-mark-soft, #596a7a);
  box-shadow: 0 1px 2px rgb(0 0 0 / 50%);
  pointer-events: auto;
}

.timeline-buff-duration-bar:hover {
  filter: brightness(1.16) saturate(1.08);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 18%),
    0 2px 8px rgb(0 0 0 / 50%);
}

.timeline-buff-striped-bg {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    45deg,
    rgb(255 255 255 / 20%),
    rgb(255 255 255 / 20%) 2px,
    transparent 2px,
    transparent 6px
  );
}
</style>
