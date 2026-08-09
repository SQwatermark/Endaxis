<script setup lang="ts">
/**
 * Next 时间轴单轨固定头部，只展示目录身份和稳定配装槽位。
 * 选择、排序和编辑动作由父层 command 处理，本组件不修改项目对象。
 */
import type { TimelineTrackViewModel } from '../timelineEditorViewModel';
import type { LoadoutGearSlot } from '../loadoutBuildViewModel';

defineProps<{
  track: TimelineTrackViewModel;
  name: string;
  selected: boolean;
  weaponIcon: string | null;
  gearIcons: Readonly<Record<LoadoutGearSlot, string | null>>;
  labels: Record<'weapon' | LoadoutGearSlot, string>;
}>();

defineEmits<{
  select: [];
  weapon: [];
  gear: [slot: LoadoutGearSlot];
}>();
</script>

<template>
  <div class="track-header" :class="{ 'is-selected': selected }" @click="$emit('select')">
    <span class="reorder-column" aria-hidden="true">
      <span>⌃</span><span class="drag-handle">⠿</span><span>⌄</span>
    </span>
    <span v-if="track.operatorSlug" class="operator-content">
      <img class="avatar" :src="`/operators/${track.operatorSlug}/avatar.webp`" alt="" />
      <span class="operator-summary">
        <span class="operator-name">{{ name }}</span>
        <span class="loadout-row">
          <button
            type="button"
            class="weapon-slot"
            :class="{ empty: weaponIcon === null }"
            :title="labels.weapon"
            @click.stop="$emit('weapon')"
          >
            <img v-if="weaponIcon" :src="weaponIcon" alt="" />
            <span v-else aria-hidden="true">+</span>
          </button>
          <button
            v-for="slot in ['armor', 'gloves', 'accessory1', 'accessory2'] as const"
            :key="slot"
            type="button"
            class="gear-slot"
            :class="{ empty: gearIcons[slot] === null }"
            :title="labels[slot]"
            @click.stop="$emit('gear', slot)"
          >
            <img v-if="gearIcons[slot]" :src="gearIcons[slot]!" alt="" />
            <span v-else aria-hidden="true">+</span>
          </button>
        </span>
      </span>
    </span>
    <span v-else class="empty-track"><span class="empty-avatar">+</span>{{ name }}</span>
  </div>
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
  padding: 0;
  overflow: hidden;
  border: 2px solid var(--ea-keycap-border, var(--ea-border-strong));
  border-radius: 6px;
  background: var(--ea-keycap-bg, var(--ea-fill-soft));
  color: var(--ea-icon-muted);
  cursor: pointer;
}

.weapon-slot.empty,
.gear-slot.empty {
  border-style: dashed;
}

.weapon-slot:hover {
  border-color: var(--ea-gold);
}

.gear-slot:hover {
  border-color: #2dd4bf;
}

.weapon-slot img,
.gear-slot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
