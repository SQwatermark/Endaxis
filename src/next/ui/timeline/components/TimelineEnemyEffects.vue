<script setup lang="ts">
/**
 * 敌人效果面板（对齐旧版 ResourceMonitor 的敌人状态区样式）：
 * 附着 = 元素图标框 + 层数角标 + 45 度条纹时长条；爆发/反应 = 图标标记。
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
  labels: {
    burst: string;
    reaction: string;
    reactionConsumed: string;
  };
}>();

const ICON_SIZE = 20;
const ICON_TOP = 2;
const MARKER_TOP = 3;

const ELEMENT_ICONS: Readonly<Record<string, string>> = {
  heat: '/icons/icon_element_heat.webp',
  electric: '/icons/icon_element_electric.webp',
  cryo: '/icons/icon_element_cryo.webp',
  nature: '/icons/icon_element_nature.webp',
};

const BURST_ICONS: Readonly<Record<string, string>> = {
  Fire: '/icons/icon_burst_fusion_fire.webp',
  Pulse: '/icons/icon_burst_fusion_pulse.webp',
  Nature: '/icons/icon_burst_fusion_nature.webp',
  Cryst: '/icons/icon_element_cryo.webp',
};

const REACTION_ICONS: Readonly<Record<string, string>> = {
  electrification: '/icons/icon_battle_debuff_conduct.webp',
  corrosion: '/icons/icon_battle_debuff_corrupt.webp',
};

function pointX(frame: number): number {
  return props.trackHeaderWidth + (frame + props.prepFrames) * props.pxPerFrame - props.scrollLeft;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

const width = computed(() => Math.max(1, props.trackHeaderWidth + props.timelineWidth));

/** 附着段：图标 + 层数 + 时长条，整体从段起点横向铺开。 */
const segments = computed(() =>
  props.viz.segments.map(segment => {
    const left = pointX(segment.startFrame);
    const right = pointX(segment.endFrame);
    return {
      key: `${segment.element}:${segment.startFrame}`,
      element: segment.element,
      icon: ELEMENT_ICONS[segment.element] ?? '/icons/default_icon.webp',
      left,
      barWidthPx: Math.max(0, right - left - ICON_SIZE - 2),
      layers: segment.layers,
    };
  }),
);

/** 爆发/反应标记：小图标框，hover 显示说明。 */
const markers = computed(() =>
  props.viz.markers.map(marker => {
    const icon =
      marker.kind === 'burst'
        ? (BURST_ICONS[marker.burstType ?? ''] ?? '/icons/default_icon.webp')
        : (REACTION_ICONS[marker.reaction ?? ''] ?? '/icons/default_icon.webp');
    const title =
      marker.kind === 'burst'
        ? `${props.labels.burst} ${marker.burstType ?? ''}`
        : marker.kind === 'reactionApplied'
          ? `${props.labels.reaction} ${marker.reaction ?? ''} Lv${marker.level ?? 0}`
          : `${props.labels.reactionConsumed} ${marker.reaction ?? ''}`;
    return {
      key: `${marker.kind}:${marker.frame}:${marker.reaction ?? marker.burstType ?? ''}`,
      icon,
      x: clamp(pointX(marker.frame) - ICON_SIZE / 2, 0, width.value - ICON_SIZE),
      title,
    };
  }),
);
</script>

<template>
  <div class="enemy-effects" :style="{ width: `${width}px` }">
    <div v-if="segments.length === 0 && markers.length === 0" class="enemy-effects__empty">—</div>
    <template v-else>
      <div
        v-for="segment in segments"
        :key="segment.key"
        class="attachment-item"
        :style="{ left: `${segment.left}px`, top: `${ICON_TOP}px` }"
        :title="`${segment.element} · ${segment.layers} 层`"
      >
        <span class="anomaly-icon-box">
          <img :src="segment.icon" class="anomaly-icon" alt="" />
          <span v-if="segment.layers > 1" class="anomaly-stacks">{{ segment.layers }}</span>
        </span>
        <span
          v-if="segment.barWidthPx > 0"
          class="anomaly-duration-bar"
          :style="{ width: `${segment.barWidthPx}px` }"
        >
          <span class="striped-bg"></span>
        </span>
      </div>
      <span
        v-for="marker in markers"
        :key="marker.key"
        class="effect-marker"
        :style="{ left: `${marker.x}px`, top: `${MARKER_TOP}px` }"
        :title="marker.title"
      >
        <img :src="marker.icon" class="marker-icon" alt="" />
      </span>
    </template>
  </div>
</template>

<style scoped>
.enemy-effects {
  position: relative;
  min-width: 1px;
  height: 24px;
  overflow: hidden;
  color: var(--ea-fg);
  background: var(--ea-surface, #17191c);
}

.enemy-effects__empty {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--ea-text-muted, rgb(255 255 255 / 32%));
  font-size: 11px;
}

.attachment-item {
  position: absolute;
  display: flex;
  align-items: center;
}

.anomaly-icon-box {
  position: relative;
  z-index: 10;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ea-keycap-skill-bg, #333);
  border: 1px solid var(--ea-keycap-skill-border, #999);
  cursor: default;
  transition:
    filter 0.12s ease,
    border-color 0.12s ease,
    box-shadow 0.12s ease;
}

.anomaly-icon-box:hover {
  filter: brightness(1.18);
  border-color: rgb(255 255 255 / 95%);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 22%),
    0 4px 12px rgb(0 0 0 / 46%);
}

.anomaly-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.anomaly-stacks {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: rgb(0 0 0 / 80%);
  color: var(--ea-gold);
  font-size: 8px;
  line-height: 1;
  padding: 0 2px;
  border-radius: 2px;
}

.anomaly-duration-bar {
  position: relative;
  z-index: 1;
  height: 16px;
  margin-left: 2px;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 50%);
}

.striped-bg {
  position: absolute;
  inset: 0;
  border-radius: 2px;
  background: repeating-linear-gradient(
    45deg,
    rgb(255 255 255 / 20%),
    rgb(255 255 255 / 20%) 2px,
    transparent 2px,
    transparent 6px
  );
}

.effect-marker {
  position: absolute;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ea-keycap-skill-bg, #333);
  border: 1px solid var(--ea-keycap-skill-border, #999);
  cursor: default;
  transition:
    filter 0.12s ease,
    border-color 0.12s ease;
}

.effect-marker:hover {
  filter: brightness(1.18);
  border-color: rgb(255 255 255 / 95%);
}

.marker-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
