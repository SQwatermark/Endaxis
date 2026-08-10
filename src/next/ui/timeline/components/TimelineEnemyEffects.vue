<script setup lang="ts">
/**
 * 敌人效果面板：生命读数 + 元素附着段 + 爆发/反应标记。
 * 坐标与资源曲线同一体系（准备区偏移 + 每帧像素 + 轨道头宽度，跟随时间轴滚动）。
 */
import { computed } from 'vue';
import type { EnemyEffectViz } from '../../../core/projection/enemyEffectViz';

const props = defineProps<{
  viz: EnemyEffectViz;
  timelineWidth: number;
  prepFrames: number;
  pxPerFrame: number;
  trackHeaderWidth: number;
  scrollLeft: number;
  /** 敌人生命读数。 */
  maxHealth: number;
  remainingHealth: number;
  labels: {
    enemyHp: string;
    burst: string;
    reaction: string;
    reactionConsumed: string;
  };
}>();

const ELEMENT_COLORS: Readonly<Record<string, string>> = {
  heat: '#ff5a5f',
  electric: '#ffec3d',
  cryo: '#69c0ff',
  nature: '#52c41a',
};

const REACTION_COLORS: Readonly<Record<string, string>> = {
  electrification: '#f0c23c',
  corrosion: '#b37feb',
};

const MARKER_ROW_TOP = 28;
const SEGMENT_ROW_TOP = 4;
const MARKER_RADIUS = 4;

function pointX(frame: number): number {
  return props.trackHeaderWidth + (frame + props.prepFrames) * props.pxPerFrame - props.scrollLeft;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

const width = computed(() => Math.max(1, props.trackHeaderWidth + props.timelineWidth));

const hpRatio = computed(() => {
  if (props.maxHealth <= 0) return 0;
  return clamp(props.remainingHealth / props.maxHealth, 0, 1);
});

const segments = computed(() =>
  props.viz.segments.map(segment => {
    const left = pointX(segment.startFrame);
    const right = pointX(segment.endFrame);
    return {
      key: `${segment.element}:${segment.startFrame}`,
      element: segment.element,
      color: ELEMENT_COLORS[segment.element] ?? '#8c8c8c',
      left,
      widthPx: Math.max(0, right - left),
      layers: segment.layers,
    };
  }),
);

const markers = computed(() =>
  props.viz.markers.map(marker => {
    const color =
      marker.kind === 'burst' ? '#f5222d' : (REACTION_COLORS[marker.reaction ?? ''] ?? '#f0c23c');
    const title =
      marker.kind === 'burst'
        ? `${props.labels.burst} ${marker.burstType ?? ''}`
        : marker.kind === 'reactionApplied'
          ? `${props.labels.reaction} ${marker.reaction ?? ''} Lv${marker.level ?? 0}`
          : `${props.labels.reactionConsumed} ${marker.reaction ?? ''}`;
    return {
      key: `${marker.kind}:${marker.frame}:${marker.reaction ?? marker.burstType ?? ''}`,
      color,
      x: clamp(pointX(marker.frame), MARKER_RADIUS, width.value - MARKER_RADIUS),
      title,
    };
  }),
);

function formatNumber(value: number): string {
  return String(Math.round(value * 100) / 100);
}
</script>

<template>
  <div class="enemy-effects" :style="{ width: `${width}px` }">
    <div class="hp-row">
      <span class="hp-label">{{ labels.enemyHp }}</span>
      <div class="hp-bar">
        <div class="hp-bar-fill" :style="{ width: `${hpRatio * 100}%` }"></div>
      </div>
      <span class="hp-value">
        {{ formatNumber(remainingHealth).toLocaleString() }}/{{
          formatNumber(maxHealth).toLocaleString()
        }}
      </span>
    </div>
    <div class="effect-canvas" :style="{ width: `${width}px` }">
      <div
        v-for="segment in segments"
        :key="segment.key"
        class="attachment-segment"
        :style="{
          left: `${segment.left}px`,
          width: `${Math.max(2, segment.widthPx)}px`,
          top: `${SEGMENT_ROW_TOP}px`,
          background: segment.color,
        }"
        :title="`${segment.element} · ${segment.layers} 层`"
      >
        <span v-if="segment.layers > 1" class="segment-layers">{{ segment.layers }}</span>
      </div>
      <span
        v-for="marker in markers"
        :key="marker.key"
        class="effect-marker"
        :style="{
          left: `${marker.x}px`,
          top: `${MARKER_ROW_TOP}px`,
          background: marker.color,
        }"
        :title="marker.title"
      ></span>
    </div>
  </div>
</template>

<style scoped>
.enemy-effects {
  min-width: 1px;
  color: var(--ea-fg);
  font: 11px/1.4 var(--ea-font-family, 'Segoe UI', sans-serif);
  background: var(--ea-surface, #17191c);
}

.hp-row {
  height: 26px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  border-bottom: 1px solid var(--ea-border, rgb(255 255 255 / 10%));
}

.hp-label {
  color: var(--ea-text-muted, rgb(255 255 255 / 55%));
  font-size: 10px;
  white-space: nowrap;
}

.hp-bar {
  flex: 1;
  height: 6px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border, rgb(255 255 255 / 16%));
  border-radius: 3px;
  background: rgb(255 255 255 / 5%);
  overflow: hidden;
}

.hp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #a61d24, #e0492f);
  transition: width 0.1s linear;
}

.hp-value {
  color: var(--ea-fg-secondary, rgb(215 218 222 / 90%));
  font-family: Consolas, monospace;
  font-size: 11px;
  white-space: nowrap;
}

.effect-canvas {
  position: relative;
  height: 52px;
  overflow: hidden;
}

.attachment-segment {
  position: absolute;
  height: 14px;
  border-radius: 2px;
  opacity: 0.75;
}

.segment-layers {
  position: absolute;
  right: 3px;
  top: 0;
  color: #1a1b1e;
  font:
    800 9px/14px Consolas,
    monospace;
}

.effect-marker {
  position: absolute;
  width: 8px;
  height: 8px;
  box-sizing: border-box;
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 4px currentColor;
  cursor: default;
}
</style>
