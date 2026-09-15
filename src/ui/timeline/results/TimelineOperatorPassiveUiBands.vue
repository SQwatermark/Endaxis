<script setup lang="ts">
/** 干员专属 UI 的时间轴生命周期：几何与 Buff 条一致，但保留独立语义。 */
import { computed } from 'vue';
import type { PositionedOperatorPassiveUiTimelineSegment } from '../../../core/projection/operatorPassiveUiTimelineViz';
import OperatorPassiveUiWidget from './OperatorPassiveUiWidget.vue';
import TimelineStatusSegment from './TimelineStatusSegment.vue';
import { frameToTimelinePx } from '../timelineGeometry';
import { timelineUpperBuffTop } from './timelineTrackEffectLayout';

const props = defineProps<{
  segments: readonly PositionedOperatorPassiveUiTimelineSegment[];
  prepFrames: number;
  pxPerFrame: number;
  actionTop: number;
  prepExpanded: boolean;
}>();

const ICON_SIZE = 18;
const BAR_GAP = 2;

const items = computed(() =>
  props.segments.map(segment => {
    const left = frameToTimelinePx(
      segment.startFrame,
      props.prepFrames,
      props.pxPerFrame,
      props.prepExpanded,
    );
    const right = frameToTimelinePx(
      segment.endFrame,
      props.prepFrames,
      props.pxPerFrame,
      props.prepExpanded,
    );
    const title =
      segment.kind === 'numeric'
        ? `${segment.value} / ${segment.maximum}`
        : segment.kind === 'buffProgress'
          ? `${segment.mode}: ${segment.buffId}`
          : `arrows ${segment.battleArrows}/${segment.maximumArrows}; points ${segment.points}/${segment.maximumPoints}`;
    return {
      ...segment,
      key:
        segment.kind === 'numeric'
          ? `${segment.operatorId}:numeric:${segment.startFrame}:${segment.value}`
          : segment.kind === 'buffProgress'
            ? `${segment.operatorId}:${segment.buffId}:${segment.instanceId}:${segment.startFrame}`
            : `${segment.operatorId}:buffCounters:${segment.startFrame}`,
      title,
      left,
      top: timelineUpperBuffTop(segment.lane),
      width: Math.max(0, right - left - ICON_SIZE - BAR_GAP * 2),
    };
  }),
);
</script>

<template>
  <div
    v-if="items.length > 0"
    class="timeline-operator-passive-ui-bands"
    :style="{ '--buff-action-top': `${actionTop}px` }"
    aria-label="Operator passive UI timeline"
  >
    <TimelineStatusSegment
      v-for="item in items"
      :key="item.key"
      :left="item.left"
      :top="item.top"
      :width="item.width"
      :title="item.title"
      :count="item.kind === 'numeric' ? item.value : null"
      :active="item.kind === 'numeric' && item.active"
    >
      <template #content>
        <OperatorPassiveUiWidget
          :appearance="item.appearance"
          :active="item.kind === 'numeric' && item.active"
          :mode="item.kind === 'buffProgress' ? item.mode : undefined"
          :value="
            item.kind === 'buffCounters'
              ? item.battleArrows
              : item.kind === 'numeric'
                ? item.value
                : undefined
          "
          :maximum="
            item.kind === 'buffCounters'
              ? item.maximumArrows
              : item.kind === 'numeric'
                ? item.maximum
                : undefined
          "
          :points="item.kind === 'buffCounters' ? item.points : undefined"
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
  clip-path: inset(2px 0 calc(100% - var(--buff-action-top)) 0);
}
</style>
