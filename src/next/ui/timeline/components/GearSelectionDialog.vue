<script setup lang="ts">
/**
 * Next 时间轴的四槽装备选择器。父层负责按当前槽位提供目录并持久化选择；本组件只负责
 * 槽位导航、目录搜索和返回稳定 slug，适配缺口提示不会进入项目数据。
 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getGameSlotTypeName, getGearPieceGameName, getGearSetGameName } from '@/data/gameText';
import { getSharedEquipmentSupport } from '../../../data/equipment';
import type { GearDefinition } from '../../../core/game-data/equipmentDefinition';

export interface GearSelectionSlotTab {
  readonly key: string;
  readonly label: string;
  readonly selectedName?: string | null;
  readonly selectedSlug?: string | null;
}

export interface GearSelectionDialogLabels {
  readonly title: string;
  readonly searchPlaceholder: string;
  readonly unequip: string;
  readonly close: string;
  readonly empty: string;
  readonly partialSupport: string;
  readonly defense: string;
  readonly noSet: string;
}

const props = defineProps<{
  visible: boolean;
  /** 父层已经按当前槽位筛选好的装备目录。 */
  gears: readonly GearDefinition[];
  selectedSlug: string | null;
  slotTabs: readonly GearSelectionSlotTab[];
  activeSlotKey: string;
  labels: GearSelectionDialogLabels;
}>();

const emit = defineEmits<{
  close: [];
  select: [slug: string];
  clear: [];
  'change-slot': [key: string];
}>();

interface GearListItem {
  readonly definition: GearDefinition;
  readonly name: string;
  readonly slotTypeName: string;
  readonly gearSetName: string;
  readonly isPartial: boolean;
  readonly supportSummary: string;
}

const { locale } = useI18n({ useScope: 'global' });
const query = ref('');

watch(
  () => [props.visible, props.activeSlotKey] as const,
  ([visible]) => {
    if (visible) query.value = '';
  },
);

function normalize(value: string): string {
  return value.toLocaleLowerCase().replace(/[\s_-]+/g, '');
}

function selectedTabText(tab: GearSelectionSlotTab): string {
  return tab.selectedName?.trim() || tab.selectedSlug?.trim() || '';
}

const gearItems = computed<readonly GearListItem[]>(() =>
  props.gears.map(definition => {
    const gearSupport = getSharedEquipmentSupport('gear', definition.slug);
    const setSupport = definition.gearSetSlug
      ? getSharedEquipmentSupport('gearSet', definition.gearSetSlug)
      : null;
    const issues = [...(gearSupport?.issues ?? []), ...(setSupport?.issues ?? [])];
    return {
      definition,
      name: getGearPieceGameName(definition.slug, locale.value),
      slotTypeName: getGameSlotTypeName(definition.slotType, locale.value),
      gearSetName: definition.gearSetSlug
        ? getGearSetGameName(definition.gearSetSlug, locale.value)
        : props.labels.noSet,
      isPartial: gearSupport?.completeness === 'partial' || setSupport?.completeness === 'partial',
      supportSummary: [
        ...new Set(issues.map(issue => `${issue.sourceKind}.${issue.path}: ${issue.message}`)),
      ].join('\n'),
    };
  }),
);

const filteredGears = computed(() => {
  const needle = normalize(query.value);
  if (needle.length === 0) return gearItems.value;
  return gearItems.value.filter(item =>
    [
      item.definition.slug,
      item.definition.slotType,
      item.definition.gearSetSlug ?? '',
      String(item.definition.baseDefense),
      item.name,
      item.slotTypeName,
      item.gearSetName,
    ]
      .map(normalize)
      .some(value => value.includes(needle)),
  );
});
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-backdrop" @mousedown.self="emit('close')">
      <section class="gear-dialog" role="dialog" aria-modal="true" :aria-label="labels.title">
        <header>
          <strong>{{ labels.title }}</strong>
          <button type="button" :title="labels.close" @click="emit('close')">×</button>
        </header>

        <nav class="slot-tabs" :aria-label="labels.title">
          <button
            v-for="tab in slotTabs"
            :key="tab.key"
            type="button"
            class="slot-tab"
            :class="{ active: tab.key === activeSlotKey }"
            @click="emit('change-slot', tab.key)"
          >
            <strong>{{ tab.label }}</strong>
            <span :title="selectedTabText(tab)">{{ selectedTabText(tab) || '—' }}</span>
          </button>
        </nav>

        <div class="dialog-tools">
          <input v-model="query" :placeholder="labels.searchPlaceholder" />
          <button type="button" class="clear-button" @click="emit('clear')">
            {{ labels.unequip }}
          </button>
        </div>

        <div class="gear-grid">
          <button
            v-for="item in filteredGears"
            :key="item.definition.slug"
            type="button"
            class="gear-card"
            :class="{ selected: item.definition.slug === selectedSlug }"
            @click="emit('select', item.definition.slug)"
          >
            <span class="gear-icon">
              <img v-if="item.definition.iconPath" :src="item.definition.iconPath" alt="" />
            </span>
            <span class="gear-info">
              <strong :title="item.name">{{ item.name }}</strong>
              <span
                >{{ item.slotTypeName }} · {{ labels.defense }}
                {{ item.definition.baseDefense }}</span
              >
              <span class="set-name" :title="item.gearSetName">{{ item.gearSetName }}</span>
            </span>
            <span v-if="item.isPartial" class="support-warning" :title="item.supportSummary">
              {{ labels.partialSupport }}
            </span>
          </button>
          <p v-if="filteredGears.length === 0" class="empty-result">
            {{ labels.empty }}
          </p>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--ea-bg) 70%, transparent);
}

.gear-dialog {
  width: min(780px, calc(100vw - 32px));
  max-height: min(720px, calc(100vh - 32px));
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ea-border-strong);
  background: var(--ea-workbench-panel);
  color: var(--ea-fg);
  box-shadow: 0 18px 52px var(--ea-shadow-strong);
}

header,
.dialog-tools {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--ea-border);
}

header {
  justify-content: space-between;
}

button,
input {
  height: 30px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-soft);
  color: inherit;
  font: inherit;
}

button {
  cursor: pointer;
}

header button {
  width: 30px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 20px;
}

.slot-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  padding: 1px;
  border-bottom: 1px solid var(--ea-border);
  background: var(--ea-border-soft);
}

.slot-tab {
  min-width: 0;
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 3px;
  padding: 6px 10px;
  border: 0;
  background: var(--ea-workbench-panel);
  text-align: left;
}

.slot-tab > span {
  width: 100%;
  overflow: hidden;
  color: var(--ea-fg-muted);
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.slot-tab.active {
  color: var(--ea-gold);
  box-shadow: inset 0 -2px var(--ea-gold);
}

input {
  width: 280px;
  padding: 0 9px;
  outline: none;
}

input:focus,
button:hover {
  border-color: var(--ea-gold);
}

.clear-button {
  padding: 0 12px;
  color: var(--el-color-danger);
}

.gear-grid {
  min-height: 180px;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  align-content: start;
  gap: 10px;
  padding: 14px;
}

.gear-card {
  min-width: 0;
  height: 88px;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  align-items: center;
  gap: 3px 10px;
  padding: 9px 10px;
  text-align: left;
}

.gear-card.selected {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}

.gear-icon {
  grid-row: 1 / -1;
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-surface-soft);
}

.gear-icon img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.gear-info {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.gear-info > strong,
.gear-info > span {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.gear-info > span {
  color: var(--ea-fg-muted);
  font-size: 11px;
}

.gear-info .set-name {
  color: var(--ea-fg-secondary);
}

.support-warning {
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  color: var(--el-color-warning);
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.empty-result {
  grid-column: 1 / -1;
  color: var(--ea-fg-muted);
  text-align: center;
}
</style>
