<script setup lang="ts">
/**
 * 干员轨道上的终结技能量曲线（抄旧版 GaugeOverlay）。
 * 曲线沿整条轨道从底部向上画，满能量时在顶部显示高亮线。
 */
import { computed } from 'vue';
import type { OperatorUltimateEnergyCurve } from '../../../core/projection/resourceCurves';

const props = defineProps<{
  curve: OperatorUltimateEnergyCurve | null;
  color: string;
  prepFrames: number;
  durationFrames: number;
  pxPerFrame: number;
  height: number;
}>();

const ROW_BASE_Y = 0;

const gaugePoints = computed(() => {
  const curve = props.curve;
  if (curve === null || curve.maxValue <= 0) return [];
  return curve.points.map(point => ({
    frame: point.frame,
    ratio: Math.min(point.value / curve.maxValue, 1),
    source: point.source,
  }));
});

const pathData = computed(() => {
  const points = gaugePoints.value;
  if (points.length === 0) return '';
  return points
    .map(point => {
      const x = (point.frame + props.prepFrames) * props.pxPerFrame;
      const y = props.height - ROW_BASE_Y - point.ratio * props.height;
      return `${x},${y}`;
    })
    .join(' ');
});

const areaData = computed(() => {
  const points = gaugePoints.value;
  if (points.length === 0) return '';
  const lastPoint = points[points.length - 1]!;
  const lastX = (lastPoint.frame + props.prepFrames) * props.pxPerFrame;
  return `0,${props.height} ${pathData.value} ${lastX},${props.height}`;
});

const fullSegments = computed(() => {
  const segments: { x1: number; x2: number }[] = [];
  const points = gaugePoints.value;
  for (let index = 0; index < points.length - 1; index += 1) {
    if (points[index]!.ratio >= 1 && points[index + 1]!.ratio >= 1) {
      const x1 = (points[index]!.frame + props.prepFrames) * props.pxPerFrame;
      const x2 = (points[index + 1]!.frame + props.prepFrames) * props.pxPerFrame;
      if (x2 > x1) segments.push({ x1, x2 });
    }
  }
  return segments;
});
</script>

<template>
  <div class="track-gauge">
    <svg
      class="track-gauge-svg"
      :height="height"
      :width="(prepFrames + durationFrames) * pxPerFrame"
    >
      <defs>
        <linearGradient
          :id="`gauge-fill-${curve?.operatorId ?? 'none'}`"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" :stop-color="color" stop-opacity="0.25" />
          <stop offset="100%" :stop-color="color" stop-opacity="0" />
        </linearGradient>
      </defs>
      <polygon
        v-if="areaData"
        :points="areaData"
        :fill="`url(#gauge-fill-${curve?.operatorId ?? 'none'})`"
      />
      <polyline
        v-if="pathData"
        :points="pathData"
        fill="none"
        :stroke="color"
        stroke-width="1"
        stroke-opacity="0.5"
        stroke-linejoin="round"
        stroke-linecap="round"
        class="no-events"
      />
      <line
        v-for="(seg, index) in fullSegments"
        :key="`full-${index}`"
        :x1="seg.x1"
        :y1="2"
        :x2="seg.x2"
        :y2="2"
        :stroke="color"
        class="full-gauge-line no-events"
      />
    </svg>
  </div>
</template>

<style scoped>
.track-gauge {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 1;
}

.track-gauge-svg {
  display: block;
  overflow: visible;
}

.no-events {
  pointer-events: none;
}

.full-gauge-line {
  stroke-width: 2;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px currentColor);
  animation: gauge-glow 2s ease-in-out infinite alternate;
}

@keyframes gauge-glow {
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style>
