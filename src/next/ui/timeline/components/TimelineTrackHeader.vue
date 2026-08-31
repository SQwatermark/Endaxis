<script setup lang="ts">
/**
 * Next 时间轴单轨固定头部，只展示定义身份和稳定配装槽位。
 * 选择、排序和编辑动作由父层 command 处理，本组件不修改项目对象。
 */
import type { TimelineTrackViewModel } from '../timelineEditorViewModel';
import type { LoadoutGearSlot } from '../loadoutBuildViewModel';
import OperatorSupportNotice from './OperatorSupportNotice.vue';
import CombatStatusIconStrip from './CombatStatusIconStrip.vue';
import type {
  CombatStatusDisplaySlot,
  CombatStatusIndicator,
} from '../../../core/projection/combatStatusIndicators';
import type { OperatorCombatHudSnapshot } from '../../../core/projection/combatHudSnapshot';

const props = defineProps<{
  track: TimelineTrackViewModel;
  name: string;
  selected: boolean;
  reorderSource: boolean;
  reorderTarget: boolean;
  weaponIcon: string | null;
  gearIcons: Readonly<Record<LoadoutGearSlot, string | null>>;
  labels: Record<'operator' | 'weapon' | LoadoutGearSlot, string>;
  activeGearSetLabel: string;
  canMoveUp: boolean;
  canMoveDown: boolean;
  statDetailsAvailable?: boolean;
  statDetailsError?: string | null;
  statusIndicators: readonly CombatStatusIndicator[];
  statusSlot: CombatStatusDisplaySlot;
  cursorFrame: number;
  hudSnapshot: OperatorCombatHudSnapshot | null;
  activeSkillLabel: string | null;
  skillButtons: readonly {
    action: 'battleSkill' | 'ultimate';
    skillKey: string;
    label: string;
    icon: string;
    cooldownRatio: number | null;
    cooldownKnown: boolean;
    progressRatio: number | null;
    weakProgress: boolean;
  }[];
}>();

const emit = defineEmits<{
  select: [];
  operator: [];
  moveUp: [];
  moveDown: [];
  reorderDragStart: [event: DragEvent];
  reorderDragEnd: [];
  reorderDragEnter: [];
  reorderDragLeave: [];
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

function leaveReorderTarget(event: DragEvent): void {
  const current = event.currentTarget as HTMLElement;
  if (event.relatedTarget instanceof Node && current.contains(event.relatedTarget)) return;
  emit('reorderDragLeave');
}

function formatHudNumber(value: number | null): string {
  return value === null ? '—' : String(Math.round(value));
}

function cooldownMask(ratio: number | null): string | undefined {
  if (ratio === null) return undefined;
  return `conic-gradient(rgb(8 9 11 / 82%) ${ratio * 360}deg, transparent 0deg)`;
}
</script>

<template>
  <div
    class="track-header"
    :class="{
      'is-selected': selected,
      'is-reorder-source': reorderSource,
      'is-reorder-target': reorderTarget,
    }"
    @click="selectHeader"
    @dragover.prevent
    @dragenter.prevent="$emit('reorderDragEnter')"
    @dragleave="leaveReorderTarget"
    @drop.prevent.stop="$emit('reorderDrop', $event)"
  >
    <span class="reorder-column">
      <button
        type="button"
        class="reorder-button"
        :disabled="!canMoveUp"
        :title="$t('common.moveUp')"
        :aria-label="$t('common.moveUp')"
        @click.stop="$emit('moveUp')"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
      </button>
      <span
        class="drag-handle"
        draggable="true"
        aria-hidden="true"
        @dragstart.stop="$emit('reorderDragStart', $event)"
        @dragend.stop="$emit('reorderDragEnd')"
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
        :aria-label="$t('common.moveDown')"
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
          :title="labels.operator"
          :aria-label="labels.operator"
          @click.stop="$emit('operator')"
        >
          <img
            class="avatar"
            :src="`/operators/${track.operatorAssetSlug ?? track.operatorSlug}/avatar.webp`"
            alt=""
          />
          <span class="avatar-change-hint" aria-hidden="true">↻</span>
        </button>
        <button
          v-else
          type="button"
          class="avatar-shell avatar-trigger"
          :title="labels.operator"
          :aria-label="labels.operator"
          @click.stop="$emit('operator')"
        >
          <span class="empty-avatar" aria-hidden="true"></span>
        </button>
        <span class="operator-name-row">
          <span class="operator-name">{{ name }}</span>
          <span v-if="hudSnapshot !== null" class="runtime-summary">
            <span class="runtime-energy">
              U {{ formatHudNumber(hudSnapshot.ultimateEnergy.current) }}/{{
                formatHudNumber(hudSnapshot.ultimateEnergy.maximum)
              }}
            </span>
            <span v-if="activeSkillLabel !== null" class="runtime-active" :title="activeSkillLabel">
              {{ activeSkillLabel }}
            </span>
            <span v-if="hudSnapshot.comboWindows.length > 0" class="runtime-combo">
              E×{{ hudSnapshot.comboWindows.length }}
            </span>
            <span v-if="hudSnapshot.cooldowns.length > 0" class="runtime-cooldown">
              CD×{{ hudSnapshot.cooldowns.length }}
            </span>
          </span>
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
      <span v-if="skillButtons.length > 0" class="skill-hud-buttons">
        <span
          v-for="button in skillButtons"
          :key="button.action"
          class="skill-hud-button"
          :class="[`is-${button.action}`, { 'is-cooldown-unknown': !button.cooldownKnown }]"
          :title="button.label"
        >
          <img :src="button.icon" alt="" />
          <span
            v-if="button.progressRatio !== null"
            class="skill-hud-button__progress"
            :class="{ 'is-weak': button.weakProgress }"
            :style="{ '--progress-angle': `${button.progressRatio * 360}deg` }"
          ></span>
          <span
            v-if="button.cooldownRatio !== null"
            class="skill-hud-button__cooldown"
            :style="{ background: cooldownMask(button.cooldownRatio) }"
          ></span>
          <span class="skill-hud-button__kind">{{
            button.action === 'battleSkill' ? 'C' : 'U'
          }}</span>
        </span>
      </span>
      <span v-if="track.operatorSlug" class="loadout-row">
        <button
          type="button"
          class="weapon-slot"
          :class="{ empty: weaponIcon === null }"
          :title="labels.weapon"
          :aria-label="labels.weapon"
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
          :aria-label="labels[slot]"
          @click.stop="$emit('gear', slot)"
        >
          <img v-if="gearIcons[slot]" :src="gearIcons[slot]!" alt="" />
          <span v-else aria-hidden="true">+</span>
        </button>
      </span>
      <span class="gear-hint-row">
        <span class="set-bonus-hint" :class="{ 'is-hidden': activeGearSetLabel === '' }">
          {{ activeGearSetLabel }}
        </span>
      </span>
      <CombatStatusIconStrip
        class="track-status-strip"
        :indicators="statusIndicators"
        :slot="statusSlot"
        :frame="cursorFrame"
      />
    </span>
  </div>
</template>

<style scoped>
.track-header {
  width: 180px;
  height: 100%;
  min-height: 160px;
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

.track-header.is-reorder-source {
  opacity: 0.48;
}

.track-header.is-reorder-target {
  outline: 2px solid var(--ea-gold);
  outline-offset: -2px;
  background: color-mix(in srgb, var(--ea-gold) 12%, var(--ea-workbench-panel));
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
  top: calc(50% - 72px);
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

.runtime-summary {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  margin-top: 2px;
  font:
    700 8px/10px 'Roboto Mono',
    monospace;
  white-space: nowrap;
}

.runtime-energy {
  color: var(--ea-energy-accent, #7dd3fc);
}

.runtime-active {
  min-width: 0;
  overflow: hidden;
  color: var(--ea-gold);
  text-overflow: ellipsis;
}

.runtime-combo {
  color: #52d3a9;
}

.runtime-cooldown {
  color: var(--ea-fg-faint, rgb(255 255 255 / 45%));
}

.stat-detail-button {
  position: absolute;
  top: calc(50% - 53px);
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

.skill-hud-buttons {
  position: absolute;
  top: calc(50% - 53px);
  left: 50px;
  display: flex;
  gap: 4px;
}

.skill-hud-button {
  position: relative;
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 52%);
  border-radius: 2px;
  background: #303238;
}

.skill-hud-button.is-ultimate {
  border-color: color-mix(in srgb, var(--ea-energy-accent, #7dd3fc) 72%, #aaa);
}

.skill-hud-button.is-cooldown-unknown {
  border-style: dashed;
}

.skill-hud-button img,
.skill-hud-button__progress,
.skill-hud-button__cooldown {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.skill-hud-button img {
  object-fit: cover;
}

.skill-hud-button__progress {
  z-index: 1;
  background: conic-gradient(
    color-mix(in srgb, var(--ea-gold) 72%, transparent) var(--progress-angle),
    transparent 0
  );
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ea-gold) 70%, transparent);
}

.skill-hud-button__progress.is-weak {
  opacity: 0.45;
}

.skill-hud-button__cooldown {
  z-index: 2;
}

.skill-hud-button__kind {
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 0;
  min-width: 7px;
  background: rgb(0 0 0 / 76%);
  color: #fff;
  font:
    700 7px/8px 'Roboto Mono',
    monospace;
  text-align: center;
}

.loadout-row {
  position: absolute;
  left: 6px;
  top: calc(50% + 24px);
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.gear-hint-row {
  position: absolute;
  left: 6px;
  top: calc(50% + 58px);
  width: calc(100% - 12px);
  height: 22px;
}

.track-status-strip {
  position: absolute;
  top: calc(50% + 3px);
  left: 58px;
  right: 4px;
  overflow: visible;
}

.set-bonus-hint {
  display: block;
  height: 22px;
  margin-left: 36px;
  overflow: hidden;
  color: #2dd4bf;
  font-size: 12px;
  font-weight: 800;
  line-height: 22px;
  letter-spacing: 0.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.6;
  user-select: none;
}

.set-bonus-hint.is-hidden {
  visibility: hidden;
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
