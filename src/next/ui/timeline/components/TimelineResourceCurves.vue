<script setup lang="ts">
/**
 * 时间轴下方资源曲线的展示组件（对齐旧版 ResourceMonitor 的坐标与画法）。
 *
 * 只画"全队 SP、敌人生命、失衡"三类曲线；各干员终结技能量画在各自轨道上，不在这里。
 * 横轴坐标和时间轴共用同一换算（准备区偏移 + 每帧像素），并跟随时间轴横向滚动，
 * 保证曲线和上方标尺、技能块位置一一对齐。每帧自动回复不单独标点。
 */
import { computed } from 'vue';
import type { SharedSpCurve } from '../../../core/projection/resourceCurves';
import type { EnemyHealthCurve } from '../../../core/projection/enemyHealthCurves';
import type { PoiseCurve } from '../../../core/projection/poiseCurves';

const props = defineProps<{
  spCurve: SharedSpCurve;
  timelineWidth: number;
  durationFrames: number;
  prepFrames: number;
  pxPerFrame: number;
  /** 时间轴内容区左侧轨道头宽度；曲线从这里开始画，和标尺对齐。 */
  trackHeaderWidth: number;
  /** 时间轴当前的横向滚动距离；曲线按它平移，跟着时间轴一起滚。 */
  scrollLeft: number;
  enemyHealthCurve?: EnemyHealthCurve | null;
  poiseCurve?: PoiseCurve | null;
  enemyHealthLabel?: string;
  poiseLabel?: string;
}>();

const ROW_HEIGHT = 56;
const CHART_TOP = 8;
const CHART_BOTTOM = 8;
const POINT_RADIUS = 2.5;
/** 网格线间隔：5 秒 = 150 帧。 */
const GRID_LINE_FRAME_STEP = 150;

interface ResourceCurveRow {
  readonly key: string;
  readonly label: string;
  readonly kind: 'sp' | 'enemyHealth' | 'poise';
  readonly maxValue: number;
  readonly points: readonly ResourceCurvePointView[];
}

interface ResourceCurvePointView {
  readonly frame: number;
  readonly value: number;
  readonly source?: 'autoRecovery';
}

const width = computed(() => Math.max(1, props.trackHeaderWidth + props.timelineWidth));
const duration = computed(() => Math.max(0, props.durationFrames));
const rows = computed<readonly ResourceCurveRow[]>(() => [
  {
    key: 'sp',
    label: 'SP',
    kind: 'sp',
    maxValue: props.spCurve.maxValue,
    points: props.spCurve.points,
  },
  ...(props.enemyHealthCurve === null || props.enemyHealthCurve === undefined
    ? []
    : [
        {
          key: 'enemyHealth',
          label: props.enemyHealthLabel ?? 'HP',
          kind: 'enemyHealth' as const,
          maxValue: props.enemyHealthCurve.maxValue,
          points: props.enemyHealthCurve.points,
        },
      ]),
  ...(props.poiseCurve === null || props.poiseCurve === undefined
    ? []
    : [
        {
          key: 'poise',
          label: props.poiseLabel ?? 'POISE',
          kind: 'poise' as const,
          maxValue: props.poiseCurve.maxValue,
          points: props.poiseCurve.points,
        },
      ]),
]);
const visibleRows = computed(() => rows.value.filter(row => row.points.length > 0));
const hasCurves = computed(() => visibleRows.value.length > 0);

/** 与时间轴同坐标系的横坐标：轨道头 + 帧位置，再减去当前滚动距离。 */
function pointX(frame: number): number {
  return props.trackHeaderWidth + (frame + props.prepFrames) * props.pxPerFrame - props.scrollLeft;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function pointY(value: number, maxValue: number): number {
  const chartHeight = ROW_HEIGHT - CHART_TOP - CHART_BOTTOM;
  const upperBound = maxValue > 0 ? maxValue : 1;
  const ratio = clamp(value / upperBound, 0, 1);
  return CHART_TOP + (1 - ratio) * chartHeight;
}

/** 稀疏点描述的是离散状态，两个变化点之间应保持前一个值。 */
function stepPath(row: ResourceCurveRow): string {
  const [first, ...rest] = row.points;
  if (first === undefined) return '';

  let path = `M ${pointX(first.frame)} ${pointY(first.value, row.maxValue)}`;
  for (const point of rest) {
    const x = pointX(point.frame);
    path += ` H ${x} V ${pointY(point.value, row.maxValue)}`;
  }
  return `${path} H ${pointX(duration.value)}`;
}

/** 每 5 秒一条的纵向网格线，和上方标尺对齐。 */
const gridLines = computed(() => {
  const lines: number[] = [];
  for (let frame = 0; frame <= duration.value; frame += GRID_LINE_FRAME_STEP) {
    lines.push(pointX(frame));
  }
  return lines;
});

function pointMarkerX(frame: number): number {
  const inset = Math.min(POINT_RADIUS, width.value / 2);
  return clamp(pointX(frame), inset, width.value - inset);
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const rounded = Math.round(value * 100) / 100;
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

function pointTitle(point: ResourceCurvePointView): string {
  return `${formatNumber(point.frame)}f / ${formatNumber(point.frame / 30)}s · ${formatNumber(point.value)}`;
}
</script>

<template>
  <div
    class="resource-curves"
    :class="{ 'resource-curves--empty': !hasCurves }"
    :style="{ width: `${width}px` }"
  >
    <div v-if="!hasCurves" class="empty-state">—</div>
    <div
      v-for="row in visibleRows"
      v-else
      :key="row.key"
      class="curve-row"
      :class="`curve-row--${row.kind}`"
    >
      <span class="curve-label">
        <strong>{{ row.label }}</strong>
        <small>MAX {{ formatNumber(row.maxValue) }}</small>
      </span>
      <svg
        class="curve-chart"
        :width="width"
        :height="ROW_HEIGHT"
        :viewBox="`0 0 ${width} ${ROW_HEIGHT}`"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          v-for="line in gridLines"
          :key="`grid-${line}`"
          class="guide-grid-line"
          :x1="line"
          y1="0"
          :x2="line"
          :y2="ROW_HEIGHT"
        />
        <line
          v-for="ratio in [0.25, 0.5, 0.75]"
          :key="ratio"
          class="guide-line"
          x1="0"
          :y1="CHART_TOP + (ROW_HEIGHT - CHART_TOP - CHART_BOTTOM) * ratio"
          :x2="width"
          :y2="CHART_TOP + (ROW_HEIGHT - CHART_TOP - CHART_BOTTOM) * ratio"
        />
        <path class="curve-fill" :d="`${stepPath(row)} V ${ROW_HEIGHT - CHART_BOTTOM} H 0 Z`" />
        <path class="curve-line" :d="stepPath(row)" />
        <circle
          v-for="(point, index) in row.points.filter(point => point.source !== 'autoRecovery')"
          :key="`${point.frame}:${index}`"
          class="curve-point"
          :cx="pointMarkerX(point.frame)"
          :cy="pointY(point.value, row.maxValue)"
          :r="POINT_RADIUS"
        >
          <title>{{ pointTitle(point) }}</title>
        </circle>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.resource-curves {
  min-width: 1px;
  color: var(--ea-text-secondary, rgb(215 218 222 / 82%));
  background: var(--ea-surface, #17191c);
  font-family: var(--ea-font-family, 'Segoe UI', sans-serif);
  letter-spacing: 0;
}

.resource-curves--empty {
  min-height: 56px;
  display: grid;
  place-items: center;
}

.empty-state {
  color: var(--ea-text-muted, rgb(255 255 255 / 32%));
  font-size: 11px;
}

.curve-row {
  position: relative;
  height: 56px;
  overflow: hidden;
  border-bottom: 1px solid var(--ea-border, rgb(255 255 255 / 10%));
  color: #e6c928;
  background: var(--ea-surface, #17191c);
}

.curve-row--enemyHealth {
  color: #e0492f;
}

.curve-row--poise {
  color: #8a6de9;
}

.curve-label {
  position: absolute;
  top: 5px;
  left: 7px;
  z-index: 1;
  display: inline-flex;
  align-items: baseline;
  gap: 5px;
  padding: 1px 4px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--ea-surface, #17191c) 82%, transparent);
  pointer-events: none;
}

.curve-label strong {
  color: currentColor;
  font:
    700 10px/14px Consolas,
    monospace;
}

.curve-label small {
  color: var(--ea-text-muted, rgb(255 255 255 / 38%));
  font:
    9px/14px Consolas,
    monospace;
}

.curve-chart {
  position: absolute;
  inset: 0;
  display: block;
  overflow: hidden;
}

.guide-line {
  stroke: var(--ea-border, rgb(255 255 255 / 10%));
  stroke-width: 1;
  stroke-dasharray: 2 3;
  vector-effect: non-scaling-stroke;
}

.guide-grid-line {
  stroke: rgb(255 255 255 / 6%);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.curve-fill {
  fill: currentColor;
  fill-opacity: 0.09;
}

.curve-line {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linejoin: miter;
  vector-effect: non-scaling-stroke;
}

.curve-point {
  fill: currentColor;
  stroke: var(--ea-surface, #17191c);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  pointer-events: all;
}
</style>
