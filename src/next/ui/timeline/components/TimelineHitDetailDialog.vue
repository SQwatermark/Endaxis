<script setup lang="ts">
/**
 * 命中点详情弹窗：只展示一次命中相关的战斗回执事实，不重新计算任何数值。
 */
import { computed } from 'vue';
import type { CombatReceiptEntry } from '../../../core/combat/receipt/combatReceipt';

const props = defineProps<{
  visible: boolean;
  title: string;
  entries: readonly CombatReceiptEntry[];
  labels: {
    frame: string;
    damage: string;
    actualDamage: string;
    remainingHealth: string;
    damageType: string;
    isCritical: string;
    criticalMultiplier: string;
    defenseMultiplier: string;
    resistanceMultiplier: string;
    element: string;
    outcome: string;
    reaction: string;
    reactionConsumed: string;
    level: string;
    close: string;
  };
}>();

const emit = defineEmits<{ close: [] }>();

interface DetailRow {
  readonly label: string;
  readonly value: string;
}

function fmt(value: unknown): string {
  if (typeof value === 'number') return String(Math.round(value * 100) / 100);
  if (value === null) return '—';
  return String(value);
}

const rows = computed<readonly DetailRow[]>(() => {
  const result: DetailRow[] = [];
  for (const entry of props.entries) {
    const data = entry.data ?? {};
    if (entry.event === 'DamageApplied') {
      result.push(
        {
          label: props.labels.frame,
          value: `${entry.frame}f / ${Math.round(entry.time * 100) / 100}s`,
        },
        { label: props.labels.damage, value: fmt(data.value) },
        { label: props.labels.actualDamage, value: fmt(data.actualDamage) },
        { label: props.labels.remainingHealth, value: fmt(data.remainingHealth) },
        { label: props.labels.damageType, value: fmt(data.damageType) },
        { label: props.labels.isCritical, value: data.isCritical === true ? '✓' : '—' },
        { label: props.labels.criticalMultiplier, value: fmt(data.criticalMultiplier) },
        { label: props.labels.defenseMultiplier, value: fmt(data.defenseMultiplier) },
        { label: props.labels.resistanceMultiplier, value: fmt(data.resistanceMultiplier) },
      );
      continue;
    }
    if (entry.event === 'ElementalInflictionApplied') {
      result.push(
        {
          label: props.labels.frame,
          value: `${entry.frame}f / ${Math.round(entry.time * 100) / 100}s`,
        },
        { label: props.labels.element, value: fmt(data.requestedElement) },
        { label: props.labels.outcome, value: fmt(data.outcomeKind) },
        { label: props.labels.level, value: fmt(data.currentLayers) },
      );
      continue;
    }
    if (entry.event === 'ElementalReactionApplied') {
      result.push(
        {
          label: props.labels.frame,
          value: `${entry.frame}f / ${Math.round(entry.time * 100) / 100}s`,
        },
        { label: props.labels.reaction, value: fmt(data.reaction) },
        { label: props.labels.level, value: fmt(data.level) },
      );
      continue;
    }
    if (entry.event === 'ElementalReactionConsumed') {
      result.push(
        {
          label: props.labels.frame,
          value: `${entry.frame}f / ${Math.round(entry.time * 100) / 100}s`,
        },
        { label: props.labels.reactionConsumed, value: fmt(data.reaction) },
        { label: props.labels.level, value: fmt(data.level) },
      );
    }
  }
  return result;
});
</script>

<template>
  <div v-if="visible" class="hit-detail-overlay" @click.self="emit('close')">
    <section class="hit-detail-dialog">
      <header class="hit-detail-header">
        <span class="hit-detail-title">{{ title }}</span>
        <button type="button" class="hit-detail-close" @click="emit('close')">
          {{ labels.close }}
        </button>
      </header>
      <div class="hit-detail-body">
        <div v-if="rows.length === 0" class="hit-detail-empty">—</div>
        <div v-else v-for="row in rows" :key="`${row.label}:${row.value}`" class="hit-detail-row">
          <span class="hit-detail-label">{{ row.label }}</span>
          <span class="hit-detail-value">{{ row.value }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hit-detail-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 45%);
}

.hit-detail-dialog {
  width: 340px;
  max-height: 70vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--ea-border);
  background: var(--ea-workbench-panel, #1b1d21);
  color: var(--ea-fg);
  box-shadow: 0 8px 30px var(--ea-shadow);
  font: 13px/1.5 var(--ea-font-family, 'Segoe UI', sans-serif);
}

.hit-detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--ea-border-soft);
}

.hit-detail-title {
  overflow: hidden;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hit-detail-close {
  border: 1px solid var(--ea-border);
  border-radius: 2px;
  background: var(--ea-fill-soft);
  color: inherit;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.hit-detail-body {
  min-height: 0;
  overflow-y: auto;
  padding: 8px 12px 12px;
}

.hit-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  border-bottom: 1px solid var(--ea-border-soft);
  font-family: Consolas, monospace;
  font-size: 11px;
}

.hit-detail-row:last-child {
  border-bottom: 0;
}

.hit-detail-label {
  color: var(--ea-fg-muted);
}

.hit-detail-value {
  color: var(--ea-fg);
  text-align: right;
  word-break: break-all;
}

.hit-detail-empty {
  padding: 18px 0;
  color: var(--ea-fg-muted);
  text-align: center;
}
</style>
