<script setup lang="ts">
/**
 * Next 时间轴单轨固定头部，只展示目录身份和稳定配装槽位。
 * 选择、排序和编辑动作由父层 command 处理，本组件不修改项目对象。
 */
import type { TimelineTrackViewModel } from '../timelineEditorViewModel';

defineProps<{
  track: TimelineTrackViewModel;
  name: string;
  selected: boolean;
}>();

defineEmits<{ select: [] }>();
</script>

<template>
  <button
    class="track-header"
    :class="{ 'is-selected': selected }"
    type="button"
    @click="$emit('select')"
  >
    <span class="reorder-column" aria-hidden="true">
      <span>⌃</span><span class="drag-handle">⠿</span><span>⌄</span>
    </span>
    <span v-if="track.operatorSlug" class="operator-content">
      <img class="avatar" :src="`/operators/${track.operatorSlug}/avatar.webp`" alt="" />
      <span class="operator-summary">
        <span class="operator-name">{{ name }}</span>
        <span class="loadout-row">
          <span class="weapon-slot">+</span>
          <span v-for="slot in 4" :key="slot" class="gear-slot">+</span>
        </span>
      </span>
    </span>
    <span v-else class="empty-track"><span class="empty-avatar">+</span>{{ name }}</span>
  </button>
</template>

<style scoped>
.track-header {
  width: 180px;
  height: 160px;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  align-items: center;
  padding: 0;
  border: 0;
  border-bottom: 1px solid var(--ea-border-soft);
  border-right: 3px solid transparent;
  border-radius: 0;
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
  text-align: left;
  cursor: pointer;
}

.track-header.is-selected {
  border-right-color: var(--ea-gold);
  background: var(--ea-track-row-active);
}

.reorder-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--ea-icon-muted);
  font-size: 11px;
}

.drag-handle {
  font-size: 16px;
}

.operator-content {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 9px;
}

.avatar,
.empty-avatar {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 2px solid var(--ea-border-strong);
  border-radius: 50%;
  object-fit: cover;
}

.operator-summary {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.operator-name {
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.loadout-row {
  display: flex;
  align-items: center;
  gap: 3px;
}

.weapon-slot,
.gear-slot {
  display: grid;
  place-items: center;
  box-sizing: border-box;
  border: 1px dashed var(--ea-border-strong);
  color: var(--ea-icon-muted);
}

.weapon-slot {
  width: 32px;
  height: 32px;
}

.gear-slot {
  width: 22px;
  height: 22px;
}

.empty-track {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--ea-fg-secondary);
  font-size: 14px;
  font-weight: 700;
}

.empty-avatar {
  display: grid;
  place-items: center;
  border-style: dashed;
  font-size: 24px;
  font-weight: 400;
}
</style>
