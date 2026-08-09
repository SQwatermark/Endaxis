<script setup lang="ts">
/**
 * Next 时间轴的武器目录选择器。界面与旧时间轴保持一致，但只读取 Next 目录并返回稳定 slug；
 * 武器 Build 的创建和持久化仍由父层负责，组件内不依赖旧 store。
 */
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import { getGameWeaponTypeName, getWeaponGameName } from '@/data/gameText';
import { getSharedEquipmentSupport, type SharedEquipmentSupport } from '../../../data/equipment';
import type { WeaponDefinition } from '../../../core/game-data/equipmentDefinition';
import NextWeaponSelectionTooltip from './NextWeaponSelectionTooltip.vue';

export interface WeaponSelectionDialogLabels {
  readonly title: string;
  readonly searchPlaceholder: string;
  readonly unequip: string;
  readonly close: string;
  readonly empty: string;
  readonly partialSupport: string;
}

const props = defineProps<{
  visible: boolean;
  weapons: readonly WeaponDefinition[];
  selectedSlug: string | null;
  labels: WeaponSelectionDialogLabels;
}>();

const emit = defineEmits<{
  close: [];
  select: [slug: string];
  clear: [];
}>();

interface WeaponListItem {
  readonly definition: WeaponDefinition;
  readonly name: string;
  readonly weaponTypeName: string;
  readonly support: SharedEquipmentSupport | null;
  readonly supportSummary: string;
}

interface WeaponRarityGroup {
  readonly level: number;
  readonly list: readonly WeaponListItem[];
}

const { locale } = useI18n({ useScope: 'global' });
const searchQuery = ref('');
const fullPotential = ref(false);

watch(
  () => props.visible,
  visible => {
    if (visible) searchQuery.value = '';
    else fullPotential.value = false;
  },
);

function rarityColor(rarity: number): string {
  if (rarity === 6) return 'var(--ea-gold)';
  if (rarity === 5) return '#ffc400';
  if (rarity === 4) return '#d8b4fe';
  return '#a0a0a0';
}

function normalizeSearchText(value: string): string {
  return value.toLocaleLowerCase().replace(/[\s_-]+/g, '');
}

function summarizeSupport(support: SharedEquipmentSupport | null): string {
  if (!support || support.completeness !== 'partial') return '';
  return [...new Set(support.issues.map(issue => `${issue.path}: ${issue.message}`))].join('\n');
}

const weaponItems = computed<readonly WeaponListItem[]>(() =>
  props.weapons.map(definition => {
    const support = getSharedEquipmentSupport('weapon', definition.slug);
    return {
      definition,
      name: getWeaponGameName(definition.slug, locale.value),
      weaponTypeName: getGameWeaponTypeName(definition.weaponType, locale.value),
      support,
      supportSummary: summarizeSupport(support),
    };
  }),
);

const groups = computed<readonly WeaponRarityGroup[]>(() => {
  const query = normalizeSearchText(searchQuery.value);
  const filtered = query
    ? weaponItems.value.filter(item =>
        [item.definition.slug, item.definition.weaponType, item.name, item.weaponTypeName]
          .map(normalizeSearchText)
          .some(value => value.includes(query)),
      )
    : weaponItems.value;

  const byRarity = new Map<number, WeaponListItem[]>();
  for (const item of filtered) {
    const list = byRarity.get(item.definition.rarity) ?? [];
    list.push(item);
    byRarity.set(item.definition.rarity, list);
  }
  return [...byRarity.entries()]
    .sort(([left], [right]) => right - left)
    .map(([level, list]) => ({ level, list }));
});

function select(slug: string): void {
  emit('select', slug);
}

function clear(): void {
  emit('clear');
}

function handleDialogVisibility(value: boolean): void {
  if (!value) emit('close');
}

function handleKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Control') fullPotential.value = true;
}

function handleKeyUp(event: KeyboardEvent): void {
  if (event.key === 'Control') fullPotential.value = false;
}

function resetModifierKey(): void {
  fullPotential.value = false;
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('blur', resetModifierKey);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('blur', resetModifierKey);
});
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="labels.title"
    width="600px"
    align-center
    class="char-selector-dialog"
    append-to-body
    @update:model-value="handleDialogVisibility"
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
          class="ea-btn ea-btn--glass-cut ea-btn--glass-cut-danger ea-btn--cut-left ea-btn--lift"
          :disabled="selectedSlug === null"
          :title="labels.unequip"
          @click="clear"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
          >
            <path d="M3 6h18" />
            <path
              d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
            />
          </svg>
          {{ labels.unequip }}
        </button>
      </div>
    </div>

    <div class="roster-scroll-container">
      <template v-for="group in groups" :key="group.level">
        <div
          class="rarity-header"
          :class="`header-rarity-${group.level}`"
          :style="{ color: rarityColor(group.level) }"
        >
          <span class="rarity-label">{{ group.level }} ★</span>
          <div class="rarity-line"></div>
        </div>
        <div class="roster-grid">
          <div
            v-for="weapon in group.list"
            :key="weapon.definition.slug"
            class="roster-card"
            :class="`rarity-${weapon.definition.rarity}-style`"
            :title="weapon.supportSummary || undefined"
            @click="select(weapon.definition.slug)"
          >
            <el-tooltip
              placement="top-start"
              effect="dark"
              :show-after="160"
              popper-class="weapon-selection-preview-popper"
            >
              <template #content>
                <NextWeaponSelectionTooltip
                  :weapon="weapon.definition"
                  :name="weapon.name"
                  :full-potential="fullPotential"
                />
              </template>
              <div class="selection-card-tooltip-target">
                <div
                  class="card-avatar-wrapper"
                  :style="
                    weapon.definition.rarity === 6
                      ? {}
                      : { borderColor: rarityColor(weapon.definition.rarity) }
                  "
                >
                  <img
                    :src="weapon.definition.iconPath || '/weapons/default.webp'"
                    alt=""
                    loading="lazy"
                  />
                </div>
                <div class="card-name">{{ weapon.name }}</div>
              </div>
            </el-tooltip>
            <div v-if="selectedSlug === weapon.definition.slug" class="in-team-tag weapon-equipped">
              {{ $t('timelineGrid.weaponDialog.equipped') }}
            </div>
          </div>
        </div>
      </template>
      <div v-if="groups.length === 0" class="empty-roster">
        {{ labels.empty }}
      </div>
    </div>
  </el-dialog>
</template>

<style src="../../../../components/selection/selectionDialog.css"></style>
