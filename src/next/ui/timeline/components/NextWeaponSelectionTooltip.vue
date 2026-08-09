<script setup lang="ts">
/**
 * Next 武器选择器的只读预览。它复刻旧选择器的 tooltip 内容，但只从 WeaponDefinition
 * 和按需加载的游戏文本推导显示值，不读取旧武器目录或 Build 状态。
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import GameRichTextRenderer from '@/components/GameRichTextRenderer.vue';
import { getWeaponSkillDescription, getWeaponSkillName } from '@/data/gameText';
import type {
  WeaponDefinition,
  WeaponTraitDefinition,
} from '../../../core/game-data/equipmentDefinition';

const props = defineProps<{
  weapon: WeaponDefinition;
  name: string;
  fullPotential: boolean;
}>();

const { t, locale } = useI18n({ useScope: 'global' });

function traitLevel(trait: WeaponTraitDefinition): number {
  // 武器初始词条为 1 级，满潜增加 5 级；基质等级不属于选择器的 Ctrl 预览范围。
  return Math.min(trait.levelCount, props.fullPotential ? 6 : 1);
}

function isWeaponSkillKey(value: string): value is 'skill1' | 'skill2' | 'skill3' {
  return value === 'skill1' || value === 'skill2' || value === 'skill3';
}

const preview = computed(() => ({
  baseAttack: props.weapon.baseAttackAtLevelNodes.at(-1) ?? 0,
  skills: props.weapon.traits.flatMap(trait => {
    if (!isWeaponSkillKey(trait.key)) return [];
    const level = traitLevel(trait);
    return [
      {
        key: trait.key,
        level,
        name: getWeaponSkillName(props.weapon.slug, trait.key, locale.value),
        description: getWeaponSkillDescription(props.weapon.slug, trait.key, locale.value, level),
      },
    ];
  }),
}));
</script>

<template>
  <div class="weapon-selection-preview">
    <div class="weapon-selection-preview__name">{{ name }}</div>
    <div class="weapon-selection-preview__meta">
      Lv90 · {{ t('armory.common.baseAtk') }}
      <strong>{{ preview.baseAttack }}</strong>
    </div>
    <div
      v-for="skill in preview.skills"
      :key="`${weapon.slug}_${skill.key}`"
      class="weapon-selection-preview__skill"
    >
      <div class="weapon-selection-preview__skill-heading">
        <strong>{{ skill.name }}</strong>
        <span>Lv{{ skill.level }}</span>
      </div>
      <GameRichTextRenderer v-if="skill.description" :text="skill.description" :locale="locale" />
    </div>
    <div class="weapon-selection-preview__potential-hint">
      {{
        t(
          fullPotential
            ? 'timelineGrid.weaponDialog.fullPotentialActive'
            : 'timelineGrid.weaponDialog.fullPotentialHint',
        )
      }}
    </div>
  </div>
</template>

<style scoped>
:global(.weapon-selection-preview-popper) {
  max-width: min(440px, calc(100vw - 32px));
}

:global(.weapon-selection-preview-popper.el-popper.is-dark) {
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #050505;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.72);
}

:global(.weapon-selection-preview-popper.el-popper.is-dark .el-popper__arrow::before) {
  border-color: rgba(255, 255, 255, 0.18);
  background: #050505;
}

:global(html[data-theme='light'] .weapon-selection-preview-popper.el-popper.is-dark) {
  border: 1px solid rgba(26, 27, 30, 0.14);
  background: #ffffff;
  color: #1a1b1e;
  box-shadow: 0 14px 34px rgba(26, 27, 30, 0.16);
}

:global(
  html[data-theme='light'] .weapon-selection-preview-popper.el-popper .el-popper__arrow::before
) {
  border-color: rgba(26, 27, 30, 0.14) !important;
  background: #ffffff !important;
}

:global(html[data-theme='light'] .weapon-selection-preview__name) {
  border-bottom-color: rgba(26, 27, 30, 0.12);
  color: #1a1b1e;
}

:global(html[data-theme='light'] .weapon-selection-preview__meta),
:global(html[data-theme='light'] .weapon-selection-preview__skill-heading span) {
  color: rgba(26, 27, 30, 0.55);
}

:global(html[data-theme='light'] .weapon-selection-preview__skill) {
  color: rgba(26, 27, 30, 0.84);
}

:global(.weapon-selection-preview) {
  width: min(400px, calc(100vw - 64px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  line-height: 1.5;
}

:global(.weapon-selection-preview__name) {
  padding: 2px 0 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.96);
  font-size: 14px;
  font-weight: 700;
}

:global(.weapon-selection-preview__meta),
:global(.weapon-selection-preview__skill-heading span) {
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
}

:global(.weapon-selection-preview__meta strong),
:global(.weapon-selection-preview__skill-heading span) {
  color: #facc15;
}

:global(.weapon-selection-preview__skill) {
  color: rgba(255, 255, 255, 0.88);
}

:global(.weapon-selection-preview__skill-heading) {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 3px;
}

:global(.weapon-selection-preview__potential-hint) {
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
  text-align: center;
}
</style>
