<script setup lang="ts">
/**
 * 时间轴动作块的展示组件。
 *
 * 只管画形状、配色和编辑状态，不读项目数据也不碰模拟器；命中点、警告这类内容
 * 由外部算好传进来，不让这个组件像旧版 ActionItem 那样什么都管。
 */
import { computed, ref } from 'vue';
import { EditPen } from '@element-plus/icons-vue';
import type { SkillType } from '../../../core/game-data/operatorDefinition';
import { PROJECT_FPS, type EditableBarDocument } from '../../../core/project/schema';
import type { TimelineConnectionPort } from '../timelineConnections';
import {
  projectTimelineHitMarkerLeftPx,
  type TimelineHitMarkerView,
} from '../timelineHitProjection';

const props = defineProps<{
  actionId: string;
  label: string;
  skillType: SkillType | null;
  left: number;
  width: number;
  /** 同轨文档顺序投影出的稳定叠放序号；只参与 paint，不进入项目模型。 */
  stackOrder?: number;
  selected?: boolean;
  /** 原生成功分支回执确认的完美连携，不从时间邻接猜测。 */
  perfect?: boolean;
  disabled?: boolean;
  locked?: boolean;
  edited?: boolean;
  moving?: boolean;
  /** 已启动但在当前模拟终点前尚未到达实例局部可操作边界。 */
  durationPending?: boolean;
  color?: string | null;
  connectionToolEnabled?: boolean;
  connectionDragging?: boolean;
  connectionSourceActionId?: string | null;
  connectionTargetValid?: boolean;
  /** 合法性诊断归约到该技能块的警告标记。 */
  warning?: boolean;
  warningText?: string;
  warningFallbackText?: string;
  /** 技能块上的独立命中点标记；同时是连线工具的伤害命中端点。 */
  hits?: readonly TimelineHitMarkerView[];
  /** 由该技能产生的时间膨胀流光，沿用旧版从技能块左侧开始并裁剪到块内。 */
  timeDilationSegments?: readonly { readonly left: number; readonly width: number }[];
  /** 技能块实例上的辅助展示条；帧值按玩家编辑的实际战斗时间直接投影。 */
  customBars?: readonly EditableBarDocument[];
  /** 由运行时冷却回执投影出的现实时间持续条；不预测模拟终点外的结束帧。 */
  cooldownBars?: readonly {
    readonly offsetFrames: number;
    readonly durationFrames: number;
    readonly completed: boolean;
  }[];
  /** 由该次释放创建的精确强化 Buff 实例生命周期。 */
  enhancementBars?: readonly {
    readonly offsetFrames: number;
    readonly durationFrames: number;
    readonly completed: boolean;
  }[];
  pxPerFrame: number;
}>();

const emit = defineEmits<{
  select: [event: MouseEvent];
  movePointerDown: [event: PointerEvent];
  contextmenu: [event: MouseEvent];
  connectionPointerDown: [event: PointerEvent, port: TimelineConnectionPort];
  hitClick: [hitId: string];
  hoverChange: [hovered: boolean];
}>();

const connectionPorts: readonly TimelineConnectionPort[] = ['top', 'right', 'bottom', 'left'];
const hovered = ref(false);
const showConnectionPorts = computed(() => {
  if (!props.connectionToolEnabled) return false;
  if (props.connectionDragging) {
    return hovered.value && props.connectionSourceActionId !== props.actionId;
  }
  return hovered.value || props.selected === true;
});

const blockStyle = computed(() => ({
  left: `${props.left}px`,
  width: `${Math.max(1, props.width)}px`,
  zIndex: `calc(${props.moving ? 20000 : props.selected ? 10000 : 2} + ${props.stackOrder ?? 0})`,
  ...(props.color ? { '--action-accent': props.color } : {}),
}));

function beginMove(event: PointerEvent): void {
  if (props.connectionToolEnabled) return;
  emit('movePointerDown', event);
}

function setHovered(value: boolean): void {
  hovered.value = value;
  emit('hoverChange', value);
}

function markerStyle(marker: TimelineHitMarkerView): Record<string, string> {
  return { left: `${projectTimelineHitMarkerLeftPx(marker.leftPx)}px` };
}

function customBarStyle(bar: EditableBarDocument, index: number): Record<string, string> {
  return {
    left: `${bar.offsetFrames * props.pxPerFrame}px`,
    top: `${56 + index * 15}px`,
    width: `${Math.max(1, bar.durationFrames * props.pxPerFrame)}px`,
    color: bar.color ?? '#69c0ff',
  };
}

function cooldownBarStyle(index: number): Record<string, string> {
  const bar = props.cooldownBars?.[index];
  if (bar === undefined) return {};
  return {
    left: `${bar.offsetFrames * props.pxPerFrame}px`,
    top: `${56 + (props.customBars?.length ?? 0) * 15 + index * 15}px`,
    width: `${Math.max(1, bar.durationFrames * props.pxPerFrame)}px`,
  };
}

function enhancementBarStyle(index: number): Record<string, string> {
  const bar = props.enhancementBars?.[index];
  if (bar === undefined) return {};
  return {
    left: `${bar.offsetFrames * props.pxPerFrame}px`,
    top: `${
      56 +
      (props.customBars?.length ?? 0) * 15 +
      (props.cooldownBars?.length ?? 0) * 15 +
      index * 15
    }px`,
    width: `${Math.max(1, bar.durationFrames * props.pxPerFrame)}px`,
  };
}

function formatDurationFrames(frames: number): string {
  const seconds = frames / PROJECT_FPS;
  return `${Number(seconds.toFixed(2))}s`;
}
</script>

<template>
  <button
    type="button"
    class="timeline-action-block"
    :data-timeline-action-id="actionId"
    :class="{
      'is-selected': selected,
      'is-perfect-combo': perfect,
      'is-disabled': disabled,
      'is-locked': locked,
      'is-moving': moving,
      'is-duration-pending': durationPending,
      'is-connection-tool': connectionToolEnabled,
    }"
    :data-skill-type="skillType"
    :style="blockStyle"
    :title="[label, warningText].filter(Boolean).join(' · ')"
    :draggable="false"
    @pointerdown="beginMove"
    @click.stop="$emit('select', $event)"
    @contextmenu.prevent.stop="$emit('contextmenu', $event)"
    @mouseenter="setHovered(true)"
    @mouseleave="setHovered(false)"
  >
    <span
      v-for="(segment, index) in timeDilationSegments ?? []"
      :key="index"
      class="time-dilation-segment"
      :style="{ left: `${segment.left}px`, width: `${segment.width}px` }"
      aria-hidden="true"
    >
      <span class="time-dilation-shimmer"></span>
    </span>
    <span class="action-label">{{ label }}</span>
    <template v-if="skillType === 'ultimate' && !disabled">
      <span class="ultimate-side-bar ultimate-side-bar--left" aria-hidden="true"></span>
      <span class="ultimate-side-bar ultimate-side-bar--right" aria-hidden="true"></span>
    </template>
    <span v-if="durationPending" class="duration-pending-tail" aria-hidden="true"></span>
    <span
      v-for="hit in hits ?? []"
      :key="hit.hitId"
      class="hit-marker"
      :class="{ 'is-forced-crit': hit.forcedCritical }"
      :style="markerStyle(hit)"
      :title="hit.title ?? ''"
      :data-connection-action-id="actionId"
      :data-connection-port="`hit:${hit.hitId}`"
      draggable="false"
      @pointerdown.stop
      @mousedown.stop.prevent="$emit('hitClick', hit.hitId)"
    ></span>
    <el-tooltip
      v-if="warning"
      :content="warningText || warningFallbackText || ''"
      placement="top"
      effect="dark"
      :show-after="80"
      popper-class="next-timeline-warning-tooltip"
    >
      <span class="warning-mark" :aria-label="warningFallbackText">
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          ></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </span>
    </el-tooltip>
    <EditPen
      v-if="edited"
      class="edited-mark"
      :class="{ 'is-shifted': disabled }"
      aria-label="edited"
    />
    <span v-if="locked" class="status-mark lock-mark" aria-label="locked"></span>
    <span v-if="disabled" class="status-mark disabled-mark" aria-label="disabled"></span>
    <span
      v-for="(bar, index) in (customBars ?? []).filter(bar => bar.durationFrames > 0)"
      :key="bar.id"
      class="custom-timeline-bar"
      :style="customBarStyle(bar, index)"
      aria-hidden="true"
    >
      <span class="custom-timeline-bar__start"></span>
      <span v-if="bar.text" class="custom-timeline-bar__label">{{ bar.text }}</span>
      <span class="custom-timeline-bar__duration">{{ bar.durationFrames }}f</span>
      <span class="custom-timeline-bar__end"></span>
    </span>
    <span
      v-for="(bar, index) in cooldownBars ?? []"
      :key="`cooldown:${index}`"
      class="cooldown-timeline-bar"
      :class="{ 'is-pending': !bar.completed }"
      :style="cooldownBarStyle(index)"
      aria-hidden="true"
    >
      <span class="cooldown-timeline-bar__start"></span>
      <span class="cooldown-timeline-bar__duration">{{
        formatDurationFrames(bar.durationFrames)
      }}</span>
      <span class="cooldown-timeline-bar__end"></span>
    </span>
    <span
      v-for="(bar, index) in enhancementBars ?? []"
      :key="`enhancement:${index}`"
      class="enhancement-timeline-bar"
      :class="{ 'is-pending': !bar.completed }"
      :style="enhancementBarStyle(index)"
      aria-hidden="true"
    >
      <span class="enhancement-timeline-bar__start"></span>
      <span class="enhancement-timeline-bar__duration">{{
        formatDurationFrames(bar.durationFrames)
      }}</span>
      <span class="enhancement-timeline-bar__end"></span>
    </span>
    <span
      v-for="port in connectionPorts"
      v-show="showConnectionPorts"
      :key="port"
      class="connection-port"
      :class="[
        `connection-port--${port}`,
        { 'is-invalid-target': connectionTargetValid === false },
      ]"
      :data-connection-action-id="actionId"
      :data-connection-port="port"
      @pointerdown.stop.prevent="$emit('connectionPointerDown', $event, port)"
    ></span>
  </button>
</template>

<style scoped>
.timeline-action-block {
  --action-accent: #a5a5a8;
  --action-fill: color-mix(in srgb, var(--action-accent) 15%, transparent);
  position: absolute;
  top: var(--timeline-action-top, 55px);
  height: 50px;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  padding: 0 8px;
  border: 2px dashed var(--action-accent);
  background: var(--action-fill);
  color: var(--ea-action-fg, rgba(255, 255, 255, 0.9));
  font-family: inherit;
  font-size: inherit;
  font-weight: 700;
  line-height: normal;
  text-shadow: var(--ea-action-fg-shadow, 0 1px 2px rgba(0, 0, 0, 0.8));
  white-space: nowrap;
  cursor: grab;
  user-select: none;
}

.timeline-action-block:hover {
  filter: brightness(1.18);
}

.timeline-action-block.is-selected {
  border: 2px dashed var(--ea-action-selected, #fff);
  box-shadow: 0 0 10px color-mix(in srgb, var(--action-accent) 50%, transparent);
}

.timeline-action-block.is-moving {
  cursor: grabbing;
  filter: brightness(1.25);
  box-shadow: 0 0 14px color-mix(in srgb, var(--action-accent) 65%, transparent);
}

.timeline-action-block.is-perfect-combo::after {
  content: '';
  position: absolute;
  inset: -3px;
  z-index: 4;
  box-sizing: border-box;
  border: 1px solid rgb(255 242 168 / 90%);
  border-radius: 3px;
  box-shadow: 0 0 14px color-mix(in srgb, var(--ea-gold) 70%, transparent);
  pointer-events: none;
  animation: perfect-combo-action-pulse 1.15s ease-in-out infinite;
}

@keyframes perfect-combo-action-pulse {
  0%,
  100% {
    opacity: 0.65;
  }
  50% {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .timeline-action-block.is-perfect-combo::after,
  .time-dilation-shimmer {
    animation: none;
  }

  .timeline-action-block.is-perfect-combo::after {
    opacity: 1;
  }
}

.timeline-action-block.is-duration-pending {
  border-right-style: dashed;
}

.duration-pending-tail {
  position: absolute;
  z-index: 1;
  top: -1.5px;
  bottom: -1.5px;
  left: 100%;
  width: 18px;
  border-left: 1px dashed color-mix(in srgb, var(--action-accent) 70%, transparent);
  background: repeating-linear-gradient(
    135deg,
    color-mix(in srgb, var(--action-accent) 28%, transparent) 0 3px,
    transparent 3px 7px
  );
  mask-image: linear-gradient(90deg, #000 0%, transparent 100%);
  pointer-events: none;
}

.timeline-action-block.is-disabled {
  border: 2px dashed #555;
  background-color: rgba(40, 40, 40, 0.3);
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(0, 0, 0, 0.5) 5px,
    rgba(0, 0, 0, 0.5) 10px
  );
  color: #777;
  opacity: 0.6;
}

.timeline-action-block.is-locked {
  cursor: not-allowed;
}

.timeline-action-block.is-connection-tool {
  cursor: default;
}

.connection-port {
  position: absolute;
  z-index: 3;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--action-accent);
  box-shadow: 0 0 0 1px var(--ea-workbench-bg);
  cursor: crosshair;
}

.connection-port:hover {
  background: var(--ea-gold);
  transform: scale(1.2);
}

.connection-port.is-invalid-target {
  opacity: 0.28;
  filter: grayscale(1);
  pointer-events: none;
}

.connection-port--top {
  top: -5px;
  left: 50%;
  translate: -50% 0;
}

.connection-port--right {
  top: 50%;
  right: -5px;
  translate: 0 -50%;
}

.connection-port--bottom {
  bottom: -5px;
  left: 50%;
  translate: -50% 0;
}

.connection-port--left {
  top: 50%;
  left: -5px;
  translate: 0 -50%;
}

.timeline-action-block[data-skill-type='battleSkill'] {
  --action-accent: #ff5a5f;
}

.timeline-action-block[data-skill-type='comboSkill'] {
  --action-accent: #facc15;
}

.timeline-action-block:not(.is-disabled)[data-skill-type='ultimate'] {
  --action-accent: #22c55e;
  background: radial-gradient(
    circle at center,
    color-mix(in srgb, var(--action-accent) 50%, transparent) 0%,
    color-mix(in srgb, var(--action-accent) 20%, transparent) 70%,
    color-mix(in srgb, var(--action-accent) 10%, transparent) 100%
  );
}

.timeline-action-block[data-skill-type='basicAttack'] {
  --action-accent: #a5a5a8;
}

.timeline-action-block:not(.is-selected):not(.is-disabled)[data-skill-type='basicAttack'] {
  border: 1.5px solid color-mix(in srgb, var(--action-accent) 40%, transparent);
}

.timeline-action-block:not(.is-selected):not(.is-disabled)[data-skill-type='comboSkill'],
.timeline-action-block:not(.is-selected):not(.is-disabled)[data-skill-type='ultimate'] {
  border: 1.5px solid var(--action-accent);
  border-radius: 2px;
}

.action-label {
  position: relative;
  z-index: 2;
  overflow: visible;
}

.ultimate-side-bar {
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--action-accent);
  pointer-events: none;
}

.ultimate-side-bar--left {
  left: 0;
  border-radius: 2px 0 0 2px;
}

.ultimate-side-bar--right {
  right: 0;
  border-radius: 0 2px 2px 0;
}

.custom-timeline-bar {
  position: absolute;
  z-index: 2;
  height: 2px;
  border-top: 2px solid currentColor;
  opacity: 0.78;
  pointer-events: none;
}

.custom-timeline-bar__label {
  position: absolute;
  right: calc(100% + 6px);
  top: -7px;
  color: currentColor;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 1px 2px rgb(0 0 0 / 80%);
}

.custom-timeline-bar__duration {
  position: absolute;
  top: 3px;
  left: 0;
  color: currentColor;
  font-size: 10px;
  line-height: 1;
}

.custom-timeline-bar__start,
.custom-timeline-bar__end {
  position: absolute;
  top: -5px;
  width: 1px;
  height: 8px;
  background: currentColor;
}

.custom-timeline-bar__start {
  left: 0;
}

.custom-timeline-bar__end {
  right: 0;
}

.cooldown-timeline-bar {
  position: absolute;
  z-index: 2;
  height: 2px;
  border-top: 2px solid var(--action-accent);
  opacity: 0.62;
  pointer-events: none;
}

.cooldown-timeline-bar.is-pending {
  border-top-style: dashed;
}

.cooldown-timeline-bar__duration {
  position: absolute;
  top: 3px;
  left: 0;
  color: var(--action-accent);
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.cooldown-timeline-bar__start,
.cooldown-timeline-bar__end {
  position: absolute;
  top: -5px;
  width: 1px;
  height: 8px;
  background: var(--action-accent);
}

.cooldown-timeline-bar__start {
  left: 0;
}

.cooldown-timeline-bar__end {
  right: 0;
}

.enhancement-timeline-bar {
  position: absolute;
  z-index: 2;
  height: 2px;
  border-top: 2px solid #b37feb;
  opacity: 0.8;
  pointer-events: none;
}

.enhancement-timeline-bar.is-pending {
  border-top-style: dashed;
}

.enhancement-timeline-bar__duration {
  position: absolute;
  top: 3px;
  left: 0;
  color: #b37feb;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}

.enhancement-timeline-bar__start,
.enhancement-timeline-bar__end {
  position: absolute;
  top: -5px;
  width: 1px;
  height: 8px;
  background: #b37feb;
}

.enhancement-timeline-bar__start {
  left: 0;
}

.enhancement-timeline-bar__end {
  right: 0;
}

.time-dilation-segment {
  position: absolute;
  z-index: 1;
  top: 0;
  bottom: 0;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.time-dilation-shimmer {
  position: absolute;
  inset: 0;
  width: 200%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  will-change: transform;
  animation: time-dilation-shimmer 1.5s infinite linear;
}

@keyframes time-dilation-shimmer {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(50%);
  }
}

.status-mark {
  position: absolute;
  top: 3px;
  width: 9px;
  height: 9px;
  opacity: 0.9;
}

.edited-mark {
  position: absolute;
  top: 3px;
  right: 4px;
  width: 11px;
  height: 11px;
  color: var(--ea-gold);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8));
}

.edited-mark.is-shifted {
  right: 16px;
}

.lock-mark {
  left: 3px;
  border: 1px solid currentColor;
  border-radius: 1px;
}

.lock-mark::before {
  content: '';
  position: absolute;
  left: 1px;
  top: -5px;
  width: 5px;
  height: 5px;
  box-sizing: border-box;
  border: 1px solid currentColor;
  border-bottom: 0;
  border-radius: 5px 5px 0 0;
}

.disabled-mark {
  right: 3px;
  border: 1px solid currentColor;
  border-radius: 50%;
}

.disabled-mark::after {
  content: '';
  position: absolute;
  left: 0;
  top: 3px;
  width: 8px;
  height: 1px;
  background: currentColor;
  transform: rotate(45deg);
  transform-origin: center;
}

.warning-mark {
  position: absolute;
  top: 2px;
  right: 2px;
  z-index: 25;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  color: #ff4d4f;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 80%));
  cursor: default;
}

.hit-marker {
  position: absolute;
  bottom: -3px;
  z-index: 20;
  width: 6px;
  height: 6px;
  background: #ff4d4f;
  border: 1px solid #333;
  transform: translateX(-50%) rotate(45deg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: auto;
  cursor: default;
}

.hit-marker.is-forced-crit {
  background-color: #ff6b6b;
  border-color: #ffd166;
  box-shadow: 0 0 8px rgba(255, 209, 102, 0.9);
}

.hit-marker:hover {
  background: var(--ea-gold);
  border-color: #fff;
  transform: translateX(-50%) rotate(45deg) scale(1.65);
  box-shadow: 0 0 8px var(--ea-gold);
  z-index: 30;
}

:global(html[data-theme='light']) .timeline-action-block {
  color: var(--ea-action-fg, #1a1b1e);
  text-shadow: none;
}

:global(html[data-theme='light']) .timeline-action-block:hover {
  filter: brightness(1.04);
}

:global(.next-timeline-warning-tooltip) {
  max-width: min(320px, calc(100vw - 48px));
  white-space: normal;
  overflow-wrap: anywhere;
}
</style>
