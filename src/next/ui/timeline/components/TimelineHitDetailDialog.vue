<script setup lang="ts">
/** 结构与视觉以旧版 HitDamageDetailDialog 为规格；UI 只投影回执冻结值。 */
import { computed } from 'vue';
import type { CombatReceiptEntry } from '../../../core/combat/receipt/combatReceipt';

const props = defineProps<{
  visible: boolean;
  forceCritical: boolean;
  entries: readonly CombatReceiptEntry[];
  damageTypeLabel: (value: string) => string;
  skillTypeLabel: (value: string) => string;
  labels: {
    dialogTitle: string;
    context: string;
    result: string;
    base: string;
    multipliers: string;
    skillType: string;
    element: string;
    expectedDamage: string;
    forcedDamage: string;
    forceCrit: string;
    criticalDamage: string;
    nonCriticalDamage: string;
    attack: string;
    skillMultiplier: string;
    baseDamage: string;
    damageBonus: string;
    criticalExpectation: string;
    directMultiplier: string;
    damageTaken: string;
    defenseMultiplier: string;
    resistanceMultiplier: string;
    defenseDetail: (value: number) => string;
  };
}>();

const emit = defineEmits<{ close: []; toggleForceCritical: [forced: boolean] }>();

interface DetailRow {
  readonly label: string;
  readonly detail?: string;
  readonly value: string;
}

interface DamageDetail {
  readonly key: number;
  readonly headline: number;
  readonly criticalDamage: number;
  readonly nonCriticalDamage: number;
  readonly canForceCritical: boolean;
  readonly contextRows: readonly DetailRow[];
  readonly baseRows: readonly DetailRow[];
  readonly multiplierRows: readonly DetailRow[];
}

function finiteNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function num(value: unknown): string {
  return Math.floor(finiteNumber(value)).toLocaleString();
}

function pct(value: unknown): string {
  return `${(finiteNumber(value) * 100).toFixed(1)}%`;
}

function mult(value: unknown): string {
  return `x${finiteNumber(value).toFixed(3)}`;
}

function differsFromOne(value: number): boolean {
  return Math.abs(value - 1) > 0.000_001;
}

const damageDetails = computed<readonly DamageDetail[]>(() =>
  props.entries.flatMap(entry => {
    if (entry.event !== 'DamageApplied') return [];
    const data = entry.data ?? {};
    const actualValue = finiteNumber(data.value);
    const expectedDamage = finiteNumber(data.expectedDamage, actualValue);
    const nonCriticalDamage = finiteNumber(data.nonCriticalDamage, actualValue);
    const criticalDamage = finiteNumber(data.criticalDamage, actualValue);
    const skillType = typeof data.skillType === 'string' ? data.skillType : null;
    const damageType = typeof data.damageType === 'string' ? data.damageType : null;
    const standardCalculation = data.standardCalculation === true;
    const damageScaleMultiplier = finiteNumber(data.damageScaleMultiplier, 1);
    const criticalRate = finiteNumber(data.criticalRate);
    const criticalDamageIncrease = finiteNumber(data.criticalDamageIncrease);
    const criticalExpectation = 1 + Math.min(Math.max(criticalRate, 0), 1) * criticalDamageIncrease;
    const directMultiplier =
      finiteNumber(data.calculationMultiplier, 1) *
      finiteNumber(data.weaknessDamageMultiplier, 1) *
      (1 - finiteNumber(data.shelterDamageMultiplier)) *
      finiteNumber(data.runtimeExtensionMultiplier, 1) *
      finiteNumber(data.igniteMultiplier, 1) *
      finiteNumber(data.physicalInflictionMultiplier, 1);
    const damageTakenMultiplier = finiteNumber(data.damageTakenMultiplier, 1);
    const resistanceMultiplier =
      damageType === 'true' ? 1 : Math.max(0, 1 - finiteNumber(data.enemyResistancePercent) / 100);
    const contextRows: DetailRow[] = [];
    if (skillType !== null) {
      contextRows.push({ label: props.labels.skillType, value: props.skillTypeLabel(skillType) });
    }
    if (damageType !== null) {
      contextRows.push({ label: props.labels.element, value: props.damageTypeLabel(damageType) });
    }
    const baseRows: DetailRow[] = [
      { label: props.labels.attack, value: num(data.attack) },
      ...(standardCalculation
        ? [
            {
              label: props.labels.skillMultiplier,
              value: `${finiteNumber(data.skillMultiplierPercent).toFixed(1)}%`,
            },
          ]
        : []),
      { label: props.labels.baseDamage, value: num(data.baseDamage) },
    ];
    const multiplierRows: DetailRow[] = [];
    if (differsFromOne(damageScaleMultiplier)) {
      multiplierRows.push({
        label: props.labels.damageBonus,
        detail: damageScaleMultiplier >= 1 ? `+${pct(damageScaleMultiplier - 1)}` : undefined,
        value: mult(damageScaleMultiplier),
      });
    }
    if (differsFromOne(criticalExpectation)) {
      multiplierRows.push({
        label: props.labels.criticalExpectation,
        detail: `${pct(criticalRate)} x ${pct(criticalDamageIncrease)}`,
        value: mult(criticalExpectation),
      });
    }
    if (differsFromOne(directMultiplier)) {
      multiplierRows.push({
        label: props.labels.directMultiplier,
        value: mult(directMultiplier),
      });
    }
    if (differsFromOne(damageTakenMultiplier)) {
      multiplierRows.push({
        label: props.labels.damageTaken,
        detail: damageTakenMultiplier >= 1 ? `+${pct(damageTakenMultiplier - 1)}` : undefined,
        value: mult(damageTakenMultiplier),
      });
    }
    multiplierRows.push({
      label: props.labels.defenseMultiplier,
      detail: props.labels.defenseDetail(Math.floor(finiteNumber(data.enemyDefense))),
      value: mult(data.defenseMultiplier),
    });
    if (differsFromOne(resistanceMultiplier)) {
      multiplierRows.push({
        label: props.labels.resistanceMultiplier,
        detail: pct(finiteNumber(data.enemyResistancePercent) / 100),
        value: mult(resistanceMultiplier),
      });
    }
    return [
      {
        key: entry.sequence,
        headline: expectedDamage,
        criticalDamage,
        nonCriticalDamage,
        canForceCritical: Math.abs(criticalDamage - nonCriticalDamage) > 0.000_001,
        contextRows,
        baseRows,
        multiplierRows,
      },
    ];
  }),
);

const canForceCritical = computed(() =>
  damageDetails.value.some(detail => detail.canForceCritical),
);

function onClose(): void {
  emit('close');
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="labels.dialogTitle"
    width="420px"
    class="hit-damage-detail-dialog"
    :close-on-click-modal="true"
    append-to-body
    @update:model-value="onClose"
  >
    <div v-if="damageDetails.length > 0" class="hit-detail-content">
      <template v-for="detail in damageDetails" :key="detail.key">
        <template v-if="detail.contextRows.length > 0">
          <div class="section-label">{{ labels.context }}</div>
          <table class="stat-table">
            <tbody>
              <tr v-for="row in detail.contextRows" :key="row.label">
                <td class="label-cell">{{ row.label }}</td>
                <td class="value-cell">{{ row.value }}</td>
              </tr>
            </tbody>
          </table>
        </template>

        <div class="section-label">{{ labels.result }}</div>
        <div class="damage-result">
          <div class="expected-damage">
            <span class="damage-label">{{
              forceCritical ? labels.forcedDamage : labels.expectedDamage
            }}</span>
            <span class="damage-value" :class="{ forced: forceCritical }">{{
              num(forceCritical ? detail.criticalDamage : detail.headline)
            }}</span>
          </div>
          <table class="stat-table">
            <tbody>
              <tr class="dim">
                <td class="label-cell">{{ labels.criticalDamage }}</td>
                <td class="value-cell">{{ num(detail.criticalDamage) }}</td>
              </tr>
              <tr class="dim">
                <td class="label-cell">{{ labels.nonCriticalDamage }}</td>
                <td class="value-cell">{{ num(detail.nonCriticalDamage) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section-label">{{ labels.base }}</div>
        <table class="stat-table">
          <tbody>
            <tr
              v-for="row in detail.baseRows"
              :key="row.label"
              :class="{ bold: row.label === labels.baseDamage }"
            >
              <td class="label-cell">{{ row.label }}</td>
              <td class="value-cell">{{ row.value }}</td>
            </tr>
          </tbody>
        </table>

        <div class="section-label">{{ labels.multipliers }}</div>
        <table class="stat-table">
          <tbody>
            <tr v-for="row in detail.multiplierRows" :key="row.label">
              <td class="label-cell">
                {{ row.label }}<span v-if="row.detail" class="mult-detail">{{ row.detail }}</span>
              </td>
              <td class="value-cell mult-value">{{ row.value }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
    <div v-else class="hit-detail-empty">—</div>

    <template #footer>
      <div class="dialog-footer">
        <label v-if="canForceCritical" class="ea-check-rect ea-check-rect--sm force-crit-check">
          <input
            type="checkbox"
            :checked="forceCritical"
            @change="emit('toggleForceCritical', ($event.target as HTMLInputElement).checked)"
          />
          <span>{{ labels.forceCrit }}</span>
        </label>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.hit-detail-content {
  color: var(--ea-fg, #f0f0f0);
  font-size: 13px;
}
.section-label {
  margin: 12px 0 6px;
  color: var(--ea-fg-muted, #aaa);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.section-label:first-child {
  margin-top: 0;
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
  font-family: monospace;
  text-align: right;
  white-space: nowrap;
}
.bold {
  font-weight: 600;
}
.dim {
  opacity: 0.72;
  font-size: 12px;
}
.damage-result {
  margin-bottom: 4px;
}
.expected-damage {
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
  font-family: monospace;
  font-size: 20px;
  font-weight: 700;
}
.damage-value.forced {
  color: var(--ea-gold);
  text-shadow: none;
}
.mult-detail {
  margin-left: 6px;
  color: var(--ea-fg-muted, #888);
  font-size: 11px;
}
.mult-value {
  color: #3b82c4;
}
.dialog-footer {
  min-height: 22px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.force-crit-check {
  margin-right: auto;
}
.hit-detail-empty {
  padding: 24px 0 18px;
  color: var(--ea-fg-muted);
  text-align: center;
}
</style>

<style>
html[data-theme='dark'] .hit-damage-detail-dialog .damage-value {
  color: #ff6b6b;
}
html[data-theme='dark'] .hit-damage-detail-dialog .damage-value.forced {
  color: #ffd166;
  text-shadow: 0 0 8px rgb(255 209 102 / 35%);
}
html[data-theme='dark'] .hit-damage-detail-dialog .mult-value {
  color: #b8d4ff;
}
</style>
