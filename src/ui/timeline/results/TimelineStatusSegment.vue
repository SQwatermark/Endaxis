<script setup lang="ts">
/**
 * 时间轴状态段的统一展示框架。
 *
 * Buff、干员专属 UI 和后续其他状态只提供图形内容；边框、计数、悬停和持续条由这里统一。
 */
import { EaTooltip } from '@/design-system';

withDefaults(
  defineProps<{
    left: number;
    top: number;
    width: number;
    title: string;
    durationColor?: string;
    count?: number | string | null;
    active?: boolean;
    interactive?: boolean;
    iconWidth?: number;
    bareIcon?: boolean;
  }>(),
  { interactive: false, iconWidth: 18, bareIcon: false },
);

const emit = defineEmits<{
  activate: [];
}>();
</script>

<template>
  <span
    class="timeline-status-segment"
    :class="{
      'is-active': active,
      'is-interactive': interactive,
      'has-bare-icon': bareIcon,
    }"
    :style="{
      left: `${left}px`,
      top: `${top}px`,
      '--timeline-status-icon-width': `${iconWidth}px`,
    }"
  >
    <EaTooltip
      :content="title"
      placement="top"
      effect="dark"
      :show-after="100"
      popper-class="timeline-status-tooltip"
    >
      <span
        class="timeline-status-segment__body"
        :role="interactive ? 'button' : undefined"
        :tabindex="interactive ? 0 : undefined"
        :aria-label="interactive ? title : undefined"
        @click.stop="interactive && emit('activate')"
        @keydown.enter.stop.prevent="interactive && emit('activate')"
        @keydown.space.stop.prevent="interactive && emit('activate')"
      >
        <span class="timeline-status-segment__icon">
          <span class="timeline-status-segment__content"><slot name="content" /></span>
          <span v-if="count !== undefined && count !== null" class="timeline-status-segment__count">
            {{ count }}
          </span>
        </span>
        <span
          v-if="width > 0"
          class="timeline-status-segment__duration"
          :style="{ width: `${width}px`, backgroundColor: durationColor }"
        >
          <span class="timeline-status-segment__stripes"></span>
        </span>
      </span>
    </EaTooltip>
  </span>
</template>

<style scoped>
.timeline-status-segment {
  position: absolute;
  display: flex;
  align-items: center;
  white-space: nowrap;
  pointer-events: none;
}

.timeline-status-segment__body {
  display: flex;
  align-items: center;
  outline: none;
  pointer-events: none;
}

.timeline-status-segment.is-interactive .timeline-status-segment__body {
  pointer-events: auto;
  cursor: pointer;
}

.timeline-status-segment__icon {
  position: relative;
  z-index: 2;
  width: var(--timeline-status-icon-width);
  height: 18px;
  box-sizing: border-box;
  display: grid;
  flex: 0 0 var(--timeline-status-icon-width);
  place-items: center;
  border: 1px solid var(--ea-keycap-skill-border, #999);
  border-radius: 2px;
  background: var(--ea-keycap-skill-bg, #333);
  box-shadow: 0 1px 2px rgb(0 0 0 / 50%);
  transition:
    transform 0.12s ease,
    filter 0.12s ease,
    border-color 0.12s ease,
    box-shadow 0.12s ease;
}

.timeline-status-segment.has-bare-icon .timeline-status-segment__icon {
  border-color: transparent;
  background: transparent;
  box-shadow: none;
}

.timeline-status-segment__body:hover .timeline-status-segment__icon,
.timeline-status-segment__body:focus-visible .timeline-status-segment__icon {
  z-index: 12;
  transform: scale(1.18);
  filter: brightness(1.18);
  border-color: rgb(255 255 255 / 95%);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 22%),
    0 4px 12px rgb(0 0 0 / 46%);
}

.timeline-status-segment__content {
  position: relative;
  width: calc(var(--timeline-status-icon-width) - 2px);
  height: 16px;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.timeline-status-segment__count {
  position: absolute;
  right: -3px;
  bottom: -3px;
  z-index: 3;
  min-width: 9px;
  box-sizing: border-box;
  padding: 0 2px;
  border-radius: 2px;
  background: rgb(19 20 22 / 92%);
  color: var(--ea-gold);
  font:
    700 8px/10px 'Roboto Mono',
    Consolas,
    monospace;
  text-align: center;
}

.timeline-status-segment__duration {
  position: relative;
  z-index: 1;
  height: 16px;
  margin-left: 2px;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 2px;
  background: #8c8c8c;
  box-shadow: 0 1px 2px rgb(0 0 0 / 50%);
  pointer-events: none;
}

.timeline-status-segment.is-active .timeline-status-segment__duration {
  background: color-mix(in srgb, var(--ea-gold) 55%, #555);
}

.timeline-status-segment__body:hover .timeline-status-segment__duration,
.timeline-status-segment__body:focus-visible .timeline-status-segment__duration {
  filter: brightness(1.16) saturate(1.08);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 18%),
    0 2px 8px rgb(0 0 0 / 50%);
}

.timeline-status-segment__stripes {
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
