<script setup lang="ts">
/**
 * Next 时间轴底部资源曲线的纯展示组件。
 * 调用方必须先在投影层生成 `CombatResourceCurves`；本组件只负责把稀疏状态点映射为
 * 固定行高的阶梯折线，不解释战斗回执，也不推导任何资源变化。
 */
import { computed } from 'vue';
import type {
  CombatResourceCurves,
  ResourceCurvePoint,
} from '../../../core/projection/resourceCurves';

const props = defineProps<{
  curves: CombatResourceCurves;
  timelineWidth: number;
  durationFrames: number;
}>();

const ROW_HEIGHT = 56;
const CHART_TOP = 8;
const CHART_BOTTOM = 8;
const POINT_RADIUS = 2.5;

interface ResourceCurveRow {
  readonly key: string;
  readonly label: string;
  readonly kind: 'sp' | 'ultimateEnergy';
  readonly maxValue: number;
  readonly points: readonly ResourceCurvePoint[];
}

const width = computed(() => Math.max(1, props.timelineWidth));
const duration = computed(() => Math.max(0, props.durationFrames));
const rows = computed<readonly ResourceCurveRow[]>(() => [
  {
    key: 'sp',
    label: 'SP',
    kind: 'sp',
    maxValue: props.curves.sp.maxValue,
    points: props.curves.sp.points,
  },
  ...props.curves.ultimateEnergy.map(curve => ({
    key: `ultimateEnergy:${curve.operatorId}`,
    label: curve.operatorId,
    kind: curve.resource,
    maxValue: curve.maxValue,
    points: curve.points,
  })),
]);
const visibleRows = computed(() => rows.value.filter(row => row.points.length > 0));
const hasCurves = computed(() => visibleRows.value.length > 0);

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function pointX(frame: number): number {
  if (duration.value === 0) return 0;
  return (clamp(frame, 0, duration.value) / duration.value) * width.value;
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
  return `${path} H ${width.value}`;
}

function pointMarkerX(frame: number): number {
  const inset = Math.min(POINT_RADIUS, width.value / 2);
  return clamp(pointX(frame), inset, width.value - inset);
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const rounded = Math.round(value * 100) / 100;
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

function pointTitle(point: ResourceCurvePoint): string {
  return `${formatNumber(point.frame)}f / ${formatNumber(point.time)}s · ${formatNumber(point.value)}`;
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
          v-for="(point, index) in row.points"
          :key="`${point.sequence ?? 'initial'}:${point.frame}:${index}`"
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

.curve-row--ultimateEnergy {
  color: #53b8c9;
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
