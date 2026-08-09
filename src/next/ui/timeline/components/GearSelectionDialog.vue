<script setup lang="ts">
/**
 * Next 时间轴的单槽装备选择器。父层决定正在编辑的轨道和槽位，并负责把选择、卸下及精锻档位写回项目；
 * 本组件只复刻旧版装备选择弹窗的目录浏览流程，不读取旧 store，也不把适配状态写入存档。
 */
import { computed, ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { getGearPieceGameName, getGearSetGameName } from '../../legacy/legacyGameText';
import { getEquipmentLevelColor } from '../../legacy/legacyProgression';
import '../../legacy/legacyPresentation';
import { getSharedEquipmentSupport } from '../../../data/equipment';
import type { GearDefinition } from '../../../core/game-data/equipmentDefinition';

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

const props = withDefaults(
  defineProps<{
    visible: boolean;
    /** 父层已经按当前槽位筛选好的装备目录。 */
    gears: readonly GearDefinition[];
    selectedSlug: string | null;
    /** 已装备 Build 的精锻档位；未装备时默认预选满精锻，与旧版一致。 */
    selectedArtificingLevels?: readonly number[];
    /** 当前槽位由父层指定，两个配件槽仍保留各自的稳定身份。 */
    activeSlotKey?: string;
    labels: GearSelectionDialogLabels;
  }>(),
  {
    selectedArtificingLevels: () => [],
    activeSlotKey: 'armor',
  },
);

const emit = defineEmits<{
  close: [];
  select: [slug: string, artificingTier: number];
  clear: [];
  'change-refine-tier': [tier: number];
}>();

interface GearListItem {
  readonly definition: GearDefinition;
  readonly name: string;
  readonly gearSetSlug: string | null;
  readonly gearSetName: string;
  readonly isPartial: boolean;
  readonly supportSummary: string;
}

interface GearLevelGroup {
  readonly level: number;
  readonly items: readonly GearListItem[];
}

const { locale, t } = useI18n({ useScope: 'global' });
const searchQuery = ref('');
const gearSetFilter = ref('ALL');
const levelFilter = ref<number | 'ALL'>('ALL');
const refineTier = ref(3);
const refineTiers = [0, 1, 2, 3] as const;
const NO_SET_FILTER = '__NO_SET__';

watch(
  () => [props.visible, props.activeSlotKey, props.selectedSlug] as const,
  ([visible]) => {
    if (!visible) return;
    searchQuery.value = '';
    gearSetFilter.value = 'ALL';
    levelFilter.value = 'ALL';
    refineTier.value = props.selectedSlug === null ? 3 : currentArtificingTier.value;
  },
);

function normalizeSearchText(value: unknown): string {
  return String(value ?? '')
    .toLocaleLowerCase()
    .replace(/[\s_-]+/g, '');
}

const currentArtificingTier = computed(() => {
  if (props.selectedArtificingLevels.length === 0) return 0;
  return Math.max(0, Math.min(3, Math.max(...props.selectedArtificingLevels)));
});

const gearItems = computed<readonly GearListItem[]>(() =>
  props.gears.map(definition => {
    const gearSetSlug =
      definition.gearSetSlug && definition.gearSetSlug !== 'no-set-bonuses'
        ? definition.gearSetSlug
        : null;
    const gearSupport = getSharedEquipmentSupport('gear', definition.slug);
    const setSupport = gearSetSlug ? getSharedEquipmentSupport('gearSet', gearSetSlug) : null;
    const issues = [...(gearSupport?.issues ?? []), ...(setSupport?.issues ?? [])];
    return {
      definition,
      name: getGearPieceGameName(definition.slug, locale.value),
      gearSetSlug,
      gearSetName: gearSetSlug ? getGearSetGameName(gearSetSlug, locale.value) : props.labels.noSet,
      isPartial: gearSupport?.completeness === 'partial' || setSupport?.completeness === 'partial',
      supportSummary: [
        ...new Set(issues.map(issue => `${issue.sourceKind}.${issue.path}: ${issue.message}`)),
      ].join('\n'),
    };
  }),
);

const gearSets = computed(() => {
  const names = new Map<string, string>();
  for (const item of gearItems.value) {
    if (item.gearSetSlug !== null) names.set(item.gearSetSlug, item.gearSetName);
  }
  return [...names.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((left, right) => left.name.localeCompare(right.name));
});

const levels = computed(() =>
  [...new Set(gearItems.value.map(item => item.definition.levelRequirement))].sort(
    (left, right) => right - left,
  ),
);

const groups = computed<readonly GearLevelGroup[]>(() => {
  const query = normalizeSearchText(searchQuery.value);
  const filtered = gearItems.value.filter(item => {
    if (
      gearSetFilter.value !== 'ALL' &&
      (gearSetFilter.value === NO_SET_FILTER
        ? item.gearSetSlug !== null
        : item.gearSetSlug !== gearSetFilter.value)
    ) {
      return false;
    }
    if (levelFilter.value !== 'ALL' && item.definition.levelRequirement !== levelFilter.value) {
      return false;
    }
    if (query.length === 0) return true;
    return [
      item.definition.slug,
      item.definition.gearSetSlug,
      item.definition.levelRequirement,
      item.definition.baseDefense,
      item.name,
      item.gearSetName,
    ].some(value => normalizeSearchText(value).includes(query));
  });
  const byLevel = new Map<number, GearListItem[]>();
  for (const item of filtered) {
    const level = item.definition.levelRequirement;
    const items = byLevel.get(level) ?? [];
    items.push(item);
    byLevel.set(level, items);
  }
  return [...byLevel.entries()]
    .sort(([left], [right]) => right - left)
    .map(([level, items]) => ({
      level,
      items: items.sort((left, right) => left.name.localeCompare(right.name)),
    }));
});

function setRefineTier(tier: number): void {
  refineTier.value = tier;
  if (props.selectedSlug !== null) emit('change-refine-tier', tier);
}

function selectGear(slug: string): void {
  emit('select', slug, refineTier.value);
  emit('close');
}

function clearGear(): void {
  emit('clear');
  emit('close');
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="labels.title"
    width="600px"
    align-center
    class="char-selector-dialog"
    append-to-body
    @close="emit('close')"
  >
    <div class="selector-header">
      <div class="header-left-group">
        <el-input
          v-model="searchQuery"
          :placeholder="labels.searchPlaceholder"
          :prefix-icon="Search"
          clearable
          style="width: 180px"
        />
        <button
          type="button"
          class="ea-btn ea-btn--glass-cut ea-btn--glass-cut-danger ea-btn--cut-left ea-btn--lift"
          :disabled="selectedSlug === null"
          :title="labels.unequip"
          @click="clearGear"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            aria-hidden="true"
          >
            <path d="M3 6h18" />
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            />
          </svg>
          {{ labels.unequip }}
        </button>
        <div class="equipment-tier-picker">
          <span class="tier-label">{{ t('timelineGrid.equipmentDialog.refine') }}</span>
          <div class="equipment-refine-buttons">
            <button
              v-for="tier in refineTiers"
              :key="tier"
              type="button"
              class="ea-btn ea-btn--sm ea-btn--glass-rect ea-btn--accent-gold equipment-refine-btn"
              :class="{ 'is-active': refineTier === tier }"
              @click="setRefineTier(tier)"
            >
              {{ tier === 0 ? t('timelineGrid.equipmentDialog.refineBase') : tier }}
            </button>
          </div>
        </div>
      </div>
      <div class="element-filters">
        <button
          type="button"
          class="ea-btn ea-btn--glass-cut equipment-filter-chip"
          :class="{ 'is-active': gearSetFilter === 'ALL' }"
          :style="{ '--ea-btn-accent': '#2dd4bf' }"
          @click="gearSetFilter = 'ALL'"
        >
          {{ t('timelineGrid.equipmentDialog.allCategories') }}
        </button>
        <button
          type="button"
          class="ea-btn ea-btn--glass-cut equipment-filter-chip"
          :class="{ 'is-active': gearSetFilter === NO_SET_FILTER }"
          :style="{ '--ea-btn-accent': '#888' }"
          @click="gearSetFilter = NO_SET_FILTER"
        >
          {{ labels.noSet }}
        </button>
        <button
          v-for="gearSet in gearSets"
          :key="gearSet.slug"
          type="button"
          class="ea-btn ea-btn--glass-cut equipment-filter-chip"
          :class="{ 'is-active': gearSetFilter === gearSet.slug }"
          :style="{ '--ea-btn-accent': '#2dd4bf' }"
          @click="gearSetFilter = gearSet.slug"
        >
          {{ gearSet.name }}
        </button>
      </div>
      <div class="element-filters">
        <button
          type="button"
          class="ea-btn ea-btn--glass-cut equipment-filter-chip"
          :class="{ 'is-active': levelFilter === 'ALL' }"
          :style="{ '--ea-btn-accent': '#2dd4bf' }"
          @click="levelFilter = 'ALL'"
        >
          {{ t('timelineGrid.equipmentDialog.allLevels') }}
        </button>
        <button
          v-for="level in levels"
          :key="level"
          type="button"
          class="ea-btn ea-btn--glass-cut equipment-filter-chip"
          :class="{ 'is-active': levelFilter === level }"
          :style="{ '--ea-btn-accent': getEquipmentLevelColor(level) }"
          @click="levelFilter = level"
        >
          Lv{{ level }}
        </button>
      </div>
    </div>

    <div class="roster-scroll-container">
      <template v-for="group in groups" :key="group.level">
        <div class="rarity-header" :style="{ color: getEquipmentLevelColor(group.level) }">
          <span class="rarity-label">Lv{{ group.level }}</span>
          <div class="rarity-line"></div>
        </div>
        <div class="roster-grid">
          <div
            v-for="gear in group.items"
            :key="gear.definition.slug"
            class="roster-card equipment-roster-card"
            @click="selectGear(gear.definition.slug)"
          >
            <el-tooltip
              placement="top-start"
              effect="dark"
              :show-after="160"
              popper-class="equipment-selection-preview-popper"
            >
              <template #content>
                <div class="next-gear-preview">
                  <div class="next-gear-preview__name">{{ gear.name }}</div>
                  <div class="next-gear-preview__row">
                    <span>{{ labels.defense }}</span>
                    <strong>{{ gear.definition.baseDefense }}</strong>
                  </div>
                  <div class="next-gear-preview__row">
                    <span>{{ t('timelineGrid.equipmentDialog.setBonusTitle') }}</span>
                    <strong>{{ gear.gearSetName }}</strong>
                  </div>
                  <div
                    v-if="gear.isPartial"
                    class="next-gear-preview__warning"
                    :title="gear.supportSummary"
                  >
                    {{ labels.partialSupport }}
                  </div>
                </div>
              </template>
              <div class="selection-card-tooltip-target">
                <div
                  class="card-avatar-wrapper"
                  :style="{ borderColor: getEquipmentLevelColor(gear.definition.levelRequirement) }"
                >
                  <img
                    :src="gear.definition.iconPath || '/icons/default_icon.webp'"
                    :alt="gear.name"
                    loading="lazy"
                  />
                </div>
                <div class="card-name">{{ gear.name }}</div>
              </div>
            </el-tooltip>
            <div v-if="selectedSlug === gear.definition.slug" class="in-team-tag weapon-equipped">
              {{ t('timelineGrid.weaponDialog.equipped') }}
            </div>
          </div>
        </div>
      </template>
      <div v-if="groups.length === 0" class="empty-roster">{{ labels.empty }}</div>
    </div>
  </el-dialog>
</template>

<style scoped>
:global(.equipment-selection-preview-popper.el-popper.is-dark) {
  max-width: min(360px, calc(100vw - 32px));
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #050505;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.72);
}

.next-gear-preview {
  min-width: 220px;
  display: grid;
  gap: 8px;
  line-height: 1.4;
}

.next-gear-preview__name {
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 14px;
  font-weight: 700;
}

.next-gear-preview__row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  color: rgba(255, 255, 255, 0.75);
}

.next-gear-preview__row strong {
  color: #facc15;
}

.next-gear-preview__warning {
  padding-top: 7px;
  border-top: 1px solid rgba(250, 204, 21, 0.22);
  color: #facc15;
  font-size: 12px;
}
</style>
