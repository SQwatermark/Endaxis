<script setup lang="ts">
/**
 * Next 时间轴的整轨装备养成编辑器。
 *
 * 组件复刻旧版四槽配装弹窗的布局与统一精锻交互，但只消费父层投影好的 Build；
 * 它不读取存档或旧 store，也不直接写入持久化数据。当前 Next 装备定义尚未提供可供
 * UI 本地化展示的词条名称与数值，因此这里不会用内部 trait key 伪造词条明细。
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  getGameSlotTypeName,
  getGearPieceGameName,
  getGearSetGameDescription,
  getGearSetGameName,
} from '../../legacy/legacyGameText';
import { getEquipmentLevelColor, isEquipmentArtificable } from '../../legacy/legacyProgression';
import { GameRichTextRenderer } from '../../legacy/legacyPresentation';
import type {
  GearInstanceViewModel,
  GearSlotsViewModel,
  LoadoutGearSlot,
} from '../loadoutBuildViewModel';

const props = defineProps<{
  visible: boolean;
  gears: GearSlotsViewModel;
  customDefinitionSlugs: readonly string[];
  gearSetNames: Readonly<Record<string, string>>;
  gearSetTextSlugs: Readonly<Record<string, string>>;
}>();

const emit = defineEmits<{
  'update:visible': [visible: boolean];
  update: [slot: LoadoutGearSlot, artificingLevels: readonly number[]];
  'edit-definition': [slot: LoadoutGearSlot];
}>();

const { t, locale } = useI18n({ useScope: 'global' });
const SET_BONUS_REQUIRED_COUNT = 3;
const REFINE_LEVELS = [0, 1, 2, 3] as const;

interface SlotConfig {
  readonly slot: LoadoutGearSlot;
  readonly labelKey: string;
  readonly fallback: string;
}

const SLOT_CONFIGS: readonly SlotConfig[] = [
  {
    slot: 'armor',
    labelKey: 'timelineGrid.equipmentSlot.armor',
    fallback: 'Armor',
  },
  {
    slot: 'gloves',
    labelKey: 'timelineGrid.equipmentSlot.gloves',
    fallback: 'Gloves',
  },
  {
    slot: 'accessory1',
    labelKey: 'timelineGrid.equipmentSlot.accessory1',
    fallback: 'Accessory 1',
  },
  {
    slot: 'accessory2',
    labelKey: 'timelineGrid.equipmentSlot.accessory2',
    fallback: 'Accessory 2',
  },
];

function translate(key: string, fallback: string): string {
  const translated = t(key);
  return translated === key ? fallback : translated;
}

function normalizedArtificingLevels(build: GearInstanceViewModel): readonly number[] {
  return build.artificingLevels.map(level => Math.max(0, Math.min(3, Number(level) || 0)));
}

function isUniformLevel(build: GearInstanceViewModel, level: number): boolean {
  const levels = normalizedArtificingLevels(build);
  return levels.length > 0 && levels.every(candidate => candidate === level);
}

function setUniformLevel(build: GearInstanceViewModel, level: number): void {
  if (!isEquipmentArtificable(build.definition.levelRequirement)) return;
  emit(
    'update',
    build.slot,
    build.artificingLevels.map(() => level),
  );
}

function maxOut(): void {
  for (const config of SLOT_CONFIGS) {
    const build = props.gears[config.slot];
    if (build !== null && isEquipmentArtificable(build.definition.levelRequirement)) {
      setUniformLevel(build, 3);
    }
  }
}

const slots = computed(() =>
  SLOT_CONFIGS.map(config => {
    const build = props.gears[config.slot];
    if (build === null) return { ...config, build: null };
    const definition = build.definition;
    const gearSetSlug = definition.gearSetSlug ?? '';
    return {
      ...config,
      build,
      name:
        definition.displayName ??
        getGearPieceGameName(definition.assetSlug ?? definition.slug, locale.value),
      setName:
        gearSetSlug === ''
          ? ''
          : (props.gearSetNames[gearSetSlug] ?? getGearSetGameName(gearSetSlug, locale.value)),
      slotTypeName: getGameSlotTypeName(definition.slotType, locale.value),
      levelColor: getEquipmentLevelColor(definition.levelRequirement),
      isArtificable: isEquipmentArtificable(definition.levelRequirement),
      levels: normalizedArtificingLevels(build),
    };
  }),
);

const activeSetBonuses = computed(() => {
  const counts = new Map<string, number>();
  for (const build of Object.values(props.gears)) {
    const setSlug = build?.definition.gearSetSlug;
    if (setSlug === undefined || setSlug === 'no-set-bonuses') continue;
    counts.set(setSlug, (counts.get(setSlug) ?? 0) + 1);
  }
  return [...counts.entries()].flatMap(([setSlug, equippedCount]) => {
    if (equippedCount < SET_BONUS_REQUIRED_COUNT) return [];
    const description = getGearSetGameDescription(
      props.gearSetTextSlugs[setSlug] ?? setSlug,
      locale.value,
    );
    if (description === null) return [];
    return [
      {
        setSlug,
        equippedCount,
        description,
        setName: props.gearSetNames[setSlug] ?? getGearSetGameName(setSlug, locale.value),
      },
    ];
  });
});
</script>

<template>
  <el-dialog
    :model-value="visible"
    width="980px"
    append-to-body
    class="gear-loadout-dialog"
    @update:model-value="emit('update:visible', $event)"
  >
    <div class="loadout-layout">
      <div
        v-for="slot in slots"
        :key="slot.slot"
        class="gear-slot-card"
        :class="{ 'is-empty': slot.build === null }"
      >
        <div class="slot-head">
          <div class="slot-title">{{ translate(slot.labelKey, slot.fallback) }}</div>
          <div v-if="slot.build !== null" class="slot-tags">
            <span
              class="slot-tag"
              :style="{ color: slot.levelColor, borderColor: slot.levelColor }"
            >
              Lv{{ slot.build.definition.levelRequirement }}
            </span>
            <span class="slot-tag">{{ slot.slotTypeName }}</span>
          </div>
        </div>

        <template v-if="slot.build !== null">
          <div class="gear-main">
            <div class="gear-icon-frame" :style="{ borderColor: slot.levelColor }">
              <img
                :src="slot.build.definition.iconPath || '/icons/default_icon.webp'"
                :alt="slot.name"
                class="gear-icon"
              />
            </div>
            <div class="gear-info">
              <div class="gear-name">{{ slot.name }}</div>
              <div class="gear-subline">
                Lv{{ slot.build.definition.levelRequirement
                }}<span v-if="slot.setName"> / {{ slot.setName }}</span>
              </div>
            </div>
          </div>

          <div class="refine-row">
            <span class="refine-label">
              {{ translate('timelineGrid.equipmentDialog.refine', 'Refine') }}
            </span>
            <span v-if="slot.levels.length > 0" class="refine-mixed">
              {{ slot.levels.join('/') }}
            </span>
            <div v-if="slot.isArtificable" class="refine-buttons">
              <button
                v-for="level in REFINE_LEVELS"
                :key="`${slot.slot}-${level}`"
                type="button"
                class="ea-btn ea-btn--sm ea-btn--glass-rect ea-btn--accent-gold refine-btn"
                :class="{ 'is-active': isUniformLevel(slot.build, level) }"
                @click="setUniformLevel(slot.build, level)"
              >
                {{
                  level === 0 ? translate('timelineGrid.equipmentDialog.refineBase', 'Base') : level
                }}
              </button>
            </div>
            <span v-else class="refine-locked">
              {{ t('actionLibrary.hints.noRefineNonGold') }}
            </span>
          </div>
          <button
            type="button"
            class="ea-btn ea-btn--sm ea-btn--glass-rect definition-button"
            @click="emit('edit-definition', slot.slot)"
          >
            {{
              customDefinitionSlugs.includes(slot.build.gearSlug) ? '编辑装备定义' : '自定义装备'
            }}
          </button>
        </template>

        <div v-else class="empty-slot">
          {{ translate('actionLibrary.fallback.noEquip', 'No gear equipped') }}
        </div>
      </div>

      <div v-if="activeSetBonuses.length > 0" class="gear-set-bonus-panel">
        <div class="gear-set-bonus-title">
          {{ t('timelineGrid.equipmentDialog.setBonusTitle') }}
        </div>
        <div v-for="bonus in activeSetBonuses" :key="bonus.setSlug" class="gear-set-bonus-entry">
          <div class="gear-set-bonus-head">
            <span class="gear-set-bonus-name">{{ bonus.setName }}</span>
            <span class="gear-set-bonus-count">
              {{
                t('timelineGrid.equipmentDialog.setBonusEquipped', {
                  count: bonus.equippedCount,
                  required: SET_BONUS_REQUIRED_COUNT,
                })
              }}
            </span>
          </div>
          <GameRichTextRenderer
            class="gear-set-bonus-desc"
            :text="bonus.description"
            :locale="locale"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="footer">
        <button
          class="ea-btn ea-btn--sm ea-btn--glass-rect ea-btn--square ea-btn--hover-gold-fill"
          @click="maxOut"
        >
          {{ t('common.max') }}
        </button>
        <button class="ea-btn ea-btn--sm ea-btn--glass-rect" @click="emit('update:visible', false)">
          {{ t('common.close') }}
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.loadout-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.gear-slot-card {
  min-height: 190px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid var(--ea-border-soft, rgba(255, 255, 255, 0.08));
  background: var(--ea-fill-soft, rgba(255, 255, 255, 0.03));
}

.gear-slot-card.is-empty {
  justify-content: space-between;
  opacity: 0.65;
}

.slot-head,
.gear-set-bonus-head,
.refine-row {
  display: flex;
  align-items: center;
}

.definition-button {
  align-self: flex-end;
}

.slot-head {
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.slot-title,
.gear-name {
  color: var(--ea-fg, #f0f0f0);
  font-weight: 700;
}

.slot-title {
  font-size: 14px;
  letter-spacing: 1px;
}

.slot-tags,
.refine-buttons {
  display: flex;
  gap: 6px;
}

.slot-tag {
  padding: 2px 8px;
  color: var(--ea-fg-muted, #bbb);
  font-size: 10px;
  border: 1px solid var(--ea-border-strong, #555);
  background: var(--ea-fill-soft, rgba(255, 255, 255, 0.04));
}

.gear-main {
  display: flex;
  gap: 14px;
  min-width: 0;
}

.gear-icon-frame {
  width: 76px;
  height: 76px;
  flex: 0 0 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--ea-keycap-border, #555);
  background: var(--ea-keycap-bg, #1a1a1e);
}

.gear-icon {
  width: 72%;
  height: 72%;
  object-fit: contain;
}

.gear-info {
  min-width: 0;
  flex: 1;
}

.gear-name {
  font-size: 16px;
  line-height: 1.3;
}

.gear-subline {
  margin-top: 4px;
  color: var(--ea-dialog-hint, #999);
  font-size: 12px;
}

.refine-row {
  min-height: 28px;
  margin-top: auto;
  gap: 10px;
}

.refine-label {
  color: var(--ea-dialog-hint, #888);
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.refine-mixed {
  color: var(--ea-gold);
  font-family: 'Roboto Mono', monospace;
  font-size: 12px;
}

.refine-btn {
  min-width: 34px;
  height: 24px;
  padding: 0 8px;
}

.refine-locked,
.empty-slot {
  color: var(--ea-dialog-hint, #777);
  font-size: 12px;
}

.gear-set-bonus-panel {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 13px 14px;
  border: 1px solid var(--ea-border-soft, rgba(255, 255, 255, 0.08));
  background: var(--ea-fill-soft, rgba(255, 255, 255, 0.03));
}

.gear-set-bonus-title {
  color: var(--ea-fg-secondary, #d6d6d6);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1px;
}

.gear-set-bonus-entry {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--ea-fg-secondary, #d6d6d6);
  font-size: 12px;
  line-height: 1.55;
}

.gear-set-bonus-head {
  gap: 8px;
  min-width: 0;
}

.gear-set-bonus-name {
  min-width: 0;
  color: var(--ea-gear-accent-fg, #2dd4bf);
  font-size: 14px;
  font-weight: 800;
}

.gear-set-bonus-count {
  margin-left: auto;
  color: var(--ea-gear-accent-fg, #2dd4bf);
  font-family: 'Roboto Mono', monospace;
  white-space: nowrap;
  opacity: 0.85;
}

.gear-set-bonus-desc {
  color: var(--ea-fg-secondary, #d0d0d0);
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}

@media (max-width: 760px) {
  .loadout-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .gear-set-bonus-panel {
    grid-column: 1;
  }
}
</style>
