<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  combatStatusIconStyle,
  type CombatStatusDisplaySlot,
  type CombatStatusIndicator,
} from '../../../core/projection/combatStatusIndicators';
import { resolveBuffDisplayName } from '../buffDisplayName';

const props = defineProps<{
  indicators: readonly CombatStatusIndicator[];
  slot: CombatStatusDisplaySlot;
  frame: number;
}>();

const { t, te } = useI18n({ useScope: 'global' });

const items = computed(() =>
  props.indicators
    .filter(indicator => indicator.slots.includes(props.slot))
    .map(indicator => {
      const duration = indicator.endFrame - indicator.startFrame;
      const remainingRatio =
        indicator.hasFiniteLifetime === true && duration > 0
          ? Math.max(0, Math.min(1, (indicator.endFrame - props.frame) / duration))
          : null;
      return {
        ...indicator,
        key: `${indicator.targetId}:${indicator.buffId}:${indicator.instanceId}`,
        title: resolveBuffDisplayName(indicator.nameKey, indicator.buffId, { t, te }),
        icon: indicator.iconPath ?? (indicator.iconId ? `/icons/${indicator.iconId}.webp` : null),
        style: combatStatusIconStyle(indicator, props.slot),
        remainingRatio,
      };
    }),
);
</script>

<template>
  <span v-if="items.length > 0" class="combat-status-strip">
    <span
      v-for="item in items"
      :key="item.key"
      class="combat-status-icon"
      :class="[`is-${item.style.toLowerCase()}`, { 'has-warning': item.showWarningBackground }]"
      :title="item.title"
    >
      <img v-if="item.icon" :src="item.icon" alt="" />
      <span v-else class="combat-status-icon__fallback">+</span>
      <span v-if="item.layers > 1" class="combat-status-icon__layers">{{ item.layers }}</span>
      <span
        v-if="item.remainingRatio !== null"
        class="combat-status-icon__lifetime"
        :style="{ width: `${item.remainingRatio * 100}%` }"
      ></span>
    </span>
  </span>
</template>

<style scoped>
.combat-status-strip {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 3px;
}

.combat-status-icon {
  position: relative;
  display: grid;
  flex: 0 0 20px;
  width: 20px;
  height: 20px;
  place-items: center;
  box-sizing: border-box;
  overflow: visible;
  border: 1px solid rgb(181 185 191 / 72%);
  border-radius: 2px;
  background: #3d4045;
  box-shadow: 0 1px 2px rgb(0 0 0 / 55%);
}

.combat-status-icon.is-attached {
  border-radius: 50%;
}

.combat-status-icon.is-spellabnormal {
  border-color: color-mix(in srgb, var(--ea-element-accent, #8ec5ff) 72%, #aaa);
}

.combat-status-icon.has-warning {
  box-shadow:
    0 0 0 1px rgb(225 88 65 / 75%),
    0 1px 2px rgb(0 0 0 / 55%);
}

.combat-status-icon img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  object-fit: cover;
}

.combat-status-icon__fallback {
  color: #d4d6da;
  font-size: 10px;
  font-weight: 800;
}

.combat-status-icon__layers {
  position: absolute;
  right: -3px;
  bottom: -3px;
  min-width: 9px;
  padding: 0 2px;
  border-radius: 2px;
  background: rgb(19 20 22 / 92%);
  color: #f2f2f2;
  font:
    700 8px/10px 'Roboto Mono',
    Consolas,
    monospace;
  text-align: center;
}

.combat-status-icon__lifetime {
  position: absolute;
  bottom: -1px;
  left: 0;
  height: 2px;
  max-width: 100%;
  background: #e4e6e9;
  box-shadow: 0 0 1px #000;
}
</style>
