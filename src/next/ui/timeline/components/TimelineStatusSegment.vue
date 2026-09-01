<script setup lang="ts">
/**
 * 时间轴状态段的统一展示框架。
 *
 * Buff、干员专属 UI 和后续其他状态只提供图形内容；边框、计数、悬停和持续条由这里统一。
 */
defineProps<{
  left: number;
  top: number;
  width: number;
  title: string;
  count?: number | string | null;
  active?: boolean;
}>();
</script>

<template>
  <span
    class="timeline-status-segment"
    :class="{ 'is-active': active }"
    :style="{ left: `${left}px`, top: `${top}px` }"
  >
    <span class="timeline-status-segment__icon" :title="title">
      <span class="timeline-status-segment__content"><slot name="content" /></span>
      <span v-if="count !== undefined && count !== null" class="timeline-status-segment__count">
        {{ count }}
      </span>
    </span>
    <span
      v-if="width > 0"
      class="timeline-status-segment__duration"
      :style="{ width: `${width}px` }"
      :title="title"
    >
      <span class="timeline-status-segment__stripes"></span>
    </span>
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

.timeline-status-segment__icon {
  position: relative;
  z-index: 2;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  display: grid;
  flex: 0 0 18px;
  place-items: center;
  border: 1px solid var(--ea-keycap-skill-border, #999);
  border-radius: 2px;
  background: var(--ea-keycap-skill-bg, #333);
  box-shadow: 0 1px 2px rgb(0 0 0 / 50%);
  pointer-events: auto;
  transition:
    transform 0.12s ease,
    filter 0.12s ease,
    border-color 0.12s ease,
    box-shadow 0.12s ease;
}

.timeline-status-segment__icon:hover {
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
  width: 16px;
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
  pointer-events: auto;
}

.timeline-status-segment.is-active .timeline-status-segment__duration {
  background: color-mix(in srgb, var(--ea-gold) 55%, #555);
}

.timeline-status-segment__duration:hover {
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
