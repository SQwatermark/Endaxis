<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  OperatorDefinition,
  SkillDefinition,
  SkillLevelSource,
} from '../../../core/game-data/operatorDefinition';
import { listOperatorSkillDefinitionBindings } from '../../../core/game-data/operatorSkillDefinitions';
import { getOperatorCombatSkillDescription, getOperatorCombatSkillName } from '../../gameText';
import { formatOperatorSkillLevel } from '../../progression';
import GameRichTextRenderer from '../../components/GameRichTextRenderer.vue';

const props = defineProps<{
  operator: OperatorDefinition;
  operatorSlug: string;
  skillKey: SkillLevelSource;
  skillLevel?: number;
  skillTypeName?: string;
}>();

const { t, locale } = useI18n({ useScope: 'global' });
const level = computed(() => Math.max(1, Math.trunc(props.skillLevel ?? 1)));
const levelIndex = computed(() => level.value - 1);

const skill = computed<SkillDefinition | null>(
  () =>
    listOperatorSkillDefinitionBindings(props.operator).find(
      binding => binding.skill.levelSource === props.skillKey,
    )?.skill ?? null,
);

function leveled(value: number | readonly number[] | undefined): number | null {
  if (typeof value === 'number') return value;
  if (!Array.isArray(value) || value.length === 0) return null;
  return value[Math.min(levelIndex.value, value.length - 1)] ?? null;
}

const name = computed(() =>
  getOperatorCombatSkillName(props.operatorSlug, props.skillKey, locale.value, props.skillTypeName),
);
const description = computed(() =>
  getOperatorCombatSkillDescription(props.operatorSlug, props.skillKey, locale.value),
);
const rows = computed(() => {
  const current = skill.value;
  if (!current) return [];
  const result: Array<{ key: string; label: string; value: string }> = [];
  for (const cost of current.costs ?? []) {
    const value = leveled(cost.value);
    if (value === null || value <= 0) continue;
    const labelKey = `armory.operator.skillTooltip.${cost.resource}`;
    const translated = t(labelKey);
    result.push({
      key: `cost:${cost.resource}`,
      label: translated === labelKey ? cost.resource : translated,
      value: String(Math.round(value * 100) / 100),
    });
  }
  const cooldownFrames = leveled(current.cooldownFrames);
  if (cooldownFrames !== null && cooldownFrames > 0) {
    result.push({
      key: 'cooldown',
      label: t('armory.operator.skillTooltip.cooldown'),
      value: `${Math.round((cooldownFrames / 30) * 100) / 100}${t('armory.operator.skillTooltip.seconds')}`,
    });
  }
  return result;
});
</script>

<template>
  <div class="operator-skill-tooltip">
    <div class="operator-skill-tooltip-header">
      <div>
        <div class="operator-skill-tooltip-title">{{ name }}</div>
        <div class="operator-skill-tooltip-rank">
          {{ t('armory.operator.skillTooltip.rank', { level: formatOperatorSkillLevel(level) }) }}
        </div>
      </div>
      <div class="operator-skill-tooltip-type">{{ skillTypeName }}</div>
    </div>
    <div v-if="description" class="operator-skill-tooltip-desc">
      <GameRichTextRenderer :text="description" :locale="locale" />
    </div>
    <div v-if="rows.length" class="operator-skill-tooltip-resources">
      <div v-for="row in rows" :key="row.key" class="operator-skill-tooltip-resource">
        <span>{{ row.label }}</span
        ><span>{{ row.value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.operator-skill-tooltip {
  box-sizing: border-box;
  width: min(380px, calc(100vw - 48px));
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 12px;
  color: var(--ea-tooltip-fg, #f1f1f1);
}
.operator-skill-tooltip-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding-bottom: 7px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 14%, transparent);
}
.operator-skill-tooltip-title {
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
}
.operator-skill-tooltip-rank,
.operator-skill-tooltip-type {
  opacity: 0.5;
  font-size: 11px;
  font-weight: 700;
}
.operator-skill-tooltip-desc {
  font-size: 13px;
  line-height: 1.55;
}
.operator-skill-tooltip-resources {
  display: grid;
  gap: 4px;
  padding-top: 7px;
  border-top: 1px solid color-mix(in srgb, currentColor 12%, transparent);
}
.operator-skill-tooltip-resource {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 12px;
}
.operator-skill-tooltip-resource span:last-child {
  color: #facc15;
  font-weight: 700;
}
</style>
