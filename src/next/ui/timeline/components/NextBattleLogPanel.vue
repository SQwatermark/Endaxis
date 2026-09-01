<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  CombatReceiptEntry,
  CombatReceiptValue,
} from '../../../core/combat/receipt/combatReceipt';
import {
  projectTimelineBattleLogGroups,
  type TimelineBattleLogCastOwner,
  type TimelineBattleLogGroup,
} from '../timelineBattleLogProjection';
import {
  matchTimelineBattleLogPreset,
  resolveTimelineBattleLogPreset,
  TIMELINE_BATTLE_LOG_PRESETS,
  type TimelineBattleLogPresetId,
} from '../timelineBattleLogFilterPresets';
import { summarizeTimelineBattleLogEntry } from '../timelineBattleLogEntrySummary';

const props = defineProps<{
  entries: readonly CombatReceiptEntry[];
  eventLabel: (event: string) => string;
  damageTypeLabel: (damageType: string) => string;
  castOwners: readonly TimelineBattleLogCastOwner[];
}>();

const emit = defineEmits<{
  locate: [frame: number, castId: string | null];
}>();
const { t } = useI18n({ useScope: 'global' });

const snapshot = ref<readonly CombatReceiptEntry[]>([]);
const dirty = ref(false);
const keyword = ref('');
const selectedEvents = ref<ReadonlySet<string>>(new Set());
const limit = ref<200 | 500 | 'all'>(200);
const openGroupKey = ref<string | null>(null);

const availableEvents = computed(() =>
  [...new Set(snapshot.value.map(entry => entry.event))].sort(),
);
const normalizedKeyword = computed(() => keyword.value.trim().toLocaleLowerCase());
const filteredEntries = computed(() => {
  const allowed = selectedEvents.value;
  const query = normalizedKeyword.value;
  if (availableEvents.value.length > 0 && allowed.size === 0) return [];
  const matched = snapshot.value.filter(entry => {
    if (!allowed.has(entry.event)) return false;
    if (query.length === 0) return true;
    return JSON.stringify(entry).toLocaleLowerCase().includes(query);
  });
  return limit.value === 'all' ? matched : matched.slice(-limit.value);
});
const groupedEntries = computed(() =>
  projectTimelineBattleLogGroups(filteredEntries.value, props.castOwners),
);
const activePreset = computed(() =>
  matchTimelineBattleLogPreset(selectedEvents.value, availableEvents.value),
);

watch(
  () => props.entries,
  entries => {
    if (snapshot.value.length === 0) {
      snapshot.value = entries;
      selectedEvents.value = new Set(entries.map(entry => entry.event));
    } else if (snapshot.value !== entries) dirty.value = true;
  },
  { immediate: true },
);

function refresh(): void {
  const previous = selectedEvents.value;
  snapshot.value = props.entries;
  const events = new Set(props.entries.map(entry => entry.event));
  selectedEvents.value = new Set([...previous].filter(event => events.has(event)));
  if (selectedEvents.value.size === 0) selectedEvents.value = events;
  dirty.value = false;
}

function toggleEvent(event: string): void {
  const next = new Set(selectedEvents.value);
  if (next.has(event)) next.delete(event);
  else next.add(event);
  selectedEvents.value = next;
}

function applyPreset(presetId: TimelineBattleLogPresetId): void {
  selectedEvents.value = new Set(resolveTimelineBattleLogPreset(presetId, availableEvents.value));
}

function clearEvents(): void {
  selectedEvents.value = new Set();
}

function formatTime(frame: number): string {
  const sign = frame < 0 ? '-' : '';
  const absolute = Math.abs(frame);
  return `${sign}${Math.floor(absolute / 30)}.${String(absolute % 30).padStart(2, '0')}`;
}

function formatValue(value: CombatReceiptValue): string {
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? String(value)
      : value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  }
  return String(value);
}

function entrySummary(entry: CombatReceiptEntry): string {
  return summarizeTimelineBattleLogEntry(entry, {
    damageTypeLabel: props.damageTypeLabel,
    formatValue,
    overhealingLabel: value => t('battleLog.receiptDetails.overhealing', { value }),
    semanticLabel: (group, value) => {
      const key = `battleLog.receiptDetails.${group}.${value}`;
      const translated = t(key);
      return translated === key ? value : translated;
    },
  });
}

const ownerByCastId = computed(() => new Map(props.castOwners.map(owner => [owner.castId, owner])));
const ownerBySourceId = computed(() => {
  const result = new Map<string, TimelineBattleLogCastOwner>();
  for (const owner of props.castOwners) {
    if (owner.sourceId !== null && !result.has(owner.sourceId)) result.set(owner.sourceId, owner);
  }
  return result;
});

function sourceLabel(entry: CombatReceiptEntry): string {
  const castId = entry.data?.castId;
  if (typeof castId === 'string') {
    const owner = ownerByCastId.value.get(castId);
    if (owner !== undefined) return `${owner.operatorLabel} · ${owner.label}`;
  }
  if (entry.sourceId !== undefined) {
    return ownerBySourceId.value.get(entry.sourceId)?.operatorLabel ?? entry.sourceId;
  }
  return '—';
}

type BattleLogSectionKind = 'damage' | 'effects' | 'sp' | 'gauge' | 'stagger' | 'other';

interface BattleLogSection {
  readonly kind: BattleLogSectionKind;
  readonly entries: readonly CombatReceiptEntry[];
}

const SECTION_ORDER: readonly BattleLogSectionKind[] = [
  'damage',
  'effects',
  'sp',
  'gauge',
  'stagger',
  'other',
];

function sectionKind(event: string): BattleLogSectionKind {
  if (event.includes('Damage') || event.includes('Healing')) return 'damage';
  if (event === 'SpChanged') return 'sp';
  if (event === 'UltimateEnergyChanged') return 'gauge';
  if (event.includes('Poise')) return 'stagger';
  if (
    event.startsWith('Buff') ||
    event.startsWith('Status') ||
    event.startsWith('Elemental') ||
    event.startsWith('SpellBurst') ||
    event.startsWith('AbilityEntity') ||
    event.startsWith('TimeDilation') ||
    event.startsWith('ComboWindow')
  ) {
    return 'effects';
  }
  return 'other';
}

function groupSections(entries: readonly CombatReceiptEntry[]): readonly BattleLogSection[] {
  const sections = new Map<BattleLogSectionKind, CombatReceiptEntry[]>();
  for (const entry of entries) {
    const kind = sectionKind(entry.event);
    const bucket = sections.get(kind) ?? [];
    bucket.push(entry);
    sections.set(kind, bucket);
  }
  return SECTION_ORDER.flatMap(kind => {
    const bucket = sections.get(kind);
    return bucket === undefined ? [] : [{ kind, entries: bucket }];
  });
}

function groupAccent(kind: 'cast' | 'operator' | 'runtime'): string {
  if (kind === 'cast') return 'var(--ea-gold)';
  if (kind === 'operator') return '#7dd3fc';
  return '#94a3b8';
}

function toggleGroup(key: string, event: Event): void {
  event.preventDefault();
  openGroupKey.value = openGroupKey.value === key ? null : key;
}

function locateGroup(group: TimelineBattleLogGroup, event: MouseEvent): void {
  if (group.castId === null) {
    toggleGroup(group.key, event);
    return;
  }
  // 复刻旧版：点击可定位的技能卡会保持展开，并把时间轴焦点移到该技能。
  event.preventDefault();
  openGroupKey.value = group.key;
  emit('locate', group.firstFrame, group.castId);
}

function locateEntry(group: TimelineBattleLogGroup, entry: CombatReceiptEntry): void {
  if (group.castId !== null) emit('locate', entry.frame, group.castId);
}
</script>

<template>
  <section class="simlog-panel">
    <header class="simlog-panel-header">
      <div class="header-main-row">
        <div class="header-title">
          <span class="header-icon-bar" />
          <strong>{{ $t('timeline.activityBar.battleLog') }}</strong>
        </div>
        <div class="header-actions">
          <span v-if="dirty" class="simlog-dirty">{{ $t('battleLog.dirtyHint') }}</span>
          <button type="button" class="log-button log-button--refresh" @click="refresh">
            {{ $t('battleLog.refresh') }}
          </button>
        </div>
      </div>
      <div class="header-divider" />
    </header>

    <div class="simlog-filters simlog-block">
      <div class="simlog-filter-top">
        <span class="simlog-filter-label">
          {{ $t('battleLog.ui.filtered') }} {{ filteredEntries.length }} /
          {{ $t('battleLog.ui.actionGroups') }} {{ groupedEntries.length }}
        </span>
        <button type="button" class="log-button log-button--tool" @click="clearEvents">
          {{ $t('battleLog.ui.clear') }}
        </button>
      </div>

      <div class="simlog-presets">
        <span class="simlog-filter-label">{{ $t('battleLog.presets.label') }}</span>
        <div class="simlog-presets__list">
          <button
            v-for="preset in TIMELINE_BATTLE_LOG_PRESETS"
            :key="preset.id"
            type="button"
            class="log-button log-button--preset"
            :class="{ 'is-active': activePreset === preset.id }"
            @click="applyPreset(preset.id)"
          >
            {{ $t(preset.i18nKey) }}
          </button>
        </div>
      </div>

      <div class="simlog-types-row">
        <span class="simlog-filter-label">{{ $t('battleLog.ui.types') }}</span>
        <div class="simlog-types">
          <button
            v-for="event in availableEvents"
            :key="event"
            type="button"
            class="log-button log-button--chip"
            :class="{ 'is-active': selectedEvents.has(event) }"
            :title="event"
            @click="toggleEvent(event)"
          >
            {{ eventLabel(event) }}
          </button>
        </div>
      </div>

      <div class="simlog-filter-bottom">
        <input
          v-model="keyword"
          class="simlog-search"
          type="search"
          :placeholder="$t('battleLog.searchPlaceholder')"
        />
        <label class="simlog-limit">
          <span class="simlog-filter-label">{{ $t('battleLog.limit') }}</span>
          <select v-model="limit">
            <option value="all">{{ $t('battleLog.ui.allResults') }}</option>
            <option :value="200">200</option>
            <option :value="500">500</option>
          </select>
        </label>
      </div>
    </div>

    <div class="simlog-body">
      <div v-if="groupedEntries.length === 0" class="simlog-empty simlog-block">
        {{ $t('battleLog.ui.noResults') }}
      </div>
      <div v-else class="group-list">
        <details
          v-for="group in groupedEntries"
          :key="group.key"
          class="group simlog-block"
          :open="openGroupKey === group.key"
          :style="{ '--group-accent': groupAccent(group.kind) }"
        >
          <summary
            class="group__summary"
            :class="{ 'is-jumpable': group.castId !== null }"
            :title="group.castId === null ? undefined : $t('battleLog.ui.jumpToTimeline')"
            @click="locateGroup(group, $event)"
          >
            <div class="group__summary-main">
              <div class="group__title-row">
                <span class="group__actor">{{ group.secondaryLabel }}</span>
                <span class="group__title-sep">·</span>
                <span class="group__action">{{ group.label }}</span>
              </div>
              <div class="group__timing">
                <span class="group__timing-item">
                  <span class="group__timing-label">{{ $t('battleLog.ui.start') }}</span>
                  <span class="group__timing-value">{{ formatTime(group.firstFrame) }}</span>
                </span>
                <span class="group__timing-item">
                  <span class="group__timing-label">{{ $t('battleLog.ui.end') }}</span>
                  <span class="group__timing-value">{{ formatTime(group.lastFrame) }}</span>
                </span>
              </div>
              <div class="group__stats">
                <span v-if="group.damage > 0" class="group__stat">
                  <span class="group__stat-label">{{ $t('battleLog.summary.damage') }}</span>
                  <span class="group__stat-sep">:</span>
                  <span class="group__stat-value">{{ formatValue(group.damage) }}</span>
                </span>
                <span class="group__stat">
                  <span class="group__stat-label">{{ $t('battleLog.ui.lines') }}</span>
                  <span class="group__stat-sep">:</span>
                  <span class="group__stat-value">{{ group.entries.length }}</span>
                </span>
              </div>
            </div>
          </summary>

          <div class="group__body">
            <section
              v-for="section in groupSections(group.entries)"
              :key="section.kind"
              class="group-section"
              :class="`group-section--${section.kind}`"
            >
              <div class="group-section__heading">
                <span class="group-section__title">{{
                  $t(`battleLog.ui.sections.${section.kind}`)
                }}</span>
                <span class="group-section__count">{{ section.entries.length }}</span>
              </div>
              <div class="group-section__list">
                <button
                  v-for="entry in section.entries"
                  :key="entry.sequence"
                  type="button"
                  class="event-row"
                  :class="{ 'is-jumpable': group.castId !== null }"
                  :disabled="group.castId === null"
                  :title="group.castId === null ? entry.event : $t('battleLog.ui.jumpToTimeline')"
                  @click="locateEntry(group, entry)"
                >
                  <time class="event-row__time">{{ formatTime(entry.frame) }}</time>
                  <span class="event-pill">{{ eventLabel(entry.event) }}</span>
                  <span v-if="entrySummary(entry)" class="event-text">{{
                    entrySummary(entry)
                  }}</span>
                  <span v-if="entry.sourceId" class="event-muted" :title="entry.sourceId">
                    {{ sourceLabel(entry) }}
                  </span>
                </button>
              </div>
            </section>
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.simlog-panel {
  --right-panel-container-radius: 0;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--ea-workbench-panel, #252525);
  color: var(--ea-fg, #f0f0f0);
}
.simlog-panel-header {
  flex: none;
  padding: 15px 15px 0;
}
.header-main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.header-title,
.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-title strong {
  font-size: 18px;
}
.header-icon-bar {
  width: 4px;
  height: 18px;
  background: var(--ea-gold);
}
.header-divider {
  height: 2px;
  margin-top: 3px;
  background: linear-gradient(90deg, var(--ea-gold), transparent);
  opacity: 0.3;
}
.simlog-dirty {
  padding: 1px 6px;
  border: 1px solid color-mix(in srgb, var(--ea-gold) 20%, transparent);
  background: color-mix(in srgb, var(--ea-gold) 8%, transparent);
  color: var(--ea-gold);
  font-size: 10px;
  font-weight: 700;
}
.simlog-block {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-left: 3px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.18);
}
.simlog-filters {
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 8px 14px 0;
  padding: 10px 12px;
}
.simlog-filter-top,
.simlog-filter-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.simlog-filter-label {
  flex: none;
  color: var(--ea-fg-muted, #999);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.simlog-presets,
.simlog-types-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
}
.simlog-presets {
  padding: 8px 10px;
  border: 1px solid rgba(56, 189, 248, 0.12);
  background: rgba(56, 189, 248, 0.04);
}
.simlog-presets > .simlog-filter-label,
.simlog-types-row > .simlog-filter-label {
  margin-top: 5px;
}
.simlog-presets > .simlog-filter-label {
  color: #7dd3fc;
}
.simlog-presets__list,
.simlog-types {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}
.log-button,
.simlog-search,
.simlog-limit select {
  border: 1px solid var(--ea-border-strong, rgba(255, 255, 255, 0.12));
  border-radius: 0;
  background: var(--ea-fill-input, rgba(0, 0, 0, 0.18));
  color: var(--ea-fg-secondary, #ccc);
}
.log-button {
  min-height: 24px;
  padding: 4px 10px;
  font-size: 10px;
  cursor: pointer;
}
.log-button:hover {
  border-color: color-mix(in srgb, var(--ea-gold) 42%, transparent);
  color: var(--ea-fg, #fff);
}
.log-button--preset {
  border-color: rgba(56, 189, 248, 0.28);
  background: rgba(56, 189, 248, 0.1);
  color: #7dd3fc;
}
.log-button--preset.is-active {
  border-color: rgba(56, 189, 248, 0.55);
  background: rgba(56, 189, 248, 0.2);
}
.log-button--chip.is-active {
  border-color: color-mix(in srgb, var(--ea-gold) 42%, transparent);
  background: color-mix(in srgb, var(--ea-gold) 12%, transparent);
  color: var(--ea-gold);
}
.simlog-search {
  flex: 1;
  min-width: 0;
  height: 30px;
  padding: 0 12px;
  outline: none;
  font-family: 'Roboto Mono', Consolas, monospace;
}
.simlog-search:focus {
  border-color: color-mix(in srgb, var(--ea-gold) 45%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ea-gold) 16%, transparent) inset;
}
.simlog-limit {
  display: flex;
  align-items: center;
  gap: 6px;
}
.simlog-limit select {
  height: 30px;
  padding: 0 8px;
}
.simlog-body {
  min-height: 0;
  flex: 1;
  overflow: auto;
  padding: 10px 14px 14px;
  scrollbar-width: none;
}
.simlog-body::-webkit-scrollbar {
  display: none;
}
.group-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.group {
  overflow: hidden;
  border-left-color: color-mix(in srgb, var(--group-accent) 72%, rgba(255, 255, 255, 0.16));
}
.group__summary {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 10px 12px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}
.group__summary::-webkit-details-marker {
  display: none;
}
.group__summary:hover {
  background: rgba(255, 255, 255, 0.025);
}
.group__summary.is-jumpable:hover .group__action {
  color: var(--ea-fg, #fff);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.group__summary-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.group__title-row,
.group__timing,
.group__stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.group__title-row {
  gap: 6px;
  min-width: 0;
  flex-wrap: nowrap;
}
.group__actor {
  flex: none;
  color: var(--ea-fg, #fff);
  font-size: 13px;
  font-weight: 700;
}
.group__title-sep {
  color: var(--ea-fg-faint, #666);
}
.group__action {
  min-width: 0;
  overflow: hidden;
  color: color-mix(in srgb, var(--group-accent) 72%, var(--ea-fg, #fff));
  font-size: 14px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: 0 0 8px color-mix(in srgb, var(--group-accent) 32%, transparent);
}
.group__timing {
  gap: 12px;
  color: var(--ea-fg-muted, #777);
  font-size: 11px;
}
.group__timing-item,
.group__stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.group__timing-value,
.group__stat-value {
  color: var(--ea-fg-secondary, #bcbcbc);
  font-family: 'Roboto Mono', Consolas, monospace;
}
.group__stats {
  gap: 14px;
}
.group__stat {
  gap: 4px;
  color: var(--ea-fg-muted, #888);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}
.group__body {
  padding: 10px 12px;
}
.group-section {
  --section-accent: rgba(255, 255, 255, 0.36);
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.group-section:first-child {
  padding-top: 0;
  border-top: 0;
}
.group-section--damage {
  --section-accent: var(--ea-danger-soft, #f87171);
}
.group-section--effects {
  --section-accent: var(--ea-info, #38bdf8);
}
.group-section--sp {
  --section-accent: var(--ea-gold);
}
.group-section--gauge {
  --section-accent: #f59e0b;
}
.group-section--stagger {
  --section-accent: #fb7185;
}
.group-section--other {
  --section-accent: #94a3b8;
}
.group-section__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.group-section__title {
  color: var(--ea-fg-secondary, rgba(255, 255, 255, 0.72));
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.group-section__count {
  color: var(--ea-fg-faint, #666);
  font:
    10px 'Roboto Mono',
    Consolas,
    monospace;
}
.event-row {
  width: 100%;
  min-height: 24px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--ea-fg-secondary, rgba(255, 255, 255, 0.84));
  text-align: left;
}
.event-row + .event-row {
  border-top: 1px dashed rgba(255, 255, 255, 0.04);
}
.event-row.is-jumpable {
  margin: 0 -4px;
  width: calc(100% + 8px);
  padding-right: 4px;
  padding-left: 4px;
  cursor: pointer;
}
.event-row.is-jumpable:hover {
  background: rgba(255, 255, 255, 0.04);
}
.event-row:disabled {
  opacity: 1;
}
.event-row__time,
.event-muted {
  color: var(--ea-fg-muted, #777);
  font:
    11px 'Roboto Mono',
    Consolas,
    monospace;
}
.event-pill {
  min-height: 18px;
  display: inline-flex;
  align-items: center;
  padding: 0 6px;
  border: 1px solid color-mix(in srgb, var(--section-accent) 28%, rgba(255, 255, 255, 0.08));
  border-radius: 2px;
  background: color-mix(in srgb, var(--section-accent) 10%, transparent);
  color: color-mix(in srgb, var(--section-accent) 62%, var(--ea-fg, #fff));
  font-size: 10px;
  font-weight: 700;
}
.event-text {
  color: var(--ea-fg, rgba(255, 255, 255, 0.9));
  font-size: 12px;
}
.simlog-empty {
  padding: 24px 12px;
  text-align: center;
  color: var(--ea-fg-muted, #777);
}
</style>
