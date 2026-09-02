<script setup lang="ts">
import { computed } from 'vue';
import type { BuffDetailTarget } from '../buffDetail';

const props = defineProps<{
  visible: boolean;
  target: BuffDetailTarget | null;
  fps: number;
  labels: {
    title: string;
    source: string;
    effect: string;
    layers: string;
    start: string;
    end: string;
    duration: string;
    frames: (value: number) => string;
    buffId: string;
  };
}>();

const emit = defineEmits<{
  'update:visible': [visible: boolean];
}>();

const durationFrames = computed(() =>
  props.target === null ? 0 : Math.max(0, props.target.endFrame - props.target.startFrame),
);

function seconds(frames: number): string {
  if (!Number.isFinite(props.fps) || props.fps <= 0) return '—';
  return `${(frames / props.fps).toFixed(2).replace(/\.00$/, '')}s`;
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="labels.title"
    width="440px"
    class="timeline-buff-detail-dialog"
    :close-on-click-modal="true"
    @update:model-value="emit('update:visible', $event)"
  >
    <template v-if="target !== null">
      <header class="buff-detail__header">
        <span class="buff-detail__icon">
          <img v-if="target.icon" :src="target.icon" alt="" />
          <span v-else>+</span>
          <span v-if="target.layers > 1" class="buff-detail__count">{{ target.layers }}</span>
        </span>
        <strong>{{ target.title }}</strong>
      </header>

      <dl class="buff-detail__facts">
        <template v-if="target.sourceName">
          <dt>{{ labels.source }}</dt>
          <dd>{{ target.sourceName }}</dd>
        </template>
        <template v-if="target.modifierSummary">
          <dt>{{ labels.effect }}</dt>
          <dd>{{ target.modifierSummary }}</dd>
        </template>
        <dt>{{ labels.layers }}</dt>
        <dd>{{ target.layers }}</dd>
        <dt>{{ labels.start }}</dt>
        <dd>{{ seconds(target.startFrame) }} · {{ labels.frames(target.startFrame) }}</dd>
        <dt>{{ labels.end }}</dt>
        <dd>{{ seconds(target.endFrame) }} · {{ labels.frames(target.endFrame) }}</dd>
        <dt>{{ labels.duration }}</dt>
        <dd>{{ seconds(durationFrames) }} · {{ labels.frames(durationFrames) }}</dd>
        <dt>{{ labels.buffId }}</dt>
        <dd>
          <code>{{ target.buffId }}</code>
        </dd>
      </dl>
    </template>
  </el-dialog>
</template>

<style scoped>
.buff-detail__header {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  margin-bottom: 18px;
  font-size: 16px;
}

.buff-detail__icon {
  position: relative;
  display: grid;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  place-items: center;
  box-sizing: border-box;
  border: 1px solid var(--ea-keycap-skill-border, #999);
  border-radius: 3px;
  background: var(--ea-keycap-skill-bg, #333);
  color: #eef6ff;
  font-weight: 700;
}

.buff-detail__icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.buff-detail__count {
  position: absolute;
  right: -4px;
  bottom: -4px;
  min-width: 13px;
  padding: 0 3px;
  border-radius: 2px;
  background: rgb(19 20 22 / 94%);
  color: var(--ea-gold);
  font:
    700 10px/13px 'Roboto Mono',
    Consolas,
    monospace;
  text-align: center;
}

.buff-detail__facts {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 10px 14px;
  margin: 0;
  padding: 14px;
  border: 1px solid var(--ea-border);
  background: var(--ea-fill-soft);
}

.buff-detail__facts dt {
  color: var(--ea-text-muted, #999);
}

.buff-detail__facts dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
}

.buff-detail__facts code {
  color: var(--ea-gold);
  font-size: 12px;
}
</style>
