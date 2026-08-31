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

const availableEvents = computed(() =>
  [...new Set(snapshot.value.map(entry => entry.event))].sort(),
);
const normalizedKeyword = computed(() => keyword.value.trim().toLocaleLowerCase());
const filteredEntries = computed(() => {
  const allowed = selectedEvents.value;
  const query = normalizedKeyword.value;
  const matched = snapshot.value.filter(entry => {
    if (allowed.size > 0 && !allowed.has(entry.event)) return false;
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

function receiptFieldLabel(field: string): string {
  const key = `battleLog.receiptFields.${field}`;
  const translated = t(key);
  return translated === key ? field : translated;
}

function receiptFieldValue(field: string, value: CombatReceiptValue): string {
  if (
    typeof value === 'string' &&
    [
      'damageType',
      'requestedElement',
      'previousElement',
      'currentElement',
      'consumedElement',
    ].includes(field)
  ) {
    return props.damageTypeLabel(value);
  }
  if (typeof value === 'string' && field === 'reason') {
    const key = `battleLog.receiptDetails.reason.${value}`;
    const translated = t(key);
    if (translated !== key) return translated;
  }
  if (typeof value === 'string' && field === 'outcomeKind') {
    const key = `battleLog.receiptDetails.inflictionOutcome.${value}`;
    const translated = t(key);
    if (translated !== key) return translated;
  }
  return formatValue(value);
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
</script>

<template>
  <section class="battle-log-panel">
    <header>
      <div>
        <strong>{{ $t('timeline.activityBar.battleLog') }}</strong
        ><span>{{ snapshot.length }}</span>
      </div>
      <button
        type="button"
        :class="{ dirty }"
        :title="dirty ? $t('battleLog.dirtyHint') : ''"
        @click="refresh"
      >
        {{ $t('battleLog.refresh') }}<span v-if="dirty"> ●</span>
      </button>
    </header>
    <div class="battle-log-tools">
      <input v-model="keyword" type="search" :placeholder="$t('battleLog.searchPlaceholder')" />
      <select v-model="limit">
        <option :value="200">{{ $t('battleLog.ui.latest', { count: 200 }) }}</option>
        <option :value="500">{{ $t('battleLog.ui.latest', { count: 500 }) }}</option>
        <option value="all">{{ $t('battleLog.ui.allResults') }}</option>
      </select>
    </div>
    <div class="battle-log-presets">
      <span>{{ $t('battleLog.presets.label') }}</span>
      <button
        v-for="preset in TIMELINE_BATTLE_LOG_PRESETS"
        :key="preset.id"
        type="button"
        :class="{ active: activePreset === preset.id }"
        @click="applyPreset(preset.id)"
      >
        {{ $t(preset.i18nKey) }}
      </button>
    </div>
    <div class="event-filters">
      <button
        v-for="event in availableEvents"
        :key="event"
        type="button"
        :class="{ active: selectedEvents.has(event) }"
        @click="toggleEvent(event)"
      >
        {{ eventLabel(event) }}
      </button>
    </div>
    <div class="battle-log-list">
      <details v-for="group in groupedEntries" :key="group.key" class="battle-log-group" open>
        <summary class="battle-log-group__summary">
          <time>{{ formatTime(group.firstFrame) }}</time>
          <span
            class="battle-log-group__identity"
            :title="group.castId === null ? '' : $t('battleLog.ui.jumpToTimeline')"
            @click.stop="emit('locate', group.firstFrame, group.castId)"
            ><b>{{ group.label }}</b
            ><small>{{ group.secondaryLabel }}</small></span
          >
          <em v-if="group.damage > 0">{{ formatValue(group.damage) }}</em>
          <i>{{ group.entries.length }}</i>
        </summary>
        <details v-for="entry in group.entries" :key="entry.sequence" class="battle-log-entry">
          <summary>
            <time>{{ formatTime(entry.frame) }}</time>
            <b>{{ eventLabel(entry.event) }}</b>
            <span>{{ entrySummary(entry) }}</span>
          </summary>
          <dl>
            <template v-if="entry.sourceId">
              <dt>{{ $t('battleLog.ui.source') }}</dt>
              <dd :title="entry.sourceId">{{ sourceLabel(entry) }}</dd>
            </template>
            <template v-if="entry.targetId">
              <dt>{{ $t('battleLog.ui.target') }}</dt>
              <dd>{{ entry.targetId }}</dd>
            </template>
            <template v-for="(value, key) in entry.data ?? {}" :key="key">
              <dt :title="String(key)">{{ receiptFieldLabel(String(key)) }}</dt>
              <dd>{{ receiptFieldValue(String(key), value) }}</dd>
            </template>
          </dl>
        </details>
      </details>
      <div v-if="groupedEntries.length === 0" class="battle-log-empty">
        {{ $t('battleLog.ui.noResults') }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.battle-log-panel {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  color: var(--ea-fg-secondary);
  font-size: 12px;
}
.battle-log-panel > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid var(--ea-border-soft);
}
.battle-log-panel > header div {
  display: flex;
  gap: 8px;
}
.battle-log-panel button,
.battle-log-panel input,
.battle-log-panel select {
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input, #111);
  color: inherit;
}
.battle-log-panel > header button {
  padding: 4px 8px;
  cursor: pointer;
}
.battle-log-panel > header button.dirty {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}
.battle-log-tools {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 6px;
  padding: 8px;
}
.battle-log-tools input,
.battle-log-tools select {
  min-width: 0;
  height: 28px;
  padding: 0 7px;
}
.event-filters {
  display: flex;
  gap: 4px;
  padding: 0 8px 8px;
  overflow-x: auto;
}
.battle-log-presets {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px 6px;
}
.battle-log-presets > span {
  margin-right: 3px;
  color: var(--ea-fg-muted);
  font-size: 10px;
}
.battle-log-presets button {
  padding: 3px 7px;
  opacity: 0.55;
  cursor: pointer;
}
.battle-log-presets button.active {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
  opacity: 1;
}
.event-filters button {
  flex: none;
  padding: 3px 6px;
  opacity: 0.55;
  cursor: pointer;
}
.event-filters button.active {
  border-color: var(--ea-gold);
  opacity: 1;
}
.battle-log-list {
  min-height: 0;
  flex: 1;
  overflow: auto;
}
.battle-log-entry {
  border-top: 1px solid var(--ea-border-soft);
}
.battle-log-group {
  border-top: 1px solid var(--ea-border);
}
.battle-log-group__summary {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto 24px;
  align-items: center;
  gap: 7px;
  padding: 9px;
  background: var(--ea-fill-soft);
  cursor: pointer;
}
.battle-log-group__summary > span {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.battle-log-group__identity {
  cursor: crosshair;
}
.battle-log-group__identity:hover b {
  color: var(--ea-gold);
}
.battle-log-group__summary b,
.battle-log-group__summary small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.battle-log-group__summary small {
  color: var(--ea-fg-muted);
}
.battle-log-group__summary em {
  color: var(--ea-gold);
  font-style: normal;
  font-weight: 700;
}
.battle-log-group__summary i {
  color: var(--ea-fg-muted);
  font-style: normal;
  text-align: right;
}
.battle-log-entry summary {
  display: grid;
  grid-template-columns: 46px minmax(80px, auto) minmax(0, 1fr);
  gap: 6px;
  padding: 7px 9px;
  cursor: pointer;
}
.battle-log-entry summary:hover {
  background: var(--ea-hover-fill);
}
.battle-log-entry time {
  color: var(--ea-gold);
  font-family: 'Roboto Mono', Consolas, monospace;
}
.battle-log-entry summary span {
  overflow: hidden;
  color: var(--ea-fg-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.battle-log-entry dl {
  display: grid;
  grid-template-columns: minmax(70px, auto) minmax(0, 1fr);
  margin: 0;
  padding: 6px 10px 10px 28px;
  background: var(--ea-fill-soft);
}
.battle-log-entry dt {
  color: var(--ea-fg-muted);
}
.battle-log-entry dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
  font-family: 'Roboto Mono', Consolas, monospace;
}
.battle-log-empty {
  padding: 24px 10px;
  text-align: center;
  color: var(--ea-fg-muted);
}
</style>
