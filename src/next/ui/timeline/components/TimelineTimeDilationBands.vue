<script setup lang="ts">
/**
 * 在单条干员轨道上显示模拟产生的时间膨胀区间。
 * 全局区间出现在每条轨道，实体区间只显示在其目标轨道；组件不解释倍率规则。
 */
import { computed } from 'vue';
import type { TimelineTimeDilationBand } from '../timelineDisplayTime';
import { frameToTimelinePx } from '../timelineGeometry';

const props = defineProps<{
  bands: readonly TimelineTimeDilationBand[];
  operatorId: string | null;
  prepFrames: number;
  pxPerFrame: number;
}>();

const visibleBands = computed(() =>
  props.bands
    .filter(
      band =>
        band.kind === 'global' || (props.operatorId !== null && band.targetId === props.operatorId),
    )
    .map(band => ({
      ...band,
      left: frameToTimelinePx(band.startFrame, props.prepFrames, props.pxPerFrame),
      width: Math.max(1, (band.endFrame - band.startFrame) * props.pxPerFrame),
    })),
);
</script>

<template>
  <div class="time-dilation-bands" aria-hidden="true">
    <span
      v-for="band in visibleBands"
      :key="`${band.kind}:${band.instanceId}`"
      class="time-dilation-band"
      :class="`time-dilation-band--${band.kind}`"
      :style="{ left: `${band.left}px`, width: `${band.width}px` }"
    ></span>
  </div>
</template>

<style scoped>
.time-dilation-bands {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.time-dilation-band {
  position: absolute;
  top: 0;
  bottom: 0;
  box-sizing: border-box;
  border-inline: 1px solid color-mix(in srgb, var(--ea-gold) 32%, transparent);
  background: repeating-linear-gradient(
    135deg,
    color-mix(in srgb, var(--ea-gold) 7%, transparent) 0 4px,
    transparent 4px 9px
  );
}

.time-dilation-band--entity {
  top: 53px;
  bottom: auto;
  height: 54px;
  border-color: color-mix(in srgb, var(--ea-fg-secondary) 28%, transparent);
  background: color-mix(in srgb, var(--ea-fg-secondary) 5%, transparent);
}
</style>
