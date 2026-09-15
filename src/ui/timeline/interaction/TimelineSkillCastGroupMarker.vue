<script setup lang="ts">
/** 只画连续组的括号和选择入口，位置由成员共用的时间投影提供。 */
import { EaButton } from '../../../design-system/index';

defineProps<{
  left: number;
  width: number;
  label: string;
  selected: boolean;
}>();
defineEmits<{ select: [] }>();
</script>

<template>
  <div
    class="skill-cast-group-marker"
    :class="{ 'is-selected': selected }"
    :style="{ left: `${left}px`, width: `${Math.max(2, width)}px` }"
  >
    <EaButton
      class="group-label"
      variant="ghost"
      size="sm"
      :title="label"
      :aria-label="label"
      @pointerdown.stop
      @click.stop="$emit('select')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2"
        ></path>
      </svg>
      <span>{{ label }}</span>
    </EaButton>
  </div>
</template>

<style scoped>
.skill-cast-group-marker {
  position: absolute;
  top: calc(var(--timeline-action-top, 55px) - 4px);
  height: 8px;
  box-sizing: border-box;
  border: 1px solid var(--ea-fg-muted, #aaa);
  border-bottom: 0;
  color: var(--ea-fg-muted, #aaa);
  pointer-events: none;
  z-index: 30000;
}

.skill-cast-group-marker.is-selected {
  border-color: var(--ea-action-selected, #fff);
  color: var(--ea-action-selected, #fff);
}

.group-label {
  position: absolute;
  /* 上层Buff占据技能顶边上方24到6px；标签放在块内顶部，不挤占Buff图标。 */
  top: 6px;
  left: 3px;
  display: flex;
  gap: 3px;
  max-width: 100%;
  min-width: 0;
  height: 12px;
  padding: 0 3px;
  border: 0;
  background: var(--ea-bg-panel, #292929);
  color: inherit;
  font-size: 10px;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  pointer-events: auto;
}

.group-label span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.group-label svg {
  flex: 0 0 10px;
  width: 10px;
  height: 10px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
