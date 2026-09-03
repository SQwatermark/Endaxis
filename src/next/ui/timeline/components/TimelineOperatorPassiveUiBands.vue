<script setup lang="ts">
/** 干员专属 UI 的时间轴生命周期：几何与 Buff 条一致，但保留独立语义。 */
import { computed } from 'vue';
import type { PositionedOperatorPassiveUiTimelineSegment } from '../../../core/projection/operatorPassiveUiTimelineViz';
import OperatorPassiveUiWidget from './OperatorPassiveUiWidget.vue';
import TimelineStatusSegment from './TimelineStatusSegment.vue';

const props = defineProps<{
  segments: readonly PositionedOperatorPassiveUiTimelineSegment[];
  prepFrames: number;
  pxPerFrame: number;
  actionTop: number;
}>();

const ICON_SIZE = 18;
const BAR_GAP = 2;
const LANE_PITCH = 22;
const UPPER_OFFSET_FROM_ACTION = 24;

const items = computed(() =>
  props.segments.map(segment => {
    const left = (segment.startFrame + props.prepFrames) * props.pxPerFrame;
    const right = (segment.endFrame + props.prepFrames) * props.pxPerFrame;
    const title =
      segment.kind === 'numeric' || segment.kind === 'buffCounter'
        ? `${segment.value} / ${segment.maximum}`
        : `${segment.mode}: ${segment.buffId}`;
    return {
      ...segment,
      key:
        segment.kind === 'numeric'
          ? `${segment.operatorId}:numeric:${segment.startFrame}:${segment.value}`
          : segment.kind === 'buffCounter'
            ? `${segment.operatorId}:${segment.counterKey}:${segment.instanceId}:${segment.startFrame}:${segment.value}`
            : `${segment.operatorId}:${segment.buffId}:${segment.instanceId}:${segment.startFrame}`,
      title,
      left,
      top: props.actionTop - UPPER_OFFSET_FROM_ACTION - segment.lane * LANE_PITCH,
      width: Math.max(0, right - left - ICON_SIZE - BAR_GAP * 2),
    };
  }),
);
</script>

<template>
  <div
    v-if="items.length > 0"
    class="timeline-operator-passive-ui-bands"
    aria-label="Operator passive UI timeline"
  >
    <TimelineStatusSegment
      v-for="item in items"
      :key="item.key"
      :left="item.left"
      :top="item.top"
      :width="item.width"
      :title="item.title"
      :count="item.kind === 'numeric' || item.kind === 'buffCounter' ? item.value : null"
      :active="item.kind === 'numeric' && item.active"
    >
      <template #content>
        <OperatorPassiveUiWidget
          :appearance="item.appearance"
          :value="item.kind === 'numeric' || item.kind === 'buffCounter' ? item.value : undefined"
          :maximum="
            item.kind === 'numeric' || item.kind === 'buffCounter' ? item.maximum : undefined
          "
          :active="item.kind === 'numeric' && item.active"
          :mode="item.kind === 'buffProgress' ? item.mode : undefined"
          :height="16"
          :max-width="16"
        />
      </template>
    </TimelineStatusSegment>
  </div>
</template>

<style scoped>
.timeline-operator-passive-ui-bands {
  position: absolute;
  inset: 0;
  z-index: 8;
  overflow: hidden;
  pointer-events: none;
}
</style>
