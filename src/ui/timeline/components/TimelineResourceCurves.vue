<script setup lang="ts">
/**
 * 时间轴下方资源曲线的展示组件（对齐旧版 ResourceMonitor 的坐标与画法）。
 *
 * 只画"全队 SP、敌人生命、失衡"三类曲线；各干员终结技能量画在各自轨道上，不在这里。
 * 横轴坐标和时间轴共用同一换算（准备区偏移 + 每帧像素），并跟随时间轴横向滚动，
 * 保证曲线和上方标尺、技能块位置一一对齐。每帧自动回复不单独标点。
 */
import { computed } from 'vue';
import CustomNumberInput from '../../components/CustomNumberInput.vue';
import { poiseProgressPoints } from '../poiseProgressPoints';
import { poiseDisplayPoints } from '../poiseDisplayPoints';
import type { SharedSpCurve } from '../../../core/projection/resourceCurves';
import type { EnemyHealthCurve } from '../../../core/projection/enemyHealthCurves';
import type { PoiseCurve } from '../../../core/projection/poiseCurves';
import { frameToTimelinePx } from '../timelineGeometry';

const props = defineProps<{
  spCurve: SharedSpCurve;
  timelineWidth: number;
  durationFrames: number;
  cursorFrame: number;
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
  spLabel?: string;
  visibleKinds?: readonly ResourceCurveRow['kind'][];
  prepExpanded: boolean;
  initialSp?: number;
  spRecoveryPerSecond?: number;
  initialSpLabel?: string;
  spRecoveryLabel?: string;
}>();

const emit = defineEmits<{
  updateResourceRule: [field: 'initialSp' | 'spRecoveryPerSecond', value: number];
}>();

const ROW_HEIGHT = 56;
const CHART_TOP = 0;
const CHART_BOTTOM = 0;
const POINT_RADIUS = 2;
/** 旧版 ResourceMonitor 为技力 0 以下固定保留 40 点显示区。 */
const SP_NEGATIVE_BUFFER = 40;
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
    label: props.spLabel ?? 'SP',
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
          points: poiseProgressPoints(props.poiseCurve),
        },
      ]),
]);
const visibleRows = computed(() =>
  rows.value.filter(
    row => row.points.length > 0 && (props.visibleKinds?.includes(row.kind) ?? true),
  ),
);
const hasCurves = computed(() => visibleRows.value.length > 0);

/** 与时间轴同坐标系的横坐标：轨道头 + 帧位置，再减去当前滚动距离。 */
function pointX(frame: number): number {
  return (
    props.trackHeaderWidth +
    frameToTimelinePx(frame, props.prepFrames, props.pxPerFrame, props.prepExpanded) -
    props.scrollLeft
  );
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function pointY(row: ResourceCurveRow, value: number): number {
  const chartHeight = ROW_HEIGHT - CHART_TOP - CHART_BOTTOM;
  const upperBound = row.maxValue > 0 ? row.maxValue : 1;
  const minimum = row.kind === 'sp' ? -SP_NEGATIVE_BUFFER : 0;
  const ratio = clamp((value - minimum) / (upperBound - minimum), 0, 1);
  return CHART_TOP + (1 - ratio) * chartHeight;
}

function baselineY(row: ResourceCurveRow): number {
  return pointY(row, 0);
}

/** 失衡绘图补保持点与显示终点；不改变原始事实点、标记和读数。 */
function displayPoints(row: ResourceCurveRow): readonly ResourceCurvePointView[] {
  return row.kind === 'poise' ? poiseDisplayPoints(row.points, duration.value) : row.points;
}

/** 旧版资源监控器直接连接相邻事实点；同帧的连续事实自然形成竖直线。 */
function linePath(row: ResourceCurveRow): string {
  const [first, ...rest] = displayPoints(row);
  if (first === undefined) return '';

  let path = `M ${pointX(first.frame)} ${pointY(row, first.value)}`;
  for (const point of rest) {
    path += ` L ${pointX(point.frame)} ${pointY(row, point.value)}`;
  }
  return path;
}

function fillPath(row: ResourceCurveRow): string {
  const points = displayPoints(row);
  const last = points.at(-1);
  if (last === undefined) return '';
  const coordinates = points.map(point => `${pointX(point.frame)} ${pointY(row, point.value)}`);
  return `M 0 ${baselineY(row)} L ${coordinates.join(' L ')} L ${pointX(last.frame)} ${baselineY(row)} Z`;
}

/** 每 5 秒一条的纵向网格线，和上方标尺对齐。 */
const gridLines = computed(() => {
  const lines: number[] = [];
  for (let frame = 0; frame <= duration.value; frame += GRID_LINE_FRAME_STEP) {
    lines.push(pointX(frame));
  }
  return lines;
});

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return String(value);
  const rounded = Math.round(value * 100) / 100;
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

function valueAtCursor(row: ResourceCurveRow): number {
  let value = row.points[0]?.value ?? 0;
  for (const point of row.points) {
    if (point.frame > props.cursorFrame) break;
    value = point.value;
  }
  return value;
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
      <span class="curve-label" :style="{ width: `${trackHeaderWidth}px` }">
        <template
          v-if="row.kind === 'sp' && initialSp !== undefined && spRecoveryPerSecond !== undefined"
        >
          <strong>{{ row.label }}</strong>
          <label class="resource-control-row">
            <span>{{ initialSpLabel }}</span>
            <CustomNumberInput
              :model-value="initialSp"
              :min="0"
              :max="row.maxValue"
              active-color="var(--ea-gold)"
              class="standard-input"
              @update:model-value="emit('updateResourceRule', 'initialSp', Number($event))"
            />
          </label>
          <label class="resource-control-row">
            <span>{{ spRecoveryLabel }}</span>
            <CustomNumberInput
              :model-value="spRecoveryPerSecond"
              :min="0"
              :step="0.5"
              active-color="var(--ea-gold)"
              class="standard-input"
              @update:model-value="
                emit('updateResourceRule', 'spRecoveryPerSecond', Number($event))
              "
            />
          </label>
        </template>
        <template v-else>
          <strong>{{ row.label }}</strong>
          <small
            ><span>{{ formatNumber(valueAtCursor(row)) }}</span
            ><span class="label-value-max">/{{ formatNumber(row.maxValue) }}</span></small
          >
          <span v-if="row.kind === 'poise'" class="label-readout-bar">
            <i
              :style="{
                width: `${Math.max(0, Math.min(1, valueAtCursor(row) / Math.max(1, row.maxValue))) * 100}%`,
              }"
            ></i>
          </span>
        </template>
      </span>
      <svg
        class="curve-chart"
        :width="width"
        height="100%"
        :viewBox="`0 0 ${width} ${ROW_HEIGHT}`"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient :id="`curve-fill-${row.kind}`" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stop-color="currentColor"
              :stop-opacity="row.kind === 'poise' ? 0.5 : 0.3"
            />
            <stop
              offset="100%"
              stop-color="currentColor"
              :stop-opacity="row.kind === 'poise' ? 0.1 : 0.05"
            />
          </linearGradient>
        </defs>
        <line
          v-for="line in gridLines"
          :key="`grid-${line}`"
          class="guide-grid-line"
          :x1="line"
          y1="0"
          :x2="line"
          :y2="ROW_HEIGHT"
        />
        <template v-if="row.kind === 'sp'">
          <line
            v-for="value in [300, 200, 100]"
            :key="value"
            class="guide-line"
            x1="0"
            :y1="pointY(row, value)"
            :x2="width"
            :y2="pointY(row, value)"
          />
          <text
            :x="trackHeaderWidth + 5 - scrollLeft"
            :y="pointY(row, 300) + 12"
            class="guide-label"
          >
            MAX({{ formatNumber(row.maxValue) }})
          </text>
          <text
            :x="trackHeaderWidth + 5 - scrollLeft"
            :y="baselineY(row) - 4"
            class="guide-label guide-label--zero"
          >
            0
          </text>
        </template>
        <rect
          v-if="row.kind === 'sp'"
          class="sp-negative-zone"
          x="0"
          :y="baselineY(row)"
          :width="width"
          :height="Math.max(0, ROW_HEIGHT - CHART_BOTTOM - baselineY(row))"
        />
        <path
          class="curve-fill"
          :style="{ fill: `url(#curve-fill-${row.kind})` }"
          :d="fillPath(row)"
        />
        <path class="curve-line" :d="linePath(row)" />
        <circle
          v-for="(point, index) in row.points.filter(point => point.source !== 'autoRecovery')"
          :key="`${point.frame}:${index}`"
          class="curve-point"
          :cx="pointX(point.frame)"
          :cy="pointY(row, point.value)"
          :r="POINT_RADIUS"
          :class="{ 'is-negative': row.kind === 'sp' && point.value < 0 }"
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
  height: 100%;
  color: var(--ea-text-secondary, rgb(215 218 222 / 82%));
  background: var(--ea-workbench-main, #18181c);
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
  height: 100%;
  overflow: hidden;
  border-bottom: 1px solid var(--ea-border, rgb(255 255 255 / 10%));
  color: #e6c928;
  background: var(--ea-workbench-main, #18181c);
}

.curve-row--enemyHealth {
  color: #e0492f;
}

.curve-row--poise {
  color: #ff7875;
}

.curve-label {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 2;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 6px;
  padding: 8px 10px;
  border-right: 1px solid var(--ea-divider, rgb(255 255 255 / 16%));
  background: var(--ea-workbench-panel, #252526);
  pointer-events: none;
}

.curve-label strong {
  color: currentColor;
  font:
    700 10px/13px Consolas,
    monospace;
}

.curve-row--poise .curve-label {
  color: #ff9c6e;
  border-left: 3px solid #ff9c6e;
}

.curve-row--poise .curve-label strong {
  font:
    700 11px/1 Inter,
    -apple-system,
    sans-serif;
}

.curve-row--poise .curve-label small {
  line-height: 1.1;
}

.curve-row--sp .curve-label {
  border-left: 3px solid var(--ea-gold);
}

.curve-label small {
  color: currentColor;
  font:
    700 12px/14px 'Roboto Mono',
    monospace;
}

.label-value-max {
  color: var(--ea-fg-faint, rgb(255 255 255 / 45%));
  font-weight: 600;
}

.label-readout-bar {
  display: block;
  width: 100%;
  height: 5px;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--ea-fill-soft, rgb(255 255 255 / 8%));
}

.label-readout-bar i {
  display: block;
  height: 100%;
  background: #d46b08;
  transition: width 0.16s ease;
}

.resource-control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--ea-fg-faint, rgb(255 255 255 / 48%));
  font-size: 11px;
  white-space: nowrap;
  pointer-events: auto;
}

:deep(.standard-input) {
  width: 65px !important;
  height: 22px !important;
  font-size: 11px !important;
}

.curve-chart {
  position: absolute;
  top: 14px;
  right: 0;
  bottom: 0;
  left: 0;
  height: calc(100% - 14px);
  display: block;
  overflow: hidden;
}

.guide-line {
  stroke: #444;
  stroke-width: 1;
  stroke-dasharray: 2;
  vector-effect: non-scaling-stroke;
}

.guide-label {
  fill: #888;
  font-size: 9px;
}

.guide-label--zero {
  fill: #666;
}

.guide-grid-line {
  stroke: rgb(255 255 255 / 6%);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.curve-fill {
  fill: currentColor;
}

.curve-line {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}

.curve-point {
  fill: currentColor;
  stroke: var(--ea-workbench-main, #18181c);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  pointer-events: all;
}

.curve-point.is-negative {
  fill: #ff4d4f;
}

.sp-negative-zone {
  fill: #ff4d4f;
  fill-opacity: 0.09;
}
</style>
