<script setup lang="ts">
import { computed } from 'vue';
import type { TimelineDamageAnalysis } from '../timelineDamageAnalysis';

const props = defineProps<{
  visible: boolean;
  analysis: TimelineDamageAnalysis;
  locale: string;
  labels: {
    title: string;
    warning: string;
    noData: string;
    damageByOperator: string;
    contributionByOperator: string;
    damageByElement: string;
    totalDamage: string;
    rotationTime: string;
    dps: string;
    unattributedDamage: (value: string) => string;
    contributionUnavailable: string;
  };
}>();

defineEmits<{ 'update:visible': [visible: boolean] }>();

const hasData = computed(() => props.analysis.totalDamage > 0);
const numberFormatter = computed(
  () => new Intl.NumberFormat(props.locale, { maximumFractionDigits: 0 }),
);

function formatNumber(value: number): string {
  return numberFormatter.value.format(Math.round(value));
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    width="min(1180px, 92vw)"
    top="5vh"
    append-to-body
    destroy-on-close
    class="next-damage-analysis-dialog"
    @update:model-value="$emit('update:visible', $event)"
  >
    <template #header>
      <strong class="analysis-title">{{ labels.title }}</strong>
    </template>

    <div class="analysis-warning">{{ labels.warning }}</div>
    <div v-if="!hasData" class="analysis-empty">{{ labels.noData }}</div>
    <template v-else>
      <div class="analysis-cards">
        <section class="analysis-card">
          <h3>{{ labels.damageByOperator }}</h3>
          <div class="bar-list">
            <div v-for="entry in analysis.byOperator" :key="entry.key" class="bar-row">
              <span :title="entry.label">{{ entry.label }}</span>
              <div><i :style="{ width: `${entry.ratio * 100}%` }"></i></div>
              <b>{{ formatNumber(entry.value) }}</b>
            </div>
            <div v-if="analysis.unattributedDamage > 0" class="analysis-note">
              {{ labels.unattributedDamage(formatNumber(analysis.unattributedDamage)) }}
            </div>
          </div>
        </section>

        <section class="analysis-card analysis-card--muted">
          <h3>{{ labels.contributionByOperator }}</h3>
          <p>{{ labels.contributionUnavailable }}</p>
        </section>

        <section class="analysis-card">
          <h3>{{ labels.damageByElement }}</h3>
          <div class="bar-list">
            <div v-for="entry in analysis.byDamageType" :key="entry.key" class="bar-row">
              <span :title="entry.label">{{ entry.label }}</span>
              <div><i :style="{ width: `${entry.ratio * 100}%` }"></i></div>
              <b>{{ formatNumber(entry.value) }}</b>
            </div>
          </div>
        </section>
      </div>

      <div class="analysis-summary">
        <div>
          <span>{{ labels.totalDamage }}</span
          ><strong>{{ formatNumber(analysis.totalDamage) }}</strong>
        </div>
        <div>
          <span>{{ labels.rotationTime }}</span
          ><strong>{{ analysis.rotationSeconds.toFixed(2) }}s</strong>
        </div>
        <div>
          <span>{{ labels.dps }}</span
          ><strong>{{ formatNumber(analysis.dps) }}</strong>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.analysis-title {
  color: var(--ea-dialog-title);
  font-size: 16px;
}

.analysis-warning {
  margin-bottom: 16px;
  padding: 10px 12px;
  border: 1px solid rgb(230 162 60 / 45%);
  background: rgb(230 162 60 / 9%);
  color: #e6a23c;
  font-size: 12px;
}

.analysis-empty {
  min-height: 260px;
  display: grid;
  place-items: center;
  color: var(--ea-fg-muted);
}

.analysis-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.analysis-card {
  min-width: 0;
  min-height: 260px;
  padding: 14px;
  border: 1px solid var(--ea-border-soft);
  background: var(--ea-fill-soft);
}

.analysis-card h3 {
  margin: 0 0 16px;
  color: var(--ea-fg);
  font-size: 13px;
}

.analysis-card--muted {
  display: flex;
  flex-direction: column;
}

.analysis-card--muted p,
.analysis-note {
  color: var(--ea-fg-muted);
  font-size: 12px;
  line-height: 1.7;
}

.bar-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bar-row {
  display: grid;
  grid-template-columns: minmax(64px, 0.7fr) minmax(70px, 1fr) auto;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.bar-row > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bar-row > div {
  height: 7px;
  overflow: hidden;
  background: var(--ea-border-soft);
}

.bar-row i {
  display: block;
  height: 100%;
  background: var(--ea-gold);
}

.bar-row b {
  font-variant-numeric: tabular-nums;
}

.analysis-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 14px;
  border: 1px solid var(--ea-border-soft);
}

.analysis-summary > div {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px;
  border-right: 1px solid var(--ea-border-soft);
}

.analysis-summary > div:last-child {
  border-right: 0;
}

.analysis-summary span {
  color: var(--ea-fg-muted);
  font-size: 11px;
}

.analysis-summary strong {
  color: var(--ea-gold);
  font-size: 20px;
}

@media (max-width: 900px) {
  .analysis-cards {
    grid-template-columns: 1fr;
  }
  .analysis-card {
    min-height: 0;
  }
}
</style>
