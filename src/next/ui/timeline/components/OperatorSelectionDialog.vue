<script setup lang="ts">
/**
 * Next 时间轴的干员定义选择器。
 *
 * 组件沿用旧版选择器的布局和交互，但只消费 Next 干员定义并通过事件返回选择结果；
 * 不读取项目状态，也不负责创建或修改 Build。
 */
import { computed, ref, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import {
  getGameClassName,
  getGameElementName,
  getGameWeaponTypeName,
  getOperatorGameName,
} from '@/data/gameText';
import type {
  DamageElement,
  OperatorDefinition,
  OperatorRole,
} from '../../../core/game-data/operatorDefinition';
import { projectOperatorSupport } from '../operatorSupportViewModel';
import OperatorSupportNotice from './OperatorSupportNotice.vue';

const props = defineProps<{
  visible: boolean;
  operators: readonly OperatorDefinition[];
  selectedSlugs: readonly string[];
}>();

const emit = defineEmits<{
  close: [];
  select: [slug: string];
  clear: [];
}>();

const { t, locale } = useI18n({ useScope: 'global' });
const searchQuery = ref('');
const elementFilter = ref<DamageElement | 'ALL'>('ALL');
const classFilter = ref<OperatorRole | 'ALL'>('ALL');

const elementIcons: Readonly<Record<DamageElement, string>> = {
  physical: '/icons/icon_element_physical.webp',
  heat: '/icons/icon_element_heat.webp',
  cryo: '/icons/icon_element_cryo.webp',
  electric: '/icons/icon_element_electric.webp',
  nature: '/icons/icon_element_nature.webp',
};

const elementColors: Readonly<Record<DamageElement, string>> = {
  physical: '#8c8c8c',
  heat: '#ff4d4f',
  cryo: '#00e5ff',
  electric: '#f0b23c',
  nature: '#52c41a',
};

watch(
  () => props.visible,
  visible => {
    if (!visible) return;
    searchQuery.value = '';
    elementFilter.value = 'ALL';
    classFilter.value = 'ALL';
  },
);

function rarityColor(rarity: number): string {
  if (rarity === 6) return 'var(--ea-gold)';
  if (rarity === 5) return '#ffc400';
  if (rarity === 4) return '#d8b4fe';
  return '#a0a0a0';
}

function normalizeSearchText(value: unknown): string {
  return String(value ?? '')
    .toLocaleLowerCase()
    .replace(/[\s_-]+/g, '');
}

const elementFilters = computed(() => [
  { label: t('timelineGrid.elementFilter.all'), value: 'ALL' as const, color: '#888' },
  ...(['physical', 'heat', 'cryo', 'electric', 'nature'] as const).map(element => ({
    label: getGameElementName(element, locale.value),
    value: element,
    color: elementColors[element],
  })),
]);

const classFilters = computed(() => [
  { label: t('timelineGrid.classFilter.all'), value: 'ALL' as const },
  ...(['guard', 'caster', 'defender', 'vanguard', 'striker', 'supporter'] as const).map(
    operatorClass => ({
      label: getGameClassName(operatorClass, locale.value),
      value: operatorClass,
    }),
  ),
]);

const operatorItems = computed(() =>
  props.operators.map(operator => {
    const name = getOperatorGameName(operator.slug, locale.value);
    const elementName = getGameElementName(operator.element, locale.value);
    return {
      slug: operator.slug,
      name,
      avatar: `/operators/${operator.slug}/avatar.webp`,
      rarity: Number(operator.rarity) || 0,
      element: operator.element,
      elementName,
      role: operator.role,
      searchTerms: [
        name,
        operator.slug,
        operator.gameId,
        elementName,
        getGameClassName(operator.role, locale.value),
        getGameWeaponTypeName(operator.weaponType, locale.value),
      ]
        .map(normalizeSearchText)
        .filter(Boolean),
      support: projectOperatorSupport(operator),
    };
  }),
);

const groups = computed(() => {
  const query = normalizeSearchText(searchQuery.value);
  const operators = operatorItems.value.filter(operator => {
    if (elementFilter.value !== 'ALL' && operator.element !== elementFilter.value) return false;
    if (classFilter.value !== 'ALL' && operator.role !== classFilter.value) return false;
    return query.length === 0 || operator.searchTerms.some(term => term.includes(query));
  });

  const byRarity = new Map<number, typeof operators>();
  for (const operator of operators) {
    const list = byRarity.get(operator.rarity) ?? [];
    list.push(operator);
    byRarity.set(operator.rarity, list);
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
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="t('timelineGrid.operatorDialog.title')"
    width="600px"
    align-center
    class="char-selector-dialog"
    append-to-body
    @closed="emit('close')"
  >
    <div class="selector-header">
      <div class="header-left-group">
        <el-input
          v-model="searchQuery"
          :placeholder="t('timelineGrid.operatorDialog.searchPlaceholder')"
          :prefix-icon="Search"
          clearable
          style="width: 180px"
        />
        <button
          type="button"
          class="ea-btn ea-btn--glass-cut ea-btn--glass-cut-danger ea-btn--cut-left ea-btn--lift"
          :title="t('timelineGrid.operatorDialog.clearTrack')"
          @click="clear"
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
          {{ t('common.unequip') }}
        </button>
      </div>
      <div class="element-filters">
        <button
          v-for="element in elementFilters"
          :key="element.value"
          type="button"
          class="ea-btn ea-btn--glass-cut"
          :class="{ 'is-active': elementFilter === element.value }"
          :style="{ '--ea-btn-accent': element.color }"
          @click="elementFilter = element.value"
        >
          {{ element.label }}
        </button>
      </div>
      <div class="class-filters">
        <button
          v-for="operatorClass in classFilters"
          :key="operatorClass.value"
          type="button"
          class="ea-btn ea-btn--glass-cut"
          :class="{ 'is-active': classFilter === operatorClass.value }"
          @click="classFilter = operatorClass.value"
        >
          {{ operatorClass.label }}
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
            v-for="operator in group.list"
            :key="operator.slug"
            class="roster-card"
            :class="[
              { 'is-selected': selectedSlugs.includes(operator.slug) },
              `rarity-${operator.rarity}-style`,
            ]"
            @click="select(operator.slug)"
          >
            <div
              class="card-avatar-wrapper"
              :style="operator.rarity === 6 ? {} : { borderColor: rarityColor(operator.rarity) }"
            >
              <OperatorSupportNotice :support="operator.support" compact />
              <img :src="operator.avatar" alt="" loading="lazy" />
              <div
                class="element-badge"
                :class="{ 'is-physical': operator.element === 'physical' }"
                :style="{ backgroundColor: elementColors[operator.element] }"
                :title="operator.elementName"
              >
                <img :src="elementIcons[operator.element]" alt="" loading="lazy" />
              </div>
            </div>
            <div class="card-name">{{ operator.name }}</div>
            <div v-if="selectedSlugs.includes(operator.slug)" class="in-team-tag">
              {{ t('timelineGrid.operatorDialog.inTeam') }}
            </div>
          </div>
        </div>
      </template>
      <div v-if="groups.length === 0" class="empty-roster">
        {{ t('timelineGrid.operatorDialog.empty') }}
      </div>
    </div>
  </el-dialog>
</template>

<style src="../../../../components/selection/selectionDialog.css"></style>
