<script setup lang="ts">
import { computed } from 'vue';
import type { ScenarioSimulationPerformanceSample } from '../../../application/scenarioSimulationService';
import { summarizeSimulationPerformance } from '../simulationPerformanceAudit';

interface AuditLabels {
  readonly title: string;
  readonly latest: string;
  readonly p95: string;
  readonly cacheHit: string;
  readonly cacheLookup: string;
  readonly simulation: string;
  readonly projection: string;
  readonly budget: string;
  readonly noSamples: string;
}

const props = defineProps<{
  samples: readonly ScenarioSimulationPerformanceSample[];
  budgetMs: number;
  labels: AuditLabels;
}>();

const CHART_WIDTH = 360;
const CHART_HEIGHT = 42;
const MAX_VISIBLE_SAMPLES = 30;
const recentSamples = computed(() => props.samples.slice(-MAX_VISIBLE_SAMPLES));
const summary = computed(() => summarizeSimulationPerformance(props.samples, props.budgetMs));
const chartMaximum = computed(() =>
  Math.max(props.budgetMs, ...recentSamples.value.map(sample => sample.totalMs), 1),
);
const budgetY = computed(() => CHART_HEIGHT - (props.budgetMs / chartMaximum.value) * CHART_HEIGHT);
const barWidth = computed(() => CHART_WIDTH / MAX_VISIBLE_SAMPLES - 2);

function barX(index: number): number {
  return (
    (MAX_VISIBLE_SAMPLES - recentSamples.value.length + index) *
      (CHART_WIDTH / MAX_VISIBLE_SAMPLES) +
    1
  );
}

function phaseHeight(durationMs: number): number {
  return Math.max(0, (durationMs / chartMaximum.value) * CHART_HEIGHT);
}

function phaseY(
  sample: ScenarioSimulationPerformanceSample,
  phase: 'lookup' | 'simulation' | 'projection',
): number {
  const phases = [sample.cacheLookupMs, sample.simulationMs, sample.projectionMs];
  const phaseIndex = phase === 'lookup' ? 0 : phase === 'simulation' ? 1 : 2;
  return (
    CHART_HEIGHT -
    phaseHeight(phases.slice(0, phaseIndex + 1).reduce((sum, value) => sum + value, 0))
  );
}

function formatMs(value: number | null): string {
  if (value === null) return '—';
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ms`;
}

function formatPercent(value: number | null): string {
  return value === null ? '—' : `${Math.round(value * 100)}%`;
}
</script>

<template>
  <section class="performance-audit" :aria-label="labels.title">
    <header class="performance-audit__header">
      <div class="performance-audit__title">
        {{ labels.title }}
        <span class="performance-audit__count">{{ summary.sampleCount }}</span>
      </div>
      <dl class="performance-audit__metrics">
        <div>
          <dt>{{ labels.latest }}</dt>
          <dd>{{ formatMs(summary.latestMs) }}</dd>
        </div>
        <div>
          <dt>{{ labels.p95 }}</dt>
          <dd :class="{ 'is-over-budget': (summary.p95Ms ?? 0) > budgetMs }">
            {{ formatMs(summary.p95Ms) }}
          </dd>
        </div>
        <div>
          <dt>{{ labels.cacheHit }}</dt>
          <dd>{{ formatPercent(summary.cacheHitRate) }}</dd>
        </div>
      </dl>
    </header>

    <div v-if="recentSamples.length > 0" class="performance-audit__chart-wrap">
      <svg
        class="performance-audit__chart"
        :viewBox="`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`"
        preserveAspectRatio="none"
        role="img"
        :aria-label="`${labels.title}: ${labels.p95} ${formatMs(summary.p95Ms)}`"
      >
        <line
          class="performance-audit__budget-line"
          x1="0"
          :y1="budgetY"
          :x2="CHART_WIDTH"
          :y2="budgetY"
        />
        <g v-for="(sample, index) in recentSamples" :key="index">
          <title>
            {{
              `${formatMs(sample.totalMs)} · ${labels.cacheLookup} ${formatMs(sample.cacheLookupMs)} · ${labels.simulation} ${formatMs(sample.simulationMs)} · ${labels.projection} ${formatMs(sample.projectionMs)}`
            }}
          </title>
          <rect
            class="performance-audit__bar performance-audit__bar--lookup"
            :class="{ 'is-cache-hit': sample.cacheHit }"
            :x="barX(index)"
            :y="phaseY(sample, 'lookup')"
            :width="barWidth"
            :height="Math.max(phaseHeight(sample.cacheLookupMs), 0.7)"
          />
          <rect
            class="performance-audit__bar performance-audit__bar--simulation"
            :x="barX(index)"
            :y="phaseY(sample, 'simulation')"
            :width="barWidth"
            :height="phaseHeight(sample.simulationMs)"
          />
          <rect
            class="performance-audit__bar performance-audit__bar--projection"
            :x="barX(index)"
            :y="phaseY(sample, 'projection')"
            :width="barWidth"
            :height="phaseHeight(sample.projectionMs)"
          />
          <rect
            v-if="sample.outcome !== 'completed'"
            class="performance-audit__bar-error"
            :x="barX(index)"
            :y="Math.max(0, CHART_HEIGHT - phaseHeight(sample.totalMs))"
            :width="barWidth"
            :height="Math.max(phaseHeight(sample.totalMs), 2)"
          />
        </g>
      </svg>
      <span
        class="performance-audit__budget-label"
        :style="{ bottom: `${(budgetMs / chartMaximum) * 100}%` }"
      >
        {{ labels.budget }} {{ budgetMs }}ms
      </span>
    </div>
    <div v-else class="performance-audit__empty">{{ labels.noSamples }}</div>

    <div class="performance-audit__legend" aria-hidden="true">
      <span><i class="legend-dot legend-dot--lookup"></i>{{ labels.cacheLookup }}</span>
      <span><i class="legend-dot legend-dot--simulation"></i>{{ labels.simulation }}</span>
      <span><i class="legend-dot legend-dot--projection"></i>{{ labels.projection }}</span>
    </div>
  </section>
</template>

<style scoped>
.performance-audit {
  padding: 7px 10px 6px;
  border-bottom: 1px solid var(--ea-border-soft);
  background: color-mix(in srgb, var(--ea-fill-soft) 35%, transparent);
  font-size: 10px;
}

.performance-audit__header {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 25px;
}

.performance-audit__title {
  flex: 1;
  min-width: 90px;
  color: var(--ea-fg);
  font-size: 11px;
  font-weight: 700;
}

.performance-audit__count {
  margin-left: 4px;
  color: var(--ea-fg-muted);
  font-variant-numeric: tabular-nums;
  font-weight: 400;
}

.performance-audit__metrics {
  display: flex;
  gap: 16px;
  margin: 0;
}

.performance-audit__metrics > div {
  display: grid;
  grid-template-columns: auto auto;
  gap: 5px;
}

.performance-audit__metrics dt {
  color: var(--ea-fg-muted);
}

.performance-audit__metrics dd {
  min-width: 38px;
  margin: 0;
  color: var(--ea-fg);
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}

.performance-audit__metrics dd.is-over-budget {
  color: #ff7875;
}

.performance-audit__chart-wrap {
  position: relative;
  height: 42px;
  margin-top: 4px;
}

.performance-audit__chart {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.performance-audit__budget-line {
  stroke: #ff7875;
  stroke-width: 1;
  stroke-dasharray: 3 3;
  vector-effect: non-scaling-stroke;
  opacity: 0.72;
}

.performance-audit__bar--lookup {
  fill: #8c8c8c;
}

.performance-audit__bar--lookup.is-cache-hit {
  fill: #73d13d;
}

.performance-audit__bar--simulation {
  fill: #36cfc9;
}

.performance-audit__bar--projection {
  fill: #ffc53d;
}

.performance-audit__bar-error {
  fill: none;
  stroke: #ff4d4f;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.performance-audit__budget-label {
  position: absolute;
  right: 2px;
  padding-left: 4px;
  transform: translateY(50%);
  background: var(--ea-bg);
  color: #ff7875;
  line-height: 12px;
}

.performance-audit__empty {
  display: grid;
  height: 36px;
  place-items: center;
  color: var(--ea-fg-muted);
}

.performance-audit__legend {
  display: flex;
  gap: 12px;
  margin-top: 5px;
  color: var(--ea-fg-muted);
}

.performance-audit__legend span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 1px;
}

.legend-dot--lookup {
  background: #8c8c8c;
}

.legend-dot--simulation {
  background: #36cfc9;
}

.legend-dot--projection {
  background: #ffc53d;
}
</style>
