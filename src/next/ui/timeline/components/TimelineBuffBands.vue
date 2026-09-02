<script setup lang="ts">
/** 旧版 TimelineBuffLayer 的 Next 只读版本：18px 图标、层数角标和条纹持续条。 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PositionedBuffTimelineSegment } from '../../../core/projection/buffTimelineViz';
import { resolveBuffDisplayName } from '../buffDisplayName';
import { resolveSimpleBuffModifierDisplayName } from '../buffDisplayName';
import type { BuffDetailTarget } from '../buffDetail';
import TimelineStatusSegment from './TimelineStatusSegment.vue';

const props = defineProps<{
  segments: readonly PositionedBuffTimelineSegment[];
  prepFrames: number;
  pxPerFrame: number;
  placement?: 'upper' | 'lower';
  actionTop?: number;
  sourceName?: (source: {
    readonly sourceId?: string;
    readonly sourceActionId?: string;
  }) => string | undefined;
}>();
const { t, te } = useI18n({ useScope: 'global' });
const emit = defineEmits<{
  'open-detail': [target: BuffDetailTarget];
}>();

const ICON_SIZE = 18;
const BAR_GAP = 2;
const LANE_PITCH = 22;
const ACTION_TOP_FALLBACK = 55;
const UPPER_OFFSET_FROM_ACTION = 24;
const LOWER_OFFSET_FROM_ACTION = 55;

const items = computed(() =>
  props.segments.map(segment => {
    const left = (segment.startFrame + props.prepFrames) * props.pxPerFrame;
    const right = (segment.endFrame + props.prepFrames) * props.pxPerFrame;
    const sourceName = props.sourceName?.(segment);
    const modifierSummary = resolveSimpleBuffModifierDisplayName(
      {
        attribute: segment.simpleModifierAttribute,
        slot: segment.simpleModifierSlot,
        value: segment.simpleModifierValue,
      },
      { t, te },
    );
    const title = resolveBuffDisplayName(
      segment.buffId,
      { t, te },
      {
        attribute: segment.simpleModifierAttribute,
        slot: segment.simpleModifierSlot,
        value: segment.simpleModifierValue,
      },
      sourceName,
    );
    const icon = segment.iconPath ?? (segment.iconId ? `/icons/${segment.iconId}.webp` : null);
    return {
      ...segment,
      title,
      key: `${segment.targetId}:${segment.buffId}:${segment.instanceId}:${segment.startFrame}`,
      left,
      top:
        props.placement === 'upper'
          ? (props.actionTop ?? ACTION_TOP_FALLBACK) -
            UPPER_OFFSET_FROM_ACTION -
            segment.lane * LANE_PITCH
          : (props.actionTop ?? ACTION_TOP_FALLBACK) +
            LOWER_OFFSET_FROM_ACTION +
            segment.lane * LANE_PITCH,
      width: Math.max(0, right - left - ICON_SIZE - BAR_GAP * 2),
      icon,
      detail: {
        title,
        buffId: segment.buffId,
        targetId: segment.targetId,
        ...(sourceName === undefined ? {} : { sourceName }),
        startFrame: segment.startFrame,
        endFrame: segment.endFrame,
        layers: segment.layers,
        icon,
        ...(modifierSummary === undefined ? {} : { modifierSummary }),
      } satisfies BuffDetailTarget,
    };
  }),
);
</script>

<template>
  <div v-if="items.length > 0" class="timeline-buff-bands" aria-label="Buff timeline">
    <TimelineStatusSegment
      v-for="item in items"
      :key="item.key"
      :left="item.left"
      :top="item.top"
      :width="item.width"
      :title="item.title"
      :count="item.layers > 1 ? item.layers : null"
      @activate="emit('open-detail', item.detail)"
    >
      <template #content>
        <img v-if="item.icon" :src="item.icon" class="timeline-buff-icon" alt="" />
        <span v-else class="timeline-buff-fallback">+</span>
      </template>
    </TimelineStatusSegment>
  </div>
</template>

<style scoped>
.timeline-buff-bands {
  position: absolute;
  inset: 0;
  z-index: 8;
  overflow: hidden;
  pointer-events: none;
}

.timeline-buff-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.timeline-buff-fallback {
  color: #eef6ff;
  font-size: 10px;
  font-weight: 700;
}
</style>
