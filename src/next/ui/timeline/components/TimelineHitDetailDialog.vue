<script setup lang="ts">
/** 结构与视觉以旧版 HitDamageDetailDialog 为规格；UI 只投影回执冻结值。 */
import { computed, ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';
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
    basicTotal: string;
    baseAttack: string;
    operatorAttack: string;
    weaponAttack: string;
    attackBonus: string;
    flatAttack: string;
    percentageAttack: string;
    attributeBonus: string;
    attributeLabel: (attribute: string) => string;
    fromSource: (name: string) => string;
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
  readonly attackValue: string;
  readonly attackDetail: AttackDetail | null;
  readonly contextRows: readonly DetailRow[];
  readonly baseRows: readonly DetailRow[];
  readonly multiplierRows: readonly DetailRow[];
}

interface AttackAttributeContribution {
  readonly key: string;
  readonly value: number;
  readonly contribution: number;
  readonly isMain: boolean;
  readonly isSecondary: boolean;
}

interface AttackDetail {
  readonly basicTotal: number;
  readonly baseAttackTotal: number;
  readonly operatorBaseAttack: number;
  readonly weaponBaseAttack: number;
  readonly attackBonus: number;
  readonly flatAttack: number;
  readonly attackPercent: number;
  readonly attributeContributions: readonly AttackAttributeContribution[];
}

const openAttackDetails = ref<ReadonlySet<number>>(new Set());

function finiteNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function num(value: unknown): string {
  return Math.floor(finiteNumber(value)).toLocaleString();
}

function ceilNum(value: unknown): string {
  return Math.ceil(finiteNumber(value)).toLocaleString();
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

function projectAttackDetail(data: CombatReceiptEntry['data']): AttackDetail | null {
  if (data === undefined || typeof data.attackDetailMainAttribute !== 'string') return null;
  if (typeof data.attackDetailSecondaryAttribute !== 'string') return null;
  const required = [
    data.attackDetailOperatorBase,
    data.attackDetailWeaponBase,
    data.attackDetailAttackPercent,
    data.attackDetailFlatAttack,
    data.attackDetailStrength,
    data.attackDetailAgility,
    data.attackDetailIntellect,
    data.attackDetailWill,
    data.attackDetailStrengthCoefficient,
    data.attackDetailAgilityCoefficient,
    data.attackDetailIntellectCoefficient,
    data.attackDetailWillCoefficient,
  ];
  if (required.some(value => typeof value !== 'number' || !Number.isFinite(value))) return null;
  const operatorBaseAttack = finiteNumber(data.attackDetailOperatorBase);
  const weaponBaseAttack = finiteNumber(data.attackDetailWeaponBase);
  const attackPercent = finiteNumber(data.attackDetailAttackPercent);
  const flatAttack = finiteNumber(data.attackDetailFlatAttack);
  const baseAttackTotal = operatorBaseAttack + weaponBaseAttack;
  const attributes = ['strength', 'agility', 'intellect', 'will'] as const;
  const values = {
    strength: finiteNumber(data.attackDetailStrength),
    agility: finiteNumber(data.attackDetailAgility),
    intellect: finiteNumber(data.attackDetailIntellect),
    will: finiteNumber(data.attackDetailWill),
  };
  const coefficients = {
    strength: finiteNumber(data.attackDetailStrengthCoefficient),
    agility: finiteNumber(data.attackDetailAgilityCoefficient),
    intellect: finiteNumber(data.attackDetailIntellectCoefficient),
    will: finiteNumber(data.attackDetailWillCoefficient),
  };
  const attributeContributions = attributes
    .map(key => ({
      key,
      value: values[key],
      contribution: values[key] * coefficients[key],
      isMain: key === data.attackDetailMainAttribute,
      isSecondary: key === data.attackDetailSecondaryAttribute,
    }))
    .filter(row => coefficients[row.key] !== 0)
    .sort(
      (left, right) =>
        Number(right.isMain) - Number(left.isMain) ||
        Number(right.isSecondary) - Number(left.isSecondary),
    );
  return {
    basicTotal: baseAttackTotal * (1 + attackPercent) + flatAttack,
    baseAttackTotal,
    operatorBaseAttack,
    weaponBaseAttack,
    attackBonus: baseAttackTotal * attackPercent + flatAttack,
    flatAttack,
    attackPercent,
    attributeContributions,
  };
}

function toggleAttackDetail(key: number): void {
  const next = new Set(openAttackDetails.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  openAttackDetails.value = next;
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
        attackValue: num(data.attack),
        attackDetail: projectAttackDetail(entry.data),
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
  openAttackDetails.value = new Set();
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
              class="expandable-row"
              :class="{ 'is-disabled': detail.attackDetail === null }"
              @click="detail.attackDetail === null ? undefined : toggleAttackDetail(detail.key)"
            >
              <td class="label-cell">
                <el-icon
                  v-if="detail.attackDetail !== null"
                  class="expand-icon"
                  :class="{ 'is-open': openAttackDetails.has(detail.key) }"
                >
                  <ArrowRight />
                </el-icon>
                {{ labels.attack }}
              </td>
              <td class="value-cell">{{ detail.attackValue }}</td>
            </tr>
            <template v-if="openAttackDetails.has(detail.key) && detail.attackDetail !== null">
              <tr class="sub-row">
                <td class="label-cell indent-1">{{ labels.basicTotal }}</td>
                <td class="value-cell">{{ ceilNum(detail.attackDetail.basicTotal) }}</td>
              </tr>
              <tr class="sub-row">
                <td class="label-cell indent-2">{{ labels.baseAttack }}</td>
                <td class="value-cell">{{ ceilNum(detail.attackDetail.baseAttackTotal) }}</td>
              </tr>
              <tr class="sub-row dim">
                <td class="label-cell indent-3">{{ labels.operatorAttack }}</td>
                <td class="value-cell">{{ ceilNum(detail.attackDetail.operatorBaseAttack) }}</td>
              </tr>
              <tr class="sub-row dim">
                <td class="label-cell indent-3">{{ labels.weaponAttack }}</td>
                <td class="value-cell">{{ ceilNum(detail.attackDetail.weaponBaseAttack) }}</td>
              </tr>
              <tr class="sub-row">
                <td class="label-cell indent-2">{{ labels.attackBonus }}</td>
                <td class="value-cell">+{{ ceilNum(detail.attackDetail.attackBonus) }}</td>
              </tr>
              <tr class="sub-row dim">
                <td class="label-cell indent-3">{{ labels.flatAttack }}</td>
                <td class="value-cell">+{{ ceilNum(detail.attackDetail.flatAttack) }}</td>
              </tr>
              <tr class="sub-row dim">
                <td class="label-cell indent-3">{{ labels.percentageAttack }}</td>
                <td class="value-cell">{{ pct(detail.attackDetail.attackPercent) }}</td>
              </tr>
              <tr class="sub-row">
                <td class="label-cell indent-1">{{ labels.attributeBonus }}</td>
                <td class="value-cell">
                  +{{
                    (
                      detail.attackDetail.attributeContributions.reduce(
                        (sum, row) => sum + row.contribution,
                        0,
                      ) * 100
                    ).toFixed(1)
                  }}%
                </td>
              </tr>
              <tr
                v-for="row in detail.attackDetail.attributeContributions"
                :key="row.key"
                class="sub-row dim"
                :class="{ 'is-main': row.isMain, 'is-sub': row.isSecondary }"
              >
                <td class="label-cell indent-2">
                  {{ labels.fromSource(labels.attributeLabel(row.key)) }}
                </td>
                <td class="value-cell">+{{ (row.contribution * 100).toFixed(1) }}%</td>
              </tr>
            </template>
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
.indent-1 {
  padding-left: 16px !important;
}
.indent-2 {
  padding-left: 28px !important;
}
.indent-3 {
  padding-left: 40px !important;
}
.expandable-row {
  cursor: pointer;
}
.expandable-row:hover {
  background: var(--ea-hover-fill, rgb(255 255 255 / 5%));
}
.expandable-row.is-disabled {
  cursor: default;
}
.expandable-row.is-disabled:hover {
  background: transparent;
}
.expand-icon {
  margin-right: 4px;
  vertical-align: -2px;
  color: var(--ea-fg-muted, #888);
  font-size: 12px;
  transition:
    transform 0.18s ease,
    color 0.18s ease;
}
.expand-icon.is-open {
  transform: rotate(90deg);
  color: var(--ea-fg-secondary, #bbb);
}
.expandable-row:hover .expand-icon {
  color: var(--ea-fg-secondary, #bbb);
}
.sub-row {
  border-bottom-color: var(--ea-border-soft, rgb(255 255 255 / 3%)) !important;
}
tr.is-main {
  background: color-mix(in srgb, var(--ea-gold, #ffc107) 10%, transparent);
}
tr.is-sub {
  background: var(--ea-fill-soft, rgb(158 158 158 / 8%));
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
