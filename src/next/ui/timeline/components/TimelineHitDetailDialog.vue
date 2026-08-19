<script setup lang="ts">
/** 命中详情沿用旧版分节，但只展示统一回执已经证明的事实。 */
import { computed, onMounted, onUnmounted } from 'vue';
import type { CombatReceiptEntry } from '../../../core/combat/receipt/combatReceipt';

const props = defineProps<{
  visible: boolean;
  title: string;
  entries: readonly CombatReceiptEntry[];
  damageTypeLabel: (value: string) => string;
  reactionLabel: (value: string) => string;
  outcomeLabel: (value: string) => string;
  labels: {
    dialogTitle: string;
    context: string;
    result: string;
    multipliers: string;
    effects: string;
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

interface DamageDetail {
  readonly key: number;
  readonly headline: string;
  readonly critical: boolean;
  readonly contextRows: readonly DetailRow[];
  readonly resultRows: readonly DetailRow[];
  readonly multiplierRows: readonly DetailRow[];
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function fmt(value: unknown): string {
  const number = finiteNumber(value);
  if (number !== null) {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(number);
  }
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
}

function multiplier(value: unknown): string | null {
  const number = finiteNumber(value);
  return number === null ? null : `x${number.toFixed(3)}`;
}

function localized(value: unknown, resolve: (value: string) => string): string {
  return typeof value === 'string' && value.length > 0 ? resolve(value) : fmt(value);
}

function frameLabel(entry: CombatReceiptEntry): string {
  return `${entry.frame}f / ${entry.time.toFixed(2)}s`;
}

const damageDetails = computed<readonly DamageDetail[]>(() =>
  props.entries.flatMap(entry => {
    if (entry.event !== 'DamageApplied') return [];
    const data = entry.data ?? {};
    const criticalMultiplier = multiplier(data.criticalMultiplier);
    const defenseMultiplier = multiplier(data.defenseMultiplier);
    const resistanceMultiplier = multiplier(data.resistanceMultiplier);
    return [
      {
        key: entry.sequence,
        headline: fmt(data.value),
        critical: data.isCritical === true,
        contextRows: [
          { label: props.labels.frame, value: frameLabel(entry) },
          {
            label: props.labels.damageType,
            value: localized(data.damageType, props.damageTypeLabel),
          },
        ],
        resultRows: [
          { label: props.labels.actualDamage, value: fmt(data.actualDamage) },
          { label: props.labels.remainingHealth, value: fmt(data.remainingHealth) },
          { label: props.labels.isCritical, value: data.isCritical === true ? '✓' : '—' },
        ],
        multiplierRows: [
          ...(criticalMultiplier === null || criticalMultiplier === 'x1.000'
            ? []
            : [{ label: props.labels.criticalMultiplier, value: criticalMultiplier }]),
          ...(defenseMultiplier === null
            ? []
            : [{ label: props.labels.defenseMultiplier, value: defenseMultiplier }]),
          ...(resistanceMultiplier === null || resistanceMultiplier === 'x1.000'
            ? []
            : [{ label: props.labels.resistanceMultiplier, value: resistanceMultiplier }]),
        ],
      },
    ];
  }),
);

const effectRows = computed<readonly DetailRow[]>(() =>
  props.entries.flatMap(entry => {
    const data = entry.data ?? {};
    if (entry.event === 'ElementalInflictionApplied') {
      return [
        {
          label: `${props.labels.element} · ${frameLabel(entry)}`,
          value: [
            localized(data.requestedElement, props.damageTypeLabel),
            localized(data.outcomeKind, props.outcomeLabel),
            `Lv${fmt(data.currentLayers)}`,
          ]
            .filter(value => value !== '—')
            .join(' · '),
        },
      ];
    }
    if (entry.event === 'ElementalReactionApplied') {
      return [
        {
          label: `${props.labels.reaction} · ${frameLabel(entry)}`,
          value: `${localized(data.reaction, props.reactionLabel)} · Lv${fmt(data.level)}`,
        },
      ];
    }
    if (entry.event === 'ElementalReactionConsumed') {
      return [
        {
          label: `${props.labels.reactionConsumed} · ${frameLabel(entry)}`,
          value: `${localized(data.reaction, props.reactionLabel)} · Lv${fmt(data.level)}`,
        },
      ];
    }
    return [];
  }),
);

function handleDocumentKeydown(event: KeyboardEvent): void {
  if (!props.visible || event.key !== 'Escape') return;
  event.preventDefault();
  emit('close');
}

onMounted(() => document.addEventListener('keydown', handleDocumentKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleDocumentKeydown));
</script>

<template>
  <div v-if="visible" class="hit-detail-overlay" @click.self="emit('close')">
    <section
      class="hit-detail-dialog"
      role="dialog"
      aria-modal="true"
      :aria-label="labels.dialogTitle"
    >
      <header class="hit-detail-header">
        <div class="hit-detail-heading">
          <strong>{{ labels.dialogTitle }}</strong>
          <span :title="title">{{ title }}</span>
        </div>
        <button
          type="button"
          class="hit-detail-close"
          :aria-label="labels.close"
          :title="labels.close"
          @click="emit('close')"
        >
          ×
        </button>
      </header>

      <div class="hit-detail-body">
        <template v-for="(detail, index) in damageDetails" :key="detail.key">
          <div v-if="damageDetails.length > 1" class="hit-sequence">#{{ index + 1 }}</div>
          <div class="section-label">{{ labels.context }}</div>
          <table class="stat-table">
            <tbody>
              <tr v-for="row in detail.contextRows" :key="row.label">
                <td class="label-cell">{{ row.label }}</td>
                <td class="value-cell">{{ row.value }}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-label">{{ labels.result }}</div>
          <div class="damage-result">
            <div class="headline-damage">
              <span class="damage-label">{{ labels.damage }}</span
              ><span class="damage-value" :class="{ critical: detail.critical }">{{
                detail.headline
              }}</span>
            </div>
            <table class="stat-table">
              <tbody>
                <tr v-for="row in detail.resultRows" :key="row.label" class="dim">
                  <td class="label-cell">{{ row.label }}</td>
                  <td class="value-cell">{{ row.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <template v-if="detail.multiplierRows.length > 0">
            <div class="section-label">{{ labels.multipliers }}</div>
            <table class="stat-table">
              <tbody>
                <tr v-for="row in detail.multiplierRows" :key="row.label">
                  <td class="label-cell">{{ row.label }}</td>
                  <td class="value-cell multiplier-value">{{ row.value }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </template>

        <template v-if="effectRows.length > 0">
          <div class="section-label">{{ labels.effects }}</div>
          <table class="stat-table">
            <tbody>
              <tr v-for="row in effectRows" :key="`${row.label}:${row.value}`">
                <td class="label-cell">{{ row.label }}</td>
                <td class="value-cell">{{ row.value }}</td>
              </tr>
            </tbody>
          </table>
        </template>
        <div v-if="damageDetails.length === 0 && effectRows.length === 0" class="hit-detail-empty">
          —
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
  width: 420px;
  max-width: calc(100vw - 32px);
  max-height: 78vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--ea-border);
  border-radius: 3px;
  background: var(--ea-workbench-panel, #1b1d21);
  color: var(--ea-fg);
  box-shadow: 0 12px 38px var(--ea-shadow);
  font: 13px/1.5 var(--ea-font-family, 'Segoe UI', sans-serif);
}
.hit-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 11px;
  border-bottom: 1px solid var(--ea-border-soft);
}
.hit-detail-heading {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hit-detail-heading strong {
  font-size: 16px;
  line-height: 22px;
}
.hit-detail-heading span {
  overflow: hidden;
  color: var(--ea-fg-muted);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hit-detail-close {
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ea-fg-muted);
  font:
    20px/22px Arial,
    sans-serif;
  cursor: pointer;
}
.hit-detail-close:hover {
  color: var(--ea-fg);
}
.hit-detail-body {
  min-height: 0;
  overflow-y: auto;
  padding: 4px 16px 16px;
}
.hit-sequence {
  margin-top: 10px;
  color: var(--ea-gold);
  font:
    700 11px/1 Consolas,
    monospace;
}
.section-label {
  margin: 12px 0 6px;
  color: var(--ea-fg-muted, #aaa);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.stat-table {
  width: 100%;
  border-collapse: collapse;
}
.stat-table tr {
  border-bottom: 1px solid var(--ea-border-soft, rgb(255 255 255 / 6%));
}
.stat-table tr:last-child {
  border-bottom: 0;
}
.stat-table td {
  padding: 5px 4px;
}
.label-cell {
  color: var(--ea-fg-secondary, #ddd);
}
.value-cell {
  color: var(--ea-fg, #eee);
  font-family: Consolas, monospace;
  text-align: right;
  white-space: nowrap;
}
.dim {
  opacity: 0.72;
  font-size: 12px;
}
.damage-result {
  margin-bottom: 4px;
}
.headline-damage {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 6px 4px;
  border-bottom: 1px solid var(--ea-border-soft, rgb(255 255 255 / 6%));
}
.damage-label {
  color: var(--ea-fg-secondary, #ddd);
  font-weight: 600;
}
.damage-value {
  color: #e25555;
  font-family: Consolas, monospace;
  font-size: 20px;
  font-weight: 700;
}
.damage-value.critical {
  color: var(--ea-gold, #ffd166);
  text-shadow: 0 0 8px rgb(255 209 102 / 35%);
}
.multiplier-value {
  color: #3b82c4;
}
:global(html[data-theme='dark']) .multiplier-value {
  color: #b8d4ff;
}
.hit-detail-empty {
  padding: 24px 0 18px;
  color: var(--ea-fg-muted);
  text-align: center;
}
</style>
