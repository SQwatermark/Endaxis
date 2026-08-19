<script setup lang="ts">
/**
 * 时间轴动作块的展示组件。
 *
 * 只管画形状、配色和编辑状态，不读项目数据也不碰模拟器；命中点、警告这类内容
 * 由外部算好传进来，不让这个组件像旧版 ActionItem 那样什么都管。
 */
import { computed } from 'vue';
import { EditPen } from '@element-plus/icons-vue';
import type { SkillType } from '../../../core/game-data/operatorDefinition';
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
  selected?: boolean;
  disabled?: boolean;
  locked?: boolean;
  edited?: boolean;
  moving?: boolean;
  /** 已启动但在当前模拟终点前尚未到达实例局部可操作边界。 */
  durationPending?: boolean;
  color?: string | null;
  connectionToolEnabled?: boolean;
  /** 合法性诊断归约到该技能块的警告标记。 */
  warning?: boolean;
  /** 技能块上的独立命中点标记；同时是连线工具的伤害命中端点。 */
  hits?: readonly TimelineHitMarkerView[];
  /** 由该技能产生的时间膨胀流光，沿用旧版从技能块左侧开始并裁剪到块内。 */
  timeDilationSegments?: readonly { readonly left: number; readonly width: number }[];
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

const blockStyle = computed(() => ({
  left: `${props.left}px`,
  width: `${Math.max(1, props.width)}px`,
  ...(props.color ? { '--action-accent': props.color } : {}),
}));

function beginMove(event: PointerEvent): void {
  if (props.locked || props.connectionToolEnabled) return;
  emit('movePointerDown', event);
}

function markerStyle(marker: TimelineHitMarkerView): Record<string, string> {
  return { left: `${projectTimelineHitMarkerLeftPx(marker.leftPx)}px` };
}
</script>

<template>
  <button
    type="button"
    class="timeline-action-block"
    :data-timeline-action-id="actionId"
    :class="{
      'is-selected': selected,
      'is-disabled': disabled,
      'is-locked': locked,
      'is-moving': moving,
      'is-duration-pending': durationPending,
      'is-connection-tool': connectionToolEnabled,
    }"
    :data-skill-type="skillType"
    :style="blockStyle"
    :title="label"
    :draggable="false"
    @pointerdown="beginMove"
    @click.stop="$emit('select', $event)"
    @contextmenu.prevent.stop="$emit('contextmenu', $event)"
    @mouseenter="$emit('hoverChange', true)"
    @mouseleave="$emit('hoverChange', false)"
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
    <span v-if="durationPending" class="duration-pending-tail" aria-hidden="true"></span>
    <span
      v-for="hit in hits ?? []"
      :key="hit.hitId"
      class="hit-marker"
      :style="markerStyle(hit)"
      :title="hit.title ?? ''"
      :data-connection-action-id="actionId"
      :data-connection-port="`hit:${hit.hitId}`"
      draggable="false"
      @pointerdown.stop
      @mousedown.stop.prevent
      @click.stop="$emit('hitClick', hit.hitId)"
    ></span>
    <span v-if="warning" class="warning-mark" aria-label="warning"></span>
    <EditPen
      v-if="edited"
      class="edited-mark"
      :class="{ 'is-shifted': disabled }"
      aria-label="edited"
    />
    <span v-if="locked" class="status-mark lock-mark" aria-label="locked"></span>
    <span v-if="disabled" class="status-mark disabled-mark" aria-label="disabled"></span>
    <span
      v-for="port in connectionPorts"
      v-show="connectionToolEnabled"
      :key="port"
      class="connection-port"
      :class="`connection-port--${port}`"
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
  top: 55px;
  height: 50px;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  padding: 0 8px;
  border: 1.5px solid var(--action-accent);
  border-radius: 2px;
  background: var(--action-fill);
  color: var(--ea-action-fg, rgba(255, 255, 255, 0.9));
  font: 700 13px/1 var(--ea-font-family, sans-serif);
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
  z-index: 2;
}

.timeline-action-block.is-moving {
  z-index: 4;
  cursor: grabbing;
  filter: brightness(1.25);
  box-shadow: 0 0 14px color-mix(in srgb, var(--action-accent) 65%, transparent);
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

.timeline-action-block[data-skill-type='ultimate'] {
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

.action-label {
  position: relative;
  z-index: 2;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
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
  top: -4px;
  right: -4px;
  width: 0;
  height: 0;
  border-top: 9px solid #f5222d;
  border-left: 9px solid transparent;
  filter: drop-shadow(0 0 3px rgb(245 34 45 / 80%));
}

.warning-mark::after {
  content: '!';
  position: absolute;
  top: -9px;
  right: 0;
  width: 8px;
  color: #fff;
  font:
    800 8px/9px Consolas,
    monospace;
  text-align: center;
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
  transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: auto;
  cursor: pointer;
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
</style>
