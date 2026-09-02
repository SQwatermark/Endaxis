<script setup lang="ts">
/**
 * Next 敌人实例的选择与属性编辑界面。
 * 组件复用旧版布局语言，但只处理草稿和展示；定义解析、默认值捕获与事务提交由外层协调器负责。
 */
import { computed, reactive, ref, watch } from 'vue';
import { Delete, Plus, Search } from '@element-plus/icons-vue';
import type { EnemyDefinition, EnemyTier } from '../../../core/game-data/enemyDefinition';
import type { EnemyDocument, EnemyEditableValues } from '../../../core/project/schema';
import { DAMAGE_ELEMENTS } from '../../../core/game-data/operatorDefinition';

const EDITABLE_RESISTANCE_DAMAGE_TYPES = DAMAGE_ELEMENTS;

const LEVELS = [1, 20, 40, 60, 80, 90] as const;
const TIERS: readonly { value: EnemyTier; color: string }[] = [
  { value: 'leader', color: '#ff4d4f' },
  { value: 'boss', color: '#ffd700' },
  { value: 'elite', color: '#d8b4fe' },
  { value: 'advanced', color: '#52c41a' },
  { value: 'normal', color: '#a0a0a0' },
];

const props = defineProps<{
  enemy: EnemyDocument;
  definition: EnemyDefinition | null;
  enemies: readonly EnemyDefinition[];
  fps: number;
  nameOf: (enemyId: string) => string;
  labels: {
    all: string;
    close: string;
    confirm: string;
    custom: string;
    customDescription: string;
    unknown: string;
    clickToChange: string;
    selectTitle: string;
    searchPlaceholder: string;
    level: string;
    empty: string;
    editStats: string;
    editStatsTitle: string;
    enemyHp: string;
    defense: string;
    finisherMultiplier: string;
    maximumStagger: string;
    staggerNodes: string;
    nodeDuration: string;
    brokenDuration: string;
    finisherRecovery: string;
    superArmor: string;
    resistances: string;
    resistance: Record<(typeof EDITABLE_RESISTANCE_DAMAGE_TYPES)[number], string>;
    tier: Record<EnemyTier, string>;
  };
}>();

const emit = defineEmits<{
  selectDefinition: [enemyId: string, level: number];
  selectCustom: [level: number];
  save: [values: EnemyEditableValues];
}>();

const selectorVisible = ref(false);
const statsVisible = ref(false);
const searchQuery = ref('');
const tierFilter = ref<EnemyTier | 'all'>('all');
const selectedLevel = ref(90);
const draft = reactive<EnemyEditableValues>(structuredClone(props.enemy.editable));

const activeName = computed(() =>
  props.enemy.source.kind === 'custom'
    ? props.labels.custom
    : props.definition === null
      ? props.labels.unknown
      : props.nameOf(props.definition.id),
);
const filteredEnemies = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase();
  return props.enemies.filter(enemy => {
    if (tierFilter.value !== 'all' && enemy.tier !== tierFilter.value) return false;
    return query.length === 0 || props.nameOf(enemy.id).toLocaleLowerCase().includes(query);
  });
});
const canAddKnotThreshold = computed(() => (draft.stagger.knotThresholds.at(-1) ?? 0) < 0.99);

watch(
  () => props.enemy.source,
  source => {
    selectedLevel.value = source.level;
  },
  { immediate: true },
);
watch(statsVisible, visible => {
  if (visible) Object.assign(draft, structuredClone(props.enemy.editable));
});

function supportsLevel(enemy: EnemyDefinition): boolean {
  return enemy.levelHp.some(node => node.level === selectedLevel.value);
}

function selectDefinition(enemy: EnemyDefinition): void {
  if (!supportsLevel(enemy)) return;
  emit('selectDefinition', enemy.id, selectedLevel.value);
  selectorVisible.value = false;
}

function selectCustom(): void {
  emit('selectCustom', selectedLevel.value);
  selectorVisible.value = false;
}

function saveDraft(): void {
  emit('save', structuredClone(draft));
  statsVisible.value = false;
}

function setDraftNumber(target: Record<string, number>, key: string, event: Event): void {
  const value = Number((event.target as HTMLInputElement).value);
  if (Number.isFinite(value)) target[key] = value;
}

function setDuration(
  field: 'knotBreakDurationFrames' | 'brokenDurationFrames',
  event: Event,
): void {
  const seconds = Number((event.target as HTMLInputElement).value);
  if (Number.isFinite(seconds)) draft.stagger[field] = Math.max(0, Math.round(seconds * props.fps));
}

function addKnotThreshold(): void {
  const previous = draft.stagger.knotThresholds.at(-1) ?? 0;
  if (previous >= 0.99) return;
  draft.stagger.knotThresholds.push(Math.min(0.99, Math.round((previous + 0.25) * 100) / 100));
}

function removeKnotThreshold(index: number): void {
  draft.stagger.knotThresholds.splice(index, 1);
}
</script>

<template>
  <section class="enemy-settings-panel">
    <button type="button" class="enemy-select-module" @click="selectorVisible = true">
      <span class="module-deco-line"></span>
      <span class="enemy-avatar-box">
        <img v-if="definition?.iconPath" :src="definition.iconPath" alt="" />
        <span v-else class="custom-avatar-placeholder">?</span>
      </span>
      <span class="enemy-info-col">
        <span class="enemy-name-line">
          <strong class="enemy-name">{{ activeName }}</strong>
          <span class="enemy-level-badge">Lv{{ enemy.source.level }}</span>
        </span>
        <span class="click-hint">{{ labels.clickToChange }}</span>
      </span>
    </button>

    <div class="stats-summary">
      <div class="summary-row">
        <span>{{ labels.enemyHp }}</span
        ><strong>{{ enemy.editable.hp.toLocaleString() }}</strong>
      </div>
      <div class="summary-row">
        <span>{{ labels.maximumStagger }}</span
        ><strong>{{ enemy.editable.stagger.maximum.toLocaleString() }}</strong>
      </div>
      <div class="summary-row">
        <span>{{ labels.staggerNodes }}</span
        ><strong>{{ enemy.editable.stagger.knotThresholds.length }}</strong>
      </div>
      <div class="summary-row summary-row--resistance">
        <span>{{ labels.resistances }}</span>
        <strong>
          {{
            EDITABLE_RESISTANCE_DAMAGE_TYPES.map(
              type => enemy.editable.resistances[type] ?? 0,
            ).join(' / ')
          }}
        </strong>
      </div>
      <button type="button" class="stats-edit-button" @click="statsVisible = true">
        {{ labels.editStats }}
      </button>
    </div>

    <el-dialog
      v-model="selectorVisible"
      :title="labels.selectTitle"
      width="640px"
      align-center
      append-to-body
      class="char-selector-dialog next-enemy-selector"
    >
      <div class="selector-header">
        <el-input
          v-model="searchQuery"
          :placeholder="labels.searchPlaceholder"
          :prefix-icon="Search"
          clearable
        />
        <span class="level-label">{{ labels.level }}</span>
        <div class="level-buttons">
          <button
            v-for="level in LEVELS"
            :key="level"
            type="button"
            :class="{ 'is-active': selectedLevel === level }"
            @click="selectedLevel = level"
          >
            {{ level }}
          </button>
        </div>
      </div>
      <div class="tier-filters">
        <button
          type="button"
          :class="{ 'is-active': tierFilter === 'all' }"
          @click="tierFilter = 'all'"
        >
          {{ labels.all }}
        </button>
        <button
          v-for="tier in TIERS"
          :key="tier.value"
          type="button"
          :class="{ 'is-active': tierFilter === tier.value }"
          :style="{ '--tier-color': tier.color }"
          @click="tierFilter = tier.value"
        >
          {{ labels.tier[tier.value] }}
        </button>
      </div>
      <div class="enemy-grid">
        <button type="button" class="enemy-card enemy-card--custom" @click="selectCustom">
          <span class="card-avatar">?</span>
          <span
            ><strong>{{ labels.custom }}</strong
            ><small>{{ labels.customDescription }}</small></span
          >
        </button>
        <button
          v-for="candidate in filteredEnemies"
          :key="candidate.id"
          type="button"
          class="enemy-card"
          :class="{ selected: definition?.id === candidate.id }"
          :disabled="!supportsLevel(candidate)"
          :style="{ '--tier-color': TIERS.find(tier => tier.value === candidate.tier)?.color }"
          @click="selectDefinition(candidate)"
        >
          <span class="card-avatar">
            <img v-if="candidate.iconPath" :src="candidate.iconPath" alt="" />
          </span>
          <span>
            <strong>{{ nameOf(candidate.id) }}</strong>
            <small>{{ labels.tier[candidate.tier] }}</small>
          </span>
        </button>
        <div v-if="filteredEnemies.length === 0" class="empty-state">{{ labels.empty }}</div>
      </div>
    </el-dialog>

    <el-dialog
      v-model="statsVisible"
      :title="labels.editStatsTitle"
      width="440px"
      align-center
      append-to-body
      class="armory-dialog next-enemy-stats-dialog"
    >
      <div class="stats-form">
        <label
          ><span>{{ labels.enemyHp }}</span
          ><input v-model.number="draft.hp" type="number" min="1"
        /></label>
        <label
          ><span>{{ labels.defense }}</span
          ><input v-model.number="draft.defense" type="number" min="0"
        /></label>
        <label
          ><span>{{ labels.finisherMultiplier }}</span
          ><input v-model.number="draft.finisherMultiplier" type="number" min="0" step="0.05"
        /></label>
        <label
          ><span>{{ labels.maximumStagger }}</span
          ><input v-model.number="draft.stagger.maximum" type="number" min="0"
        /></label>
        <div class="knot-threshold-field">
          <span>{{ labels.staggerNodes }}</span>
          <div class="knot-threshold-list">
            <div
              v-for="(_, index) in draft.stagger.knotThresholds"
              :key="index"
              class="knot-threshold-row"
            >
              <input
                v-model.number="draft.stagger.knotThresholds[index]"
                type="number"
                min="0.01"
                max="0.99"
                step="0.01"
              />
              <button type="button" :title="labels.close" @click="removeKnotThreshold(index)">
                <el-icon><Delete /></el-icon>
              </button>
            </div>
            <button
              type="button"
              class="add-knot-button"
              :disabled="!canAddKnotThreshold"
              @click="addKnotThreshold"
            >
              <el-icon><Plus /></el-icon>
              {{ labels.staggerNodes }}
            </button>
          </div>
        </div>
        <label
          ><span>{{ labels.nodeDuration }}</span
          ><input
            :value="draft.stagger.knotBreakDurationFrames / fps"
            type="number"
            min="0"
            step="0.1"
            @input="setDuration('knotBreakDurationFrames', $event)"
        /></label>
        <label
          ><span>{{ labels.brokenDuration }}</span
          ><input
            :value="draft.stagger.brokenDurationFrames / fps"
            type="number"
            min="0"
            step="0.1"
            @input="setDuration('brokenDurationFrames', $event)"
        /></label>
        <label
          ><span>{{ labels.finisherRecovery }}</span
          ><input v-model.number="draft.stagger.finisherSpRecovery" type="number" min="0"
        /></label>
        <label
          ><span>{{ labels.superArmor }}</span
          ><input v-model.number="draft.superArmor" type="number" min="0"
        /></label>
        <div class="form-section-title">{{ labels.resistances }}</div>
        <label v-for="type in EDITABLE_RESISTANCE_DAMAGE_TYPES" :key="type">
          <span>{{ labels.resistance[type] }}</span>
          <input
            :value="draft.resistances[type] ?? 0"
            type="number"
            step="0.01"
            @input="setDraftNumber(draft.resistances, type, $event)"
          />
        </label>
      </div>
      <template #footer>
        <button type="button" @click="statsVisible = false">{{ labels.close }}</button>
        <button type="button" class="primary-button" @click="saveDraft">
          {{ labels.confirm }}
        </button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped>
.enemy-settings-panel {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--ea-fg);
  background: var(--ea-workbench-panel);
}
.enemy-select-module {
  position: relative;
  width: 100%;
  height: auto;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-bottom: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
  text-align: left;
}
.module-deco-line {
  position: absolute;
  inset: 8px auto 8px 0;
  width: 2px;
  background: var(--ea-gold);
}
.enemy-avatar-box,
.card-avatar {
  width: 34px;
  height: 34px;
  flex: none;
  display: grid;
  place-items: center;
  overflow: hidden;
  border: 1px solid var(--ea-border-strong);
  background: var(--ea-keycap-bg);
}
.enemy-avatar-box img,
.card-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.custom-avatar-placeholder {
  color: var(--ea-gold);
  font-weight: 900;
}
.enemy-info-col {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.enemy-name-line {
  display: flex;
  align-items: center;
  gap: 6px;
}
.enemy-name {
  overflow: hidden;
  color: var(--ea-fg);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.enemy-level-badge,
.click-hint {
  color: var(--ea-gold);
  font-size: 10px;
}
.click-hint {
  opacity: 0.55;
}
.stats-summary {
  min-height: 0;
  padding: 10px;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 7px;
}
.summary-row {
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
  background: var(--ea-fill-soft);
  font-size: 11px;
}
.summary-row span {
  color: var(--ea-fg-secondary);
}
.summary-row strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.stats-edit-button {
  width: 100%;
  margin-top: auto;
}
.selector-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.selector-header .el-input {
  width: 180px;
}
.level-label {
  color: var(--ea-fg-muted);
  font-size: 12px;
}
.level-buttons,
.tier-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.level-buttons button,
.tier-filters button {
  min-width: 30px;
  height: 24px;
  padding: 0 7px;
}
.level-buttons button.is-active,
.tier-filters button.is-active {
  color: var(--tier-color, var(--ea-gold));
  border-color: var(--tier-color, var(--ea-gold));
}
.tier-filters {
  margin: 14px 0;
  padding: 8px;
  background: var(--ea-fill-input);
}
.enemy-grid {
  max-height: 450px;
  padding: 6px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  overflow-y: auto;
}
.enemy-card {
  --tier-color: var(--ea-border-strong);
  min-width: 0;
  height: 60px;
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-left: 3px solid var(--tier-color);
  background: var(--ea-fill-muted);
  text-align: left;
}
.enemy-card > span:last-child {
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.enemy-card strong,
.enemy-card small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.enemy-card strong {
  color: var(--ea-fg);
  font-size: 12px;
}
.enemy-card small {
  color: var(--tier-color);
  font-size: 10px;
}
.enemy-card.selected {
  background: color-mix(in srgb, var(--tier-color) 15%, var(--ea-fill-muted));
}
.enemy-card:disabled {
  opacity: 0.35;
}
.enemy-card--custom {
  --tier-color: var(--ea-gold);
}
.empty-state {
  grid-column: 1 / -1;
  padding: 40px;
  color: var(--ea-fg-faint);
  text-align: center;
}
.stats-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stats-form label {
  padding: 7px 9px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}
.stats-form label span {
  color: var(--ea-fg-secondary);
  font-size: 12px;
}
.stats-form input {
  width: 92px;
  height: 26px;
  box-sizing: border-box;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg);
  text-align: right;
}
.knot-threshold-field {
  padding: 7px 9px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 12px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
  color: var(--ea-fg-secondary);
  font-size: 12px;
}
.knot-threshold-list {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}
.knot-threshold-row {
  display: flex;
  gap: 4px;
}
.knot-threshold-row button,
.add-knot-button {
  min-width: 26px;
  height: 26px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-input);
  color: var(--ea-fg-secondary);
}
.add-knot-button {
  padding: 0 7px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.form-section-title {
  margin-top: 8px;
  color: var(--ea-fg-secondary);
  font-size: 12px;
  font-weight: 700;
}
.primary-button {
  border-color: var(--ea-gold);
  color: var(--ea-gold);
}
</style>
