<script setup lang="ts">
import { resolveImage } from '../../imageResources';
/**
 * Next 时间轴的武器养成编辑弹窗。界面沿用旧版武器编辑器，但只读取稳定的 Build 投影，
 * 所有用户修改均通过事件交给父层持久化；组件本身不访问旧 Store，也不补造定义中不存在的数据。
 */
import { EaButton, EaDialog, EaDialogActions } from '../../../design-system/index';
import { computed } from 'vue';
import InputRegionBoundary from '../../keyboard/InputRegionBoundary.vue';
import { useI18n } from 'vue-i18n';
import './armoryDialog.css';
import {
  getGameWeaponTypeName,
  getWeaponGameName,
  getWeaponSkillDescription,
  getWeaponSkillName,
  getWeaponUiLabel,
} from '../../gameText';
import { getWeaponTraitBounds, type WeaponLevel } from '../../progression';
import { GameRichTextRenderer } from '../../presentation';
import type { WeaponInstanceChanges } from './loadoutBuildCommands';
import type { WeaponInstanceViewModel } from './loadoutBuildViewModel';
import { DEFAULT_WEAPON_ICON_PATH } from '../../gameAssetPaths';
import {
  projectMaxWeaponChanges,
  projectWeaponPotentialChange,
  projectWeaponProgressionChange,
} from './loadoutBuildProgression';
import { getWeaponTraitValueText } from './weaponTraitPresentation';
import ArmoryLevelSlot from './ArmoryLevelSlot.vue';

const LEVELS = [1, 20, 40, 60, 80, 90] as const satisfies readonly WeaponLevel[];
type WeaponTraitKey = 'skill1' | 'skill2' | 'skill3';
type LevelSlotState = 'base' | 'active' | 'empty' | 'locked';

const props = defineProps<{
  visible: boolean;
  weapon: WeaponInstanceViewModel | null;
}>();

const emit = defineEmits<{
  'update:visible': [visible: boolean];
  change: [changes: WeaponInstanceChanges];
}>();

const { t, locale } = useI18n({ useScope: 'global' });

const rarityColor = computed(() => {
  const rarity = props.weapon?.definition.rarity ?? 0;
  if (rarity === 6) return 'var(--ea-gold)';
  if (rarity === 5) return '#ffc400';
  if (rarity === 4) return '#d8b4fe';
  return '#888';
});

const potentialColor = computed(() => {
  const rarity = props.weapon?.definition.rarity ?? 0;
  if (rarity === 6) return '#ff4500';
  if (rarity === 5) return '#ffc400';
  if (rarity === 4) return '#d8b4fe';
  return '#888';
});

const levelNodeIndex = computed(() => LEVELS.findIndex(level => level === props.weapon?.level));

const baseAttack = computed(() => {
  const weapon = props.weapon;
  if (!weapon || levelNodeIndex.value < 0) return null;
  return weapon.definition.baseAttackAtLevelNodes[levelNodeIndex.value] ?? null;
});
const weaponTextSlug = computed(
  () => props.weapon?.definition.assetSlug ?? props.weapon?.weaponSlug ?? '',
);
const weaponDisplayName = computed(
  () =>
    props.weapon?.definition.displayName ?? getWeaponGameName(weaponTextSlug.value, locale.value),
);

const canTune = computed(() => {
  const level = props.weapon?.level;
  return level !== undefined && level !== 1 && level !== 90;
});

function isWeaponTraitKey(value: string): value is WeaponTraitKey {
  return value === 'skill1' || value === 'skill2' || value === 'skill3';
}

function currentLevelNode(): WeaponLevel | null {
  return LEVELS.find(level => level === props.weapon?.level) ?? null;
}

const currentBounds = computed(() => {
  const weapon = props.weapon;
  const level = currentLevelNode();
  return weapon && level ? getWeaponTraitBounds(level, weapon.tuned, weapon.potential) : null;
});

const traitRows = computed(() =>
  (props.weapon?.definition.traits ?? []).map((trait, index) => {
    const key = trait.key;
    const current = props.weapon?.traitLevels[index] ?? 1;
    const bounds = (isWeaponTraitKey(key) ? currentBounds.value?.[key] : undefined) ?? {
      min: 1,
      max: trait.levelCount,
    };
    return {
      key,
      current,
      bounds,
      name: isWeaponTraitKey(key)
        ? getWeaponSkillName(weaponTextSlug.value, key, locale.value, t(`armory.weapon.${key}`))
        : key,
      description: isWeaponTraitKey(key)
        ? (getWeaponSkillDescription(weaponTextSlug.value, key, locale.value, current) ?? '')
        : '',
      valueText: getWeaponTraitValueText(trait, current),
      slots: Array.from({ length: Math.max(1, trait.levelCount) }, (_, offset): LevelSlotState => {
        const level = offset + 1;
        if (level <= bounds.min) return 'base';
        if (level <= current) return 'active';
        return level <= bounds.max ? 'empty' : 'locked';
      }),
    };
  }),
);

function emitChange(changes: WeaponInstanceChanges): void {
  emit('change', changes);
}

function handleLevelChange(level: WeaponLevel): void {
  const weapon = props.weapon;
  if (!weapon) return;
  emitChange(projectWeaponProgressionChange(weapon, level, weapon.tuned));
}

function toggleTuning(): void {
  const weapon = props.weapon;
  const level = currentLevelNode();
  if (!weapon || !level || !canTune.value) return;
  emitChange(projectWeaponProgressionChange(weapon, level, !weapon.tuned));
}

function setPotential(potential: number): void {
  const weapon = props.weapon;
  if (!weapon) return;
  const nextPotential = weapon.potential === potential ? potential - 1 : potential;
  emitChange(projectWeaponPotentialChange(weapon, nextPotential));
}

function setTraitLevel(index: number, selectedLevel: number): void {
  const weapon = props.weapon;
  const row = traitRows.value[index];
  if (!weapon || !row || selectedLevel <= row.bounds.min || selectedLevel > row.bounds.max) return;
  const traitLevels = [...weapon.traitLevels];
  traitLevels[index] =
    selectedLevel === row.current ? Math.max(row.bounds.min, row.current - 1) : selectedLevel;
  emitChange({ traitLevels });
}

function tuningLabel(): string {
  const weapon = props.weapon;
  if (!weapon) return '';
  if (canTune.value) return getWeaponUiLabel('tuned', locale.value);
  return getWeaponUiLabel(weapon.level === 90 ? 'fullyTuned' : 'tuningUnavailable', locale.value);
}

function maxOut(): void {
  const weapon = props.weapon;
  if (!weapon) return;
  emitChange(projectMaxWeaponChanges(weapon));
}
</script>

<template>
  <InputRegionBoundary label="weapon-build" :active="visible" modal>
    <EaDialog
      :model-value="visible"
      width="700px"
      append-to-body
      align-center
      class="armory-dialog next-armory-dialog"
      @update:model-value="emit('update:visible', $event)"
    >
      <template v-if="weapon">
        <div class="layout">
          <div class="header">
            <div
              class="portrait-frame"
              :class="`rarity-${weapon.definition.rarity}-style`"
              :style="weapon.definition.rarity === 6 ? {} : { borderColor: rarityColor }"
            >
              <img
                :src="resolveImage(weapon.definition.icon) || DEFAULT_WEAPON_ICON_PATH"
                alt=""
                class="portrait"
              />
            </div>
            <div class="header-info">
              <div class="name-row">
                <span class="name">{{ weaponDisplayName }}</span>
                <span
                  class="stars"
                  :class="`header-rarity-${weapon.definition.rarity}`"
                  :style="{ color: rarityColor }"
                  >{{ '★'.repeat(weapon.definition.rarity) }}</span
                >
              </div>
              <div class="tags">
                <span class="tag">{{
                  getGameWeaponTypeName(weapon.definition.weaponType, locale)
                }}</span>
              </div>
              <div class="level-display">
                <span class="level-num">{{ weapon.level }}</span>
                <span class="level-text">{{ t('armory.common.level') }}</span>
              </div>
              <div v-if="baseAttack !== null" class="row">
                <span class="section-label">{{ t('armory.common.baseAtk') }}</span>
                <span class="value">{{ baseAttack }}</span>
              </div>
              <div class="row row-actions">
                <EaButton
                  size="sm"
                  :disabled="!canTune"
                  :style="weapon.tuned ? { borderColor: rarityColor, color: rarityColor } : {}"
                  @click="toggleTuning"
                >
                  {{ tuningLabel() }}
                </EaButton>
              </div>
              <div class="row">
                <span class="section-label">{{ t('armory.common.potential') }}</span>
                <div class="diamonds">
                  <EaButton
                    v-for="potential in 5"
                    :key="potential"
                    class="diamond"
                    :style="weapon.potential >= potential ? { background: potentialColor } : {}"
                    @click="setPotential(potential)"
                    :pressed="weapon.potential >= potential"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="level-selector">
            <EaButton
              size="sm"
              v-for="level in LEVELS"
              :key="level"
              class="level-btn"
              :style="
                weapon.level === level
                  ? {
                      borderColor: rarityColor,
                      color: rarityColor,
                      background: `color-mix(in srgb, ${rarityColor} 18%, var(--ea-dialog-bg, #fff))`,
                    }
                  : {}
              "
              @click="handleLevelChange(level)"
            >
              Lv{{ level }}
            </EaButton>
          </div>

          <div class="section">
            <div class="section-title">{{ t('armory.common.skills') }}</div>
            <div v-for="(row, index) in traitRows" :key="row.key" class="skill-row">
              <div class="skill-row-main">
                <div class="skill-info">
                  <span class="skill-name">{{ row.name }}</span>
                  <span v-if="row.valueText" class="skill-value">{{ row.valueText }}</span>
                </div>
                <div class="skill-bar-area">
                  <div class="skill-slots">
                    <ArmoryLevelSlot
                      v-for="(state, offset) in row.slots"
                      :key="offset"
                      :state="state"
                      :label="`${row.name} ${offset + 1}`"
                      @click="setTraitLevel(index, offset + 1)"
                    />
                  </div>
                  <span class="skill-counter">{{ row.current }}/{{ row.bounds.max }}</span>
                </div>
              </div>
              <GameRichTextRenderer
                v-if="row.description"
                class="skill-description"
                :text="row.description"
                :locale="locale"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <EaDialogActions>
          <EaButton variant="primary" size="sm" :disabled="weapon === null" @click="maxOut">
            {{ t('common.max') }}
          </EaButton>
          <EaButton size="sm" @click="emit('update:visible', false)">
            {{ t('common.close') }}
          </EaButton>
        </EaDialogActions>
      </template>
    </EaDialog>
  </InputRegionBoundary>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.row-actions {
  flex-wrap: wrap;
}
.portrait-frame {
  --armory-pad: var(--ea-keycap-bg, #1a1a1e);
  width: 120px;
  min-width: 120px;
  height: 120px;
  border: 2px solid var(--ea-border-strong, #555);
  overflow: hidden;
  background: var(--armory-pad);
}
.portrait {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.rarity-6-style.portrait-frame {
  border: 2px solid transparent;
  background:
    linear-gradient(var(--armory-pad), var(--armory-pad)) padding-box,
    linear-gradient(135deg, var(--ea-gold), #ff8c00, #ff4500) border-box;
  box-shadow: 0 4px 12px rgba(255, 140, 0, 0.2);
}
.header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.name-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.name {
  font-size: 22px;
  font-weight: 700;
  color: var(--ea-fg, #f0f0f0);
}
.stars {
  font-size: 14px;
  letter-spacing: 1px;
}
.header-rarity-6.stars {
  background: linear-gradient(45deg, var(--ea-gold), #ff8c00, #ff4500);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent !important;
}
.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  font-size: 11px;
  border: 1px solid var(--ea-border-strong, #555);
  color: var(--ea-fg-secondary, #bbb);
  background: var(--ea-fill-soft, rgba(255, 255, 255, 0.04));
}
.level-display {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 4px;
}
.level-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--ea-fg, #f0f0f0);
  line-height: 1;
}
.level-text,
.section-label {
  font-size: 11px;
  color: var(--ea-dialog-hint, #888);
  letter-spacing: 1px;
  text-transform: uppercase;
}
.level-text {
  letter-spacing: 2px;
}
.row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.value {
  font-size: 16px;
  font-weight: 700;
  color: var(--ea-fg, #f0f0f0);
}
.diamonds {
  display: flex;
  gap: 8px;
}
.diamond {
  width: 16px;
  height: 16px;
  transform: rotate(45deg);
  border: 1.5px solid var(--ea-border-strong, #555);
  background: transparent;
  cursor: pointer;
  padding: 0;
}
.diamond[aria-pressed='true'] {
  border-color: transparent;
  box-shadow: none;
}
.level-selector {
  display: flex;
  gap: 6px;
}
.level-btn {
  flex: 1;
  justify-content: center;
}
.section {
  background: var(--ea-fill-soft, rgba(255, 255, 255, 0.02));
  border: 1px solid var(--ea-border-soft, rgba(255, 255, 255, 0.06));
  padding: 16px;
}
.section-title {
  font-size: 11px;
  font-weight: 700;
  color: var(--ea-dialog-hint, #888);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.skill-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 0;
  border-bottom: 1px solid var(--ea-border-soft, rgba(255, 255, 255, 0.04));
}
.skill-row:last-child {
  border-bottom: none;
}
.skill-row-main {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}
.skill-info {
  flex: 1;
  min-width: 0;
}
.skill-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--ea-fg, #e0e0e0);
}
.skill-value {
  margin-left: 8px;
  color: var(--ea-fg-muted, #aaa);
  font-size: 12px;
}
.skill-bar-area {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  flex-shrink: 0;
}
.skill-slots {
  display: flex;
  gap: 3px;
}
.skill-counter {
  font-size: 13px;
  font-weight: 700;
  color: var(--ea-fg-secondary, #ccc);
  min-width: 28px;
  text-align: right;
  font-family: 'Roboto Mono', monospace;
}
.skill-description {
  display: block;
  color: var(--ea-dialog-body, #c8c8c8);
  font-size: 12px;
  line-height: 1.55;
}
.footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}

@media (max-width: 768px) {
  .layout,
  .header {
    gap: 12px;
  }

  .portrait-frame {
    width: 82px;
    min-width: 82px;
    height: 82px;
  }

  .name {
    overflow-wrap: anywhere;
    font-size: 18px;
  }

  .level-num {
    font-size: 22px;
  }

  .level-selector,
  .skill-bar-area {
    overflow-x: auto;
  }

  .level-btn {
    min-width: 42px;
    flex: 0 0 auto;
  }

  .section {
    padding: 12px;
  }

  .skill-row-main {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .skill-bar-area {
    width: 100%;
    margin-left: 0;
  }

  .skill-slots {
    flex: 0 0 auto;
  }
}
@media (hover: hover) and (pointer: fine) {
  .diamond[aria-pressed='true']:hover:not(:disabled) {
    border-color: transparent;
    box-shadow: none;
  }
}
</style>
