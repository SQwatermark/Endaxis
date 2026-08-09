<script setup lang="ts">
/**
 * 时间轴动作块的纯展示层。
 *
 * 组件只负责稳定几何、类型配色和编辑状态，不读取项目、目录或模拟器。命中点、冷却条与
 * 合法性提示应由后续独立投影传入，避免动作块重新承担旧版 ActionItem 的全部职责。
 */
import { computed } from 'vue';
import type { SkillType } from '../../../core/game-data/operatorDefinition';

const props = defineProps<{
  label: string;
  skillType: SkillType | null;
  left: number;
  width: number;
  selected?: boolean;
  disabled?: boolean;
  locked?: boolean;
  color?: string | null;
}>();

defineEmits<{
  select: [];
}>();

const blockStyle = computed(() => ({
  left: `${props.left}px`,
  width: `${Math.max(48, props.width)}px`,
  ...(props.color ? { '--action-accent': props.color } : {}),
}));
</script>

<template>
  <button
    type="button"
    class="timeline-action-block"
    :class="{
      'is-selected': selected,
      'is-disabled': disabled,
      'is-locked': locked,
    }"
    :data-skill-type="skillType"
    :style="blockStyle"
    :title="label"
    @click.stop="$emit('select')"
  >
    <span class="action-label">{{ label }}</span>
    <span v-if="locked" class="status-mark lock-mark" aria-label="locked"></span>
    <span v-if="disabled" class="status-mark disabled-mark" aria-label="disabled"></span>
  </button>
</template>

<style scoped>
.timeline-action-block {
  --action-accent: #a5a5a8;
  --action-fill: color-mix(in srgb, var(--action-accent) 15%, transparent);
  position: absolute;
  top: 55px;
  height: 50px;
  min-width: 48px;
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
  cursor: default;
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
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-mark {
  position: absolute;
  top: 3px;
  width: 9px;
  height: 9px;
  opacity: 0.9;
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

:global(html[data-theme='light']) .timeline-action-block {
  color: var(--ea-action-fg, #1a1b1e);
  text-shadow: none;
}

:global(html[data-theme='light']) .timeline-action-block:hover {
  filter: brightness(1.04);
}
</style>
