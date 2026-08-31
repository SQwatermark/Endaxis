<script setup lang="ts">
/** 敌人状态栏的光标快照；数值完全来自投影，不在组件内解释回执。 */
import { computed } from 'vue';
import type { EnemyCombatHudSnapshot } from '../../../core/projection/combatHudSnapshot';

const props = defineProps<{
  snapshot: EnemyCombatHudSnapshot;
  name: string;
  level: number;
  /** 原生 UIPoiseBar 按敌人配置初始化的归一化结点阈值。 */
  poiseKnotThresholds: readonly number[];
  labels: {
    hp: string;
    poise: string;
    recovering: string;
    brokenEndWindow: string;
  };
}>();

function formatNumber(value: number | null): string {
  if (value === null) return '—';
  return Math.round(value).toLocaleString();
}

const poiseStateLabel = computed(() => {
  const state = props.snapshot.poise?.state;
  if (state === 'recovering') return props.labels.recovering;
  if (state === 'brokenEndWindow') return props.labels.brokenEndWindow;
  return null;
});
</script>

<template>
  <section class="enemy-hud-snapshot" :title="`${name} · Lv.${level}`">
    <header>
      <strong>{{ name }}</strong>
      <span>LV.{{ level }}</span>
    </header>
    <div class="gauge gauge--hp">
      <span class="gauge__label">{{ labels.hp }}</span>
      <span class="gauge__value">
        {{ formatNumber(snapshot.health.current) }}/{{ formatNumber(snapshot.health.maximum) }}
      </span>
      <span class="gauge__track">
        <span
          class="gauge__fill"
          :style="{ width: `${(snapshot.health.ratio ?? 0) * 100}%` }"
        ></span>
      </span>
    </div>
    <div v-if="snapshot.poise !== null" class="gauge gauge--poise">
      <span class="gauge__label">{{ labels.poise }}</span>
      <span v-if="poiseStateLabel !== null" class="gauge__state">{{ poiseStateLabel }}</span>
      <span class="gauge__value">
        {{ formatNumber(snapshot.poise.current) }}/{{ formatNumber(snapshot.poise.maximum) }}
      </span>
      <span class="gauge__track">
        <span
          class="gauge__fill"
          :style="{ width: `${(snapshot.poise.ratio ?? 0) * 100}%` }"
        ></span>
        <i
          v-for="threshold in poiseKnotThresholds"
          :key="threshold"
          class="gauge__knot"
          :style="{ left: `${(1 - threshold) * 100}%` }"
          aria-hidden="true"
        ></i>
      </span>
    </div>
  </section>
</template>

<style scoped>
.enemy-hud-snapshot {
  width: 180px;
  height: 68px;
  box-sizing: border-box;
  padding: 5px 8px 6px 10px;
  border-right: 1px solid var(--ea-divider, rgb(255 255 255 / 16%));
  border-left: 3px solid #ff7875;
  background: var(--ea-workbench-panel, #252526);
  color: var(--ea-fg);
  font-family: var(--ea-font-family, 'Segoe UI', sans-serif);
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  min-width: 0;
  margin-bottom: 3px;
}

header strong {
  min-width: 0;
  overflow: hidden;
  font-size: 11px;
  line-height: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

header span {
  flex: 0 0 auto;
  color: var(--ea-fg-faint, rgb(255 255 255 / 45%));
  font:
    700 9px/12px 'Roboto Mono',
    monospace;
}

.gauge {
  position: relative;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  align-items: center;
  height: 22px;
  color: #ff7875;
}

.gauge--poise {
  color: #ff9c6e;
}

.gauge__label {
  color: currentColor;
  font-size: 9px;
  font-weight: 800;
  line-height: 11px;
}

.gauge__value {
  justify-self: end;
  color: var(--ea-icon-strong, rgb(255 255 255 / 86%));
  font:
    700 9px/11px 'Roboto Mono',
    monospace;
  white-space: nowrap;
}

.gauge__state {
  position: absolute;
  left: 38px;
  top: 0;
  color: currentColor;
  font-size: 8px;
  line-height: 10px;
}

.gauge__track {
  position: relative;
  grid-column: 1 / -1;
  height: 3px;
  background: var(--ea-fill-soft, rgb(255 255 255 / 8%));
}

.gauge__fill {
  display: block;
  height: 100%;
  background: #d9363e;
  transition: width 80ms linear;
}

.gauge--poise .gauge__fill {
  background: #d46b08;
}

.gauge__knot {
  position: absolute;
  z-index: 1;
  top: 50%;
  width: 2px;
  height: 7px;
  box-sizing: border-box;
  border: 1px solid #f5c89a;
  background: #4c362b;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 45%);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
