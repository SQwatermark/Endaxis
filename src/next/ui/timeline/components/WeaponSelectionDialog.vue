<script setup lang="ts">
/**
 * Next 时间轴的只读武器目录选择器。它只返回稳定 slug，不创建或修改武器 Build。
 * 名称和类型在渲染层按当前语言解析；目录适配缺口只用于提示，不进入项目数据。
 */
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getGameWeaponTypeName, getWeaponGameName } from '@/data/gameText';
import { getSharedEquipmentSupport, type SharedEquipmentSupport } from '../../../data/equipment';
import type { WeaponDefinition } from '../../../core/game-data/equipmentDefinition';

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

const { locale } = useI18n({ useScope: 'global' });
const query = ref('');

watch(
  () => props.visible,
  visible => {
    if (visible) query.value = '';
  },
);

function normalize(value: string): string {
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

const filteredWeapons = computed(() => {
  const needle = normalize(query.value);
  if (needle.length === 0) return weaponItems.value;
  return weaponItems.value.filter(item =>
    [
      item.definition.slug,
      item.definition.weaponType,
      String(item.definition.rarity),
      item.name,
      item.weaponTypeName,
    ]
      .map(normalize)
      .some(value => value.includes(needle)),
  );
});
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-backdrop" @mousedown.self="emit('close')">
      <section class="weapon-dialog" role="dialog" aria-modal="true" :aria-label="labels.title">
        <header>
          <strong>{{ labels.title }}</strong>
          <button type="button" :title="labels.close" @click="emit('close')">×</button>
        </header>
        <div class="dialog-tools">
          <input v-model="query" :placeholder="labels.searchPlaceholder" />
          <button type="button" class="clear-button" @click="emit('clear')">
            {{ labels.unequip }}
          </button>
        </div>
        <div class="weapon-grid">
          <button
            v-for="item in filteredWeapons"
            :key="item.definition.slug"
            type="button"
            class="weapon-card"
            :class="{ selected: item.definition.slug === selectedSlug }"
            @click="emit('select', item.definition.slug)"
          >
            <span class="weapon-visual">
              <img :src="item.definition.iconPath || '/weapons/default.webp'" alt="" />
              <span class="rarity" aria-hidden="true">{{ item.definition.rarity }}★</span>
            </span>
            <span class="weapon-info">
              <strong :title="item.name">{{ item.name }}</strong>
              <span>{{ item.weaponTypeName }}</span>
            </span>
            <span
              v-if="item.support?.completeness === 'partial'"
              class="support-warning"
              :title="item.supportSummary"
            >
              {{ labels.partialSupport }}
            </span>
          </button>
          <p v-if="filteredWeapons.length === 0" class="empty-result">
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

.weapon-dialog {
  width: min(720px, calc(100vw - 32px));
  max-height: min(680px, calc(100vh - 32px));
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

input {
  width: 260px;
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

.weapon-grid {
  min-height: 180px;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  align-content: start;
  gap: 10px;
  padding: 14px;
}

.weapon-card {
  min-width: 0;
  height: 72px;
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  grid-template-rows: 1fr auto;
  align-items: center;
  gap: 2px 10px;
  padding: 9px 10px;
  text-align: left;
}

.weapon-card.selected {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}

.weapon-visual {
  grid-row: 1 / -1;
  display: grid;
  justify-items: center;
  gap: 2px;
}

.weapon-visual img {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.rarity {
  color: var(--ea-gold);
  font-size: 10px;
  font-weight: 700;
}

.weapon-info {
  min-width: 0;
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.weapon-info strong {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.weapon-info > span {
  flex: none;
  color: var(--ea-fg-muted);
  font-size: 12px;
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
