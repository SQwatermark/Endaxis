<script setup lang="ts">
/**
 * Next 时间轴单轨固定头部，只展示定义身份和稳定配装槽位。
 * 选择、排序和编辑动作由父层 command 处理，本组件不修改项目对象。
 */
import type { TimelineTrackViewModel } from '../timelineEditorViewModel';
import type { LoadoutGearSlot } from '../loadoutBuildViewModel';
import OperatorSupportNotice from './OperatorSupportNotice.vue';

const props = defineProps<{
  track: TimelineTrackViewModel;
  name: string;
  selected: boolean;
  weaponIcon: string | null;
  gearIcons: Readonly<Record<LoadoutGearSlot, string | null>>;
  labels: Record<'weapon' | LoadoutGearSlot, string>;
  canMoveUp: boolean;
  canMoveDown: boolean;
  statDetailsAvailable?: boolean;
  statDetailsError?: string | null;
}>();

const emit = defineEmits<{
  select: [];
  operator: [];
  moveUp: [];
  moveDown: [];
  reorderDragStart: [event: DragEvent];
  reorderDrop: [event: DragEvent];
  stats: [];
  weapon: [];
  gear: [slot: LoadoutGearSlot];
  updateInitialUltimateEnergy: [value: number];
}>();

function selectHeader(): void {
  emit('select');
  if (props.track.operatorSlug === null) emit('operator');
}

function updateInitialUltimateEnergy(event: Event): void {
  const maximum = props.track.maxUltimateEnergy;
  if (maximum === null) return;
  const input = event.target as HTMLInputElement;
  const value = Number(input.value);
  if (!Number.isFinite(value)) {
    input.value = String(props.track.initialUltimateEnergy);
    return;
  }
  emit('updateInitialUltimateEnergy', Math.min(maximum, Math.max(0, value)));
}
</script>

<template>
  <div
    class="track-header"
    :class="{ 'is-selected': selected }"
    @click="selectHeader"
    @dragover.prevent
    @drop.prevent.stop="$emit('reorderDrop', $event)"
  >
    <span class="reorder-column">
      <button
        type="button"
        class="reorder-button"
        :disabled="!canMoveUp"
        :title="$t('common.moveUp')"
        @click.stop="$emit('moveUp')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
      </button>
      <span
        class="drag-handle"
        draggable="true"
        @dragstart.stop="$emit('reorderDragStart', $event)"
      >
        <svg viewBox="0 0 24 24">
          <circle cx="8" cy="4" r="2" />
          <circle cx="8" cy="12" r="2" />
          <circle cx="8" cy="20" r="2" />
          <circle cx="16" cy="4" r="2" />
          <circle cx="16" cy="12" r="2" />
          <circle cx="16" cy="20" r="2" />
        </svg>
      </span>
      <button
        type="button"
        class="reorder-button"
        :disabled="!canMoveDown"
        :title="$t('common.moveDown')"
        @click.stop="$emit('moveDown')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
      </button>
    </span>
    <span class="identity-body">
      <label v-if="track.operatorSlug" class="initial-energy-control" @click.stop>
        <span>{{ $t('timelineGrid.track.initialGaugeShort') }}</span>
        <input
          type="number"
          min="0"
          :max="track.maxUltimateEnergy ?? undefined"
          step="1"
          :value="track.initialUltimateEnergy"
          :disabled="track.maxUltimateEnergy === null"
          @change="updateInitialUltimateEnergy"
        />
        <span>/{{ track.maxUltimateEnergy ?? '?' }}</span>
      </label>
      <span class="operator-row">
        <button
          v-if="track.operatorSlug"
          type="button"
          class="avatar-shell avatar-trigger"
          @click.stop="$emit('operator')"
        >
          <img class="avatar" :src="`/operators/${track.operatorSlug}/avatar.webp`" alt="" />
          <span class="avatar-change-hint" aria-hidden="true">↻</span>
        </button>
        <span v-else class="avatar-shell"
          ><span class="empty-avatar" aria-hidden="true"></span
        ></span>
        <span class="operator-name-row">
          <span class="operator-name">{{ name }}</span>
          <OperatorSupportNotice
            v-if="track.operatorSlug"
            :support="track.operatorSupport"
            compact
          />
        </span>
      </span>
      <button
        v-if="track.operatorSlug"
        type="button"
        class="stat-detail-button"
        :disabled="!statDetailsAvailable"
        :title="
          statDetailsError
            ? $t('nextTimeline.panel.unavailable', { reason: statDetailsError })
            : $t('statDetail.button')
        "
        @click.stop="$emit('stats')"
      >
        {{ $t('statDetail.button') }}
      </button>
      <span v-if="track.operatorSlug" class="loadout-row">
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
  gap: 2px;
  color: var(--ea-icon-muted);
  font-size: 11px;
}

.reorder-button,
.drag-handle {
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: inherit;
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.reorder-button {
  cursor: pointer;
}

.reorder-button:hover:not(:disabled) {
  background: var(--ea-fill-soft);
  color: var(--ea-fg-secondary);
}

.reorder-button:disabled {
  opacity: 0.2;
}

.reorder-button svg,
.drag-handle svg {
  width: 12px;
  height: 12px;
  fill: currentColor;
}

.reorder-button svg {
  fill: none;
  stroke: currentColor;
  stroke-width: 3;
}

.identity-body {
  position: relative;
  min-width: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 6px;
  box-sizing: border-box;
}

.initial-energy-control {
  position: absolute;
  top: 8px;
  left: 6px;
  display: flex;
  align-items: center;
  gap: 3px;
  color: var(--ea-energy-accent, #7dd3fc);
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
}

.initial-energy-control input {
  width: 38px;
  height: 18px;
  box-sizing: border-box;
  padding: 0 3px;
  border: 1px solid color-mix(in srgb, currentColor 45%, transparent);
  border-radius: 2px;
  outline: 0;
  background: var(--ea-fill-input);
  color: inherit;
  font:
    700 10px/16px 'Roboto Mono',
    Consolas,
    monospace;
  text-align: center;
}

.initial-energy-control input:focus {
  border-color: currentColor;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 25%, transparent);
}

.initial-energy-control input:disabled {
  opacity: 0.45;
}

.operator-row {
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  color: inherit;
  text-align: left;
}

.avatar-shell {
  position: relative;
  flex: 0 0 auto;
  margin-right: 8px;
}

.avatar-trigger {
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.avatar,
.empty-avatar {
  display: block;
  width: 44px;
  height: 44px;
  border: 2px solid var(--ea-border-strong);
  border-radius: 50%;
  box-sizing: border-box;
  object-fit: cover;
}

.empty-avatar {
  position: relative;
  border-style: dashed;
  background: var(--ea-keycap-bg, var(--ea-fill-soft));
}

.empty-avatar::before,
.empty-avatar::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: 2px;
  border-radius: 1px;
  background: var(--ea-icon-muted);
  transform: translate(-50%, -50%);
}

.empty-avatar::after {
  transform: translate(-50%, -50%) rotate(90deg);
}

.avatar-change-hint {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.62);
  color: #fff;
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.15s;
}

.avatar-trigger:hover .avatar-change-hint {
  opacity: 1;
}

.avatar-trigger:hover .avatar {
  border-color: var(--ea-gold);
}

.operator-name {
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.operator-name-row {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  padding-right: 20px;
}

.stat-detail-button {
  position: absolute;
  top: 27px;
  right: 6px;
  height: 18px;
  padding: 0 7px;
  border: 1px solid color-mix(in srgb, var(--ea-gold) 40%, transparent);
  border-radius: 0;
  background: color-mix(in srgb, var(--ea-gold) 12%, transparent);
  color: var(--ea-gold);
  font-size: 10px;
  font-weight: 700;
  line-height: 16px;
}

.stat-detail-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.loadout-row {
  position: absolute;
  left: 6px;
  top: calc(50% + 33px);
  display: flex;
  align-items: flex-end;
  gap: 4px;
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
</style>
